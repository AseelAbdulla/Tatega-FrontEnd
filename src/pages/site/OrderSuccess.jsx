import OrderTracker from '../../components/site/OrderTracker';
import OrderItemsDetails from '../../components/site/OrderItemsDetails';

export default function OrderSuccess() {
    return (
        <main className="pt-24 pb-20 px-4 max-w-4xl mx-auto">
            {/* قسم تأكيد النجاح */}
            <section className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-on-surface mb-2">
                    تم تأكيد طلبك بنجاح!
                </h1>
                <p className="text-on-surface-variant mb-6 max-w-lg mx-auto leading-relaxed">
                    شكراً لاختيارك تعتيقة. لقد بدأنا بالفعل في تحضير باقتك العطرية بكل حب وعناية.
                </p>
                <div className="inline-block px-6 py-3 bg-white/50 border border-black/10 rounded-xl">
                    <span className="text-on-surface-variant">رقم الطلب: </span>
                    <span className="font-bold text-accent-terracotta mr-2">#TS-2026-8942</span>
                </div>
            </section>

            {/* شريط حالة الطلب */}
            <OrderTracker />

            {/* شبكة تفاصيل المنتجات والعنوان */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <OrderItemsDetails />

                <div className="space-y-6">
                    {/* كارت عنوان الشحن */}
                    <div className="bg-white rounded-xl p-6 rustic-shadow border border-black/5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined">location_on</span>
                            <span>عنوان الشحن</span>
                        </h3>
                        <p className="text-on-surface-variant leading-relaxed text-sm">
                            أحمد بن سلمان<br />
                            حي الملقا، طريق أنس بن مالك<br />
                            الرياض، 13521<br />
                            المملكة العربية السعودية
                        </p>
                    </div>

                    {/* زر التتبع */}
                    {/* <button className="w-full bg-accent-terracotta text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-250 flex items-center justify-center gap-2 hover:bg-accent-hover hover:shadow-xl over:-translate-y-0.5active:scale-95">
                        <span className="material-symbols-outlined">track_changes</span>
                        <span>تتبع الطلب بالتفصيل</span>
                    </button> */}
                </div>
            </div>
        </main>
    );
}
