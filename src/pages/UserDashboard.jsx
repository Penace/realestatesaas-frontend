import { useEffect, useState } from "react";
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
        console.log("Favorites:", favorites); // Log to verify images field
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

    // Update localStorage with the updated user
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update the user state
    setUser(updatedUser);
    setEditMode(false);
    // Force reload to update UI (e.g., Navbar)
    window.location.reload();
    showToast("Profile updated!", "success");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-4 hidden md:block">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Dashboard</h2>
        <button
          onClick={() => setActiveTab("profile")}
          className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
            activeTab === "profile"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
            activeTab === "favorites"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Favorites
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`block w-full text-left px-4 py-2 rounded-lg font-medium ${
            activeTab === "settings"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Settings
        </button>
      </aside>

      {/* Mobile Heading (fix overlap with navbar) */}
      <div className="fixed top-0 left-0 w-full h-16 bg-white z-40 shadow-sm flex items-center justify-between px-6 md:hidden">
        <h1 className="text-lg font-semibold text-blue-600">Dashboard</h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 mt-16">
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
                {/* Input fields for name and email */}
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
                {/* Display the user data */}
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
                {/* Button to edit profile */}
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
