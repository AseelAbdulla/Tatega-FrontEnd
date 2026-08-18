import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reviewService } from '../../services/reviewService';
import { Link } from "react-router-dom";


export default function Reviews() {
    const { t } = useTranslation();
    

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        reviewService.getReviews()
            .then((data) => {
                console.log('REVIEWS FROM API:', data);
                // نعرض فقط التقييمات المقبولة
                const approvedReviews = data.filter(
                    (review) => review.status === 'approved'
                );

                setReviews(approvedReviews);
            })
            .catch((error) => {
                console.error('Error fetching reviews:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="py-16 text-center">
                <p className="text-primary font-bold">
                    {t('reviews.loading')}
                </p>
            </section>
        );
    }

    return (
        <section id="reviews" className="py-16 bg-surface-container/50">
            <div className="max-w-7xl mx-auto px-4 md:px-16">

                {/* العنوان */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
    <div className="text-center md:text-right">
        <span className="text-accent-terracotta font-bold text-xs mb-3 block">
            {t('reviews.subtitle')}
        </span>

        <h2 className="text-3xl font-bold text-primary">
            {t('reviews.title')}
        </h2>
    </div>

    <Link
        to="/reviews"
        className="bg-accent-terracotta text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-accent-hover transition-all active:scale-95"
    >
        <span className="material-symbols-outlined">
            add_comment
        </span>

      {t("reviews.addReview")}
    </Link>
</div>
                {/* إذا مافي تقييمات */}
                {reviews.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-on-surface-variant">
                            {t('reviews.empty')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-black/5"
                            >

                                {/* النجوم */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <span
                                            key={index}
                                            className={`material-symbols-outlined text-lg ${
                                                index < review.rating
                                                    ? 'text-accent-terracotta'
                                                    : 'text-gray-300'
                                            }`}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>

                                {/* التعليق */}
                                <p className="text-on-surface-variant leading-relaxed mb-6">
                                    {review.comment}
                                </p>

                                {/* اسم المستخدم */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                                        <span className="material-symbols-outlined">
                                            person
                                        </span>
                                    </div>

                                    <div>
                                        <p className="font-bold text-primary">
                                            {review.user?.name ||
                                                review.visitor_name ||
                                                t('reviews.customer')}
                                        </p>

                                        <p className="text-xs text-on-surface-variant">
                                            {review.product?.name
                                                ? (() => {
                                                    try {
                                                        const productName =
                                                            typeof review.product.name === 'string'
                                                                ? JSON.parse(review.product.name)
                                                                : review.product.name;

                                                        return (
                                                            productName.ar ||
                                                            productName.en ||
                                                            ''
                                                        );
                                                    } catch {
                                                        return review.product.name;
                                                    }
                                                })()
                                                : ''}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </section>
    );
}