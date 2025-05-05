import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null); // Reference for the mobile menu

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-3 flex justify-between items-center">
      {/* Left: Logo + Nav */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-xl font-bold text-blue-600">
          RealEstateSaaS
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/listings" className="text-gray-600 hover:text-blue-600">
            Listings
          </Link>
          <Link to="/calculator" className="text-gray-600 hover:text-blue-600">
            Calculator
          </Link>
          {(user?.role === "agent" || user?.role === "admin") && (
            <>
              <Link to="/publish" className="text-gray-600 hover:text-blue-600">
                Publish
              </Link>
              <Link
                to="/agent-dashboard"
                className="text-gray-600 hover:text-blue-600"
              >
                Agent Dashboard
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Right: Auth and User (Visible on Desktop) */}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md"
              >
                Admin
              </Link>
            )}
            <Link
              to="/dashboard"
              className="text-sm text-blue-600 hover:underline"
              title="View Profile"
            >
              {user.name || user.email}
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Log Out
              </button>
            )}
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

      {/* Mobile Menu Button (aligned to right) */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none ml-auto"
      >
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu absolute top-0 right-0 w-64 bg-white shadow-lg z-20 py-4 px-6"
          ref={mobileMenuRef}
        >
          <button
            onClick={closeMobileMenu}
            className="absolute top-4 right-4 text-gray-600 hover:text-blue-600"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-4">
            {user && (
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Log Out
              </button>
            )}
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/listings"
              className="text-gray-600 hover:text-blue-600"
              onClick={closeMobileMenu}
            >
              Listings
            </Link>
            <Link
              to="/calculator"
              className="text-gray-600 hover:text-blue-600"
              onClick={closeMobileMenu}
            >
              Calculator
            </Link>
            {(user?.role === "agent" || user?.role === "admin") && (
              <>
                <Link
                  to="/publish"
                  className="text-gray-600 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  Publish
                </Link>
                <Link
                  to="/agent-dashboard"
                  className="text-gray-600 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  Agent Dashboard
                </Link>
              </>
            )}

            {/* Right: Auth and User */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="text-sm text-blue-600 hover:underline"
                    title="View Profile"
                  >
                    {user.name || user.email}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-blue-600 hover:underline"
                  >
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
          </div>
        </div>
      )}
    </nav>
  );
}
