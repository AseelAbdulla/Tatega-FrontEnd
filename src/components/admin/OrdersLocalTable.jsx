
import React, { useState } from 'react';
import { orderService } from '../../services/orderService';

export default function OrdersLocalTable({ orders = [], loading, onOpenAdd, onViewDetails, onOpenEdit, onOpenDelete, onChangeStatus }) {
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleStatusMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    // الحالات المتوفرة للتغيير (بالقيم التي يفهمها الباك إند)
    const statusOptions = [
        { key: 'processing', label: 'معالجة' },
        { key: 'shipped', label: 'شحن' },
        { key: 'delivered', label: 'تم التوصيل' },
        { key: 'cancelled', label: 'ملغي' }
    ];

    const getStatusBadge = (status) => {
        const type = orderService.getStatusType(status);
        const label = orderService.getStatusLabel(status);

        const colors = {
            pending: 'bg-amber-100 text-amber-800',
            info: 'bg-blue-100 text-blue-800',
            success: 'bg-green-100 text-green-800',
            danger: 'bg-red-100 text-red-800',
            muted: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${colors[type] || colors.muted}`}>
                {label}
            </span>
        );
    };

    if (loading) {
        return <div className="p-8 text-center text-xs text-gray-500 bg-white rounded-xl">جاري تحميل جدول الطلبات...</div>;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-secondary">الطلبات المحلية</h3>
                {/* <button onClick={onOpenAdd} className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 hover:opacity-90 transition">
                    <span className="material-symbols-outlined text-sm">add</span>
                    إضافة طلب
                </button> */}
            </div>

            <div className="bg-white rounded-xl card-shadow border border-surface-container-high overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-surface-container-high">
                                <th className="px-3 py-2 text-[10px] font-bold text-secondary">#</th>
                                <th className="px-3 py-2 text-[10px] font-bold text-secondary">العميل</th>
                                <th className="px-3 py-2 text-[10px] font-bold text-secondary hidden sm:table-cell">التاريخ</th>
                                <th className="px-3 py-2 text-[10px] font-bold text-secondary">المجموع</th>
                                <th className="px-3 py-2 text-[10px] font-bold text-secondary hidden md:table-cell">الحالة</th>
                                <th className="px-3 py-2 text-[10px] font-bold text-secondary text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-xs text-gray-500">لا توجد طلبات مسجلة حالياً</td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const id = order.id;
                                    const displayId = order.order_number || `#${order.id}`;
                                    const customerName = order.customer_name || order.customer?.name || order.customer || 'عميل';
                                    const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString('ar-YE') : (order.date || '-');
                                    const amount = order.pricing?.total ?? order.total_amount ?? order.total ?? 0;

                                    return (
                                        <tr key={id} className="order-row-hover">
                                            <td className="px-3 py-2.5 font-bold text-on-surface text-xs">{displayId}</td>
                                            <td className="px-3 py-2.5 text-on-surface">{customerName}</td>
                                            <td className="px-3 py-2.5 text-on-surface-variant text-xs hidden sm:table-cell">{dateStr}</td>
                                            <td className="px-3 py-2.5 font-bold text-secondary">
                                                {orderService.formatCurrency(amount)}
                                            </td>
                                            <td className="px-3 py-2.5 hidden md:table-cell">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center justify-center gap-1.5 relative">
                                                    <button onClick={() => onViewDetails(order)} className="p-1 hover:bg-surface-container rounded-full transition" title="تفاصيل">
                                                        <span className="material-symbols-outlined text-sm text-primary">visibility</span>
                                                    </button>
                                                    <button onClick={() => onOpenEdit(order)} className="p-1 hover:bg-surface-container rounded-full transition" title="تعديل">
                                                        <span className="material-symbols-outlined text-sm text-secondary">edit</span>
                                                    </button>
                                                    <button onClick={() => onOpenDelete(order)} className="p-1 hover:bg-surface-container rounded-full transition" title="حذف">
                                                        <span className="material-symbols-outlined text-sm text-error">delete</span>
                                                    </button>

                                                    <button onClick={() => toggleStatusMenu(id)} className="p-1 hover:bg-surface-container rounded-full transition" title="تغيير الحالة">
                                                        <span className="material-symbols-outlined text-sm text-primary">swap_horiz</span>
                                                    </button>

                                                    {openMenuId === id && (
                                                        <div className="absolute top-8 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-28 text-right">
                                                            {statusOptions.map((st) => (
                                                                <button
                                                                    key={st.key}
                                                                    onClick={() => {
                                                                        onChangeStatus(id, st.key);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 block text-right"
                                                                >
                                                                    {st.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
