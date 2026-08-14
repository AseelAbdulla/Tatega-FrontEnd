
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { orderService } from '../../services/orderService';
import { getLocalizedText } from '../../utils/localize';


export default function OrderSummary({ user, totalQuantity, grandTotal, shippingFee, subtotal, itemsCount }) {
const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'ar';
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [walletNumber, setWalletNumber] = useState('');
    const [paymentReceipt, setPaymentReceipt] = useState(null);
    const [receiptFileName, setReceiptFileName] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const locale = i18n.language === 'en' ? 'en-US' : 'ar-SA';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentReceipt(file);
            setReceiptFileName(file.name);
        }
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const addressId = user?.address?.id;
        if (!addressId) {
            setErrorMsg(t('order.error_address_required', 'يرجى إضافة عنوان توصيل بحسابك أولاً لإتمام الطلب.'));
            return;
        }

        if (paymentMethod === 'wallet' && !paymentReceipt) {
            setErrorMsg(t('order.error_receipt_required', 'يرجى إرفاق صورة إيصال الدفع عند اختيار المحفظة.'));
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('address_id', addressId);
            formData.append('customer_name', user?.name || '');
            formData.append('customer_phone', user?.phone || '');
            formData.append('customer_email', user?.email || '');
            formData.append('payment_method', paymentMethod);
            formData.append('shipping_fee', shippingFee || 0);

            if (notes) {
                formData.append('notes', notes);
            }

            if (paymentMethod === 'wallet') {
                if (walletNumber) formData.append('wallet_number', walletNumber);
                if (paymentReceipt) formData.append('payment_receipt', paymentReceipt);
            }

            const response = await orderService.createOrder(formData);
            const orderData = response?.data?.data || response?.data || response;

            if (orderData) {
                navigate('/OrderSuccess', {
                    state: { order: orderData }
                });
            }
        } catch (err) {
            console.error("خطأ في إنشاء الطلب:", err);
            // إذا كان الباك إند يُرجع مفتاح ترجمة (مثل cart.empty)، نقوم بترجمته تلقائياً عبر t()
            const rawMessage = err.response?.data?.message || 'order.error_generic';
            setErrorMsg(t(rawMessage, 'حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة لاحقاً.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-element-md">
            <form onSubmit={handleConfirmOrder} className="bg-surface-white rounded-xl shadow-md p-element-sm md:p-element-lg border border-outline-variant/30">
                <h2 className="text-headline-md font-bold text-on-surface mb-element-md text-start">
                    {t('order.summary_title', 'ملخص الطلب')}
                </h2>

                {errorMsg && (
                    <div className="mb-element-sm p-element-sm bg-red-50 text-red-600 text-body-md font-bold rounded-lg border border-red-200">
                        {errorMsg}
                    </div>
                )}

                {/* تفاصيل العميل */}
                <div className="mb-element-lg p-element-sm bg-background/50 rounded-lg space-y-micro-md">
                    <h3 className="text-label-sm font-bold text-primary mb-micro-md border-b border-primary/10 pb-micro-xs">
                        {t('order.customer_details', 'تفاصيل العميل')}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-micro-md">
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">
                                {t('common.name', 'الاسم')}
                            </span>
                            <span className="text-body-md text-on-surface font-semibold">
                                {user?.name || t('common.unregistered', 'غير مسجل')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">
                                {t('common.phone', 'رقم الهاتف')}
                            </span>
                            <span className="text-body-md text-on-surface font-semibold" dir="ltr">
                                {user?.phone || t('common.unregistered', 'غير مسجل')}
                            </span>
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">
                                {t('common.location', 'الموقع')}
                            </span>
                            <span className="text-body-md text-on-surface font-semibold">
                                {user?.address?.full_address || t('order.no_address', 'لم يتم إضافة عنوان')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* المجاميع */}
                <div className="space-y-micro-md border-b border-outline-variant pb-element-md mb-element-md text-body-md">
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">{t('order.total_items', 'مجموع العناصر')}</span>
                        <span className="font-bold">{itemsCount} {t('order.items_unit', 'منتجات')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">{t('order.total_pieces', 'إجمالي القطع')}</span>
                        <span className="font-bold">{totalQuantity} {t('order.pieces_unit', 'قطعة')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">{t('order.shipping', 'الشحن')}</span>
                        <span className="font-bold text-primary">
                            {shippingFee > 0
                                ? `${shippingFee.toLocaleString(locale)} ${t('common.currency', 'ريال')}`
                                : t('order.free_shipping', 'مجاني')}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-element-lg">
                    <span className="text-headline-md font-bold text-on-surface">{t('order.grand_total', 'إجمالي السلة')}</span>
                    <span className="text-headline-hero font-bold text-accent-terracotta">
                        {grandTotal.toLocaleString(locale)} {t('common.currency', 'ريال')}
                    </span>
                </div>

                {/* طريقة الدفع */}
                <div className="mt-element-lg space-y-element-sm">
                    <h3 className="text-headline-md font-bold text-on-surface text-start">
                        {t('order.payment_method', 'طريقة الدفع')}
                    </h3>
                    <div className="grid grid-cols-1 gap-micro-md">

                        {/* الدفع عند الاستلام */}
                        <label
                            onClick={() => setPaymentMethod('cash_on_delivery')}
                            className={`relative flex flex-col p-element-sm border-2 rounded-xl cursor-pointer transition-all ${
                                paymentMethod === 'cash_on_delivery' ? 'border-brand-green bg-brand-green/5' : 'border-outline-variant/30'
                            }`}
                        >
                            <input type="radio" name="payment_method" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} readOnly className="hidden" />
                            <div className="flex items-center gap-micro-md mb-micro-xs">
                                <span className="material-symbols-outlined text-brand-green">payments</span>
                                <span className="font-bold text-on-surface">{t('payment.cod', 'الدفع عند الاستلام')}</span>
                                {paymentMethod === 'cash_on_delivery' && <span className="material-symbols-outlined ms-auto text-brand-green">check_circle</span>}
                            </div>
                            <p className="text-label-sm text-on-surface-variant">{t('payment.cod_desc', 'ادفع نقدًا عند وصول طلبك.')}</p>
                        </label>

                        {/* محفظة إلكترونية */}
                        <label
                            onClick={() => setPaymentMethod('wallet')}
                            className={`relative flex flex-col p-element-sm border-2 rounded-xl cursor-pointer transition-all ${
                                paymentMethod === 'wallet' ? 'border-brand-green bg-brand-green/5' : 'border-outline-variant/30'
                            }`}
                        >
                            <input type="radio" name="payment_method" value="wallet" checked={paymentMethod === 'wallet'} readOnly className="hidden" />
                            <div className="flex items-center gap-micro-md mb-micro-xs">
                                <span className="material-symbols-outlined text-brand-green">account_balance_wallet</span>
                                <span className="font-bold text-on-surface">{t('payment.wallet', 'الدفع عبر محفظة إلكترونية')}</span>
                                {paymentMethod === 'wallet' && <span className="material-symbols-outlined ms-auto text-brand-green">check_circle</span>}
                            </div>
                            <p className="text-label-sm text-on-surface-variant">{t('payment.wallet_desc', 'أكمل الدفع باستخدام إحدى المحافظ الإلكترونية المتاحة.')}</p>
                        </label>

                        {/* تفاصيل المحفظة */}
                        {paymentMethod === 'wallet' && (
                            <div className="space-y-element-sm p-element-sm bg-surface-container rounded-xl border border-outline-variant/20 mb-4">
                                <div className="space-y-micro-xs">
                                    <label className="text-label-sm font-bold text-on-surface">
                                        {t('payment.wallet_number_label', 'رقم المحفظة / الحساب المحول منه')}
                                    </label>
                                    <input
                                        type="text"
                                        value={walletNumber}
                                        onChange={(e) => setWalletNumber(e.target.value)}
                                        className="w-full bg-surface-white border border-outline-variant/30 rounded-lg text-body-md px-element-sm py-2 focus:ring-2 focus:ring-accent-terracotta outline-none"
                                        placeholder={t('payment.wallet_number_placeholder', 'أدخل رقم محفظتك...')}
                                    />
                                </div>
                                <div className="space-y-micro-xs">
                                    <label className="text-label-sm font-bold text-on-surface">
                                        {t('payment.receipt_label', 'إرفاق إيصال الدفع *')}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                        id="receipt-upload"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="receipt-upload" className="flex items-center justify-center gap-micro-sm w-full py-3 border-2 border-dashed border-outline-variant/50 rounded-lg cursor-pointer hover:bg-surface-white transition-colors">
                                        <span className="material-symbols-outlined text-on-surface-variant">
                                            {paymentReceipt ? 'check_circle' : 'upload_file'}
                                        </span>
                                        <span className="text-label-sm text-on-surface-variant truncate max-w-[200px]">
                                            {receiptFileName || t('payment.choose_file', 'اختر ملفاً...')}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* الملاحظات */}
                        <div className="space-y-micro-xs mt-2">
                            <label className="text-label-sm font-bold text-on-surface">
                                {t('order.notes_label', 'ملاحظات على الطلب (اختياري)')}
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-surface-white border border-outline-variant/30 rounded-lg text-body-md p-element-sm focus:ring-2 focus:ring-accent-terracotta outline-none h-20"
                                placeholder={t('order.notes_placeholder', 'أي ملاحظات خاصة بالتوصيل...')}
                            />
                        </div>

                    </div>

                    {/* زر التأكيد */}
                    <button
                        type="submit"
                        disabled={loading || itemsCount === 0}
                        className={`w-full py-5 my-4 rounded-xl font-bold text-headline-md flex items-center justify-center gap-micro-md shadow-lg transition-all ${
                            itemsCount > 0 && !loading
                                ? 'bg-brand-orange text-white hover:bg-brand-green hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                        }`}
                    >
                        <span>
                            {loading ? t('order.confirming', 'جاري تأكيد الطلب...') : t('order.confirm_btn', 'تأكيد الطلب')}
                        </span>
                        <span className="material-symbols-outlined ltr:rotate-180">arrow_back</span>
                    </button>

                    {/* تنبيه الدفع عند الاستلام */}
                    {paymentMethod === 'cash_on_delivery' && (
                        <div className="p-micro-md bg-accent-terracotta/5 border border-accent-terracotta/20 rounded-lg flex items-center gap-micro-sm">
                            <span className="material-symbols-outlined text-accent-terracotta text-headline-md shrink-0">info</span>
                            <p className="text-body-md font-bold text-accent-terracotta leading-tight text-xs">
                                {t('payment.cod_notice', 'سيتم التواصل معك لتأكيد موعد التسليم.')}
                            </p>
                        </div>
                    )}

                </div>
            </form>

            {/* شارة الضمان */}
            <div className="bg-primary/5 rounded-xl p-element-sm flex items-center gap-micro-md border border-primary/10">
                <span className="material-symbols-outlined text-primary text-3xl shrink-0">verified</span>
                <div>
                    <h4 className="text-label-sm font-bold text-primary">{t('badge.organic_title', '100% عضوي وطبيعي')}</h4>
                    <p className="text-[11px] text-on-surface-variant">{t('badge.organic_desc', 'ضمان الطزاجة والجودة التراثية في كل صنف.')}</p>
                </div>
            </div>
        </aside>
    );
}

