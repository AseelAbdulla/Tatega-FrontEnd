import { useLocation } from "react-router-dom";

const pageTitles = {
    "/admin": "لوحة التحكم الرئيسية",
    "/admin/categories": "إدارة التصنيفات",
    "/admin/products": "إدارة المنتجات",
    "/admin/profile": "الملف الشخصي",
    "/admin/users": "المستخدمون",
    "/admin/orders": "الطلبات",
    "/admin/pos": "نقاط البيع",
    "/admin/reviews": "التقييمات",
    "/admin/content": "إدارة المحتوى",
};

export default function AdminTopbar({ onMenuClick }) {
    const location = useLocation();

    const title =
        pageTitles[location.pathname] ||
        "لوحة التحكم";

    return (
        <header className="admin-topbar">

            <div className="admin-topbar-left">

                <button
                    className="admin-menu-button"
                    onClick={onMenuClick}
                >
                    <span className="material-symbols-outlined">
                        menu
                    </span>
                </button>

                <h2>{title}</h2>

            </div>

            <div className="admin-topbar-actions">

                <button className="admin-icon-button">
                    <span className="material-symbols-outlined">
                        notifications
                    </span>

                    <span className="notification-dot" />
                </button>

                <button className="admin-icon-button">
                    <span className="material-symbols-outlined">
                        search
                    </span>
                </button>

                <div className="admin-divider" />

                <div className="admin-language">
                    <span>AR</span>

                    <span className="material-symbols-outlined">
                        language
                    </span>
                </div>

            </div>

        </header>
    );
}