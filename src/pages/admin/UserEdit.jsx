import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    // ==========================================
    // بيانات المستخدم مؤقتة
    // لاحقاً سيتم جلبها من Laravel API
    // ==========================================

    const [formData, setFormData] = useState({
        name: "خالد عبدالله",
        email: "khaled@example.com",
        phone: "733456789",
        role: "local_customer",
        customerType: "local",
        status: "active",
    });

    // ==========================================
    // تغيير البيانات
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // حفظ التعديلات
    // ==========================================

    const handleSubmit = (e) => {
        e.preventDefault();

        // حالياً فقط Frontend
        console.log("User ID:", id);
        console.log("Updated User:", formData);

        alert("تم حفظ تعديلات المستخدم بنجاح");

        navigate(`/admin/users/${id}`);
    };

    return (
        <div className="space-y-6">

            {/* ==========================================
                Header
            ========================================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-4">

                    {/* زر الرجوع */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/users/${id}`)
                        }
                        className="w-11 h-11 rounded-xl bg-white border border-[#e5e7e2] flex items-center justify-center hover:bg-[#f3f4ed] transition"
                    >
                        <span className="material-symbols-outlined">
                            arrow_forward
                        </span>
                    </button>

                    <div>

                        <h1 className="text-2xl font-bold text-[#24572b]">
                            تعديل المستخدم
                        </h1>

                        <p className="text-sm text-[#71796f] mt-1">
                            تعديل بيانات المستخدم
                        </p>

                    </div>

                </div>

            </div>

            {/* ==========================================
                Edit Form
            ========================================== */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7e2]"
            >

                {/* ==========================================
                    Basic Information
                ========================================== */}

                <div className="flex items-center gap-3 mb-6">

                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">

                        <span className="material-symbols-outlined text-[#24572b]">
                            person
                        </span>

                    </div>

                    <div>

                        <h2 className="font-bold text-lg text-[#24572b]">
                            المعلومات الأساسية
                        </h2>

                        <p className="text-xs text-[#71796f]">
                            تعديل بيانات الحساب
                        </p>

                    </div>

                </div>

                {/* ==========================================
                    Fields
                ========================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* الاسم */}

                    <div>

                        <label className="block text-sm font-bold text-[#374151] mb-2">
                            الاسم
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#dfe3dc] focus:outline-none focus:ring-2 focus:ring-[#24572b]"
                            placeholder="أدخل اسم المستخدم"
                        />

                    </div>

                    {/* البريد */}

                    <div>

                        <label className="block text-sm font-bold text-[#374151] mb-2">
                            البريد الإلكتروني
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#dfe3dc] focus:outline-none focus:ring-2 focus:ring-[#24572b]"
                            placeholder="أدخل البريد الإلكتروني"
                        />

                    </div>

                    {/* الهاتف */}

                    <div>

                        <label className="block text-sm font-bold text-[#374151] mb-2">
                            رقم الجوال
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#dfe3dc] focus:outline-none focus:ring-2 focus:ring-[#24572b]"
                            placeholder="أدخل رقم الجوال"
                        />

                    </div>

                    {/* الدور */}

                    <div>

                        <label className="block text-sm font-bold text-[#374151] mb-2">
                            الدور
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#dfe3dc] bg-white focus:outline-none focus:ring-2 focus:ring-[#24572b]"
                        >

                            <option value="admin">
                                أدمن
                            </option>

                            <option value="employee">
                                موظف
                            </option>

                            <option value="local_customer">
                                عميل محلي
                            </option>

                            <option value="international_customer">
                                عميل دولي
                            </option>

                        </select>

                    </div>

                    {/* نوع العميل */}

                    <div>

                        <label className="block text-sm font-bold text-[#374151] mb-2">
                            نوع العميل
                        </label>

                        <select
                            name="customerType"
                            value={formData.customerType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#dfe3dc] bg-white focus:outline-none focus:ring-2 focus:ring-[#24572b]"
                        >

                            <option value="local">
                                محلي
                            </option>

                            <option value="international">
                                دولي
                            </option>

                        </select>

                    </div>

                    {/* الحالة */}

                    <div>

                        <label className="block text-sm font-bold text-[#374151] mb-2">
                            حالة الحساب
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-[#dfe3dc] bg-white focus:outline-none focus:ring-2 focus:ring-[#24572b]"
                        >

                            <option value="active">
                                نشط
                            </option>

                            <option value="inactive">
                                غير نشط
                            </option>

                        </select>

                    </div>

                </div>

                {/* ==========================================
                    Buttons
                ========================================== */}

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-[#e5e7e2]">

                    {/* إلغاء */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/admin/users/${id}`)
                        }
                        className="px-6 py-3 rounded-xl border border-[#dfe3dc] text-[#374151] font-bold hover:bg-[#f3f4ed] transition"
                    >
                        إلغاء
                    </button>

                    {/* حفظ */}

                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F07A26] text-white font-bold hover:bg-[#4E7A3C] transition"
                    >

                        <span className="material-symbols-outlined">
                            save
                        </span>

                        حفظ التعديلات

                    </button>

                </div>

            </form>

        </div>
    );
}