import { useState } from 'react';

export default function CartItem({ item, onDelete, onUpdateQty }) {
    const [qty, setQty] = useState(item.qty || 1);
    const [weight, setWeight] = useState(item.weight || '1');

    const handleQtyChange = (delta) => {
        const newQty = qty + delta;
        if (newQty > 0) {
            setQty(newQty);
            if (onUpdateQty) onUpdateQty(item.id, newQty);
        }
    };

    return (
        <div className="bg-surface-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch md:items-center p-3 md:p-element-sm gap-3 md:gap-element-md group hover:shadow-md transition-shadow">
            {/* صورة المنتج */}
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
            </div>

            {/* تفاصيل المنتج وأدوات التحكم */}
            <div className="grow flex flex-col justify-between md:h-32 py-0 md:py-micro-xs gap-3 md:gap-0">
                {/* السطر الأول: العنوان وزر الحذف */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-base md:text-headline-md font-bold text-on-surface line-clamp-1">{item.title}</h3>
                        <p className="text-xs md:text-label-sm text-on-surface-variant mt-1 md:mt-micro-xs">الوزن: {item.weightLabel}</p>
                    </div>
                    {/* زر الحذف (يظهر دائمًا في الأعلى جهة اليسار/اليمين) */}
                    <button
                        onClick={() => onDelete(item.id)}
                        className="text-on-surface-variant hover:text-red-600 transition-colors p-1 shrink-0"
                        aria-label="حذف المنتج"
                    >
                        <span className="material-symbols-outlined text-xl md:text-2xl">delete</span>
                    </button>
                </div>

                {/* السطر الثاني: خيارات الوزن والكمية فقط */}
                <div className="flex items-center gap-3 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-outline-variant/10">
                    {/* اختيار الوزن */}
                    <div className="flex items-center gap-micro-md">
                        <label className="text-xs md:text-label-sm text-on-surface-variant">الوزن:</label>
                        <select
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="bg-background border-none rounded-lg text-xs md:text-label-sm px-micro-md py-1 focus:ring-2 focus:ring-accent-terracotta min-w-16 md:min-w-17.5"
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>

                    {/* أزرار اختيار الكمية */}
                    <div className="flex items-center gap-micro-md">
                        <label className="text-xs md:text-label-sm text-on-surface-variant">الكمية:</label>
                        <div className="flex items-center border-2 border-outline-variant/20 rounded-xl overflow-hidden bg-white">
                            <button
                                onClick={() => handleQtyChange(-1)}
                                className="px-2.5 md:px-3 py-1 hover:bg-surface-container transition-colors text-base md:text-lg font-bold"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                readOnly
                                value={qty}
                                className="w-8 md:w-10 text-center border-none focus:ring-0 bg-transparent font-bold text-sm md:text-base p-0"
                            />
                            <button
                                onClick={() => handleQtyChange(1)}
                                className="px-2.5 md:px-3 py-1 hover:bg-surface-container transition-colors text-base md:text-lg font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* السطر الثالث: السعر بمفرده في الأسفل */}
                <div className="flex justify-end items-center pt-1 md:pt-0">
                    <span className="text-base md:text-headline-md font-bold text-primary whitespace-nowrap">{item.price} ر.س</span>
                </div>
            </div>
        </div>
    );
}