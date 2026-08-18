import { useEffect, useState } from 'react';
import bannerService from '../../services/bannerService';
import i18n from '../../i18n';

function BannerCarousel() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const language = i18n.language?.startsWith('en') ? 'en' : 'ar';

    // جلب البنرات من Laravel
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);

                const response = await bannerService.getBanners();

                const data =
                    response.data?.data ??
                    response.data ??
                    response;

                setBanners(data);
            } catch (error) {
                console.error('Failed to fetch banners:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    // الحركة التلقائية
    useEffect(() => {
        if (banners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    // Loading
    if (loading) {
        return (
            <section className="relative h-[80vh] md:h-[90vh] bg-black flex items-center justify-center">
                <p className="text-white text-lg">
                    جاري تحميل البنرات...
                </p>
            </section>
        );
    }

    // لا يوجد بنرات
    if (!banners.length) {
        return null;
    }

    return (
        <section
            id="hero-carousel"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            className="relative h-[80vh] md:h-[90vh] overflow-hidden bg-black"
        >
            {/* =========================
                Slides
            ========================== */}

            {banners.map((banner, index) => {
                const slogan =
                    banner.slogan?.[language] ||
                    banner.slogan?.ar ||
                    banner.slogan?.en ||
                    '';

                const isActive = index === currentIndex;

                return (
                    <div
                        key={banner.id}
                        className={`
                            absolute inset-0
                            w-full h-full
                            transition-opacity
                            duration-1000
                            ease-in-out
                            ${isActive
                                ? 'opacity-100 z-10'
                                : 'opacity-0 z-0 pointer-events-none'
                            }
                        `}
                    >
                        {/* =========================
                            Image
                        ========================== */}


                        <img
                            src={
                                banner.image_url
                                    ? banner.image_url
                                    : `http://127.0.0.1:8000/storage/${banner.image_path}`
                            }
                            alt={slogan}
                            className="absolute inset-0 w-full h-full object-cover opacity-70"
                        />


                        {/* =========================
                            Dark Gradient
                        ========================== */}

                        <div
                            className="
                                absolute inset-0
                                bg-linear-to-t
                                from-black/70
                                via-black/30
                                to-transparent
                            "
                        />

                        {/* =========================
                            Content
                        ========================== */}

                        <div
                            className="
                                absolute inset-0
                                flex items-center
                                justify-center
                                px-4
                            "
                        >
                            <div
                                className={`
                                    max-w-4xl
                                    w-full
                                    text-center
                                    transition-all
                                    duration-700
                                    ease-out
                                    delay-300
                                    ${isActive
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-5 opacity-0'
                                    }
                                `}
                            >
                                {/* Brand */}

                                <div className="mb-6 inline-flex flex-col items-center">
                                    <span
                                        className="
                                            text-white
                                            text-3xl
                                            font-bold
                                            mb-2
                                            tracking-widest
                                        "
                                    >
                                        تعتيقة
                                    </span>

                                    <div
                                        className="
                                            h-0.5
                                            w-12
                                            bg-\[\#F07A26\]
                                        "
                                    />
                                </div>

                                {/* =========================
                                    Slogan
                                ========================== */}

                                <h1
                                    className="
                                        text-white
                                        text-3xl
                                        md:text-5xl
                                        lg:text-6xl
                                        font-bold
                                        leading-tight
                                        mb-6
                                    "
                                >
                                    {slogan}
                                </h1>

                                {/* =========================
                                    Description
                                ========================== */}

                                <p
                                    className="
                                        text-white/90
                                        text-sm
                                        md:text-lg
                                        lg:text-xl
                                        mb-10
                                        max-w-2xl
                                        mx-auto
                                        leading-relaxed
                                    "
                                >
                                    {language === 'en'
                                        ? 'Discover the finest spices and dried fruits, carefully selected from nature.'
                                        : 'اكتشفي أجود أنواع التوابل والفواكه المجففة، المختارة بعناية من خيرات الطبيعة.'}
                                </p>

                                {/* =========================
                                    Button
                                ========================== */}

                                <div className="flex flex-wrap gap-4 justify-center">
                                    <button
                                        type="button"
                                        className="
                                            bg-\[\#F07A26\]
                                            hover\:bg-\[\#4E7A3C\]:hover
                                            text-white
                                            px-8
                                            py-4
                                            rounded-xl
                                            font-bold
                                            shadow-xl
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            active:scale-95
                                        "
                                    >
                                        {language === 'en'
                                            ? 'Shop Now'
                                            : 'تسوق الآن'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* =========================
                Dots
            ========================== */}

            {banners.length > 1 && (
                <div
                    className="
                        absolute
                        bottom-8
                        left-1/2
                        -translate-x-1/2
                        flex
                        gap-2
                        z-20
                    "
                >
                    {banners.map((banner, index) => (
                        <button
                            key={banner.id}
                            type="button"
                            onClick={() => setCurrentIndex(index)}
                            aria-label={
                                language === 'en'
                                    ? `Go to banner ${index + 1}`
                                    : `انتقل إلى البنر ${index + 1}`
                            }
                            className={`
                                h-2.5
                                rounded-full
                                transition-all
                                duration-300
                                ${index === currentIndex
                                    ? 'w-8 bg-\[\#F07A26\]'
                                    : 'w-2.5 bg-white/60 hover:bg-white'
                                }
                            `}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default BannerCarousel;