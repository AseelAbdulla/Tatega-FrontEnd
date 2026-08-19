import React, { useState, useEffect } from 'react';

export default function OrderFormModal({ isOpen, onClose, onSubmit, initialData = null, mode = 'add' }) {
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        status: 'pending',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                customer_name: initialData.customer?.name || initialData.customer_name || '',
                customer_phone: initialData.customer?.phone || initialData.customer_phone || '',
                customer_email: initialData.customer?.email || initialData.customer_email || '',
                status: initialData.status || 'pending',
                notes: initialData.notes || ''
            });
        } else {
            setFormData({
                customer_name: '',
                customer_phone: '',
                customer_email: '',
                status: 'pending',
                notes: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 transition-all duration-200">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl z-10 card-shadow border border-surface-container-high">

                {/* الهيدر */}
                <div className="flex justify-between items-center border-b border-surface-container-high pb-3">
                    <h3 className={`text-base font-bold ${mode === 'add' ? 'text-primary' : 'text-on-surface'}`}>
                        {mode === 'add' ? 'إضافة طلب جديد' : `تعديل الطلب #${initialData?.id || ''}`}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full transition">
                        <span className="material-symbols-outlined text-on-surface-variant">close</span>
                    </button>
                </div>

                {/* النموذج */}
                <form onSubmit={handleSubmit} className="mt-3 space-y-3 text-sm">
                    {/* اسم العميل */}
                    <div>
                        <label className="block text-[10px] font-bold text-secondary mb-0.5">اسم العميل</label>
                        <input
                            type="text"
                            placeholder="أدخل اسم العميل"
                            value={formData.customer_name}
                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                            className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-3 py-1.5 text-sm"
                            required
                        />
                    </div>

                    {/* رقم الهاتف والبريد الإلكتروني */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-secondary mb-0.5">رقم الهاتف</label>
                            <input
                                type="text"
                                placeholder="77XXXXXXX"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-3 py-1.5 text-sm dir-ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-secondary mb-0.5">الحالة</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-3 py-1.5 text-sm"
                            >
                                <option value="accepted">قبول</option>
                                <option value="shipped">شحن</option>
                                <option value="delivered">تم التوصيل</option>
                                <option value="cancelled">ملغي</option>
                            </select>
                        </div>


                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                        <label className="block text-[10px] font-bold text-secondary mb-0.5">البريد الإلكتروني</label>
                        <input
                            type="email"
                            placeholder="example@mail.com"
                            value={formData.customer_email}
                            onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                            className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-3 py-1.5 text-sm"
                        />
                    </div>

                    {/* الملاحظات */}
                    <div>
                        <label className="block text-[10px] font-bold text-secondary mb-0.5">ملاحظات الطلب</label>
                        <textarea
                            rows="2"
                            placeholder="أي ملاحظات إضافية..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full rounded-lg border-outline-variant focus:ring-primary focus:border-primary px-3 py-1.5 text-sm"
                        ></textarea>
                    </div>

                    {/* الأزرار */}
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-primary text-white py-1.5 rounded-lg font-bold text-sm hover:opacity-90 transition">
                            {mode === 'add' ? 'إضافة' : 'حفظ التعديلات'}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 border border-surface-container-high text-on-surface-variant py-1.5 rounded-lg font-bold text-sm hover:bg-surface-container transition">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

