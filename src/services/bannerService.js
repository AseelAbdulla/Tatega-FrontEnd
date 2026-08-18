// src/services/bannerService.js

import api from './api';

const bannerService = {
    getBanners: async () => {
        const response = await api.get('/banners');
        return response.data;
    },

    getBanner: async (id) => {
        const response = await api.get(`/banners/${id}`);
        return response.data;
    },

    createBanner: async (formData) => {
        const response = await api.post('/banners', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    updateBanner: async (id, formData) => {
        // التأكد من عدم تكرار إضافة _method إذا كانت موجودة مسبقاً
        if (!formData.has('_method')) {
            formData.append('_method', 'PUT');
        }

        const response = await api.post(`/banners/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    deleteBanner: async (id) => {
        const response = await api.delete(`/banners/${id}`);

        return response.data;
    },
};

export default bannerService;