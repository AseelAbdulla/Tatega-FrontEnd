
import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import CartItem from '../../components/site/CartItem';
import OrderSummary from '../../components/site/OrderSummary';
import { cartService } from '../../services/cartService';

export default function Cart() {
    const { lang } = useLanguage();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await cartService.getCart();
            setCart(data);
            setError(null);
        } catch (err) {
            console.error("خطأ جلب السلة:", err);
            if (err.response?.status === 401) {
                setError("يرجى تسجيل الدخول لعرض سلة التسوق.");
            } else if (err.response?.status === 403) {
                setError("ليس لديك الصلاحية للوصول للسلة.");
            } else {
                setError(err.response?.data?.message || "تعذر جلب بيانات السلة.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [lang]);

    // دالة التعامل مع تفريغ السلة
    const handleClearCart = async () => {
        if (!window.confirm("هل أنت متأكد من رغبتك في تفريغ السلة بالكامل؟")) {
            return;
        }

        try {
            await cartService.clearCart();
            // إعادة تحديث بيانات السلة
            fetchCart();
        } catch (err) {
            console.error("خطأ في تفريغ السلة:", err);
            alert("حدث خطأ أثناء تفريغ السلة.");
        }
    };

    const handleUpdateQty = async (itemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;

        try {
            setUpdatingId(itemId);
            const updatedCart = await cartService.updateQuantity(itemId, newQty);
            setCart(updatedCart);
        } catch (err) {
            alert(err.response?.data?.message || "فشل تحديث الكمية (قد تكون تجاوزت المخزون المتاح).");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا المنتج من السلة؟")) return;

        try {
            setUpdatingId(itemId);
            await cartService.removeItem(itemId);
            await fetchCart();
        } catch (err) {
            alert(err.response?.data?.message || "فشل حذف المنتج من السلة.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center text-primary font-bold">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                جاري تحميل السلة...
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto my-12 p-6 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-2xl text-center">
                <p className="font-bold mb-2">{error}</p>
                <a href="/login" className="text-sm font-bold text-accent-terracotta underline">
                    الانتقال لصفحة تسجيل الدخول
                </a>
            </div>
        );
    }

    const items = cart?.items || [];

    return (
        <div className="pt-8 pb-section-lg px-4 md:px-element-lg max-w-7xl mx-auto w-full" dir="rtl">
            <div className="mb-element-lg mt-micro-md text-center md:text-right">
                <h1 className="text-headline-hero font-bold text-on-surface mb-micro-xs">سلة التسوق</h1>
                <p className="text-body-md text-on-surface-variant">
                    لديك ({cart?.items_count || 0}) منتجات في السلة
                </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-element-lg items-start">
                <div className="lg:col-span-8 space-y-element-md">
                    {items.length > 0 ? (
                        items.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onDelete={handleDelete}
                                onUpdateQty={handleUpdateQty}
                                isUpdating={updatingId === item.id}
                                cartItems={cart?.items}
                                onClearCart={handleClearCart}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-section-lg text-center bg-surface-white rounded-xl shadow-sm">
                            <span className="material-symbols-outlined text-outline-variant text-7xl mb-element-md">shopping_basket</span>
                            <h2 className="text-headline-lg font-bold mb-micro-md">السلة فارغة</h2>
                            <a href="/products" className="text-accent-terracotta font-bold hover:underline">العودة للتسوق</a>
                        </div>
                    )}
                </div>

                <OrderSummary
                    user={cart?.user}
                    totalQuantity={cart?.total_quantity || 0}
                    subtotal={cart?.subtotal || 0}
                    shippingFee={cart?.shipping_fee || 0}
                    grandTotal={cart?.grand_total || 0}
                    itemsCount={cart?.items_count || 0}
                />
            </div>
        </div>
    );
}
