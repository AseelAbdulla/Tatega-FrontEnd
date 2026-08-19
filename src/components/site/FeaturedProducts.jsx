import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ProductCard from "./ProductCard";

const API_URL = "http://127.0.0.1:8000/api";

export default function FeaturedProducts() {
    const { i18n } = useTranslation();

    const lang = i18n.language?.startsWith("en")
        ? "en"
        : "ar";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/products`
            );

            if (!response.ok) {
                throw new Error("Failed to load products");
            }

            const data = await response.json();

            const productsData =
                data.data || data;

            setProducts(productsData);

        } catch (err) {
            console.error(err);

            setError(
                lang === "ar"
                    ? "حدث خطأ أثناء تحميل المنتجات"
                    : "Failed to load products"
            );

        } finally {
            setLoading(false);
        }
    }

    // أول 4 منتجات فقط
    const featuredProducts = products.slice(0, 4);

    return (
        <section
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="py-12 px-4"
        >
            <div className="max-w-7xl mx-auto">

                {/* =========================
                    Header
                ========================== */}

                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h2 className="text-3xl font-bold text-[#191c18]">
                            {lang === "ar"
                                ? "منتجاتنا"
                                : "Our Products"}
                        </h2>

                        <p className="text-gray-500 mt-2">
                            {lang === "ar"
                                ? "اكتشف أفضل منتجاتنا"
                                : "Discover our best products"}
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="font-semibold text-[#24572b] hover:text-[#F07A26] transition-colors"
                    >
                        {lang === "ar"
                            ? "عرض الكل"
                            : "View All"}
                    </Link>

                </div>

                {/* =========================
                    Loading
                ========================== */}

                {loading && (
                    <div className="flex justify-center py-20">

                        <div
                            className="
                                w-10
                                h-10
                                border-4
                                border-[#4E7A3C]/20
                                border-t-[#4E7A3C]
                                rounded-full
                                animate-spin
                            "
                        />

                    </div>
                )}

                {/* =========================
                    Error
                ========================== */}

                {!loading && error && (
                    <div
                        className="
                            bg-red-50
                            text-red-600
                            p-5
                            rounded-xl
                            text-center
                        "
                    >
                        {error}
                    </div>
                )}

                {/* =========================
                    Empty
                ========================== */}

                {!loading &&
                    !error &&
                    featuredProducts.length === 0 && (

                        <div className="text-center py-16">

                            <span
                                className="
                                    material-symbols-outlined
                                    text-6xl
                                    text-gray-300
                                "
                            >
                                inventory_2
                            </span>

                            <p className="mt-4 text-gray-500">
                                {lang === "ar"
                                    ? "لا توجد منتجات حالياً"
                                    : "No products available"}
                            </p>

                        </div>
                    )}

                {/* =========================
                    Featured Products
                ========================== */}

                {!loading &&
                    !error &&
                    featuredProducts.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                xl:grid-cols-4
                                gap-6
                            "
                        >

                            {featuredProducts.map((product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isAuthenticated={true}
                                    onAddToCart={(product) =>
                                        console.log(
                                            "Add to cart:",
                                            product
                                        )
                                    }
                                />

                            ))}

                        </div>
                    )}

            </div>
        </section>
    );
}