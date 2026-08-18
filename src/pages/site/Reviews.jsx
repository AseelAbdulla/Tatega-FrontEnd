import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { reviewService } from "../../services/reviewService";

export default function Reviews() {
    const { t, i18n } = useTranslation();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState("latest");

    const currentLang = i18n.language?.startsWith("en") ? "en" : "ar";

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const data = await reviewService.getReviews();

            const approvedReviews = data.filter(
                (review) => review.status === "approved"
            );

            setReviews(approvedReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const getProductName = (product) => {
        if (!product?.name) return "";

        try {
            const productName =
                typeof product.name === "string"
                    ? JSON.parse(product.name)
                    : product.name;

            return (
                productName[currentLang] ||
                productName.ar ||
                productName.en ||
                ""
            );
        } catch {
            return product.name;
        }
    };

    const getCustomerName = (review) => {
        return (
            review.user?.name ||
            review.visitor_name ||
            t("reviews.customer")
        );
    };

    const sortedReviews = useMemo(() => {
        const result = [...reviews];

        if (sortBy === "highest") {
            return result.sort((a, b) => b.rating - a.rating);
        }

        if (sortBy === "lowest") {
            return result.sort((a, b) => a.rating - b.rating);
        }

        return result.sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        );
    }, [reviews, sortBy]);

    const averageRating = useMemo(() => {
        if (!reviews.length) return 0;

        const total = reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
        );

        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    const ratingCounts = useMemo(() => {
        return [5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(
                (review) => Number(review.rating) === rating
            ).length;

            const percentage = reviews.length
                ? Math.round((count / reviews.length) * 100)
                : 0;

            return {
                rating,
                count,
                percentage,
            };
        });
    }, [reviews]);

    const handleStarClick = (rating) => {
        setSelectedRating(rating);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // المنتج لم يتم ربطه بعد لأن Product API لم يجهز.
        // النموذج حاليًا جاهز من ناحية التصميم والتفاعل.
        console.log("Selected rating:", selectedRating);
        console.log("Review form ready.");
    };

    if (loading) {
        return (
            <section className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent-terracotta/20 border-t-accent-terracotta rounded-full animate-spin mx-auto mb-4" />

                    <p className="text-primary font-bold">
                        {t("reviews.loading")}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <div
            id="reviews"
            className="bg-background text-on-background"
        >
            <main className="max-w-7xl mx-auto px-4 md:px-16 py-12 md:py-16">

                {/* Page Header */}
                <header className="mb-10 md:mb-12 text-center md:text-right">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                        {t("reviews.title")}
                    </h1>

                    <p className="text-on-surface-variant max-w-2xl leading-relaxed mx-auto md:mx-0">
                        {t("reviews.subtitle")}
                    </p>
                </header>

                {/* Top Bento Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">

                    {/* Rating Summary */}
                    <section className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-black/5">

                        <h2 className="text-xl font-bold text-on-surface mb-6">
                            {t("reviews.summary")}
                        </h2>

                        <div className="flex items-baseline gap-3 mb-3">
                            <span className="text-5xl md:text-6xl font-bold text-accent-terracotta">
                                {averageRating}
                            </span>

                            <span className="text-on-surface-variant">
                                / 5
                            </span>
                        </div>

                        {/* Average Stars */}
                        <div className="flex gap-1 mb-3">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span
                                    key={index}
                                    className={`material-symbols-outlined text-2xl ${
                                        index <
                                        Math.round(Number(averageRating))
                                            ? "text-accent-terracotta"
                                            : "text-gray-300"
                                    }`}
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    star
                                </span>
                            ))}
                        </div>

                        <p className="text-sm text-on-surface-variant mb-8">
                            {t("reviews.basedOn", {
                                count: reviews.length,
                            })}
                        </p>

                        {/* Rating Breakdown */}
                        <div className="space-y-4">
                            {ratingCounts.map((item) => (
                                <div
                                    key={item.rating}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-16 text-sm text-on-surface-variant shrink-0">
                                        {t("reviews.stars", {
                                            count: item.rating,
                                        })}
                                    </span>

                                    <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{
                                                width: `${item.percentage}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="w-10 text-left text-xs text-on-surface-variant">
                                        {item.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Review Form */}
                    <section className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-black/5">

                        <h2 className="text-xl font-bold text-on-surface mb-2">
                            {t("reviews.shareOpinion")}
                        </h2>

                        <p className="text-on-surface-variant mb-6">
                            {t("reviews.shareDescription")}
                        </p>

                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit}
                        >

                            {/* Rating */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-on-surface-variant">
                                    {t("reviews.overallRating")}
                                </label>

                                <div className="flex gap-2">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => {
                                            const rating = index + 1;

                                            return (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() =>
                                                        handleStarClick(
                                                            rating
                                                        )
                                                    }
                                                    className={`material-symbols-outlined text-4xl transition-all active:scale-90 ${
                                                        rating <=
                                                        selectedRating
                                                            ? "text-accent-terracotta"
                                                            : "text-gray-300 hover:text-accent-terracotta"
                                                    }`}
                                                    style={{
                                                        fontVariationSettings:
                                                            "'FILL' 1",
                                                    }}
                                                >
                                                    star
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            {/* Name + Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-on-surface-variant">
                                        {t("reviews.name")}
                                    </label>

                                    <input
                                        type="text"
                                        placeholder={t(
                                            "reviews.namePlaceholder"
                                        )}
                                        className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent-terracotta"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-on-surface-variant">
                                        {t("reviews.email")}
                                    </label>

                                    <input
                                        type="email"
                                        placeholder={t(
                                            "reviews.emailPlaceholder"
                                        )}
                                        className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent-terracotta"
                                    />
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-on-surface-variant">
                                    {t("reviews.comment")}
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder={t(
                                        "reviews.commentPlaceholder"
                                    )}
                                    className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-accent-terracotta"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3.5 bg-accent-terracotta text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-accent-hover hover:-translate-y-0.5 active:scale-95"
                            >
                                {t("reviews.publish")}

                                <span className="material-symbols-outlined">
                                    send
                                </span>
                            </button>

                        </form>
                    </section>
                </div>

                {/* Reviews Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                    <h3 className="text-xl font-bold text-on-surface">
                        {t("reviews.latest")}
                    </h3>

                    <select
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(event.target.value)
                        }
                        className="w-full md:w-auto bg-white border border-outline-variant/30 rounded-full px-5 py-3 text-sm outline-none"
                    >
                        <option value="latest">
                            {t("reviews.sort.latest")}
                        </option>

                        <option value="highest">
                            {t("reviews.sort.highest")}
                        </option>

                        <option value="lowest">
                            {t("reviews.sort.lowest")}
                        </option>
                    </select>
                </div>

                {/* Reviews Feed */}
                {sortedReviews.length === 0 ? (
                    <div className="bg-white rounded-2xl p-10 text-center border border-black/5">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">
                            reviews
                        </span>

                        <p className="text-on-surface-variant">
                            {t("reviews.empty")}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">

                        {sortedReviews.map((review) => (
                            <article
                                key={review.id}
                                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">

                                    <div className="flex gap-4 items-center">

                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                                            <span className="text-primary font-bold">
                                                {getCustomerName(
                                                    review
                                                ).charAt(0)}
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-on-surface">
                                                {getCustomerName(
                                                    review
                                                )}
                                            </h4>

                                            <div className="flex gap-0.5 mt-1">
                                                {Array.from({
                                                    length: 5,
                                                }).map(
                                                    (_, index) => (
                                                        <span
                                                            key={
                                                                index
                                                            }
                                                            className={`material-symbols-outlined text-sm ${
                                                                index <
                                                                Number(
                                                                    review.rating
                                                                )
                                                                    ? "text-accent-terracotta"
                                                                    : "text-gray-300"
                                                            }`}
                                                            style={{
                                                                fontVariationSettings:
                                                                    "'FILL' 1",
                                                            }}
                                                        >
                                                            star
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                            {getProductName(
                                                review.product
                                            ) && (
                                                <p className="text-xs text-on-surface-variant mt-1">
                                                    {getProductName(
                                                        review.product
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <time className="text-xs text-on-surface-variant opacity-60">
                                        {review.created_at
                                            ? new Date(
                                                review.created_at
                                            ).toLocaleDateString(
                                                currentLang === "ar"
                                                    ? "ar-SA"
                                                    : "en-US"
                                            )
                                            : ""}
                                    </time>
                                </div>

                                <p className="text-on-surface-variant leading-relaxed">
                                    {review.comment}
                                </p>
                            </article>
                        ))}
                    </div>
                )}

                {/* Load More */}
                {sortedReviews.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <button
                            type="button"
                            className="w-full md:w-auto px-8 py-3.5 bg-white border-2 border-primary text-primary font-bold rounded-xl transition-all hover:bg-primary hover:text-white active:scale-95"
                        >
                            {t("reviews.loadMore")}
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}