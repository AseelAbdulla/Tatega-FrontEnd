import api from '../services/api';

export const orderService = {
    // إنشاء الطلب من السلة (دعم FormData للصور)
    createOrder: async (formData) => {
        const response = await api.post('/orders', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // جلب طلبات العميل
    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data?.data || response.data;
    },

    // إلغاء طلب
    cancelOrder: async (orderId) => {
        const response = await api.patch(`/orders/${orderId}/cancel`);
        return response.data;
    }
};
