export default function OrderTracker() {
    return (
        <section className="mb-12">
            {/* تتبع الشاشات الكبيرة (Desktop Stepper) */}
            <div className="hidden md:flex relative justify-between mb-8">
                <div className="absolute top-[20px] h-0.5 bg-surface-container-highest w-full z-0"></div>
                <div className="absolute top-[20px] h-0.5 bg-primary w-[33%] right-0 z-0"></div>

                {/* خطوة 1: تم استلام الطلب */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined">check</span>
                    </div>
                    <span className="text-sm font-medium">تم استلام الطلب</span>
                </div>

                {/* خطوة 2: في الطريق إليك */}
                <div className="relative z-10 flex flex-col items-center gap-2 opacity-40">
                    <div className="w-10 h-10 rounded-full bg-white text-on-surface-variant flex items-center justify-center border border-outline-variant">
                        <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <span className="text-sm font-medium">في الطريق إليك</span>
                </div>
            </div>

            {/* تتبع الشاشات الصغيرة (Mobile Stepper) */}
            <div className="flex flex-col md:hidden space-y-6">
                <div className="flex items-start gap-4 relative">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md relative z-10">
                            <span className="material-symbols-outlined text-[18px]">check</span>
                        </div>
                        <div className="w-0.5 h-12 bg-primary mt-2"></div>
                    </div>
                    <div className="pt-1">
                        <span className="text-lg font-bold block">تم استلام الطلب</span>
                        <span className="text-sm text-on-surface-variant">12:30 PM, اليوم</span>
                    </div>
                </div>

                <div className="flex items-start gap-4 opacity-40">
                    <div className="w-8 h-8 rounded-full bg-white border border-outline-variant text-on-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    </div>
                    <div className="pt-1">
                        <span className="text-lg font-bold block">في الطريق إليك</span>
                        <span className="text-sm text-on-surface-variant">متوقع قريباً</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
