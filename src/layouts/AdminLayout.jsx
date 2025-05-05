import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";
import DashboardSidebar from "../components/common/DashboardSidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminHeader />
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <DashboardSidebar
          links={[
            { to: "/admin", label: "Moderate Listings" },
            { to: "/admin/users", label: "Moderate Users" },
            { to: "/admin/manage", label: "Manage Listings" },
            { to: "/admin/analytics", label: "Analytics" },
            { to: "/admin/settings", label: "Settings" },
          ]}
          title="Admin Panel"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content */}
        <main className="flex-1 p-6 md:px-10 md:py-8 max-w-7xl mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}
