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

    // دالة شاملة لفك وتشفير حقول الـ JSON المترجمة (اسم الوحدة، اسم المنتج، ...إلخ)
    const getLocalizedValue = (data) => {
        if (!data) return "";

        let parsed = data;

        // 1. إذا كانت القيمة قادمة كـ JSON String قم بفكها أولاً
        if (typeof data === "string") {
            try {
                parsed = JSON.parse(data);
            } catch (e) {
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

                // تحديد أول وحدة تلقائياً إذا توفرت
                const availableUnits = productData.units || productData.product_units || [];
                if (availableUnits.length > 0) {
                    setSelectedUnitId(availableUnits[0].id);
                }

                const getImages = () => {
                    if (!product?.images || product.images.length === 0) {
                        return ["/images/product-placeholder.png"];
                    }
                    return product.images.map((img) => getFullImageUrl(img.image || img.url));
                };
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
            const activeUnit = unitsList.find((u) => u.id === selectedUnitId);
            if (activeUnit && activeUnit.price) return activeUnit.price;
        }
        return product?.has_discount && product?.discount_price
            ? product.discount_price
            : product?.price || product?.base_price;
    };

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
            <div className="max-w-7xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div>
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                            <img
                                src={selectedImage || "/images/product-placeholder.png"}
                                alt={getProductName()}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-gray-900">{getProductName()}</h1>

                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-3xl font-bold text-[#24572B]">
                                {getActivePrice()} {currentLanguage === "ar" ? "ريال" : "YER"}
                            </span>
                        </div>

                        {/* 📦 قائمة اختيار الوحدة المنسدلة (Dropdown) */}
                        <div className="mt-6">
                            <label htmlFor="unit-select" className="block mb-2 text-sm font-bold text-gray-900">
                                {currentLanguage === "ar" ? "اختر الوحدة / التعبئة" : "Select Unit"}
                            </label>

                            {unitsList.length > 0 ? (
                                <select
                                    id="unit-select"
                                    value={selectedUnitId || ""}
                                    onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                                    className="w-full md:w-80 p-3 bg-white border border-gray-300 rounded-xl text-gray-800 font-medium focus:ring-2 focus:ring-[#F07A26] focus:border-[#F07A26] outline-none transition shadow-sm cursor-pointer"
                                >
                                    {unitsList.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {getLocalizedValue(unit.unit_name)}

                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
                                    {currentLanguage === "ar"
                                        ? "تنبيه: لا توجد وحدات متوفرة لهذا المنتج"
                                        : "Warning: No units available for this product"}
                                </p>
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
                            <div className="flex items-center w-fit border rounded-xl overflow-hidden">
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
                        </div>

                        {/* Add Button */}
                        <button
                            type="button"
                            disabled={addingToCart || unitsList.length === 0}
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

