import React from 'react';
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

    // دالة آمنة لإظهار التنبيه أياً كان اسم الـ prop الممرر
    const triggerToast = (msg, type = 'success') => {
        if (typeof onShowToast === 'function') {
            onShowToast(msg, type);
        } else if (typeof showToast === 'function') {
            showToast(msg, type);
        }
    };

    // التعامل مع تحديث حالة الطلب
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            
            const statusLabels = {
                accepted: 'تم قبول طلب الاستيراد',
                rejected: 'تم رفض طلب الاستيراد',
                pending: 'تم إرجاع الطلب للمراجعة'
            };
            
            triggerToast(statusLabels[newStatus] || 'تم تحديث حالة الطلب', 'success');
            
            if (typeof onRefresh === 'function') onRefresh();
        } catch (error) {
            triggerToast(error.response?.data?.message || 'حدث خطأ أثناء تحديث الحالة', 'error');
        }
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

                        const quantity = firstItem.quantity || order.quantity || 1;
                        const totalBudget = order.total_price ?? order.pricing?.total ?? order.total_amount ?? order.total ?? 0;
                        const shippingType = order.shipping_type || 'بحري';
                        const image = firstItem.product?.image || order.image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200';

                        const currentStatus = order.status || 'pending';

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
                                            <h4 className="text-sm font-bold text-on-surface">{companyName}</h4>
                                            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                                                <span className="material-symbols-outlined text-xs">location_on</span> {location}
                                            </p>
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

                                    <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-gray-100">
                                        <span className="text-xs text-gray-500 font-medium">حالة الإجراء:</span>
                                        <select
                                            value={currentStatus}
                                            onChange={(e) => handleStatusChange(id, e.target.value)}
                                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer transition ${
                                                currentStatus === 'accepted'
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
        </div>
    );
}

