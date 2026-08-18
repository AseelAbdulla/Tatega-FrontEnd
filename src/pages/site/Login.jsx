import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    // =========================================================
    // API
    // =========================================================

    const API_URL = "http://127.0.0.1:8000/api";

    // =========================================================
    // Checkout
    // =========================================================

    const fromCheckout =
        location.state?.fromCheckout === true;

    // =========================================================
    // Account Type
    // =========================================================

    const [role, setRole] = useState("customer");

    // =========================================================
    // Password
    // =========================================================

    const [showPassword, setShowPassword] = useState(false);

    // =========================================================
    // Loading
    // =========================================================

    const [loading, setLoading] = useState(false);

    // =========================================================
    // Messages
    // =========================================================

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // Form
    // =========================================================

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    // =========================================================
    // Handle Change
    // =========================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        if (error) {
            setError("");
        }
    };

    // =========================================================
    // Extract Token
    // =========================================================

    const extractToken = (data) => {
        // data.data.token
        if (
            typeof data?.data?.token === "string" &&
            data.data.token.trim() !== ""
        ) {
            return data.data.token;
        }

        // data.token
        if (
            typeof data?.token === "string" &&
            data.token.trim() !== ""
        ) {
            return data.token;
        }

        // data.data.access_token
        if (
            typeof data?.data?.access_token === "string" &&
            data.data.access_token.trim() !== ""
        ) {
            return data.data.access_token;
        }

        // data.access_token
        if (
            typeof data?.access_token === "string" &&
            data.access_token.trim() !== ""
        ) {
            return data.access_token;
        }

        return null;
    };

    // =========================================================
    // Extract User
    // =========================================================

    const extractUser = (data) => {
        // data.data.user
        if (data?.data?.user) {
            return data.data.user;
        }

        // data.user
        if (data?.user) {
            return data.user;
        }

        return null;
    };

    // =========================================================
    // Extract Token Type
    // =========================================================

    const extractTokenType = (data) => {
        if (
            typeof data?.data?.token_type === "string" &&
            data.data.token_type.trim() !== ""
        ) {
            return data.data.token_type;
        }

        if (
            typeof data?.token_type === "string" &&
            data.token_type.trim() !== ""
        ) {
            return data.token_type;
        }

        return "Bearer";
    };

    // =========================================================
    // Extract Role
    // =========================================================

    const extractRole = (user) => {
        // role = string
        if (
            typeof user?.role === "string" &&
            user.role.trim() !== ""
        ) {
            return user.role;
        }

        // role = object
        if (
            typeof user?.role === "object" &&
            user.role !== null
        ) {
            return (
                user.role.name ||
                user.role.slug ||
                ""
            );
        }

        // Spatie roles
        if (
            Array.isArray(user?.roles) &&
            user.roles.length > 0
        ) {
            return (
                user.roles[0]?.name ||
                ""
            );
        }

        return "";
    };

    // =========================================================
    // Login
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // =====================================================
        // Validation
        // =====================================================

        if (!formData.email.trim()) {
            setError(
                "يرجى إدخال البريد الإلكتروني."
            );

            return;
        }

        if (!formData.password) {
            setError(
                "يرجى إدخال كلمة المرور."
            );

            return;
        }

        setLoading(true);

        try {
            // =================================================
            // إزالة بيانات الدخول القديمة
            // =================================================

            localStorage.removeItem("token");
            localStorage.removeItem("token_type");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            localStorage.removeItem("permissions");

            // =================================================
            // Login Request
            // =================================================

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",
                    },

                    body: JSON.stringify({
                        email:
                            formData.email.trim(),

                        password:
                            formData.password,
                    }),
                }
            );

            // =================================================
            // قراءة Response
            // =================================================

            const data =
                await response.json();

            // =================================================
            // Debug
            // =================================================

            console.log(
                "========================================"
            );

            console.log(
                "LOGIN RESPONSE:"
            );

            console.log(data);

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "OK:",
                response.ok
            );

            console.log(
                "========================================"
            );

            // =================================================
            // Laravel Error
            // =================================================

            if (!response.ok) {
                if (data?.errors) {
                    const firstField =
                        Object.keys(
                            data.errors
                        )[0];

                    const firstError =
                        data.errors[
                            firstField
                        ]?.[0];

                    setError(
                        firstError ||
                            data?.message ||
                            "حدث خطأ أثناء تسجيل الدخول."
                    );
                } else {
                    setError(
                        data?.message ||
                            "البريد الإلكتروني أو كلمة المرور غير صحيحة."
                    );
                }

                return;
            }

            // =================================================
            // Extract Data
            // =================================================

            const token =
                extractToken(data);

            const user =
                extractUser(data);

            const tokenType =
                extractTokenType(data);

            // =================================================
            // Debug Token
            // =================================================

            console.log(
                "TOKEN FROM LARAVEL:",
                token
            );

            console.log(
                "TOKEN TYPE:",
                tokenType
            );

            console.log(
                "USER FROM LARAVEL:",
                user
            );

            // =================================================
            // Check Token
            // =================================================

            if (
                !token ||
                token === "null" ||
                token === "undefined"
            ) {
                console.error(
                    "TOKEN IS MISSING"
                );

                setError(
                    "تم تسجيل الدخول ولكن Laravel لم يُرجع Token."
                );

                return;
            }

            // =================================================
            // Check User
            // =================================================

            if (!user) {
                console.error(
                    "USER IS MISSING"
                );

                setError(
                    "تم تسجيل الدخول ولكن لم يتم استلام بيانات المستخدم."
                );

                return;
            }

            // =================================================
            // Extract Role
            // =================================================

            const userRole =
                extractRole(user);

            console.log(
                "USER ROLE:",
                userRole
            );

            // =================================================
            // Save Token
            // =================================================

            localStorage.setItem(
                "token",
                token
            );

            // =================================================
            // Save Token Type
            // =================================================

            localStorage.setItem(
                "token_type",
                tokenType
            );

            // =================================================
            // Save User
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // =================================================
            // Save Role
            // =================================================

            if (userRole) {
                localStorage.setItem(
                    "role",
                    userRole
                );
            }

            // =================================================
            // Save Permissions
            // =================================================

            const permissions =
                Array.isArray(
                    user.permissions
                )
                    ? user.permissions
                    : [];

            localStorage.setItem(
                "permissions",
                JSON.stringify(
                    permissions
                )
            );

            // =================================================
            // VERY IMPORTANT
            // Verify Token Saved
            // =================================================

            const savedToken =
                localStorage.getItem(
                    "token"
                );

            const savedTokenType =
                localStorage.getItem(
                    "token_type"
                );

            const savedUser =
                localStorage.getItem(
                    "user"
                );

            const savedRole =
                localStorage.getItem(
                    "role"
                );

            console.log(
                "========================================"
            );

            console.log(
                "LOCAL STORAGE AFTER LOGIN"
            );

            console.log(
                "TOKEN:",
                savedToken
            );

            console.log(
                "TOKEN TYPE:",
                savedTokenType
            );

            console.log(
                "USER:",
                savedUser
            );

            console.log(
                "ROLE:",
                savedRole
            );

            console.log(
                "========================================"
            );

            // =================================================
            // IMPORTANT
            // If Token wasn't saved
            // Don't navigate
            // =================================================

            if (!savedToken) {
                setError(
                    "حدث خطأ: لم يتم حفظ Token في المتصفح."
                );

                return;
            }

            // =================================================
            // Success
            // =================================================

            setSuccess(
                data?.message ||
                    "تم تسجيل الدخول بنجاح."
            );

            // =================================================
            // Navigate
            // =================================================

            setTimeout(() => {
                if (fromCheckout) {
                    navigate(
                        "/checkout",
                        {
                            replace: true,
                        }
                    );

                    return;
                }

                navigate(
                    "/Cart",
                    {
                        replace: true,
                    }
                );
            }, 800);

        } catch (err) {
            console.error(
                "LOGIN FETCH ERROR:",
                err
            );

            setError(
                "تعذر الاتصال بالخادم. تأكدي أن Laravel يعمل على http://127.0.0.1:8000"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // Render
    // =========================================================

    return (
        <main
            dir="rtl"
            className="min-h-screen flex items-center justify-center bg-[#F5E6D2] px-4 py-16"
        >
            <div className="w-full max-w-lg">

                <div className="bg-white/95 rounded-2xl p-6 md:p-10 shadow-xl">

                    {/* Header */}

                    <div className="text-center mb-10">

                        <h1 className="text-3xl font-bold text-[#24572b] mb-3">
                            مرحباً بك مجدداً
                        </h1>

                        <p className="text-[#414940]">
                            {fromCheckout
                                ? "سجل دخولك للمتابعة وإتمام طلبك"
                                : "سجل دخولك للوصول إلى أفخر التوابل والفاكهة"}
                        </p>

                    </div>

                    {/* Account Type */}

                    <div className="flex border-b border-[#c1c9bd] mb-8">

                        <button
                            type="button"
                            onClick={() => {
                                setRole(
                                    "customer"
                                );

                                setError("");
                            }}
                            disabled={loading}
                            className={`flex-1 py-4 font-bold transition-all ${
                                role === "customer"
                                    ? "text-[#E06D2E] border-b-2 border-[#E06D2E]"
                                    : "text-[#71796f]"
                            }`}
                        >
                            حساب عميل
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setRole(
                                    "b2b"
                                );

                                setError("");
                            }}
                            disabled={loading}
                            className={`flex-1 py-4 font-bold transition-all ${
                                role === "b2b"
                                    ? "text-[#E06D2E] border-b-2 border-[#E06D2E]"
                                    : "text-[#71796f]"
                            }`}
                        >
                            حساب مستورد / B2B
                        </button>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success */}

                    {success && (
                        <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Form */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-6"
                    >

                        {/* Email */}

                        <div>

                            <label className="block mb-2 text-sm font-medium text-[#414940]">
                                البريد الإلكتروني
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="example@mail.com"
                                disabled={loading}
                                autoComplete="email"
                                className="w-full h-14 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#E06D2E] transition disabled:opacity-60"
                            />

                        </div>

                        {/* Password */}

                        <div>

                            <div className="flex justify-between items-center mb-2">

                                <label className="text-sm font-medium text-[#414940]">
                                    كلمة المرور
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-[#E06D2E] hover:text-[#C45A21]"
                                >
                                    نسيت كلمة المرور؟
                                </Link>

                            </div>

                            <div className="relative">

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="••••••••"
                                    disabled={loading}
                                    autoComplete="current-password"
                                    className="w-full h-14 px-4 pl-12 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#E06D2E] transition disabled:opacity-60"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={loading}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71796f]"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword
                                            ? "visibility_off"
                                            : "visibility"}
                                    </span>
                                </button>

                            </div>

                        </div>

                        {/* Remember */}

                        <div className="flex items-center gap-3">

                            <input
                                id="remember"
                                type="checkbox"
                                name="remember"
                                checked={
                                    formData.remember
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={loading}
                                className="w-5 h-5 rounded border-[#c1c9bd] text-[#E06D2E] focus:ring-[#E06D2E]"
                            />

                            <label
                                htmlFor="remember"
                                className="text-sm text-[#414940]"
                            >
                                تذكرني على هذا الجهاز
                            </label>

                        </div>

                        {/* Login Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#F07A26] text-white font-bold text-lg rounded-xl hover:bg-[#4E7A3C] hover:-translate-y-1 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading
                                ? "جاري تسجيل الدخول..."
                                : "تسجيل الدخول"}
                        </button>

                    </form>

                    {/* Register */}

                    <div className="mt-8 pt-6 border-t border-[#c1c9bd] text-center">

                        <span className="text-sm text-[#414940]">
                            ليس لديك حساب؟
                        </span>

                        <Link
                            to="/register"
                            className="mr-2 text-[#4E7A3C] font-bold hover:text-[#24572b]"
                        >
                            إنشاء حساب جديد
                        </Link>

                    </div>

                </div>

            </div>
        </main>
    );
}