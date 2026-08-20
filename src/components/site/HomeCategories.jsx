import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";

const fallbackImages = [
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1601379329542-31c59347e2b8?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=900&q=85",
];

export default function HomeCategories() {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage?.startsWith("en") ? "en" : "ar";
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        getCategories()
            .then((result) => {
                const list = Array.isArray(result) ? result : result?.data || [];
                if (isMounted) setCategories(list.slice(0, 4));
            })
            .catch((error) => console.error("Categories Error:", error))
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    const getName = (category) => {
        const name = category?.name;
        if (typeof name === "string") return name;
        return name?.[language] || name?.ar || name?.en || t("categories.fallback");
    };

    if (loading || !categories.length) return null;

    return (
        <section id="categories" className="bg-[#f3f4ed] px-4 py-16 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center">
                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#F07A26]">
                        {t("categories.eyebrow")}
                    </p>
                    <h2 className="text-3xl font-bold text-[#24572b] md:text-4xl">
                        {t("categories.title")}
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                        {t("categories.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            to="/products"
                            className="group relative h-[300px] overflow-hidden rounded-2xl shadow-md transition duration-500 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <img
                                src={category.image || fallbackImages[index % fallbackImages.length]}
                                alt={getName(category)}
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                onError={(event) => {
                                    event.currentTarget.src = fallbackImages[index % fallbackImages.length];
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-5 right-5 text-center text-white">
                                <h3 className="text-xl font-bold">{getName(category)}</h3>
                                <span className="mt-2 inline-block text-sm text-white/80">
                                    {t("categories.explore")}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}