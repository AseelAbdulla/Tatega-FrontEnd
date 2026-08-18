<<<<<<< Updated upstream

// import HeroCarousel from '../../components/site/HeroCarousel';
// import BestSellersSection from '../../components/site/BestSellersSection';
// import CategoriesGrid from '../../components/site/CategoriesGrid';
// import WhyUsTimeline from '../../components/site/WhyUsTimeline';
import StoreLocator from '../../components/site/StoreLocator';
// import TestimonialsCarousel from '../../components/site/TestimonialsCarousel';

export default function Home() {
=======
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import StoreLocator from "../../components/site/StoreLocator";

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentLanguage = i18n.language?.startsWith("en")
    ? "en"
    : "ar";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/products`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();

        const productData = Array.isArray(result)
          ? result
          : result.data || [];

        // نعرض أول 8 منتجات في الصفحة الرئيسية
        setProducts(productData.slice(0, 8));

      } catch (error) {
        console.error(error);

        setError(
          currentLanguage === "ar"
            ? "تعذر تحميل المنتجات"
            : "Unable to load products"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentLanguage]);

  // اسم المنتج حسب اللغة
  const getProductName = (product) => {
    return (
      product.name?.[currentLanguage] ||
      product.name?.ar ||
      product.name?.en ||
      ""
    );
  };

  // الصورة الرئيسية فقط
  const getMainImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return "/images/product-placeholder.png";
    }

    const mainImage =
      product.images.find(
        (image) =>
          image.is_main === true ||
          image.is_main === 1
      ) || product.images[0];

    return (
      mainImage.image ||
      "/images/product-placeholder.png"
    );
  };

  // إضافة للسلة
  const handleAddToCart = (product) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    // سنربطه بالـ Cart API بعد التأكد من عرض المنتجات
    console.log("Add to cart:", product);

    alert(
      currentLanguage === "ar"
        ? "تمت إضافة المنتج إلى السلة"
        : "Product added to cart"
    );
  };

>>>>>>> Stashed changes
  return (
    <div>

      {/* =========================
          Products Section
      ========================= */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {t("products.title", "منتجاتنا")}
              </h2>

              <p className="mt-2 text-gray-500">
                {t(
                  "products.subtitle",
                  "اكتشف أفضل منتجاتنا"
                )}
              </p>
            </div>

            {/* عرض الكل */}
            <Link
              to="/products"
              className="font-semibold text-primary hover:underline"
            >
              {t("products.viewAll", "عرض الكل")}
            </Link>

          </div>

          {/* Loading */}
          {loading && (
            <div className="py-10 text-center text-gray-500">
              {currentLanguage === "ar"
                ? "جاري تحميل المنتجات..."
                : "Loading products..."}
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
                {currentLanguage === "ar"
                  ? "لا توجد منتجات حالياً"
                  : "No products available"}
              </div>
            )}

          {/* Products */}
          {!loading &&
            !error &&
            products.length > 0 && (

              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">

                {products.map((product) => (

                  <div
                    key={product.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
                  >

                    {/* الصورة الرئيسية */}
                    <Link
                      to={`/products/${product.id}`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-100">

                        <img
                          src={getMainImage(product)}
                          alt={getProductName(product)}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/product-placeholder.png";
                          }}
                        />

                        {/* الخصم */}
                        {product.has_discount &&
                          product.discount_price && (
                            <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                              {currentLanguage === "ar"
                                ? "خصم"
                                : "SALE"}
                            </span>
                          )}

                      </div>
                    </Link>

                    {/* معلومات المنتج */}
                    <div className="p-4">

                      <Link
                        to={`/products/${product.id}`}
                      >
                        <h3 className="line-clamp-2 min-h-[48px] font-semibold text-gray-900 hover:text-primary">
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
                              {product.price}
                            </span>

                            <span className="text-sm text-gray-500">
                              {currentLanguage === "ar"
                                ? "ريال"
                                : "YER"}
                            </span>

                          </div>

                        ) : (

                          <div className="flex items-center gap-1">

                            <span className="text-lg font-bold text-primary">
                              {product.price}
                            </span>

                            <span className="text-sm text-gray-500">
                              {currentLanguage === "ar"
                                ? "ريال"
                                : "YER"}
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
                        className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {product.stock !== undefined &&
                        product.stock <= 0
                          ? currentLanguage === "ar"
                            ? "غير متوفر"
                            : "Out of stock"
                          : t(
                              "products.addToCart",
                              "أضف للسلة"
                            )}
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </div>
      </section>

      {/* Store Locator */}
      <StoreLocator />

    </div>
  );
}