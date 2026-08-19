import { Outlet } from "react-router-dom";
import { useState } from "react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // حالة التحكم بطي القائمة على الشاشات الكبيرة
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div className={`admin-layout ${isCollapsed ? "collapsed" : ""}`} dir="rtl">

            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isCollapsed}
                onToggleCollapse={handleToggleCollapse}
            />

            <div className="admin-main">

                <AdminTopbar
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="admin-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

