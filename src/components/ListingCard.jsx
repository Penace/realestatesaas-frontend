import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const VITE_IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:4000";
const favoritesCache = new Map();

export default function ListingCard({ listing, prefix = "listings" }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth(); // Get the current user from context
  if (!listing || typeof listing !== "object") return null;
  console.log("Rendering ListingCard with:", listing);
  const _id = listing?._id ?? "";
  const images = listing?.images ?? [];
  const title = listing?.title ?? "Untitled";
  const location = listing?.location ?? "Unknown";
  const price = listing?.price ?? null;

  // Prevent default behavior of Link when clicking on the favorite button
  const handleLinkClick = (e) => {
    if (e.target.closest("button")) {
      e.preventDefault(); // Prevent the Link from navigating if the button is clicked
    }
  };

  // Fallback if images are empty or undefined, handle both uploads and public assets
  const imageUrl =
    images.length > 0
      ? images[0].startsWith("/uploads/")
        ? `${VITE_IMAGE_BASE_URL}${images[0]}`
        : `/assets/${images[0].replace(/^\/+/, "")}`
      : "/assets/fallback.jpg";

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("You must be logged in to add or remove favorites");
      return;
    }

    try {
      let updatedFavorites;
      if (isFavorited) {
        updatedFavorites = await removeFavorite(user._id, _id);
      } else {
        updatedFavorites = await addFavorite(user._id, _id);
      }
      setIsFavorited(updatedFavorites.includes(_id));
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  useEffect(() => {
    if (!user || !listing?._id) return;

    const checkIfFavorite = async () => {
      if (favoritesCache.has(user._id)) {
        const favorites = favoritesCache.get(user._id);
        setIsFavorited(favorites.includes(listing._id));
        return;
      }

      try {
        const res = await fetch(`${API_URL}/users/${user._id}/favorites`);
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const favorites = await res.json();
        const ids = favorites.map((fav) => fav._id);
        favoritesCache.set(user._id, ids);
        setIsFavorited(ids.includes(listing._id));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    checkIfFavorite();
  }, [listing?._id, user]);

  return (
    <Link
      to={`/${prefix}/${listing._id}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl flex flex-col relative"
      onClick={handleLinkClick}
    >
      <div
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${imageUrl})`, // Use imageUrl for background
        }}
      >
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500 p-2 rounded-full shadow-md z-20"
        >
          {isFavorited ? "♥" : "♡"}
        </button>
      </div>

      <div className="p-6 flex flex-col space-y-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-500">{location}</p>
        <p className="text-lg font-semibold text-blue-600">
          {price && !isNaN(Number(price))
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(price))
            : "Price not available"}
        </p>
      </div>
    </Link>
  );
}

// Separate functions for add and remove favorite actions (assuming you have them in api.js)
async function addFavorite(userId, listingId) {
  const res = await fetch(`${API_URL}/users/addFavorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      listingId,
    }),
  });
  return await res.json();
}

async function removeFavorite(userId, listingId) {
  const res = await fetch(`${API_URL}/users/removeFavorite`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      listingId,
    }),
  });
  return await res.json();
}
