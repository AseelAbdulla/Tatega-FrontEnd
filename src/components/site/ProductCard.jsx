import React from 'react';
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

    // الحصول على أقل سعر متاح (بداية السعر)
    const minPrice =
        product?.units?.length > 0
            ? Math.min(...product.units.map((u) => parseFloat(u.price)))
            : product?.price;

    const handleViewDetails = () => {
        navigate(`/products/${product.id}`);
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* الصورة - عند الضغط عليها تذهب للتفاصيل */}
            <div
                className="relative aspect-square overflow-hidden bg-[#f3f4ed] cursor-pointer"
                onClick={handleViewDetails}
            >
                {mainImage ? (
                    <img
                        src={mainImage}
                        alt={productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="material-symbols-outlined text-6xl">
                            image
                        </span>
                    </div>
                )}
            </div>

            {/* محتوى الكرت */}
            <div className="p-5 flex flex-col flex-1">
                <h3
                    onClick={handleViewDetails}
                    className="font-bold text-base text-[#2A2A2A] mb-2 cursor-pointer hover:text-[#24572b] transition-colors"
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
                        className="w-full py-3 bg-[#4E7A3C] hover:bg-[#24572b] text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            visibility
                        </span>
                        {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                    </button>
                </div>
            </div>
        </div>
    );
}
