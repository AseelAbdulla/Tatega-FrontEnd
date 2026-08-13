import api from '../services/api';

export const cartService = {
    // جلب السلة الحالية
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data?.data || response.data;
    },

    // إضافة عنصر للسلة
    addItem: async (productId, unitId, quantity = 1) => {
        const response = await api.post('/cart/items', {
            product_id: productId,
            unit_id: unitId,
            quantity: quantity
        });
        return response.data?.data || response.data;
    },

    // تحديث كمية عنصر بناءً على CartDetail ID
    updateQuantity: async (itemId, quantity) => {
        const response = await api.put(`/cart/items/${itemId}`, {
            quantity: quantity
        });
        return response.data?.data || response.data;
    },

    // حذف عنصر من السلة
    removeItem: async (itemId) => {
        const response = await api.delete(`/cart/items/${itemId}`);
        return response.data;
    },

    // تفريغ السلة بالكامل
    clearCart: async () => {
        const response = await api.delete('/cart/clear');
        return response.data;
    }
};

