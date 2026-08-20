import React from 'react';

export default function BranchDetailsModal({ isOpen, onClose, branch }) {
    if (!isOpen || !branch) return null;

    // 1. معالجة اسم الفرع المترجم
    const branchName = typeof branch.name === 'object'
        ? (branch.name?.ar || branch.name?.en || 'غير مسمى')
        : (branch.name || 'غير مسمى');

    // 2. معالجة رابط الشعار (تم إصلاح الـ String Interpolation)
    const logoUrl = branch.logo 
        ? (branch.logo.startsWith('http') ? branch.logo : `/storage/${branch.logo}`) 
        : (branch.logo_url || null);

    // 3. معالجة الحالة
    const isActive = branch.status === 'active' || branch.status === 'نشط';

    // 4. رابط خرائط جوجل إذا توفرت الإحداثيات
    const googleMapsUrl = (branch.lat && branch.lng)
        ? `https://www.google.com/maps?q=${branch.lat},${branch.lng}`
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
                onClick={onClose} 
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-surface-container-high z-10 max-h-[90vh] overflow-y-auto dir-rtl text-right transition-all">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-surface-container-high pb-3 mb-4">
                    <div className="flex items-center gap-3">
                        {logoUrl ? (
                            <img 
                                src={logoUrl} 
                                alt={branchName} 
                                className="w-10 h-10 rounded-xl object-cover border border-outline-variant/60 shadow-xs" 
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-sm font-bold text-primary border border-outline-variant/40">
                                {branchName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                                {branchName}
                            </h3>
                            {branch.slogan && (
                                <p className="text-xs text-on-surface-variant/80">{branch.slogan}</p>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-on-surface transition"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {/* Body Content */}
                <div className="space-y-4 text-xs">
                    
                    {/* Info Card Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-container-low/60 p-3.5 rounded-xl border border-outline-variant/40">
                        <div>
                            <span className="text-secondary font-semibold block text-[11px] mb-1">الحالة:</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                isActive 
                                    ? 'bg-secondary-fixed/20 text-secondary' 
                                    : 'bg-error-container/40 text-on-error-container'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-secondary' : 'bg-error'}`} />
                                {isActive ? 'نشط' : 'غير نشط'}
                            </span>
                        </div>

                        <div>
                            <span className="text-secondary font-semibold block text-[11px] mb-1">ترتيب العرض:</span>
                            <span className="font-bold text-on-surface bg-white px-2 py-0.5 rounded-md border border-outline-variant/40 inline-block">
                                {branch.sort_order ?? 0}
                            </span>
                        </div>

                        <div className="col-span-1 sm:col-span-2 pt-1 border-t border-outline-variant/30">
                            <span className="text-secondary font-semibold block text-[11px] mb-1">الموقع / الإحداثيات:</span>
                            {googleMapsUrl ? (
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary font-bold hover:underline inline-flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-outline-variant/50 text-xs transition hover:bg-surface-container-lowest shadow-xs"
                                >
                                    <span className="material-symbols-outlined text-sm text-terracotta">pin_drop</span>
                                    <span>{branch.lat}, {branch.lng}</span>
                                    <span className="text-[10px] text-on-surface-variant font-normal">(عرض على الخريطة)</span>
                                </a>
                            ) : (
                                <span className="font-bold text-on-surface">{branch.location || 'غير محدد'}</span>
                            )}
                        </div>

                        {branch.website_url && (
                            <div className="col-span-1 sm:col-span-2 pt-2 border-t border-outline-variant/30">
                                <span className="text-secondary font-semibold block text-[11px] mb-1">الموقع الإلكتروني:</span>
                                <a
                                    href={branch.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary font-bold hover:underline inline-flex items-center gap-1 truncate text-xs dir-ltr"
                                >
                                    <span className="material-symbols-outlined text-sm">language</span>
                                    {branch.website_url}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Products List Section */}
                    {branch.products && branch.products.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-secondary flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">inventory_2</span>
                                المنتجات المرتبطة
                            </p>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto border border-outline-variant/50 p-2.5 rounded-xl bg-white shadow-inner">
                                {branch.products.map(p => (
                                    <div 
                                        key={p.id} 
                                        className="flex justify-between items-center text-xs border-b border-dashed border-outline-variant/40 pb-1.5 last:border-0 last:pb-0"
                                    >
                                        <span className="text-on-surface font-medium">
                                            {typeof p.name === 'object' ? p.name?.ar : p.name}
                                        </span>
                                        <span className="font-bold text-primary bg-surface-container px-2 py-0.5 rounded-md">
                                            {p.price} ر.س
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-5 pt-3 border-t border-surface-container-high flex justify-end">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="px-5 py-2 border border-outline-variant text-on-surface-variant rounded-xl font-bold text-xs hover:bg-surface-container transition-all"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
}

