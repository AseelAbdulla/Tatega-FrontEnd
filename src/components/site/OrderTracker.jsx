import React from 'react';
import { useTranslation } from 'react-i18next';

export default function OrderTracker({ currentStatus = '' }) {
    const { t } = useTranslation();

    // 1️⃣ تنظيف الحالة وتحويلها لحروف صغيرة
    const rawStatus = String(currentStatus || '').trim().toLowerCase();

    // 2️⃣ معالجة حالات الإلغاء والرفض المباشرة من الـ Enum (canceled / rejected)
    if (['canceled', 'cancelled', 'rejected', 'ملغي', 'مرفوض'].includes(rawStatus)) {
        return (
            <div className="w-full my-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center gap-3 text-red-600">
                <span className="material-symbols-outlined text-2xl">cancel</span>
                <span className="font-bold text-sm md:text-base">
                    {t('order.status_canceled', 'تم إلغاء هذا الطلب أو رفضه')}
                </span>
            </div>
        );
    }

    // 3️⃣ ربط قيم الـ Enum بـ المفاتيح الأساسية لشريط التتبع
    const normalizeStatus = (status) => {
        switch (status) {
            // حالة الانتظار / طلب جديد
            case 'pending':
            case 'new':
                return 'pending';

            // حالة القبول والتجهيز (شاملة accepted المرجعة من الباك إند)
            case 'accepted':
            case 'processing':
            case 'preparing':
            case 'in_progress':
                return 'processing';

            // حالة الشحن والتوصيل
            case 'shipped':
            case 'delivering':
            case 'on_way':
                return 'shipped';

            // حالة مكتمل / تم التسليم
            case 'completed':
            case 'delivered':
                return 'delivered';

            default:
                return 'pending';
        }
    };

    const activeKey = normalizeStatus(rawStatus);

    // 4️⃣ خطوات التتبع الـ 4 الأساسية
    const steps = [
        { key: 'pending', label: t('order.status_pending', 'قيد الانتظار'), icon: 'hourglass_top' },
        { key: 'processing', label: t('order.status_processing', 'تم القبول والجاري التجهيز'), icon: 'inventory' },
        { key: 'shipped', label: t('order.status_shipped', 'تم الشحن'), icon: 'local_shipping' },
        { key: 'delivered', label: t('order.status_delivered', 'تم التسليم'), icon: 'check_circle' },
    ];

    // تحديد الفهرس (Index)
    const currentStepIndex = steps.findIndex(step => step.key === activeKey);
    console.log("🔴 القيمة الواصلة داخل المكون OrderTracker هي:", currentStatus);
    return (
        <div className="flex items-center justify-between w-full my-6">
            {steps.map((step, index) => {
                const isPassedOrCurrent = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                    <React.Fragment key={step.key}>
                        {/* الأيقونة والنص */}
                        <div className="flex flex-col items-center relative z-10">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isPassedOrCurrent
                                        ? 'bg-brand-green text-white shadow-md'
                                        : 'bg-gray-200 text-gray-400'
                                } ${isCurrent ? 'ring-4 ring-brand-green/20 scale-110' : ''}`}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {step.icon}
                                </span>
                            </div>
                            <span
                                className={`text-xs mt-2 font-bold transition-colors ${
                                    isPassedOrCurrent ? 'text-brand-green' : 'text-gray-400'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* الخط الواصل */}
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 h-1 transition-all duration-500 mx-2 ${
                                    index < currentStepIndex ? 'bg-brand-green' : 'bg-gray-200'
                                }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

