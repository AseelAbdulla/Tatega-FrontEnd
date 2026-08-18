import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ProductsSection() {
    const { t, i18n } = useTranslation();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isArabic = i18n.language === "ar";

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load products");
                }

                return response.json();
            })
            .then((data) => {
                setProducts(data.data || []);
            })
            .catch(() => {
                setError(
                    isArabic
                        ? "حدث خطأ أثناء تحميل المنتجات"
                        : "Failed to load products"
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isArabic]);

    const isLoggedIn = !!localStorage.getItem("token");

    const getProductName = (product) => {
        return isArabic
            ? product.name?.ar
            : product.name?.en;
    };

    const getPrice = (product) => {
        if (
            product.has_discount &&
            product.discount_price
        ) {
            return product.discount_price;
        }

        return product.price;
    };

    if (loading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <p>
                        {isArabic
                            ? "جاري تحميل المنتجات..."
                            : "Loading products..."}
                    </p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-red-500">
                        {error}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">

            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {t("home.products.title")}
                        </h2>

                        <p className="text-gray-500 mt-2">
                            {t("home.products.subtitle")}
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="text-primary font-semibold hover:underline"
                    >
                        {t("home.products.viewAll")}
                    </Link>

                </div>


                {/* Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {products.slice(0, 8).map((product) => (

                        <div
                            key={product.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition"
                        >

                            {/* Image */}
                            <Link to={`/products/${product.id}`}>

                                <div className="aspect-square bg-gray-50 overflow-hidden">

                                    {product.main_image ? (

                                        <img
                                            src={product.main_image}
                                            alt={getProductName(product)}
                                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                        />

                                    ) : (

                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            {isArabic
                                                ? "لا توجد صورة"
                                                : "No Image"}
                                        </div>

                                    )}

                                </div>

                            </Link>


                            {/* Information */}
                            <div className="p-4">

                                <Link
                                    to={`/products/${product.id}`}
                                >
                                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 hover:text-primary">
                                        {getProductName(product)}
                                    </h3>
                                </Link>


                                {/* Price */}
                                <div className="mt-3">

                                    {product.has_discount &&
                                    product.discount_price ? (

                                        <div className="flex items-center gap-2">

                                            <span className="text-primary font-bold">
                                                {product.discount_price}
                                            </span>

                                            <span className="text-gray-400 line-through text-sm">
                                                {product.price}
                                            </span>

                                        </div>

                                    ) : (

                                        <span className="text-primary font-bold">
                                            {product.price}
                                        </span>

                                    )}

                                </div>


                                {/* Add to cart */}
                                {isLoggedIn && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            // سنربطه بالـ Cart API بعد ذلك
                                            console.log(
                                                "Add to cart:",
                                                product.id
                                            );
                                        }}
                                        className="w-full mt-4 bg-primary text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition"
                                    >
                                        {t("home.products.addToCart")}
                                    </button>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}