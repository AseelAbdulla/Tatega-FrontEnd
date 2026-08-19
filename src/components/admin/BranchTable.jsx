
import React from 'react';

export default function BranchTable({ branches = [], onView, onEdit, onDelete, onToggleStatus }) {
    
    // تحويل حالة الباك أند (active/inactive) لستايل التصميم
    const getStatusBadge = (status) => {
        const isActive = status === 'active' || status === 'نشط';
        
        return {
            label: isActive ? 'نشط' : 'غير نشط',
            style: isActive 
                ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed' 
                : 'bg-error-container text-on-error-container border-error-container'
        };
    };

    return (
        <div className="bg-white rounded-xl card-shadow border border-surface-container-high overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                    <thead>
                        <tr className="bg-surface-container-low border-b border-surface-container-high">
                            <th className="px-3 py-2 text-[10px] font-bold text-secondary">#</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-secondary">الشعار</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-secondary">اسم الفرع</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-secondary hidden sm:table-cell">الإحداثيات / الموقع</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-secondary hidden md:table-cell">الحالة</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-secondary hidden lg:table-cell">الترتيب</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-secondary text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high">
                        {branches.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-on-surface-variant font-bold text-xs">
                                    لا توجد نقاط بيع مسجلة حالياً
                                </td>
                            </tr>
                        ) : (
                            branches.map((branch, index) => {
                                const statusInfo = getStatusBadge(branch.status);
                                
                                // معالجة الاسم سواء كان كائن مترجم أو نص عادي
                                const branchName = typeof branch.name === 'object' 
                                    ? (branch.name?.ar || branch.name?.en) 
                                    : branch.name;

                                // رابط الشعار القادم من Laravel Storage
                                const logoUrl = branch.logo ? (branch.logo.startsWith('http') ? branch.logo : '/storage/${branch.logo}') : (branch.logo_url || null);

                                return (
                                    <tr key={branch.id} className="row-hover">
                                        <td className="px-3 py-2.5 font-bold text-on-surface">{index + 1}</td>
                                        
                                        {/* عرض الشعار */}
                                        <td className="px-3 py-2.5">
                                            {logoUrl ? (
                                                <img 
                                                    src={logoUrl} 
                                                    alt={branchName} 
                                                    className="w-7 h-7 rounded-full object-cover border border-surface-container-high" 
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {branchName ? branchName.charAt(0) : 'P'}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-3 py-2.5 font-bold text-on-surface">
                                            {branchName}
                                            {branch.slogan && <span className="block text-[9px] font-normal text-gray-400">{branch.slogan}</span>}
                                        </td>

                                        {/* الإحداثيات */}
                                        <td className="px-3 py-2.5 text-on-surface-variant hidden sm:table-cell font-mono text-[12px]">
                                            {branch.lat && branch.lng ? `${branch.lat}, ${branch.lng}` : (branch.location || 'غير محدد')}
                                        </td>

                                        {/* تغيير الحالة بالنقر المباشر */}
                                        <td className="px-3 py-2.5 hidden md:table-cell">
                                            <button 
                                                type="button"
                                                onClick={() => onToggleStatus && onToggleStatus(branch.id)}
                                                className={`px-2 py-0.5 text-[9px] rounded-full border transition hover:opacity-80 cursor-pointer ${statusInfo.style}`}
                                                title="انقر لتغيير الحالة"
                                            >
                                                {statusInfo.label}
                                            </button>
                                        </td>

                                        <td className="px-3 py-2.5 hidden lg:table-cell font-bold text-secondary">
                                            {branch.sort_order ?? 0}
                                        </td>

                                        {/* الإجراءات */}
                                        <td className="px-3 py-2.5">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button onClick={() => onView(branch)} className="p-1 hover:bg-surface-container rounded-full transition" title="عرض التفاصيل والخريطة">
                                                    <span className="material-symbols-outlined text-sm text-primary">visibility</span>
                                                </button>
                                                <button onClick={() => onEdit(branch)} className="p-1 hover:bg-surface-container rounded-full transition" title="تعديل">
                                                    <span className="material-symbols-outlined text-sm text-secondary">edit</span>
                                                </button>
                                                <button onClick={() => onDelete(branch.id)} className="p-1 hover:bg-surface-container rounded-full transition" title="حذف">
                                                    <span className="material-symbols-outlined text-sm text-error">delete</span>
                                                </button>
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
    );
}
