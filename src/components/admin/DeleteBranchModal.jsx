
import React from 'react';

export default function DeleteBranchModal({ isOpen, onClose, branch, onSuccess }) {
    if (!isOpen || !branch) return null;

    const handleDelete = () => {
        // تنفيذ طلب API الحذف مع Laravel
        if (onSuccess) onSuccess('تم الحذف بنجاح');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl max-w-xs w-full p-4 shadow-2xl card-shadow border border-surface-container-high text-center z-10">
                <div className="flex justify-center mb-1">
                    <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-error text-2xl">delete_forever</span>
                    </div>
                </div>

                <h3 className="text-sm font-bold text-on-surface">تأكيد الحذف</h3>
                <p className="text-[10px] text-on-surface-variant mt-1">
                    هل أنت متأكد من حذف نقطة البيع <span className="font-bold text-on-surface">"{typeof branch.name === 'object' ? branch.name.ar || branch.name.en : branch.name}"</span>؟
                </p>

                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-error text-white py-1.5 rounded-lg font-bold text-[10px] hover:opacity-90 transition"
                    >
                        حذف
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 border border-surface-container-high text-on-surface-variant py-1.5 rounded-lg font-bold text-[10px] hover:bg-surface-container transition"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}

