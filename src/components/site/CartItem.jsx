
import { Link } from 'react-router-dom';
export default function CartItem({ item, onDelete, onUpdateQty, isUpdating, onClearCart }) {
    // معالجة مسار الصورة المرتجع من CartDetailResource
    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.png';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
        const cleanBaseURL = baseURL.replace('/api', '');
        return `${cleanBaseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    return (
        <>
            <div className={`bg-surface-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch md:items-center p-3 md:p-element-sm gap-3 md:gap-element-md group hover:shadow-md transition-all ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0 bg-surface-container flex items-center justify-center">
                    <img
                        className="w-full h-full object-cover"
                        src={getImageUrl(item.image)}
                        alt={item.product?.name}
                    />
                </div>

                <div className="grow flex flex-col justify-between md:h-32 py-0 md:py-micro-xs gap-3 md:gap-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-base md:text-headline-md font-bold text-on-surface line-clamp-1">
                                {item.product?.name}
                            </h3>
                            <p className="text-xs md:text-label-sm text-on-surface-variant mt-1 md:mt-micro-xs">
                                الوحدة: {item.unit?.name}
                            </p>
                        </div>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="text-on-surface-variant hover:text-red-600 transition-colors p-1 shrink-0"
                            aria-label="حذف المنتج"
                            title="حذف"
                        >
                            <span className="material-symbols-outlined text-xl md:text-2xl">delete</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/10">
                        <div className="flex items-center gap-micro-md">
                            <label className="text-xs md:text-label-sm text-on-surface-variant">الكمية:</label>
                            <div className="flex items-center border-2 border-outline-variant/20 rounded-xl overflow-hidden bg-white">
                                <button
                                    onClick={() => onUpdateQty(item.id, item.quantity, -1)}
                                    className="px-2.5 md:px-3 py-1 hover:bg-surface-container transition-colors text-base md:text-lg font-bold disabled:opacity-30"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    readOnly
                                    value={item.quantity}
                                    className="w-8 md:w-10 text-center border-none focus:ring-0 bg-transparent font-bold text-sm md:text-base p-0"
                                />
                                <button
                                    onClick={() => onUpdateQty(item.id, item.quantity, 1)}
                                    className="px-2.5 md:px-3 py-1 hover:bg-surface-container transition-colors text-base md:text-lg font-bold"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 md:pt-0">
                        <span className="text-xs text-gray-400">سعر الوحدة: {item.price} ر.س</span>
                        <span className="text-base md:text-headline-md font-bold text-primary whitespace-nowrap">
                            إجمالي: {item.subtotal} ر.س
                        </span>
                    </div>
                </div>
            </div>
            <div className={`bg-surface-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch md:items-center p-3 md:p-element-sm gap-3 md:gap-element-md group hover:shadow-md transition-all ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>

                {/* يظهر الزر فقط في حال وجود عناصر في السلة */}
                {onClearCart && (
                    <button
                        onClick={onClearCart}
                        className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">delete_sweep</span>
                        <span>تفريغ السلة</span>
                    </button>
                )}

                <Link to="/products" className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-white bg-brand-orange hover:bg-orange-400 px-3 py-2 rounded-xl transition-colors">
                    <span>تحديث السله</span>
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>

            </div>
        </>
    );
}
