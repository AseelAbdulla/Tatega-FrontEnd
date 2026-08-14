import { Outlet } from "react-router-dom";
import { useState } from "react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-layout" dir="rtl">

            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
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