
import { useState } from 'react';
import CartItem from '../../components/site/CartItem';
import OrderSummary from '../../components/site/OrderSummary';

const initialCartItems = [
    {
        id: 1,
        title: "زعفران محلي فاخر",
        weightLabel: "5 جرام",
        price: 250,
        qty: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBs3v6S0GAXzDwVLKwb6XLYoNwhTO3q_9erQrCrrWFrBTYxJDbC5eXRy3NrOFWy9uAJztOyh7oS71RwjlZncFIYiHLnMGbTucrmrqHiPFYHpNHMt_GSSaxbgD1L8E6R76A5gwJED8wMLXYkQMDuIUNy7FshsW13g3UbUTn0u1wGD-0pUDbPXVP3Plj0hphCUTXLIDIVMjzXy4yx4KEzrXtdX3Nb8v9BH-XFASu_ZLVU0M5eGLio-BYB"
    },
    {
        id: 2,
        title: "ثمار مجففة عضوية",
        weightLabel: "500 جرام",
        price: 170,
        qty: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9Got2q7slNNDa4ZgKHXdMszGJvr-ZhxxC2z-0kTQV-jVd7KP84ffXWC4v66E0z9O8b-6uM5GoChvh0oGNzLlIWTA8xCw1lWs0k1YB2ivu2IGV_Kt9S6c-kJ4MBOXCfX4OBAhfpghzkj96TEUw9EX2SAQ9P10G-Zq65WLmAGLbDNMpPS68DtVYzYTm37wyjb4pLnD2V0OLMnPsgcu7eNjZh2WHIk8ZzwjJL2P67Yr0TwvC71mqBtzK"
    },
    {
        id: 3,
        title: "مجموعة بهارات نجد",
        weightLabel: "250 جرام",
        price: 45,
        qty: 1,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzDkahbWy2T9yfeNlPbBEnkKLNQk8Ro975do-nWFeBFzBZJ6liR0Z2CYzrRYAbbSKBz_kS5VOQBhjOZlMCLR2_6wshwk9-BoYkRwpxelpz4GQZl3wFU60hC4IPgFxMBpTO-BlHgaUfTgDbCnOnQh-rxtxkSR-U57sCEfKjRjb5HZyxeIOM6rgAs4KhXVLfoRxiAONi3OtSGb0UppvnEnFatO0K4jJw-4fpDpWFyb2xEx43uNo3yG2r"
    }
];

export default function Cart() {
    const [items, setItems] = useState(initialCartItems);

    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="pt-8 pb-section-lg px-4 md:px-element-lg max-w-7xl mx-auto w-full">
            {/* العناوين والعدد */}
            <div className="mb-element-lg mt-micro-md text-center md:text-right">
                <h1 className="text-headline-hero font-bold text-on-surface mb-micro-xs">سلة التسوق</h1>
                <p className="text-body-md text-on-surface-variant">
                    لديك ({items.length}) منتجات في السلة
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-element-lg items-start">
                {/* قائمة المنتجات */}
                <div className="lg:col-span-8 space-y-element-md">
                    {items.length > 0 ? (
                        items.map(item => (
                            <CartItem key={item.id} item={item} onDelete={handleDelete} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-section-lg text-center bg-surface-white rounded-xl shadow-sm">
                            <span className="material-symbols-outlined text-outline-variant text-7xl mb-element-md">shopping_basket</span>
                            <h2 className="text-headline-lg font-bold mb-micro-md">السلة فارغة</h2>
                            <a href="/products" className="text-accent-terracotta font-bold hover:underline">العودة للتسوق</a>
                        </div>
                    )}
                </div>

                {/* الشريط الجانبي للطلب والدفع */}
                <OrderSummary />
            </div>
        </div>
    );
}
