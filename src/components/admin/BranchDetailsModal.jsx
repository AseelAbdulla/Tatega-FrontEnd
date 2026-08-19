import React from 'react';

export default function BranchDetailsModal({ isOpen, onClose, branch }) {
    if (!isOpen || !branch) return null;

    // 1. معالجة اسم الفرع المترجم
    const branchName = typeof branch.name === 'object'
        ? (branch.name?.ar || branch.name?.en || 'غير مسمى')
        : (branch.name || 'غير مسمى');

    // 2. معالجة رابط الشعار
    const logoUrl = branch.logo ? (branch.logo.startsWith('http') ? branch.logo : '/storage/${branch.logo}') : (branch.logo_url || null);

    // 3. معالجة الحالة
    const isActive = branch.status === 'active' || branch.status === 'نشط';

    // 4. رابط خرائط جوجل إذا توفرت الإحداثيات
    const googleMapsUrl = (branch.lat && branch.lng)
        ? `https://www.google.com/maps?q=${branch.lat},${branch.lng}`
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
            {/* خلفية معتمة */}
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl modal-content border border-surface-container-high z-10">
                {/* الهيدر */}
                <div className="flex justify-between items-center border-b border-surface-container-high pb-3">
                    <div className="flex items-center gap-2">
                        {logoUrl ? (
                            <img src={logoUrl} alt={branchName} className="w-8 h-8 rounded-full object-cover border" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-xs font-bold text-primary">
                                {branchName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-bold text-on-surface">{branchName}</h3>
                            {branch.slogan && <p className="text-[10px] text-gray-400">{branch.slogan}</p>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full transition">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm">close</span>
                    </button>
                </div>

                {/* جسم التفاصيل */}
                <div className="mt-4 text-xs space-y-3">
                    <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-3 rounded-xl">
                        <div>
                            <span className="text-on-surface-variant block text-[10px]">الحالة:</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-block mt-0.5 ${isActive ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-error-container text-on-error-container'
                                }`}>
                                {isActive ? 'نشط' : 'غير نشط'}
                            </span>
                        </div>

                        <div>
                            <span className="text-on-surface-variant block text-[10px]">ترتيب العرض:</span>
                            <span className="font-bold text-on-surface">{branch.sort_order ?? 0}</span>
                        </div>

                        <div className="col-span-2">
                            <span className="text-on-surface-variant block text-[10px]">الموقع / الإحداثيات:</span>
                            {googleMapsUrl ? (
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary font-bold hover:underline flex items-center gap-1 mt-0.5"
                                >
                                    <span className="material-symbols-outlined text-xs">location_on</span>
                                    {branch.lat}, {branch.lng} (عرض على الخريطة)
                                </a>
                            ) : (
                                <span className="font-bold text-on-surface">{branch.location || 'غير محدد'}</span>
                            )}
                        </div>

                        {branch.website_url && (
                            <div className="col-span-2 border-t border-surface-container-high pt-2">
                                <span className="text-on-surface-variant block text-[10px]">الموقع الإلكتروني:</span>
                                <a
                                    href={branch.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-secondary font-bold hover:underline block truncate mt-0.5"
                                >
                                    {branch.website_url}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* إذا أردت عرض قائمة منتجات مرتبطة مستقبلاً */}
                    {branch.products && branch.products.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-secondary mb-1">المنتجات المرتبطة:</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar border p-2 rounded-lg">
                                {branch.products.map(p => (
                                    <div key={p.id} className="flex justify-between text-[10px] border-b border-dashed border-outline-variant py-1 last:border-0">
                                        <span>{typeof p.name === 'object' ? p.name?.ar : p.name}</span>
                                        <span className="font-bold">{p.price} ر.س</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* الفوتر */}
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-container transition">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
}
