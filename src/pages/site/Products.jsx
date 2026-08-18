import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getCategories } from "../../services/categoryService";

const API_URL = "http://127.0.0.1:8000/api";

export default function Products() {
    const { i18n } = useTranslation();

    const lang = i18n.language?.startsWith("en")
        ? "en"
        : "ar";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

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

            setProducts(
                productsData.data || productsData
            );

            setCategories(
                categoriesResponse.data ||
                categoriesResponse
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

    const filteredProducts = useMemo(() => {
        if (!selectedCategory) {
            return products;
        }

        return products.filter(
            product =>
                product.category?.id === selectedCategory
        );
    }, [products, selectedCategory]);

    function getProductName(product) {
        return (
            product.name?.[lang] ||
            product.name?.ar ||
            product.name?.en ||
            ""
        );
    }

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
                    {lang === "ar"
                        ? "المنتجات"
                        : "Products"}
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
                    {lang === "ar"
                        ? "التصنيفات"
                        : "Categories"}
                </h2>

                <div className="flex gap-3 overflow-x-auto pb-2">

                    {/* All */}

                    <button
                        onClick={() =>
                            setSelectedCategory(null)
                        }
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
                        {lang === "ar"
                            ? "الكل"
                            : "All"}
                    </button>


                    {/* Categories from Database */}

                    {categories.map(category => (

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

                    <div className="
                        w-10
                        h-10
                        border-4
                        border-[#4E7A3C]/20
                        border-t-[#4E7A3C]
                        rounded-full
                        animate-spin
                    " />

                </div>

            )}


            {/* Error */}

            {!loading && error && (

                <div className="
                    bg-red-50
                    text-red-600
                    p-5
                    rounded-xl
                    text-center
                ">
                    {error}
                </div>

            )}


            {/* Empty */}

            {!loading &&
                !error &&
                filteredProducts.length === 0 && (

                    <div className="text-center py-20">

                        <span className="
                            material-symbols-outlined
                            text-6xl
                            text-gray-300
                        ">
                            inventory_2
                        </span>

                        <p className="mt-4 text-gray-500">

                            {lang === "ar"
                                ? "لا توجد منتجات في هذا التصنيف"
                                : "No products found in this category"}

                        </p>

                    </div>

                )}


            {/* Products */}

            {!loading &&
                !error &&
                filteredProducts.length > 0 && (

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-4
                        gap-6
                    ">

                        {filteredProducts.map(product => (

                            <ProductCard
                                key={product.id}
                                product={product}
                                lang={lang}
                                getProductName={getProductName}
                            />

                        ))}

                    </div>

                )}

        </main>
    );
}


function ProductCard({
    product,
    lang,
    getProductName
}) {

    const hasDiscount =
        product.has_discount &&
        product.discount_price;

    const outOfStock =
        Number(product.stock) <= 0;

    return (

        <div className="
            group
            bg-white
            rounded-2xl
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
            overflow-hidden
            flex
            flex-col
        ">


            {/* Product Image */}

            <Link
                to={`/products/${product.id}`}
                className="
                    relative
                    aspect-square
                    overflow-hidden
                    bg-[#f3f4ed]
                "
            >

                {product.main_image ? (

                    <img
                        src={product.main_image}
                        alt={getProductName(product)}
                        className={`
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                            ${
                                outOfStock
                                    ? "opacity-50"
                                    : ""
                            }
                        `}
                    />

                ) : (

                    <div className="
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                        text-gray-300
                    ">
                        <span className="
                            material-symbols-outlined
                            text-6xl
                        ">
                            image
                        </span>
                    </div>

                )}


                {/* Out of stock */}

                {outOfStock && (

                    <span className="
                        absolute
                        top-3
                        right-3
                        bg-[#414940]
                        text-white
                        text-xs
                        font-bold
                        px-3
                        py-1.5
                        rounded-full
                    ">
                        {lang === "ar"
                            ? "نفد المخزون"
                            : "Out of Stock"}
                    </span>

                )}


                {/* Discount */}

                {hasDiscount && !outOfStock && (

                    <span className="
                        absolute
                        top-3
                        right-3
                        bg-[#F07A26]
                        text-white
                        text-xs
                        font-bold
                        px-3
                        py-1.5
                        rounded-full
                    ">
                        {lang === "ar"
                            ? "خصم"
                            : "Sale"}
                    </span>

                )}

            </Link>


            {/* Product Information */}

            <div className="
                p-5
                flex
                flex-col
                flex-1
            ">

                <Link
                    to={`/products/${product.id}`}
                    className="
                        font-bold
                        text-base
                        text-[#191c18]
                        hover:text-[#24572b]
                        transition-colors
                    "
                >
                    {getProductName(product)}
                </Link>


                {/* Category */}

                {product.category && (

                    <p className="
                        text-xs
                        text-gray-400
                        mt-1
                    ">

                        {typeof product.category.name === "object"
                            ? (
                                product.category.name?.[lang] ||
                                product.category.name?.ar ||
                                product.category.name?.en
                            )
                            : product.category.name}

                    </p>

                )}


                {/* Price */}

                <div className="mt-auto pt-5">

                    {hasDiscount ? (

                        <div className="
                            flex
                            items-center
                            gap-2
                            mb-4
                        ">

                            <span className="
                                text-[#24572b]
                                font-bold
                                text-lg
                            ">
                                {product.discount_price} ر.س
                            </span>

                            <span className="
                                text-gray-400
                                text-sm
                                line-through
                            ">
                                {product.price} ر.س
                            </span>

                        </div>

                    ) : (

                        <p className="
                            text-[#24572b]
                            font-bold
                            text-lg
                            mb-4
                        ">
                            {product.price} ر.س
                        </p>

                    )}


                    {/* Add to Cart */}

                    {outOfStock ? (

                        <button
                            disabled
                            className="
                                w-full
                                py-3
                                bg-gray-200
                                text-gray-500
                                rounded-xl
                                font-bold
                                flex
                                items-center
                                justify-center
                                gap-2
                                cursor-not-allowed
                            "
                        >

                            <span className="
                                material-symbols-outlined
                                text-lg
                            ">
                                remove_shopping_cart
                            </span>

                            {lang === "ar"
                                ? "غير متوفر"
                                : "Unavailable"}

                        </button>

                    ) : (

                        <button
                            onClick={() =>
                                console.log(
                                    "Add to cart:",
                                    product.id
                                )
                            }
                            className="
                                w-full
                                py-3
                                bg-[#F07A26]
                                hover:bg-[#4E7A3C]
                                text-white
                                rounded-xl
                                font-bold
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition-all
                                active:scale-95
                            "
                        >

                            <span className="
                                material-symbols-outlined
                                text-lg
                            ">
                                add_shopping_cart
                            </span>

                            {lang === "ar"
                                ? "أضف للسلة"
                                : "Add to cart"}

                        </button>

                    )}

                </div>

            </div>

        </div>

    );
}