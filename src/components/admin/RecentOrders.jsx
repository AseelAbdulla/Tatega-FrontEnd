const orders = [
    {
        id: "#TK-9281",
        customer: "محمد العبدالله",
        date: "اليوم، 10:24 ص",
        total: "420 ريال",
        status: "تم الشحن",
        statusType: "success",
    },
    {
        id: "#TK-9275",
        customer: "سارة خالد",
        date: "اليوم، 09:15 ص",
        total: "1,150 ريال",
        status: "قيد المعالجة",
        statusType: "pending",
    },
    {
        id: "#TK-9268",
        customer: "أحمد محمد",
        date: "أمس، 08:40 م",
        total: "750 ريال",
        status: "تم التوصيل",
        statusType: "success",
    },
];

export default function RecentOrders() {
    return (
        <section className="dashboard-card orders-card">

            <div className="dashboard-card-header">

                <h3>
                    <span className="material-symbols-outlined">
                        list_alt
                    </span>

                    أحدث الطلبات
                </h3>

                <button>
                    عرض الكل
                </button>

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
                        {orders.map((order) => (
                            <tr key={order.id}>

                                <td>{order.id}</td>

                                <td>{order.customer}</td>

                                <td className="muted">
                                    {order.date}
                                </td>

                                <td className="bold">
                                    {order.total}
                                </td>

                                <td>
                                    <span
                                        className={`order-status ${order.statusType}`}
                                    >
                                        {order.status}
                                    </span>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </section>
    );
}