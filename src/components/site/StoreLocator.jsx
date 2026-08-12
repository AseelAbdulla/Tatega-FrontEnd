
export default function StoreLocator() {
    return (
        <section className="py-16 bg-surface-container/50">
            <div className="px-4 md:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-accent-terracotta font-bold text-xs mb-4 block uppercase">تواصل معنا مكانياً</span>
                    <h2 className="text-3xl font-bold text-primary mb-6">ابحث عن جذورنا</h2>
                </div>
                <div className="relative h-150 rounded-[3rem] overflow-hidden rustic-shadow bg-surface-container">
                    <div className="absolute inset-0 grayscale brightness-90 contrast-110 opacity-40">
                        <img alt="Map Background" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC70MtoGdqTS-yKNFEyyz8nNfvWkU4-bF4WSVipkmRth088iMJM03sgn1vs0KKnTMDfq-AhSe22prbjh--YLAxWncsn6yceSUSXmEAs4zjDx9uoKudEMQ1OrvpjgxsSLKhcqZ5qtSa32HHulvqizeu8OYSfqev0xPiFXUywLeT8Kg0LatHR-IdA14hjN5eIht6ViF-INc9Q1ME9gAApgVx6qnI5Cowf0EujJw2Bo59QKRQ63FscXFru" />
                    </div>

                    <div className="absolute top-1/3 left-1/4 group cursor-pointer">
                        <div className="w-10 h-10 bg-accent-terracotta rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                            <span className="material-symbols-outlined">location_on</span>
                        </div>
                    </div>

                    <div className="absolute top-10 right-10 w-full max-w-xs">
                        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-2xl">
                            <h4 className="font-bold text-primary text-lg mb-2">فرع الرياض - حي الياسمين</h4>
                            <p className="text-on-surface-variant text-sm mb-6">شارع العليا العام، مجمع الروان</p>
                            <div className="flex items-center gap-3 mb-8">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold text-primary">مفتوح: ٩ ص - ١٠ م</span>
                            </div>
                            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container">
                                <span className="material-symbols-outlined text-[20px]">directions</span>
                                <span>الاتجاهات</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
