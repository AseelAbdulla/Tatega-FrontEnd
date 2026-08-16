import React, { useState } from 'react';

// رابط السيرفر الأساسي الموجه لمجلد الـ storage
const STORAGE_BASE_URL = 'http://localhost:8000/storage/'; // قم بتغيير الدومين والمنافذ بحسب سيرفرك المحلي/المباشر

// دالة مساعدة معالجة أسماء المنتجات والوحدات المفكوكة من صيغة JSON
const parseLocalizedText = (input, lang = 'ar') => {
    if (!input) return '-';

    if (typeof input === 'object' && input !== null) {
        return input[lang] || input.ar || input.en || Object.values(input)[0] || '-';
    }

    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed[lang] || parsed.ar || parsed.en || Object.values(parsed)[0] || input;
            }
        } catch (e) {
            return input;
        }
    }

    return String(input);
};

export default function OrderDetailsModal({ isOpen, onClose, order }) {
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

    if (!isOpen || !order) return null;

    // 1. استخراج بيانات العميل والعنوان
    const customerName = order.customer?.name || 'غير محدد';
    const customerPhone = order.customer?.phone || '-';
    const address = order.address 
        ? `${order.address.city || ''}، ${order.address.street || ''} (مبنى ${order.address.building || ''})`
        : 'لا يوجد عنوان محدد';

    // 2. استخراج المبالغ والتواريخ
    const subtotal = order.pricing?.subtotal ?? 0;
    const shippingFee = order.pricing?.shipping_fee ?? 0;
    const discount = order.pricing?.discount ?? 0;
    const totalPrice = order.pricing?.total ?? 0;
    const createdAt = order.created_at ? new Date(order.created_at).toLocaleString('ar-YE') : '-';

    // 3. استخراج تفاصيل الدفع والإيصال
    const paymentMethod = order.payment?.method === 'wallet' ? 'محفظة إلكترونية' : (order.payment?.method || 'الدفع عند الاستلام');
    const paymentStatus = order.payment?.status || '-';
    const receiptPath = order.payment?.receipt || null;
    const fullReceiptUrl = receiptPath ? `${STORAGE_BASE_URL}${receiptPath.replace(/^\//, '')}` : null;

    // 4. المنتجات
    const items = order.items || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 transition-all duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl card-shadow border border-surface-container-high z-10 max-h-[90vh] overflow-y-auto">

                {/* الهيدر */}
                <div className="flex justify-between items-center border-b border-surface-container-high pb-3">
                    <h3 className="text-base font-bold text-on-surface">تفاصيل الطلب #{order.id}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full transition">
                        <span className="material-symbols-outlined text-on-surface-variant">close</span>
                    </button>
                </div>

                {/* تفاصيل الطلب */}
                <div className="space-y-4 mt-3 text-sm">
                    {/* معلومات أساسية */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                            <span className="text-gray-500 block">اسم العميل:</span>
                            <span className="font-bold text-gray-800">{customerName}</span>
                        </div>

                        <div>
                            <span className="text-gray-500 block">رقم التواصل:</span>
                            <a
                                href={`tel:${customerPhone}`}
                                className="font-bold text-primary hover:underline dir-ltr inline-flex items-center gap-1"
                            >
                                {customerPhone}
                            </a>
                        </div>

                        <div className="mt-1">
                            <span className="text-gray-500 block">التاريخ:</span>
                            <span className="font-bold text-gray-800">{createdAt}</span>
                        </div>
                        
                        <div className="mt-1">
                            <span className="text-gray-500 block">الحالة:</span>
                            <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed rounded-full text-[12px] font-bold">
                                {order.status}
                            </span>
                        </div>

                        <div className="col-span-2 mt-1 pt-1 border-t border-gray-200">
                            <span className="text-gray-500 block">عنوان التوصيل:</span>
                            <span className="font-semibold text-gray-700">{address}</span>
                        </div>
                    </div>

                    {/* قسم تفاصيل الدفع والإيصال */}
                    <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">طريقة الدفع:</span>
                            <span className="font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                                {paymentMethod}
                            </span>
                        </div>

                        {/* <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">حالة الدفع:</span>
                            <span className="font-bold text-gray-700">
                                {paymentStatus}
                            </span>
                        </div> */}

                        {/* عرض الإيصال بحالة وجوده */}
                        {fullReceiptUrl && (
                            <div className="pt-2 border-t border-gray-200">
                                <span className="text-gray-500 block mb-1.5 font-medium">إيصال التحويل:</span>
                                <div 
                                    className="relative group cursor-pointer w-24 h-24 rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center"
                                    onClick={() => setIsImagePreviewOpen(true)}
                                >
                                    <img 
                                        src={fullReceiptUrl} 
                                        alt="إيصال الدفع" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* قائمة المنتجات */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-700 mb-2">المنتجات المطلوبة ({items.length}):</h4>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {items.length > 0 ? (
                                items.map((item) => {
                                    const productName = parseLocalizedText(item.product?.name, 'ar');
                                    const unitName = parseLocalizedText(item.unit?.name, 'ar');

                                    return (
                                        <div key={item.id} className="flex justify-between items-center text-xs p-2 bg-surface-container-low rounded-lg border border-surface-container">
                                            <div>
                                                <p className="font-bold text-gray-800">{productName}</p>
                                                <p className="text-[12px] text-gray-500">
                                                    الكمية: {item.quantity} {unitName !== '-' ? `(${unitName})` : ''} × {item.unit_price}
                                                </p>
                                            </div>
                                            <span className="font-bold text-secondary">
                                                {item.total_price}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-gray-400 italic">لا توجد منتجات</p>
                            )}
                        </div>
                    </div>

                    {/* المبالغ المالية */}
                    <div className="border-t border-surface-container-high pt-2 space-y-1 text-xs">
                        <div className="flex justify-between text-gray-600">
                            <span>المجموع الفرعي:</span>
                            <span>{subtotal}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-red-600">
                                <span>الخصم:</span>
                                <span>-{discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>رسوم الشحن:</span>
                            <span>{shippingFee}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-secondary pt-1 border-t border-dashed border-gray-200">
                            <span>الإجمالي الكلي:</span>
                            <span>{totalPrice}</span>
                        </div>
                    </div>

                    {/* الملاحظات */}
                    {order.notes && (
                        <div className="pt-2 border-t border-surface-container-high">
                            <p className="text-[12px] text-gray-500">ملاحظات العميل:</p>
                            <p className="text-xs text-gray-700 mt-0.5">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* الأزرار */}
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition">
                        إغلاق
                    </button>
                </div>
            </div>

            {/* نافذة معاينة الإيصال للحجم الكامل */}
            {isImagePreviewOpen && fullReceiptUrl && (
                <div 
                    className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setIsImagePreviewOpen(false)}
                >
                    <div className="relative max-w-2xl max-h-[90vh]">
                        <img 
                            src={fullReceiptUrl} 
                            alt="إيصال الدفع بحجم كامل" 
                            className="max-w-full max-h-[85vh] rounded-lg object-contain"
                        />
                        <button 
                            onClick={() => setIsImagePreviewOpen(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

