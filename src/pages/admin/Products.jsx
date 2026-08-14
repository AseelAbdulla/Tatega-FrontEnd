import { useEffect, useState } from "react";
import { API_BASE_URL, STORAGE_BASE_URL } from "../../config/env";
import "../../index.css";

const API_URL = API_BASE_URL;

const createUnitId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `unit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const extractApiList = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    return [];
};

export default function Products() {
    /* =====================================================
        STATE
    ===================================================== */

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

    /* =====================================================
        FORM
    ===================================================== */

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

    /* =====================================================
        TOKEN
    ===================================================== */

    const getToken = () => {
        return localStorage.getItem("token");
    };

    /* =====================================================
        HEADERS
    ===================================================== */

    const getHeaders = () => {
        const token = getToken();

        return {
            Accept: "application/json",

            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
        };
    };

    /* =====================================================
        PARSE RESPONSE
    ===================================================== */

    const parseResponse = async (response) => {
        const text = await response.text();

        console.log("API Response:", text);

        if (!text) {
            return {};
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            console.error(
                "Invalid JSON response:",
                text
            );

            throw new Error(
                "الخادم رجع استجابة غير صحيحة: " +
                    text.substring(0, 200)
            );
        }
    };

    const getFriendlyError = (error, fallback) => {
        const message = String(
            error?.message || error || ""
        );

        if (
            message.includes("Failed to fetch") ||
            message.includes("ERR_CONNECTION_REFUSED") ||
            message.includes("NetworkError")
        ) {
            return "تعذر الاتصال بالخادم. تأكد من تشغيل الخدمة والمحاولة مرة أخرى.";
        }

        if (message.includes("401")) {
            return "جلسة المستخدم منتهية، يرجى تسجيل الدخول مرة أخرى.";
        }

        if (message.includes("403")) {
            return "لا توجد صلاحية للوصول إلى هذا القسم.";
        }

        if (message.includes("404")) {
            return "العنصر المطلوب غير موجود.";
        }

        if (message.includes("422")) {
            return "بيانات غير صالحة، يرجى مراجعة الحقول المطلوبة.";
        }

        if (message.includes("500")) {
            return "حدث خطأ في الخادم، حاول لاحقًا.";
        }

        return message || fallback;
    };

    /* =====================================================
        ERROR HANDLER
    ===================================================== */

    const getApiError = (result) => {
        if (result?.errors) {
            const firstError =
                Object.values(result.errors)[0];

            if (Array.isArray(firstError)) {
                return firstError[0];
            }

            return String(firstError);
        }

        return (
            result?.message ||
            "حدث خطأ غير معروف"
        );
    };

    /* =====================================================
        NORMALIZE PRODUCT
    ===================================================== */

    const getUnitsTotalStock = (product) => {
        const units =
            Array.isArray(product?.units)
                ? product.units
                : [];

        const total = units.reduce(
            (sum, unit) =>
                sum +
                Number(unit?.stock ?? 0),
            0
        );

        return total > 0
            ? total
            : Number(product?.stock ?? 0);
    };

    const getFormUnitsTotalStock = (units) => {
        return (units || []).reduce(
            (sum, unit) =>
                sum + Number(unit?.stock ?? 0),
            0
        );
    };

    const normalizeProduct = (product) => {
        if (!product) {
            return null;
        }

        let name = product.name;

        if (typeof name === "string") {
            try {
                name = JSON.parse(name);
            } catch {
                name = {
                    ar: name,
                    en: "",
                };
            }
        }

        let description = product.description;

        if (typeof description === "string") {
            try {
                description =
                    JSON.parse(description);
            } catch {
                description = {
                    ar: description,
                    en: "",
                };
            }
        }

        const normalizedProduct = {
            ...product,

            category_id:
                product.category_id ??
                product.category?.id ??
                null,

            name: name || {
                ar: "",
                en: "",
            },

            description:
                description || {
                    ar: "",
                    en: "",
                },

            images:
                product.images ||
                product.product_images ||
                [],

            units:
                product.units ||
                product.product_units ||
                [],

            base_price:
                product.base_price ??
                product.price ??
                0,

            discount_price:
                product.discount_price ??
                product.discount ??
                null,

            has_discount: Boolean(
                product.has_discount
            ),

            stock:
                product.stock ??
                getUnitsTotalStock(product),

            low_stock_threshold:
                product.low_stock_threshold ??
                5,

            productCount:
                product.productCount ?? 0,

            category:
                product.category || null,
        };

        return normalizedProduct;
    };

    /* =====================================================
        GET PRODUCTS
    ===================================================== */

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/products`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            const result =
                await parseResponse(response);

            console.log(
                "Products API:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    getApiError(result)
                );
            }

            const data = extractApiList(result);

            setProducts(
                data
                    .map(normalizeProduct)
                    .filter(Boolean)
            );
        } catch (error) {
            console.error(
                "Fetch products error:",
                error
            );

            setProducts([]);
            setError(
                getFriendlyError(
                    error,
                    "فشل في تحميل المنتجات"
                )
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
        GET CATEGORIES
    ===================================================== */

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${API_URL}/categories`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            const result =
                await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    getApiError(result)
                );
            }

            const data = extractApiList(result);

            setCategories(data);
        } catch (error) {
            console.error(
                "Fetch categories error:",
                error
            );
            setCategories([]);
        }
    };

    /* =====================================================
        INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const getProductCategoryId = (product) => {
        return (
            product?.category_id ??
            product?.category?.id ??
            null
        );
    };

    /* =====================================================
        SEARCH + FILTER
    ===================================================== */

    const filteredProducts =
        products.filter((product) => {
            const searchValue =
                search
                    .toLowerCase()
                    .trim();

            const nameAr =
                product.name?.ar || "";

            const nameEn =
                product.name?.en || "";

            const sku =
                product.sku || "";

            const categoryNameAr =
                product.category?.name?.ar ||
                "";

            const categoryNameEn =
                product.category?.name?.en ||
                "";

            const matchesSearch =
                nameAr
                    .toLowerCase()
                    .includes(searchValue) ||
                nameEn
                    .toLowerCase()
                    .includes(searchValue) ||
                sku
                    .toLowerCase()
                    .includes(searchValue) ||
                categoryNameAr
                    .toLowerCase()
                    .includes(searchValue) ||
                categoryNameEn
                    .toLowerCase()
                    .includes(searchValue);

            const productCategoryId =
                product.category_id ??
                product.category?.id ??
                null;

            const matchesCategory =
                selectedCategory === "all" ||
                String(productCategoryId) ===
                    String(selectedCategory);

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    /* =====================================================
        FORM CHANGE
    ===================================================== */

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((prev) => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    /* =====================================================
        IMAGE CHANGE
    ===================================================== */

    const handleImagesChange = (e) => {
        const files =
            Array.from(
                e.target.files || []
            );

        setForm((prev) => ({
            ...prev,
            images: files,
        }));
    };

    /* =====================================================
        REMOVE NEW IMAGE
    ===================================================== */

    const removeNewImage = (index) => {
        setForm((prev) => ({
            ...prev,

            images: prev.images.filter(
                (_, i) => i !== index
            ),
        }));
    };

    /* =====================================================
        ADD UNIT
    ===================================================== */

    const addUnit = () => {
        setForm((prev) => ({
            ...prev,

            units: [
                ...prev.units,

                {
                    id: createUnitId(),
                    nameAr: "",
                    nameEn: "",
                    price: "",
                    stock: 0,
                },
            ],
        }));
    };

    /* =====================================================
        REMOVE UNIT
    ===================================================== */

    const removeUnit = (unitId) => {
        setForm((prev) => ({
            ...prev,

            units: prev.units.filter(
                (unit) => unit.id !== unitId
            ),
        }));
    };

    /* =====================================================
        UNIT CHANGE
    ===================================================== */

    const handleUnitChange = (
        unitId,
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,

            units: prev.units.map(
                (unit) =>
                    unit.id === unitId
                        ? {
                              ...unit,
                              [field]:
                                  value,
                          }
                        : unit
            ),
        }));
    };

    /* =====================================================
        OPEN ADD
    ===================================================== */

    const openAddModal = () => {
        setForm({
            ...emptyForm,
            units: [],
            images: [],
        });

        setError("");
        setSuccess("");

        setShowAddModal(true);
    };

    /* =====================================================
        BUILD FORM DATA
    ===================================================== */

    const buildFormData = () => {
        const formData =
            new FormData();

        /* ==============================
            FRONTEND ONLY SAFETY:
            Ensure no slug-related field is sent to the backend.
            This avoids passing extra payloads when the current
            Laravel schema does not include a slug column.
        ============================== */
        [
            "slug",
            "slug_en",
            "slug_ar",
            "_slug",
        ].forEach((key) => {
            formData.delete(key);
        });

        /* ==============================
            PRODUCT
        ============================== */

        formData.append(
            "category_id",
            form.category_id
        );

        formData.append(
            "name_ar",
            form.nameAr.trim()
        );

        formData.append(
            "name_en",
            form.nameEn.trim()
        );

        formData.append(
            "description_ar",
            form.descriptionAr.trim()
        );

        formData.append(
            "description_en",
            form.descriptionEn.trim()
        );

        formData.append(
            "sku",
            form.sku.trim()
        );

        formData.append(
            "base_price",
            form.base_price
        );

        formData.append(
            "has_discount",
            form.has_discount ? "1" : "0"
        );

        if (
            form.has_discount &&
            form.discount_price !== ""
        ) {
            formData.append(
                "discount_price",
                form.discount_price
            );
        }

        formData.append(
            "stock",
            form.stock
        );

        formData.append(
            "low_stock_threshold",
            form.low_stock_threshold
        );

        formData.append(
            "status",
            form.status
        );

        /* ==============================
            IMAGES
        ============================== */

        form.images.forEach(
            (image) => {
                formData.append(
                    "images[]",
                    image
                );
            }
        );

        /* ==============================
            UNITS
        ============================== */

        const units = form.units.map(
            (unit) => ({
                unit_name: {
                    ar:
                        unit.nameAr
                            ?.trim() || "",
                    en:
                        unit.nameEn
                            ?.trim() || "",
                },

                price:
                    unit.price || 0,

                stock:
                    unit.stock || 0,
            })
        );

        formData.append(
            "units",
            JSON.stringify(units)
        );

        return formData;
    };

    /* =====================================================
        ADD PRODUCT
    ===================================================== */

    const handleAdd = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const formData =
                buildFormData();

            formData.delete("slug");
            formData.delete("slug_ar");
            formData.delete("slug_en");

            const token = getToken();

            const response = await fetch(
                `${API_URL}/products`,
                {
                    method: "POST",

                    headers: {
                        Accept:
                            "application/json",

                        ...(token && {
                            Authorization: `Bearer ${token}`,
                        }),
                    },

                    body: formData,
                }
            );

            const result =
                await parseResponse(response);

            console.log(
                "Add Product Response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    getApiError(result)
                );
            }

            let newProduct =
                result.data;

            if (Array.isArray(newProduct)) {
                newProduct =
                    newProduct[0];
            }

            if (newProduct) {
                setProducts((prev) => [
                    ...prev,
                    normalizeProduct(
                        newProduct
                    ),
                ]);
            } else {
                await fetchProducts();
            }

            setShowAddModal(false);

            setForm({
                ...emptyForm,
            });

            showSuccess(
                "تم إضافة المنتج بنجاح"
            );
        } catch (error) {
            console.error(
                "Add product error:",
                error
            );

            setError(
                error.message ||
                    "فشل في إضافة المنتج"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
        OPEN VIEW
    ===================================================== */

    const openViewModal = (product) => {
        setSelectedProduct(product);
        setShowViewModal(true);
    };

    /* =====================================================
        OPEN EDIT
    ===================================================== */

    const openEditModal = (product) => {
        setSelectedProduct(product);

        const units =
            product.units ||
            [];

        setForm({
            category_id:
                product.category_id ??
                product.category?.id ??
                "",

            nameAr:
                product.name?.ar ||
                "",

            nameEn:
                product.name?.en ||
                "",

            descriptionAr:
                product.description?.ar ||
                "",

            descriptionEn:
                product.description?.en ||
                "",

            sku:
                product.sku || "",

            base_price:
                product.base_price || "",

            has_discount:
                Boolean(
                    product.has_discount
                ),

            discount_price:
                product.discount_price ||
                "",

            stock:
                getUnitsTotalStock(product),

            low_stock_threshold:
                product.low_stock_threshold ??
                5,

            status:
                product.status ||
                "active",

            images: [],

            units: units.map(
                (unit) => ({
                    id:
                        unit.id ??
                        createUnitId(),

                    nameAr:
                        unit.unit_name
                            ?.ar || "",

                    nameEn:
                        unit.unit_name
                            ?.en || "",

                    price:
                        unit.price || "",

                    stock:
                        unit.stock ?? 0,
                })
            ),
        });

        setError("");

        setShowEditModal(true);
    };

    /* =====================================================
        UPDATE PRODUCT
    ===================================================== */

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedProduct) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            const formData =
                buildFormData();

            formData.delete("slug");
            formData.delete("slug_ar");
            formData.delete("slug_en");

            /*
             * Laravel Method Spoofing
             */

            formData.append(
                "_method",
                "PUT"
            );

            /*
             * إذا أردنا معرفة الصور
             * الموجودة مسبقاً نرسلها
             */

            const existingImageIds =
                (
                    selectedProduct.images ||
                    []
                ).map(
                    (image) => image.id
                );

            formData.append(
                "existing_image_ids",
                JSON.stringify(
                    existingImageIds
                )
            );

            const token = getToken();

            const response = await fetch(
                `${API_URL}/products/${selectedProduct.id}`,
                {
                    method: "POST",

                    headers: {
                        Accept:
                            "application/json",

                        ...(token && {
                            Authorization: `Bearer ${token}`,
                        }),
                    },

                    body: formData,
                }
            );

            const result =
                await parseResponse(response);

            console.log(
                "Update Product Response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    getApiError(result)
                );
            }

            let updatedProduct =
                result.data;

            if (Array.isArray(
                updatedProduct
            )) {
                updatedProduct =
                    updatedProduct[0];
            }

            if (updatedProduct) {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id ===
                        selectedProduct.id
                            ? normalizeProduct(
                                  updatedProduct
                              )
                            : product
                    )
                );
            } else {
                await fetchProducts();
            }

            setShowEditModal(false);

            setSelectedProduct(null);

            setForm({
                ...emptyForm,
            });

            showSuccess(
                "تم تعديل المنتج بنجاح"
            );
        } catch (error) {
            console.error(
                "Update product error:",
                error
            );

            setError(
                error.message ||
                    "فشل في تعديل المنتج"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
        OPEN DELETE
    ===================================================== */

    const openDeleteModal = (product) => {
        setSelectedProduct(product);

        setError("");

        setShowDeleteModal(true);
    };

    /* =====================================================
        DELETE PRODUCT
    ===================================================== */

    const handleDelete = async () => {
        if (!selectedProduct) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await fetch(
                `${API_URL}/products/${selectedProduct.id}`,
                {
                    method: "DELETE",

                    headers: getHeaders(),
                }
            );

            const result =
                await parseResponse(response);

            console.log(
                "Delete Product Response:",
                result
            );

            if (!response.ok) {
                throw new Error(
                    getApiError(result)
                );
            }

            setProducts((prev) =>
                prev.filter(
                    (product) =>
                        product.id !==
                        selectedProduct.id
                )
            );

            setShowDeleteModal(false);

            setSelectedProduct(null);

            showSuccess(
                "تم حذف المنتج بنجاح"
            );
        } catch (error) {
            console.error(
                "Delete product error:",
                error
            );

            setError(
                error.message ||
                    "فشل في حذف المنتج"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
        SUCCESS MESSAGE
    ===================================================== */

    const showSuccess = (message) => {
        setSuccess(message);

        setTimeout(() => {
            setSuccess("");
        }, 3500);
    };

    /* =====================================================
        GET PRODUCT IMAGE
    ===================================================== */

    const getProductImage = (product) => {
        const images =
            product.images || [];

        if (!images.length) {
            return null;
        }

        const mainImage =
            images.find(
                (image) =>
                    image.is_main === true ||
                    image.is_main === 1
            );

        const image =
            mainImage || images[0];

        if (!image) {
            return null;
        }

        if (
            image.image_url
        ) {
            return image.image_url;
        }

        if (
            image.url
        ) {
            return image.url;
        }

        if (
            image.image_path?.startsWith(
                "http"
            )
        ) {
            return image.image_path;
        }

        if (!image.image_path) {
            return null;
        }

        const normalizedPath = image.image_path.startsWith("/")
            ? image.image_path
            : `/${image.image_path}`;

        return `${STORAGE_BASE_URL}${normalizedPath}`;
    };

    /* =====================================================
        GET CATEGORY NAME
    ===================================================== */

    const getCategoryName = (
        product
    ) => {
        return (
            product.category
                ?.name?.ar ||
            categories.find(
                (category) =>
                    String(category.id) ===
                    String(
                        product.category_id
                    )
            )?.name?.ar ||
            "-"
        );
    };

    /* =====================================================
        GET DISPLAY PRICE
    ===================================================== */

    const getDisplayPrice = (
        product
    ) => {
        if (
            product.has_discount &&
            product.discount_price
        ) {
            return product.discount_price;
        }

        return product.base_price;
    };

    /* =====================================================
        CLOSE MODALS
    ===================================================== */

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

    /* =====================================================
        FORM COMPONENT
    ===================================================== */

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
    }) => {
        return (
            <form
                onSubmit={onSubmit}
                className="product-form"
            >
                {error && (
                    <div className="product-error">
                        {error}
                    </div>
                )}

                <div className="product-section">
                    <h4>
                        معلومات المنتج
                    </h4>

                    <div className="product-form-grid">
                        <div className="product-form-group">
                            <label>
                                اسم المنتج بالعربي *
                            </label>

                            <input
                                type="text"
                                name="nameAr"
                                value={form.nameAr}
                                onChange={handleChange}
                                placeholder="اكتب الاسم بالعربي"
                                required
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                اسم المنتج بالإنجليزي *
                            </label>

                            <input
                                type="text"
                                name="nameEn"
                                value={form.nameEn}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                كود المنتج *
                            </label>

                            <input
                                type="text"
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                placeholder="مثال: HON-001"
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                التصنيف *
                            </label>

                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    اختر التصنيف
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name?.ar || "-"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="product-form-group product-full">
                            <label>
                                الوصف بالعربي
                            </label>

                            <textarea
                                name="descriptionAr"
                                value={form.descriptionAr}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                        <div className="product-form-group product-full">
                            <label>
                                الوصف بالإنجليزي
                            </label>

                            <textarea
                                name="descriptionEn"
                                value={form.descriptionEn}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                    </div>
                </div>

                <div className="product-section">
                    <h4>
                        الأسعار والمخزون
                    </h4>

                    <div className="product-form-grid">
                        <div className="product-form-group">
                            <label>
                                السعر الأساسي *
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="base_price"
                                value={form.base_price}
                                onChange={handleChange}
                                placeholder="اكتب السعر يدويًا"
                                required
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                المخزون *
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                placeholder="اكتب المخزون يدويًا"
                                required
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                حد المخزون المنخفض
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="low_stock_threshold"
                                value={form.low_stock_threshold}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                الحالة
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="active">
                                    نشط
                                </option>

                                <option value="inactive">
                                    غير نشط
                                </option>

                                <option value="draft">
                                    مسودة
                                </option>
                            </select>
                        </div>

                        <div className="product-discount">
                            <label className="discount-checkbox">
                                <input
                                    type="checkbox"
                                    name="has_discount"
                                    checked={form.has_discount}
                                    onChange={handleChange}
                                />

                                <span>
                                    يوجد خصم
                                </span>
                            </label>

                            {form.has_discount && (
                                <div className="product-form-group">
                                    <label>
                                        سعر الخصم
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="discount_price"
                                        value={form.discount_price}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="product-section">
                    <h4>
                        صور المنتج
                    </h4>

                    <div className="product-form-group">
                        <label>
                            إضافة صور
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                        />
                    </div>

                    {form.images.length > 0 && (
                        <div className="selected-images">
                            {form.images.map((image, index) => (
                                <div
                                    className="selected-image"
                                    key={`new-image-${index}`}
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt=""
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeNewImage(index)
                                        }
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {showEditModal &&
                        selectedProduct?.images?.length > 0 && (
                            <div className="existing-images">
                                <p>
                                    الصور الحالية
                                </p>

                                <div className="selected-images">
                                    {selectedProduct.images.map((image) => (
                                        <div
                                            className="selected-image"
                                            key={image.id}
                                        >
                                            <img
                                                src={
                                                    image.image_url ||
                                                    image.url ||
                                                    (() => {
                                                        if (!image.image_path) return "";
                                                        const normalizedPath = image.image_path.startsWith("/")
                                                            ? image.image_path
                                                            : `/${image.image_path}`;
                                                        return `${STORAGE_BASE_URL}${normalizedPath}`;
                                                    })()
                                                }
                                                alt=""
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                </div>

                <div className="product-section">
                    <div className="product-section-header">
                        <h4>
                            وحدات المنتج
                        </h4>

                        <button
                            type="button"
                            className="add-unit-button"
                            onClick={addUnit}
                        >
                            <span className="material-symbols-outlined">
                                add
                            </span>

                            إضافة وحدة
                        </button>
                    </div>

                    {form.units.length === 0 && (
                        <div className="no-units">
                            لم تتم إضافة وحدات.
                            يمكنك إضافة وحدة مثل:
                            500 جم، 1 كجم، 1 لتر.
                        </div>
                    )}

                    {form.units.map((unit) => (
                        <div
                            className="unit-row"
                            key={unit.id || `unit-${Math.random()}`}
                        >
                            <div className="product-form-group">
                                <label>
                                    اسم الوحدة عربي
                                </label>

                                <input
                                    type="text"
                                    value={unit.nameAr}
                                    onChange={(e) =>
                                        handleUnitChange(
                                            unit.id,
                                            "nameAr",
                                            e.target.value
                                        )
                                    }
                                    placeholder="500 جم"
                                />
                            </div>

                            <div className="product-form-group">
                                <label>
                                    اسم الوحدة إنجليزي
                                </label>

                                <input
                                    type="text"
                                    value={unit.nameEn}
                                    onChange={(e) =>
                                        handleUnitChange(
                                            unit.id,
                                            "nameEn",
                                            e.target.value
                                        )
                                    }
                                    placeholder="500 g"
                                />
                            </div>

                            <div className="product-form-group">
                                <label>
                                    السعر
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={unit.price}
                                    onChange={(e) =>
                                        handleUnitChange(
                                            unit.id,
                                            "price",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="product-form-group">
                                <label>
                                    المخزون
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={unit.stock}
                                    onChange={(e) =>
                                        handleUnitChange(
                                            unit.id,
                                            "stock",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <button
                                type="button"
                                className="remove-unit-button"
                                onClick={() => removeUnit(unit.id)}
                            >
                                <span className="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="product-modal-actions">
                    <button
                        type="button"
                        className="product-cancel-button"
                        onClick={
                            showEditModal ? closeEditModal : closeAddModal
                        }
                        disabled={saving}
                    >
                        إلغاء
                    </button>

                    <button
                        type="submit"
                        className="product-save-button"
                        disabled={saving}
                    >
                        {saving ? "جاري الحفظ..." : submitText}
                    </button>
                </div>
            </form>
        );
    };

    /* =====================================================
        UI
    ===================================================== */

    return (
        <div className="products-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="products-heading">
                <div>
                    <h1>
                        إدارة المنتجات
                    </h1>

                    <p>
                        إدارة منتجات متجر تقية
                    </p>
                </div>

                <button
                    type="button"
                    className="product-add-button"
                    onClick={
                        openAddModal
                    }
                >
                    <span className="material-symbols-outlined">
                        add
                    </span>

                    إضافة منتج
                </button>
            </div>

            {/* =================================================
                MESSAGES
            ================================================= */}

            {!showAddModal &&
                !showEditModal &&
                !showDeleteModal &&
                error && (
                    <div className="product-error">
                        {error}
                    </div>
                )}

            {success && (
                <div className="product-success">
                    <span className="material-symbols-outlined">
                        check_circle
                    </span>

                    {success}
                </div>
            )}

            {/* =================================================
                SEARCH / FILTER
            ================================================= */}

            <div className="products-toolbar">

                <div className="product-search">
                    <span className="material-symbols-outlined">
                        search
                    </span>

                    <input
                        type="text"
                        placeholder="بحث عن منتج..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="product-category-filter">

                    <button
                        type="button"
                        className={
                            selectedCategory ===
                            "all"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setSelectedCategory(
                                "all"
                            )
                        }
                    >
                        الكل
                    </button>

                    {categories.map(
                        (category) => (
                            <button
                                type="button"
                                key={
                                    category.id
                                }
                                className={
                                    String(
                                        selectedCategory
                                    ) ===
                                    String(
                                        category.id
                                    )
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setSelectedCategory(
                                        category.id
                                    )
                                }
                            >
                                {
                                    category
                                        .name
                                        ?.ar
                                }
                            </button>
                        )
                    )}
                </div>

            </div>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="products-grid">

                {loading ? (
                    <div className="products-empty">
                        جاري تحميل المنتجات...
                    </div>
                ) : filteredProducts.length >
                  0 ? (
                    filteredProducts.map(
                        (product) => {
                            const image =
                                getProductImage(
                                    product
                                );

                            const price =
                                getDisplayPrice(
                                    product
                                );

                            const totalStock =
                                getUnitsTotalStock(
                                    product
                                );

                            const isLowStock =
                                Number(
                                    totalStock
                                ) <=
                                Number(
                                    product.low_stock_threshold ??
                                        5
                                );

                            return (
                                <div
                                    className={
                                        "product-card " +
                                        (isLowStock
                                            ? "low-stock"
                                            : "")
                                    }
                                    key={
                                        product.id
                                    }
                                >

                                    {/* IMAGE */}

                                    <div className="product-image-wrapper">

                                        {image ? (
                                            <img
                                                src={
                                                    image
                                                }
                                                alt={
                                                    product
                                                        .name
                                                        ?.ar ||
                                                    "Product"
                                                }
                                                onError={(
                                                    e
                                                ) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="product-no-image">
                                                <span className="material-symbols-outlined">
                                                    inventory_2
                                                </span>
                                            </div>
                                        )}

                                        <span className="product-category-badge">
                                            {getCategoryName(
                                                product
                                            )}
                                        </span>

                                        {isLowStock && (
                                            <span className="product-low-stock-badge">
                                                <span className="material-symbols-outlined">
                                                    warning
                                                </span>

                                                منخفض
                                            </span>
                                        )}

                                        {/* ACTIONS */}

                                        <div className="product-actions">

                                            <button
                                                type="button"
                                                title="عرض"
                                                onClick={() =>
                                                    openViewModal(
                                                        product
                                                    )
                                                }
                                            >
                                                <span className="material-symbols-outlined">
                                                    visibility
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                title="تعديل"
                                                onClick={() =>
                                                    openEditModal(
                                                        product
                                                    )
                                                }
                                            >
                                                <span className="material-symbols-outlined">
                                                    edit
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                title="حذف"
                                                onClick={() =>
                                                    openDeleteModal(
                                                        product
                                                    )
                                                }
                                            >
                                                <span className="material-symbols-outlined">
                                                    delete
                                                </span>
                                            </button>

                                        </div>
                                    </div>

                                    {/* INFO */}

                                    <div className="product-card-body">

                                        <h3>
                                            {
                                                product
                                                    .name
                                                    ?.ar
                                            }
                                        </h3>

                                        <small>
                                            {
                                                product
                                                    .name
                                                    ?.en
                                            }
                                        </small>

                                        <div className="product-price-row">

                                            <div>
                                                <span className="product-price">
                                                    {price}
                                                </span>

                                                {product.has_discount &&
                                                    product.discount_price && (
                                                        <span className="product-old-price">
                                                            {
                                                                product.base_price
                                                            }
                                                        </span>
                                                    )}
                                            </div>

                                            <div className="product-stock">
                                                <span>
                                                    المخزون
                                                </span>

                                                <strong
                                                    className={
                                                        isLowStock
                                                            ? "danger"
                                                            : ""
                                                    }
                                                >
                                                    {
                                                        totalStock
                                                    }
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="product-sku">
                                            كود المنتج: {" "}
                                            {
                                                product.sku
                                            }
                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )
                ) : (
                    <div className="products-empty">
                        لا توجد منتجات
                    </div>
                )}

                {/* ADD CARD */}

                <button
                    type="button"
                    className="product-add-card"
                    onClick={
                        openAddModal
                    }
                >
                    <div>
                        <span className="material-symbols-outlined">
                            add
                        </span>
                    </div>

                    <strong>
                        أضف منتجاً
                    </strong>

                    <span>
                        قم بتوسيع مجموعتك
                    </span>
                </button>

            </div>

            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {showViewModal &&
                selectedProduct && (
                    <div
                        className="product-modal-overlay"
                        onClick={
                            closeViewModal
                        }
                    >
                        <div
                            className="product-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="product-modal-header">
                                <h3>
                                    تفاصيل المنتج
                                </h3>

                                <button
                                    type="button"
                                    onClick={
                                        closeViewModal
                                    }
                                >
                                    <span className="material-symbols-outlined">
                                        close
                                    </span>
                                </button>
                            </div>

                            <div className="product-details">

                                <div>
                                    <strong>
                                        الاسم
                                    </strong>

                                    <span>
                                        {
                                            selectedProduct
                                                .name
                                                ?.ar
                                        }
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        الاسم بالإنجليزي
                                    </strong>

                                    <span>
                                        {
                                            selectedProduct
                                                .name
                                                ?.en
                                        }
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        كود المنتج
                                    </strong>

                                    <span>
                                        {
                                            selectedProduct.sku
                                        }
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        التصنيف
                                    </strong>

                                    <span>
                                        {getCategoryName(
                                            selectedProduct
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        السعر الأساسي
                                    </strong>

                                    <span>
                                        {
                                            selectedProduct.base_price
                                        }
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        سعر الخصم
                                    </strong>

                                    <span>
                                        {
                                            selectedProduct
                                                .discount_price ||
                                            "-"
                                        }
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        المخزون
                                    </strong>

                                    <span>
                                        {
                                            getUnitsTotalStock(
                                                selectedProduct
                                            )
                                        }
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        الحالة
                                    </strong>

                                    <span>
                                        {
                                            selectedProduct.status
                                        }
                                    </span>
                                </div>

                                <div className="full">
                                    <strong>
                                        الوصف
                                    </strong>

                                    <span>
                                        {
                                            selectedProduct
                                                .description
                                                ?.ar ||
                                            "لا يوجد وصف"
                                        }
                                    </span>
                                </div>

                            </div>

                            {/* UNITS */}

                            <div className="view-units">

                                <h4>
                                    الوحدات
                                </h4>

                                {selectedProduct
                                    .units
                                    ?.length >
                                0 ? (
                                    selectedProduct.units.map(
                                        (
                                            unit
                                        ) => (
                                            <div
                                                className="view-unit"
                                                key={
                                                    unit.id
                                                }
                                            >
                                                <span>
                                                    {
                                                        unit
                                                            .unit_name
                                                            ?.ar
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        unit.price
                                                    }
                                                </strong>

                                                <small>
                                                    مخزون:{" "}
                                                    {
                                                        unit.stock
                                                    }
                                                </small>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p>
                                        لا توجد وحدات
                                    </p>
                                )}

                            </div>

                        </div>
                    </div>
                )}

            {/* =================================================
                ADD MODAL
            ================================================= */}

            {showAddModal && (
                <div
                    className="product-modal-overlay"
                    onClick={
                        closeAddModal
                    }
                >
                    <div
                        className="product-modal product-modal-large"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="product-modal-header">
                            <h3>
                                إضافة منتج جديد
                            </h3>

                            <button
                                type="button"
                                onClick={
                                    closeAddModal
                                }
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>

                        <ProductForm
                            form={form}
                            error={error}
                            onSubmit={handleAdd}
                            submitText="إضافة المنتج"
                            handleChange={handleChange}
                            handleImagesChange={handleImagesChange}
                            removeNewImage={removeNewImage}
                            addUnit={addUnit}
                            removeUnit={removeUnit}
                            handleUnitChange={handleUnitChange}
                            showEditModal={showEditModal}
                            selectedProduct={selectedProduct}
                            closeEditModal={closeEditModal}
                            closeAddModal={closeAddModal}
                            categories={categories}
                            saving={saving}
                        />

                    </div>
                </div>
            )}

            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {showEditModal && (
                <div
                    className="product-modal-overlay"
                    onClick={
                        closeEditModal
                    }
                >
                    <div
                        className="product-modal product-modal-large"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="product-modal-header">
                            <h3>
                                تعديل المنتج
                            </h3>

                            <button
                                type="button"
                                onClick={
                                    closeEditModal
                                }
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>

                        <ProductForm
                            form={form}
                            error={error}
                            onSubmit={handleUpdate}
                            submitText="تعديل المنتج"
                            handleChange={handleChange}
                            handleImagesChange={handleImagesChange}
                            removeNewImage={removeNewImage}
                            addUnit={addUnit}
                            removeUnit={removeUnit}
                            handleUnitChange={handleUnitChange}
                            showEditModal={showEditModal}
                            selectedProduct={selectedProduct}
                            closeEditModal={closeEditModal}
                            closeAddModal={closeAddModal}
                            categories={categories}
                            saving={saving}
                        />

                    </div>
                </div>
            )}

            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {showDeleteModal &&
                selectedProduct && (
                    <div
                        className="product-modal-overlay"
                        onClick={
                            closeDeleteModal
                        }
                    >
                        <div
                            className="product-delete-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="delete-icon">
                                <span className="material-symbols-outlined">
                                    warning
                                </span>
                            </div>

                            <h3>
                                حذف المنتج
                            </h3>

                            <p>
                                هل أنت متأكد من
                                حذف المنتج
                                <strong>
                                    {" "}
                                    {
                                        selectedProduct
                                            .name
                                            ?.ar
                                    }{" "}
                                </strong>
                                ؟
                            </p>

                            {error && (
                                <div className="product-error">
                                    {error}
                                </div>
                            )}

                            <div className="product-modal-actions">

                                <button
                                    type="button"
                                    className="product-cancel-button"
                                    onClick={
                                        closeDeleteModal
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="button"
                                    className="product-delete-confirm"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "جاري الحذف..."
                                        : "تأكيد الحذف"}
                                </button>

                            </div>

                        </div>
                    </div>
                )}

        </div>
    );
}