import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-3 flex justify-between items-center">
      {/* Left: Logo + Nav */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-xl font-bold text-blue-600">
          RealEstateSaaS
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/listings" className="text-gray-600 hover:text-blue-600">
            Listings
          </Link>
          {(currentUser?.role === "agent" || currentUser?.role === "admin") && (
            <Link to="/publish" className="text-gray-600 hover:text-blue-600">
              Publish
            </Link>
          )}
        </div>
      </div>

      {/* Right: Auth */}
      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            {currentUser.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md"
              >
                Admin
              </Link>
            )}
            <Link
              to="/profile"
              className="text-sm text-blue-600 hover:underline"
              title="View Profile"
            >
              {currentUser.name || currentUser.email}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-md transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
