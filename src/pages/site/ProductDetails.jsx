import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";

const API_URL = "http://127.0.0.1:8000";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [selectedUnitId, setSelectedUnitId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    const currentLanguage = i18n.language?.startsWith("en") ? "en" : "ar";

    const getFullImageUrl = (path) => {
        if (!path) return "/images/product-placeholder.png";
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        return `${API_URL}/${path.replace(/^\//, "")}`;
    };

    const getProductImages = (productData) => {
        const images = Array.isArray(productData?.images) ? productData.images : [];
        return images.map((image) => ({
            id: image.id,
            url: getFullImageUrl(image.image || image.image_url || image.url || image.image_path),
            isMain: image.is_main === true || image.is_main === 1 || image.is_main === "1",
        })).filter((image) => image.url);
    };

    // دالة شاملة لفك وتشفير حقول الـ JSON المترجمة (اسم الوحدة، اسم المنتج، ...إلخ)
    const getLocalizedValue = (data) => {
        if (!data) return "";

        let parsed = data;

        // 1. إذا كانت القيمة قادمة كـ JSON String قم بفكها أولاً
        if (typeof data === "string") {
            try {
                parsed = JSON.parse(data);
            } catch {
                // إذا لم تكن JSON وتصادفت كـ String عادي، أرجعها كما هي
                return data;
            }
        }

        // 2. إذا كانت Object يحتوي على مفاتيح اللغة (ar, en)
        if (typeof parsed === "object" && parsed !== null) {
            return parsed[currentLanguage] || parsed.ar || parsed.en || "";
        }

        return String(parsed);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/api/products/${id}`, {
                    headers: { Accept: "application/json" },
                });

                if (!response.ok) throw new Error("Product not found");

                const result = await response.json();
                const productData = result.data || result;

                setProduct(productData);

                const productImages = getProductImages(productData);
                const mainImage = productImages.find((image) => image.isMain) || productImages[0];
                setSelectedImage(mainImage?.url || "/images/product-placeholder.png");

                // تحديد أول وحدة تلقائياً إذا توفرت
                const availableUnits = productData.units || productData.product_units || [];
                if (availableUnits.length > 0) {
                    setSelectedUnitId(availableUnits[0].id);
                }

            } catch (err) {
                console.error(err);
                setError(
                    currentLanguage === "ar"
                        ? "تعذر تحميل تفاصيل المنتج"
                        : "Unable to load product details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, currentLanguage]);

    // 🟢 تعريف متغير unitsList هنا لمنع خطأ ReferenceError
    const unitsList = product?.units || product?.product_units || [];

    const getProductName = () => getLocalizedValue(product?.name);
    const getProductDescription = () => getLocalizedValue(product?.description);

    const getActivePrice = () => {
        if (unitsList.length > 0 && selectedUnitId) {
            const activeUnit = unitsList.find((u) => String(u.id) === String(selectedUnitId));
            if (activeUnit && activeUnit.price !== null && activeUnit.price !== undefined) {
                return Number(activeUnit.price);
            }
        }
        return product?.has_discount && product?.discount_price
            ? Number(product.discount_price)
            : Number(product?.price ?? product?.base_price ?? 0);
    };

    const totalPrice = Number(getActivePrice() || 0) * quantity;
    const productImages = getProductImages(product);

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (unitsList.length > 0 && !selectedUnitId) {
            alert(
                currentLanguage === "ar"
                    ? "يرجى اختيار وحدة المنتج أولاً"
                    : "Please select a unit first"
            );
            return;
        }

        try {
            setAddingToCart(true);
            await addToCart(product.id, selectedUnitId, quantity);
            alert(
                currentLanguage === "ar"
                    ? "تمت إضافة المنتج إلى السلة بنجاح"
                    : "Product added to cart successfully"
            );
        } catch (err) {
            console.error("Cart Error:", err);
            alert(
                currentLanguage === "ar"
                    ? "حدث خطأ أثناء الإضافة للسلة"
                    : "Failed to add item to cart"
            );
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5E6D2]">
                <p className="text-gray-500 text-lg font-medium">
                    {currentLanguage === "ar" ? "جاري تحميل المنتج..." : "Loading product..."}
                </p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5E6D2] gap-5">
                <p className="text-red-500 font-semibold">{error}</p>
                <button
                    onClick={() => navigate("/products")}
                    className="rounded-xl bg-[#F07A26] px-6 py-3 text-white font-bold hover:bg-[#4E7A3C] transition"
                >
                    {currentLanguage === "ar" ? "العودة للمنتجات" : "Back to products"}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5E6D2] py-10 px-4" dir={currentLanguage === "ar" ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto bg-white rounded-3xl p-5 md:p-10 shadow-sm">
                <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
                    {/* Image Section */}
                    <div className="min-w-0">
                        <div className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-[#f5f1e9] md:h-[520px]">
                            <img
                                src={selectedImage}
                                alt={getProductName()}
                                className="h-full w-full object-contain object-center"
                                onError={(event) => {
                                    event.currentTarget.src = "/images/product-placeholder.png";
                                }}
                            />
                        </div>

                        {productImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                {productImages.map((image) => (
                                    <button
                                        key={image.id || image.url}
                                        type="button"
                                        onClick={() => setSelectedImage(image.url)}
                                        className={`h-20 overflow-hidden rounded-xl border-2 bg-[#f5f1e9] transition md:h-24 ${selectedImage === image.url ? "border-[#F07A26] ring-2 ring-[#F07A26]/20" : "border-transparent hover:border-[#4E7A3C]"}`}
                                        aria-label={image.isMain ? "Main product image" : "Product image"}
                                    >
                                        <img src={image.url} alt="" className="h-full w-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-gray-900">{getProductName()}</h1>

                        <div className="mt-4 flex flex-wrap items-end gap-3">
                            <span className="text-3xl font-bold text-[#24572B]">
                                {getActivePrice().toFixed(2)} {currentLanguage === "ar" ? "ريال" : "YER"}
                            </span>
                            <span className="text-sm text-gray-500">
                                {currentLanguage === "ar" ? "للوحدة" : "per unit"}
                            </span>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="unit-select" className="mb-2 block text-sm font-bold text-gray-900">
                                {currentLanguage === "ar" ? "اختر الوحدة / التعبئة" : "Select Unit"}
                            </label>
                            {unitsList.length > 0 && (
                                <select
                                    id="unit-select"
                                    value={selectedUnitId || ""}
                                    onChange={(event) => setSelectedUnitId(event.target.value)}
                                    className="w-full rounded-xl border border-gray-300 bg-white p-3 font-medium text-gray-800 shadow-sm outline-none transition focus:border-[#F07A26] focus:ring-2 focus:ring-[#F07A26] md:w-80"
                                >
                                    {unitsList.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {getLocalizedValue(unit.unit_name)} - {Number(unit.price).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Description */}
                        {getProductDescription() && (
                            <p className="mt-6 text-gray-600 leading-relaxed">{getProductDescription()}</p>
                        )}

                        {/* Quantity */}
                        <div className="mt-6">
                            <label className="block mb-2 font-bold text-gray-900">
                                {currentLanguage === "ar" ? "الكمية" : "Quantity"}
                            </label>
                            <div className="flex w-fit items-center overflow-hidden rounded-xl border">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                                    className="w-10 h-10 hover:bg-gray-100"
                                >
                                    −
                                </button>
                                <span className="w-12 text-center font-bold">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="w-10 h-10 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                            <div className="mt-4 rounded-xl bg-[#f3f4ed] p-4">
                                <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
                                    <span>{currentLanguage === "ar" ? `الإجمالي (${quantity})` : `Total (${quantity})`}</span>
                                    <strong className="text-2xl text-[#24572B]">
                                        {totalPrice.toFixed(2)} {currentLanguage === "ar" ? "ريال" : "YER"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* Add Button */}
                        <button
                            type="button"
                            disabled={addingToCart || (unitsList.length > 0 && !selectedUnitId)}
                            onClick={handleAddToCart}
                            className="mt-8 w-full rounded-xl bg-[#F07A26] py-4 text-white font-bold hover:bg-[#4E7A3C] transition disabled:bg-gray-300"
                        >
                            {addingToCart
                                ? currentLanguage === "ar" ? "جاري الإضافة..." : "Adding..."
                                : currentLanguage === "ar" ? "أضف إلى السلة" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

