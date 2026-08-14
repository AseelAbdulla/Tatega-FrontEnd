const products = [
    {
        name: "سلة صوف يدوية",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200",
    },
    {
        name: "منتج عضوي",
        quantity: 3,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200",
    },
];

export default function StockAlerts() {
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

                {products.map((product) => (
                    <div
                        className="stock-item"
                        key={product.name}
                    >

                        <img
                            src={product.image}
                            alt={product.name}
                        />

                        <div>
                            <strong>
                                {product.name}
                            </strong>

                            <span>
                                المتبقي: {product.quantity} فقط
                            </span>
                        </div>

                    </div>
                ))}

            </div>

        </section>
    );
}