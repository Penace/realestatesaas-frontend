import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6 hidden md:block">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          {[
            { to: "/admin", label: "Moderate Listings" },
            { to: "/admin/manage", label: "Manage Listings" },
            { to: "/admin/analytics", label: "Analytics (Soon)" },
            { to: "/admin/settings", label: "Settings (Soon)" },
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
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
