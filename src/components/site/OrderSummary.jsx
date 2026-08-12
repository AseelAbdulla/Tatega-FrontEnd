
import { useState } from 'react';

export default function OrderSummary() {
    const [paymentMethod, setPaymentMethod] = useState('cod');

    return (
        <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-element-md">
            <div className="bg-surface-white rounded-xl shadow-md p-element-sm md:p-element-lg border border-outline-variant/30">
                <h2 className="text-headline-md font-bold text-on-surface mb-element-md text-right">ملخص الطلب</h2>

                {/* تفاصيل العميل */}
                <div className="mb-element-lg p-element-sm bg-background/50 rounded-lg space-y-micro-md">
                    <h3 className="text-label-sm font-bold text-primary mb-micro-md border-b border-primary/10 pb-micro-xs">
                        تفاصيل العميل
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-micro-md">
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">الاسم</span>
                            <span className="text-body-md text-on-surface font-semibold">سارة المنصوري</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">رقم الهاتف</span>
                            <span className="text-body-md text-on-surface font-semibold" dir="ltr">+966 50 XXX XXXX</span>
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant">الموقع</span>
                            <span className="text-body-md text-on-surface font-semibold">الرياض، حي النخيل - شارع التخصصي</span>
                        </div>
                    </div>
                </div>

                {/* رمز القسيمة */}
                {/* <div className="flex flex-col sm:flex-row gap-micro-sm mb-element-lg">
                    <input
                        type="text"
                        placeholder="رمز القسيمة"
                        className="w-full bg-background border border-outline-variant/30 rounded-lg text-body-md px-element-sm py-3 focus:ring-2 focus:ring-accent-terracotta outline-none"
                    />
                    <button className="w-full sm:w-auto bg-on-surface text-surface-white px-element-lg py-3 rounded-lg font-bold hover:bg-accent-hover transition-all">
                        تطبيق
                    </button>
                </div> */}

                {/* الحساب المالي */}
                <div className="space-y-micro-md border-b border-outline-variant pb-element-md mb-element-md text-body-md">
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">المجموع الفرعي</span>
                        <span className="font-bold">465 ر.س</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">الشحن</span>
                        <span className="font-bold">25 ر.س</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-on-surface-variant">الضريبة (15%)</span>
                        <span className="font-bold">69.75 ر.س</span>
                    </div>
                </div>

                {/* الإجمالي */}
                <div className="flex justify-between items-center mb-element-lg">
                    <span className="text-headline-md font-bold text-on-surface">إجمالي الطلب</span>
                    <span className="text-headline-hero font-bold text-accent-terracotta">559.75 ر.س</span>
                </div>

                {/* سؤال الاستبيان */}
                <div className="mb-element-lg">
                    <label className="block text-label-sm font-bold text-on-surface mb-micro-sm text-right">
                        كيف تعرفت على تعتيقة؟
                    </label>
                    <div className="relative">
                        <select className="w-full bg-background border border-outline-variant/30 rounded-lg text-body-md px-element-sm py-3 focus:ring-2 focus:ring-accent-terracotta outline-none appearance-none cursor-pointer">
                            <option value="" disabled selected>اختر خياراً...</option>
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="facebook">Facebook</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="google">Google Search</option>
                        </select>
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                    </div>
                </div>

                {/* زر تأكيد الطلب */}
                <button className="w-full bg-brand-orange text-white py-5 rounded-xl font-bold text-headline-md flex items-center justify-center gap-micro-md shadow-lg hover:bg-brand-green hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                    <span>تأكيد الطلب</span>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>

                {/* خيارات الدفع */}
                <div className="mt-element-lg space-y-element-sm">
                    <h3 className="text-headline-md font-bold text-on-surface text-right">طريقة الدفع</h3>
                    <div className="grid grid-cols-1 gap-micro-md">

                        {/* الدفع عند الاستلام */}
                        <label
                            onClick={() => setPaymentMethod('cod')}
                            className={`relative flex flex-col p-element-sm border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-green bg-brand-green/5' : 'border-outline-variant/30'
                                }`}
                        >
                            <input type="radio" name="payment_method" value="cod" checked={paymentMethod === 'cod'} readOnly className="hidden" />
                            <div className="flex items-center gap-micro-md mb-micro-xs">
                                <span className="material-symbols-outlined text-brand-green">payments</span>
                                <span className="font-bold text-on-surface">الدفع عند الاستلام</span>
                                {paymentMethod === 'cod' && <span className="material-symbols-outlined mr-auto text-brand-green">check_circle</span>}
                            </div>
                            <p className="text-label-sm text-on-surface-variant">ادفع نقدًا عند وصول طلبك.</p>
                        </label>

                        {/* محفظة إلكترونية */}
                        <label
                            onClick={() => setPaymentMethod('wallet')}
                            className={`relative flex flex-col p-element-sm border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-brand-green bg-brand-green/5' : 'border-outline-variant/30'
                                }`}
                        >
                            <input type="radio" name="payment_method" value="wallet" checked={paymentMethod === 'wallet'} readOnly className="hidden" />
                            <div className="flex items-center gap-micro-md mb-micro-xs">
                                <span className="material-symbols-outlined text-brand-green">account_balance_wallet</span>
                                <span className="font-bold text-on-surface">الدفع عبر محفظة إلكترونية</span>
                                {paymentMethod === 'wallet' && <span className="material-symbols-outlined mr-auto text-brand-green">check_circle</span>}
                            </div>
                            <p className="text-label-sm text-on-surface-variant">أكمل الدفع باستخدام إحدى المحافظ الإلكترونية المتاحة.</p>
                        </label>
                    </div>

                    {/* التفاصيل الديناميكية للمحفظة */}
                    {paymentMethod === 'wallet' && (
                        <div className="space-y-element-sm p-element-sm bg-surface-container rounded-xl border border-outline-variant/20">
                            <div className="space-y-micro-xs">
                                <label className="text-label-sm font-bold text-on-surface">اختر المحفظة</label>
                                <select className="w-full bg-surface-white border border-outline-variant/30 rounded-lg text-body-md px-element-sm py-2 focus:ring-2 focus:ring-accent-terracotta outline-none">
                                    <option value="stc">STC Pay</option>
                                    <option value="urpay">UrPay</option>
                                    <option value="alinma">AlinmaPay</option>
                                </select>
                            </div>
                            <div className="space-y-micro-xs">
                                <label className="text-label-sm font-bold text-on-surface">رقم المحفظة / الحساب</label>
                                <input
                                    type="text"
                                    className="w-full bg-surface-white border border-outline-variant/30 rounded-lg text-body-md px-element-sm py-2 focus:ring-2 focus:ring-accent-terracotta outline-none"
                                    placeholder="05xxxxxxxx"
                                />
                            </div>
                            <div className="space-y-micro-xs">
                                <label className="text-label-sm font-bold text-on-surface">إرفاق إيصال الدفع</label>
                                <input type="file" className="hidden" id="receipt-upload" />
                                <label htmlFor="receipt-upload" className="flex items-center justify-center gap-micro-sm w-full py-3 border-2 border-dashed border-outline-variant/50 rounded-lg cursor-pointer hover:bg-surface-white transition-colors">
                                    <span className="material-symbols-outlined text-on-surface-variant">upload_file</span>
                                    <span className="text-label-sm text-on-surface-variant">اختر ملفاً...</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* رسالة التأكيد للدفع عند الاستلام */}
                    {paymentMethod === 'cod' && (
                        <div className="p-micro-md bg-accent-terracotta/5 border border-accent-terracotta/20 rounded-lg flex items-center gap-micro-sm">
                            <span className="material-symbols-outlined text-accent-terracotta text-headline-md shrink-0">info</span>
                            <p className="text-body-md font-bold text-accent-terracotta leading-tight">سيتم التواصل معك لتأكيد موعد التسليم.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* شارة الضمان */}
            <div className="bg-primary/5 rounded-xl p-element-sm flex items-center gap-micro-md border border-primary/10">
                <span className="material-symbols-outlined text-primary text-3xl shrink-0">verified</span>
                <div>
                    <h4 className="text-label-sm font-bold text-primary">100% عضوي وطبيعي</h4>
                    <p className="text-[11px] text-on-surface-variant">ضمان الطزاجة والجودة التراثية في كل صنف.</p>
                </div>
            </div>
        </aside>
    );
}
