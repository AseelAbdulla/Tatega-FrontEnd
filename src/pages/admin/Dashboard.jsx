import StatCard from "../../components/admin/StatCard";
import RecentOrders from "../../components/admin/RecentOrders";
import StockAlerts from "../../components/admin/StockAlerts";

export default function Dashboard() {
    return (
        <div className="dashboard">

            {/* Page Header */}
            <div className="dashboard-heading">

                <h1>
                    لوحة التحكم
                </h1>

                <p>
                    نظرة عامة على أداء متجر تقية
                </p>

            </div>

            {/* Statistics */}
            <div className="stats-grid">

                <StatCard
                    title="إجمالي المبيعات"
                    value="45,280 ريال"
                    description="+12.5% من الشهر الماضي"
                    icon="payments"
                    type="primary"
                />

                <StatCard
                    title="المستخدمون النشطون"
                    value="1,482"
                    description="+48 مستخدم جديد اليوم"
                    icon="group_add"
                    type="secondary"
                />

                <StatCard
                    title="طلبات معلقة"
                    value="24"
                    description="تحتاج إلى معالجة فورية"
                    icon="pending_actions"
                    type="warning"
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

                <RecentOrders />

                <StockAlerts />

            </div>

        </div>
    );
}