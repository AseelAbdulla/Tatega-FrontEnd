
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full bg-white/90 backdrop-blur-md shadow-sm border-t border-black/5 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-3xl">eco</span>
                            <span className="text-2xl font-bold text-primary tracking-tight">تعتيقة</span>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed">
                            أفخر أنواع التوابل والفاكهة العضوية، نأتيكم بها من قلب الطبيعة إلى مائدتكم مع الحفاظ على التقاليد والجودة.
                        </p>
                    </div>

                    <div className="space-y-3" id="contact">
                        <h4 className="font-bold text-primary">تواصل معنا</h4>
                        <ul className="space-y-1 text-on-surface-variant text-sm">
                            <li className="flex items-center gap-2 py-1"><span className="material-symbols-outlined text-sm">mail</span> info@taateeqa.com</li>
                            <li className="flex items-center gap-2 py-1"><span className="material-symbols-outlined text-sm">phone</span> 92000XXXX</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6">التصنيفات</h4>
                        <ul className="space-y-4 text-on-surface-variant text-sm">
                            <li><Link to="/products" className="hover:text-accent-terracotta">التوابل والبهارات</Link></li>
                            <li><Link to="/products" className="hover:text-accent-terracotta">الفاكهة المجففة</Link></li>
                            <li><Link to="/products" className="hover:text-accent-terracotta">الزيوت الطبيعية</Link></li>
                            <li><Link to="/products" className="hover:text-accent-terracotta">المكسرات</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-bold text-lg mb-6">بوابة المستوردين</h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                            قم بتسجيل الدخول إلى حساب المستورد الخاص بك لإدارة طلبات الجملة وتتبع الشحنات وتحديث ملف تعريف عملك.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Link to="/importer-login" className="w-full py-3 bg-accent-terracotta text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-hover transition-all">
                                <span className="material-symbols-outlined">login</span>
                                <span>دخول المستوردين</span>
                            </Link>
                            <Link
                                class="w-full py-3 bg-white border border-primary text-primary rounded-xl font-bold transition-all duration-250 flex items-center justify-center gap-2 hover:bg-primary hover:text-white">
                                <span class="material-symbols-outlined">handshake</span>
                                <span class=""><span class="ar-text">كن مستورداً معنا</span></span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-black/5 text-center md:flex md:justify-between text-sm text-on-surface-variant">
                    <p>© 2026 تعتيقة للبهارات الفاخرة. جميع الحقوق محفوظة.</p>
                    <div className="flex gap-6 justify-center mt-4 md:mt-0">
                        <a href="#" className="hover:text-accent-terracotta">الشروط والأحكام</a>
                        <a href="#" className="hover:text-accent-terracotta">سياسة الشحن</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
