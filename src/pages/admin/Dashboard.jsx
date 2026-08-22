
import { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import RecentOrders from "../../components/admin/RecentOrders";
import StockAlerts from "../../components/admin/StockAlerts";
import { orderService } from "../../Services/orderService";
import api from "../../services/api";
import { STORAGE_BASE_URL } from "../../config/env";

const getProductName = (name) => name?.ar || name?.en || "منتج";

const getProductImage = (product) => {
    if (product?.main_image) return product.main_image;
    const image = product?.images?.[0];
    if (!image) return "";
    if (image.image_url || image.url || image.image) return image.image_url || image.url || image.image;
    if (!image.image_path) return "";
    return image.image_path.startsWith("http") ? image.image_path : `${STORAGE_BASE_URL}/${image.image_path.replace(/^\/+/, "")}`;
};

const getProductStock = (product) => {
    const units = Array.isArray(product?.units) ? product.units : [];
    const unitsStock = units.reduce((total, unit) => total + Number(unit.stock || 0), 0);
    return unitsStock > 0 ? unitsStock : Number(product?.stock || 0);
};


export default function Dashboard() {
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        stats: null,
        recentOrders: [],
    });
    const [lowStockProducts, setLowStockProducts] = useState([]);

    useEffect(() => {
        Promise.allSettled([
            orderService.getDashboardData(),
            api.get('/products'),
        ])
            .then(([dashboardResult, productsResult]) => {
                const dashboardResponse = dashboardResult.status === "fulfilled" ? dashboardResult.value : {};
                const productsResponse = productsResult.status === "fulfilled" ? productsResult.value : {};
                const products = productsResponse.data?.data || productsResponse.data || [];
                const lowStock = products
                    .filter((product) => {
                        const quantity = getProductStock(product);
                        return quantity === 0 || quantity < Number(product.low_stock_threshold ?? 5);
                    })
                    .map((product) => ({
                        id: product.id,
                        name: getProductName(product.name),
                        quantity: getProductStock(product),
                        image: getProductImage(product),
                    }))
                    .sort((first, second) => first.quantity - second.quantity);

                setData({
                    stats: dashboardResponse.stats,
                    recentOrders: dashboardResponse.recentOrders,
                });
                setLowStockProducts(lowStock);
            })
            .catch((err) => console.error("Failed to load dashboard products:", err))
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
                    value={lowStockProducts.filter((product) => product.quantity > 0).length}
                    description={`${lowStockProducts.filter((product) => product.quantity === 0).length} منتجات نفدت تماماً`}
                    icon="warning"
                    type="danger"
                />

            </div>

            {/* Dashboard Content */}
            <div className="dashboard-grid">

                <RecentOrders orders={data.recentOrders} />
                <StockAlerts products={lowStockProducts} />

            </div>

        </div>
    );
}