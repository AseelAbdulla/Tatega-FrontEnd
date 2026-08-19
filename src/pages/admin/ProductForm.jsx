import { useEffect, useState } from "react";
import { API_BASE_URL, STORAGE_BASE_URL } from "../../config/env";

const API_URL = API_BASE_URL;

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

const emptyCategories = [];

const tempId = () =>
    `temp-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;

const isPersistedId = (id) =>
    id !== null &&
    id !== undefined &&
    /^\d+$/.test(String(id));

const getApiError = (result) => {
    if (result?.errors) {
        const first = Object.values(result.errors)[0];
        return Array.isArray(first)
            ? first[0]
            : String(first);
    }

    return (
        result?.message ||
        "حدث خطأ غير معروف"
    );
};

const parseResponse = async (response) => {
    const text = await response.text();

    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch {
        throw new Error(
            "الخادم رجع استجابة غير صحيحة."
        );
    }
};

const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

const getHeaders = () => {
    const rawToken = getToken()?.trim();
    const tokenType =
        localStorage.getItem("token_type")?.trim() ||
        "Bearer";
    const tokenWithType = rawToken?.match(/^(\S+)\s+(.+)$/);
    const authorization = tokenWithType
        ? rawToken
        : rawToken
            ? `${tokenType} ${rawToken}`
            : null;

    return {
        Accept: "application/json",
        ...(authorization
            ? {
                  Authorization: authorization,
              }
            : {}),
    };
};

const clearInvalidSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
};

const getFriendlyError = (error) => {
    const message = String(error?.message || error || "");

    if (message.includes("401") ||
        message.toLowerCase().includes("unauthenticated") ||
        message.toLowerCase().includes("invalid or missing token")) {
        return "انتهت جلسة الدخول أو أن التوكن غير صالح. سجّل الدخول من جديد ثم أعد المحاولة.";
    }

    return message || "فشل في حفظ المنتج";
};

const getImageUrl = (image) => {
    if (!image) return "";

    if (image.image_url)
        return image.image_url;

    if (image.url)
        return image.url;

    if (!image.image_path)
        return "";

    if (image.image_path.startsWith("http"))
        return image.image_path;

    const path =
        image.image_path.startsWith("/")
            ? image.image_path
            : `/${image.image_path}`;

    return `${STORAGE_BASE_URL}${path}`;
};

export default function ProductForm({
    mode = "add",
    productId = null,
    categories = emptyCategories,
    onSaved,
}) {
    const isEdit = mode === "edit";

    const [availableCategories, setAvailableCategories] =
        useState(categories);

    const [form, setForm] =
        useState(emptyForm);

    const [existingImages, setExistingImages] =
        useState([]);

    const [loading, setLoading] =
        useState(isEdit);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    useEffect(() => {
        if (categories.length) {
            setAvailableCategories(categories);
            return;
        }

        const loadCategories = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/categories`,
                    { headers: getHeaders() }
                );
                const result = await parseResponse(response);

                if (!response.ok)
                    throw new Error(getApiError(result));

                const list = Array.isArray(result)
                    ? result
                    : Array.isArray(result.data)
                        ? result.data
                        : result.data?.data || [];

                setAvailableCategories(
                    Array.isArray(list) ? list : []
                );
            } catch (err) {
                setError(
                    err.message ||
                        "فشل في تحميل التصنيفات"
                );
            }
        };

        loadCategories();
    }, [categories]);

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

    const loadProduct = async () => {
        if (!productId) return;

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/products/${productId}`,
                {
                    headers: getHeaders(),
                }
            );

            const result =
                await parseResponse(response);

            if (response.status === 401) {
                clearInvalidSession();
                window.location.assign("/login");
                return;
            }

            if (!response.ok)
                throw new Error(
                    getApiError(result)
                );

            const product =
                result.data || result;

            const name =
                typeof product.name === "string"
                    ? JSON.parse(product.name)
                    : product.name || {};

            const description =
                typeof product.description ===
                "string"
                    ? JSON.parse(
                          product.description
                      )
                    : product.description || {};

            const units =
                product.units ||
                product.product_units ||
                [];

            setForm({
                category_id:
                    product.category_id ??
                    product.category?.id ??
                    "",

                nameAr: name?.ar || "",
                nameEn: name?.en || "",

                descriptionAr:
                    description?.ar || "",

                descriptionEn:
                    description?.en || "",

                sku: product.sku || "",

                base_price:
                    product.base_price ??
                    product.price ??
                    "",

                has_discount:
                    Boolean(
                        product.has_discount
                    ),

                discount_price:
                    product.discount_price ??
                    "",

                stock:
                    product.stock ?? "",

                low_stock_threshold:
                    product.low_stock_threshold ??
                    5,

                status:
                    product.status || "active",

                images: [],

                units: units.map((unit) => ({
                    id:
                        unit.id ??
                        tempId(),

                    nameAr:
                        unit.unit_name
                            ?.ar || "",

                    nameEn:
                        unit.unit_name
                            ?.en || "",

                    price:
                        unit.price ?? "",

                    stock:
                        unit.stock ?? 0,
                })),
            });

            setExistingImages(
                product.images ||
                    product.product_images ||
                    []
            );
        } catch (err) {
            console.error(err);
            setError(
                err.message ||
                    "فشل في تحميل المنتج"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEdit) {
            loadProduct();
        }
    }, [productId, isEdit]);

    const handleImagesChange = (e) => {
        const files = Array.from(
            e.target.files || []
        );

        setForm((prev) => ({
            ...prev,
            images: [
                ...prev.images,
                ...files,
            ],
        }));

        e.target.value = "";
    };

    const removeNewImage = (index) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter(
                (_, i) => i !== index
            ),
        }));
    };

    const addUnit = () => {
        setForm((prev) => ({
            ...prev,
            units: [
                ...prev.units,
                {
                    id: tempId(),
                    nameAr: "",
                    nameEn: "",
                    price: "",
                    stock: 0,
                },
            ],
        }));
    };

    const updateUnitField = (
        id,
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,
            units: prev.units.map((unit) =>
                String(unit.id) ===
                String(id)
                    ? {
                          ...unit,
                          [field]: value,
                      }
                    : unit
            ),
        }));
    };

    const deleteUnit = async (unit) => {
        if (!isPersistedId(unit.id)) {
            setForm((prev) => ({
                ...prev,
                units: prev.units.filter(
                    (item) =>
                        String(item.id) !==
                        String(unit.id)
                ),
            }));
            return;
        }

        if (
            !window.confirm(
                "هل تريد حذف هذه الوحدة نهائيًا؟"
            )
        )
            return;

        try {
            setSaving(true);

            const response = await fetch(
                `${API_URL}/product-units/${unit.id}`,
                {
                    method: "DELETE",
                    headers: getHeaders(),
                }
            );

            const result =
                await parseResponse(response);

            if (response.status === 401) {
                clearInvalidSession();
                window.location.assign("/login");
                return;
            }

            if (!response.ok)
                throw new Error(
                    getApiError(result)
                );

            setForm((prev) => ({
                ...prev,
                units: prev.units.filter(
                    (item) =>
                        String(item.id) !==
                        String(unit.id)
                ),
            }));
        } catch (err) {
            setError(
                err.message ||
                    "فشل في حذف الوحدة"
            );
        } finally {
            setSaving(false);
        }
    };

    const setMainImage = async (imageId) => {
        try {
            setSaving(true);
            setError("");

            const response = await fetch(
                `${API_URL}/product-images/${imageId}`,
                {
                    method: "PUT",
                    headers: {
                        ...getHeaders(),
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        is_main: true,
                    }),
                }
            );

            const result =
                await parseResponse(response);

            if (!response.ok)
                throw new Error(
                    getApiError(result)
                );

            setExistingImages((prev) =>
                prev.map((image) => ({
                    ...image,
                    is_main:
                        String(image.id) ===
                        String(imageId),
                }))
            );

            setSuccess(
                "تم تغيير الصورة الرئيسية"
            );
        } catch (err) {
            setError(
                err.message ||
                    "فشل في تغيير الصورة الرئيسية"
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteImage = async (image) => {
        const isMain =
            image.is_main === true ||
            image.is_main === 1 ||
            image.is_main === "1";

        if (
            !window.confirm(
                isMain
                    ? "هذه الصورة رئيسية، وسيتم اختيار صورة بديلة تلقائيًا. هل تريد حذفها؟"
                    : "هل تريد حذف هذه الصورة؟"
            )
        )
            return;

        try {
            setSaving(true);
            setError("");

            const response = await fetch(
                `${API_URL}/product-images/${image.id}`,
                {
                    method: "DELETE",
                    headers: getHeaders(),
                }
            );

            const result =
                await parseResponse(response);

            if (!response.ok)
                throw new Error(
                    getApiError(result)
                );

            const productResponse =
                await fetch(
                    `${API_URL}/products/${productId}`,
                    {
                        headers: getHeaders(),
                    }
                );

            const productResult =
                await parseResponse(
                    productResponse
                );

            if (!productResponse.ok)
                throw new Error(
                    getApiError(productResult)
                );

            const product =
                productResult.data ||
                productResult;

            setExistingImages(
                product.images ||
                    product.product_images ||
                    []
            );

            setSuccess(
                isMain
                    ? "تم حذف الصورة الرئيسية واختيار البديلة تلقائيًا"
                    : "تم حذف الصورة"
            );
        } catch (err) {
            setError(
                err.message ||
                    "فشل في حذف الصورة"
            );
        } finally {
            setSaving(false);
        }
    };

    const addImages = async () => {
        for (const file of form.images) {
            const fd = new FormData();

            fd.append(
                "product_id",
                productId
            );

            fd.append("image", file);

            const response = await fetch(
                `${API_URL}/product-images`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: fd,
                }
            );

            const result =
                await parseResponse(response);

            if (!response.ok)
                throw new Error(
                    getApiError(result)
                );
        }
    };

    const createUnit = async (unit) => {
        const response = await fetch(
            `${API_URL}/product-units`,
            {
                method: "POST",
                headers: {
                    ...getHeaders(),
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    unit_name_ar:
                        unit.nameAr.trim(),
                    unit_name_en:
                        unit.nameEn.trim(),
                    price: unit.price || 0,
                    stock: unit.stock || 0,
                }),
            }
        );

        const result =
            await parseResponse(response);

        if (!response.ok)
            throw new Error(
                getApiError(result)
            );
    };

    const updateUnit = async (unit) => {
        const response = await fetch(
            `${API_URL}/product-units/${unit.id}`,
            {
                method: "PUT",
                headers: {
                    ...getHeaders(),
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    product_id: productId,
                    unit_name_ar:
                        unit.nameAr.trim(),
                    unit_name_en:
                        unit.nameEn.trim(),
                    price: unit.price || 0,
                    stock: unit.stock || 0,
                }),
            }
        );

        const result =
            await parseResponse(response);

        if (!response.ok)
            throw new Error(
                getApiError(result)
            );
    };

    const buildProductData = () => {
        const fd = new FormData();

        fd.append(
            "category_id",
            form.category_id
        );

        fd.append(
            "name_ar",
            form.nameAr.trim()
        );

        fd.append(
            "name_en",
            form.nameEn.trim()
        );

        fd.append(
            "description_ar",
            form.descriptionAr.trim()
        );

        fd.append(
            "description_en",
            form.descriptionEn.trim()
        );

        fd.append(
            "sku",
            form.sku.trim()
        );

        fd.append(
            "base_price",
            form.base_price
        );

        fd.append(
            "has_discount",
            form.has_discount ? "1" : "0"
        );

        if (
            form.has_discount &&
            form.discount_price !== ""
        ) {
            fd.append(
                "discount_price",
                form.discount_price
            );
        }

        fd.append(
            "stock",
            form.stock
        );

        fd.append(
            "low_stock_threshold",
            form.low_stock_threshold
        );

        fd.append(
            "status",
            form.status
        );

        return fd;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const fd =
                buildProductData();

            let url =
                `${API_URL}/products`;

            if (isEdit) {
                url += `/${productId}`;
                fd.append("_method", "PUT");
            }

            const response = await fetch(
                url,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: fd,
                }
            );

            const result =
                await parseResponse(response);

            if (!response.ok)
                throw new Error(
                    getApiError(result)
                );

            const savedProduct =
                result.data || result;

            const savedId =
                savedProduct?.id ||
                productId;

            if (!isEdit) {
                for (const file of form.images) {
                    const imageFd =
                        new FormData();

                    imageFd.append(
                        "product_id",
                        savedId
                    );

                    imageFd.append(
                        "image",
                        file
                    );

                    const imageResponse =
                        await fetch(
                            `${API_URL}/product-images`,
                            {
                                method: "POST",
                                headers:
                                    getHeaders(),
                                body: imageFd,
                            }
                        );

                    const imageResult =
                        await parseResponse(
                            imageResponse
                        );

                    if (
                        !imageResponse.ok
                    )
                        throw new Error(
                            getApiError(
                                imageResult
                            )
                        );
                }

                for (const unit of form.units) {
                    await createUnit({
                        ...unit,
                    });
                }
            } else {
                if (form.images.length) {
                    await addImages();
                }

                for (const unit of form.units) {
                    if (isPersistedId(unit.id)) {
                        await updateUnit(unit);
                    } else {
                        await createUnit(unit);
                    }
                }
            }

            setSuccess(
                isEdit
                    ? "تم تعديل المنتج بنجاح"
                    : "تم إضافة المنتج بنجاح"
            );

            if (onSaved) {
                await onSaved();
            }
        } catch (err) {
            console.error(err);
            setError(
                getFriendlyError(err)
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="products-page">
                <div className="products-empty">
                    جاري تحميل بيانات المنتج...
                </div>
            </div>
        );
    }

    return (
        <div
            className="products-page"
            dir="rtl"
        >
            <div className="products-heading">
                <div>
                    <h1>
                        {isEdit
                            ? "تعديل المنتج"
                            : "إضافة منتج جديد"}
                    </h1>

                    <p>
                        {isEdit
                            ? "تعديل بيانات المنتج والصور والوحدات"
                            : "إدخال بيانات المنتج والصور والوحدات"}
                    </p>
                </div>
            </div>

            {error && (
                <div className="product-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="product-success">
                    {success}
                </div>
            )}

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >
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

                        <div className="product-form-group">
                            <label>
                                اسم المنتج بالإنجليزي *
                            </label>

                            <input
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

                        <div className="product-form-group">
                            <label>
                                كود المنتج *
                            </label>

                            <input
                                name="sku"
                                value={form.sku}
                                onChange={
                                    handleChange
                                }
                                required
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                التصنيف *
                            </label>

                            <select
                                name="category_id"
                                value={
                                    form.category_id
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >
                                <option value="">
                                    اختر التصنيف
                                </option>

                                {availableCategories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category
                                                    .name
                                                    ?.ar
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="product-form-group product-full">
                            <label>
                                الوصف بالعربي
                            </label>

                            <textarea
                                name="descriptionAr"
                                value={
                                    form.descriptionAr
                                }
                                onChange={
                                    handleChange
                                }
                                rows="4"
                            />
                        </div>

                        <div className="product-form-group product-full">
                            <label>
                                الوصف بالإنجليزي
                            </label>

                            <textarea
                                name="descriptionEn"
                                value={
                                    form.descriptionEn
                                }
                                onChange={
                                    handleChange
                                }
                                rows="4"
                            />
                        </div>

                    </div>
                </div>

                <div className="product-section">
                    <h4>
                        السعر والمخزون
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
                                value={
                                    form.base_price
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                المخزون
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="stock"
                                value={
                                    form.stock
                                }
                                onChange={
                                    handleChange
                                }
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
                                value={
                                    form.low_stock_threshold
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>

                        <div className="product-form-group">
                            <label>
                                الحالة
                            </label>

                            <select
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
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

                        <div className="product-form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="has_discount"
                                    checked={
                                        form.has_discount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />{" "}
                                يوجد خصم
                            </label>
                        </div>

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
                                    value={
                                        form.discount_price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        )}

                    </div>
                </div>

                <div className="product-section">
                    <h4>
                        صور المنتج
                    </h4>

                    <div className="product-form-group">
                        <label>
                            إضافة عدة صور
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={
                                handleImagesChange
                            }
                        />
                    </div>

                    {form.images.length > 0 && (
                        <div className="selected-images">
                            {form.images.map(
                                (image, index) => (
                                    <div
                                        className="selected-image"
                                        key={
                                            `${image.name}-${index}`
                                        }
                                    >
                                        <img
                                            src={URL.createObjectURL(
                                                image
                                            )}
                                            alt=""
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeNewImage(
                                                    index
                                                )
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {isEdit &&
                        existingImages.length > 0 && (
                            <>
                                <h5>
                                    الصور الحالية
                                </h5>

                                <div className="selected-images">
                                    {existingImages.map(
                                        (image) => {
                                            const main =
                                                image.is_main ===
                                                    true ||
                                                image.is_main ===
                                                    1 ||
                                                image.is_main ===
                                                    "1";

                                            return (
                                                <div
                                                    className={`selected-image ${
                                                        main
                                                            ? "main-image-selected"
                                                            : ""
                                                    }`}
                                                    key={
                                                        image.id
                                                    }
                                                >
                                                    <img
                                                        src={getImageUrl(
                                                            image
                                                        )}
                                                        alt=""
                                                    />

                                                    {main && (
                                                        <span className="main-image-badge">
                                                            ⭐ الرئيسية
                                                        </span>
                                                    )}

                                                    <div className="existing-image-actions">

                                                        {!main && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setMainImage(
                                                                        image.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    saving
                                                                }
                                                                title="جعلها رئيسية"
                                                            >
                                                                ⭐
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteImage(
                                                                    image
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            title="حذف الصورة"
                                                        >
                                                            🗑
                                                        </button>

                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </>
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
                            onClick={
                                addUnit
                            }
                            disabled={saving}
                        >
                            + إضافة وحدة
                        </button>
                    </div>

                    {form.units.length ===
                        0 && (
                        <div className="no-units">
                            لا توجد وحدات.
                        </div>
                    )}

                    {form.units.map(
                        (unit) => (
                            <div
                                className="unit-row"
                                key={unit.id}
                            >

                                <div className="product-form-group">
                                    <label>
                                        اسم الوحدة عربي *
                                    </label>

                                    <input
                                        value={
                                            unit.nameAr
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            updateUnitField(
                                                unit.id,
                                                "nameAr",
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="product-form-group">
                                    <label>
                                        اسم الوحدة إنجليزي *
                                    </label>

                                    <input
                                        value={
                                            unit.nameEn
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            updateUnitField(
                                                unit.id,
                                                "nameEn",
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="product-form-group">
                                    <label>
                                        السعر *
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={
                                            unit.price
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            updateUnitField(
                                                unit.id,
                                                "price",
                                                e.target
                                                    .value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="product-form-group">
                                    <label>
                                        المخزون
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            unit.stock
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            updateUnitField(
                                                unit.id,
                                                "stock",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />
                                </div>

                                <button
                                    type="button"
                                    className="remove-unit-button"
                                    onClick={() =>
                                        deleteUnit(
                                            unit
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    🗑
                                </button>

                            </div>
                        )
                    )}

                </div>

                <div className="product-modal-actions">

                    <button
                        type="button"
                        className="product-cancel-button"
                        onClick={() =>
                            window.history.back()
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
                        {saving
                            ? "جاري الحفظ..."
                            : isEdit
                            ? "حفظ التعديلات"
                            : "إضافة المنتج"}
                    </button>

                </div>

            </form>
        </div>
    );
}