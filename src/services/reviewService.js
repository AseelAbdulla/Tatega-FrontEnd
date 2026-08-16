import api from './api';

export const reviewService = {
    getReviews: async () => {
        const response = await api.get('/reviews');
        return response.data?.data || [];
    },

    createReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data?.data || response.data;
    },
};