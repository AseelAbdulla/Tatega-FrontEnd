import api from '../services/api';

export const orderTrackerService = {
    /**
     * جلب بيانات تتبع طلب محدد بناءً على رقم الطلب (Order ID أو Order Number)
     * @param {number|string} orderId 
     */
    trackOrder: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data?.data || response.data;
    },

    /**
     * جلب تاريخ تحديثات حالات الطلب (Order Timeline / Status History)
     * إذا كان لديك مسار خاص في الباك إند يجلب السجل التاريخي لتغيرات حالة الطلب
     * @param {number|string} orderId 
     */
    getOrderHistory: async (orderId) => {
        const response = await api.get(`/orders/${orderId}/history`);
        return response.data?.data || response.data;
    },

    /**
     * إلغاء الطلب من قبل العميل إذا كان يمر بمرحلة القبول/الانتظار (pending)
     * @param {number|string} orderId 
     */
    cancelOrder: async (orderId) => {
        const response = await api.patch(`/orders/${orderId}/cancel`);
        return response.data;
    }
};

export default orderTrackerService;

