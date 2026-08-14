import React from 'react';
import { useTranslation } from 'react-i18next';
// 1️⃣ استيراد دالة الترجمة المخصصة من الملف المنفصل
import { getLocalizedText } from '../../utils/localize';

export default function OrderItemsDetails({ items = [], pricing = {} }) {
    // 2️⃣ استخدام i18next للترجمة التلقائية مع معرفة اللغة الحالية
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'ar';
    const locale = currentLang === 'en' ? 'en-US' : 'ar-SA';

    // دالة استخراج اسم المنتج مع الاعتماد على الملف المنفصل مع fallback مناسب
    const getProductName = (product) => {
        if (!product) return t('order.product_default', 'منتج');
        const target = product.product || product;
        
        return getLocalizedText(target.name || target.title)
            || (currentLang === 'en' ? target.name_en : target.name_ar)
            || target.name 
            || t('order.product_default', 'منتج');
    };

    // استخراج قيمة التوصيل
    const shippingFee = Number(pricing.shipping_fee || pricing.shipping || 0);

    return (
        <div className="md:col-span-2 space-y-6" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            {/* كارت قائمة المنتجات */}
            <div className="bg-white rounded-xl p-6 rustic-shadow border border-black/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined">shopping_bag</span>
                    <span>{t('order.selected_products', 'المنتجات المحددة')}</span>
                </h3>

                <div className="divide-y divide-gray-100">
                    {items && items.length > 0 ? (
                        items.map((item, index) => {
                            const qty = Number(item.quantity || item.qty || 1);
                            const price = Number(item.unit_price || item.price || 0);
                            const total = qty * price;

                            return (
                                <div key={item.id || index} className="py-3 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={item.product?.image || item.image || '/placeholder.png'} 
                                            alt={getProductName(item)} 
                                            className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                                        />
                                        <div>
                                            {/* اسم المنتج المترجم تلقائياً من قاعدة البيانات */}
                                            <h4 className="font-semibold text-sm text-on-surface">
                                                {getProductName(item)}
                                            </h4>
                                            <p className="text-xs text-on-surface-variant mt-0.5">
                                                {t('cart.quantity', 'الكمية')}: {qty} × {price.toLocaleString(locale)} {t('common.currency', 'ر.ي')}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm text-on-surface">
                                        {total.toLocaleString(locale)} {t('common.currency', 'ر.ي')}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-on-surface-variant py-2">
                            {t('order.no_items_found', 'لا توجد تفاصيل للمنتجات.')}
                        </p>
                    )}
                </div>
            </div>

            {/* كارت ملخص الفاتورة */}
            <div className="bg-white rounded-xl p-6 rustic-shadow border border-black/5 space-y-3">
                <h3 className="text-lg font-bold mb-3 text-primary">
                    {t('order.summary_title', 'ملخص الحساب')}
                </h3>
                
                <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>{t('order.subtotal', 'المجموع الفرعي:')}</span>
                    <span className="font-semibold">
                        {(pricing.subtotal || 0).toLocaleString(locale)} {t('common.currency', 'ر.ي')}
                    </span>
                </div>

                {Number(pricing.discount) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>{t('order.discount', 'الخصم:')}</span>
                        <span className="font-semibold">
                            -{(pricing.discount).toLocaleString(locale)} {t('common.currency', 'ر.ي')}
                        </span>
                    </div>
                )}

                {/* رسوم التوصيل */}
                <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>{t('order.delivery_fee', 'رسوم التوصيل:')}</span>
                    <span className="font-semibold">
                        {shippingFee > 0 
                            ? `${shippingFee.toLocaleString(locale)} ${t('common.currency', 'ر.ي')}` 
                            : t('order.free_shipping', 'مجاني')}
                    </span>
                </div>

                <hr className="my-2 border-gray-100" />

                <div className="flex justify-between text-base font-bold text-on-surface">
                    <span>{t('order.grand_total', 'الإجمالي الكلي:')}</span>
                    <span className="text-accent-terracotta">
                        {(pricing.total || 0).toLocaleString(locale)} {t('common.currency', 'ر.ي')}
                    </span>
                </div>
            </div>
        </div>
    );
}

