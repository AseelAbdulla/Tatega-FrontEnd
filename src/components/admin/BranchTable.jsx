import React from 'react';

export default function BranchTable({ branches = [], onView, onEdit, onDelete, onToggleStatus }) {
    
    // تحويل حالة الباك أند (active/inactive) لستايل التصميم الخاص بمشروع تعتيقة
    const getStatusBadge = (status) => {
        const isActive = status === 'active' || status === 'نشط' || status === true || status === 1;
        
        return {
            label: isActive ? 'نشط' : 'غير نشط',
            style: isActive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
        };
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden font-tajawal">
            <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                    <thead>
                        <tr className="bg-[#F5E6D2]/40 border-b border-gray-200">
                            <th className="px-4 py-3 text-[11px] font-bold text-[#24572b]">#</th>
                            <th className="px-4 py-3 text-[11px] font-bold text-[#24572b]">الشعار</th>
                            <th className="px-4 py-3 text-[11px] font-bold text-[#24572b]">اسم الفرع / النقطة</th>
                            <th className="px-4 py-3 text-[11px] font-bold text-[#24572b] hidden sm:table-cell">الإحداثيات / الموقع</th>
                            <th className="px-4 py-3 text-[11px] font-bold text-[#24572b] hidden md:table-cell">الحالة</th>
                            <th className="px-4 py-3 text-[11px] font-bold text-[#24572b] hidden lg:table-cell">الترتيب</th>
                            <th className="px-4 py-3 text-[11px] font-bold text-[#24572b] text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {branches.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-gray-500 font-medium text-xs">
                                    لا توجد نقاط بيع أو فروع مسجلة حالياً
                                </td>
                            </tr>
                        ) : (
                            branches.map((branch, index) => {
                                const statusInfo = getStatusBadge(branch.status);
                                
                                // معالجة الاسم سواء كان كائن مترجم (Multi-language) أو نص عادي
                                const branchName = typeof branch.name === 'object' 
                                    ? (branch.name?.ar || branch.name?.en || '') 
                                    : branch.name;

                                // تصحيح رابط الشعار القادم من Laravel Storage
                                const logoUrl = branch.logo 
                                    ? (branch.logo.startsWith('http') ? branch.logo : `/storage/${branch.logo}`) 
                                    : (branch.logo_url || null);

                                return (
                                    <tr key={branch.id || index} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-600">{index + 1}</td>
                                        
                                        {/* عرض الشعار */}
                                        <td className="px-4 py-3">
                                            {logoUrl ? (
                                                <img 
                                                    src={logoUrl} 
                                                    alt={branchName} 
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm" 
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#24572b]/10 border border-[#24572b]/20 flex items-center justify-center text-xs font-bold text-[#24572b]">
                                                    {branchName ? branchName.charAt(0) : 'P'}
                                                </div>
                                            )}
                                        </td>

                                        {/* الاسم والشعار اللفظي */}
                                        <td className="px-4 py-3">
                                            <span className="font-bold text-gray-800 block text-xs">{branchName}</span>
                                            {branch.slogan && <span className="block text-[10px] font-normal text-gray-400 mt-0.5">{branch.slogan}</span>}
                                        </td>

                                        {/* الإحداثيات */}
                                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell font-mono text-[11px]">
                                            {branch.lat && branch.lng ? (
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                                    {branch.lat}, {branch.lng}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 font-sans">{branch.location || 'غير محدد'}</span>
                                            )}
                                        </td>

                                        {/* تغيير الحالة بالنقر المباشر */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <button 
                                                type="button"
                                                onClick={() => onToggleStatus && onToggleStatus(branch.id)}
                                                className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border transition cursor-pointer ${statusInfo.style}`}
                                                title="انقر لتغيير الحالة"
                                            >
                                                {statusInfo.label}
                                            </button>
                                        </td>

                                        {/* الترتيب */}
                                        <td className="px-4 py-3 hidden lg:table-cell font-bold text-gray-600">
                                            {branch.sort_order ?? 0}
                                        </td>

                                        {/* الإجراءات */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button 
                                                    onClick={() => onView && onView(branch)} 
                                                    className="p-1.5 hover:bg-[#24572b]/10 text-[#24572b] rounded-lg transition" 
                                                    title="عرض التفاصيل والخريطة"
                                                >
                                                    <span className="material-symbols-outlined text-base block">visibility</span>
                                                </button>
                                                <button 
                                                    onClick={() => onEdit && onEdit(branch)} 
                                                    className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-lg transition" 
                                                    title="تعديل"
                                                >
                                                    <span className="material-symbols-outlined text-base block">edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => onDelete && onDelete(branch.id)} 
                                                    className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition" 
                                                    title="حذف"
                                                >
                                                    <span className="material-symbols-outlined text-base block">delete</span>
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

