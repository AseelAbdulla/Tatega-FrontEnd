
import { Link } from 'react-router-dom';
import { orderService } from "../../Services/orderService";

export default function RecentOrders({ orders = [] }) {
    return (
        <section className="dashboard-card orders-card">
            <div className="dashboard-card-header">
                <h3>
                    <span className="material-symbols-outlined">list_alt</span>
                    أحدث الطلبات
                </h3>

                <Link to="/admin/orders" className="btn-link">
                    عرض الكل
                </Link>
            </div>

            <div className="orders-table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>رقم الطلب</th>
                            <th>العميل</th>
                            <th>التاريخ</th>
                            <th>المجموع</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{typeof order.customer === 'object' ? (order.customer?.name || order.customer_name || 'عير معروف'): (order.customer?.name || order.customer_name || 'عير معروف')}</td>
                                    <td className="muted">{order.created_at || order.date}</td>
                                    <td className="bold">{orderService.formatCurrency(order.pricing?.total ?? order.total_price ?? order.total ?? 0)}</td>
                                    <td>
                                        <span className={`order-status ${orderService.getStatusType(order.status)}`}>
                                            {orderService.getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4 muted">
                                    لا توجد طلبات حديثة حالياً
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
