import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white shadow">
        <h2 className="text-lg font-semibold text-gray-700">Admin Panel</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          ☰
        </button>
      </div>
      <AdminHeader />
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg p-6 space-y-6 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:block`}
        >
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600"
            >
              ✕
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 hidden md:block">
            Admin Panel
          </h2>
          <nav className="space-y-2">
            {[
              { to: "/admin", label: "Moderate Listings" },
              { to: "/admin/users", label: "Moderate Users" },
              { to: "/admin/manage", label: "Manage Listings" },
              { to: "/admin/analytics", label: "Analytics" },
              { to: "/admin/settings", label: "Settings" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 md:px-10 md:py-8 max-w-7xl mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}
