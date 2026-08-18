import api from './api';

const featureService = {
    getFeatures: async () => {
        const response = await api.get('/features');
        return response.data;
    },

    getFeature: async (id) => {
        const response = await api.get(`/features/${id}`);
        return response.data;
    },

    createFeature: async (data) => {
        const response = await api.post('/features', data);
        return response.data;
    },

    updateFeature: async (id, data) => {
        const response = await api.put(`/features/${id}`, data);
        return response.data;
    },

    deleteFeature: async (id) => {
        const response = await api.delete(`/features/${id}`);
        return response.data;
    },
};

export default featureService;