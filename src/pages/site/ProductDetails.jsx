import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:8000";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const currentLanguage = i18n.language?.startsWith("en")
        ? "en"
        : "ar";

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/products/${id}`,
                    {
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Product not found");
                }

                const result = await response.json();

                const productData = result.data || result;

                setProduct(productData);

                if (productData.images?.length > 0) {
                    const mainImage =
                        productData.images.find(
                            (image) =>
                                image.is_main === true ||
                                image.is_main === 1
                        ) || productData.images[0];

                    setSelectedImage(mainImage.image);
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

    const getProductName = () => {
        return (
            product?.name?.[currentLanguage] ||
            product?.name?.ar ||
            product?.name?.en ||
            ""
        );
    };

    const getProductDescription = () => {
        return (
            product?.description?.[currentLanguage] ||
            product?.description?.ar ||
            product?.description?.en ||
            ""
        );
    };

    const getImages = () => {
        if (!product?.images || product.images.length === 0) {
            return ["/images/product-placeholder.png"];
        }

        return product.images.map(
            (image) =>
                image.image ||
                "/images/product-placeholder.png"
        );
    };

    const increaseQuantity = () => {
        if (
            product?.stock !== undefined &&
            quantity >= product.stock
        ) {
            return;
        }

        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prev) =>
            prev > 1 ? prev - 1 : 1
        );
    };

    const handleAddToCart = () => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("access_token");

        if (!token) {
            navigate("/login");
            return;
        }

        console.log("Add to cart:", {
            product_id: product.id,
            quantity,
        });

        alert(
            currentLanguage === "ar"
                ? "تمت إضافة المنتج إلى السلة"
                : "Product added to cart"
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5E6D2]">
                <p className="text-gray-500 text-lg">
                    {currentLanguage === "ar"
                        ? "جاري تحميل المنتج..."
                        : "Loading product..."}
                </p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5E6D2] gap-5">
                <p className="text-red-500 font-semibold">
                    {error}
                </p>

                <button
                    onClick={() => navigate("/products")}
                    className="rounded-xl bg-[#F07A26] px-6 py-3 text-white font-bold hover:bg-[#4E7A3C] transition"
                >
                    {currentLanguage === "ar"
                        ? "العودة للمنتجات"
                        : "Back to products"}
                </button>
            </div>
        );
    }

    const images = getImages();

    const hasDiscount =
        product.has_discount &&
        product.discount_price;

    const price = hasDiscount
        ? product.discount_price
        : product.price;

    const isOutOfStock =
        product.stock !== undefined &&
        product.stock <= 0;

    return (
        <div
            className="min-h-screen bg-[#F5E6D2] py-10 px-4"
            dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        >
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-[#F07A26]"
                    >
                        {currentLanguage === "ar"
                            ? "الرئيسية"
                            : "Home"}
                    </button>

                    <span>›</span>

                    <button
                        onClick={() => navigate("/products")}
                        className="hover:text-[#F07A26]"
                    >
                        {currentLanguage === "ar"
                            ? "المنتجات"
                            : "Products"}
                    </button>

                    <span>›</span>

                    <span className="text-gray-800 font-medium">
                        {getProductName()}
                    </span>
                </div>

                {/* Product */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10">

                        {/* ================= Images ================= */}
                        <div>

                            {/* Main Image */}
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">

                                <img
                                    src={
                                        selectedImage ||
                                        "/images/product-placeholder.png"
                                    }
                                    alt={getProductName()}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/images/product-placeholder.png";
                                    }}
                                />

                                {hasDiscount && (
                                    <span className="absolute top-5 right-5 rounded-full bg-[#F07A26] px-4 py-2 text-sm font-bold text-white">
                                        {currentLanguage === "ar"
                                            ? "خصم"
                                            : "SALE"}
                                    </span>
                                )}

                                {isOutOfStock && (
                                    <span className="absolute top-5 right-5 rounded-full bg-gray-700 px-4 py-2 text-sm font-bold text-white">
                                        {currentLanguage === "ar"
                                            ? "نفد المخزون"
                                            : "Out of Stock"}
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="mt-4 flex gap-3 overflow-x-auto">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage(image)
                                            }
                                            className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition ${
                                                selectedImage === image
                                                    ? "border-[#F07A26]"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${getProductName()} ${
                                                    index + 1
                                                }`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ================= Details ================= */}
                        <div className="flex flex-col justify-center">

                            {/* Category */}
                            {product.category && (
                                <span className="text-sm font-semibold text-[#4E7A3C] mb-3">
                                    {product.category.name?.[
                                        currentLanguage
                                    ] ||
                                        product.category.name?.ar ||
                                        product.category.name?.en ||
                                        product.category.name}
                                </span>
                            )}

                            {/* Name */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                {getProductName()}
                            </h1>

                            {/* SKU */}
                            {product.sku && (
                                <p className="mt-3 text-sm text-gray-400">
                                    SKU: {product.sku}
                                </p>
                            )}

                            {/* Price */}
                            <div className="mt-6 flex items-center gap-4 flex-wrap">

                                <span className="text-3xl font-bold text-[#24572B]">
                                    {price}{" "}
                                    <span className="text-base">
                                        {currentLanguage === "ar"
                                            ? "ريال"
                                            : "YER"}
                                    </span>
                                </span>

                                {hasDiscount && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {product.price}{" "}
                                        {currentLanguage === "ar"
                                            ? "ريال"
                                            : "YER"}
                                    </span>
                                )}
                            </div>

                            {/* Stock */}
                            <div className="mt-5">
                                {isOutOfStock ? (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                                        <span className="material-symbols-outlined text-base">
                                            block
                                        </span>

                                        {currentLanguage === "ar"
                                            ? "المنتج غير متوفر حالياً"
                                            : "Product is currently unavailable"}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                                        <span className="material-symbols-outlined text-base">
                                            check_circle
                                        </span>

                                        {currentLanguage === "ar"
                                            ? `متوفر في المخزون (${product.stock})`
                                            : `In stock (${product.stock})`}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {getProductDescription() && (
                                <div className="mt-8">
                                    <h2 className="text-lg font-bold text-gray-900 mb-3">
                                        {currentLanguage === "ar"
                                            ? "وصف المنتج"
                                            : "Product Description"}
                                    </h2>

                                    <p className="text-gray-600 leading-8">
                                        {getProductDescription()}
                                    </p>
                                </div>
                            )}

                            {/* Quantity */}
                            {!isOutOfStock && (
                                <div className="mt-8">

                                    <label className="block mb-3 font-bold text-gray-900">
                                        {currentLanguage === "ar"
                                            ? "الكمية"
                                            : "Quantity"}
                                    </label>

                                    <div className="flex items-center w-fit border border-gray-200 rounded-xl overflow-hidden">

                                        <button
                                            type="button"
                                            onClick={decreaseQuantity}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                                        >
                                            −
                                        </button>

                                        <span className="w-14 text-center font-bold">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={increaseQuantity}
                                            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100"
                                        >
                                            +
                                        </button>

                                    </div>
                                </div>
                            )}

                            {/* Add Cart */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-3">

                                <button
                                    type="button"
                                    disabled={isOutOfStock}
                                    onClick={handleAddToCart}
                                    className="flex-1 rounded-xl bg-[#F07A26] px-6 py-4 text-white font-bold flex items-center justify-center gap-2 transition hover:bg-[#4E7A3C] disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined">
                                        add_shopping_cart
                                    </span>

                                    {isOutOfStock
                                        ? currentLanguage === "ar"
                                            ? "غير متوفر"
                                            : "Out of stock"
                                        : currentLanguage === "ar"
                                        ? "أضف إلى السلة"
                                        : "Add to Cart"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/products")
                                    }
                                    className="rounded-xl border border-[#4E7A3C] px-6 py-4 font-bold text-[#4E7A3C] hover:bg-[#4E7A3C] hover:text-white transition"
                                >
                                    {currentLanguage === "ar"
                                        ? "متابعة التسوق"
                                        : "Continue Shopping"}
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}