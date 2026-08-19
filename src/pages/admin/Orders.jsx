import React, { useState, useEffect } from 'react';
import OrdersHeader from '../../components/admin/OrdersHeader';
import OrdersLocalTable from '../../components/admin/OrdersLocalTable';
import OrdersImportCards from '../../components/admin/OrdersImportCards';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import OrderFormModal from '../../components/admin/OrderFormModal';
import OrderDeleteModal from '../../components/admin/OrderDeleteModal';
import { orderService } from '../../services/orderService';

export default function Orders({ showToast }) {
    const [activeTab, setActiveTab] = useState('local');
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // حالات المودالات
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // 1. الطلبات المحلية: العميل نوعه local-client
    const localOrders = orders.filter(order => {
        const roleName = order.role?.role || order.user?.role || order.customer?.role;
        return roleName === 'local-client' || !roleName;
    });

    // 2. طلبات الاستيراد: العميل نوعه import-client أو نوع الطلب import
    const importOrders = orders.filter(order => {
        const roleName = order.role?.role || order.user?.role || order.customer?.role;
        return roleName === 'import-client' || order.order_type === 'import';
    });

    // دالة جلب البيانات من API
    const loadAllData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes] = await Promise.all([
                orderService.getDashboardData(),
                orderService.getAdminOrders()
            ]);
            setStats(statsRes);
            setOrders(Array.isArray(ordersRes) ? ordersRes : []);
        } catch (error) {
            console.error("فشل جلب البيانات:", error);
            showToast?.('حدث خطأ في تحميل البيانات من السيرفر', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    // 1. تفاصيل الطلب
    const handleViewDetails = async (order) => {
        try {
            const details = await orderService.getOrderDetails(order.id);
            setSelectedOrder(details);
        } catch {
            setSelectedOrder(order);
        }
        setIsDetailsOpen(true);
    };

    // 2. فتح المودالات
    const handleOpenAdd = () => {
        setSelectedOrder(null);
        setFormMode('add');
        setIsFormOpen(true);
    };

    const handleOpenEdit = (order) => {
        setSelectedOrder(order);
        setFormMode('edit');
        setIsFormOpen(true);
    };

    const handleOpenDelete = (order) => {
        setSelectedOrder(order);
        setIsDeleteOpen(true);
    };

    // 3. الإضافة / التعديل
    const handleFormSubmit = async (formData) => {
        try {
            if (formMode === 'add') {
                await orderService.createAdminOrder(formData);
                showToast?.('تم إضافة الطلب بنجاح');
            } else {
                await orderService.updateOrder(selectedOrder.id, formData);
                showToast?.('تم حفظ التعديلات بنجاح');
            }
            setIsFormOpen(false);
            loadAllData();
        } catch (error) {
            console.error("خطأ في عملية الحفظ:", error);
            showToast?.('فشلت العملية، يرجى التأكد من البيانات', 'error');
        }
    };

    // 4. الحذف
    const handleDeleteConfirm = async () => {
        if (!selectedOrder) return;
        try {
            await orderService.deleteOrder(selectedOrder.id);
            setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
            setIsDeleteOpen(false);
            showToast?.('تم حذف الطلب بنجاح');
        } catch (error) {
            console.error("خطأ في الحذف:", error);
            showToast?.('فشل حذف الطلب', 'error');
        }
    };

    // 5. تغيير الحالة
    const handleChangeStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            showToast?.(`تم تغيير الحالة بنجاح`);
        } catch (error) {
            console.error("خطأ في تغيير الحالة:", error);
            showToast?.('تعذر تغيير حالة الطلب', 'error');
        }
    };

    return (
        <div className="p-3 max-w-7xl mx-auto space-y-5">
            <OrdersHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                stats={stats}
                orders={orders}
            />

            {activeTab === 'local' ? (
                <OrdersLocalTable
                    orders={localOrders}
                    loading={loading}
                    onOpenAdd={handleOpenAdd}
                    onViewDetails={handleViewDetails}
                    onOpenEdit={handleOpenEdit}
                    onOpenDelete={handleOpenDelete}
                    onChangeStatus={handleChangeStatus}
                />
            ) : (
                <OrdersImportCards
                    loading={loading}
                    onShowToast={showToast}
                    showToast={showToast}
                    orders={importOrders}
                    onRefresh={loadAllData} /* تم ربط الدالة الصحيحة هنا وإلغاء التعليق */
                />
            )}

            {/* Modals */}
            <OrderDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                order={selectedOrder}
            />

            <OrderFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedOrder}
                mode={formMode}
            />

            <OrderDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}

