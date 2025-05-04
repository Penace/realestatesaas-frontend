import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/form/TextInput";
import { useToast } from "../context/ToastProvider";
import ListingCard from "../components/ListingCard";
import { getFavorites } from "../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { showToast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mobileMenuRef = useRef(null); // Reference to handle clicks outside sidebar

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    setFormData({ name: parsed.name || "", email: parsed.email || "" });
  }, [navigate]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?._id) return;
      try {
        const favorites = await getFavorites(user._id);
        setFavoriteListings(favorites || []);
      } catch (err) {
        console.error("Failed to load favorites", err);
      }
    };

    loadFavorites();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
      favorites: user.favorites || [],
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
    showToast("Profile updated!", "success");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle the sidebar
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        ref={mobileMenuRef}
        className={`w-64 bg-white shadow-lg p-6 space-y-4 fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:block`}
      >
        {/* Sidebar content */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-xl font-bold text-gray-800">My Dashboard</h2>
          <button
            onClick={() => setIsSidebarOpen(false)} // Close the sidebar
            className="text-gray-600 hover:text-blue-600 focus:outline-none"
            aria-label="Close sidebar"
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
        </div>

        {/* Sidebar buttons */}
        <button
          onClick={() => {
            setActiveTab("profile");
            setIsSidebarOpen(false);
          }}
          className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
            activeTab === "profile"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => {
            setActiveTab("favorites");
            setIsSidebarOpen(false);
          }}
          className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
            activeTab === "favorites"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Favorites
        </button>
        <button
          onClick={() => {
            setActiveTab("settings");
            setIsSidebarOpen(false);
          }}
          className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
            activeTab === "settings"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Settings
        </button>
      </aside>

      {/* Sidebar toggle button for small screens */}
      <button
        className={`md:hidden text-gray-600 hover:text-blue-600 focus:outline-none fixed top-1/2 left-4 z-50 transform -translate-y-1/2 ${
          isSidebarOpen ? "hidden" : ""
        }`}
        onClick={toggleSidebar} // Toggle sidebar on click
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <svg
            className="w-6 h-6 transform rotate-180 transition-transform duration-300 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6 transform transition-transform duration-300 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        )}
      </button>

      {/* Main content */}
      <main className="flex-1 p-10 mt-16 md:ml-64">
        {/* Tab content */}
        {activeTab === "profile" && (
          <div className="max-w-xl space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              My Profile
            </h1>
            {editMode ? (
              <form className="space-y-4">
                <TextInput
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                <TextInput
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-200 text-sm rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm text-gray-500">Name</h2>
                  <p className="text-lg text-gray-800 font-medium">
                    {user.name || "N/A"}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm text-gray-500">Email</h2>
                  <p className="text-lg text-gray-800 font-medium">
                    {user.email || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Favorites</h1>
            {favoriteListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteListings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    _id={listing._id}
                    title={listing.title}
                    location={listing.location}
                    price={listing.price}
                    images={listing.images || []} // Ensure images are passed correctly
                    prefix="listings"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No favorites saved.</p>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
            {editMode ? (
              <form className="space-y-4">
                <TextInput
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
                <TextInput
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-200 text-sm rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm text-gray-500">Name</h2>
                  <p className="text-lg text-gray-800 font-medium">
                    {user.name}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm text-gray-500">Email</h2>
                  <p className="text-lg text-gray-800 font-medium">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
