import { NavLink } from "react-router-dom";

export default function DashboardSidebar({
  links,
  title,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <>
      {/* Sidebar Toggle Button for Small Screens */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-white rounded-r-full p-2 shadow-lg focus:outline-none transition-transform duration-300 md:hidden"
        >
          <span
            className={`transform transition-transform ${
              sidebarOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            ➜
          </span>
        </button>
      )}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg p-6 space-y-6 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:block`}
      >
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600"
          >
            ✕
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 hidden md:block">
          {title}
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
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
    </>
  );
}
