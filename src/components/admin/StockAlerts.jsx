export default function StockAlerts({ products = [] }) {
    return (
        <section className="dashboard-card stock-card">

            <div className="dashboard-card-header">

                <h3 className="danger-title">
                    <span className="material-symbols-outlined">
                        production_quantity_limits
                    </span>

                    تنبيهات المخزون
                </h3>

            </div>

            <div className="stock-list">
                {products.length === 0 ? <p className="muted">لا توجد منتجات قاربت على النفاد</p> : products.map((product) => (
                    <div
                        className="stock-item"
                        key={product.id}
                    >

                        {product.image ? <img src={product.image} alt={product.name} /> : <span className="material-symbols-outlined">inventory_2</span>}

                        <div>
                            <strong>
                                {product.name}
                            </strong>

                            <span>
                                {product.quantity === 0 ? "نفد تماماً" : `منخفض: المتبقي ${product.quantity}`}
                            </span>
                        </div>

                    </div>
                ))}

            </div>

        </section>
    );
}