import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OrderTracker from '../../components/site/OrderTracker';
import OrderItemsDetails from '../../components/site/OrderItemsDetails';
import orderTrackerService from '../../services/OrderTrackeraservice';// 👈 استدعاء الخدمة

export default function OrderSuccess() {
    const location = useLocation();
    const { i18n } = useTranslation();
    const currentLang = i18n.language || 'ar';

    const rawOrderData = location.state?.order;
    const initialOrder = rawOrderData?.data || rawOrderData;

    // حالة للطلب لتمكين التحديث المباشر من الـ API
    const [order, setOrder] = useState(initialOrder);
    const [loading, setLoading] = useState(false);

    // جلب أحدث بيانات للطلب من السيرفر للتأكد من حالة الطلب الحالية
    useEffect(() => {
        if (order?.id) {
            setLoading(true);
            orderTrackerService.trackOrder(order.id)
                .then((updatedOrder) => {
                    if (updatedOrder) {
                        setOrder(updatedOrder);
                    }
                })
                .catch((err) => console.error("Error re-fetching order details:", err))
                .finally(() => setLoading(false));
        }
    }, [order?.id]);

    if (!order) {
        return (
            <div className="pt-32 pb-20 text-center" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                <p className="text-lg font-bold text-on-surface">
                    {currentLang === 'ar' ? 'لم يتم العثور على بيانات الطلب.' : 'No order details found.'}
                </p>
                <Link to="/" className="mt-4 inline-block text-primary underline">
                    {currentLang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>
            </div>
        );
    }

    // دمج قيمة الشحن مع كائن pricing لضمان وصولها للمكون
    const pricingData = {
        ...(order?.pricing || {}),
        shipping_fee: order?.pricing?.shipping_fee ?? order?.shipping_fee ?? order?.shipping_cost ?? 0
    };
    return (
        
        <main className="pt-24 pb-20 px-4 max-w-4xl mx-auto" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            {/* 1. قسم تأكيد النجاح ورقم الطلب */}
            <section className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-on-surface mb-2">
                    {currentLang === 'ar' ? 'تم تأكيد طلبك بنجاح!' : 'Order Confirmed Successfully!'}
                </h1>
                <p className="text-on-surface-variant mb-6 max-w-lg mx-auto leading-relaxed">
                    {currentLang === 'ar' 
                        ? 'شكراً لاختيارك تعتيقة. لقد بدأنا بالفعل في تحضير باقتك العطرية بكل حب وعناية.'
                        : 'Thank you for choosing Tateeqah. We have started preparing your order with love and care.'}
                </p>
                <div className="inline-block px-6 py-3 bg-white/50 border border-black/10 rounded-xl">
                    <span className="text-on-surface-variant">
                        {currentLang === 'ar' ? 'رقم الطلب: ' : 'Order ID: '}
                    </span>
                    <span className="font-bold text-accent-terracotta mr-2">#{order?.id}</span>
                </div>
            </section>

            {/* 2. شريط تتبع الطلب والدفع (تم إصلاح تمرير status هنا) */}
            <OrderTracker 
                currentStatus={order?.status}
                paymentStatus={order?.payment?.status} 
                paymentMethod={order?.payment?.method} 
            />

            {/* 3. تفاصيل المنتجات والعنوان */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* تفاصيل المنتجات والأسعار */}
                <OrderItemsDetails 
                    items={order?.items || []} 
                    pricing={pricingData} 
                />

                <div className="space-y-6">
                    {/* كارت عنوان الشحن */}
                    <div className="bg-white rounded-xl p-6 rustic-shadow border border-black/5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined">location_on</span>
                            <span>{currentLang === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}</span>
                        </h3>
                        <div className="text-on-surface-variant leading-relaxed text-sm space-y-1">
                            <p className="font-bold text-on-surface">{order?.customer?.name}</p>
                            {order?.address ? (
                                <>
                                    <p>{order.address.city} {order.address.region ? `، ${order.address.region}` : ''}</p>
                                    <p>{order.address.street} {order.address.building ? `، مبنى ${order.address.building}` : ''}</p>
                                </>
                            ) : (
                                <p>{currentLang === 'ar' ? 'العنوان المسجل على حسابك' : 'Address registered in your account'}</p>
                            )}
                            <p dir="ltr" className="text-right pt-1">{order?.customer?.phone}</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}

