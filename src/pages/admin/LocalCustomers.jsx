import { useState } from "react";

const initialOrders = [
    {
        id: "ORD-10025",
        title: "طاولة خشبية أثرية",
        price: "450 ر.س",
        city: "صنعاء",
        date: "١٥ أغسطس ٢٠٢٦",
        status: "accepted",
        statusText: "تم القبول",
        image:
            "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1000&q=80",
        note:
            "تم قبول طلبك، وسيتم تجهيز القطعة وتسليمها لك في أقرب وقت.",
    },

    {
        id: "ORD-10031",
        title: "كرسي خشبي تراثي",
        price: "280 ر.س",
        city: "تعز",
        date: "١٦ أغسطس ٢٠٢٦",
        status: "pending",
        statusText: "قيد المراجعة",
        image:
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1000&q=80",
        note: "",
    },

    {
        id: "ORD-10018",
        title: "صندوق يمني قديم",
        price: "620 ر.س",
        city: "إب",
        date: "١٢ أغسطس ٢٠٢٦",
        status: "shipping",
        statusText: "قيد الشحن",
        image:
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
        note:
            "تم شحن طلبك، ويمكنك متابعة حالة الشحنة حتى وصولها.",
    },

    {
        id: "ORD-10010",
        title: "مرآة تراثية مزخرفة",
        price: "350 ر.س",
        city: "الحديدة",
        date: "١٠ أغسطس ٢٠٢٦",
        status: "delivered",
        statusText: "تم التسليم",
        image:
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
        note:
            "تم تسليم طلبك بنجاح. نتمنى أن تنال القطعة إعجابك.",
    },
];

export default function LocalCustomer() {
    const [orders, setOrders] = useState(initialOrders);

    const [showNewOrder, setShowNewOrder] = useState(false);

    const [showEditOrder, setShowEditOrder] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [showDetails, setShowDetails] = useState(false);

    // نافذة تأكيد الحذف
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // الطلب الذي سيتم حذفه
    const [orderToDelete, setOrderToDelete] = useState(null);

    const [newOrder, setNewOrder] = useState({
        title: "",
        city: "",
        description: "",
    });

    const [editOrder, setEditOrder] = useState({
        id: "",
        title: "",
        city: "",
        description: "",
    });

    /* =========================
       الإحصائيات
    ========================= */

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "pending"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.status === "delivered"
    ).length;

    /* =========================
       إضافة طلب جديد
    ========================= */

    const handleNewOrderChange = (e) => {
        setNewOrder({
            ...newOrder,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateOrder = (e) => {
        e.preventDefault();

        if (!newOrder.title || !newOrder.city) {
            return;
        }

        const order = {
            id: `ORD-${10000 + orders.length + 1}`,
            title: newOrder.title,
            price: "قيد التقييم",
            city: newOrder.city,
            date: new Date().toLocaleDateString("ar-YE", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }),
            status: "pending",
            statusText: "قيد المراجعة",
            image:
                "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?auto=format&fit=crop&w=1000&q=80",
            note: "",
            description: newOrder.description,
        };

        setOrders([order, ...orders]);

        setNewOrder({
            title: "",
            city: "",
            description: "",
        });

        setShowNewOrder(false);
    };

    /* =========================
       فتح تعديل الطلب
    ========================= */

    const handleOpenEdit = (order) => {
        setSelectedOrder(order);

        setEditOrder({
            id: order.id,
            title: order.title,
            city: order.city,
            description: order.description || "",
        });

        setShowEditOrder(true);
    };

    /* =========================
       تعديل الطلب
    ========================= */

    const handleEditChange = (e) => {
        setEditOrder({
            ...editOrder,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();

        if (!editOrder.title || !editOrder.city) {
            return;
        }

        setOrders(
            orders.map((order) =>
                order.id === editOrder.id
                    ? {
                          ...order,
                          title: editOrder.title,
                          city: editOrder.city,
                          description: editOrder.description,
                      }
                    : order
            )
        );

        setShowEditOrder(false);
        setSelectedOrder(null);
    };

    /* =========================
       فتح نافذة حذف الطلب
    ========================= */

    const handleOpenDelete = (order) => {
        setOrderToDelete(order);
        setShowDeleteConfirm(true);
    };

    /* =========================
       تأكيد حذف الطلب
    ========================= */

    const handleDeleteOrder = () => {
        if (!orderToDelete) {
            return;
        }

        setOrders(
            orders.filter(
                (order) => order.id !== orderToDelete.id
            )
        );

        setOrderToDelete(null);
        setShowDeleteConfirm(false);
    };

    /* =========================
       إلغاء الحذف
    ========================= */

    const handleCancelDelete = () => {
        setOrderToDelete(null);
        setShowDeleteConfirm(false);
    };

    /* =========================
       تفاصيل الطلب
    ========================= */

    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c]"
            style={{
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
            }}
        >
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">

                {/* =========================
                    Header
                ========================= */}

                <div className="mb-8">

                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">

                        <div className="text-right">

                            <div className="flex items-center gap-2 mb-2">

                                <span className="material-symbols-outlined text-[#a04100]">
                                    location_on
                                </span>

                                <span className="text-[#a04100] font-bold text-sm">
                                    الخدمات المحلية
                                </span>

                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-[#3e5219] mb-2">
                                طلباتي المحلية
                            </h1>

                            <p className="text-[#45483c] text-base md:text-lg">
                                تابع مشترياتك المحلية واطلع على حالة
                                طلباتك داخل اليمن.
                            </p>

                        </div>

                        <button
                            onClick={() => setShowNewOrder(true)}
                            className="flex flex-row-reverse items-center gap-2 bg-[#3e5219] text-white px-6 py-3 rounded-full hover:scale-95 transition-transform shadow-sm"
                        >
                            <span className="material-symbols-outlined">
                                add_circle
                            </span>

                            <span>
                                طلب محلي جديد
                            </span>
                        </button>

                    </div>

                </div>

                {/* =========================
                    Stats
                ========================= */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* إجمالي الطلبات */}

                    <div className="bg-[#f6f3f2] p-6 rounded-2xl border border-[#c5c8b8]/30 flex flex-row items-center gap-5">

                        <div className="bg-[#d2eca2]/30 p-3 rounded-xl">

                            <span className="material-symbols-outlined text-[#3e5219] text-3xl">
                                shopping_bag
                            </span>

                        </div>

                        <div className="text-right">

                            <div className="text-[#75796b] text-xs">
                                إجمالي الطلبات
                            </div>

                            <div className="text-2xl font-bold mt-1">
                                {totalOrders}
                            </div>

                        </div>

                    </div>

                    {/* قيد المراجعة */}

                    <div className="bg-[#f6f3f2] p-6 rounded-2xl border border-[#c5c8b8]/30 flex flex-row items-center gap-5">

                        <div className="bg-[#ffdbcc]/30 p-3 rounded-xl">

                            <span className="material-symbols-outlined text-[#a04100] text-3xl">
                                pending_actions
                            </span>

                        </div>

                        <div className="text-right">

                            <div className="text-[#75796b] text-xs">
                                قيد المراجعة
                            </div>

                            <div className="text-2xl font-bold mt-1">
                                {pendingOrders}
                            </div>

                        </div>

                    </div>

                    {/* تم التسليم */}

                    <div className="bg-[#f6f3f2] p-6 rounded-2xl border border-[#c5c8b8]/30 flex flex-row items-center gap-5">

                        <div className="bg-[#85537e]/20 p-3 rounded-xl">

                            <span className="material-symbols-outlined text-[#6b3b65] text-3xl">
                                check_circle
                            </span>

                        </div>

                        <div className="text-right">

                            <div className="text-[#75796b] text-xs">
                                تم التسليم
                            </div>

                            <div className="text-2xl font-bold mt-1">
                                {deliveredOrders}
                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================
                    Orders
                ========================= */}

                <div className="space-y-6">

                    {orders.length === 0 && (

                        <div className="bg-white rounded-3xl border border-[#c5c8b8]/30 p-12 text-center">

                            <span className="material-symbols-outlined text-[#75796b] text-5xl">
                                shopping_bag
                            </span>

                            <h3 className="text-xl font-bold text-[#3e5219] mt-4">
                                لا توجد طلبات
                            </h3>

                            <p className="text-[#75796b] mt-2">
                                يمكنك إنشاء طلب محلي جديد من الزر أعلاه.
                            </p>

                        </div>

                    )}

                    {orders.map((order) => (

                        <div
                            key={order.id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#c5c8b8]/20 hover:-translate-y-1"
                        >

                            <div className="flex flex-col md:flex-row">

                                {/* Image */}

                                <div className="w-full md:w-1/3 h-64 md:h-auto overflow-hidden relative">

                                    {order.status === "pending" && (
                                        <div className="absolute inset-0 bg-black/10 z-10" />
                                    )}

                                    <img
                                        src={order.image}
                                        alt={order.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />

                                    <div
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg z-20 ${
                                            order.status === "accepted"
                                                ? "bg-[#3e5219]"
                                                : order.status === "pending"
                                                ? "bg-[#75796b]"
                                                : order.status === "shipping"
                                                ? "bg-[#a04100]"
                                                : "bg-[#6b3b65]"
                                        }`}
                                    >
                                        {order.statusText}
                                    </div>

                                </div>

                                {/* Content */}

                                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col">

                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">

                                        <div className="text-right">

                                            <div className="text-[#75796b] text-xs mb-2 uppercase tracking-widest">
                                                رقم الطلب: {order.id}
                                            </div>

                                            <h3 className="text-xl md:text-2xl font-semibold text-[#3e5219]">
                                                {order.title}
                                            </h3>

                                        </div>

                                        <div className="text-left font-bold text-[#a04100] text-lg">
                                            {order.price}
                                        </div>

                                    </div>

                                    {/* Details */}

                                    <div className="grid grid-cols-2 gap-6 mb-6">

                                        <div className="text-right">

                                            <div className="text-[#75796b] text-xs mb-1">
                                                الموقع
                                            </div>

                                            <div className="text-[#1b1c1c] font-medium flex items-center gap-1">

                                                <span>
                                                    {order.city}
                                                </span>

                                                <span className="material-symbols-outlined text-sm">
                                                    location_on
                                                </span>

                                            </div>

                                        </div>

                                        <div className="text-right">

                                            <div className="text-[#75796b] text-xs mb-1">
                                                تاريخ الطلب
                                            </div>

                                            <div className="text-[#1b1c1c] font-medium">
                                                {order.date}
                                            </div>

                                        </div>

                                    </div>

                                    {/* Accepted */}

                                    {order.status === "accepted" && (

                                        <div className="bg-[#556b2f]/10 p-5 rounded-2xl border-r-4 border-[#3e5219] mt-auto">

                                            <div className="flex flex-row-reverse items-center gap-2 mb-1">

                                                <span className="material-symbols-outlined text-[#3e5219] text-sm">
                                                    info
                                                </span>

                                                <span className="font-bold text-[#3e5219] text-sm">
                                                    ملاحظة الإدارة
                                                </span>

                                            </div>

                                            <p className="text-[#45483c] leading-relaxed">
                                                {order.note}
                                            </p>

                                        </div>

                                    )}

                                    {/* Pending */}

                                    {order.status === "pending" && (

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-auto">

                                            {/* تعديل */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenEdit(order)
                                                }
                                                className="py-3 px-4 border border-[#75796b] text-[#1b1c1c] rounded-xl font-medium hover:bg-[#e4e2e1] transition-colors flex items-center justify-center gap-2"
                                            >

                                                <span className="material-symbols-outlined text-base">
                                                    edit
                                                </span>

                                                تعديل الطلب

                                            </button>

                                            {/* حذف */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenDelete(order)
                                                }
                                                className="py-3 px-4 border border-red-300 text-red-700 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                            >

                                                <span className="material-symbols-outlined text-base">
                                                    delete
                                                </span>

                                                حذف الطلب

                                            </button>

                                            {/* حالة المراجعة */}

                                            <button
                                                type="button"
                                                disabled
                                                className="py-3 px-4 bg-[#eae7e7] text-[#75796b] rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2"
                                            >

                                                <span className="material-symbols-outlined text-base">
                                                    schedule
                                                </span>

                                                في انتظار المراجعة

                                            </button>

                                        </div>

                                    )}

                                    {/* Shipping */}

                                    {order.status === "shipping" && (

                                        <div className="flex flex-row-reverse gap-3 mt-auto">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleShowDetails(order)
                                                }
                                                className="flex-1 py-3 px-4 border border-[#75796b] text-[#1b1c1c] rounded-xl font-medium hover:bg-[#e4e2e1] transition-colors flex items-center justify-center gap-2"
                                            >

                                                <span className="material-symbols-outlined">
                                                    visibility
                                                </span>

                                                تفاصيل الطلب

                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleShowDetails(order)
                                                }
                                                className="flex-1 py-3 px-4 bg-[#a04100] text-white rounded-xl font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                                            >

                                                <span className="material-symbols-outlined">
                                                    local_shipping
                                                </span>

                                                تتبع الطلب

                                            </button>

                                        </div>

                                    )}

                                    {/* Delivered */}

                                    {order.status === "delivered" && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleShowDetails(order)
                                            }
                                            className="w-full mt-auto py-3 px-4 bg-[#3e5219] text-white rounded-xl font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                                        >

                                            <span className="material-symbols-outlined">
                                                visibility
                                            </span>

                                            تفاصيل الطلب

                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                {/* =========================
                    Guidance
                ========================= */}

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    <div className="relative rounded-3xl overflow-hidden aspect-video shadow-xl">

                        <img
                            className="w-full h-full object-cover"
                            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
                            alt="الخدمات المحلية"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#3e5219]/70 to-transparent flex items-end p-6">

                            <p className="text-white text-base font-medium">
                                نساعدك في الحصول على القطع التي
                                تبحث عنها داخل السوق المحلي بسهولة
                                وأمان.
                            </p>

                        </div>

                    </div>

                    <div className="text-right">

                        <span className="text-[#a04100] font-bold text-sm block mb-2">
                            دليلك للشراء المحلي
                        </span>

                        <h2 className="text-2xl md:text-3xl text-[#3e5219] font-bold mb-6">
                            كيف نخدمك محلياً؟
                        </h2>

                        <ul className="space-y-4">

                            <li className="flex flex-row-reverse items-start gap-3">

                                <span
                                    className="material-symbols-outlined text-[#3e5219]"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    verified
                                </span>

                                <p className="text-[#45483c]">
                                    البحث عن القطع والمنتجات
                                    المطلوبة داخل السوق المحلي.
                                </p>

                            </li>

                            <li className="flex flex-row-reverse items-start gap-3">

                                <span
                                    className="material-symbols-outlined text-[#3e5219]"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    verified
                                </span>

                                <p className="text-[#45483c]">
                                    التأكد من جودة القطعة ومطابقتها
                                    لمواصفات الطلب.
                                </p>

                            </li>

                            <li className="flex flex-row-reverse items-start gap-3">

                                <span
                                    className="material-symbols-outlined text-[#3e5219]"
                                    style={{
                                        fontVariationSettings:
                                            "'FILL' 1",
                                    }}
                                >
                                    verified
                                </span>

                                <p className="text-[#45483c]">
                                    توصيل طلبك إلى الموقع المحدد
                                    ومتابعة الطلب حتى التسليم.
                                </p>

                            </li>

                        </ul>

                    </div>

                </div>

            </div>

            {/* =========================
                New Local Order Modal
            ========================= */}

            {showNewOrder && (

                <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">

                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-xl font-bold text-[#3e5219]">
                                طلب محلي جديد
                            </h2>

                            <button
                                onClick={() =>
                                    setShowNewOrder(false)
                                }
                                className="p-2 rounded-full hover:bg-[#e4e2e1]"
                            >

                                <span className="material-symbols-outlined">
                                    close
                                </span>

                            </button>

                        </div>

                        <form
                            onSubmit={handleCreateOrder}
                            className="space-y-4"
                        >

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    اسم القطعة
                                </label>

                                <input
                                    name="title"
                                    value={newOrder.title}
                                    onChange={handleNewOrderChange}
                                    type="text"
                                    placeholder="مثال: طاولة خشبية"
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219]"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    المدينة / المحافظة
                                </label>

                                <input
                                    name="city"
                                    value={newOrder.city}
                                    onChange={handleNewOrderChange}
                                    type="text"
                                    placeholder="مثال: صنعاء"
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219]"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    وصف الطلب
                                </label>

                                <textarea
                                    name="description"
                                    value={newOrder.description}
                                    onChange={handleNewOrderChange}
                                    rows="4"
                                    placeholder="اكتب تفاصيل القطعة المطلوبة..."
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219]"
                                />

                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#3e5219] text-white py-3 rounded-xl font-bold hover:opacity-90"
                            >
                                إرسال الطلب
                            </button>

                        </form>

                    </div>

                </div>

            )}

            {/* =========================
                Edit Modal
            ========================= */}

            {showEditOrder && (

                <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">

                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">

                        <div className="flex justify-between items-center mb-6">

                            <div>

                                <h2 className="text-xl font-bold text-[#3e5219]">
                                    تعديل الطلب
                                </h2>

                                <p className="text-xs text-[#75796b] mt-1">
                                    رقم الطلب: {editOrder.id}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowEditOrder(false)
                                }
                                className="p-2 rounded-full hover:bg-[#e4e2e1]"
                            >

                                <span className="material-symbols-outlined">
                                    close
                                </span>

                            </button>

                        </div>

                        <form
                            onSubmit={handleSaveEdit}
                            className="space-y-4"
                        >

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    اسم القطعة
                                </label>

                                <input
                                    name="title"
                                    value={editOrder.title}
                                    onChange={handleEditChange}
                                    type="text"
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219]"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    المدينة / المحافظة
                                </label>

                                <input
                                    name="city"
                                    value={editOrder.city}
                                    onChange={handleEditChange}
                                    type="text"
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219]"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-bold mb-2">
                                    وصف الطلب
                                </label>

                                <textarea
                                    name="description"
                                    value={editOrder.description}
                                    onChange={handleEditChange}
                                    rows="4"
                                    placeholder="تفاصيل الطلب..."
                                    className="w-full border border-[#c5c8b8] rounded-xl px-4 py-3 outline-none focus:border-[#3e5219]"
                                />

                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#3e5219] text-white py-3 rounded-xl font-bold hover:opacity-90"
                            >
                                حفظ التعديلات
                            </button>

                        </form>

                    </div>

                </div>

            )}

            {/* =========================
                Delete Confirmation Modal
            ========================= */}

            {showDeleteConfirm && orderToDelete && (

                <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">

                        <div className="text-center">

                            {/* Icon */}

                            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">

                                <span className="material-symbols-outlined text-red-600 text-3xl">
                                    delete_forever
                                </span>

                            </div>

                            {/* Title */}

                            <h2 className="text-xl font-bold text-[#1b1c1c] mb-3">
                                حذف الطلب
                            </h2>

                            {/* Description */}

                            <p className="text-[#75796b] leading-relaxed mb-2">
                                هل أنت متأكد من حذف هذا الطلب؟
                            </p>

                            <p className="font-bold text-[#3e5219] mb-2">
                                {orderToDelete.title}
                            </p>

                            <p className="text-xs text-[#75796b] mb-6">
                                رقم الطلب: {orderToDelete.id}
                            </p>

                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6">

                                <p className="text-sm text-red-700">
                                    لا يمكن التراجع عن هذا الإجراء بعد حذف الطلب.
                                </p>

                            </div>

                            {/* Buttons */}

                            <div className="flex flex-row-reverse gap-3">

                                <button
                                    type="button"
                                    onClick={handleDeleteOrder}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >

                                    <span className="material-symbols-outlined text-base">
                                        delete
                                    </span>

                                    نعم، حذف الطلب

                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancelDelete}
                                    className="flex-1 border border-[#c5c8b8] text-[#1b1c1c] py-3 rounded-xl font-bold hover:bg-[#f6f3f2] transition-colors"
                                >
                                    إلغاء
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

            {/* =========================
                Details Modal
            ========================= */}

            {showDetails && selectedOrder && (

                <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">

                    <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">

                        <div className="flex justify-between items-center mb-6">

                            <div>

                                <h2 className="text-xl font-bold text-[#3e5219]">
                                    تفاصيل الطلب
                                </h2>

                                <p className="text-xs text-[#75796b] mt-1">
                                    {selectedOrder.id}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowDetails(false)
                                }
                                className="p-2 rounded-full hover:bg-[#e4e2e1]"
                            >

                                <span className="material-symbols-outlined">
                                    close
                                </span>

                            </button>

                        </div>

                        <div className="space-y-4">

                            <div className="bg-[#f6f3f2] rounded-2xl p-4">

                                <div className="text-xs text-[#75796b] mb-1">
                                    المنتج
                                </div>

                                <div className="font-bold text-[#3e5219]">
                                    {selectedOrder.title}
                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div className="bg-[#f6f3f2] rounded-2xl p-4">

                                    <div className="text-xs text-[#75796b] mb-1">
                                        الموقع
                                    </div>

                                    <div className="font-bold">
                                        {selectedOrder.city}
                                    </div>

                                </div>

                                <div className="bg-[#f6f3f2] rounded-2xl p-4">

                                    <div className="text-xs text-[#75796b] mb-1">
                                        الحالة
                                    </div>

                                    <div className="font-bold text-[#3e5219]">
                                        {selectedOrder.statusText}
                                    </div>

                                </div>

                            </div>

                            <div className="bg-[#556b2f]/10 p-5 rounded-2xl border-r-4 border-[#3e5219]">

                                <div className="font-bold text-[#3e5219] mb-2">
                                    ملاحظة
                                </div>

                                <p className="text-[#45483c] leading-relaxed">
                                    {selectedOrder.note ||
                                        "لا توجد ملاحظات حالياً."}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowDetails(false)
                                }
                                className="w-full bg-[#3e5219] text-white py-3 rounded-xl font-bold"
                            >
                                إغلاق
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}