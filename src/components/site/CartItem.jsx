import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// 1️⃣ استيراد دالة الترجمة المخصصة من الملف المنفصل
import { getLocalizedText } from '../../utils/localize';

export default function CartItem({ item, onDelete, onUpdateQty, isUpdating, onClearCart }) {
    // 2️⃣ إبقاء useTranslation هنا يضمن استجابة المكون وتحديثه فوراً عند تغيير اللغة
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'ar';

    // 3️⃣ جلب الأسماء المترجمة من قاعدة البيانات بسطر واحد فقط لكل حقل
    const productName = getLocalizedText(item.product?.name) 
        || (currentLang === 'en' ? item.product?.name_en : item.product?.name_ar) 
        || item.product?.name;

    const unitName = getLocalizedText(item.unit?.name) 
        || (currentLang === 'en' ? item.unit?.name_en : item.unit?.name_ar) 
        || item.unit?.name;

    // معالجة مسار الصورة
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.png';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
        const cleanBaseURL = baseURL.replace('/api', '');
        return `${cleanBaseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    return (
         <>
        <div className={`bg-surface-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch md:items-center p-3 md:p-element-sm gap-3 md:gap-element-md group hover:shadow-md transition-all ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
            
            {/* صورة المنتج */}
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0 bg-surface-container flex items-center justify-center">
                <img
                    className="w-full h-full object-cover"
                    src={getImageUrl(item.image)}
                    alt={productName}
                />
            </div>

            {/* تفاصيل المنتج والتحكم بالكمية */}
            <div className="grow flex flex-col justify-between md:h-32 py-0 md:py-micro-xs gap-3 md:gap-0">
                <div className="flex justify-between items-start">
                    <div>
                        {/* اسم المنتج المترجم من الداتا بيز */}
                        <h3 className="text-base md:text-headline-md font-bold text-on-surface line-clamp-1">
                            {productName}
                        </h3>
                        {/* اسم الوحدة المترجم من الداتا بيز */}
                        <p className="text-xs md:text-label-sm text-on-surface-variant mt-1 md:mt-micro-xs">
                            {t('cart.unit', 'الوحدة')}: {unitName}
                        </p>
                    </div>
                    
                    {/* زر الحذف */}
                    <button
                        onClick={() => onDelete(item.id)}
                        className="text-on-surface-variant hover:text-red-600 transition-colors p-1 shrink-0"
                        aria-label={t('cart.delete_product', 'حذف المنتج')}
                        title={t('common.delete', 'حذف')}
                    >
                        <span className="material-symbols-outlined text-xl md:text-2xl">delete</span>
                    </button>
                </div>

                {/* أزرار زيادة ونقصان الكمية */}
                <div className="flex items-center gap-3 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/10">
                    <div className="flex items-center gap-micro-md">
                        <label className="text-xs md:text-label-sm text-on-surface-variant">
                            {t('cart.quantity', 'الكمية')}:
                        </label>
                        <div className="flex items-center border-2 border-outline-variant/20 rounded-xl overflow-hidden bg-white">
                            <button
                                onClick={() => onUpdateQty(item.id, item.quantity, -1)}
                                className="px-2.5 md:px-3 py-1 hover:bg-surface-container transition-colors text-base md:text-lg font-bold disabled:opacity-30"
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                readOnly
                                value={item.quantity}
                                className="w-8 md:w-10 text-center border-none focus:ring-0 bg-transparent font-bold text-sm md:text-base p-0"
                            />
                            <button
                                onClick={() => onUpdateQty(item.id, item.quantity, 1)}
                                className="px-2.5 md:px-3 py-1 hover:bg-surface-container transition-colors text-base md:text-lg font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* الأسعار والمجاميع الفرعية */}
                <div className="flex justify-between items-center pt-1 md:pt-0">
                    <span className="text-xs text-gray-400">
                        {t('cart.unit_price', 'سعر الوحدة')}: {item.price} {t('common.currency', 'ر.س')}
                    </span>
                    <span className="text-base md:text-headline-md font-bold text-primary whitespace-nowrap">
                        {t('cart.subtotal', 'إجمالي')}: {item.subtotal} {t('common.currency', 'ر.س')}
                    </span>
                </div>
                
            </div>
            
        </div>
           <div className={`bg-surface-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch md:items-center p-3 md:p-element-sm gap-3 md:gap-element-md group hover:shadow-md transition-all ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                {onClearCart && (
                    <button
                        onClick={onClearCart}
                        className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                        <span>{t('cart.clear_cart', 'تفريغ السلة')}</span>
                    </button>
                )}

                <Link to="/products" className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-white bg-brand-orange hover:bg-orange-400 px-3 py-2 rounded-xl transition-colors">
                    <span>{t('cart.update_cart', 'تحديث السلة')}</span>
                    <span className="material-symbols-outlined ltr:rotate-180">arrow_back</span>
                </Link>
            </div>
           </>
    );
}

