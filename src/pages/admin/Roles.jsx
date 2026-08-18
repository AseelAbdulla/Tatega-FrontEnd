import { useState } from "react";

export default function Roles() {
    // =========================
    // Roles التجريبية
    // =========================
    const [roles, setRoles] = useState([
        {
            id: 1,
            name: "admin",
            displayName: "الأدمن",
            description: "يمتلك جميع صلاحيات النظام وإدارة المستخدمين.",
            usersCount: 1,
            status: "active",
            permissions: [
                "users.view",
                "users.create",
                "users.edit",
                "users.delete",
                "roles.view",
                "roles.create",
                "roles.edit",
                "roles.delete",
                "orders.view",
                "orders.manage",
                "products.view",
                "products.manage",
                "notifications.view",
            ],
        },
        {
            id: 2,
            name: "employee",
            displayName: "الموظف العادي",
            description: "موظف يستطيع تنفيذ المهام المسموح بها داخل النظام.",
            usersCount: 5,
            status: "active",
            permissions: [
                "users.view",
                "orders.view",
                "orders.manage",
                "products.view",
                "notifications.view",
            ],
        },
        {
            id: 3,
            name: "local_customer",
            displayName: "العميل المحلي",
            description: "عميل يشتري كميات صغيرة للاستخدام المحلي.",
            usersCount: 24,
            status: "active",
            permissions: [
                "profile.view",
                "profile.edit",
                "orders.view",
                "orders.create",
                "notifications.view",
            ],
        },
        {
            id: 4,
            name: "international_customer",
            displayName: "العميل الدولي",
            description: "عميل دولي يستطيع طلب كميات أكبر.",
            usersCount: 8,
            status: "active",
            permissions: [
                "profile.view",
                "profile.edit",
                "orders.view",
                "orders.create",
                "bulk_orders.create",
                "notifications.view",
            ],
        },
    ]);

    // =========================
    // Modal
    // =========================
    const [showModal, setShowModal] = useState(false);

    const [editingRole, setEditingRole] = useState(null);

    // =========================
    // بيانات النموذج
    // =========================
    const [formData, setFormData] = useState({
        name: "",
        displayName: "",
        description: "",
        status: "active",
        permissions: [],
    });

    // =========================
    // قائمة الصلاحيات
    // =========================
    const permissionGroups = [
        {
            title: "المستخدمون",
            permissions: [
                {
                    value: "users.view",
                    label: "عرض المستخدمين",
                },
                {
                    value: "users.create",
                    label: "إضافة مستخدم",
                },
                {
                    value: "users.edit",
                    label: "تعديل المستخدمين",
                },
                {
                    value: "users.delete",
                    label: "حذف المستخدمين",
                },
            ],
        },
        {
            title: "الأدوار والصلاحيات",
            permissions: [
                {
                    value: "roles.view",
                    label: "عرض الأدوار",
                },
                {
                    value: "roles.create",
                    label: "إضافة دور",
                },
                {
                    value: "roles.edit",
                    label: "تعديل الأدوار",
                },
                {
                    value: "roles.delete",
                    label: "حذف الأدوار",
                },
            ],
        },
        {
            title: "الطلبات",
            permissions: [
                {
                    value: "orders.view",
                    label: "عرض الطلبات",
                },
                {
                    value: "orders.create",
                    label: "إنشاء طلب",
                },
                {
                    value: "orders.manage",
                    label: "إدارة الطلبات",
                },
                {
                    value: "bulk_orders.create",
                    label: "إنشاء طلبات كميات كبيرة",
                },
            ],
        },
        {
            title: "المنتجات",
            permissions: [
                {
                    value: "products.view",
                    label: "عرض المنتجات",
                },
                {
                    value: "products.manage",
                    label: "إدارة المنتجات",
                },
            ],
        },
        {
            title: "الملف الشخصي",
            permissions: [
                {
                    value: "profile.view",
                    label: "عرض الملف الشخصي",
                },
                {
                    value: "profile.edit",
                    label: "تعديل الملف الشخصي",
                },
            ],
        },
        {
            title: "الإشعارات",
            permissions: [
                {
                    value: "notifications.view",
                    label: "عرض الإشعارات",
                },
            ],
        },
    ];

    // =========================
    // فتح إضافة Role
    // =========================
    const handleAddRole = () => {
        setEditingRole(null);

        setFormData({
            name: "",
            displayName: "",
            description: "",
            status: "active",
            permissions: [],
        });

        setShowModal(true);
    };

    // =========================
    // فتح تعديل Role
    // =========================
    const handleEditRole = (role) => {
        setEditingRole(role);

        setFormData({
            name: role.name,
            displayName: role.displayName,
            description: role.description,
            status: role.status,
            permissions: role.permissions,
        });

        setShowModal(true);
    };

    // =========================
    // تغيير بيانات النموذج
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // تحديد / إلغاء صلاحية
    // =========================
    const handlePermissionChange = (permission) => {
        setFormData((prev) => {
            const exists = prev.permissions.includes(permission);

            return {
                ...prev,
                permissions: exists
                    ? prev.permissions.filter(
                          (item) => item !== permission
                      )
                    : [...prev.permissions, permission],
            };
        });
    };

    // =========================
    // حفظ Role
    // =========================
    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.displayName ||
            !formData.description
        ) {
            alert("يرجى تعبئة جميع البيانات المطلوبة.");
            return;
        }

        if (editingRole) {
            // تعديل
            setRoles((prev) =>
                prev.map((role) =>
                    role.id === editingRole.id
                        ? {
                              ...role,
                              ...formData,
                          }
                        : role
                )
            );
        } else {
            // إضافة
            const newRole = {
                id: Date.now(),
                name: formData.name,
                displayName: formData.displayName,
                description: formData.description,
                status: formData.status,
                permissions: formData.permissions,
                usersCount: 0,
            };

            setRoles((prev) => [...prev, newRole]);
        }

        setShowModal(false);
    };

    // =========================
    // حذف Role
    // =========================
    const handleDeleteRole = (id) => {
        const role = roles.find((item) => item.id === id);

        if (!role) return;

        if (role.usersCount > 0) {
            alert(
                "لا يمكن حذف هذه الصلاحية لأنها مرتبطة بمستخدمين."
            );
            return;
        }

        const confirmed = window.confirm(
            "هل أنت متأكد من حذف هذه الصلاحية؟"
        );

        if (!confirmed) return;

        setRoles((prev) =>
            prev.filter((item) => item.id !== id)
        );
    };

    // =========================
    // إغلاق Modal
    // =========================
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#F5E6D2] p-4 md:p-6"
        >
            {/* =========================
                Header
            ========================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#24572b]">
                        الأدوار والصلاحيات
                    </h1>

                    <p className="text-[#414940] mt-2">
                        إدارة أدوار المستخدمين والصلاحيات الخاصة بكل دور
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddRole}
                    className="flex items-center justify-center gap-2 bg-[#F07A26] hover:bg-[#4E7A3C] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md"
                >
                    <span className="material-symbols-outlined">
                        add
                    </span>

                    إضافة صلاحية
                </button>
            </div>

            {/* =========================
                Statistics
            ========================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2dfd7]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#71796f]">
                                إجمالي الأدوار
                            </p>

                            <h3 className="text-3xl font-bold text-[#24572b] mt-2">
                                {roles.length}
                            </h3>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-[#24572b]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#24572b]">
                                admin_panel_settings
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2dfd7]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#71796f]">
                                المستخدمون
                            </p>

                            <h3 className="text-3xl font-bold text-[#24572b] mt-2">
                                {roles.reduce(
                                    (total, role) =>
                                        total + role.usersCount,
                                    0
                                )}
                            </h3>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-[#F07A26]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#F07A26]">
                                group
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2dfd7]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#71796f]">
                                أدوار العملاء
                            </p>

                            <h3 className="text-3xl font-bold text-[#24572b] mt-2">
                                2
                            </h3>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600">
                                person
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2dfd7]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#71796f]">
                                الأدوار النشطة
                            </p>

                            <h3 className="text-3xl font-bold text-[#24572b] mt-2">
                                {
                                    roles.filter(
                                        (role) =>
                                            role.status ===
                                            "active"
                                    ).length
                                }
                            </h3>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600">
                                check_circle
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================
                Roles Table
            ========================= */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2dfd7] overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">

                        <thead className="bg-[#f3f4ed]">
                            <tr>
                                <th className="px-6 py-4 text-right text-sm font-bold text-[#414940]">
                                    الدور
                                </th>

                                <th className="px-6 py-4 text-right text-sm font-bold text-[#414940]">
                                    الاسم البرمجي
                                </th>

                                <th className="px-6 py-4 text-right text-sm font-bold text-[#414940]">
                                    الوصف
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-bold text-[#414940]">
                                    المستخدمون
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-bold text-[#414940]">
                                    الحالة
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-bold text-[#414940]">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {roles.map((role) => (
                                <tr
                                    key={role.id}
                                    className="border-t border-[#e7e9e2] hover:bg-[#fafaf7] transition"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-[#24572b]/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#24572b]">
                                                    shield
                                                </span>
                                            </div>

                                            <div>
                                                <p className="font-bold text-[#24572b]">
                                                    {
                                                        role.displayName
                                                    }
                                                </p>
                                            </div>

                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 rounded-lg bg-[#f3f4ed] text-sm text-[#414940] font-mono">
                                            {role.name}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5">
                                        <p className="text-sm text-[#71796f] max-w-xs">
                                            {
                                                role.description
                                            }
                                        </p>
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <span className="font-bold text-[#24572b]">
                                            {
                                                role.usersCount
                                            }
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        {role.status ===
                                        "active" ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                                                <span className="w-2 h-2 bg-green-600 rounded-full" />
                                                نشط
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-bold">
                                                <span className="w-2 h-2 bg-red-600 rounded-full" />
                                                غير نشط
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex items-center justify-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEditRole(
                                                        role
                                                    )
                                                }
                                                className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                                title="تعديل"
                                            >
                                                <span className="material-symbols-outlined">
                                                    edit
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteRole(
                                                        role.id
                                                    )
                                                }
                                                className="w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                title="حذف"
                                            >
                                                <span className="material-symbols-outlined">
                                                    delete
                                                </span>
                                            </button>

                                        </div>

                                    </td>
                                </tr>
                            ))}

                        </tbody>

                    </table>

                </div>
            </div>

            {/* =========================
                Modal
            ========================= */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#e7e9e2]">

                            <div>
                                <h2 className="text-xl font-bold text-[#24572b]">
                                    {editingRole
                                        ? "تعديل الصلاحية"
                                        : "إضافة صلاحية جديدة"}
                                </h2>

                                <p className="text-sm text-[#71796f] mt-1">
                                    حدد بيانات الدور والصلاحيات الخاصة به
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-10 h-10 rounded-full hover:bg-[#f3f4ed] text-[#71796f]"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>

                        </div>

                        {/* Modal Body */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-6 space-y-6"
                        >

                            {/* Role Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>
                                    <label className="block text-sm font-bold text-[#414940] mb-2">
                                        الاسم البرمجي
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="مثال: employee"
                                        disabled={Boolean(
                                            editingRole
                                        )}
                                        className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] disabled:opacity-60"
                                    />

                                    <p className="text-xs text-[#71796f] mt-1">
                                        يستخدم داخلياً في النظام.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#414940] mb-2">
                                        اسم الدور
                                    </label>

                                    <input
                                        type="text"
                                        name="displayName"
                                        value={
                                            formData.displayName
                                        }
                                        onChange={handleChange}
                                        placeholder="مثال: الموظف العادي"
                                        className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26]"
                                    />
                                </div>

                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-[#414940] mb-2">
                                    الوصف
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="اكتب وصفاً للدور..."
                                    className="w-full px-4 py-3 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] resize-none"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-bold text-[#414940] mb-2">
                                    الحالة
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26]"
                                >
                                    <option value="active">
                                        نشط
                                    </option>

                                    <option value="inactive">
                                        غير نشط
                                    </option>
                                </select>
                            </div>

                            {/* Permissions */}
                            <div>

                                <div className="flex items-center justify-between mb-4">

                                    <div>
                                        <h3 className="font-bold text-[#24572b]">
                                            الصلاحيات
                                        </h3>

                                        <p className="text-sm text-[#71796f]">
                                            حدد الصلاحيات التي يستطيع هذا الدور استخدامها.
                                        </p>
                                    </div>

                                    <span className="text-sm font-bold text-[#F07A26]">
                                        {
                                            formData.permissions
                                                .length
                                        }{" "}
                                        صلاحية
                                    </span>

                                </div>

                                <div className="space-y-4">

                                    {permissionGroups.map(
                                        (group) => (
                                            <div
                                                key={
                                                    group.title
                                                }
                                                className="border border-[#e2dfd7] rounded-xl p-4"
                                            >

                                                <h4 className="font-bold text-[#414940] mb-3">
                                                    {
                                                        group.title
                                                    }
                                                </h4>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                                    {group.permissions.map(
                                                        (
                                                            permission
                                                        ) => (
                                                            <label
                                                                key={
                                                                    permission.value
                                                                }
                                                                className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f8f5] hover:bg-[#f3f4ed] cursor-pointer"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.permissions.includes(
                                                                        permission.value
                                                                    )}
                                                                    onChange={() =>
                                                                        handlePermissionChange(
                                                                            permission.value
                                                                        )
                                                                    }
                                                                    className="w-5 h-5 rounded border-[#c1c9bd] text-[#F07A26] focus:ring-[#F07A26]"
                                                                />

                                                                <span className="text-sm text-[#414940]">
                                                                    {
                                                                        permission.label
                                                                    }
                                                                </span>
                                                            </label>
                                                        )
                                                    )}

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-[#e7e9e2]">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 rounded-xl border border-[#c1c9bd] text-[#414940] font-bold hover:bg-[#f3f4ed] transition"
                                >
                                    إلغاء
                                </button>

                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-[#F07A26] text-white font-bold hover:bg-[#4E7A3C] transition"
                                >
                                    {editingRole
                                        ? "حفظ التعديلات"
                                        : "إضافة الصلاحية"}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}
        </div>
    );
}