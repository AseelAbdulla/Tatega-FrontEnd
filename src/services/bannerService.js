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
        const response = await api.post('/banners', formData);

        return response.data;
    },

    updateBanner: async (id, formData) => {
        formData.append('_method', 'PUT');

        const response = await api.post(
            `/banners/${id}`,
            formData
        );

        return response.data;
    },

    deleteBanner: async (id) => {
        const response = await api.delete(`/banners/${id}`);

        return response.data;
    },
};

export default bannerService;