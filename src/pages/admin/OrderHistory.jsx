import { useState } from "react";

const ordersData = [
    {
        id: "12345",
        customer: "أحمد علي",
        phone: "777123456",
        date: "٢٠ مايو ٢٠٢٤",
        status: "delivered",
        statusText: "تم التوصيل",
        product: "مبخرة عربية عتيقة",
        type: "محلي",
        city: "صنعاء",
        price: "450 ر.س",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBZy9D7GUO04YoX6tqZ5Y9Sygoa_vHGJuHDyVVL5B3U1rMADZeuWnTWJGwHcmD1HEQpdtK6DtSQqG5fPJCK_Ut32G-9wTtiI1UD6vBkwIrz59A3f6OMIcE1su9YXUO5QKhFxA87Twf79-zFJQC-wuEU0wl949M0PDN06HTk-EHGCFLN-FeYXM77tubzM2Kn4MQZ-aAkb6lzuXfrok3SrCMdj28iDWSH1TWyjVTT8qdpOMTB6E7CUKXj",
    },

    {
        id: "12346",
        customer: "محمد أحمد",
        phone: "777456789",
        date: "٢٢ مايو ٢٠٢٤",
        status: "processing",
        statusText: "قيد المعالجة",
        product: "أقلام خط عربي حريرية",
        type: "دولي",
        city: "تعز",
        price: "280 ر.س",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBVRiqUCHJo8vP_BzM0qB95jLShLL7FQD-KBiI6vRFePKycmh1CzmZsEHpazuDxbwA-Sv-N0t_jrCGwnvWzub_y59j-egy34VAuNLOvJYPi0yD54YDeXv0sIFhzWQcyp5Ms7RBgr8WgJ4PSD6-Fz7jeW__ToYLcZZP4MZo6RyDrOpFbkv_dz2FplY7TafodSZue2PxmlI9MxInfSag3n8vJdMDJHIkbuVlQRaL7jPmFNYpT1K2tULlW",
    },

    {
        id: "12347",
        customer: "خالد صالح",
        phone: "777987654",
        date: "٢٥ مايو ٢٠٢٤",
        status: "delivered",
        statusText: "تم التوصيل",
        product: "مزهرية عتيقة - طراز يدوي",
        type: "محلي",
        city: "إب",
        price: "620 ر.س",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDfweb0nSPxV2FhGB3u3rAmP3SgC7GbfvHrgVwX-rLPUGpw4WZ1tiLupSmt6NydlPvXEq2Bi9w_9GdJC9xUbZjfdfhHMHsriZRhhTxL8QbMoI9ONopUlJ2CZFeOJWrjAfxa9xP9z8eNlX97x7LYo8xsDI4I9finLKQvi2DuVBKNliDjpC0Zkjrt_JNQO-XJMjFH24mPF1PvQb8ZMbob6d6zosOTCd8nanYTlkhCnqom2WeHD3u2Ca_i",
    },

    {
        id: "12348",
        customer: "سعيد محمد",
        phone: "777111222",
        date: "٢٧ مايو ٢٠٢٤",
        status: "pending",
        statusText: "قيد المراجعة",
        product: "صندوق يمني تراثي",
        type: "محلي",
        city: "الحديدة",
        price: "350 ر.س",
        image:
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
    },
];

function Orders() {
    const [orders] = useState(ordersData);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [typeFilter, setTypeFilter] = useState("all");

    const [selectedOrder, setSelectedOrder] = useState(null);

    const filteredOrders = orders.filter((order) => {
        const searchText = `
            ${order.id}
            ${order.customer}
            ${order.product}
            ${order.type}
            ${order.city}
        `.toLowerCase();

        const matchesSearch = searchText.includes(
            search.toLowerCase()
        );

        const matchesStatus =
            statusFilter === "all" ||
            order.status === statusFilter;

        const matchesType =
            typeFilter === "all" ||
            order.type === typeFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesType
        );
    });

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "pending"
    ).length;

    const processingOrders = orders.filter(
        (order) => order.status === "processing"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "delivered"
    ).length;

    const localOrders = orders.filter(
        (order) => order.type === "محلي"
    ).length;

    const internationalOrders = orders.filter(
        (order) => order.type === "دولي"
    ).length;

    const getStatusClass = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-700";

            case "processing":
                return "bg-purple-100 text-purple-700";

            case "pending":
                return "bg-orange-100 text-orange-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "delivered":
                return "check_circle";

            case "processing":
                return "autorenew";

            case "pending":
                return "pending_actions";

            default:
                return "info";
        }
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c]"
            style={{
                fontFamily:
                    "'IBM Plex Sans Arabic', sans-serif",
            }}
        >

            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div className="mb-8">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                    <div>

                        <div className="flex items-center gap-2 mb-2">

                            <span className="material-symbols-outlined text-[#a04100]">
                                receipt_long
                            </span>

                            <span className="text-[#a04100] text-sm font-bold">
                                إدارة الطلبات
                            </span>

                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-[#3e5219]">
                            سجل الطلبات
                        </h1>

                        <p className="text-[#45483c] mt-2">
                            متابعة وإدارة جميع طلبات العملاء
                            المحلية والدولية.
                        </p>

                    </div>

                </div>

            </div>

            {/* =====================================
                STATISTICS
            ====================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                {/* Total */}

                <div className="bg-white rounded-2xl border border-[#c5c8b8]/40 p-5">

                    <div className="flex flex-row-reverse justify-between items-center">

                        <div className="text-right">

                            <p className="text-sm text-[#75796b]">
                                إجمالي الطلبات
                            </p>

                            <h2 className="text-3xl font-bold text-[#3e5219] mt-2">
                                {totalOrders}
                            </h2>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-[#d2eca2]/40 flex items-center justify-center">

                            <span className="material-symbols-outlined text-[#3e5219] text-2xl">
                                shopping_bag
                            </span>

                        </div>

                    </div>

                </div>

                {/* Pending */}

                <div className="bg-white rounded-2xl border border-[#c5c8b8]/40 p-5">

                    <div className="flex flex-row-reverse justify-between items-center">

                        <div className="text-right">

                            <p className="text-sm text-[#75796b]">
                                قيد المراجعة
                            </p>

                            <h2 className="text-3xl font-bold text-orange-700 mt-2">
                                {pendingOrders}
                            </h2>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">

                            <span className="material-symbols-outlined text-orange-700 text-2xl">
                                pending_actions
                            </span>

                        </div>

                    </div>

                </div>

                {/* Processing */}

                <div className="bg-white rounded-2xl border border-[#c5c8b8]/40 p-5">

                    <div className="flex flex-row-reverse justify-between items-center">

                        <div className="text-right">

                            <p className="text-sm text-[#75796b]">
                                قيد المعالجة
                            </p>

                            <h2 className="text-3xl font-bold text-purple-700 mt-2">
                                {processingOrders}
                            </h2>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">

                            <span className="material-symbols-outlined text-purple-700 text-2xl">
                                sync
                            </span>

                        </div>

                    </div>

                </div>

                {/* Delivered */}

                <div className="bg-white rounded-2xl border border-[#c5c8b8]/40 p-5">

                    <div className="flex flex-row-reverse justify-between items-center">

                        <div className="text-right">

                            <p className="text-sm text-[#75796b]">
                                تم التوصيل
                            </p>

                            <h2 className="text-3xl font-bold text-green-700 mt-2">
                                {deliveredOrders}
                            </h2>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">

                            <span className="material-symbols-outlined text-green-700 text-2xl">
                                check_circle
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* =====================================
                LOCAL / INTERNATIONAL SUMMARY
            ====================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                <div className="bg-[#3e5219] text-white rounded-2xl p-6">

                    <div className="flex flex-row-reverse justify-between items-center">

                        <div className="text-right">

                            <p className="text-sm opacity-80">
                                الطلبات المحلية
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {localOrders}
                            </h2>

                        </div>

                        <span className="material-symbols-outlined text-4xl">
                            location_on
                        </span>

                    </div>

                </div>

                <div className="bg-[#a04100] text-white rounded-2xl p-6">

                    <div className="flex flex-row-reverse justify-between items-center">

                        <div className="text-right">

                            <p className="text-sm opacity-80">
                                الطلبات الدولية
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {internationalOrders}
                            </h2>

                        </div>

                        <span className="material-symbols-outlined text-4xl">
                            public
                        </span>

                    </div>

                </div>

            </div>

            {/* =====================================
                SEARCH + FILTERS
            ====================================== */}

            <div className="bg-white rounded-2xl border border-[#c5c8b8]/40 p-5 mb-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Search */}

                    <div className="md:col-span-1">

                        <label className="block text-sm font-bold text-[#3e5219] mb-2">
                            البحث
                        </label>

                        <div className="flex items-center bg-[#f6f3f2] border border-[#c5c8b8] rounded-xl px-4">

                            <span className="material-symbols-outlined text-[#75796b]">
                                search
                            </span>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="رقم الطلب، العميل، المنتج..."
                                className="w-full bg-transparent border-none outline-none px-3 py-3 text-right"
                            />

                        </div>

                    </div>

                    {/* Status */}

                    <div>

                        <label className="block text-sm font-bold text-[#3e5219] mb-2">
                            حالة الطلب
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 bg-white outline-none"
                        >

                            <option value="all">
                                جميع الحالات
                            </option>

                            <option value="pending">
                                قيد المراجعة
                            </option>

                            <option value="processing">
                                قيد المعالجة
                            </option>

                            <option value="delivered">
                                تم التوصيل
                            </option>

                        </select>

                    </div>

                    {/* Type */}

                    <div>

                        <label className="block text-sm font-bold text-[#3e5219] mb-2">
                            نوع الطلب
                        </label>

                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                            className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 bg-white outline-none"
                        >

                            <option value="all">
                                جميع الطلبات
                            </option>

                            <option value="محلي">
                                محلي
                            </option>

                            <option value="دولي">
                                دولي
                            </option>

                        </select>

                    </div>

                </div>

            </div>

            {/* =====================================
                ORDERS
            ====================================== */}

            <div className="space-y-5">

                {filteredOrders.length === 0 ? (

                    <div className="bg-white rounded-2xl border border-[#c5c8b8] p-12 text-center">

                        <span className="material-symbols-outlined text-6xl text-[#75796b]">
                            search_off
                        </span>

                        <h3 className="text-xl font-bold text-[#3e5219] mt-4">
                            لا توجد طلبات
                        </h3>

                        <p className="text-[#75796b] mt-2">
                            لم يتم العثور على طلبات مطابقة للبحث.
                        </p>

                    </div>

                ) : (

                    filteredOrders.map((order) => (

                        <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-[#c5c8b8]/40 shadow-sm p-5 md:p-6"
                        >

                            <div className="flex flex-col lg:flex-row-reverse justify-between gap-6">

                                {/* =================================
                                    PRODUCT
                                ================================== */}

                                <div className="flex flex-row-reverse items-center gap-5">

                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f6f3f2] flex-shrink-0">

                                        <img
                                            src={order.image}
                                            alt={order.product}
                                            className="w-full h-full object-cover"
                                        />

                                    </div>

                                    <div className="text-right">

                                        <div className="text-xs text-[#75796b] mb-1">
                                            رقم الطلب
                                        </div>

                                        <h3 className="text-xl font-bold text-[#3e5219]">
                                            #{order.id}
                                        </h3>

                                        <p className="font-semibold text-[#1b1c1c] mt-1">
                                            {order.product}
                                        </p>

                                        <div className="flex flex-row-reverse items-center gap-2 mt-2">

                                            <span className="text-xs bg-[#f0eded] px-2 py-1 rounded-full">
                                                {order.type}
                                            </span>

                                            <span className="text-xs text-[#75796b]">
                                                {order.date}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* =================================
                                    CUSTOMER
                                ================================== */}

                                <div className="text-right">

                                    <p className="text-xs text-[#75796b] mb-2">
                                        العميل
                                    </p>

                                    <p className="font-bold text-[#3e5219]">
                                        {order.customer}
                                    </p>

                                    <p className="text-sm text-[#45483c] mt-1">
                                        {order.phone}
                                    </p>

                                    <p className="text-sm text-[#45483c] mt-1 flex items-center gap-1">

                                        <span className="material-symbols-outlined text-sm">
                                            location_on
                                        </span>

                                        {order.city}

                                    </p>

                                </div>

                                {/* =================================
                                    PRICE
                                ================================== */}

                                <div className="text-right">

                                    <p className="text-xs text-[#75796b] mb-2">
                                        قيمة الطلب
                                    </p>

                                    <p className="text-xl font-bold text-[#a04100]">
                                        {order.price}
                                    </p>

                                </div>

                                {/* =================================
                                    STATUS + ACTION
                                ================================== */}

                                <div className="flex flex-col items-stretch lg:items-end gap-3">

                                    <span
                                        className={`px-5 py-2 rounded-full text-sm flex items-center justify-center gap-2 ${getStatusClass(
                                            order.status
                                        )}`}
                                    >

                                        <span className="material-symbols-outlined text-sm">
                                            {getStatusIcon(
                                                order.status
                                            )}
                                        </span>

                                        {order.statusText}

                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedOrder(order)
                                        }
                                        className="px-6 py-2 border border-[#3e5219] text-[#3e5219] rounded-xl hover:bg-[#3e5219]/5 transition"
                                    >
                                        تفاصيل الطلب
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

            {/* =====================================
                DETAILS MODAL
            ====================================== */}

            {selectedOrder && (

                <div
                    className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedOrder(null);
                        }
                    }}
                >

                    <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl">

                        {/* Header */}

                        <div className="flex flex-row-reverse justify-between items-start mb-6">

                            <div className="text-right">

                                <p className="text-xs text-[#75796b]">
                                    رقم الطلب
                                </p>

                                <h2 className="text-2xl font-bold text-[#3e5219]">
                                    #{selectedOrder.id}
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedOrder(null)
                                }
                                className="p-2 rounded-full hover:bg-[#f0eded]"
                            >

                                <span className="material-symbols-outlined">
                                    close
                                </span>

                            </button>

                        </div>

                        {/* Product */}

                        <div className="flex flex-row-reverse items-center gap-4 bg-[#f6f3f2] rounded-2xl p-4 mb-5">

                            <img
                                src={selectedOrder.image}
                                alt={selectedOrder.product}
                                className="w-20 h-20 rounded-xl object-cover"
                            />

                            <div className="text-right">

                                <h3 className="font-bold text-lg text-[#3e5219]">
                                    {selectedOrder.product}
                                </h3>

                                <p className="text-sm text-[#75796b]">
                                    {selectedOrder.type}
                                </p>

                            </div>

                        </div>

                        {/* Details */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="bg-[#f6f3f2] rounded-xl p-4 text-right">

                                <p className="text-xs text-[#75796b]">
                                    العميل
                                </p>

                                <p className="font-bold mt-1">
                                    {selectedOrder.customer}
                                </p>

                            </div>

                            <div className="bg-[#f6f3f2] rounded-xl p-4 text-right">

                                <p className="text-xs text-[#75796b]">
                                    رقم الهاتف
                                </p>

                                <p className="font-bold mt-1">
                                    {selectedOrder.phone}
                                </p>

                            </div>

                            <div className="bg-[#f6f3f2] rounded-xl p-4 text-right">

                                <p className="text-xs text-[#75796b]">
                                    الموقع
                                </p>

                                <p className="font-bold mt-1">
                                    {selectedOrder.city}
                                </p>

                            </div>

                            <div className="bg-[#f6f3f2] rounded-xl p-4 text-right">

                                <p className="text-xs text-[#75796b]">
                                    التاريخ
                                </p>

                                <p className="font-bold mt-1">
                                    {selectedOrder.date}
                                </p>

                            </div>

                            <div className="bg-[#f6f3f2] rounded-xl p-4 text-right">

                                <p className="text-xs text-[#75796b]">
                                    الحالة
                                </p>

                                <p className="font-bold text-[#3e5219] mt-1">
                                    {selectedOrder.statusText}
                                </p>

                            </div>

                            <div className="bg-[#f6f3f2] rounded-xl p-4 text-right">

                                <p className="text-xs text-[#75796b]">
                                    قيمة الطلب
                                </p>

                                <p className="font-bold text-[#a04100] mt-1">
                                    {selectedOrder.price}
                                </p>

                            </div>

                        </div>

                        {/* Close */}

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedOrder(null)
                            }
                            className="w-full mt-6 bg-[#3e5219] text-white py-3 rounded-xl font-bold"
                        >
                            إغلاق
                        </button>

                    </div>

                </div>

            )}

            {/* MATERIAL ICONS */}

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />

            <link
                href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />

        </div>
    );
}

export default Orders;