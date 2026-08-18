import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, isAuthenticated, onAddToCart }) {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const lang = i18n.language === "en" ? "en" : "ar";

    const productName =
        product?.name?.[lang] ||
        product?.name?.ar ||
        product?.name?.en ||
        "";

    const images = product?.images || [];

    const mainImage =
        images.find((image) => image.is_main)?.image ||
        images[0]?.image ||
        "/images/product-placeholder.png";

    const hasDiscount =
        product.has_discount &&
        product.discount_price !== null;

    const price = hasDiscount
        ? product.discount_price
        : product.price;

    const oldPrice = hasDiscount
        ? product.price
        : null;

    const isOutOfStock =
        product.stock !== undefined &&
        product.stock <= 0;

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        onAddToCart(product);
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">

            {/* Image */}
            <div
                className="relative aspect-square overflow-hidden bg-[#f3f4ed] cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
            >

                <img
                    src={mainImage}
                    alt={productName}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        isOutOfStock ? "opacity-50" : ""
                    }`}
                />

                {/* Discount */}
                {hasDiscount && !isOutOfStock && (
                    <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#F07A26] text-white text-[10px] font-bold shadow-sm">
                            <span className="material-symbols-outlined text-[12px]">
                                local_offer
                            </span>

                            <span>
                                {lang === "ar"
                                    ? "خصم"
                                    : "Sale"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Out of stock */}
                {isOutOfStock && (
                    <div className="absolute top-3 right-3">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#414940] text-white text-[10px] font-bold">
                            <span className="material-symbols-outlined text-[12px]">
                                block
                            </span>

                            {lang === "ar"
                                ? "نفد المخزون"
                                : "Out of Stock"}
                        </div>
                    </div>
                )}

            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">

                <h3
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="font-bold text-base text-[#2A2A2A] mb-2 cursor-pointer group-hover:text-[#24572b] transition-colors"
                >
                    {productName}
                </h3>

                {/* Category */}
                {product.category && (
                    <p className="text-xs text-[#71796f] mb-4">
                        {product.category.name?.[lang] ||
                            product.category.name?.ar ||
                            product.category.name?.en}
                    </p>
                )}

                {/* Price */}
                <div className="mt-auto">

                    <div className="flex items-center gap-2 mb-4">

                        <p className="text-[#24572b] font-bold text-lg">
                            {price} ر.س
                        </p>

                        {oldPrice && (
                            <p className="text-[#71796f] text-xs line-through opacity-60">
                                {oldPrice} ر.س
                            </p>
                        )}

                    </div>

                    {/* Add to cart */}
                    {isOutOfStock ? (
                        <button
                            disabled
                            className="w-full py-3 bg-[#d9dbd4] text-[#71796f] rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                remove_shopping_cart
                            </span>

                            {lang === "ar"
                                ? "غير متوفر"
                                : "Unavailable"}
                        </button>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-3 bg-[#F07A26] hover:bg-[#4E7A3C] text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                add_shopping_cart
                            </span>

                            {lang === "ar"
                                ? "أضف للسلة"
                                : "Add to Cart"}
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
}