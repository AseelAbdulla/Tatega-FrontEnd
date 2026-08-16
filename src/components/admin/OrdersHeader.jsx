import React from 'react';
import { orderService } from '../../services/orderService';

export default function OrdersHeader({ activeTab, setActiveTab, orders = [], stats }) {

    const totalSales = stats?.stats?.total_sales
        ?? stats?.total_sales
        ?? 0;
    const activeClass = "flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-on-secondary-container bg-secondary-container shadow-sm flex items-center justify-center gap-1.5 text-xs";
    const inactiveClass = "flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-on-surface-variant hover:bg-surface-container flex items-center justify-center gap-1.5 text-xs";

    return (
        <div className="space-y-5">
            {/* عنوان + إحصائيات مصغرة */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                    <h2 className="text-lg font-bold text-on-surface">الطلبات وطلبات الاستيراد</h2>
                    <p className="text-xs text-on-surface-variant">إدارة المبيعات المحلية وطلبات الاستيراد</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl card-shadow border border-surface-container-high">
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                    <div>
                        <p className="text-[10px] text-on-surface-variant">إجمالي المبيعات</p>
                        <p className="text-sm font-bold text-secondary">
                            {orderService.formatCurrency(totalSales)}
                        </p>
                    </div>
                </div>
            </div>

            {/* تبويب مصغر */}
            <div className="bg-surface-container-low p-0.5 rounded-xl flex max-w-xs">
                <button
                    className={activeTab === 'local' ? activeClass : inactiveClass}
                    onClick={() => setActiveTab('local')}
                >
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    محلية
                </button>
                <button
                    className={activeTab === 'import' ? activeClass : inactiveClass}
                    onClick={() => setActiveTab('import')}
                >
                    <span className="material-symbols-outlined text-sm">public</span>
                    استيراد
                </button>
            </div>
        </div>
    );
}
