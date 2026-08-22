import { useTranslation } from 'react-i18next';

import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const lang = i18n.language?.startsWith("en") ? "en" : "ar";

    // استخراج بيانات المنتج
    const productName =
        product?.name?.[lang] ||
        product?.name?.ar ||
        product?.name?.en ||
        "";

    const images = product?.images || [];
    const mainImage =
        product?.main_image ||
        images.find((image) => image.is_main)?.image ||
        images[0]?.image ||
        "/images/product-placeholder.png";

    const imageSrc = mainImage || "/images/product-placeholder.png";

    const stock = Array.isArray(product?.units) && product.units.length > 0
        ? (() => {
            const unitsStock = product.units.reduce(
                (total, unit) => total + Number(unit?.stock ?? unit?.unit_stock ?? 0),
                0
            );
            return unitsStock > 0 ? unitsStock : Number(product.stock ?? 0);
        })()
        : product?.stock === undefined
            ? null
            : Number(product.stock);
    const isOutOfStock = stock !== null && stock <= 0;

    // الحصول على أقل سعر متاح (بداية السعر)
    const minPrice =
        product?.units?.length > 0
            ? Math.min(...product.units.map((u) => parseFloat(u.price)))
            : product?.price;

    const handleViewDetails = () => {
        if (isOutOfStock) {
            return;
        }

        navigate(`/products/${product.id}`);
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* الصورة - عند الضغط عليها تذهب للتفاصيل */}
            <div
                className={`relative aspect-square overflow-hidden bg-[#f3f4ed] ${
                    !isOutOfStock ? "cursor-pointer" : "cursor-not-allowed"
                } ${
                    isOutOfStock ? "after:absolute after:inset-0 after:z-15 after:bg-white/60" : ""
                }`}
                onClick={handleViewDetails}
            >
                <img
                    src={imageSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 block h-full w-full scale-110 object-cover object-center opacity-25 blur-md"
                />
                <img
                    src={imageSrc}
                    alt={productName}
                    className="absolute inset-0 z-10 block h-full w-full object-contain object-center"
                    onError={(event) => {
                        event.currentTarget.src = "/images/product-placeholder.png";
                    }}
                />
                {isOutOfStock && (
                    <span className="absolute inset-0 z-20 flex items-center justify-center text-center text-lg font-bold text-gray-700">
                        {lang === "ar" ? "نفد المخزون" : "Out of stock"}
                    </span>
                )}
            </div>

            {/* محتوى الكرت */}
            <div className="p-5 flex flex-col flex-1">
                <h3
                    onClick={handleViewDetails}
                    className={`font-bold text-base text-[#2A2A2A] mb-2 transition-colors ${
                        !isOutOfStock ? "cursor-pointer hover:text-[#24572b]" : "cursor-not-allowed"
                    }`}
                >
                    {productName}
                </h3>

                {/* التصنيف إن وجد */}
                {product?.category && (
                    <p className="text-xs text-gray-400 mb-3">
                        {typeof product.category.name === "object"
                            ? product.category.name?.[lang] ||
                              product.category.name?.ar ||
                              product.category.name?.en
                            : product.category.name}
                    </p>
                )}

                {/* عرض السعر */}
                <div className="mt-auto pt-2">
                    <p className="text-[#71796f] text-xs mb-1">
                        {lang === "ar" ? "يبدأ من" : "Starting from"}
                    </p>
                    <p className="text-[#24572b] font-bold text-lg mb-4">
                        {minPrice} {lang === "ar" ? "ر.س" : "SAR"}
                    </p>

                    {/* زر عرض التفاصيل */}
                    <button
                        onClick={handleViewDetails}
                        disabled={isOutOfStock}
                        className={`w-full py-3 text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                            isOutOfStock
                                ? "bg-gray-400 hover:bg-gray-500"
                                : "bg-[#4E7A3C] hover:bg-[#24572b]"
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {isOutOfStock ? "block" : "visibility"}
                        </span>
                        {isOutOfStock
                            ? (lang === "ar" ? "نفد المخزون" : "Out of stock")
                            : (lang === "ar" ? "عرض التفاصيل" : "View Details")}
                    </button>
                </div>
            </div>
        </div>
    );
}
