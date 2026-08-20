// utils/formatters.js

// دالة لاستخراج الرقم وتجميعه
export const parseAmount = (amountStr) => {
    if (!amountStr) return 0;
    // تحويل الأرقام العربية الهندية إلى إنجليزية إن وجدت وإزالة أي حروف
    const cleanStr = amountStr
        .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
        .replace(/[^\d.]/g, ''); 
    return parseFloat(cleanStr) || 0;
};

// دالة لتنسيق الرقم النهائي للعرض
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0
    }).format(amount);
};

