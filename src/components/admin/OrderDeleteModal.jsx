import React from 'react';

export default function OrderDeleteModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 transition-all duration-200">
            <div className="absolute inset-0 modal-overlay" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl card-shadow border border-surface-container-high text-center">
                <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-error text-3xl">delete_forever</span>
                    </div>
                </div>
                <h3 className="text-base font-bold text-on-surface">تأكيد الحذف</h3>
                <p className="text-xs text-on-surface-variant mt-1">هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.</p>
                <div className="flex gap-3 mt-4">
                    <button onClick={onConfirm} className="flex-1 border bg-red-500 border-surface-container-high text-orange-50 py-1.5 rounded-lg font-bold text-sm hover:bg-red-400 transition">
                        حذف
                    </button>
                    <button onClick={onClose} className="flex-1 border border-surface-container-high text-on-surface-variant py-1.5 rounded-lg font-bold text-sm hover:bg-surface-container transition">
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
}
