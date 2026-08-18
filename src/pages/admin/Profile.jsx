import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    const initialData = {
        name: "أحمد محمد",
        email: "ahmed@example.com",
        phone: "+966 50 000 0000",
        language: "العربية",
        address:
            "حي النرجس، طريق الملك فهد، الرياض، المملكة العربية السعودية",
    };

    const [formData, setFormData] = useState(initialData);

    const [image, setImage] = useState(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDM10svvrj2-b9sJ3d83lWkBftOmcrLt_-0lYyBCeDV4Am0JeOqeUycqr_OLE4gOsiebsFS_e89OACAPxgGki6JZBCHVEWblDyuq1LKpGbRZqFztU5ig-mQNQ6mx_WAi-exoJF4s5MxB11Xhq86jaJQuE9l4LGhsfepAzP6TMUMUydw5JzHPA-QU4GAQddyAjzX0yQx8tQpNUGLRSIvIPBh4MkYm-0rJCfIRGtuVsgDPbcTSmBXCHP"
    );

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaving(true);
        setSuccess(false);

        setTimeout(() => {
            setSaving(false);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        }, 1000);
    };

    const handleCancel = () => {
        setFormData(initialData);
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#fbf9f8] px-4 py-6 md:px-8 lg:px-12"
        >
            {/* =========================
                PAGE HEADER
            ========================== */}

            <div className="mx-auto mb-8 max-w-5xl text-center md:text-right">
                <h1 className="mb-2 text-3xl font-bold text-[#3e5219] md:text-5xl">
                    الملف الشخصي
                </h1>

                <p className="text-base text-[#45483c] md:text-lg">
                    قم بتحديث معلوماتك الشخصية لضمان تجربة تسوق سلسة.
                </p>
            </div>

            {/* =========================
                PROFILE CARD
            ========================== */}

            <section className="mx-auto max-w-5xl rounded-3xl border border-[#c5c8b8]/30 bg-white p-6 shadow-[0_20px_40px_rgba(62,82,25,0.05)] md:p-10">

                <form onSubmit={handleSubmit}>

                    {/* =========================
                        PROFILE IMAGE
                    ========================== */}

                    <div className="mb-10 flex flex-col items-center">

                        <label
                            htmlFor="profile-image"
                            className="group relative cursor-pointer"
                        >
                            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#eae7e7] transition-colors duration-300 group-hover:border-[#3e5219]">

                                <img
                                    src={image}
                                    alt="الصورة الشخصية"
                                    className="h-full w-full object-cover"
                                />

                            </div>

                            <div className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#a04100] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">

                                <span className="material-symbols-outlined text-[20px]">
                                    edit
                                </span>

                            </div>
                        </label>

                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <span className="mt-3 text-sm text-[#45483c]">
                            تغيير الصورة الشخصية
                        </span>

                    </div>

                    {/* =========================
                        FORM GRID
                    ========================== */}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* Full Name */}

                        <div className="flex flex-col gap-2">

                            <label className="pr-2 text-sm font-medium text-[#3e5219]">
                                الاسم الكامل
                            </label>

                            <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">

                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                    person
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="أدخل اسمك الكامل"
                                    className="w-full rounded-xl border border-[#c5c8b8]/40 bg-[#f6f3f2] py-3 pl-4 pr-12 text-base text-[#1b1c1c] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3e5219]"
                                />

                            </div>

                        </div>

                        {/* Email */}

                        <div className="flex flex-col gap-2">

                            <label className="pr-2 text-sm font-medium text-[#3e5219]">
                                البريد الإلكتروني
                            </label>

                            <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">

                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                    mail
                                </span>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.com"
                                    className="w-full rounded-xl border border-[#c5c8b8]/40 bg-[#f6f3f2] py-3 pl-4 pr-12 text-base text-[#1b1c1c] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3e5219]"
                                />

                            </div>

                        </div>

                        {/* Phone */}

                        <div className="flex flex-col gap-2">

                            <label className="pr-2 text-sm font-medium text-[#3e5219]">
                                رقم الهاتف
                            </label>

                            <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">

                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                    call
                                </span>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    dir="ltr"
                                    placeholder="+966 5x xxx xxxx"
                                    className="w-full rounded-xl border border-[#c5c8b8]/40 bg-[#f6f3f2] py-3 pl-4 pr-12 text-right text-base text-[#1b1c1c] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3e5219]"
                                />

                            </div>

                        </div>

                        {/* Language */}

                        <div className="flex flex-col gap-2">

                            <label className="pr-2 text-sm font-medium text-[#3e5219]">
                                اللغة المفضلة
                            </label>

                            <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">

                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                    language
                                </span>

                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full appearance-none rounded-xl border border-[#c5c8b8]/40 bg-[#f6f3f2] py-3 pl-12 pr-12 text-base text-[#1b1c1c] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3e5219]"
                                >

                                    <option value="العربية">
                                        العربية
                                    </option>

                                    <option value="English">
                                        English
                                    </option>

                                </select>

                                <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                    expand_more
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* =========================
                        ADDRESS
                    ========================== */}

                    <div className="mt-6 flex flex-col gap-2">

                        <label className="pr-2 text-sm font-medium text-[#3e5219]">
                            عنوان التوصيل
                        </label>

                        <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">

                            <span className="material-symbols-outlined absolute right-4 top-4 text-[#75796b]">
                                location_on
                            </span>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="4"
                                placeholder="أدخل عنوان الشحن بالتفصيل"
                                className="w-full resize-none rounded-xl border border-[#c5c8b8]/40 bg-[#f6f3f2] py-3 pl-4 pr-12 text-base text-[#1b1c1c] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3e5219]"
                            />

                        </div>

                    </div>

                    {/* =========================
                        ACTION BUTTONS
                    ========================== */}

                    <div className="mt-8 flex flex-col-reverse items-center gap-4 md:flex-row-reverse md:justify-start">

                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex min-w-[200px] items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 ${
                                success
                                    ? "bg-[#3e5219]"
                                    : "bg-[#a04100] hover:bg-[#7a3000]"
                            }`}
                        >

                            {saving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">
                                        progress_activity
                                    </span>

                                    جاري الحفظ...
                                </>
                            ) : success ? (
                                <>
                                    <span className="material-symbols-outlined">
                                        check_circle
                                    </span>

                                    تم الحفظ بنجاح!
                                </>
                            ) : (
                                "حفظ التغييرات"
                            )}

                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="py-3 text-sm font-medium text-[#75796b] transition-colors hover:text-[#3e5219]"
                        >
                            إلغاء التعديلات
                        </button>

                    </div>

                </form>

            </section>

            {/* =========================
                SECURITY & PAYMENT
            ========================== */}

            <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

                {/* =========================
                    PASSWORD
                ========================== */}

                <button
                    type="button"
                    onClick={() => navigate("/admin/profile/password")}
                    className="group flex items-center gap-4 rounded-xl border border-[#c5c8b8]/20 bg-[#f6f3f2] p-6 text-right transition-all hover:bg-[#eae7e7] hover:shadow-md"
                >

                    <div className="rounded-lg bg-[#3e5219]/10 p-3 transition-colors group-hover:bg-[#3e5219]">

                        <span className="material-symbols-outlined text-[#3e5219] group-hover:text-white">
                            lock
                        </span>

                    </div>

                    <div className="flex-grow">

                        <h3 className="text-lg font-semibold text-[#1b1c1c]">
                            كلمة المرور
                        </h3>

                        <p className="text-sm text-[#45483c]">
                            تغيير كلمة المرور الخاصة بك
                        </p>

                    </div>

                    <span className="material-symbols-outlined text-[#75796b]">
                        chevron_left
                    </span>

                </button>

                {/* =========================
                    PAYMENT METHODS
                ========================== */}

                <button
                    type="button"
                    onClick={() => navigate("/admin/payment-methods")}
                    className="group flex items-center gap-4 rounded-xl border border-[#c5c8b8]/20 bg-[#f6f3f2] p-6 text-right transition-all hover:bg-[#eae7e7] hover:shadow-md"
                >

                    <div className="rounded-lg bg-[#6b3b65]/10 p-3 transition-colors group-hover:bg-[#6b3b65]">

                        <span className="material-symbols-outlined text-[#6b3b65] group-hover:text-white">
                            credit_card
                        </span>

                    </div>

                    <div className="flex-grow">

                        <h3 className="text-lg font-semibold text-[#1b1c1c]">
                            طرق الدفع
                        </h3>

                        <p className="text-sm text-[#45483c]">
                            إدارة البطاقات البنكية المحفوظة
                        </p>

                    </div>

                    <span className="material-symbols-outlined text-[#75796b]">
                        chevron_left
                    </span>

                </button>

            </div>

        </div>
    );
}