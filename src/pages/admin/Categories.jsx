import { useEffect, useState } from "react";
import { API_BASE_URL, STORAGE_BASE_URL } from "../../config/env";

const API_URL = API_BASE_URL;

const extractApiList = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    if (Array.isArray(result?.categories)) return result.categories;
    return [];
};

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const isAdmin = (() => {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        if (!token) return false;
        const role = localStorage.getItem("role");
        if (role === "admin") return true;
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            return user?.role === "admin" || user?.roles?.some((item) => (item?.name || item) === "admin");
        } catch {
            return false;
        }
    })();

    const [form, setForm] = useState({
        nameAr: "",
        nameEn: "",
        image: null,
    });

    /* =====================================================
        TOKEN
    ===================================================== */

    const getToken = () => {
        return localStorage.getItem("token") || localStorage.getItem("access_token");
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
        NORMALIZE CATEGORY
    ===================================================== */

    const getCategoryProductCount = (
        categoryId,
        productsList
    ) => {
        return productsList.filter(
            (product) =>
                String(product.category_id ?? product.category?.id ?? "") ===
                String(categoryId)
        ).length;
    };

    const normalizeCategory = (category) => {
        if (!category) {
            return null;
        }

        let nameValue =
            category.name ??
            category.name_ar ??
            category.name_en ??
            {};

        if (typeof nameValue === "string") {
            try {
                nameValue = JSON.parse(nameValue);
            } catch {
                nameValue = {
                    ar: nameValue,
                    en: "",
                };
            }
        }

        const name = {
            ar:
                category.name_ar ??
                nameValue?.ar ??
                "",
            en:
                category.name_en ??
                nameValue?.en ??
                "",
        };

        return {
            ...category,
            name,
            image:
                category.image ??
                category.image_url ??
                category.image_path ??
                null,

            productCount:
                category.productCount ??
                category.products_count ??
                category.productsCount ??
                category.products?.length ??
                0,
        };
    };

    /* =====================================================
        GET CATEGORIES
    ===================================================== */

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/categories`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            const result =
                await parseResponse(response);

            console.log(
                "Categories API:",
                result
            );

            if (!response.ok) {
                const errorMessage =
                    result?.errors &&
                    Object.values(
                        result.errors
                    )[0]
                        ? Array.isArray(
                              Object.values(
                                  result.errors
                              )[0]
                          )
                            ? Object.values(
                                  result.errors
                              )[0][0]
                            : String(
                                  Object.values(
                                      result.errors
                                  )[0]
                              )
                        : result?.message ||
                          "تعذر جلب التصنيفات";

                throw new Error(errorMessage);
            }

            /*
             * Laravel ممكن يرجع:
             *
             * 1. Array مباشرة:
             *
             * [
             *   {...},
             *   {...}
             * ]
             *
             * 2. أو:
             *
             * {
             *   data: [...]
             * }
             *
             * 3. أو Pagination:
             *
             * {
             *   data: {
             *      data: [...]
             *   }
             * }
             */

            const data = extractApiList(result);

            const normalizedCategories =
                data
                    .map(normalizeCategory)
                    .filter(Boolean);

            const countedCategories =
                normalizedCategories.map(
                    (category) => ({
                        ...category,
                        productCount:
                            getCategoryProductCount(
                                category.id,
                                products
                            ) ||
                            Number(
                                category.productCount ??
                                    category.products_count ??
                                    category.productsCount ??
                                    0
                            ),
                    })
                );

            console.log(
                "Normalized Categories:",
                countedCategories
            );

            setCategories(countedCategories);

        } catch (error) {
            console.error(
                "Fetch categories error:",
                error
            );

            setCategories([]);
            setError(
                getFriendlyError(
                    error,
                    "حدث خطأ أثناء تحميل التصنيفات"
                )
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
        GET PRODUCTS
    ===================================================== */

    const fetchProducts = async () => {
        try {
            const response = await fetch(
                `${API_URL}/products`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            const result = await parseResponse(response);

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                        "فشل في جلب المنتجات"
                );
            }

            const data = extractApiList(result);
            const normalizedProducts = Array.isArray(data)
                ? data
                : [];

            setProducts(normalizedProducts);

            setCategories((prevCategories) =>
                prevCategories.map((category) => {
                    const countedProducts =
                        normalizedProducts.filter(
                            (product) =>
                                String(
                                    product.category_id ??
                                        product.category?.id ??
                                        ""
                                ) ===
                                String(category.id)
                        ).length;

                    const apiCount = Number(
                        category.productCount ??
                            category.products_count ??
                            category.productsCount ??
                            0
                    );

                    return {
                        ...category,
                        productCount:
                            countedProducts > 0
                                ? countedProducts
                                : apiCount > 0
                                  ? apiCount
                                  : 0,
                    };
                })
            );
        } catch (error) {
            console.error("Fetch products error:", error);
            setProducts([]);
        }
    };

    /* =====================================================
        LOAD CATEGORIES
    ===================================================== */

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    /* =====================================================
        SEARCH
    ===================================================== */

    const filteredCategories =
        categories.filter((category) => {
            const arabicName =
                category.name?.ar ||
                category.name_ar ||
                "";

            const englishName =
                category.name?.en ||
                category.name_en ||
                "";

            const searchValue =
                search.toLowerCase().trim();

            return (
                arabicName
                    .toLowerCase()
                    .includes(searchValue) ||
                englishName
                    .toLowerCase()
                    .includes(searchValue) ||
                (category.slug || "")
                    .toLowerCase()
                    .includes(searchValue)
            );
        });

    /* =====================================================
        FORM CHANGE
    ===================================================== */

    const handleChange = (e) => {
        const {
            name,
            value,
            files,
        } = e.target;

        setForm((prev) => ({
            ...prev,

            [name]:
                name === "image"
                    ? files?.[0] || null
                    : value,
        }));
    };

    /* =====================================================
        OPEN ADD MODAL
    ===================================================== */

    const openAddModal = () => {
        setForm({
            nameAr: "",
            nameEn: "",
            image: null,
        });

        setError("");

        setShowAddModal(true);
    };

    /* =====================================================
        ADD CATEGORY
    ===================================================== */

    const handleAdd = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const formData = new FormData();

            formData.append(
                "name_ar",
                form.nameAr.trim()
            );

            formData.append(
                "name_en",
                form.nameEn.trim()
            );

            if (form.image) {
                formData.append(
                    "image",
                    form.image
                );
            }

            const token = getToken();

            const response = await fetch(
                `${API_URL}/categories`,
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
                "Add Category Response:",
                result
            );

            /* ==========================================
                ERROR
            ========================================== */

            if (!response.ok) {
                console.error(
                    "Laravel Add Error:",
                    result
                );

                /*
                 * Validation Errors
                 */

                if (result.errors) {
                    const firstError =
                        Object.values(
                            result.errors
                        )[0];

                    if (
                        Array.isArray(
                            firstError
                        )
                    ) {
                        throw new Error(
                            firstError[0]
                        );
                    }

                    throw new Error(
                        String(firstError)
                    );
                }

                /*
                 * General Error
                 */

                throw new Error(
                    result.message ||
                        "فشل في إضافة التصنيف"
                );
            }

            /* ==========================================
                SUCCESS
            ========================================== */

            /*
             * بعد نجاح الإضافة:
             *
             * لا نضيف العنصر يدويًا للـ state.
             *
             * بدل ذلك نعيد جلب جميع التصنيفات
             * من قاعدة البيانات.
             */

            await fetchCategories();

            /* ==========================================
                CLOSE MODAL
            ========================================== */

            setShowAddModal(false);

            /* ==========================================
                RESET FORM
            ========================================== */

            setForm({
                nameAr: "",
                nameEn: "",
                image: null,
            });

            setError("");

        } catch (error) {
            console.error(
                "Add category error:",
                error
            );

            setError(
                error.message ||
                    "حدث خطأ أثناء إضافة التصنيف"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
        OPEN EDIT MODAL
    ===================================================== */

    const openEditModal = (category) => {
        setSelectedCategory(category);

        setForm({
            nameAr:
                category.name?.ar || "",

            nameEn:
                category.name?.en || "",

            image: null,
        });

        setError("");

        setShowEditModal(true);
    };

    /* =====================================================
        UPDATE CATEGORY
    ===================================================== */

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedCategory) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            const formData = new FormData();

            formData.append(
                "name_ar",
                form.nameAr.trim()
            );

            formData.append(
                "name_en",
                form.nameEn.trim()
            );

            if (form.image) {
                formData.append(
                    "image",
                    form.image
                );
            }

            /*
             * Laravel Method Spoofing
             */

            formData.append(
                "_method",
                "PUT"
            );

            const token = getToken();

            const response = await fetch(
                `${API_URL}/categories/${selectedCategory.id}`,
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
                "Update Category Response:",
                result
            );

            /* ==========================================
                ERROR
            ========================================== */

            if (!response.ok) {
                console.error(
                    "Laravel Update Error:",
                    result
                );

                if (result.errors) {
                    const firstError =
                        Object.values(
                            result.errors
                        )[0];

                    if (
                        Array.isArray(
                            firstError
                        )
                    ) {
                        throw new Error(
                            firstError[0]
                        );
                    }

                    throw new Error(
                        String(firstError)
                    );
                }

                throw new Error(
                    result.message ||
                        "فشل في تعديل التصنيف"
                );
            }

            /* ==========================================
                SUCCESS
            ========================================== */

            /*
             * بعد التعديل نعيد جلب البيانات
             * من قاعدة البيانات.
             */

            await fetchCategories();

            /* ==========================================
                CLOSE
            ========================================== */

            setShowEditModal(false);

            setSelectedCategory(null);

            setForm({
                nameAr: "",
                nameEn: "",
                image: null,
            });

            setError("");

        } catch (error) {
            console.error(
                "Update category error:",
                error
            );

            setError(
                error.message ||
                    "حدث خطأ أثناء تعديل التصنيف"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
        OPEN DELETE MODAL
    ===================================================== */

    const openDeleteModal = (category) => {
        setSelectedCategory(category);

        setError("");

        setShowDeleteModal(true);
    };

    /* =====================================================
        DELETE CATEGORY
    ===================================================== */

    const handleDelete = async () => {
        if (!selectedCategory) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await fetch(
                `${API_URL}/categories/${selectedCategory.id}`,
                {
                    method: "DELETE",
                    headers: getHeaders(),
                }
            );

            const result =
                await parseResponse(response);

            console.log(
                "Delete Category Response:",
                result
            );

            /* ==========================================
                ERROR
            ========================================== */

            if (!response.ok) {
                console.error(
                    "Laravel Delete Error:",
                    result
                );

                if (result.errors) {
                    const firstError =
                        Object.values(
                            result.errors
                        )[0];

                    if (
                        Array.isArray(
                            firstError
                        )
                    ) {
                        throw new Error(
                            firstError[0]
                        );
                    }

                    throw new Error(
                        String(firstError)
                    );
                }

                throw new Error(
                    result.message ||
                        "فشل في حذف التصنيف"
                );
            }

            /* ==========================================
                SUCCESS
            ========================================== */

            await fetchCategories();

            /* ==========================================
                CLOSE
            ========================================== */

            setShowDeleteModal(false);

            setSelectedCategory(null);

            setError("");

        } catch (error) {
            console.error(
                "Delete category error:",
                error
            );

            setError(
                error.message ||
                    "حدث خطأ أثناء حذف التصنيف"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
        CLOSE ADD MODAL
    ===================================================== */

    const closeAddModal = () => {
        if (saving) return;

        setShowAddModal(false);

        setError("");
    };

    /* =====================================================
        CLOSE EDIT MODAL
    ===================================================== */

    const closeEditModal = () => {
        if (saving) return;

        setShowEditModal(false);

        setSelectedCategory(null);

        setError("");
    };

    /* =====================================================
        CLOSE DELETE MODAL
    ===================================================== */

    const closeDeleteModal = () => {
        if (saving) return;

        setShowDeleteModal(false);

        setSelectedCategory(null);

        setError("");
    };

    /* =====================================================
        UI
    ===================================================== */

    return (
        <div className="categories-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="categories-heading">

                <div>

                    <h1>
                        إدارة التصنيفات
                    </h1>

                    <p>
                        إدارة وتصنيف منتجات متجر تقية
                    </p>

                </div>

                {isAdmin && <button
                    type="button"
                    className="category-add-button"
                    onClick={openAddModal}
                >

                    <span className="material-symbols-outlined">
                        add_circle
                    </span>

                    إضافة تصنيف جديد

                </button>}

            </div>

            {/* =================================================
                PAGE ERROR
            ================================================= */}

            {!showAddModal &&
                !showEditModal &&
                !showDeleteModal &&
                error && (

                    <div className="category-error">
                        {error}
                    </div>

                )}

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="categories-toolbar">

                <div className="category-search">

                    <span className="material-symbols-outlined">
                        search
                    </span>

                    <input
                        type="text"
                        placeholder="بحث عن تصنيف..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="categories-card">

                <div className="categories-table-wrapper">

                    <table className="categories-table">

                        <thead>

                            <tr>

                                <th>
                                    التصنيف
                                </th>

                                <th>
                                    Slug
                                </th>

                                <th>
                                    عدد المنتجات
                                </th>

                                <th>
                                    الإجراءات
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="categories-empty"
                                    >
                                        جاري تحميل التصنيفات...
                                    </td>

                                </tr>

                            ) : filteredCategories.length > 0 ? (

                                filteredCategories.map(
                                    (category) => (

                                        <tr
                                            key={
                                                category.id
                                            }
                                        >

                                            {/* CATEGORY */}

                                            <td>

                                                <div className="category-info">

                                                    <div className="category-image">

                                                        {category.image ? (

                                                            <img
                                                                src={
                                                                    category.image
                                                                }
                                                                alt={
                                                                    category
                                                                        .name
                                                                        ?.ar ||
                                                                    "Category"
                                                                }
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.currentTarget.style.display =
                                                                        "none";
                                                                }}
                                                            />

                                                        ) : (

                                                            <span className="material-symbols-outlined">
                                                                category
                                                            </span>

                                                        )}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                category
                                                                    .name
                                                                    ?.ar ||
                                                                "-"
                                                            }
                                                        </strong>

                                                        <small>
                                                            {
                                                                category
                                                                    .name
                                                                    ?.en ||
                                                                "-"
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* SLUG */}

                                            <td>

                                                <span className="category-slug">

                                                    {
                                                        category.slug ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>

                                            {/* PRODUCTS */}

                                            <td>

                                                <span className="product-count">

                                                    {
                                                        category.productCount ??
                                                        category.products_count ??
                                                        category.products?.length ??
                                                        0
                                                    }

                                                    {" "}

                                                    منتج

                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="category-actions">

                                                    {isAdmin && <>
                                                    <button
                                                        type="button"
                                                        className="category-edit-button"
                                                        title="تعديل"
                                                        onClick={() =>
                                                            openEditModal(
                                                                category
                                                            )
                                                        }
                                                    >

                                                        <span className="material-symbols-outlined">
                                                            edit
                                                        </span>

                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="category-delete-button"
                                                        title="حذف"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                category
                                                            )
                                                        }
                                                    >

                                                        <span className="material-symbols-outlined">
                                                            delete
                                                        </span>

                                                    </button>
                                                    </>}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="categories-empty"
                                    >
                                        لا توجد تصنيفات
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* =================================================
                ADD MODAL
            ================================================= */}

            {showAddModal && (

                <div
                    className="category-modal-overlay"
                    onClick={closeAddModal}
                >

                    <div
                        className="category-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="category-modal-header">

                            <h3>
                                إضافة تصنيف جديد
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

                        <form
                            onSubmit={handleAdd}
                            className="category-form"
                        >

                            {error && (

                                <div className="category-error">
                                    {error}
                                </div>

                            )}

                            <div className="category-form-group">

                                <label>
                                    اسم التصنيف بالعربي
                                </label>

                                <input
                                    type="text"
                                    name="nameAr"
                                    value={
                                        form.nameAr
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="مثال: العسل الطبيعي"
                                    required
                                />

                            </div>

                            <div className="category-form-group">

                                <label>
                                    اسم التصنيف بالإنجليزي
                                </label>

                                <input
                                    type="text"
                                    name="nameEn"
                                    value={
                                        form.nameEn
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Natural Honey"
                                    required
                                />

                            </div>

                            <div className="category-form-group">

                                <label>
                                    صورة التصنيف
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            <div className="category-modal-actions">

                                <button
                                    type="button"
                                    className="category-cancel-button"
                                    onClick={
                                        closeAddModal
                                    }
                                    disabled={saving}
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="submit"
                                    className="category-save-button"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "جاري الحفظ..."
                                        : "حفظ التصنيف"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {showEditModal && (

                <div
                    className="category-modal-overlay"
                    onClick={closeEditModal}
                >

                    <div
                        className="category-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="category-modal-header">

                            <h3>
                                تعديل التصنيف
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

                        <form
                            onSubmit={
                                handleUpdate
                            }
                            className="category-form"
                        >

                            {error && (

                                <div className="category-error">
                                    {error}
                                </div>

                            )}

                            <div className="category-form-group">

                                <label>
                                    اسم التصنيف بالعربي
                                </label>

                                <input
                                    type="text"
                                    name="nameAr"
                                    value={
                                        form.nameAr
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            <div className="category-form-group">

                                <label>
                                    اسم التصنيف بالإنجليزي
                                </label>

                                <input
                                    type="text"
                                    name="nameEn"
                                    value={
                                        form.nameEn
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            <div className="category-form-group">

                                <label>
                                    صورة التصنيف الجديدة
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                            <div className="category-modal-actions">

                                <button
                                    type="button"
                                    className="category-cancel-button"
                                    onClick={
                                        closeEditModal
                                    }
                                    disabled={saving}
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="submit"
                                    className="category-save-button"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "جاري الحفظ..."
                                        : "تعديل التصنيف"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {showDeleteModal && (

                <div
                    className="category-modal-overlay"
                    onClick={
                        closeDeleteModal
                    }
                >

                    <div
                        className="category-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="category-modal-header">

                            <h3>
                                تأكيد الحذف
                            </h3>

                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
                                }
                            >

                                <span className="material-symbols-outlined">
                                    close
                                </span>

                            </button>

                        </div>

                        <div className="category-form">

                            {error && (

                                <div className="category-error">
                                    {error}
                                </div>

                            )}

                            <p>

                                هل أنت متأكد من حذف التصنيف{" "}

                                <strong>
                                    {
                                        selectedCategory
                                            ?.name
                                            ?.ar
                                    }
                                </strong>

                                ؟

                            </p>

                            <div className="category-modal-actions">

                                <button
                                    type="button"
                                    className="category-cancel-button"
                                    onClick={
                                        closeDeleteModal
                                    }
                                    disabled={saving}
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="button"
                                    className="category-save-button"
                                    style={{
                                        backgroundColor:
                                            "#dc2626",
                                    }}
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={saving}
                                >

                                    {saving
                                        ? "جاري الحذف..."
                                        : "تأكيد الحذف"}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}