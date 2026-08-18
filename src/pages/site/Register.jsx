
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  // =========================
  // States
  // =========================

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+966");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // =========================
  // Password Strength
  // =========================

  const getPasswordStrength = () => {
    let strength = 0;

    if (password.length > 0) strength += 20;
    if (password.length > 6) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    return strength;
  };

  const strength = getPasswordStrength();

  // =========================
  // Email Validation
  // =========================

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // =========================
  // Form Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccess("");

    const newErrors = {};

    // =========================
    // Frontend Validation
    // =========================

    if (!fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    if (!email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!phone.trim()) {
      newErrors.phone = "رقم الجوال مطلوب";
    }

    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 8) {
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "تأكيد كلمة المرور مطلوب";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "كلمتا المرور غير متطابقتين";
    }

    if (!acceptedTerms) {
      newErrors.terms =
        "يجب الموافقة على الشروط والأحكام";
    }

    // إذا يوجد أخطاء
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // =========================
    // تجهيز رقم الهاتف
    // =========================

    const fullPhone = `${countryCode}${phone.replace(/\s+/g, "")}`;

    // =========================
    // إرسال البيانات إلى Laravel
    // =========================

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            name: fullName,
            email: email,
            phone: fullPhone,
            password: password,
            password_confirmation: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      console.log("Laravel Response:", data);

      // =========================
      // Laravel Validation Errors
      // =========================

      if (!response.ok) {
        const laravelErrors = {};

        if (data.errors) {
          Object.keys(data.errors).forEach((field) => {
            const message = data.errors[field]?.[0];

            if (field === "name") {
              laravelErrors.fullName = message;
            } else if (field === "email") {
              laravelErrors.email = message;
            } else if (field === "phone") {
              laravelErrors.phone = message;
            } else if (field === "password") {
              laravelErrors.password = message;
            } else {
              laravelErrors[field] = message;
            }
          });
        }

        setErrors(
          Object.keys(laravelErrors).length > 0
            ? laravelErrors
            : {
                general:
                  data.message ||
                  "حدث خطأ أثناء إنشاء الحساب",
              }
        );

        return;
      }

      // =========================
      // Registration Successful
      // =========================

      setSuccess(
        data.message ||
          "تم إنشاء الحساب بنجاح"
      );

      // =========================
      // الحصول على البيانات
      // =========================

      /*
       * Laravel قد يرجع البيانات بهذا الشكل:
       *
       * data.token
       * data.user
       *
       * أو:
       *
       * data.data.token
       * data.data.user
       *
       * لذلك نتعامل مع الحالتين.
       */

      const responseData = data.data || data;

      const token = responseData.token;
      const user = responseData.user;

      // =========================
      // حفظ Token
      // =========================

      if (token) {
        localStorage.setItem(
          "token",
          token
        );
      }

      // =========================
      // حفظ User
      // =========================

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      // =========================
      // الانتقال إلى الصفحة الرئيسية
      // =========================

      setTimeout(() => {
    navigate("/Cart", {
        replace: true,
    });
}, 1000);

      setErrors({
        general:
          "تعذر الاتصال بالخادم. تأكدي أن Laravel يعمل على http://127.0.0.1:8000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-[#F5E6D2] text-[#191c18]"
    >
      {/* Register Content */}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:px-8 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8 items-center">

          {/* =========================
              الصورة
          ========================= */}

          <div className="hidden lg:flex flex-col justify-center p-6">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-xl">

              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3daByV0DoLAb37KkkVOgfu_rczNkzHhbwYUDbURug7R8uw908HQywjp5Fc4NQzWAAggtABSSNmVeFK3OmiymJ0miiNZe1Ad0ClL0y2V3kFdY8AQzrh07RJhBYir3FONT0jYBM3vTjArTM4R61dpGboxjaI3T2h2eUz_PyZEM6sLbZ5tB9x_G3XHZ-rXyZEWBT67YFyOiask52Z19RBldO2Clv6ORpvkAcH5dZHhNfnUiXCh1MTVu"
                alt="Spices and dried fruits"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="absolute bottom-8 right-8 text-white">

                <p className="text-3xl font-bold mb-2">
                  طبيعي 100%
                </p>

                <p className="text-base opacity-90">
                  من مزارعنا إلى مائدتكم بكل حب وعناية.
                </p>

              </div>
            </div>
          </div>

          {/* =========================
              Register Form
          ========================= */}

          <div className="w-full max-w-md mx-auto">

            <div className="bg-white/95 backdrop-blur-md border border-white/30 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] rounded-2xl p-6 md:p-10">

              {/* العنوان */}

              <div className="text-center mb-10">

                <h1 className="text-2xl md:text-3xl font-bold text-[#24572b] mb-3">
                  انضم إلى عائلة توابل وثمار
                </h1>

                <p className="text-[15px] leading-relaxed text-[#414940]">
                  استمتع بتجربة تسوق فريدة لأجود المنتجات الطبيعية
                </p>

              </div>

              {/* =========================
                  رسالة عامة
              ========================= */}

              {errors.general && (
                <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {errors.general}
                </div>
              )}

              {/* =========================
                  رسالة النجاح
              ========================= */}

              {success && (
                <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                  {success}
                </div>
              )}

              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >

                {/* =========================
                    الاسم الكامل
                ========================= */}

                <div>

                  <label className="block text-sm font-medium text-[#414940] mb-2">
                    الاسم الكامل
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      placeholder="أحمد محمد"
                      disabled={loading}
                      className={`w-full h-12 px-4 pl-12 rounded-xl border ${
                        errors.fullName
                          ? "border-red-500"
                          : "border-[#c1c9bd]"
                      } bg-[#f3f4ed] focus:ring-2 focus:ring-[#F07A26] focus:border-transparent outline-none transition-all disabled:opacity-60`}
                    />

                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#71796f]">
                      person
                    </span>

                  </div>

                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}

                </div>

                {/* =========================
                    البريد الإلكتروني
                ========================= */}

                <div>

                  <label className="block text-sm font-medium text-[#414940] mb-2">
                    البريد الإلكتروني
                  </label>

                  <div className="relative">

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="example@mail.com"
                      disabled={loading}
                      className={`w-full h-12 px-4 pl-12 rounded-xl border ${
                        errors.email
                          ? "border-red-500"
                          : "border-[#c1c9bd]"
                      } bg-[#f3f4ed] focus:ring-2 focus:ring-[#F07A26] focus:border-transparent outline-none transition-all disabled:opacity-60`}
                    />

                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#71796f]">
                      mail
                    </span>

                  </div>

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}

                </div>

                {/* =========================
                    رقم الجوال
                ========================= */}

                <div>

                  <label className="block text-sm font-medium text-[#414940] mb-2">
                    رقم الجوال
                  </label>

                  <div className="flex gap-2">

                    <select
                      value={countryCode}
                      onChange={(e) =>
                        setCountryCode(e.target.value)
                      }
                      disabled={loading}
                      className="w-24 h-12 px-2 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] focus:ring-2 focus:ring-[#F07A26] outline-none disabled:opacity-60"
                    >

                      <option value="+966">
                        +966
                      </option>

                      <option value="+967">
                        +967
                      </option>

                      <option value="+971">
                        +971
                      </option>

                      <option value="+965">
                        +965
                      </option>

                    </select>

                    <div className="relative flex-1">

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                        placeholder="50 123 4567"
                        disabled={loading}
                        className={`w-full h-12 px-4 pl-12 rounded-xl border ${
                          errors.phone
                            ? "border-red-500"
                            : "border-[#c1c9bd]"
                        } bg-[#f3f4ed] focus:ring-2 focus:ring-[#F07A26] focus:border-transparent outline-none transition-all disabled:opacity-60`}
                      />

                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#71796f]">
                        call
                      </span>

                    </div>

                  </div>

                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone}
                    </p>
                  )}

                </div>

                {/* =========================
                    كلمة المرور
                ========================= */}

                <div>

                  <label className="block text-sm font-medium text-[#414940] mb-2">
                    كلمة المرور
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      disabled={loading}
                      className={`w-full h-12 px-4 pl-12 rounded-xl border ${
                        errors.password
                          ? "border-red-500"
                          : "border-[#c1c9bd]"
                      } bg-[#f3f4ed] focus:ring-2 focus:ring-[#F07A26] focus:border-transparent outline-none transition-all disabled:opacity-60`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      disabled={loading}
                      className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#71796f]"
                    >
                      {showPassword
                        ? "visibility_off"
                        : "visibility"}
                    </button>

                  </div>

                  {/* Password Strength */}

                  <div className="w-full bg-[#e7e9e2] h-1 rounded-full overflow-hidden mt-2">

                    <div
                      className={`h-full transition-all duration-300 ${
                        strength <= 40
                          ? "bg-[#ba1a1a]"
                          : strength <= 80
                          ? "bg-[#F07A26]"
                          : "bg-[#24572b]"
                      }`}
                      style={{
                        width: `${strength}%`,
                      }}
                    />

                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}

                </div>

                {/* =========================
                    تأكيد كلمة المرور
                ========================= */}

                <div>

                  <label className="block text-sm font-medium text-[#414940] mb-2">
                    تأكيد كلمة المرور
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      disabled={loading}
                      className={`w-full h-12 px-4 pl-12 rounded-xl border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#c1c9bd]"
                      } bg-[#f3f4ed] focus:ring-2 focus:ring-[#F07A26] focus:border-transparent outline-none transition-all disabled:opacity-60`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      disabled={loading}
                      className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#71796f]"
                    >
                      {showConfirmPassword
                        ? "visibility_off"
                        : "lock"}
                    </button>

                  </div>

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}

                </div>

                {/* =========================
                    الشروط
                ========================= */}

                <div>

                  <div className="flex items-center gap-3 py-2">

                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) =>
                        setAcceptedTerms(
                          e.target.checked
                        )
                      }
                      disabled={loading}
                      className="w-5 h-5 rounded border-[#c1c9bd] text-[#F07A26] focus:ring-[#F07A26]"
                    />

                    <label className="text-sm text-[#414940]">
                      أوافق على الشروط والأحكام وسياسة الخصوصية
                    </label>

                  </div>

                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.terms}
                    </p>
                  )}

                </div>

                {/* =========================
                    إنشاء الحساب
                ========================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#F07A26] text-white font-bold text-lg rounded-xl hover:bg-[#4E7A3C] hover:shadow-lg hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-300 shadow-md mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >

                  {loading
                    ? "جاري إنشاء الحساب..."
                    : "إنشاء الحساب"}

                </button>

              </form>

              {/* =========================
                  تسجيل الدخول
              ========================= */}

              <div className="mt-8 text-center">

                <p className="text-sm text-[#414940]">

                  <span className="ml-2">
                    لديك حساب بالفعل؟
                  </span>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center bg-white text-[#4E7A3C] font-bold border border-[#4E7A3C] px-6 py-2 rounded-lg hover:bg-[#4E7A3C] hover:text-white transition-all duration-300"
                  >
                    تسجيل الدخول
                  </Link>

                </p>

              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

