import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:8000/api";

export default function HomeProducts() {

    const { i18n } = useTranslation();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const lang = i18n.language?.startsWith("en")
        ? "en"
        : "ar";

    useEffect(() => {

        fetch(`${API_URL}/products`)
            .then((response) => response.json())
            .then((data) => {

                const items = data.data || data;

                // نعرض فقط أول 4 منتجات في الصفحة الرئيسية
                setProducts(items.slice(0, 4));

            })
            .catch((error) => {
                console.error("Products Error:", error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    const getName = (product) => {

        if (!product.name) {
            return "";
        }

        if (typeof product.name === "string") {
            return product.name;
        }

        return product.name[lang] || product.name.ar || product.name.en || "";
    };

    if (loading) {
        return (
            <section className="py-16">
                <div className="text-center text-gray-500">
                    جاري تحميل المنتجات...
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4">

            <div className="max-w-7xl mx-auto">

                {/* العنوان */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#24572b]">
                            {lang === "ar"
                                ? "منتجاتنا المميزة"
                                : "Featured Products"}
                        </h2>

                        <p className="text-gray-500 mt-2">
                            {lang === "ar"
                                ? "اكتشف أفضل منتجاتنا"
                                : "Discover our best products"}
                        </p>
                    </div>

                    {/* عرض الكل */}
                    <Link
                        to="/products"
                        className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F07A26] text-white font-bold hover:bg-[#4E7A3C] transition-all"
                    >
                        {lang === "ar"
                            ? "عرض الكل"
                            : "View All"}

                        <span className="material-symbols-outlined">
                            arrow_back
                        </span>
                    </Link>

                </div>


                {/* المنتجات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {products.map((product) => (

                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
                        >

                            {/* الصورة */}
                            <div className="aspect-square bg-gray-100 overflow-hidden">

                                {product.image ? (

                                    <img
                                        src={product.image}
                                        alt={getName(product)}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />

                                ) : (

                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        لا توجد صورة
                                    </div>

                                )}

                            </div>


                            {/* البيانات */}
                            <div className="p-5">

                                <h3 className="font-bold text-gray-800 mb-2">
                                    {getName(product)}
                                </h3>

                                <div className="flex items-center justify-between">

                                    <span className="text-[#24572b] font-bold text-lg">
                                        {product.has_discount
                                            ? product.discount_price
                                            : product.price
                                        } ر.س
                                    </span>

                                    <span className="material-symbols-outlined text-[#F07A26]">
                                        arrow_back
                                    </span>

                                </div>

                            </div>

                        </Link>

                    ))}

                </div>


                {/* عرض الكل للموبايل */}
                <div className="flex justify-center mt-8 md:hidden">

                    <Link
                        to="/products"
                        className="px-8 py-3 rounded-xl bg-[#F07A26] text-white font-bold"
                    >
                        {lang === "ar"
                            ? "عرض كل المنتجات"
                            : "View All Products"}
                    </Link>

                </div>

            </div>

        </section>
    );
}