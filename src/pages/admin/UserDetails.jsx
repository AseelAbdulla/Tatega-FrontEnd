import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UserDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    // =====================================================
    // User
    // =====================================================

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =====================================================
    // Get Token
    // =====================================================

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("auth_token") ||
            localStorage.getItem("access_token")
        );
    };

    // =====================================================
    // Get User
    // =====================================================

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            const response = await axios.get(
                `http://127.0.0.1:8000/api/users/${id}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("USER RESPONSE:", response.data);

            setUser(response.data.data);

        } catch (error) {
            console.error("GET USER ERROR:", error);

            setError(
                error.response?.data?.message ||
                    "حدث خطأ أثناء جلب بيانات المستخدم"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // Delete User
    // =====================================================

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `هل أنت متأكد من حذف المستخدم "${user.name}"؟`
        );

        if (!confirmed) {
            return;
        }

        try {
            const token = getToken();

            await axios.delete(
                `http://127.0.0.1:8000/api/users/${user.id}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("تم حذف المستخدم بنجاح");

            navigate("/admin/users");

        } catch (error) {
            console.error("DELETE USER ERROR:", error);

            alert(
                error.response?.data?.message ||
                    "حدث خطأ أثناء حذف المستخدم"
            );
        }
    };

    // =====================================================
    // Role Name
    // =====================================================

    const getRoleName = (role) => {
        switch (role) {
            case "admin":
                return "أدمن";

            case "employee":
                return "موظف";

            case "manager":
                return "مدير";

            case "local-client":
                return "عميل محلي";

            case "international-client":
                return "عميل دولي";

            case "local_customer":
                return "عميل محلي";

            case "international_customer":
                return "عميل دولي";

            default:
                return role || "غير محدد";
        }
    };

    // =====================================================
    // Role Style
    // =====================================================

    const getRoleStyle = (role) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-700";

            case "employee":
                return "bg-blue-100 text-blue-700";

            case "manager":
                return "bg-indigo-100 text-indigo-700";

            case "local-client":
            case "local_customer":
                return "bg-green-100 text-green-700";

            case "international-client":
            case "international_customer":
                return "bg-orange-100 text-orange-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // =====================================================
    // Order Status
    // =====================================================

    const getOrderStatus = (status) => {
        switch (status) {
            case "completed":
                return {
                    text: "مكتمل",
                    style: "bg-green-100 text-green-700",
                };

            case "processing":
                return {
                    text: "قيد المعالجة",
                    style: "bg-orange-100 text-orange-700",
                };

            case "cancelled":
                return {
                    text: "ملغي",
                    style: "bg-red-100 text-red-700",
                };

            default:
                return {
                    text: status || "غير محدد",
                    style: "bg-gray-100 text-gray-700",
                };
        }
    };

    // =====================================================
    // Loading
    // =====================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg font-bold text-[#24572b]">
                    جاري تحميل بيانات المستخدم...
                </div>
            </div>
        );
    }

    // =====================================================
    // Error
    // =====================================================

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">

                <div className="text-red-600 font-bold">
                    {error}
                </div>

                <button
                    onClick={() => navigate("/admin/users")}
                    className="bg-[#F07A26] text-white px-5 py-3 rounded-xl font-bold"
                >
                    العودة للمستخدمين
                </button>

            </div>
        );
    }

    // =====================================================
    // No User
    // =====================================================

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-600 font-bold">
                    المستخدم غير موجود
                </div>
            </div>
        );
    }

    // =====================================================
    // Role
    // =====================================================

    const role = user.roles?.[0]?.name;

    // =====================================================
    // Address
    // =====================================================

    const address = user.addresses?.[0];

    // =====================================================
    // Orders
    // =====================================================

    const orders = user.orders || [];

    // =====================================================
    // Render
    // =====================================================

    return (
        <div className="space-y-6">

            {/* =====================================================
                Header
            ===================================================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate("/admin/users")}
                        className="w-11 h-11 rounded-xl bg-white border border-[#e5e7e2] flex items-center justify-center hover:bg-[#f3f4ed] transition"
                    >
                        <span className="material-symbols-outlined">
                            arrow_forward
                        </span>
                    </button>

                    <div>

                        <h1 className="text-2xl font-bold text-[#24572b]">
                            تفاصيل المستخدم
                        </h1>

                        <p className="text-sm text-[#71796f] mt-1">
                            عرض معلومات المستخدم وطلباته
                        </p>

                    </div>

                </div>

                {/* Buttons */}

                <div className="flex flex-col sm:flex-row gap-3">

                    {/* Edit */}

                    <button
                        onClick={() =>
                            navigate(`/admin/users/${user.id}/edit`)
                        }
                        className="flex items-center justify-center gap-2 bg-[#F07A26] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#4E7A3C] transition"
                    >

                        <span className="material-symbols-outlined">
                            edit
                        </span>

                        تعديل المستخدم

                    </button>

                    {/* Delete */}

                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-red-700 transition"
                    >

                        <span className="material-symbols-outlined">
                            delete
                        </span>

                        حذف المستخدم

                    </button>

                </div>

            </div>


            {/* =====================================================
                User Header Card
            ===================================================== */}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7e2]">

                <div className="flex flex-col md:flex-row md:items-center gap-6">

                    {/* Avatar */}

                    <div className="w-24 h-24 rounded-full bg-[#e7f0e3] text-[#24572b] flex items-center justify-center text-3xl font-bold">

                        {user.name?.charAt(0)}

                    </div>


                    {/* User Information */}

                    <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                            <h2 className="text-2xl font-bold text-[#191c18]">
                                {user.name}
                            </h2>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleStyle(
                                    role
                                )}`}
                            >
                                {getRoleName(role)}
                            </span>

                        </div>


                        <div className="flex flex-wrap gap-5 mt-3 text-sm text-[#71796f]">

                            <div className="flex items-center gap-2">

                                <span className="material-symbols-outlined text-lg">
                                    mail
                                </span>

                                {user.email}

                            </div>


                            <div className="flex items-center gap-2">

                                <span className="material-symbols-outlined text-lg">
                                    call
                                </span>

                                {user.phone || "لا يوجد"}

                            </div>

                        </div>

                    </div>


                    {/* Status */}

                    <div className="flex flex-col items-start md:items-end gap-2">

                        <span className="text-sm text-[#71796f]">
                            حالة الحساب
                        </span>

                        <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                                user.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {user.status === "active"
                                ? "نشط"
                                : "غير نشط"}
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                Information Cards
            ===================================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                {/* =================================================
                    Basic Information
                ================================================= */}

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7e2]">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">

                            <span className="material-symbols-outlined text-[#24572b]">
                                person
                            </span>

                        </div>

                        <div>

                            <h3 className="font-bold text-lg text-[#24572b]">
                                المعلومات الأساسية
                            </h3>

                            <p className="text-xs text-[#71796f]">
                                بيانات الحساب
                            </p>

                        </div>

                    </div>


                    <div className="space-y-4">

                        <div className="flex justify-between border-b border-[#e5e7e2] pb-3">

                            <span className="text-sm text-[#71796f]">
                                الاسم
                            </span>

                            <span className="font-medium">
                                {user.name}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-[#e5e7e2] pb-3">

                            <span className="text-sm text-[#71796f]">
                                البريد الإلكتروني
                            </span>

                            <span className="font-medium">
                                {user.email}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-[#e5e7e2] pb-3">

                            <span className="text-sm text-[#71796f]">
                                رقم الجوال
                            </span>

                            <span className="font-medium">
                                {user.phone || "لا يوجد"}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-[#e5e7e2] pb-3">

                            <span className="text-sm text-[#71796f]">
                                الدور
                            </span>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleStyle(
                                    role
                                )}`}
                            >
                                {getRoleName(role)}
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-sm text-[#71796f]">
                                تاريخ التسجيل
                            </span>

                            <span className="font-medium">
                                {user.created_at
                                    ? new Date(
                                          user.created_at
                                      ).toLocaleDateString("ar-YE")
                                    : "غير محدد"}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    Address
                ================================================= */}

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7e2]">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">

                                <span className="material-symbols-outlined text-[#F07A26]">
                                    location_on
                                </span>

                            </div>

                            <div>

                                <h3 className="font-bold text-lg text-[#24572b]">
                                    عنوان المستخدم
                                </h3>

                                <p className="text-xs text-[#71796f]">
                                    معلومات العنوان
                                </p>

                            </div>

                        </div>


                        <button
                            onClick={() =>
                                navigate(
                                    `/admin/users/${id}/address`
                                )
                            }
                            className="flex items-center justify-center gap-2 bg-[#F07A26] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#4E7A3C] transition"
                        >

                            <span className="material-symbols-outlined text-lg">
                                location_on
                            </span>

                            إدارة العنوان

                        </button>

                    </div>


                    <div className="space-y-4">

                        <div className="flex justify-between border-b border-[#e5e7e2] pb-3">

                            <span className="text-sm text-[#71796f]">
                                الدولة
                            </span>

                            <span className="font-medium">
                                {address?.country || "لا يوجد"}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-[#e5e7e2] pb-3">

                            <span className="text-sm text-[#71796f]">
                                المدينة
                            </span>

                            <span className="font-medium">
                                {address?.city || "لا يوجد"}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-[#e5e7e2] pb-3">

                            <span className="text-sm text-[#71796f]">
                                المنطقة
                            </span>

                            <span className="font-medium">
                                {address?.area || "لا يوجد"}
                            </span>

                        </div>


                        <div className="flex justify-between border-b border-[#e5e7e2] pb-3">

                            <span className="text-sm text-[#71796f]">
                                الشارع
                            </span>

                            <span className="font-medium">
                                {address?.street || "لا يوجد"}
                            </span>

                        </div>


                        <div className="flex justify-between">

                            <span className="text-sm text-[#71796f]">
                                التفاصيل
                            </span>

                            <span className="font-medium">
                                {address?.details || "لا يوجد"}
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                Orders
            ===================================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7e2] overflow-hidden">

                <div className="p-6 border-b border-[#e5e7e2] flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                            <span className="material-symbols-outlined text-blue-600">
                                shopping_cart
                            </span>

                        </div>

                        <div>

                            <h3 className="font-bold text-lg text-[#24572b]">
                                طلبات المستخدم
                            </h3>

                            <p className="text-xs text-[#71796f]">
                                الطلبات المرتبطة بهذا المستخدم
                            </p>

                        </div>

                    </div>


                    <span className="px-3 py-1 bg-[#f3f4ed] rounded-full text-sm font-bold">

                        {orders.length} طلب

                    </span>

                </div>


                <div className="overflow-x-auto">

                    {orders.length === 0 ? (

                        <div className="p-8 text-center text-[#71796f]">

                            لا توجد طلبات لهذا المستخدم

                        </div>

                    ) : (

                        <table className="w-full text-right">

                            <thead className="bg-[#f3f4ed]">

                                <tr>

                                    <th className="px-6 py-4 text-sm">
                                        رقم الطلب
                                    </th>

                                    <th className="px-6 py-4 text-sm">
                                        التاريخ
                                    </th>

                                    <th className="px-6 py-4 text-sm">
                                        الإجمالي
                                    </th>

                                    <th className="px-6 py-4 text-sm">
                                        الحالة
                                    </th>

                                    <th className="px-6 py-4 text-sm">
                                        الإجراء
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-[#e5e7e2]">

                                {orders.map((order) => {

                                    const status =
                                        getOrderStatus(
                                            order.status
                                        );

                                    return (

                                        <tr
                                            key={order.id}
                                            className="hover:bg-[#fafaf7]"
                                        >

                                            <td className="px-6 py-4 font-bold text-[#24572b]">

                                                #{order.id}

                                            </td>


                                            <td className="px-6 py-4 text-sm text-[#71796f]">

                                                {order.created_at
                                                    ? new Date(
                                                          order.created_at
                                                      ).toLocaleDateString(
                                                          "ar-YE"
                                                      )
                                                    : "غير محدد"}

                                            </td>


                                            <td className="px-6 py-4 font-medium">

                                                {order.total || "0"}

                                            </td>


                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${status.style}`}
                                                >

                                                    {status.text}

                                                </span>

                                            </td>


                                            <td className="px-6 py-4">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/orders/${order.id}`
                                                        )
                                                    }
                                                    className="flex items-center gap-1 text-sm text-[#F07A26] font-bold hover:text-[#24572b]"
                                                >

                                                    عرض الطلب

                                                    <span className="material-symbols-outlined text-lg">
                                                        arrow_back
                                                    </span>

                                                </button>

                                            </td>

                                        </tr>

                                    );
                                })}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </div>
    );
}