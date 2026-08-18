import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Password() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        if (!formData.currentPassword) {
            setError("يرجى إدخال كلمة المرور الحالية.");
            return;
        }

        if (!formData.newPassword) {
            setError("يرجى إدخال كلمة المرور الجديدة.");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError(
                "كلمة المرور الجديدة يجب أن تحتوي على 8 أحرف على الأقل."
            );
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("تأكيد كلمة المرور غير مطابق لكلمة المرور الجديدة.");
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError(
                "كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية."
            );
            return;
        }

        setSaving(true);

        setTimeout(() => {
            setSaving(false);
            setSuccess(true);

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }, 1200);
    };

    const handleCancel = () => {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setError("");
        setSuccess(false);

        navigate("/admin/profile");
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#fbf9f8] px-4 py-6 md:px-8 lg:px-12"
        >
            {/* =========================
                PAGE HEADER
            ========================== */}

            <div className="mx-auto mb-8 max-w-4xl text-center md:text-right">
                <div className="mb-4 flex items-center justify-start gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/profile")}
                        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#75796b] transition-colors hover:bg-[#f0eded] hover:text-[#3e5219]"
                    >
                        <span className="material-symbols-outlined">
                            arrow_forward
                        </span>

                        العودة إلى الملف الشخصي
                    </button>
                </div>

                <h1 className="mb-2 text-3xl font-bold text-[#3e5219] md:text-5xl">
                    تغيير كلمة المرور
                </h1>

                <p className="text-base text-[#45483c] md:text-lg">
                    قم بتحديث كلمة المرور الخاصة بك للحفاظ على أمان حسابك.
                </p>
            </div>

            {/* =========================
                PASSWORD CARD
            ========================== */}

            <section className="mx-auto max-w-4xl rounded-3xl border border-[#c5c8b8]/30 bg-white p-6 shadow-[0_20px_40px_rgba(62,82,25,0.05)] md:p-10">

                {/* Security Header */}

                <div className="mb-8 flex items-center gap-4 rounded-2xl bg-[#f6f3f2] p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#3e5219]/10">
                        <span className="material-symbols-outlined text-3xl text-[#3e5219]">
                            lock
                        </span>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-[#1b1c1c]">
                            أمان الحساب
                        </h2>

                        <p className="mt-1 text-sm text-[#45483c]">
                            استخدم كلمة مرور قوية لحماية حسابك ومعلوماتك.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* =========================
                        CURRENT PASSWORD
                    ========================== */}

                    <div className="mb-6 flex flex-col gap-2">
                        <label className="pr-2 text-sm font-medium text-[#3e5219]">
                            كلمة المرور الحالية
                        </label>

                        <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">

                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                lock
                            </span>

                            <input
                                type={showCurrent ? "text" : "password"}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="أدخل كلمة المرور الحالية"
                                className="w-full rounded-xl border border-[#c5c8b8]/40 bg-[#f6f3f2] py-3 pl-12 pr-12 text-base text-[#1b1c1c] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3e5219]"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrent(!showCurrent)
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75796b] hover:text-[#3e5219]"
                            >
                                <span className="material-symbols-outlined">
                                    {showCurrent
                                        ? "visibility_off"
                                        : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* =========================
                        NEW PASSWORD
                    ========================== */}

                    <div className="mb-6 flex flex-col gap-2">
                        <label className="pr-2 text-sm font-medium text-[#3e5219]">
                            كلمة المرور الجديدة
                        </label>

                        <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">

                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                lock_reset
                            </span>

                            <input
                                type={showNew ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="أدخل كلمة المرور الجديدة"
                                className="w-full rounded-xl border border-[#c5c8b8]/40 bg-[#f6f3f2] py-3 pl-12 pr-12 text-base text-[#1b1c1c] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3e5219]"
                            />

                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75796b] hover:text-[#3e5219]"
                            >
                                <span className="material-symbols-outlined">
                                    {showNew
                                        ? "visibility_off"
                                        : "visibility"}
                                </span>
                            </button>
                        </div>

                        <p className="pr-2 text-xs text-[#75796b]">
                            يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل.
                        </p>
                    </div>

                    {/* =========================
                        CONFIRM PASSWORD
                    ========================== */}

                    <div className="mb-6 flex flex-col gap-2">
                        <label className="pr-2 text-sm font-medium text-[#3e5219]">
                            تأكيد كلمة المرور الجديدة
                        </label>

                        <div className="relative transition-transform duration-200 focus-within:scale-[1.01]">

                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#75796b]">
                                verified_user
                            </span>

                            <input
                                type={
                                    showConfirm ? "text" : "password"
                                }
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="أعد إدخال كلمة المرور الجديدة"
                                className="w-full rounded-xl border border-[#c5c8b8]/40 bg-[#f6f3f2] py-3 pl-12 pr-12 text-base text-[#1b1c1c] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[#3e5219]"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirm(!showConfirm)
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75796b] hover:text-[#3e5219]"
                            >
                                <span className="material-symbols-outlined">
                                    {showConfirm
                                        ? "visibility_off"
                                        : "visibility"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* =========================
                        ERROR MESSAGE
                    ========================== */}

                    {error && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#ba1a1a]/20 bg-[#ffdad6] p-4 text-[#93000a]">
                            <span className="material-symbols-outlined">
                                error
                            </span>

                            <p className="text-sm font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* =========================
                        SUCCESS MESSAGE
                    ========================== */}

                    {success && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#3e5219]/20 bg-[#d2eca2] p-4 text-[#394d14]">
                            <span className="material-symbols-outlined">
                                check_circle
                            </span>

                            <p className="text-sm font-medium">
                                تم تغيير كلمة المرور بنجاح!
                            </p>
                        </div>
                    )}

                    {/* =========================
                        ACTION BUTTONS
                    ========================== */}

                    <div className="mt-8 flex flex-col-reverse items-center gap-4 md:flex-row-reverse md:justify-start">

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-[#a04100] px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#7a3000] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {saving ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">
                                        progress_activity
                                    </span>

                                    جاري التحديث...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">
                                        save
                                    </span>

                                    تغيير كلمة المرور
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="py-3 text-sm font-medium text-[#75796b] transition-colors hover:text-[#3e5219]"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </section>

            {/* =========================
                SECURITY TIPS
            ========================== */}

            <div className="mx-auto mt-6 max-w-4xl rounded-2xl border border-[#c5c8b8]/20 bg-[#f6f3f2] p-6">

                <div className="mb-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#3e5219]">
                        security
                    </span>

                    <h3 className="text-lg font-semibold text-[#1b1c1c]">
                        نصائح للحفاظ على أمان حسابك
                    </h3>
                </div>

                <ul className="space-y-3 text-sm text-[#45483c]">
                    <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#3e5219]">
                            check
                        </span>
                        استخدم كلمة مرور طويلة وصعبة التخمين.
                    </li>

                    <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#3e5219]">
                            check
                        </span>
                        لا تستخدم نفس كلمة المرور في أكثر من حساب.
                    </li>

                    <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#3e5219]">
                            check
                        </span>
                        لا تشارك كلمة المرور الخاصة بك مع أي شخص.
                    </li>
                </ul>
            </div>
        </div>
    );
}