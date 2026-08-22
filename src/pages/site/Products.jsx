
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getCategories } from "../../services/categoryService";
import ProductCard from "../../components/site/ProductCard";

const API_URL = "http://127.0.0.1:8000/api";

export default function Products() {
    const { i18n } = useTranslation();

    const lang = i18n.language?.startsWith("en") ? "en" : "ar";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError("");

            const [productsResponse, categoriesResponse] =
                await Promise.all([
                    fetch(`${API_URL}/products`),
                    getCategories()
                ]);

            if (!productsResponse.ok) {
                throw new Error("Failed to load products");
            }

            const productsData = await productsResponse.json();

            setProducts(productsData.data || productsData);

            setCategories(
                categoriesResponse.data || categoriesResponse
            );
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

    useEffect(() => {
        loadData();
    }, []);

    const filteredProducts = useMemo(() => (
        selectedCategory
            ? products.filter((product) => product.category?.id === selectedCategory)
            : products
    ), [products, selectedCategory]);

    function getCategoryName(category) {
        if (typeof category.name === "object") {
            return (
                category.name?.[lang] ||
                category.name?.ar ||
                category.name?.en ||
                ""
            );
        }

        return category.name || "";
    }

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#191c18]">
                    {lang === "ar" ? "المنتجات" : "Products"}
                </h1>

                <p className="text-gray-500 mt-2">
                    {lang === "ar"
                        ? "اكتشف منتجاتنا المختارة بعناية"
                        : "Discover our carefully selected products"}
                </p>
            </div>

            {/* Categories */}
            <div className="mb-10">
                <h2 className="font-bold text-lg mb-4">
                    {lang === "ar" ? "التصنيفات" : "Categories"}
                </h2>

                <div className="flex gap-3 overflow-x-auto pb-2">
                    {/* All */}
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`
                            px-6 py-2.5
                            rounded-full
                            font-bold
                            text-sm
                            whitespace-nowrap
                            transition-all
                            ${
                                selectedCategory === null
                                    ? "bg-[#F07A26] text-white"
                                    : "bg-white text-[#414940] border border-[#4E7A3C]"
                            }
                        `}
                    >
                        {lang === "ar" ? "الكل" : "All"}
                    </button>

                    {/* Categories from Database */}
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() =>
                                setSelectedCategory(category.id)
                            }
                            className={`
                                px-6 py-2.5
                                rounded-full
                                font-bold
                                text-sm
                                whitespace-nowrap
                                transition-all
                                ${
                                    selectedCategory === category.id
                                        ? "bg-[#F07A26] text-white"
                                        : "bg-white text-[#414940] border border-[#4E7A3C]"
                                }
                            `}
                        >
                            {getCategoryName(category)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#4E7A3C]/20 border-t-[#4E7A3C] rounded-full animate-spin" />
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="bg-red-50 text-red-600 p-5 rounded-xl text-center">
                    {error}
                </div>
            )}

            {/* Empty */}
            {!loading && !error && filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <span className="material-symbols-outlined text-6xl text-gray-300">
                        inventory_2
                    </span>
                    <p className="mt-4 text-gray-500">
                        {lang === "ar"
                            ? "لا توجد منتجات في هذا التصنيف"
                            : "No products found in this category"}
                    </p>
                </div>
            )}

            {/* Products Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}


