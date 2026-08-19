import React, { useState, useEffect } from 'react';
import partnerService from '../../services/partnerService'; // استيراد الخدمة
import BranchTable from '../../components/admin/BranchTable'; // استيراد الجدول
import EditBranchModal from '../../components/admin/EditBranchModal'; // 1. استيراد مودال التعديل (تأكد من صحة المسار)
import BranchDetailsModal from '../../components/admin/BranchDetailsModal'; // استيراد مودال التفاصيل
import AddBranchModal from '../../components/admin/AddBranchModal';
export default function Pos() { // يُفضل كتابة اسم المكون بحرف كبير Pos
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false); // حالة مودال الإضافة

    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // 2. إضافة حالة خاصة بمودال التعديل
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleAddSuccess = () => {
        loadBranches(); // إعادة تحكم القائمة لتحديث جدول الفروع
    };

    
    // 1. جلب البيانات عند تحميل الصفحة
    const loadBranches = async () => {
        try {
            setLoading(true);
            const data = await partnerService.getPublicPartners();
            setBranches(data);
        } catch (error) {
            setError('حدث خطأ أثناء تحميل الفروع');

            console.error('تفاصيل خطأ Validation:', error.response?.data?.errors);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBranches();
    }, []);

    // 2. عملية الحذف
    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الفرع؟')) return;

        try {
            await partnerService.deletePartner(id);
            setBranches(branches.filter(b => b.id !== id));
        } catch (err) {
            alert('فشل الحذف');
        }
    };

    // 3. عملية تغيير الحالة (تفعيل/تعطيل)
    const handleToggleStatus = async (id) => {
        try {
            const branch = branches.find(b => b.id === id);
            await partnerService.togglePartnerStatus(id, branch.status);
            loadBranches();
        } catch (err) {
            alert('حدث خطأ أثناء تغيير الحالة');
        }
    };

    // 4. دالة فتح مودال التعديل عند الضغط على زر التعديل في الجدول
    const handleEdit = (branch) => {
        setSelectedBranch(branch);
        setIsEditOpen(true);
    };

    // 5. دالة تنفذ بعد نجاح التعديل داخل المودال
    const handleEditSuccess = () => {
        loadBranches(); // إعادة جلب البيانات لتحديث الجدول فوراً
    };

    const handleView = (branch) => {
        setSelectedBranch(branch);
        setIsViewOpen(true);
    };

    if (loading) return <div>جاري التحميل...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">إدارة الفروع</h1>

            {/* الهيدر وزر الإضافة */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-base font-bold text-on-surface">نقاط البيع</h2>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)} // ربط الزر هنا
                    className="bg-primary text-white text-[10px] mb-2 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:opacity-90 transition"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    إضافة نقطة بيع
                </button>

            </div>

            {/* الجدول */}
            <BranchTable
                branches={branches}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onEdit={handleEdit}
                onView={handleView}
            />

            {/* مودال التفاصيل */}
            <BranchDetailsModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                branch={selectedBranch}
            />

            {/* 6. إضافة مودال التعديل هنا */}
            <EditBranchModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                branch={selectedBranch}
                onSuccess={handleEditSuccess}
            />

            {/* مودال الإضافة */}
            <AddBranchModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={handleAddSuccess}
            />

        </div>
    );
}

