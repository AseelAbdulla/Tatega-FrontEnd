
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function BottomNavBar() {
    const { cartCount } = useCart();

    return (
        <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-2 h-16 bg-background shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden border-t border-outline-variant/20">
            <Link to="/" className="flex flex-col items-center justify-center text-primary p-2 flex-1">
                <span className="material-symbols-outlined">home</span>
                <span className="text-[10px] font-bold mt-1">الرئيسية</span>
            </Link>
            <a href="#best-sellers" className="flex flex-col items-center justify-center text-on-surface-variant p-2 flex-1">
                <span className="material-symbols-outlined">storefront</span>
                <span className="text-[10px] font-bold mt-1">المتجر</span>
            </a>
            <Link to="/cart" className="flex flex-col items-center justify-center text-on-surface-variant p-2 flex-1 relative">
                <span className="material-symbols-outlined">shopping_cart</span>
                {cartCount > 0 && (
                    <span className="absolute top-1.5 right-1/1.5 translate-x-3 bg-accent-terracotta text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount > 99 ? '99+' : cartCount}
                    </span>
                )}
                <span className="text-[10px] font-bold mt-1">السلة</span>
            </Link>
            <Link to="/login" className="flex flex-col items-center justify-center text-on-surface-variant p-2 flex-1">
                <span className="material-symbols-outlined">person</span>
                <span className="text-[10px] font-bold mt-1">حسابي</span>
            </Link>
        </nav>
    );
}
