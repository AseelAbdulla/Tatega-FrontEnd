import { NavLink } from "react-router-dom";

const menuItems = [
    {
        label: "لوحة التحكم",
        icon: "dashboard",
        path: "/admin",
    },

    {
        label: "الملف الشخصي",
        icon: "person",
        path: "/admin/profile",
    },

    {
        label: "المستخدمون",
        icon: "group",
        path: "/admin/users",
    },

    {
        label: "الأدوار والصلاحيات",
        icon: "admin_panel_settings",
        path: "/admin/roles",
    },

    {
        label: "الاستيراد الدولي",
        icon: "public",
        path: "/admin/customers/international",
    },

    {
        label: "العملاء المحليون",
        icon: "person",
        path: "/admin/customers/local",
    },

    {
        label: "التصنيفات",
        icon: "category",
        path: "/admin/categories",
    },

    {
        label: "المنتجات",
        icon: "inventory_2",
        path: "/admin/products",
    },

    // =====================================
    // الطلبات - قسم مستقل
    // =====================================
    {
        label: "الطلبات",
        icon: "shopping_cart",
        path: "/admin/orders",
    },

    // =====================================
    // سجل الطلبات
    // =====================================
    {
        label: "سجل الطلبات",
        icon: "receipt_long",
        path: "/admin/order-history",
    },

    {
        label: "نقاط البيع",
        icon: "point_of_sale",
        path: "/admin/pos",
    },

    {
        label: "التقييمات",
        icon: "rate_review",
        path: "/admin/reviews",
    },

    {
        label: "إدارة المحتوى",
        icon: "settings_applications",
        path: "/admin/content",
    },
];

export default function AdminSidebar({ isOpen, onClose }) {

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");

        sessionStorage.clear();

        window.location.href = "/login";
    };

    return (
        <>
            {/* Mobile Overlay */}

            {isOpen && (
                <div
                    className="admin-overlay"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}

            <aside
                className={`admin-sidebar ${
                    isOpen ? "admin-sidebar-open" : ""
                }`}
            >

                {/* Brand */}

                <div className="admin-brand">

                    <h1>
                        متجر تقية
                    </h1>

                    <p>
                        لوحة الإدارة
                    </p>

                    <span>
                        منتجات عضوية وأصلية
                    </span>

                </div>


                {/* Navigation */}

                <nav className="admin-navigation">

                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `admin-nav-item ${
                                    isActive
                                        ? "admin-nav-item-active"
                                        : ""
                                }`
                            }
                        >

                            <span className="material-symbols-outlined">
                                {item.icon}
                            </span>

                            <span>
                                {item.label}
                            </span>

                        </NavLink>

                    ))}


                    {/* Divider */}

                    <div className="admin-nav-divider" />


                    {/* Visit Store */}

                    <NavLink
                        to="/"
                        className="admin-nav-item"
                        onClick={onClose}
                    >

                        <span className="material-symbols-outlined">
                            storefront
                        </span>

                        <span>
                            زيارة المتجر الرئيسي
                        </span>

                    </NavLink>


                    {/* Logout */}

                    <button
                        type="button"
                        className="admin-nav-item admin-logout"
                        onClick={handleLogout}
                    >

                        <span className="material-symbols-outlined">
                            logout
                        </span>

                        <span>
                            تسجيل الخروج
                        </span>

                    </button>

                </nav>


                {/* Admin Profile */}

                <div className="admin-profile">

                    <div className="admin-avatar">
                        م
                    </div>

                    <div>

                        <strong>
                            مدير تقية
                        </strong>

                        <small>
                            مدير النظام
                        </small>

                    </div>

                </div>

            </aside>
        </>
    );
}