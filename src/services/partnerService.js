import api from '../services/api'; // العميل الموحد المجهز سابقاً

export const partnerService = {
  // جلب جميع الشركاء/الفروع للموقع العام
  getPublicPartners: async () => {
    const response = await api.get('/partners');
    // التعامل مع الهيكلية سواء كانت مغلّفة بـ data عبر PartnerResource أو مصفوفة مباشرة
    return response.data?.data || response.data;
  }
};
