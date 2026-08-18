import { useEffect, useMemo, useState } from "react";

const initialImportRequests = [
    {
        id: "IMP-90234",
        title: "خزانة ماهوجني أثرية - القرن التاسع عشر",
        price: "$ ٤,٥٠٠",
        country: "فرنسا",
        date: "١٤ أكتوبر ٢٠٢٣",
        status: "accepted",
        statusText: "تم القبول",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAHVV-RWBmKqIIh8Hg4tsal9QubZ_hPSLOjgFbU-DwcOXP3pNUrc0BzxrfN3yD9W1vpz3el5ZocPvLPvyTMks1hQezwPA7KEAHO66_nM8QvMpaQf-yug3kGR8IYyB5W88IkuPc7RZsuW6FZsJmo17KS1BRRxPlW_8wMHNNFA36jnzSgJjqdWYpwcpIQ2ZMSpEVZ6kyz2JhjVW3dRMRFykmX8kibw931jlDz6cK6r8lbpCgkm4QgvTwF",
        note:
            "تمت الموافقة على طلبك، سيتم البدء في إجراءات الشحن قريباً.",
        description:
            "خزانة ماهوجني أثرية من القرن التاسع عشر بحالة ممتازة.",
    },

    {
        id: "IMP-90248",
        title: "نجفة كريستال آرت ديكو",
        price: "قيد التقييم",
        country: "إيطاليا",
        date: "٢٢ أكتوبر ٢٠٢٣",
        status: "pending",
        statusText: "قيد الانتظار",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDKFhdzkdntmjWtG50pAwuM5nE6POxjPxvIMmeAyTY4pEy0UFkN1FBKgi4NOKpxaaQuZMH48GrVuHix49SzofNjL_Km-7IXgswPZPic0KckvNgRqE3vmciQB8E6kvOtthSKxgeQO0YOJIpicTT8kz3sVg_IO5N6PamKeX9Fb9d8GFGKLd-jtRZKr8545-_Y0DuaMCvYq1hYHFfFp9HGzxDUl-8GLzxa-vV0CU4Hc0TIazv2tDUIFys",
        description:
            "نجفة كريستال بتصميم آرت ديكو، مطلوبة للاستيراد من إيطاليا.",
    },
];

export default function InternationalImport() {
    const [importRequests, setImportRequests] = useState(
        initialImportRequests
    );

    const [showNewRequest, setShowNewRequest] = useState(false);

    const [showEditRequest, setShowEditRequest] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null);

    const [showDeleteConfirm, setShowDeleteConfirm] =
        useState(false);

    const [requestToDelete, setRequestToDelete] =
        useState(null);

    const [formData, setFormData] = useState({
        title: "",
        country: "",
        description: "",
        price: "",
    });

    /*
    |--------------------------------------------------------------------------
    | إغلاق النوافذ بزر ESC
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowNewRequest(false);
                setShowEditRequest(false);
                setShowDeleteConfirm(false);
                setSelectedRequest(null);
                setRequestToDelete(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | الإحصائيات
    |--------------------------------------------------------------------------
    */

    const statistics = useMemo(() => {
        const total = importRequests.length;

        const pending = importRequests.filter(
            (request) => request.status === "pending"
        ).length;

        const delivered = importRequests.filter(
            (request) => request.status === "delivered"
        ).length;

        return {
            total,
            pending,
            delivered,
        };
    }, [importRequests]);

    /*
    |--------------------------------------------------------------------------
    | فتح نافذة طلب جديد
    |--------------------------------------------------------------------------
    */

    const openNewRequest = () => {
        setFormData({
            title: "",
            country: "",
            description: "",
            price: "",
        });

        setShowNewRequest(true);
    };

    /*
    |--------------------------------------------------------------------------
    | فتح نافذة تعديل الطلب
    |--------------------------------------------------------------------------
    */

    const openEditRequest = (request) => {
        setSelectedRequest(request);

        setFormData({
            title: request.title,
            country: request.country,
            description: request.description || "",
            price: request.price
                ? request.price.replace("$ ", "")
                : "",
        });

        setShowEditRequest(true);
    };

    /*
    |--------------------------------------------------------------------------
    | تغيير بيانات الفورم
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | إرسال طلب جديد
    |--------------------------------------------------------------------------
    */

    const handleCreateRequest = (event) => {
        event.preventDefault();

        if (
            !formData.title.trim() ||
            !formData.country.trim()
        ) {
            return;
        }

        const newRequest = {
            id: `IMP-${Math.floor(
                10000 + Math.random() * 90000
            )}`,

            title: formData.title,

            price: formData.price
                ? `$ ${formData.price}`
                : "قيد التقييم",

            country: formData.country,

            date: new Intl.DateTimeFormat("ar-SA", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }).format(new Date()),

            status: "pending",

            statusText: "قيد الانتظار",

            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDKFhdzkdntmjWtG50pAwuM5nE6POxjPxvIMmeAyTY4pEy0UFkN1FBKgi4NOKpxaaQuZMH48GrVuHix49SzofNjL_Km-7IXgswPZPic0KckvNgRqE3vmciQB8E6kvOtthSKxgeQO0YOJIpicTT8kz3sVg_IO5N6PamKeX9Fb9d8GFGKLd-jtRZKr8545-_Y0DuaMCvYq1hYHFfFp9HGzxDUl-8GLzxa-vV0CU4Hc0TIazv2tDUIFys",

            description: formData.description,

            note: "",
        };

        setImportRequests((previous) => [
            newRequest,
            ...previous,
        ]);

        setShowNewRequest(false);

        setFormData({
            title: "",
            country: "",
            description: "",
            price: "",
        });
    };

    /*
    |--------------------------------------------------------------------------
    | تعديل الطلب
    |--------------------------------------------------------------------------
    */

    const handleUpdateRequest = (event) => {
        event.preventDefault();

        if (!selectedRequest) {
            return;
        }

        if (
            !formData.title.trim() ||
            !formData.country.trim()
        ) {
            return;
        }

        setImportRequests((previous) =>
            previous.map((request) =>
                request.id === selectedRequest.id
                    ? {
                          ...request,

                          title: formData.title,

                          country: formData.country,

                          price: formData.price
                              ? `$ ${formData.price}`
                              : request.price,

                          description:
                              formData.description,
                      }
                    : request
            )
        );

        setShowEditRequest(false);

        setSelectedRequest(null);

        setFormData({
            title: "",
            country: "",
            description: "",
            price: "",
        });
    };

    /*
    |--------------------------------------------------------------------------
    | فتح نافذة تأكيد الحذف
    |--------------------------------------------------------------------------
    */

    const handleOpenDelete = (request) => {
        setRequestToDelete(request);
        setShowDeleteConfirm(true);
    };

    /*
    |--------------------------------------------------------------------------
    | تأكيد حذف الطلب
    |--------------------------------------------------------------------------
    */

    const handleDeleteRequest = () => {
        if (!requestToDelete) {
            return;
        }

        setImportRequests((previous) =>
            previous.filter(
                (request) =>
                    request.id !== requestToDelete.id
            )
        );

        setRequestToDelete(null);
        setShowDeleteConfirm(false);
    };

    /*
    |--------------------------------------------------------------------------
    | إلغاء الحذف
    |--------------------------------------------------------------------------
    */

    const handleCancelDelete = () => {
        setRequestToDelete(null);
        setShowDeleteConfirm(false);
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c]"
            style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            }}
        >
            {/* =====================================================
                Main Content
            ====================================================== */}

            <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">

                {/* =================================================
                    Header
                ================================================== */}

                <section className="mb-8">

                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">

                        <div className="text-right">

                            <div className="flex items-center gap-2 mb-2">

                                <span
                                    className="material-symbols-outlined text-[#a04100]"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    public
                                </span>

                                <span className="text-[#a04100] font-bold text-sm">
                                    الاستيراد الدولي
                                </span>

                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-[#3e5219] mb-2">
                                طلبات الاستيراد
                            </h1>

                            <p className="text-[#45483c] text-base md:text-lg">
                                تابع حالة شحناتك الدولية والقطع التي
                                تم استيرادها خصيصاً لك.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={openNewRequest}
                            className="flex flex-row-reverse items-center gap-2 bg-[#3e5219] text-white px-6 py-3 rounded-full hover:scale-95 transition-transform shadow-sm"
                        >

                            <span className="material-symbols-outlined">
                                add_circle
                            </span>

                            <span>
                                طلب استيراد جديد
                            </span>

                        </button>

                    </div>

                </section>

                {/* =================================================
                    Statistics
                ================================================== */}

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Total */}

                    <div className="bg-[#f6f3f2] p-6 rounded-2xl border border-[#c5c8b8]/30 flex flex-row items-center gap-5">

                        <div className="bg-[#d2eca2]/30 p-3 rounded-xl">

                            <span className="material-symbols-outlined text-[#3e5219] text-3xl">
                                package_2
                            </span>

                        </div>

                        <div className="text-right">

                            <div className="text-[#75796b] text-xs">
                                إجمالي الطلبات
                            </div>

                            <div className="text-2xl font-bold mt-1">
                                {statistics.total}
                            </div>

                        </div>

                    </div>

                    {/* Pending */}

                    <div className="bg-[#f6f3f2] p-6 rounded-2xl border border-[#c5c8b8]/30 flex flex-row items-center gap-5">

                        <div className="bg-[#ffdbcc]/30 p-3 rounded-xl">

                            <span className="material-symbols-outlined text-[#a04100] text-3xl">
                                local_shipping
                            </span>

                        </div>

                        <div className="text-right">

                            <div className="text-[#75796b] text-xs">
                                قيد الشحن
                            </div>

                            <div className="text-2xl font-bold mt-1">
                                {statistics.pending}
                            </div>

                        </div>

                    </div>

                    {/* Delivered */}

                    <div className="bg-[#f6f3f2] p-6 rounded-2xl border border-[#c5c8b8]/30 flex flex-row items-center gap-5">

                        <div className="bg-[#85537e]/20 p-3 rounded-xl">

                            <span className="material-symbols-outlined text-[#6b3b65] text-3xl">
                                check_circle
                            </span>

                        </div>

                        <div className="text-right">

                            <div className="text-[#75796b] text-xs">
                                تم التسليم
                            </div>

                            <div className="text-2xl font-bold mt-1">
                                {statistics.delivered}
                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    Requests
                ================================================== */}

                <section className="space-y-6">

                    {importRequests.map((request) => (

                        <article
                            key={request.id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#c5c8b8]/20 hover:-translate-y-1"
                        >

                            <div className="flex flex-col md:flex-row">

                                {/* Image */}

                                <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden relative">

                                    {request.status === "pending" && (
                                        <div className="absolute inset-0 bg-black/10 z-10" />
                                    )}

                                    <img
                                        src={request.image}
                                        alt={request.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />

                                    <div
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg z-20 ${
                                            request.status ===
                                            "accepted"
                                                ? "bg-[#3e5219]"
                                                : request.status ===
                                                  "pending"
                                                ? "bg-[#75796b]"
                                                : request.status ===
                                                  "delivered"
                                                ? "bg-[#6b3b65]"
                                                : "bg-[#a04100]"
                                        }`}
                                    >
                                        {request.statusText}
                                    </div>

                                </div>

                                {/* Content */}

                                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col">

                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">

                                        <div className="text-right">

                                            <div className="text-[#75796b] text-xs mb-2 uppercase tracking-widest">
                                                رقم الطلب:{" "}
                                                {request.id}
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-semibold text-[#3e5219]">
                                                {request.title}
                                            </h3>

                                        </div>

                                        <div className="text-left font-bold text-[#a04100] text-lg">
                                            {request.price}
                                        </div>

                                    </div>

                                    {/* Details */}

                                    <div className="grid grid-cols-2 gap-6 mb-6">

                                        <div className="text-right">

                                            <div className="text-[#75796b] text-xs mb-1">
                                                بلد المنشأ
                                            </div>

                                            <div className="text-[#1b1c1c] font-medium flex items-center gap-1">

                                                <span>
                                                    {
                                                        request.country
                                                    }
                                                </span>

                                                <span className="material-symbols-outlined text-sm">
                                                    location_on
                                                </span>

                                            </div>

                                        </div>

                                        <div className="text-right">

                                            <div className="text-[#75796b] text-xs mb-1">
                                                تاريخ الطلب
                                            </div>

                                            <div className="text-[#1b1c1c] font-medium">
                                                {request.date}
                                            </div>

                                        </div>

                                    </div>

                                    {/* Accepted */}

                                    {request.status ===
                                        "accepted" && (

                                        <div className="bg-[#556b2f]/10 p-5 rounded-2xl border-r-4 border-[#3e5219] mt-auto">

                                            <div className="flex flex-row-reverse items-center gap-2 mb-1">

                                                <span className="material-symbols-outlined text-[#3e5219] text-sm">
                                                    info
                                                </span>

                                                <span className="font-bold text-[#3e5219] text-sm">
                                                    ملاحظة الإدارة
                                                </span>

                                            </div>

                                            <p className="text-[#45483c] leading-relaxed">
                                                {request.note}
                                            </p>

                                        </div>

                                    )}

                                    {/* Pending */}

                                    {request.status ===
                                        "pending" && (

                                        <div className="mt-auto">

                                            <div className="flex flex-col sm:flex-row-reverse gap-3">

                                                {/* تعديل */}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditRequest(
                                                            request
                                                        )
                                                    }
                                                    className="flex-1 py-3 px-4 border border-[#75796b] text-[#1b1c1c] rounded-xl font-bold hover:bg-[#e4e2e1] transition-colors flex items-center justify-center gap-2"
                                                >

                                                    <span className="material-symbols-outlined text-lg">
                                                        edit
                                                    </span>

                                                    تعديل الطلب

                                                </button>

                                                {/* انتظار المراجعة */}

                                                <button
                                                    type="button"
                                                    disabled
                                                    className="flex-1 py-3 px-4 bg-[#eae7e7] text-[#75796b] rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2"
                                                >

                                                    <span className="material-symbols-outlined text-lg">
                                                        pending
                                                    </span>

                                                    في انتظار المراجعة

                                                </button>

                                            </div>

                                            {/* حذف */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenDelete(
                                                        request
                                                    )
                                                }
                                                className="mt-3 text-xs text-[#ba1a1a] hover:underline self-end flex items-center gap-1"
                                            >

                                                <span className="material-symbols-outlined text-sm">
                                                    delete
                                                </span>

                                                حذف الطلب

                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </article>

                    ))}

                </section>

                {/* =================================================
                    Empty State
                ================================================== */}

                {importRequests.length === 0 && (

                    <div className="bg-white rounded-3xl border border-[#c5c8b8]/30 p-12 text-center">

                        <span className="material-symbols-outlined text-6xl text-[#75796b]">
                            inventory_2
                        </span>

                        <h3 className="text-xl font-bold text-[#3e5219] mt-4">
                            لا توجد طلبات استيراد
                        </h3>

                        <p className="text-[#75796b] mt-2">
                            يمكنك إنشاء أول طلب استيراد دولي لك.
                        </p>

                        <button
                            type="button"
                            onClick={openNewRequest}
                            className="mt-6 bg-[#3e5219] text-white px-6 py-3 rounded-full font-bold"
                        >
                            إنشاء طلب جديد
                        </button>

                    </div>

                )}

                {/* =================================================
                    Guidance
                ================================================== */}

                <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* Image */}

                    <div className="relative rounded-3xl overflow-hidden aspect-video shadow-xl">

                        <img
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA46DI4Es5B-MfuuyGWC6dgk3kiUimjKOR4kb807YPJF91i3sMAt7eEolgxzJiNzOTvZbTsD7ajd3IFrYg_mWBzcYtZQbw4Af0qN0s58cDPaklxLUE6L-rBRoeTljqsCcbd84K4lnG0k7yrV3uUy5bYOC1dntOjpGSSBJdBx-R6tdKckA87CTNhwdopMDKSbopAbo18AUFZgW9QVAGs4VJMPE6ZjxRdlJU1sFF2sbNEBvtg_0tgUsdf"
                            alt="الاستيراد الدولي"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#3e5219]/70 to-transparent flex items-end p-6">

                            <p className="text-white text-base font-medium">
                                نحن نضمن وصول قطعك النادرة من أي
                                مكان في العالم بأمان تامة.
                            </p>

                        </div>

                    </div>

                    {/* Text */}

                    <div className="text-right">

                        <span className="text-[#a04100] font-bold text-sm block mb-2">
                            دليلك للاستيراد
                        </span>

                        <h2 className="text-2xl md:text-3xl text-[#3e5219] font-bold mb-6">
                            كيف نخدمك دولياً؟
                        </h2>

                        <ul className="space-y-4">

                            <li className="flex flex-row-reverse items-start gap-3">

                                <span
                                    className="material-symbols-outlined text-[#3e5219]"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    verified
                                </span>

                                <p className="text-[#45483c]">
                                    فحص دقيق لمصدر القطعة والتأكد
                                    من أصالتها قبل الشراء.
                                </p>

                            </li>

                            <li className="flex flex-row-reverse items-start gap-3">

                                <span
                                    className="material-symbols-outlined text-[#3e5219]"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    verified
                                </span>

                                <p className="text-[#45483c]">
                                    تخليص جمركي احترافي لضمان دخول
                                    القطع دون عوائق قانونية.
                                </p>

                            </li>

                            <li className="flex flex-row-reverse items-start gap-3">

                                <span
                                    className="material-symbols-outlined text-[#3e5219]"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    verified
                                </span>

                                <p className="text-[#45483c]">
                                    تغليف مخصص ضد الصدمات والرطوبة
                                    للقطع الحساسة.
                                </p>

                            </li>

                        </ul>

                    </div>

                </section>

            </main>

            {/* =====================================================
                New Request Modal
            ====================================================== */}

            {showNewRequest && (

                <div
                    className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={() =>
                        setShowNewRequest(false)
                    }
                >

                    <div
                        className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="flex justify-between items-center mb-6">

                            <div>

                                <span className="text-[#a04100] text-xs font-bold">
                                    الاستيراد الدولي
                                </span>

                                <h2 className="text-xl font-bold text-[#3e5219] mt-1">
                                    طلب استيراد جديد
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewRequest(false)
                                }
                                className="p-2 rounded-full hover:bg-[#e4e2e1] transition-colors"
                            >

                                <span className="material-symbols-outlined">
                                    close
                                </span>

                            </button>

                        </div>

                        <form
                            onSubmit={handleCreateRequest}
                            className="space-y-4"
                        >

                            {/* اسم القطعة */}

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    اسم القطعة
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="مثال: خزانة أثرية"
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219]"
                                    required
                                />

                            </div>

                            {/* البلد */}

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    بلد المنشأ
                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="مثال: فرنسا"
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219]"
                                    required
                                />

                            </div>

                            {/* السعر */}

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    السعر المتوقع
                                </label>

                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="مثال: 4500"
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219]"
                                />

                            </div>

                            {/* الوصف */}

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    وصف الطلب
                                </label>

                                <textarea
                                    rows="4"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={handleChange}
                                    placeholder="اكتب تفاصيل القطعة المطلوبة..."
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219]"
                                />

                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#3e5219] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >

                                <span className="material-symbols-outlined">
                                    send
                                </span>

                                إرسال طلب الاستيراد

                            </button>

                        </form>

                    </div>

                </div>

            )}

            {/* =====================================================
                Edit Request Modal
            ====================================================== */}

            {showEditRequest && selectedRequest && (

                <div
                    className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={() =>
                        setShowEditRequest(false)
                    }
                >

                    <div
                        className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="flex justify-between items-center mb-6">

                            <div>

                                <span className="text-[#a04100] text-xs font-bold">
                                    {selectedRequest.id}
                                </span>

                                <h2 className="text-xl font-bold text-[#3e5219] mt-1">
                                    تعديل طلب الاستيراد
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowEditRequest(false)
                                }
                                className="p-2 rounded-full hover:bg-[#e4e2e1] transition-colors"
                            >

                                <span className="material-symbols-outlined">
                                    close
                                </span>

                            </button>

                        </div>

                        <form
                            onSubmit={handleUpdateRequest}
                            className="space-y-4"
                        >

                            {/* اسم القطعة */}

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    اسم القطعة
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219]"
                                    required
                                />

                            </div>

                            {/* البلد */}

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    بلد المنشأ
                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219]"
                                    required
                                />

                            </div>

                            {/* السعر */}

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    السعر المتوقع
                                </label>

                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="مثال: 4500"
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219]"
                                />

                            </div>

                            {/* الوصف */}

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    وصف الطلب
                                </label>

                                <textarea
                                    rows="4"
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={handleChange}
                                    placeholder="اكتب تفاصيل الطلب..."
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219] focus:ring-1 focus:ring-[#3e5219]"
                                />

                            </div>

                            <div className="flex flex-col sm:flex-row-reverse gap-3">

                                <button
                                    type="submit"
                                    className="flex-1 bg-[#3e5219] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >

                                    <span className="material-symbols-outlined">
                                        save
                                    </span>

                                    حفظ التعديلات

                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditRequest(false)
                                    }
                                    className="flex-1 border border-[#75796b] text-[#1b1c1c] py-3 rounded-xl font-bold hover:bg-[#e4e2e1] transition-colors"
                                >
                                    إلغاء
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =====================================================
                Delete Confirmation Modal
            ====================================================== */}

            {showDeleteConfirm && requestToDelete && (

                <div
                    className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onMouseDown={handleCancelDelete}
                >

                    <div
                        className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="text-center">

                            {/* Icon */}

                            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">

                                <span className="material-symbols-outlined text-red-600 text-3xl">
                                    delete_forever
                                </span>

                            </div>

                            {/* Title */}

                            <h2 className="text-xl font-bold text-[#1b1c1c] mb-3">
                                حذف طلب الاستيراد
                            </h2>

                            {/* Description */}

                            <p className="text-[#75796b] leading-relaxed mb-2">
                                هل أنت متأكد من حذف هذا الطلب؟
                            </p>

                            <p className="font-bold text-[#3e5219] mb-2">
                                {requestToDelete.title}
                            </p>

                            <p className="text-xs text-[#75796b] mb-6">
                                رقم الطلب:{" "}
                                {requestToDelete.id}
                            </p>

                            {/* Warning */}

                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6">

                                <p className="text-sm text-red-700">
                                    لا يمكن التراجع عن هذا الإجراء
                                    بعد حذف الطلب.
                                </p>

                            </div>

                            {/* Buttons */}

                            <div className="flex flex-col sm:flex-row-reverse gap-3">

                                <button
                                    type="button"
                                    onClick={handleDeleteRequest}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >

                                    <span className="material-symbols-outlined text-base">
                                        delete
                                    </span>

                                    نعم، حذف الطلب

                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancelDelete}
                                    className="flex-1 border border-[#c5c8b8] text-[#1b1c1c] py-3 rounded-xl font-bold hover:bg-[#f6f3f2] transition-colors"
                                >
                                    إلغاء
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}