import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";

export default function BestSellersSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Products Error:", error);
      setError("تعذر تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (name) => {
    if (!name) return "منتج";

    if (typeof name === "string") {
      return name;
    }

    return (
      name.ar ||
      name.en ||
      Object.values(name)[0] ||
      "منتج"
    );
  };

  const getProductImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return "/images/product-placeholder.png";
    }

    const mainImage =
      product.images.find((image) => image.is_main) ||
      product.images[0];

    return `http://127.0.0.1:8000/storage/${mainImage.image_path}`;
  };

  if (loading) {
    return (
      <section className="py-12" dir="rtl">
        <div className="text-center text-gray-500">
          جاري تحميل المنتجات...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12" dir="rtl">
        <div className="text-center">
          <p className="text-red-500">{error}</p>

          <button
            onClick={loadProducts}
            className="mt-4 px-5 py-2 rounded-lg bg-black text-white"
          >
            إعادة المحاولة
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 md:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* العنوان */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              منتجاتنا
            </h2>

            <p className="mt-2 text-gray-500">
              اكتشف أفضل منتجاتنا
            </p>
          </div>

          <button className="text-sm md:text-base font-medium hover:underline">
            عرض الكل
          </button>

        </div>

        {/* المنتجات */}
        {products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            لا توجد منتجات حالياً
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300"
              >

                {/* الصورة */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">

                  <img
                    src={getProductImage(product)}
                    alt={getProductName(product.name)}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/product-placeholder.png";
                    }}
                  />

                  {product.has_discount && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      خصم
                    </span>
                  )}

                </div>

                {/* البيانات */}
                <div className="p-4">

                  <h3 className="font-semibold text-gray-900 text-base md:text-lg truncate">
                    {getProductName(product.name)}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">

                    {product.has_discount &&
                    product.discount_price ? (
                      <>
                        <span className="font-bold text-lg">
                          {product.discount_price}
                        </span>

                        <span className="text-sm text-gray-400 line-through">
                          {product.base_price}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-lg">
                        {product.base_price}
                      </span>
                    )}

                    <span className="text-sm text-gray-500">
                      ريال
                    </span>

                  </div>

                  <button
                    className="w-full mt-4 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition"
                  >
                    إضافة للسلة
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