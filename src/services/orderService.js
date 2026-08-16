import api from '../services/api';

export const orderService = {
    // ------------------ API Requests (Admin) ------------------ //

    // 1. جلب كل الطلبات للإدارة
    getAdminOrders: async () => {
        const response = await api.get('/admin/orders');
        return response.data?.data || response.data;
    },

    // 2. جلب تفاصيل طلب محدد
    getOrderDetails: async (orderId) => {
        const response = await api.get(`/admin/orders/${orderId}`);
        return response.data?.data || response.data;
    },

    // 3. إنشاء طلب جديد من الادمن
    createAdminOrder: async (data) => {
        const response = await api.post('/admin/orders', data);
        return response.data;
    },

    // 4. تعديل بيانات الطلب
    updateOrder: async (orderId, data) => {
        const response = await api.put(`/admin/orders/${orderId}`, data);
        return response.data;
    },

    // 5. تغيير حالة الطلب
    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
        return response.data;
    },

    // 6. حذف الطلب
    deleteOrder: async (orderId) => {
        const response = await api.delete(`/admin/orders/${orderId}`);
        return response.data;
    },

    // 7. جلب إحصائيات الداشبورد
    async getDashboardData() {
        try {
            const response = await api.get('/admin/dashboard/stats');
            return response.data.data || response.data;
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            throw error;
        }
    },

    // ------------------ Client Side Requests ------------------ //
    createOrder: async (formData) => {
        const response = await api.post('/orders', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    getMyOrders: async () => {
        const response = await api.get('/orders');
        return response.data?.data || response.data;
    },

    cancelOrder: async (orderId) => {
        const response = await api.patch(`/orders/${orderId}/cancel`);
        return response.data;
    },

    // ------------------ Helpers ------------------ //
    statusTranslations: {
        pending: 'قيد الانتظار',
        // processing: 'معالجة',
        accepted: 'قبول',
        shipped: 'شحن',
        delivered: 'تم التوصيل',
        completed: 'مكتمل',
        cancelled: 'ملغي',
        rejected: 'مرفوض',
    },

    getStatusLabel(status) {
        if (!status) return 'غير محدد';
        const key = String(status).toLowerCase();
        return this.statusTranslations[key] || status;
    },

    getStatusType(status) {
        const key = String(status).toLowerCase();
        const types = {
            pending: 'pending',
            processing: 'pending',
            shipped: 'info',
            delivered: 'success',
            completed: 'success',
            cancelled: 'danger',
            rejected: 'danger',
        };
        return types[key] || 'muted';
    },

    formatCurrency(amount) {
        const cleanAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
        return new Intl.NumberFormat('ar-YE', {
            maximumFractionDigits: 0
        }).format(cleanAmount) + ' ريال';
    }
};
