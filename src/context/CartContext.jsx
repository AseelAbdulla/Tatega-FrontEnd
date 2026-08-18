import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);
    const [cartDetails, setCartDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1️⃣ جلب إجمالي عدد القطع في السلة
    const fetchCartCount = async () => {
        try {
            const response = await api.get(`/cart/count`);

            if (response.status === 204 || !response.data) {
                setCartCount(0);
            } else {
                setCartCount(Number(response.data.cart_count) || 0);
            }
        } catch (error) {
            console.error("خطأ في جلب عدد عناصر السلة:", error);
            setCartCount(0);
        }
    };

    // 2️⃣ جلب تفاصيل السلة الكاملة (لصفحة السلة)
    const fetchCartDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cart');
            setCartDetails(response.data?.data?.details || response.data?.details || []);
        } catch (error) {
            console.error("خطأ في جلب بيانات السلة:", error);
        } finally {
            setLoading(false);
        }
    };

    // 3️⃣ إضافة منتج للسلة (يتطلب unit_id و product_id و quantity بناءً على CartService)
    const addToCart = async (productId, unitId, quantity = 1) => {
        try {
            setLoading(true);
            await api.post('/cart/items', {
                product_id: productId,
                unit_id: unitId,
                quantity: quantity
            });

            // تحديث العداد والتفاصيل فور النجاح
            await fetchCartCount();
        } catch (error) {
            console.error("خطأ في إضافة المنتج للسلة:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // جلب العداد فور تحميل التطبيق (طالما يوجد توكن)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCartCount();
        }
    }, []);

    return (
        <CartContext.Provider 
            value={{ 
                cartCount, 
                cartDetails, 
                fetchCartCount, 
                fetchCartDetails, 
                addToCart, 
                loading 
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Hook للاستخدام المباشر
export const useCart = () => useContext(CartContext);
export default CartContext;
