
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { i18n } = useTranslation();
    const currentLang = i18n.language?.startsWith('en') ? 'en' : 'ar';
    const { cartCount } = useCart();
    return (
        <>
            <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-outline-variant/20">
                <div className="max-w-7xl mx-auto px-4 md:px-16">
                    <div className="flex justify-between items-center h-20">
                        {/* الشعار والروابط */}
                        <div className="flex items-center gap-6">
                            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                                <img src="/favicon.svg" alt="" className='h-20 w-auto object-contain' />
                                {/* <span>توابل وثمار</span> */}
                            </Link>

                            {/* روابط الشاشات الكبيرة */}
                            <div className="hidden lg:flex gap-5 items-center mr-8">
                                <Link to="/" className="text-on-surface-variant font-label-sm hover:text-accent-terracotta transition-colors">الرئيسية</Link>
                                <Link to="/products" className="text-on-surface-variant font-label-sm hover:text-accent-terracotta transition-colors">المنتجات</Link>
                                <a href="#categories" className="text-on-surface-variant font-label-sm hover:text-accent-terracotta transition-colors">الأقسام</a>
                                <a href="#why" className="text-on-surface-variant font-label-sm hover:text-accent-terracotta transition-colors">لماذا نحن</a>
                                <a href="#parteners" className="text-on-surface-variant font-label-sm hover:text-accent-terracotta transition-colors">فروعنا</a>
                                <a href="#reviews" className="text-accent-terracotta text-xs font-bold border-b-2 border-accent-terracotta pb-1">التقييمات</a>
                                <a href="#contact" className="text-on-surface-variant font-label-sm hover:text-accent-terracotta transition-colors">اتصل بنا</a>
                            </div>
                        </div>

                        {/* أدوات الهيدر */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 border-x border-outline-variant/30 px-4">
                                {/* زر اللغة الإنجليزية */}
                                <button
                                    type="button"
                                    onClick={() => i18n.changeLanguage("en")}
                                    className={`font-label-sm transition-colors ${currentLang === 'en'
                                        ? 'text-accent-terracotta font-bold underline'
                                        : 'text-primary hover:text-accent-terracotta'
                                        }`}
                                >
                                    EN
                                </button>

                                <span className="text-outline-variant">|</span>

                                {/* زر اللغة العربية */}
                                <button
                                    type="button"
                                    onClick={() => i18n.changeLanguage("ar")}
                                    className={`font-label-sm transition-colors ${currentLang === 'ar'
                                        ? 'text-accent-terracotta font-bold underline'
                                        : 'text-primary hover:text-accent-terracotta'
                                        }`}
                                >
                                    AR
                                </button>
                            </div>


                            <div className="flex items-center gap-3">
                                <Link to="/login" className="material-symbols-outlined text-primary hover:text-accent-terracotta transition-colors">person</Link>

                                <div className="relative">
                                    <Link to="/cart" className="material-symbols-outlined text-primary">shopping_cart</Link>

                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-accent-terracotta text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}

                                </div>


                                {/* زر القائمة - يظهر فقط في الشاشات الصغيرة lg:hidden */}
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="lg:hidden material-symbols-outlined text-primary text-3xl p-2 rounded-lg hover:bg-black/5 transition-colors focus:outline-none"
                                >
                                    menu
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>

            {/* القائمة الجانبية للجوال (Mobile Drawer) */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden">
                    <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-black/10 pb-4">
                            <span className="font-bold text-primary text-lg">القائمة الرئيسية</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="material-symbols-outlined text-2xl text-on-surface-variant p-2 hover:bg-black/5 rounded-full">
                                close
                            </button>
                        </div>
                        <div className="flex flex-col gap-4 font-medium">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-on-surface hover:text-accent-terracotta py-1">الرئيسية</Link>
                            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-on-surface hover:text-accent-terracotta py-1">المنتجات</Link>
                            <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="text-on-surface hover:text-accent-terracotta py-1">الأقسام</a>
                            <a href="#why" onClick={() => setMobileMenuOpen(false)} className="text-on-surface hover:text-accent-terracotta py-1">لماذا نحن</a>
                            <a href="#parteners" onClick={() => setMobileMenuOpen(false)} className="text-on-surface hover:text-accent-terracotta py-1">فروعنا</a>
                            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-accent-terracotta font-bold py-1">التقييمات</a>
                            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-on-surface hover:text-accent-terracotta py-1">اتصل بنا</a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
