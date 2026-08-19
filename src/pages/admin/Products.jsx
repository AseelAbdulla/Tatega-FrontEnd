import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
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
        const rawToken = getToken()?.trim();
        const tokenType = localStorage.getItem("token_type")?.trim() || "Bearer";
        const tokenWithType = rawToken?.match(/^(\S+)\s+(.+)$/);
        const authorization = tokenWithType ? rawToken : rawToken ? `${tokenType} ${rawToken}` : null;
        return {
            Accept: "application/json",
            ...(authorization ? { Authorization: authorization } : {}),
        };
    };

    const parseResponse = async (response) => {
        const text = await response.text();
        if (!text) return {};
        try {
            return JSON.parse(text);
        } catch {
            throw new Error(`الخادم رجع استجابة غير صحيحة: ${text.substring(0, 200)}`);
        }
    };

    const getApiError = (result) => {
        if (result?.errors) {
            const first = Object.values(result.errors)[0];
            return Array.isArray(first) ? first[0] : String(first);
        }
        return result?.message || "حدث خطأ غير معروف";
    };

    const getFriendlyError = (error, fallback) => {
        const message = String(error?.message || error || "");
        if (message.includes("Failed to fetch") || message.includes("ERR_CONNECTION_REFUSED") || message.includes("NetworkError")) {
            return "تعذر الاتصال بالخادم. تأكد من تشغيل Laravel والمحاولة مرة أخرى.";
        }
        if (message.includes("401")) return "جلسة المستخدم منتهية، يرجى تسجيل الدخول مرة أخرى.";
        if (message.includes("403")) return "لا توجد صلاحية للوصول إلى هذا القسم.";
        if (message.includes("404")) return "العنصر المطلوب غير موجود.";
        if (message.includes("422")) return "بيانات غير صالحة، يرجى مراجعة الحقول المطلوبة.";
        if (message.includes("500")) return "حدث خطأ في الخادم، حاول لاحقًا.";
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
            setError(getFriendlyError(err, "فشل في تحميل المنتجات"));
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
            if (!window.confirm("هل تريد حذف هذه الوحدة نهائيًا؟")) return;
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
                showSuccess("تم حذف الوحدة بنجاح");
            } catch (err) {
                setError(getFriendlyError(err, "فشل في حذف الوحدة"));
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
        navigate("/admin/products/create");
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError("");
            const response = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: getHeaders(),
                body: buildProductFormData(true),
            });
            const result = await parseResponse(response);
            if (!response.ok) throw new Error(getApiError(result));

            let newProduct = result.data;
            if (Array.isArray(newProduct)) newProduct = newProduct[0];
            if (newProduct) {
                setProducts((prev) => [...prev, normalizeProduct(newProduct)]);
            } else {
                await fetchProducts();
            }

            setShowAddModal(false);
            setForm({ ...emptyForm });
            showSuccess("تم إضافة المنتج بنجاح");
        } catch (err) {
            console.error("Add product error:", err);
            setError(getFriendlyError(err, "فشل في إضافة المنتج"));
        } finally {
            setSaving(false);
        }
    };

    const openViewModal = (product) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    };

    const openEditModal = (product) => {
        setError("");
        setSuccess("");
        navigate(`/admin/products/${product.id}/edit`);
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
                    throw new Error("اسم الوحدة بالعربي والإنجليزي مطلوب.");
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

            const imageMessage = createdImages.length ? ` وتمت إضافة ${createdImages.length} صورة` : "";
            showSuccess(`تم تعديل المنتج بنجاح${imageMessage}`);
        } catch (err) {
            console.error("Update product error:", err);
            setError(getFriendlyError(err, "فشل في تعديل المنتج"));
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
            showSuccess("تم حذف المنتج بنجاح");
        } catch (err) {
            console.error("Delete product error:", err);
            setError(getFriendlyError(err, "فشل في حذف المنتج"));
        } finally {
            setSaving(false);
        }
    };

    const getImageUrl = (image) => {
        if (!image) return "";
        if (image.image_url) return image.image_url;
        if (image.url) return image.url;
        if (!image.image_path) return "";
        if (image.image_path.startsWith("http")) return image.image_path;
        const path = image.image_path.startsWith("/") ? image.image_path : `/${image.image_path}`;
        return `${STORAGE_BASE_URL}${path}`;
    };

    const getProductImage = (product) => {
        const images = Array.isArray(product?.images) ? product.images : [];
        if (!images.length) return null;
        const main = images.find((image) => image.is_main === true || image.is_main === 1 || image.is_main === "1");
        return getImageUrl(main || images[0]);
    };

    const getCategoryName = (product) => (
        product.category?.name?.ar ||
        categories.find((category) => String(category.id) === String(product.category_id))?.name?.ar ||
        "-"
    );

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
            showSuccess("تم تغيير الصورة الرئيسية");
        } catch (err) {
            console.error("Set main image error:", err);
            setError(getFriendlyError(err, "فشل في تغيير الصورة الرئيسية"));
        } finally {
            setSaving(false);
        }
    };

    const deleteProductImage = async (image) => {
        if (!selectedProduct || !image?.id) return;
        const wasMain = image.is_main === true || image.is_main === 1 || image.is_main === "1";
        if (!window.confirm(wasMain ? "هذه هي الصورة الرئيسية. سيتم اختيار صورة بديلة تلقائيًا. هل تريد حذفها؟" : "هل تريد حذف هذه الصورة؟")) return;

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
            showSuccess(wasMain ? "تم حذف الصورة الرئيسية واختيار صورة بديلة" : "تم حذف الصورة");
        } catch (err) {
            console.error("Delete image error:", err);
            setError(getFriendlyError(err, "فشل في حذف الصورة"));
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

    const ProductForm = ({
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
                <h4>معلومات المنتج</h4>
                <div className="product-form-grid">
                    <div className="product-form-group">
                        <label>اسم المنتج بالعربي *</label>
                        <input type="text" name="nameAr" value={form.nameAr} onChange={handleChange} placeholder="اكتب الاسم بالعربي" required />
                    </div>
                    <div className="product-form-group">
                        <label>اسم المنتج بالإنجليزي *</label>
                        <input type="text" name="nameEn" value={form.nameEn} onChange={handleChange} placeholder="Enter product name" required />
                    </div>
                    <div className="product-form-group">
                        <label>كود المنتج *</label>
                        <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="مثال: HON-001" autoComplete="off" required />
                    </div>
                    <div className="product-form-group">
                        <label>التصنيف *</label>
                        <select name="category_id" value={form.category_id} onChange={handleChange} required>
                            <option value="">اختر التصنيف</option>
                            {categories.map((category) => <option key={category.id} value={category.id}>{category.name?.ar || "-"}</option>)}
                        </select>
                    </div>
                    <div className="product-form-group product-full">
                        <label>الوصف بالعربي</label>
                        <textarea name="descriptionAr" value={form.descriptionAr} onChange={handleChange} rows="3" />
                    </div>
                    <div className="product-form-group product-full">
                        <label>الوصف بالإنجليزي</label>
                        <textarea name="descriptionEn" value={form.descriptionEn} onChange={handleChange} rows="3" />
                    </div>
                </div>
            </div>

            <div className="product-section">
                <h4>الأسعار والمخزون</h4>
                <div className="product-form-grid">
                    <div className="product-form-group">
                        <label>السعر الأساسي *</label>
                        <input type="number" step="0.01" min="0" name="base_price" value={form.base_price} onChange={handleChange} required />
                    </div>
                    <div className="product-form-group">
                        <label>المخزون *</label>
                        <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} required />
                    </div>
                    <div className="product-form-group">
                        <label>حد المخزون المنخفض</label>
                        <input type="number" min="0" name="low_stock_threshold" value={form.low_stock_threshold} onChange={handleChange} />
                    </div>
                    <div className="product-form-group">
                        <label>الحالة</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                            <option value="draft">مسودة</option>
                        </select>
                    </div>
                    <div className="product-discount">
                        <label className="discount-checkbox">
                            <input type="checkbox" name="has_discount" checked={form.has_discount} onChange={handleChange} />
                            <span>يوجد خصم</span>
                        </label>
                        {form.has_discount && <div className="product-form-group"><label>سعر الخصم</label><input type="number" step="0.01" min="0" name="discount_price" value={form.discount_price} onChange={handleChange} /></div>}
                    </div>
                </div>
            </div>

            <div className="product-section">
                <h4>صور المنتج</h4>
                <div className="product-form-group">
                    <label>{showEditModal ? "إضافة صور جديدة" : "إضافة صور"}</label>
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
                        <p>الصور الحالية</p>
                        <div className="selected-images">
                            {selectedProduct.images.map((image) => {
                                const main = image.is_main === true || image.is_main === 1 || image.is_main === "1";
                                return (
                                    <div className={`selected-image ${main ? "main-image-selected" : ""}`} key={image.id}>
                                        <img src={getImageUrl(image)} alt="" />
                                        {main && <span className="main-image-badge">⭐ الرئيسية</span>}
                                        <div className="existing-image-actions">
                                            {!main && <button type="button" title="جعلها الرئيسية" disabled={saving} onClick={() => setMainImage(image.id)}>⭐</button>}
                                            {main && <button type="button" title="الصورة الرئيسية" disabled>⭐</button>}
                                            <button type="button" title="حذف الصورة" disabled={saving} onClick={() => deleteProductImage(image)}>🗑</button>
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
                    <h4>وحدات المنتج</h4>
                    <button type="button" className="add-unit-button" onClick={addUnit} disabled={saving}>
                        <span className="material-symbols-outlined">add</span> إضافة وحدة
                    </button>
                </div>

                {form.units.length === 0 && <div className="no-units">لم تتم إضافة وحدات. يمكنك إضافة وحدة مثل: 500 جم، 1 كجم، 1 لتر.</div>}

                {form.units.map((unit) => (
                    <div className="unit-row" key={unit.id}>
                        <div className="product-form-group">
                            <label>اسم الوحدة عربي *</label>
                            <input type="text" value={unit.nameAr} onChange={(e) => handleUnitChange(unit.id, "nameAr", e.target.value)} placeholder="500 جم" required />
                        </div>
                        <div className="product-form-group">
                            <label>اسم الوحدة إنجليزي *</label>
                            <input type="text" value={unit.nameEn} onChange={(e) => handleUnitChange(unit.id, "nameEn", e.target.value)} placeholder="500 g" required />
                        </div>
                        <div className="product-form-group">
                            <label>السعر *</label>
                            <input type="number" step="0.01" min="0" value={unit.price} onChange={(e) => handleUnitChange(unit.id, "price", e.target.value)} required />
                        </div>
                        <div className="product-form-group">
                            <label>المخزون</label>
                            <input type="number" min="0" value={unit.stock} onChange={(e) => handleUnitChange(unit.id, "stock", e.target.value)} />
                        </div>
                        <button type="button" className="remove-unit-button" onClick={() => removeUnit(unit.id)} disabled={saving} title="حذف الوحدة">
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="product-modal-actions">
                <button type="button" className="product-cancel-button" onClick={showEditModal ? closeEditModal : closeAddModal} disabled={saving}>إلغاء</button>
                <button type="submit" className="product-save-button" disabled={saving}>{saving ? "جاري الحفظ..." : submitText}</button>
            </div>
        </form>
    );

    return (
        <div className="products-page">
            <div className="products-heading">
                <div><h1>إدارة المنتجات</h1><p>إدارة منتجات متجر تقية</p></div>
                <button type="button" className="product-add-button" onClick={openAddModal}><span className="material-symbols-outlined">add</span> إضافة منتج</button>
            </div>

            {!showAddModal && !showEditModal && !showDeleteModal && error && <div className="product-error">{error}</div>}
            {success && <div className="product-success"><span className="material-symbols-outlined">check_circle</span>{success}</div>}

            <div className="products-toolbar">
                <div className="product-search">
                    <span className="material-symbols-outlined">search</span>
                    <input type="text" placeholder="بحث عن منتج..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="product-category-filter">
                    <button type="button" className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>الكل</button>
                    {categories.map((category) => <button type="button" key={category.id} className={String(selectedCategory) === String(category.id) ? "active" : ""} onClick={() => setSelectedCategory(category.id)}>{category.name?.ar}</button>)}
                </div>
            </div>

            <div className="products-grid">
                {loading ? <div className="products-empty">جاري تحميل المنتجات...</div> : filteredProducts.length > 0 ? filteredProducts.map((product) => {
                    const image = getProductImage(product);
                    const price = getDisplayPrice(product);
                    const totalStock = getUnitsTotalStock(product);
                    const isLowStock = Number(totalStock) <= Number(product.low_stock_threshold ?? 5);
                    return (
                        <div className={`product-card ${isLowStock ? "low-stock" : ""}`} key={product.id}>
                            <div className="product-image-wrapper">
                                {image ? <img src={image} alt={product.name?.ar || "Product"} onError={(e) => { e.currentTarget.style.display = "none"; }} /> : <div className="product-no-image"><span className="material-symbols-outlined">inventory_2</span></div>}
                                <span className="product-category-badge">{getCategoryName(product)}</span>
                                {isLowStock && <span className="product-low-stock-badge"><span className="material-symbols-outlined">warning</span> منخفض</span>}
                                <div className="product-actions">
                                    <button type="button" title="عرض" onClick={() => openViewModal(product)}><span className="material-symbols-outlined">visibility</span></button>
                                    <button type="button" title="تعديل" onClick={() => openEditModal(product)}><span className="material-symbols-outlined">edit</span></button>
                                    <button type="button" title="حذف" onClick={() => openDeleteModal(product)}><span className="material-symbols-outlined">delete</span></button>
                                </div>
                            </div>
                            <div className="product-card-body">
                                <h3>{product.name?.ar}</h3>
                                <small>{product.name?.en}</small>
                                <div className="product-price-row">
                                    <div><span className="product-price">{price}</span>{product.has_discount && product.discount_price && <span className="product-old-price">{product.base_price}</span>}</div>
                                    <div className="product-stock"><span>المخزون</span><strong className={isLowStock ? "danger" : ""}>{totalStock}</strong></div>
                                </div>
                                <div className="product-sku">كود المنتج: {product.sku}</div>
                            </div>
                        </div>
                    );
                }) : <div className="products-empty">لا توجد منتجات</div>}

                <button type="button" className="product-add-card" onClick={openAddModal}>
                    <div><span className="material-symbols-outlined">add</span></div>
                    <strong>أضف منتجاً</strong><span>قم بتوسيع مجموعتك</span>
                </button>
            </div>

            {showViewModal && selectedProduct && (
                <div className="product-modal-overlay" onClick={closeViewModal}>
                    <div className="product-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="product-modal-header"><h3>تفاصيل المنتج</h3><button type="button" onClick={closeViewModal}><span className="material-symbols-outlined">close</span></button></div>
                        <div className="product-details">
                            <div><strong>الاسم</strong><span>{selectedProduct.name?.ar}</span></div>
                            <div><strong>الاسم بالإنجليزي</strong><span>{selectedProduct.name?.en}</span></div>
                            <div><strong>كود المنتج</strong><span>{selectedProduct.sku}</span></div>
                            <div><strong>التصنيف</strong><span>{getCategoryName(selectedProduct)}</span></div>
                            <div><strong>السعر الأساسي</strong><span>{selectedProduct.base_price}</span></div>
                            <div><strong>سعر الخصم</strong><span>{selectedProduct.discount_price || "-"}</span></div>
                            <div><strong>المخزون</strong><span>{getUnitsTotalStock(selectedProduct)}</span></div>
                            <div><strong>الحالة</strong><span>{selectedProduct.status}</span></div>
                            <div className="full"><strong>الوصف</strong><span>{selectedProduct.description?.ar || "لا يوجد وصف"}</span></div>
                        </div>

                        <div className="view-images">
                            <h4>صور المنتج</h4>
                            {selectedProduct.images?.length ? <div className="selected-images">
                                {selectedProduct.images.map((image) => <div className="selected-image" key={image.id}><img src={getImageUrl(image)} alt="" />{(image.is_main === true || image.is_main === 1 || image.is_main === "1") && <span className="main-image-badge">⭐ الرئيسية</span>}</div>)}
                            </div> : <p>لا توجد صور</p>}
                        </div>

                        <div className="view-units">
                            <h4>الوحدات</h4>
                            {selectedProduct.units?.length ? selectedProduct.units.map((unit) => <div className="view-unit" key={unit.id}><span>{unit.unit_name?.ar}</span><strong>{unit.price}</strong><small>مخزون: {unit.stock}</small></div>) : <p>لا توجد وحدات</p>}
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedProduct && (
                <div className="product-modal-overlay" onClick={closeDeleteModal}>
                    <div className="product-delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon"><span className="material-symbols-outlined">warning</span></div>
                        <h3>حذف المنتج</h3>
                        <p>هل أنت متأكد من حذف المنتج <strong>{selectedProduct.name?.ar}</strong> ؟</p>
                        {error && <div className="product-error">{error}</div>}
                        <div className="product-modal-actions">
                            <button type="button" className="product-cancel-button" onClick={closeDeleteModal} disabled={saving}>إلغاء</button>
                            <button type="button" className="product-delete-confirm" onClick={handleDelete} disabled={saving}>{saving ? "جاري الحذف..." : "تأكيد الحذف"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}