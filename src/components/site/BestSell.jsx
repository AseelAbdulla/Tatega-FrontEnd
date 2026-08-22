import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/productService";

const getProductStock = (product) => {
    if (Array.isArray(product?.units) && product.units.length > 0) {
        const unitsStock = product.units.reduce(
            (total, unit) => total + Number(unit?.stock ?? unit?.unit_stock ?? 0),
            0
        );

        return unitsStock > 0 ? unitsStock : Number(product.stock ?? 0);
    }

    return product?.stock === undefined ? null : Number(product.stock);
};

const isAvailable = (product) => {
    const stock = getProductStock(product);
    return stock === null || stock > 0;
};

const isDiscounted = (product) =>
    Boolean(product?.has_discount && product?.discount_price);

const getSalesCount = (product) => {
    const salesFields = [
        "sales_count",
        "sold_count",
        "total_sold",
        "units_sold",
        "orders_count",
        "order_items_count",
    ];

    return Math.max(
        0,
        ...salesFields.map((field) => Number(product?.[field] ?? 0))
    );
};

const isBestSeller = (product) =>
    Boolean(
        product?.is_best_seller ||
        product?.is_bestseller ||
        product?.is_best_selling ||
        product?.best_seller ||
        product?.featured
    );

const selectHomepageProducts = (products) => {
    const availableProducts = products.filter(isAvailable);
    const promotedProducts = availableProducts
        .filter((product) => isDiscounted(product) || isBestSeller(product) || getSalesCount(product) > 0)
        .sort((first, second) => {
            const discountDifference = Number(isDiscounted(second)) - Number(isDiscounted(first));
            return discountDifference || getSalesCount(second) - getSalesCount(first);
        });

    return [
        ...promotedProducts,
        ...availableProducts.filter(
            (product) => !promotedProducts.some((promoted) => promoted.id === product.id)
        ),
    ].slice(0, 5);
};

function BestSell() {
    // استخراج دالة الترجمة t واللغة الحالية
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.resolvedLanguage?.startsWith("en") ? "en" : "ar";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");
                const result = await getProducts();
                if (isMounted) setProducts(Array.isArray(result) ? selectHomepageProducts(result) : []);
            } catch (requestError) {
                console.error("Products Error:", requestError);
                if (isMounted) setError(t("products.errors.load"));
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadProducts();
        return () => { isMounted = false; };
    }, [t]);

    const getLocalizedValue = (value) => {
        if (!value) return "";
        if (typeof value === "string") return value;
        return value[currentLanguage] || value.ar || value.en || "";
    };

    const getMainImage = (product) => {
        if (product?.main_image) return product.main_image;
        const images = Array.isArray(product?.images) ? product.images : [];
        const mainImage = images.find((image) => image.is_main === true || image.is_main === 1 || image.is_main === "1") || images[0];
        return mainImage?.image || mainImage?.image_url || mainImage?.url || mainImage?.image_path || "/images/product-placeholder.png";
    };

    const getProductName = (product) => getLocalizedValue(product?.name) || t("products.fallbackName");

    const getPrice = (product) => product.has_discount && product.discount_price
        ? product.discount_price
        : product.price ?? product.base_price;

    const handleAddToCart = (product) => {
        window.dispatchEvent(new CustomEvent("cart:add", { detail: product }));
    };


    return (

        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {t("products.title")}
                        </h2>

                        <p className="mt-2 text-gray-500">
                            {t("products.subtitle")}
                        </p>
                    </div>

                    {/* عرض الكل */}
                    <Link
                        to="/products"
                        className="font-semibold text-primary hover:underline"
                    >
                        {t("products.viewAll")}
                    </Link>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="py-10 text-center text-gray-500">
                            {t("products.loading")}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="py-10 text-center text-red-500">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <div className="py-10 text-center text-gray-500">
                            {t("products.empty")}
                        </div>
                    )}

                {/* Products */}
                {!loading &&
                    !error &&
                    products.length > 0 && (

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-[260px_260px] lg:gap-6">

                            {products.map((product, index) => (

                                <div
                                    key={product.id}
                                    className={`${index === 0 ? "sm:col-span-2 md:col-span-2 md:row-span-2" : "col-span-1 md:h-full"} group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
                                >

                                    {/* الصورة الرئيسية */}
                                    <Link
                                        to={`/products/${product.id}`}
                                    >
                                        <div className={`${index === 0 ? "h-[240px] md:h-[280px]" : "h-[220px] md:h-[150px]"} relative isolate overflow-hidden bg-[#f5f1e9]`}>

                                            <img
                                                src={getMainImage(product)}
                                                alt=""
                                                aria-hidden="true"
                                                className="absolute inset-0 block h-full w-full scale-110 object-cover object-center opacity-25 blur-md"
                                            />
                                            <img
                                                src={getMainImage(product)}
                                                alt={getProductName(product)}
                                                className="absolute inset-0 z-10 block h-full w-full object-contain object-center p-0"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/images/product-placeholder.png";
                                                }}
                                            />

                                            {/* الخصم */}
                                            {product.has_discount &&
                                                product.discount_price && (
                                                    <span className="absolute right-3 top-3 rounded-full bg-[#24572b] px-3 py-1 text-xs font-bold text-white">
                                                        {t("products.sale")}
                                                    </span>
                                                )}
                                        </div>
                                    </Link>

                                    {/* معلومات المنتج */}
                                    <div className={`${index === 0 ? "p-5 md:p-6" : "p-4"}`}>

                                        <Link to={`/products/${product.id}`}>
                                            <h3 className={`${index === 0 ? "text-xl md:text-2xl" : "text-base"} line-clamp-2 min-h-12 font-semibold text-gray-900 hover:text-primary`}>
                                                {getProductName(product)}
                                            </h3>
                                        </Link>

                                        {/* السعر */}
                                        <div className="mt-3">

                                            {product.has_discount &&
                                                product.discount_price ? (

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <span className="text-lg font-bold text-primary">
                                                        {product.discount_price}
                                                    </span>

                                                    <span className="text-sm text-gray-400 line-through">
                                                        {product.price ?? product.base_price}
                                                    </span>

                                                    <span className="text-sm text-gray-500">
                                                        {t("products.currency")}
                                                    </span>

                                                </div>

                                            ) : (

                                                <div className="flex items-center gap-1">

                                                    <span className="text-lg font-bold text-primary">
                                                        {getPrice(product)}
                                                    </span>

                                                    <span className="text-sm text-gray-500">
                                                            {t("products.currency")}
                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                        {/* إضافة للسلة */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                            disabled={
                                                product.stock !== undefined &&
                                                product.stock <= 0
                                            }
                                            className="mt-4 w-full rounded-xl bg-[#F07A26] px-4 py-2.5 font-semibold text-white transition hover:bg-[#4E7A3C] disabled:cursor-not-allowed disabled:bg-gray-300"
                                        >
                                            {product.stock !== undefined &&
                                                product.stock <= 0
                                                ? t("products.outOfStock")
                                                : t("products.addToCart")}
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </div>
        </section>
    );
}

export default BestSell;