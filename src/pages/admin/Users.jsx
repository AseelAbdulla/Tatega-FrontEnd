import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const navigate = useNavigate();

    // =========================================================
    // API
    // =========================================================

    const API_URL = "http://127.0.0.1:8000/api";

    // =========================================================
    // State
    // =========================================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [toggling, setToggling] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // Search / Filter
    // =========================================================

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // =========================================================
    // Modal
    // =========================================================

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedUser, setSelectedUser] = useState(null);

    // =========================================================
    // Form
    // =========================================================

    const emptyForm = {
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
        role: "local_customer",
        status: "active",
    };

    const [formData, setFormData] = useState(emptyForm);

    // =========================================================
    // Delete Confirmation
    // =========================================================

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // =========================================================
    // Get Token
    // =========================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };

    // =========================================================
    // Headers
    // =========================================================

    const getHeaders = () => {
        const token = getToken();

        return {
            "Content-Type": "application/json",
            Accept: "application/json",

            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),
        };
    };

    // =========================================================
    // Read JSON Safely
    // =========================================================

    const readResponse = async (response) => {
        const text = await response.text();

        if (!text) {
            return {};
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            console.error("Invalid JSON Response:", text);

            return {
                message: text,
            };
        }
    };

    // =========================================================
    // Extract Laravel Response
    // =========================================================

    const extractData = (data) => {
        if (!data) {
            return [];
        }

        // Example:
        // {
        //   data: {
        //      data: [...]
        //   }
        // }

        if (data?.data?.data) {
            return data.data.data;
        }

        // Example:
        // {
        //   data: [...]
        // }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        // Example:
        // [...]
        if (Array.isArray(data)) {
            return data;
        }

        return data;
    };

    // =========================================================
    // Normalize Role
    // =========================================================

    const normalizeRole = (user) => {
        let role = "";

        // -----------------------------------------------------
        // role as string
        // -----------------------------------------------------

        if (typeof user?.role === "string") {
            role = user.role;
        }

        // -----------------------------------------------------
        // role as object
        // -----------------------------------------------------

        if (
            typeof user?.role === "object" &&
            user.role !== null
        ) {
            role =
                user.role.name ||
                user.role.slug ||
                "";
        }

        // -----------------------------------------------------
        // Spatie roles
        // -----------------------------------------------------

        if (
            !role &&
            Array.isArray(user?.roles) &&
            user.roles.length > 0
        ) {
            role =
                user.roles[0]?.name ||
                user.roles[0]?.slug ||
                "";
        }

        return role;
    };

    // =========================================================
    // Normalize User
    // =========================================================

    const normalizeUser = (user) => {
        if (!user) {
            return null;
        }

        const role = normalizeRole(user);

        return {
            ...user,

            id: user.id,

            name: user.name || "",

            email: user.email || "",

            phone: user.phone || "",

            role: role,

            status: user.status || "active",
        };
    };

    // =========================================================
    // Handle Unauthorized
    // =========================================================

    const handleUnauthorized = () => {
        localStorage.removeItem("token");

        setUsers([]);

        setError(
            "انتهت جلسة الدخول. يرجى تسجيل الدخول مرة أخرى."
        );

        // إذا كان لديك route خاص بتسجيل الدخول
        // يمكنك تفعيل السطر التالي:
        //
        // navigate("/login");
    };

    // =========================================================
    // Fetch Users
    // =========================================================

    const fetchUsers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/users`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            const data = await readResponse(response);

            console.log("Users API Response:", data);

            // -------------------------------------------------
            // Unauthorized
            // -------------------------------------------------

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            // -------------------------------------------------
            // Other Errors
            // -------------------------------------------------

            if (!response.ok) {
                setError(
                    data?.message ||
                        "حدث خطأ أثناء جلب المستخدمين."
                );

                return;
            }

            // -------------------------------------------------
            // Extract Data
            // -------------------------------------------------

            const result = extractData(data);

            let usersList = [];

            if (Array.isArray(result)) {
                usersList = result;
            } else if (
                Array.isArray(result?.data)
            ) {
                usersList = result.data;
            }

            // -------------------------------------------------
            // Normalize
            // -------------------------------------------------

            const normalizedUsers = usersList
                .map(normalizeUser)
                .filter(Boolean);

            setUsers(normalizedUsers);
        } catch (err) {
            console.error(
                "Fetch Users Error:",
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
    // Initial Load
    // =========================================================

    useEffect(() => {
        fetchUsers();
    }, []);

    // =========================================================
    // Statistics
    // =========================================================

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) =>
            user.status === "active"
    ).length;

    const inactiveUsers = users.filter(
        (user) =>
            user.status === "inactive"
    ).length;

    // =========================================================
    // Search + Filter
    // =========================================================

    const filteredUsers = users.filter(
        (user) => {
            const searchValue = search
                .toLowerCase()
                .trim();

            const name = String(
                user.name || ""
            ).toLowerCase();

            const email = String(
                user.email || ""
            ).toLowerCase();

            const phone = String(
                user.phone || ""
            ).toLowerCase();

            const matchesSearch =
                !searchValue ||
                name.includes(searchValue) ||
                email.includes(searchValue) ||
                phone.includes(searchValue);

            const matchesRole =
                roleFilter === "all" ||
                user.role === roleFilter;

            return (
                matchesSearch &&
                matchesRole
            );
        }
    );

    // =========================================================
    // Form Change
    // =========================================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // إزالة الخطأ بمجرد أن يبدأ المستخدم بالكتابة
        if (error) {
            setError("");
        }
    };

    // =========================================================
    // Open Add Modal
    // =========================================================

    const openAddModal = () => {
        setModalMode("add");

        setSelectedUser(null);

        setFormData({
            ...emptyForm,
        });

        setError("");
        setSuccess("");

        setShowModal(true);
    };

    // =========================================================
    // Open Edit Modal
    // =========================================================

    const openEditModal = (user) => {
        setModalMode("edit");

        setSelectedUser(user);

        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            password: "",
            password_confirmation: "",
            role:
                user.role ||
                "local_customer",
            status:
                user.status ||
                "active",
        });

        setError("");
        setSuccess("");

        setShowModal(true);
    };

    // =========================================================
    // Close Modal
    // =========================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);

        setSelectedUser(null);

        setFormData({
            ...emptyForm,
        });

        setError("");
        setSuccess("");
    };

    // =========================================================
    // Handle Laravel Error
    // =========================================================

    const handleLaravelError = (data) => {
        // -----------------------------------------------------
        // Validation errors
        // -----------------------------------------------------

        if (data?.errors) {
            const firstField =
                Object.keys(
                    data.errors
                )[0];

            const firstMessage =
                data.errors[
                    firstField
                ]?.[0];

            setError(
                firstMessage ||
                    data?.message ||
                    "حدث خطأ أثناء تنفيذ العملية."
            );

            return;
        }

        // -----------------------------------------------------
        // General Error
        // -----------------------------------------------------

        setError(
            data?.message ||
                "حدث خطأ أثناء تنفيذ العملية."
        );
    };

    // =========================================================
    // Prepare Payload
    // =========================================================

    const preparePayload = () => {
        const payload = {
            name: formData.name.trim(),

            email: formData.email.trim(),

            phone: formData.phone.trim(),

            role: formData.role,

            status: formData.status,
        };

        // -----------------------------------------------------
        // Add Password
        // -----------------------------------------------------

        if (modalMode === "add") {
            payload.password =
                formData.password;

            payload.password_confirmation =
                formData.password_confirmation;
        }

        // -----------------------------------------------------
        // Edit Password
        // -----------------------------------------------------

        if (
            modalMode === "edit" &&
            formData.password
        ) {
            payload.password =
                formData.password;

            payload.password_confirmation =
                formData.password_confirmation;
        }

        return payload;
    };

    // =========================================================
    // Validate Form
    // =========================================================

    const validateForm = () => {
        // -----------------------------------------------------
        // Name
        // -----------------------------------------------------

        if (!formData.name.trim()) {
            setError(
                "يرجى إدخال اسم المستخدم."
            );

            return false;
        }

        // -----------------------------------------------------
        // Email
        // -----------------------------------------------------

        if (!formData.email.trim()) {
            setError(
                "يرجى إدخال البريد الإلكتروني."
            );

            return false;
        }

        // -----------------------------------------------------
        // Phone
        // -----------------------------------------------------

        if (!formData.phone.trim()) {
            setError(
                "يرجى إدخال رقم الجوال."
            );

            return false;
        }

        // -----------------------------------------------------
        // Add Password
        // -----------------------------------------------------

        if (modalMode === "add") {
            if (!formData.password) {
                setError(
                    "يرجى إدخال كلمة المرور."
                );

                return false;
            }

            if (
                formData.password.length < 8
            ) {
                setError(
                    "كلمة المرور يجب أن تكون 8 أحرف على الأقل."
                );

                return false;
            }

            if (
                formData.password !==
                formData.password_confirmation
            ) {
                setError(
                    "كلمتا المرور غير متطابقتين."
                );

                return false;
            }
        }

        // -----------------------------------------------------
        // Edit Password
        // -----------------------------------------------------

        if (
            modalMode === "edit" &&
            formData.password
        ) {
            if (
                formData.password.length < 8
            ) {
                setError(
                    "كلمة المرور يجب أن تكون 8 أحرف على الأقل."
                );

                return false;
            }

            if (
                formData.password !==
                formData.password_confirmation
            ) {
                setError(
                    "كلمتا المرور غير متطابقتين."
                );

                return false;
            }
        }

        // -----------------------------------------------------
        // Role
        // -----------------------------------------------------

        if (!formData.role) {
            setError(
                "يرجى اختيار دور المستخدم."
            );

            return false;
        }

        // -----------------------------------------------------
        // Status
        // -----------------------------------------------------

        if (!formData.status) {
            setError(
                "يرجى اختيار حالة المستخدم."
            );

            return false;
        }

        return true;
    };

    // =========================================================
    // Save User
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------------------
        // Validation
        // -----------------------------------------------------

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const payload =
                preparePayload();

            console.log(
                "User Payload:",
                payload
            );

            // =================================================
            // ADD USER
            // =================================================

            if (modalMode === "add") {
                const response =
                    await fetch(
                        `${API_URL}/users`,
                        {
                            method: "POST",

                            headers:
                                getHeaders(),

                            body: JSON.stringify(
                                payload
                            ),
                        }
                    );

                const data =
                    await readResponse(
                        response
                    );

                console.log(
                    "Create User Response:",
                    data
                );

                // ---------------------------------------------
                // Unauthorized
                // ---------------------------------------------

                if (
                    response.status ===
                    401
                ) {
                    handleUnauthorized();
                    return;
                }

                // ---------------------------------------------
                // Error
                // ---------------------------------------------

                if (!response.ok) {
                    handleLaravelError(
                        data
                    );

                    return;
                }

                setSuccess(
                    data?.message ||
                        "تم إضافة المستخدم بنجاح."
                );
            }

            // =================================================
            // EDIT USER
            // =================================================

            else {
                if (
                    !selectedUser?.id
                ) {
                    setError(
                        "لم يتم تحديد المستخدم."
                    );

                    return;
                }

                const response =
                    await fetch(
                        `${API_URL}/users/${selectedUser.id}`,
                        {
                            method: "PUT",

                            headers:
                                getHeaders(),

                            body: JSON.stringify(
                                payload
                            ),
                        }
                    );

                const data =
                    await readResponse(
                        response
                    );

                console.log(
                    "Update User Response:",
                    data
                );

                // ---------------------------------------------
                // Unauthorized
                // ---------------------------------------------

                if (
                    response.status ===
                    401
                ) {
                    handleUnauthorized();
                    return;
                }

                // ---------------------------------------------
                // Error
                // ---------------------------------------------

                if (!response.ok) {
                    handleLaravelError(
                        data
                    );

                    return;
                }

                setSuccess(
                    data?.message ||
                        "تم تعديل المستخدم بنجاح."
                );
            }

            // -------------------------------------------------
            // Reload Users
            // -------------------------------------------------

            await fetchUsers();

            // -------------------------------------------------
            // Close Modal
            // -------------------------------------------------

            setTimeout(() => {
                setShowModal(false);

                setSelectedUser(null);

                setFormData({
                    ...emptyForm,
                });

                setSuccess("");
            }, 700);
        } catch (err) {
            console.error(
                "Save User Error:",
                err
            );

            setError(
                "تعذر الاتصال بالخادم."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // Toggle Status
    // =========================================================

    const toggleStatus = async (user) => {
        if (!user?.id) {
            return;
        }

        // منع الضغط على أكثر من مستخدم في نفس الوقت
        if (toggling) {
            return;
        }

        setToggling(user.id);

        setError("");
        setSuccess("");

        const newStatus =
            user.status === "active"
                ? "inactive"
                : "active";

        try {
            const response =
                await fetch(
                    `${API_URL}/users/${user.id}`,
                    {
                        method: "PUT",

                        headers:
                            getHeaders(),

                        body: JSON.stringify({
                            status:
                                newStatus,
                        }),
                    }
                );

            const data =
                await readResponse(
                    response
                );

            console.log(
                "Toggle Status Response:",
                data
            );

            // -------------------------------------------------
            // Unauthorized
            // -------------------------------------------------

            if (
                response.status ===
                401
            ) {
                handleUnauthorized();
                return;
            }

            // -------------------------------------------------
            // Error
            // -------------------------------------------------

            if (!response.ok) {
                handleLaravelError(
                    data
                );

                return;
            }

            // -------------------------------------------------
            // Success
            // -------------------------------------------------

            setSuccess(
                newStatus === "active"
                    ? "تم تفعيل المستخدم."
                    : "تم تعطيل المستخدم."
            );

            await fetchUsers();

            setTimeout(() => {
                setSuccess("");
            }, 1500);
        } catch (err) {
            console.error(
                "Toggle Status Error:",
                err
            );

            setError(
                "تعذر الاتصال بالخادم."
            );
        } finally {
            setToggling(null);
        }
    };

    // =========================================================
    // Open Delete Modal
    // =========================================================

    const openDeleteModal = (user) => {
        setUserToDelete(user);

        setError("");
        setSuccess("");

        setShowDeleteModal(true);
    };

    // =========================================================
    // Close Delete Modal
    // =========================================================

    const closeDeleteModal = () => {
        if (deleting) {
            return;
        }

        setShowDeleteModal(false);

        setUserToDelete(null);
    };

    // =========================================================
    // Delete User
    // =========================================================

    const deleteUser = async () => {
        if (!userToDelete?.id) {
            return;
        }

        setDeleting(true);

        setError("");
        setSuccess("");

        try {
            const response =
                await fetch(
                    `${API_URL}/users/${userToDelete.id}`,
                    {
                        method: "DELETE",

                        headers:
                            getHeaders(),
                    }
                );

            const data =
                await readResponse(
                    response
                );

            console.log(
                "Delete User Response:",
                data
            );

            // -------------------------------------------------
            // Unauthorized
            // -------------------------------------------------

            if (
                response.status ===
                401
            ) {
                handleUnauthorized();

                setShowDeleteModal(
                    false
                );

                setUserToDelete(null);

                return;
            }

            // -------------------------------------------------
            // Error
            // -------------------------------------------------

            if (!response.ok) {
                handleLaravelError(
                    data
                );

                return;
            }

            // -------------------------------------------------
            // Success
            // -------------------------------------------------

            setSuccess(
                data?.message ||
                    "تم حذف المستخدم بنجاح."
            );

            setShowDeleteModal(false);

            setUserToDelete(null);

            await fetchUsers();

            setTimeout(() => {
                setSuccess("");
            }, 1500);
        } catch (err) {
            console.error(
                "Delete User Error:",
                err
            );

            setError(
                "تعذر الاتصال بالخادم."
            );
        } finally {
            setDeleting(false);
        }
    };

    // =========================================================
    // Role Name
    // =========================================================

    const getRoleName = (role) => {
        switch (role) {
            case "admin":
                return "أدمن";

            case "manager":
                return "مدير";

            case "manager2":
                return "مدير 2";

            case "employee":
                return "موظف";

            case "local_customer":
                return "عميل محلي";

            case "local-client":
                return "عميل محلي";

            case "international_customer":
                return "عميل دولي";

            case "international-client":
                return "عميل دولي";

            default:
                return (
                    role ||
                    "غير محدد"
                );
        }
    };

    // =========================================================
    // Role Style
    // =========================================================

    const getRoleStyle = (role) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-700";

            case "manager":
            case "manager2":
                return "bg-indigo-100 text-indigo-700";

            case "employee":
                return "bg-blue-100 text-blue-700";

            case "local_customer":
            case "local-client":
                return "bg-green-100 text-green-700";

            case "international_customer":
            case "international-client":
                return "bg-orange-100 text-orange-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // =========================================================
    // Status Style
    // =========================================================

    const getStatusStyle = (status) => {
        return status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
    };

    // =========================================================
    // Render
    // =========================================================

    return (
        <div
            className="space-y-6"
            dir="rtl"
        >
            {/* =================================================
                Header
            ================================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#24572b]">
                        إدارة المستخدمين
                    </h1>

                    <p className="text-sm text-[#71796f] mt-2">
                        إدارة المستخدمين والأدوار وحالات الحسابات
                    </p>
                </div>

                <div className="flex gap-3">
                    {/* Refresh */}

                    <button
                        onClick={fetchUsers}
                        disabled={
                            loading ||
                            saving ||
                            deleting
                        }
                        title="تحديث"
                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#c1c9bd] bg-white text-[#24572b] hover:bg-[#f3f4ed] transition disabled:opacity-60"
                    >
                        <span
                            className={`material-symbols-outlined ${
                                loading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        >
                            refresh
                        </span>
                    </button>

                    {/* Add */}

                    <button
                        onClick={
                            openAddModal
                        }
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-[#F07A26] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#4E7A3C] transition disabled:opacity-60"
                    >
                        <span className="material-symbols-outlined">
                            person_add
                        </span>

                        إضافة مستخدم
                    </button>
                </div>
            </div>

            {/* =================================================
                Error
            ================================================= */}

            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                    {error}
                </div>
            )}

            {/* =================================================
                Success
            ================================================= */}

            {success && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                    {success}
                </div>
            )}

            {/* =================================================
                Statistics
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total */}

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7e2]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#71796f]">
                                إجمالي المستخدمين
                            </p>

                            <h2 className="text-3xl font-bold text-[#24572b] mt-2">
                                {totalUsers}
                            </h2>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#24572b]">
                                group
                            </span>
                        </div>
                    </div>
                </div>

                {/* Active */}

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7e2]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#71796f]">
                                المستخدمون النشطون
                            </p>

                            <h2 className="text-3xl font-bold text-green-600 mt-2">
                                {activeUsers}
                            </h2>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600">
                                check_circle
                            </span>
                        </div>
                    </div>
                </div>

                {/* Inactive */}

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7e2]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[#71796f]">
                                المستخدمون غير النشطين
                            </p>

                            <h2 className="text-3xl font-bold text-red-600 mt-2">
                                {inactiveUsers}
                            </h2>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-600">
                                block
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================================
                Search + Filter
            ================================================= */}

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5e7e2]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}

                    <div className="md:col-span-2 relative">
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#71796f]">
                            search
                        </span>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="ابحث بالاسم أو البريد أو رقم الجوال..."
                            className="w-full h-12 pr-12 pl-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26]"
                        />
                    </div>

                    {/* Role */}

                    <select
                        value={
                            roleFilter
                        }
                        onChange={(e) =>
                            setRoleFilter(
                                e.target.value
                            )
                        }
                        className="h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26]"
                    >
                        <option value="all">
                            جميع الأدوار
                        </option>

                        <option value="admin">
                            أدمن
                        </option>

                        <option value="manager">
                            مدير
                        </option>

                        <option value="manager2">
                            مدير 2
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
            </div>

            {/* =================================================
                Users Table
            ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7e2] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-[#f3f4ed]">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-[#414940]">
                                    المستخدم
                                </th>

                                <th className="px-6 py-4 text-sm font-bold text-[#414940]">
                                    البريد
                                </th>

                                <th className="px-6 py-4 text-sm font-bold text-[#414940]">
                                    الجوال
                                </th>

                                <th className="px-6 py-4 text-sm font-bold text-[#414940]">
                                    الدور
                                </th>

                                <th className="px-6 py-4 text-sm font-bold text-[#414940]">
                                    الحالة
                                </th>

                                <th className="px-6 py-4 text-sm font-bold text-[#414940]">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#e5e7e2]">
                            {/* Loading */}

                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined animate-spin text-4xl text-[#F07A26]">
                                                progress_activity
                                            </span>

                                            <span className="text-[#71796f]">
                                                جاري تحميل المستخدمين...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length ===
                              0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-5xl text-[#c1c9bd]">
                                                group_off
                                            </span>

                                            <span className="text-[#71796f]">
                                                لا توجد نتائج
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(
                                    (user) => (
                                        <tr
                                            key={
                                                user.id
                                            }
                                            className="hover:bg-[#fafaf7] transition"
                                        >
                                            {/* User */}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#e7f0e3] text-[#24572b] flex items-center justify-center font-bold">
                                                        {user.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-[#191c18]">
                                                            {
                                                                user.name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-[#71796f] mt-1">
                                                            ID:{" "}
                                                            {
                                                                user.id
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}

                                            <td className="px-6 py-4 text-sm text-[#414940]">
                                                {
                                                    user.email
                                                }
                                            </td>

                                            {/* Phone */}

                                            <td className="px-6 py-4 text-sm text-[#414940]">
                                                {user.phone ||
                                                    "—"}
                                            </td>

                                            {/* Role */}

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getRoleStyle(
                                                        user.role
                                                    )}`}
                                                >
                                                    {getRoleName(
                                                        user.role
                                                    )}
                                                </span>
                                            </td>

                                            {/* Status */}

                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        toggleStatus(
                                                            user
                                                        )
                                                    }
                                                    disabled={
                                                        toggling ===
                                                        user.id
                                                    }
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                                                        user.status
                                                    )} disabled:opacity-60`}
                                                >
                                                    {toggling ===
                                                    user.id ? (
                                                        <span className="material-symbols-outlined text-sm animate-spin">
                                                            progress_activity
                                                        </span>
                                                    ) : null}

                                                    {user.status ===
                                                    "active"
                                                        ? "نشط"
                                                        : "غير نشط"}
                                                </button>
                                            </td>

                                            {/* Actions */}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {/* View */}

                                                    <button
                                                        title="عرض"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/users/${user.id}`
                                                            )
                                                        }
                                                        className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">
                                                            visibility
                                                        </span>
                                                    </button>

                                                    {/* Edit */}

                                                    <button
                                                        title="تعديل"
                                                        onClick={() =>
                                                            openEditModal(
                                                                user
                                                            )
                                                        }
                                                        disabled={
                                                            saving ||
                                                            deleting
                                                        }
                                                        className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition disabled:opacity-60"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">
                                                            edit
                                                        </span>
                                                    </button>

                                                    {/* Toggle */}

                                                    <button
                                                        title={
                                                            user.status ===
                                                            "active"
                                                                ? "تعطيل"
                                                                : "تفعيل"
                                                        }
                                                        onClick={() =>
                                                            toggleStatus(
                                                                user
                                                            )
                                                        }
                                                        disabled={
                                                            toggling ===
                                                            user.id
                                                        }
                                                        className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition disabled:opacity-60"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">
                                                            {toggling ===
                                                            user.id
                                                                ? "progress_activity"
                                                                : user.status ===
                                                                  "active"
                                                                ? "block"
                                                                : "check_circle"}
                                                        </span>
                                                    </button>

                                                    {/* Delete */}

                                                    <button
                                                        title="حذف"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                user
                                                            )
                                                        }
                                                        disabled={
                                                            deleting ||
                                                            saving
                                                        }
                                                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-60"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">
                                                            delete
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =================================================
                Add / Edit Modal
            ================================================= */}

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#24572b]">
                                    {modalMode ===
                                    "add"
                                        ? "إضافة مستخدم"
                                        : "تعديل المستخدم"}
                                </h2>

                                <p className="text-sm text-[#71796f] mt-1">
                                    أدخل بيانات المستخدم
                                </p>
                            </div>

                            <button
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    saving
                                }
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>

                        {/* Modal Error */}

                        {error && (
                            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Modal Success */}

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
                            className="space-y-5"
                        >
                            {/* Name */}

                            <div>
                                <label className="block mb-2 text-sm font-medium">
                                    الاسم الكامل
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] disabled:opacity-60"
                                    placeholder="مثال: أحمد محمد"
                                />
                            </div>

                            {/* Email */}

                            <div>
                                <label className="block mb-2 text-sm font-medium">
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
                                    disabled={
                                        saving
                                    }
                                    className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] disabled:opacity-60"
                                    placeholder="example@mail.com"
                                />
                            </div>

                            {/* Phone */}

                            <div>
                                <label className="block mb-2 text-sm font-medium">
                                    رقم الجوال
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] disabled:opacity-60"
                                    placeholder="777123456"
                                />
                            </div>

                            {/* Password */}

                            <div>
                                <label className="block mb-2 text-sm font-medium">
                                    {modalMode ===
                                    "add"
                                        ? "كلمة المرور"
                                        : "كلمة المرور الجديدة"}
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] disabled:opacity-60"
                                    placeholder={
                                        modalMode ===
                                        "edit"
                                            ? "اتركها فارغة إذا لم ترد تغييرها"
                                            : "********"
                                    }
                                />
                            </div>

                            {/* Password Confirmation */}

                            <div>
                                <label className="block mb-2 text-sm font-medium">
                                    تأكيد كلمة المرور
                                </label>

                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={
                                        formData.password_confirmation
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] disabled:opacity-60"
                                    placeholder="********"
                                />
                            </div>

                            {/* Role */}

                            <div>
                                <label className="block mb-2 text-sm font-medium">
                                    الدور
                                </label>

                                <select
                                    name="role"
                                    value={
                                        formData.role
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] disabled:opacity-60"
                                >
                                    <option value="admin">
                                        أدمن
                                    </option>

                                    <option value="manager">
                                        مدير
                                    </option>

                                    <option value="manager2">
                                        مدير 2
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

                            {/* Status */}

                            <div>
                                <label className="block mb-2 text-sm font-medium">
                                    حالة الحساب
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="w-full h-12 px-4 rounded-xl border border-[#c1c9bd] bg-[#f3f4ed] outline-none focus:ring-2 focus:ring-[#F07A26] disabled:opacity-60"
                                >
                                    <option value="active">
                                        نشط
                                    </option>

                                    <option value="inactive">
                                        غير نشط
                                    </option>
                                </select>
                            </div>

                            {/* Buttons */}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="flex-1 h-12 bg-[#F07A26] text-white rounded-xl font-bold hover:bg-[#4E7A3C] transition disabled:opacity-60"
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined animate-spin">
                                                progress_activity
                                            </span>

                                            جاري الحفظ...
                                        </span>
                                    ) : modalMode ===
                                      "add" ? (
                                        "إضافة المستخدم"
                                    ) : (
                                        "حفظ التعديلات"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="px-6 h-12 border border-[#c1c9bd] rounded-xl font-bold hover:bg-gray-100 transition disabled:opacity-60"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =================================================
                Delete Confirmation Modal
            ================================================= */}

            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
                        {/* Icon */}

                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-red-600">
                                    delete
                                </span>
                            </div>
                        </div>

                        {/* Title */}

                        <h2 className="text-xl font-bold text-center text-[#24572b]">
                            حذف المستخدم
                        </h2>

                        {/* Message */}

                        <p className="text-center text-[#71796f] mt-3 leading-7">
                            هل أنت متأكد من حذف المستخدم

                            <strong className="text-[#191c18] mx-1">
                                {
                                    userToDelete?.name
                                }
                            </strong>

                            ؟

                            <br />

                            لا يمكن التراجع عن هذه العملية.
                        </p>

                        {/* Buttons */}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={
                                    deleteUser
                                }
                                disabled={
                                    deleting
                                }
                                className="flex-1 h-12 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-60"
                            >
                                {deleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined animate-spin">
                                            progress_activity
                                        </span>

                                        جاري الحذف...
                                    </span>
                                ) : (
                                    "نعم، حذف"
                                )}
                            </button>

                            <button
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    deleting
                                }
                                className="flex-1 h-12 border border-[#c1c9bd] rounded-xl font-bold hover:bg-gray-100 transition disabled:opacity-60"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}