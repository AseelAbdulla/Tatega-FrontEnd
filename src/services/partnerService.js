import api from '../services/api'; // العميل الموحد المجهز سابقاً

export const partnerService = {
  // 1. جلب جميع الشركاء/الفروع للموقع العام
  getPublicPartners: async () => {
    const response = await api.get('/partners');
    return response.data?.data || response.data;
  },

  // 2. جلب تفاصيل فرع محدد بواسطة المعرف ID
  getPartnerById: async (id) => {
    const response = await api.get(`/partners/${id}`);
    return response.data?.data || response.data;
  },

  // 3. إضافة فرع/شريك جديد (عبر مسارات الأدمن)
  createPartner: async (data) => {
    const payload = new FormData();

    payload.append('name[ar]', data.name_ar || '');
    if (data.name_en) payload.append('name[en]', data.name_en);
    if (data.slogan) payload.append('slogan', data.slogan);
    if (data.website_url) payload.append('website_url', data.website_url);
    payload.append('sort_order', data.sort_order ? Number(data.sort_order) : 0);
    payload.append('status', data.status || 'active');

    if (data.lat) payload.append('lat', data.lat);
    if (data.lng) payload.append('lng', data.lng);

    // إرفاق ملف الصورة كـ File
    if (data.logo instanceof File) {
      payload.append('logo', data.logo);
    }

    const response = await api.post('/admin/partners', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data?.data || response.data;
  },

  // 4. تعديل فرع/شريك موجود (مُعدلة لتمرير FormData وإرسال POST مع _method: PUT)
  updatePartner: async (id, data) => {
    // إذا كانت البيانات القادمة هي FormData جاهزة من المودال
    if (data instanceof FormData) {
      const response = await api.post(`/admin/partners/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data?.data || response.data;
    }

    // بناء FormData في حال تمرير Object عادي
    const payload = new FormData();
    payload.append('_method', 'PUT'); // مهم جداً لـ Laravel عند استخدام POST للتحديث
    payload.append('name[ar]', data.name_ar || '');
    if (data.name_en) payload.append('name[en]', data.name_en);
    if (data.website_url) payload.append('website_url', data.website_url);
    payload.append('sort_order', data.sort_order ? Number(data.sort_order) : 0);
    payload.append('status', data.status || 'active');

    if (data.lat) payload.append('lat', data.lat);
    if (data.lng) payload.append('lng', data.lng);

    if (data.logo instanceof File) {
      payload.append('logo', data.logo);
    }

    const response = await api.post(`/admin/partners/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data?.data || response.data;
  },

  // 5. تغيير حالة الفرع سريعاً (تفعيل / تعطيل)
  togglePartnerStatus: async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const response = await api.patch(`/admin/partners/${id}`, {
      status: newStatus,
    });
    return response.data?.data || response.data;
  },

  // 6. حذف فرع/شريك
  deletePartner: async (id) => {
    const response = await api.delete(`/admin/partners/${id}`);
    return response.data;
  },
};

export default partnerService;

