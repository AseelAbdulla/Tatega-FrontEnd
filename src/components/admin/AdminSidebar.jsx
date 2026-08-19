import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
    { label: "لوحة التحكم", icon: "dashboard", path: "/admin", end: true },
    { label: "الملف الشخصي", icon: "person", path: "/admin/profile" },
    { label: "المستخدمون", icon: "group", path: "/admin/users" },
    { label: "الأدوار والصلاحيات", icon: "admin_panel_settings", path: "/admin/roles" },
    { label: "الاستيراد الدولي", icon: "public", path: "/admin/customers/international" },
    { label: "العملاء المحليون", icon: "person", path: "/admin/customers/local" },
    { label: "التصنيفات", icon: "category", path: "/admin/categories" },
    { label: "المنتجات", icon: "inventory_2", path: "/admin/products" },
    { label: "الطلبات", icon: "shopping_cart", path: "/admin/orders" },
    { label: "سجل الطلبات", icon: "receipt_long", path: "/admin/order-history" },
    { label: "نقاط البيع", icon: "point_of_sale", path: "/admin/pos" },
    { label: "التقييمات", icon: "rate_review", path: "/admin/reviews" },
    { label: "إدارة المحتوى", icon: "settings_applications", path: "/admin/content" },
];

export default function AdminSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
    const [isMobile, setIsMobile] = useState(false);

    // التحقق من حجم الشاشة وتحديد ما إذا كان الجاهز هاتف/تابلت صغير
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // في الشاشات الصغيرة يلغى الكولابس وتظهر القائمة كاملة بوضع الـ Drawer
    const effectiveCollapsed = isMobile ? false : isCollapsed;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        sessionStorage.clear();
        window.location.href = "/login";
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className="admin-overlay" onClick={onClose} />}

            {/* Sidebar */}
            <aside
                className={`admin-sidebar ${isOpen ? "admin-sidebar-open" : ""} ${
                    effectiveCollapsed ? "admin-sidebar-collapsed" : ""
                }`}
            >
                {/* Header & Collapse Toggle Button */}
                <div className="admin-brand">
                    <div className="admin-brand-header">
                        {!effectiveCollapsed && (
                            <div className="brand-titles">
                                <h1>متجر تعتيقة</h1>
                                <p>لوحة الإدارة</p>
                            </div>
                        )}
                        
                        {/* زر الـ Toggle يظهر فقط في الشاشات الكبيرة */}
                        {!isMobile && (
                            <button 
                                type="button" 
                                className="collapse-toggle-btn" 
                                onClick={onToggleCollapse}
                                title={effectiveCollapsed ? "توسيع القائمة" : "طي القائمة"}
                            >
                                <span className="material-symbols-outlined">
                                    {effectiveCollapsed ? "dock_to_right" : "dock_to_left"}
                                </span>
                            </button>
                        )}

                        {/* زر إغلاق القائمة الخاص بالشاشات الصغيرة */}
                        {isMobile && (
                            <button 
                                type="button" 
                                className="collapse-toggle-btn" 
                                onClick={onClose}
                                title="إغلاق القائمة"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                    </div>

                    {!effectiveCollapsed && <span>منتجات عضوية وأصلية</span>}
                </div>

                {/* Navigation */}
                <nav className="admin-navigation">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            end={item.end}
                            title={effectiveCollapsed ? item.label : ""}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? "admin-nav-item-active" : ""}`
                            }
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {!effectiveCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}

                    <div className="admin-nav-divider" />

                    <NavLink 
                        to="/" 
                        className="admin-nav-item" 
                        onClick={onClose} 
                        title={effectiveCollapsed ? "زيارة المتجر الرئيسي" : ""}
                    >
                        <span className="material-symbols-outlined">storefront</span>
                        {!effectiveCollapsed && <span>زيارة المتجر الرئيسي</span>}
                    </NavLink>

                    <button 
                        type="button" 
                        className="admin-nav-item admin-logout" 
                        onClick={handleLogout} 
                        title={effectiveCollapsed ? "تسجيل الخروج" : ""}
                    >
                        <span className="material-symbols-outlined">logout</span>
                        {!effectiveCollapsed && <span>تسجيل الخروج</span>}
                    </button>
                </nav>

                {/* Admin Profile */}
                <div className="admin-profile" title={effectiveCollapsed ? "مدير تعتيقة (مدير النظام)" : ""}>
                    <div className="admin-avatar">م</div>
                    {!effectiveCollapsed && (
                        <div>
                            <strong>مدير تعتيقة</strong>
                            <small>مدير النظام</small>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
