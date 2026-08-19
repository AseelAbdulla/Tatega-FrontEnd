
import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import RecentOrders from "../../components/admin/RecentOrders";
import StockAlerts from "../../components/admin/StockAlerts";
import { orderService } from "../../Services/orderService";


export default function Dashboard() {
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        stats: null,
        recentOrders: [],
    });

    useEffect(() => {
        // جلب البيانات من الـ API عند فتح الصفحة
        orderService.getDashboardData()
            .then((res) => {
                setData({
                    stats: res.stats,
                    recentOrders: res.recentOrders,
                });
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-8 text-center muted">جاري تحميل البيانات...</div>;
    }

    return (
        <div className="dashboard">

            {/* Page Header */}
            <div className="dashboard-heading">

                <h1>
                    لوحة التحكم
                </h1>

                <p>
                    نظرة عامة على أداء متجر تعتيقة
                </p>

            </div>

            {/* Statistics */}
            <div className="stats-grid">
                <StatCard
                    title="إجمالي المبيعات"
                    value={orderService.formatCurrency(data.stats?.total_sales)}
                    description="المبيعات المكتملة"
                    icon="payments"
                    type="primary"
                />


                <StatCard
                    title="المستخدمون النشطون"
                    value="20"
                    description="+48 مستخدم جديد اليوم"
                    icon="group_add"
                    type="secondary"
                />


                <StatCard
                    title="طلبات معلقة"
                    value={data.stats?.pending_orders ?? 0}
                    description={data.stats?.pending_orders > 0 ? "تحتاج إلى معالجة فورية" : "لا توجد طلبات معلقة"}
                    icon="pending_actions"
                    type="warning"
                    to="/admin/orders?status=pending"
                />


                <StatCard
                    title="منتجات قاربت على النفاد"
                    value="7"
                    description="3 منتجات نفدت تماماً"
                    icon="warning"
                    type="danger"
                />

            </div>

            {/* Dashboard Content */}
            <div className="dashboard-grid">

                <RecentOrders orders={data.recentOrders} />
                <StockAlerts />

            </div>

        </div>
    );
}