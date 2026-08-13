export default function OrderItemsDetails() {
    const items = [
        {
            id: 1,
            title: "هيل أخضر هندي فاخر",
            qty: 2,
            price: "145 ر.س",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1Vk9-QvtJCiXvk1kxomjwNi3aEnX0PXEv5j9VdMhrLxFNDr4WBZ0MaKtnQdt5okh_uzRQKI4okyVX5PnpWYArJhGk4R-ISIBh3fG99sdcL6md88rEJO2PbzG5XsTFy-AdtCqucOmXbF_e7yMr65RrM4iusGr2su8LpGw4-5of5x4ce2IsXT6cuy5f1GXfqyYtoAz__aKih6zu1eXUyO17yr3znSU0aqJi26J3N-ej71e-kCkykU1o"
        },
        {
            id: 2,
            title: "كركم عضوي مطحون",
            qty: 1,
            price: "42 ر.س",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG4ReoJ6N0zwz-uE-W2f6uQDETzPOJLriVAPCF-gd9xAdLtJb9tEfug8zazwioft1_GNMmAgwoaqlmbpBdQqMHYbXLD3nvNO78WFlJLdCfJEUPT3ap691GSuwB1RpMcqf3mRQ93JWXI5SdrNX2rqNo6z-lDZJ1S8KmQ2HGxFpJPYFE0UzTpxkIIoAguBRjpq6riw9l7TQStJ3cS4pktsotcxDXvfRwS3JEEP2zgTjwFxk71PrJRVfE"
        }
    ];

    return (
        <div className="md:col-span-2 bg-white rounded-xl p-6 md:p-8 rustic-shadow border border-black/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_bag</span>
                <span>تفاصيل المنتجات</span>
            </h3>

            <div className="space-y-6">
                {items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 border-b border-black/5 pb-6">
                        <img alt={item.title} className="w-20 h-20 rounded-lg object-cover bg-background" src={item.image} />
                        <div className="grow text-center sm:text-right">
                            <h4 className="font-bold">{item.title}</h4>
                            <p className="text-sm text-on-surface-variant mt-1">الكمية: {item.qty} وحدة</p>
                        </div>
                        <div className="font-bold text-accent-terracotta text-lg">{item.price}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 space-y-3 border-t-2 border-dashed border-black/10">
                <div className="flex justify-between text-on-surface-variant text-sm">
                    <span>المجموع الفرعي</span>
                    <span>187 ر.س</span>
                </div>
                <div className="flex justify-between text-on-surface-variant text-sm">
                    <span>التوصيل</span>
                    <span className="text-primary font-bold">مجاني</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary pt-3">
                    <span>الإجمالي</span>
                    <span>187 ر.س</span>
                </div>
            </div>
        </div>
    );
}
