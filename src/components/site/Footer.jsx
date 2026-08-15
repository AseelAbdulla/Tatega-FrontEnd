import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="w-full bg-white/90 backdrop-blur-md shadow-sm border-t border-black/5 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* معلومات تعتيقة */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-3xl">
                                eco
                            </span>

                            <span className="text-2xl font-bold text-primary tracking-tight">
                                {t('footer.brand')}
                            </span>
                        </div>

                        <p className="text-on-surface-variant leading-relaxed">
                            {t('footer.description')}
                        </p>
                    </div>


                    {/* تواصل معنا */}
                    <div className="space-y-3" id="contact">
                        <h4 className="font-bold text-primary">
                            {t('footer.contact')}
                        </h4>

                        <ul className="space-y-1 text-on-surface-variant text-sm">
                            <li className="flex items-center gap-2 py-1">
                                <span className="material-symbols-outlined text-sm">
                                    mail
                                </span>
                                info@taateeqa.com
                            </li>

                            <li className="flex items-center gap-2 py-1">
                                <span className="material-symbols-outlined text-sm">
                                    phone
                                </span>
                                92000XXXX
                            </li>
                        </ul>
                    </div>


                    {/* التصنيفات */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">
                            {t('footer.categories')}
                        </h4>

                        <ul className="space-y-4 text-on-surface-variant text-sm">
                            <li>
                                <Link
                                    to="/products"
                                    className="hover:text-accent-terracotta"
                                >
                                    {t('footer.spices')}
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products"
                                    className="hover:text-accent-terracotta"
                                >
                                    {t('footer.driedFruits')}
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products"
                                    className="hover:text-accent-terracotta"
                                >
                                    {t('footer.naturalOils')}
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products"
                                    className="hover:text-accent-terracotta"
                                >
                                    {t('footer.nuts')}
                                </Link>
                            </li>
                        </ul>
                    </div>


                    {/* بوابة المستوردين */}
                    <div className="space-y-6">
                        <h4 className="font-bold text-lg mb-6">
                            {t('footer.importerPortal')}
                        </h4>

                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                            {t('footer.importerDescription')}
                        </p>

                        <div className="flex flex-col gap-3">

                            {/* دخول المستوردين */}
                            <Link
                                to="/importer-login"
                                className="w-full py-3 bg-accent-terracotta text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-hover transition-all"
                            >
                                <span className="material-symbols-outlined">
                                    login
                                </span>

                                <span>
                                    {t('footer.importerLogin')}
                                </span>
                            </Link>


                            {/* كن مستورداً معنا */}
                            <Link
                                to="/importer-register"
                                className="w-full py-3 bg-white border border-primary text-primary rounded-xl font-bold transition-all duration-250 flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
                            >
                                <span className="material-symbols-outlined">
                                    handshake
                                </span>

                                <span>
                                    {t('footer.becomeImporter')}
                                </span>
                            </Link>

                        </div>
                    </div>

                </div>


                {/* الحقوق والروابط السفلية */}
                <div className="pt-8 border-t border-black/5 text-center md:flex md:justify-between text-sm text-on-surface-variant">

                    <p>
                        {t('footer.copyright')}
                    </p>

                    <div className="flex gap-6 justify-center mt-4 md:mt-0">
                        <a
                            href="#"
                            className="hover:text-accent-terracotta"
                        >
                            {t('footer.terms')}
                        </a>

                        <a
                            href="#"
                            className="hover:text-accent-terracotta"
                        >
                            {t('footer.shipping')}
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}