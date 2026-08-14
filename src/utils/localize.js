import i18n from '../i18n'; // تأكد من صحة مسار ملف إعدادات i18n لديك

/**
 * دالة لاستخراج النص المترجم من حقول قاعدة البيانات
 * @param {Object|String} field - الحقل المراد ترجمته
 * @returns {String} النص المترجم للغة الحالية
 */
export const getLocalizedText = (field) => {
    if (!field) return '';

    const currentLang = i18n.language || 'ar';

    // 1. إذا كان الحقل كائن يحتوي على اللغات { ar: '...', en: '...' }
    if (typeof field === 'object') {
        return field[currentLang] || field['ar'] || field['en'] || '';
    }

    // 2. إذا كان الحقل نص JSON
    if (typeof field === 'string' && (field.startsWith('{') || field.startsWith('['))) {
        try {
            const parsed = JSON.parse(field);
            return parsed[currentLang] || parsed['ar'] || parsed['en'] || field;
        } catch {
            return field;
        }
    }

    return field;
};

/**
 * دالة جلب الاسم مع الدعم للحقول المنفصلة (name_ar / name_en)
 */
export const getLocalizedName = (item, entity = 'product') => {
    if (!item) return '';
    const currentLang = i18n.language || 'ar';
    const target = item[entity] || item;

    // المحاولة الأولى: استخدام getLocalizedText للحقل المباشر
    const localized = getLocalizedText(target?.name);
    if (localized) return localized;

    // المحاولة الثانية: إذا كانت الحقول منفصلة مثل name_en و name_ar
    if (currentLang === 'en') {
        return target?.name_en || target?.name_ar || target?.name || '';
    }
    return target?.name_ar || target?.name || '';
};

