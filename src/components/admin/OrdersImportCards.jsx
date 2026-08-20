import React, { useState } from 'react';
import { orderService } from '../../services/orderService';

// دالة مساعدة لمعالجة واستخراج اسم المنتج
const getProductName = (productData) => {
    if (!productData) return 'منتج استيراد';

    const nameValue = typeof productData === 'object'
        ? (productData.name || productData.title || productData)
        : productData;

    if (!nameValue) return 'منتج استيراد';

    if (typeof nameValue === 'object' && nameValue !== null) {
        return nameValue.ar || nameValue.en || Object.values(nameValue)[0] || 'منتج استيراد';
    }

    if (typeof nameValue === 'string') {
        try {
            const parsed = JSON.parse(nameValue);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed.ar || parsed.en || Object.values(parsed)[0] || nameValue;
            }
        } catch (e) {
            return nameValue;
        }
    }

    return String(nameValue);
};

// دالة مساعدة لمعالجة وتنسيق العنوان
const formatLocation = (order) => {
    if (order.address && typeof order.address === 'object') {
        const { city, region, street, country } = order.address;
        const parts = [country, city, region, street].filter(Boolean);
        if (parts.length > 0) return parts.join(' - ');
    }

    const directLocation = order.shipping_address || order.location || order.address;

    if (typeof directLocation === 'string') {
        try {
            const parsed = JSON.parse(directLocation);
            if (typeof parsed === 'object' && parsed !== null) {
                return [parsed.country, parsed.city, parsed.region, parsed.street].filter(Boolean).join(' - ') || directLocation;
            }
        } catch (e) {
            return directLocation;
        }
    }

    if (typeof directLocation === 'object' && directLocation !== null) {
        return [directLocation.country, directLocation.city, directLocation.region, directLocation.street].filter(Boolean).join(' - ');
    }

    if (order.customer?.country) return order.customer.country;

    return 'غير محدد';
};

export default function OrdersImportCards({ orders = [], loading, onRefresh, onShowToast, showToast }) {

    // حالة التحكم بنافذة الرفض المنبثقة
    const [rejectModalState, setRejectModalState] = useState({
        isOpen: false,
        orderId: null,
        reason: '',
        isSubmitting: false
    });

    // دالة آمنة لإظهار التنبيه أياً كان اسم الـ prop الممرر
    const triggerToast = (msg, type = 'success') => {
        if (typeof onShowToast === 'function') {
            onShowToast(msg, type);
        } else if (typeof showToast === 'function') {
            showToast(msg, type);
        }
    };

    // التعامل مع تغيير خيار القائمة المنسدلة
    const handleSelectChange = (orderId, newStatus) => {
        if (newStatus === 'rejected') {
            // فتح نافذة إدخال سبب الرفض بدلاً من الحفظ المباشر
            setRejectModalState({
                isOpen: true,
                orderId: orderId,
                reason: '',
                isSubmitting: false
            });
        } else {
            // تنفيذ قبول الطلب أو إرجاعه كالمعتاد
            handleStatusChange(orderId, newStatus);
        }
    };

    // التعامل مع تحديث حالة الطلب إما قبول أو تعليق
    const handleStatusChange = async (orderId, newStatus, rejectionReason = null) => {
        try {
            // نمرر سبب الرفض كبارامتر إضافي للخدمة
            await orderService.updateOrderStatus(orderId, newStatus, rejectionReason);

            const statusLabels = {
                accepted: 'تم قبول طلب الاستيراد',
                rejected: 'تم رفض طلب الاستيراد وإرسال البريد للعميل',
                pending: 'تم إرجاع الطلب للمراجعة'
            };

            triggerToast(statusLabels[newStatus] || 'تم تحديث حالة الطلب', 'success');

            if (typeof onRefresh === 'function') onRefresh();
        } catch (error) {
            triggerToast(error.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة', 'error');
        }
    };

    // إرسال الرفض مع السبب المكتوب
    const submitRejection = async (e) => {
        e.preventDefault();
        if (!rejectModalState.reason.trim()) {
            triggerToast('يرجى كتابة سبب الرفض أولاً', 'error');
            return;
        }

        setRejectModalState(prev => ({ ...prev, isSubmitting: true }));

        await handleStatusChange(rejectModalState.orderId, 'rejected', rejectModalState.reason);

        // إغلاق النافذة المنبثقة وتصفير البيانات
        setRejectModalState({
            isOpen: false,
            orderId: null,
            reason: '',
            isSubmitting: false
        });
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-xs text-gray-500 bg-white rounded-xl card-shadow">
                جاري تحميل طلبات الاستيراد...
            </div>
        );
    }

    const newOrdersCount = orders.filter(o => o.status === 'pending').length;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-secondary">طلبات الاستيراد</h3>
                {newOrdersCount > 0 && (
                    <span className="bg-error text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {newOrdersCount} جديدة
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center text-xs text-gray-500 card-shadow border border-surface-container-high">
                        لا توجد طلبات استيراد مسجلة حالياً
                    </div>
                ) : (
                    orders.map((order) => {
                        const id = order.id;
                        const companyName = order.customer_name || order.customer?.name || order.user?.name || order.company_name || 'شركة استيراد';
                        const location = formatLocation(order);
                        const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString('ar-YE') : (order.order_date || order.date || '-');

                        const firstItem = order.items?.[0] || order.details?.[0] || {};
                        const rawProductName = firstItem.product_name || firstItem.product || order.product_name || order.product;
                        const productName = getProductName(rawProductName);

                        const customerPhone = order.customer?.phone || '-';
                        const customerEmail = order.customer_email || order.customer?.email || order.email || 'غير محدد';

                        const quantity = firstItem.quantity || order.quantity || 1;
                        const totalBudget = order.total_price ?? order.pricing?.total ?? order.total_amount ?? order.total ?? 0;
                        const shippingType = order.shipping_type || 'بحري';
                        const image = firstItem.product?.image || order.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200';

                        const currentStatus = order.status || 'pending';
                        const rejectionReason = order.rejection_reason;

                        return (
                            <div
                                key={id}
                                className="bg-white rounded-xl card-shadow border border-surface-container-high p-3 flex flex-col md:flex-row gap-3 transition"
                            >
                                <div className="w-full md:w-36 h-28 md:h-auto rounded-lg overflow-hidden shrink-0 bg-surface-container">
                                    <img className="w-full h-full object-cover" src={image} alt={productName} />
                                </div>

                                <div className="flex-1 flex flex-col justify-between gap-2">
                                    <div className="flex flex-wrap justify-between items-start gap-1">
                                        <div>
                                            <h4 className="text-sm mb-1 font-bold text-on-surface">{companyName}</h4>
                                            <p className="text-xs mb-1 text-on-surface-variant flex items-center gap-1 mt-0.5">
                                                <span className="material-symbols-outlined text-xs">location_on</span> {location}
                                            </p>
                                            {/* رقم الهاتف */}
                                            <a
                                                href={`tel:${customerPhone}`}
                                                className="flex items-center mb-1 gap-1 hover:text-primary transition dir-ltr"
                                            >
                                                <span className="text-xs text-gray-400">رقم التواصل</span>
                                                <span>{customerPhone}</span>
                                            </a>

                                            {/* البريد الإلكتروني */}
                                            <a
                                                href={`mailto:${customerEmail}`}
                                                className="flex items-center gap-1 hover:text-primary transition text-gray-500"
                                                title={customerEmail}
                                            >
                                                <span className="text-xs text-gray-400">الايميل</span>
                                                <span className="truncate max-w-45">{customerEmail}</span>
                                            </a>

                                        </div>
                                        <span className="text-[10px] text-on-surface-variant">{dateStr}</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 text-xs bg-surface-container-low p-2 rounded-lg">
                                        <div>
                                            <span className="text-[10px] text-on-surface-variant">المنتج</span>
                                            <p className="font-medium truncate" title={productName}>{productName}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-on-surface-variant">الكمية</span>
                                            <p className="font-medium">{quantity} قطعة</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-on-surface-variant">الميزانية</span>
                                            <p className="font-bold text-primary">{orderService.formatCurrency(totalBudget)}</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-on-surface-variant">الشحن</span>
                                            <p className="font-medium">{shippingType}</p>
                                        </div>
                                    </div>

                                    {/* عرض سبب الرفض إن وجد سابقاً */}
                                    {currentStatus === 'rejected' && rejectionReason && (
                                        <div className="p-2 bg-red-50 border border-red-100 rounded-lg text-xs">
                                            <span className="font-bold text-red-700 block">سبب الرفض:</span>
                                            <span className="text-red-600">{rejectionReason}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-gray-100">
                                        <span className="text-xs text-gray-500 font-medium">حالة الإجراء:</span>
                                        <select
                                            value={currentStatus}
                                            onChange={(e) => handleSelectChange(id, e.target.value)}
                                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer transition ${currentStatus === 'accepted'
                                                ? 'bg-green-50 border-green-300 text-green-700'
                                                : currentStatus === 'rejected'
                                                    ? 'bg-red-50 border-red-300 text-red-700'
                                                    : 'bg-yellow-50 border-yellow-300 text-yellow-700'
                                                }`}
                                        >
                                            <option value="pending">قيد الانتظار / معلق</option>
                                            <option value="accepted">قبول الطلب</option>
                                            <option value="rejected">رفض الطلب</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* نافذة إدخال سبب الرفض المنبثقة */}
            {rejectModalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-surface-container-high space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <h4 className="text-sm font-bold text-red-600 flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">error</span>
                                سبب رفض طلب الاستيراد
                            </h4>
                            <button
                                onClick={() => setRejectModalState({ isOpen: false, orderId: null, reason: '', isSubmitting: false })}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <form onSubmit={submitRejection} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    يرجى كتابة سبب رفض الطلب (سيرسل للعميل عبر الإيميل):
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    value={rejectModalState.reason}
                                    onChange={(e) => setRejectModalState(prev => ({ ...prev, reason: e.target.value }))}
                                    placeholder="مثال: تعذر الشحن إلى هذه المنطقة حالياً / الكمية غير متوفرة..."
                                    className="w-full text-xs p-2.5 border border-gray-300 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalState({ isOpen: false, orderId: null, reason: '', isSubmitting: false })}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectModalState.isSubmitting}
                                    className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                                >
                                    {rejectModalState.isSubmitting ? 'جاري الإرسال...' : 'تأكيد الرفض'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

