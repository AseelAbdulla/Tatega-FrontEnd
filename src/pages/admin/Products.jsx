import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { API_BASE_URL, STORAGE_BASE_URL } from "../../config/env";
import "../../index.css";

const API_URL = API_BASE_URL;

const createTempId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return `temp-${crypto.randomUUID()}`;
    }
    return `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const extractList = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    return [];
};

const isPersistedId = (id) => {
    if (id === null || id === undefined || id === "") return false;
    return /^\d+$/.test(String(id));
};

export default function Products() {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage?.startsWith("en") ? "en" : "ar";
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const emptyForm = {
        category_id: "",
        nameAr: "",
        nameEn: "",
        descriptionAr: "",
        descriptionEn: "",
        sku: "",
        base_price: "",
        has_discount: false,
        discount_price: "",
        stock: "",
        low_stock_threshold: 5,
        status: "active",
        images: [],
        units: [],
    };

    const [form, setForm] = useState(emptyForm);

    const getToken = () => localStorage.getItem("token") || localStorage.getItem("access_token");

    const getHeaders = () => {
        const rawToken = getToken()?.trim().replace(/^Bearer\s+/i, "");
        return {
            Accept: "application/json",
            ...(rawToken ? { Authorization: `Bearer ${rawToken}` } : {}),
        };
    };

    const clearInvalidSession = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("permissions");
    };

    const parseResponse = async (response) => {
        const text = await response.text();
        if (!text) return {};
        try {
            return JSON.parse(text);
        } catch {
            throw new Error(`${t("adminProducts.errors.invalidResponse")}: ${text.substring(0, 200)}`);
        }
    };

    const getApiError = (result) => {
        if (result?.errors) {
            const first = Object.values(result.errors)[0];
            return Array.isArray(first) ? first[0] : String(first);
        }
        return result?.message || t("adminProducts.errors.unknown");
    };

    const getFriendlyError = (error, fallback) => {
        const message = String(error?.message || error || "");
        if (message.includes("Failed to fetch") || message.includes("ERR_CONNECTION_REFUSED") || message.includes("NetworkError")) {
            return t("adminProducts.errors.connection");
        }
        if (message.includes("401") || message.toLowerCase().includes("unauthenticated") || message.toLowerCase().includes("invalid or missing token")) {
            clearInvalidSession();
            return t("adminProducts.errors.session");
        }
        if (message.includes("403")) return t("adminProducts.errors.forbidden");
        if (message.includes("404")) return t("adminProducts.errors.notFound");
        if (message.includes("422")) return t("adminProducts.errors.validation");
        if (message.includes("500")) return t("adminProducts.errors.server");
        return message || fallback;
    };

    const getUnitsTotalStock = (product) => {
        const units = Array.isArray(product?.units) ? product.units : [];
        const total = units.reduce((sum, unit) => sum + Number(unit?.stock ?? 0), 0);
        return total > 0 ? total : Number(product?.stock ?? 0);
    };

    const normalizeProduct = (product) => {
        if (!product) return null;

        let name = product.name;
        if (typeof name === "string") {
            try { name = JSON.parse(name); } catch { name = { ar: name, en: "" }; }
        }

        let description = product.description;
        if (typeof description === "string") {
            try { description = JSON.parse(description); } catch { description = { ar: description, en: "" }; }
        }

        return {
            ...product,
            category_id: product.category_id ?? product.category?.id ?? null,
            name: name || { ar: "", en: "" },
            description: description || { ar: "", en: "" },
            images: product.images || product.product_images || [],
            units: product.units || product.product_units || [],
            base_price: product.base_price ?? product.price ?? 0,
            discount_price: product.discount_price ?? product.discount ?? null,
            has_discount: Boolean(product.has_discount),
            stock: product.stock ?? getUnitsTotalStock(product),
            low_stock_threshold: product.low_stock_threshold ?? 5,
            category: product.category || null,
        };
    };

    const showSuccess = (message) => {
        setSuccess(message);
        window.setTimeout(() => setSuccess(""), 3500);
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(`${API_URL}/products`, {
                method: "GET",
                headers: getHeaders(),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));
            setProducts(extractList(result).map(normalizeProduct).filter(Boolean));
        } catch (err) {
            console.error("Fetch products error:", err);
            setProducts([]);
            setError(getFriendlyError(err, t("adminProducts.errors.load")));
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: "GET",
                headers: getHeaders(),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));
            setCategories(extractList(result));
        } catch (err) {
            console.error("Fetch categories error:", err);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const getProductCategoryId = (product) => product?.category_id ?? product?.category?.id ?? null;

    const getLocalizedValue = (value) => {
        if (!value) return "";
        if (typeof value === "string") return value;
        return value[language] || value.ar || value.en || "";
    };

    const filteredProducts = products.filter((product) => {
        const searchValue = search.toLowerCase().trim();
        const values = [
            product.name?.ar,
            product.name?.en,
            product.sku,
            product.category?.name?.ar,
            product.category?.name?.en,
        ].map((v) => String(v || "").toLowerCase());

        const matchesSearch = values.some((v) => v.includes(searchValue));
        const matchesCategory = selectedCategory === "all" || String(getProductCategoryId(product)) === String(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files || []);
        setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
        e.target.value = "";
    };

    const removeNewImage = (index) => {
        setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const addUnit = () => {
        setForm((prev) => ({
            ...prev,
            units: [...prev.units, { id: createTempId(), nameAr: "", nameEn: "", price: "", stock: 0 }],
        }));
    };

    const handleUnitChange = (unitId, field, value) => {
        setForm((prev) => ({
            ...prev,
            units: prev.units.map((unit) => unit.id === unitId ? { ...unit, [field]: value } : unit),
        }));
    };

    const removeUnit = async (unitId) => {
        const unit = form.units.find((item) => String(item.id) === String(unitId));
        if (!unit) return;

        if (showEditModal && isPersistedId(unit.id)) {
            if (!window.confirm(t("adminProducts.confirmDeleteUnit"))) return;
            try {
                setSaving(true);
                const response = await fetch(`${API_URL}/product-units/${unit.id}`, {
                    method: "DELETE",
                    headers: getHeaders(),
                });
                const result = await parseResponse(response);
                if (!response.ok) throw new Error(getApiError(result));
                setForm((prev) => ({ ...prev, units: prev.units.filter((item) => String(item.id) !== String(unitId)) }));
                setSelectedProduct((prev) => prev ? { ...prev, units: (prev.units || []).filter((item) => String(item.id) !== String(unitId)) } : prev);
                showSuccess(t("adminProducts.messages.unitDeleted"));
            } catch (err) {
                setError(getFriendlyError(err, t("adminProducts.errors.unitDelete")));
            } finally {
                setSaving(false);
            }
            return;
        }

        setForm((prev) => ({ ...prev, units: prev.units.filter((item) => String(item.id) !== String(unitId)) }));
    };

    const buildProductFormData = (includeImages = false) => {
        const fd = new FormData();
        fd.append("category_id", form.category_id);
        fd.append("name_ar", form.nameAr.trim());
        fd.append("name_en", form.nameEn.trim());
        fd.append("description_ar", form.descriptionAr.trim());
        fd.append("description_en", form.descriptionEn.trim());
        fd.append("sku", form.sku.trim());
        fd.append("base_price", form.base_price);
        fd.append("has_discount", form.has_discount ? "1" : "0");
        if (form.has_discount && form.discount_price !== "") fd.append("discount_price", form.discount_price);
        fd.append("stock", form.stock);
        fd.append("low_stock_threshold", form.low_stock_threshold);
        fd.append("status", form.status);

        if (includeImages) {
            form.images.forEach((image) => fd.append("images[]", image));
            const units = form.units.map((unit) => ({
                unit_name: { ar: unit.nameAr?.trim() || "", en: unit.nameEn?.trim() || "" },
                price: unit.price || 0,
                stock: unit.stock || 0,
            }));
            fd.append("units", JSON.stringify(units));
        }
        return fd;
    };

    const openAddModal = () => {
        setError("");
        setSuccess("");
        setSelectedProduct(null);
        setForm({ ...emptyForm, images: [], units: [] });
        setShowAddModal(true);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");
            const response = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: getHeaders(),
                body: buildProductFormData(false),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));

            let newProduct = result.data;
            if (Array.isArray(newProduct)) newProduct = newProduct[0];
            const productId = newProduct?.id;

            if (!productId) {
                throw new Error(t("adminProducts.errors.missingProductId"));
            }

            if (form.images.length) await addProductImages(productId, form.images);
            for (const unit of form.units) {
                if (!unit.nameAr.trim() || !unit.nameEn.trim()) {
                    throw new Error(t("adminProducts.errors.unitNamesRequired"));
                }
                await createProductUnit(productId, unit);
            }

            await fetchProducts();

            setShowAddModal(false);
            setForm({ ...emptyForm });
            showSuccess(t("adminProducts.messages.added"));
        } catch (err) {
            console.error("Add product error:", err);
            setError(getFriendlyError(err, t("adminProducts.errors.add")));
        } finally {
            setSaving(false);
        }
    };

    const openViewModal = (product) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    };

    const openEditModal = async (product) => {
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const response = await fetch(`${API_URL}/products/${product.id}`, {
                method: "GET",
                headers: getHeaders(),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));

            const detailedProduct = normalizeProduct(result.data || result);
            const name = detailedProduct.name || {};
            const description = detailedProduct.description || {};
            const units = Array.isArray(detailedProduct.units) ? detailedProduct.units : [];

            setSelectedProduct(detailedProduct);
            setForm({
                ...emptyForm,
                category_id: detailedProduct.category_id ?? detailedProduct.category?.id ?? "",
                nameAr: name.ar || "",
                nameEn: name.en || "",
                descriptionAr: description.ar || "",
                descriptionEn: description.en || "",
                sku: detailedProduct.sku || "",
                base_price: detailedProduct.base_price ?? "",
                has_discount: Boolean(detailedProduct.has_discount),
                discount_price: detailedProduct.discount_price ?? "",
                stock: detailedProduct.stock ?? "",
                low_stock_threshold: detailedProduct.low_stock_threshold ?? 5,
                status: detailedProduct.status || "active",
                images: [],
                units: units.map((unit) => ({
                    id: unit.id ?? createTempId(),
                    nameAr: unit.unit_name?.ar || unit.nameAr || "",
                    nameEn: unit.unit_name?.en || unit.nameEn || "",
                    price: unit.price ?? "",
                    stock: unit.stock ?? 0,
                })),
            });
            setShowEditModal(true);
        } catch (err) {
            console.error("Load product details error:", err);
            setError(getFriendlyError(err, t("adminProducts.errors.load")));
        } finally {
            setSaving(false);
        }
    };

    const createProductUnit = async (productId, unit) => {
        const response = await fetch(`${API_URL}/product-units`, {
            method: "POST",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({
                product_id: productId,
                unit_name_ar: unit.nameAr.trim(),
                unit_name_en: unit.nameEn.trim(),
                price: unit.price || 0,
                stock: unit.stock || 0,
            }),
        });
        const result = await parseResponse(response);
        if (!response.ok) throw new Error(getApiError(result));
        return result.data || result;
    };

    const updateProductUnit = async (unit) => {
        const response = await fetch(`${API_URL}/product-units/${unit.id}`, {
            method: "PUT",
            headers: { ...getHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({
                product_id: selectedProduct.id,
                unit_name_ar: unit.nameAr.trim(),
                unit_name_en: unit.nameEn.trim(),
                price: unit.price || 0,
                stock: unit.stock || 0,
            }),
        });
        const result = await parseResponse(response);
        if (!response.ok) throw new Error(getApiError(result));
        return result.data || result;
    };

    const addProductImages = async (productId, files) => {
        const created = [];
        for (const file of files) {
            const fd = new FormData();
            fd.append("product_id", productId);
            fd.append("image", file);
            const response = await fetch(`${API_URL}/product-images`, {
                method: "POST",
                headers: getHeaders(),
                body: fd,
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));
            created.push(result.data || result);
        }
        return created;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        try {
            setSaving(true);
            setError("");

            const response = await fetch(`${API_URL}/products/${selectedProduct.id}`, {
                method: "POST",
                headers: getHeaders(),
                body: (() => {
                    const fd = buildProductFormData(false);
                    fd.append("_method", "PUT");
                    return fd;
                })(),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));

            const createdImages = form.images.length
                ? await addProductImages(selectedProduct.id, form.images)
                : [];

            const originalUnits = Array.isArray(selectedProduct.units) ? selectedProduct.units : [];
            const originalIds = new Set(originalUnits.map((unit) => String(unit.id)));
            const currentPersistedIds = new Set(form.units.filter((unit) => isPersistedId(unit.id)).map((unit) => String(unit.id)));

            for (const originalUnit of originalUnits) {
                if (isPersistedId(originalUnit.id) && !currentPersistedIds.has(String(originalUnit.id))) {
                    const deleteResponse = await fetch(`${API_URL}/product-units/${originalUnit.id}`, {
                        method: "DELETE",
                        headers: getHeaders(),
                    });
                    const deleteResult = await parseResponse(deleteResponse);
                    if (!deleteResponse.ok) throw new Error(getApiError(deleteResult));
                }
            }

            const savedUnits = [];
            for (const unit of form.units) {
                if (!unit.nameAr.trim() || !unit.nameEn.trim()) {
                    throw new Error(t("adminProducts.errors.unitNamesRequired"));
                }
                if (isPersistedId(unit.id) && originalIds.has(String(unit.id))) {
                    savedUnits.push(await updateProductUnit(unit));
                } else {
                    savedUnits.push(await createProductUnit(selectedProduct.id, unit));
                }
            }

            let updatedProduct = result.data;
            if (Array.isArray(updatedProduct)) updatedProduct = updatedProduct[0];

            await fetchProducts();

            setShowEditModal(false);
            setSelectedProduct(null);
            setForm({ ...emptyForm });

            showSuccess(`${t("adminProducts.messages.updated")}${createdImages.length ? t("adminProducts.messages.imagesAdded", { count: createdImages.length }) : ""}`);
        } catch (err) {
            console.error("Update product error:", err);
            setError(getFriendlyError(err, t("adminProducts.errors.update")));
        } finally {
            setSaving(false);
        }
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setError("");
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;
        try {
            setSaving(true);
            setError("");
            const response = await fetch(`${API_URL}/products/${selectedProduct.id}`, {
                method: "DELETE",
                headers: getHeaders(),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));
            setProducts((prev) => prev.filter((product) => product.id !== selectedProduct.id));
            setShowDeleteModal(false);
            setSelectedProduct(null);
            showSuccess(t("adminProducts.messages.deleted"));
        } catch (err) {
            console.error("Delete product error:", err);
            setError(getFriendlyError(err, t("adminProducts.errors.delete")));
        } finally {
            setSaving(false);
        }
    };

    const getImageUrl = (image) => {
        if (!image) return "";
        if (image.image) return image.image;
        if (image.image_url) return image.image_url;
        if (image.url) return image.url;
        if (!image.image_path) return "";
        if (image.image_path.startsWith("http")) return image.image_path;
        const path = image.image_path.startsWith("/") ? image.image_path : `/${image.image_path}`;
        return `${STORAGE_BASE_URL}${path}`;
    };

    const getProductImage = (product) => {
        if (product?.main_image) return product.main_image;
        const images = Array.isArray(product?.images) ? product.images : [];
        if (!images.length) return null;
        const main = images.find((image) => image.is_main === true || image.is_main === 1 || image.is_main === "1");
        return getImageUrl(main || images[0]);
    };

    const getCategoryName = (product) => getLocalizedValue(
        product.category?.name ||
        categories.find((category) => String(category.id) === String(product.category_id))?.name
    ) || "-";

    const getDisplayPrice = (product) => product.has_discount && product.discount_price ? product.discount_price : product.base_price;

    const setMainImage = async (imageId) => {
        if (!selectedProduct || !imageId) return;
        try {
            setSaving(true);
            setError("");
            const response = await fetch(`${API_URL}/product-images/${imageId}`, {
                method: "PUT",
                headers: { ...getHeaders(), "Content-Type": "application/json" },
                body: JSON.stringify({ is_main: true }),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));

            const refreshed = await fetch(`${API_URL}/products/${selectedProduct.id}`, {
                method: "GET",
                headers: getHeaders(),
            });
            const refreshedResult = await parseResponse(refreshed);
            if (!refreshed.ok) throw new Error(getApiError(refreshedResult));
            const data = refreshedResult.data || refreshedResult;
            const product = normalizeProduct(Array.isArray(data) ? data[0] : data);
            setSelectedProduct(product);
            setProducts((prev) => prev.map((item) => item.id === product.id ? product : item));
            showSuccess(t("adminProducts.messages.mainImageChanged"));
        } catch (err) {
            console.error("Set main image error:", err);
            setError(getFriendlyError(err, t("adminProducts.errors.mainImage")));
        } finally {
            setSaving(false);
        }
    };

    const deleteProductImage = async (image) => {
        if (!selectedProduct || !image?.id) return;
        const wasMain = image.is_main === true || image.is_main === 1 || image.is_main === "1";
        if (!window.confirm(wasMain ? t("adminProducts.confirmDeleteMainImage") : t("adminProducts.confirmDeleteImage"))) return;

        try {
            setSaving(true);
            setError("");
            const response = await fetch(`${API_URL}/product-images/${image.id}`, {
                method: "DELETE",
                headers: getHeaders(),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));

            const refreshed = await fetch(`${API_URL}/products/${selectedProduct.id}`, {
                method: "GET",
                headers: getHeaders(),
            });
            const refreshedResult = await parseResponse(refreshed);
            if (!refreshed.ok) throw new Error(getApiError(refreshedResult));
            const data = refreshedResult.data || refreshedResult;
            const product = normalizeProduct(Array.isArray(data) ? data[0] : data);
            setSelectedProduct(product);
            setProducts((prev) => prev.map((item) => item.id === product.id ? product : item));
            showSuccess(wasMain ? t("adminProducts.messages.mainImageDeleted") : t("adminProducts.messages.imageDeleted"));
        } catch (err) {
            console.error("Delete image error:", err);
            setError(getFriendlyError(err, t("adminProducts.errors.imageDelete")));
        } finally {
            setSaving(false);
        }
    };

    const closeAddModal = () => {
        if (saving) return;
        setShowAddModal(false);
        setError("");
    };

    const closeEditModal = () => {
        if (saving) return;
        setShowEditModal(false);
        setSelectedProduct(null);
        setError("");
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedProduct(null);
    };

    const closeDeleteModal = () => {
        if (saving) return;
        setShowDeleteModal(false);
        setSelectedProduct(null);
        setError("");
    };

    const renderProductForm = ({
        form,
        error,
        onSubmit,
        submitText,
        handleChange,
        handleImagesChange,
        removeNewImage,
        addUnit,
        removeUnit,
        handleUnitChange,
        showEditModal,
        selectedProduct,
        closeEditModal,
        closeAddModal,
        categories,
        saving,
        setMainImage,
        deleteProductImage,
    }) => (
        <form onSubmit={onSubmit} className="product-form">
            {error && <div className="product-error">{error}</div>}

            <div className="product-section">
                <h4>{t("adminProducts.info")}</h4>
                <div className="product-form-grid">
                    <div className="product-form-group">
                        <label>{t("adminProducts.nameAr")}</label>
                        <input type="text" name="nameAr" value={form.nameAr} onChange={handleChange} placeholder={t("adminProducts.nameArPlaceholder")} required />
                    </div>
                    <div className="product-form-group">
                        <label>{t("adminProducts.nameEn")}</label>
                        <input type="text" name="nameEn" value={form.nameEn} onChange={handleChange} placeholder="Enter product name" required />
                    </div>
                    <div className="product-form-group">
                        <label>{t("adminProducts.skuRequired")}</label>
                        <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder={t("adminProducts.skuPlaceholder")} autoComplete="off" required />
                    </div>
                    <div className="product-form-group">
                        <label>{t("adminProducts.category")} *</label>
                        <select name="category_id" value={form.category_id} onChange={handleChange} required>
                            <option value="">{t("adminProducts.chooseCategory")}</option>
                            {categories.map((category) => <option key={category.id} value={category.id}>{getLocalizedValue(category.name) || "-"}</option>)}
                        </select>
                    </div>
                    <div className="product-form-group product-full">
                        <label>{t("adminProducts.descriptionAr")}</label>
                        <textarea name="descriptionAr" value={form.descriptionAr} onChange={handleChange} rows="3" />
                    </div>
                    <div className="product-form-group product-full">
                        <label>{t("adminProducts.descriptionEn")}</label>
                        <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} rows="3" />
                    </div>
                </div>
            </div>

            <div className="product-section">
                <h4>{t("adminProducts.pricesStock")}</h4>
                <div className="product-form-grid">
                    <div className="product-form-group">
                        <label>{t("adminProducts.basePrice")} *</label>
                        <input type="number" step="0.01" min="0" name="base_price" value={form.base_price} onChange={handleChange} required />
                    </div>
                    <div className="product-form-group">
                        <label>{t("adminProducts.stockRequired")}</label>
                        <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} required />
                    </div>
                    <div className="product-form-group">
                        <label>{t("adminProducts.lowStockThreshold")}</label>
                        <input type="number" min="0" name="low_stock_threshold" value={form.low_stock_threshold} onChange={handleChange} />
                    </div>
                    <div className="product-form-group">
                        <label>{t("adminProducts.status")}</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            <option value="active">{t("adminProducts.active")}</option>
                            <option value="inactive">{t("adminProducts.inactive")}</option>
                        </select>
                    </div>
                    <div className="product-discount">
                        <label className="discount-checkbox">
                            <input type="checkbox" name="has_discount" checked={form.has_discount} onChange={handleChange} />
                            <span>{t("adminProducts.discount")}</span>
                        </label>
                        {form.has_discount && <div className="product-form-group"><label>{t("adminProducts.discountPriceField")}</label><input type="number" step="0.01" min="0" name="discount_price" value={form.discount_price} onChange={handleChange} /></div>}
                    </div>
                </div>
            </div>

            <div className="product-section">
                <h4>{t("adminProducts.images")}</h4>
                <div className="product-form-group">
                    <label>{showEditModal ? t("adminProducts.addNewImages") : t("adminProducts.addImages")}</label>
                    <input type="file" accept="image/*" multiple onChange={handleImagesChange} />
                </div>

                {form.images.length > 0 && (
                    <div className="selected-images">
                        {form.images.map((image, index) => (
                            <div className="selected-image" key={`new-image-${index}`}>
                                <img src={URL.createObjectURL(image)} alt="" />
                                <button type="button" onClick={() => removeNewImage(index)}>×</button>
                            </div>
                        ))}
                    </div>
                )}

                {showEditModal && selectedProduct?.images?.length > 0 && (
                    <div className="existing-images">
                        <p>{t("adminProducts.currentImages")}</p>
                        <div className="selected-images">
                            {selectedProduct.images.map((image) => {
                                const main = image.is_main === true || image.is_main === 1 || image.is_main === "1";
                                return (
                                    <div className={`selected-image ${main ? "main-image-selected" : ""}`} key={image.id}>
                                        <img src={getImageUrl(image)} alt="" />
                                        {main && <span className="main-image-badge">⭐ {t("adminProducts.mainImage")}</span>}
                                        <div className="existing-image-actions">
                                            {!main && <button type="button" title={t("adminProducts.makeMain")} disabled={saving} onClick={() => setMainImage(image.id)}>⭐</button>}
                                            {main && <button type="button" title={t("adminProducts.mainImage")} disabled>⭐</button>}
                                            <button type="button" title={t("adminProducts.deleteImage")} disabled={saving} onClick={() => deleteProductImage(image)}>🗑</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="product-section">
                <div className="product-section-header">
                    <h4>{t("adminProducts.productUnits")}</h4>
                    <button type="button" className="add-unit-button" onClick={addUnit} disabled={saving}>
                        <span className="material-symbols-outlined">add</span> {t("adminProducts.addUnit")}
                    </button>
                </div>

                {form.units.length === 0 && <div className="no-units">{t("adminProducts.noUnitsHint")}</div>}

                {form.units.map((unit) => (
                    <div className="unit-row" key={unit.id}>
                        <div className="product-form-group">
                            <label>{t("adminProducts.unitNameAr")}</label>
                            <input type="text" value={unit.nameAr} onChange={(e) => handleUnitChange(unit.id, "nameAr", e.target.value)} placeholder={t("adminProducts.unitArPlaceholder")} required />
                        </div>
                        <div className="product-form-group">
                            <label>{t("adminProducts.unitNameEn")}</label>
                            <input type="text" value={unit.nameEn} onChange={(e) => handleUnitChange(unit.id, "nameEn", e.target.value)} placeholder="500 g" required />
                        </div>
                        <div className="product-form-group">
                            <label>{t("adminProducts.unitPrice")}</label>
                            <input type="number" step="0.01" min="0" value={unit.price} onChange={(e) => handleUnitChange(unit.id, "price", e.target.value)} required />
                        </div>
                        <div className="product-form-group">
                            <label>{t("adminProducts.unitStock")}</label>
                            <input type="number" min="0" value={unit.stock} onChange={(e) => handleUnitChange(unit.id, "stock", e.target.value)} />
                        </div>
                        <button type="button" className="remove-unit-button" onClick={() => removeUnit(unit.id)} disabled={saving} title={t("adminProducts.delete")}>
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="product-modal-actions">
                <button type="button" className="product-cancel-button" onClick={showEditModal ? closeEditModal : closeAddModal} disabled={saving}>{t("adminProducts.cancel")}</button>
                <button type="submit" className="product-save-button" disabled={saving}>{saving ? t("adminProducts.saving") : submitText}</button>
            </div>
        </form>
    );

    return (
        <div className="products-page">
            <div className="products-heading">
                <div><h1>{t("adminProducts.title")}</h1><p>{t("adminProducts.subtitle")}</p></div>
                <button type="button" className="product-add-button" onClick={openAddModal}><span className="material-symbols-outlined">add</span> {t("adminProducts.addProduct")}</button>
            </div>

            {!showAddModal && !showEditModal && !showDeleteModal && error && <div className="product-error">{error}</div>}
            {success && <div className="product-success"><span className="material-symbols-outlined">check_circle</span>{success}</div>}

            <div className="products-toolbar">
                <div className="product-search">
                    <span className="material-symbols-outlined">search</span>
                    <input type="text" placeholder={t("adminProducts.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="product-category-filter">
                    <button type="button" className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>{t("adminProducts.allCategories")}</button>
                    {categories.map((category) => <button type="button" key={category.id} className={String(selectedCategory) === String(category.id) ? "active" : ""} onClick={() => setSelectedCategory(category.id)}>{getLocalizedValue(category.name)}</button>)}
                </div>
            </div>

            <div className="products-grid">
                {loading ? <div className="products-empty">{t("adminProducts.loading")}</div> : filteredProducts.length > 0 ? filteredProducts.map((product) => {
                    const image = getProductImage(product);
                    const price = getDisplayPrice(product);
                    const totalStock = getUnitsTotalStock(product);
                    const isLowStock = Number(totalStock) <= Number(product.low_stock_threshold ?? 5);
                    return (
                        <div className={`product-card ${isLowStock ? "low-stock" : ""}`} key={product.id}>
                            <div className="product-image-wrapper">
                                {image ? <img src={image} alt={product.name?.ar || "Product"} onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <div className="product-no-image"><span className="material-symbols-outlined">inventory_2</span></div>}
                                <span className="product-category-badge">{getCategoryName(product)}</span>
                                {isLowStock && <span className="product-low-stock-badge"><span className="material-symbols-outlined">warning</span> {t("adminProducts.lowStock")}</span>}
                                <div className="product-actions">
                                    <button type="button" title={t("adminProducts.view")} onClick={() => openViewModal(product)}><span className="material-symbols-outlined">visibility</span></button>
                                    <button type="button" title={t("adminProducts.edit")} onClick={() => openEditModal(product)}><span className="material-symbols-outlined">edit</span></button>
                                    <button type="button" title={t("adminProducts.delete")} onClick={() => openDeleteModal(product)}><span className="material-symbols-outlined">delete</span></button>
                                </div>
                            </div>
                            <div className="product-card-body">
                                <h3>{getLocalizedValue(product.name)}</h3>
                                <small>{getLocalizedValue(product.name?.[language === "ar" ? "en" : "ar"])}</small>
                                <div className="product-price-row">
                                    <div><span className="product-price">{price}</span>{product.has_discount && product.discount_price && <span className="product-old-price">{product.base_price}</span>}</div>
                                    <div className="product-stock"><span>{t("adminProducts.stock")}</span><strong className={isLowStock ? "danger" : ""}>{totalStock}</strong></div>
                                </div>
                                <div className="product-sku">{t("adminProducts.sku")}: {product.sku}</div>
                            </div>
                        </div>
                    );
                }) : <div className="products-empty">{t("adminProducts.empty")}</div>}

                <button type="button" className="product-add-card" onClick={openAddModal}>
                    <div><span className="material-symbols-outlined">add</span></div>
                    <strong>{t("adminProducts.addProductCard")}</strong><span>{t("adminProducts.expandCollection")}</span>
                </button>
            </div>

            {(showAddModal || showEditModal) && (
                <div className="product-modal-overlay" onClick={showEditModal ? closeEditModal : closeAddModal}>
                    <div className="product-modal product-form-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="product-modal-header">
                            <h3>{showEditModal ? t("adminProducts.editTitle") : t("adminProducts.addTitle")}</h3>
                            <button type="button" onClick={showEditModal ? closeEditModal : closeAddModal} disabled={saving}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {renderProductForm({
                            form: form,
                            error: error,
                            onSubmit: showEditModal ? handleUpdate : handleAdd,
                            submitText: showEditModal ? t("adminProducts.saveChanges") : t("adminProducts.addProduct"),
                            handleChange: handleChange,
                            handleImagesChange: handleImagesChange,
                            removeNewImage: removeNewImage,
                            addUnit: addUnit,
                            removeUnit: removeUnit,
                            handleUnitChange: handleUnitChange,
                            showEditModal: showEditModal,
                            selectedProduct: selectedProduct,
                            closeEditModal: closeEditModal,
                            closeAddModal: closeAddModal,
                            categories: categories,
                            saving: saving,
                            setMainImage: setMainImage,
                            deleteProductImage: deleteProductImage,
                        })}
                    </div>
                </div>
            )}

            {showViewModal && selectedProduct && (
                <div className="product-modal-overlay" onClick={closeViewModal}>
                    <div className="product-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="product-modal-header"><h3>{t("adminProducts.details")}</h3><button type="button" onClick={closeViewModal}><span className="material-symbols-outlined">close</span></button></div>
                        <div className="product-details">
                            <div><strong>{t("adminProducts.name")}</strong><span>{getLocalizedValue(selectedProduct.name)}</span></div>
                            <div><strong>{t("adminProducts.englishName")}</strong><span>{getLocalizedValue(selectedProduct.name?.[language === "ar" ? "en" : "ar"])}</span></div>
                            <div><strong>{t("adminProducts.sku")}</strong><span>{selectedProduct.sku}</span></div>
                            <div><strong>{t("adminProducts.category")}</strong><span>{getCategoryName(selectedProduct)}</span></div>
                            <div><strong>{t("adminProducts.basePrice")}</strong><span>{selectedProduct.base_price}</span></div>
                            <div><strong>{t("adminProducts.discountPrice")}</strong><span>{selectedProduct.discount_price || "-"}</span></div>
                            <div><strong>{t("adminProducts.stock")}</strong><span>{getUnitsTotalStock(selectedProduct)}</span></div>
                            <div><strong>{t("adminProducts.status")}</strong><span>{selectedProduct.status}</span></div>
                            <div className="full"><strong>{t("adminProducts.description")}</strong><span>{getLocalizedValue(selectedProduct.description) || t("adminProducts.noDescription")}</span></div>
                        </div>

                        <div className="view-images">
                            <h4>{t("adminProducts.images")}</h4>
                            {selectedProduct.images?.length ? <div className="selected-images">
                                {selectedProduct.images.map((image) => <div className="selected-image" key={image.id}><img src={getImageUrl(image)} alt="" />{(image.is_main === true || image.is_main === 1 || image.is_main === "1") && <span className="main-image-badge">⭐ {t("adminProducts.mainImage")}</span>}</div>)}
                            </div> : <p>{t("adminProducts.noImages")}</p>}
                        </div>

                        <div className="view-units">
                            <h4>{t("adminProducts.units")}</h4>
                            {selectedProduct.units?.length ? selectedProduct.units.map((unit) => <div className="view-unit" key={unit.id}><span>{getLocalizedValue(unit.unit_name)}</span><strong>{unit.price}</strong><small>{t("adminProducts.unitStockLabel", { stock: unit.stock })}</small></div>) : <p>{t("adminProducts.noUnits")}</p>}
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedProduct && (
                <div className="product-modal-overlay" onClick={closeDeleteModal}>
                    <div className="product-delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon"><span className="material-symbols-outlined">warning</span></div>
                        <h3>{t("adminProducts.deleteProduct")}</h3>
                        <p>{t("adminProducts.confirmDelete", { name: getLocalizedValue(selectedProduct.name) })}</p>
                        {error && <div className="product-error">{error}</div>}
                        <div className="product-modal-actions">
                            <button type="button" className="product-cancel-button" onClick={closeDeleteModal} disabled={saving}>{t("adminProducts.cancel")}</button>
                            <button type="button" className="product-delete-confirm" onClick={handleDelete} disabled={saving}>{saving ? t("adminProducts.saving") : t("adminProducts.confirm")}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}