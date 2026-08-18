import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Address() {
    const navigate = useNavigate();
    const { id } = useParams();

    // ==============================
    // بيانات العنوان - مؤقتة
    // ==============================
    const [address, setAddress] = useState({
        country: "اليمن",
        city: "صنعاء",
        area: "حدة",
        street: "شارع الجزائر",
        details: "بجوار السوق المركزي",
    });

    // ==============================
    // حالة نافذة التعديل
    // ==============================
    const [showEdit, setShowEdit] = useState(false);

    // ==============================
    // فتح نافذة التعديل
    // ==============================
    const handleEdit = () => {
        setShowEdit(true);
    };

    // ==============================
    // حفظ التعديل
    // ==============================
    const handleSave = (e) => {
        e.preventDefault();

        setShowEdit(false);

        alert("تم تحديث العنوان بنجاح");
    };

    return (
        <div className="p-6">

            {/* ==============================
                Header
            ============================== */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        عنوان المستخدم
                    </h1>

                    <p className="text-gray-500 mt-1">
                        عرض وإدارة عنوان المستخدم رقم {id}
                    </p>
                </div>

                <button
                    onClick={() => navigate(`/admin/users/${id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>

                    العودة للمستخدم
                </button>

            </div>

            {/* ==============================
                Address Card
            ============================== */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">

                {/* Card Header */}
                <div className="flex items-center justify-between p-5 border-b">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">

                            <span className="material-symbols-outlined">
                                location_on
                            </span>

                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-800">
                                العنوان الرئيسي
                            </h2>

                            <p className="text-sm text-gray-500">
                                بيانات عنوان المستخدم
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >

                        <span className="material-symbols-outlined">
                            edit
                        </span>

                        تعديل العنوان

                    </button>

                </div>

                {/* Address Details */}
                <div className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Country */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                الدولة
                            </p>

                            <p className="font-medium text-gray-800">
                                {address.country}
                            </p>
                        </div>

                        {/* City */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                المدينة
                            </p>

                            <p className="font-medium text-gray-800">
                                {address.city}
                            </p>
                        </div>

                        {/* Area */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                المنطقة
                            </p>

                            <p className="font-medium text-gray-800">
                                {address.area}
                            </p>
                        </div>

                        {/* Street */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                الشارع
                            </p>

                            <p className="font-medium text-gray-800">
                                {address.street}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="md:col-span-2">

                            <p className="text-sm text-gray-500 mb-1">
                                تفاصيل إضافية
                            </p>

                            <p className="font-medium text-gray-800">
                                {address.details}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==============================
                Edit Modal
            ============================== */}
            {showEdit && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b">

                            <h2 className="text-lg font-bold text-gray-800">
                                تعديل العنوان
                            </h2>

                            <button
                                onClick={() => setShowEdit(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >

                                <span className="material-symbols-outlined">
                                    close
                                </span>

                            </button>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSave}
                            className="p-5 space-y-4"
                        >

                            {/* Country */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الدولة
                                </label>

                                <input
                                    type="text"
                                    value={address.country}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            country: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* City */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    المدينة
                                </label>

                                <input
                                    type="text"
                                    value={address.city}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            city: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Area */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    المنطقة
                                </label>

                                <input
                                    type="text"
                                    value={address.area}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            area: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Street */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الشارع
                                </label>

                                <input
                                    type="text"
                                    value={address.street}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            street: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Details */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تفاصيل إضافية
                                </label>

                                <textarea
                                    rows="3"
                                    value={address.details}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            details: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-3">

                                <button
                                    type="button"
                                    onClick={() => setShowEdit(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    حفظ التعديلات
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}