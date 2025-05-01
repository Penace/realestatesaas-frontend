import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function ListingCard({
  _id,
  images,
  title,
  location,
  price,
  prefix = "listings",
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth(); // Get the current user from context

  // Prevent default behavior of Link when clicking on the favorite button
  const handleLinkClick = (e) => {
    if (e.target.closest("button")) {
      e.preventDefault(); // Prevent the Link from navigating if the button is clicked
    }
  };

  // Fallback if images are empty or undefined
  const imageUrl =
    images && images.length > 0
      ? `/assets/${images[0]}`
      : "/assets/fallback.jpg"; // Use fallback if no image

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
    if (!user) return;

    const checkIfFavorite = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${user._id}/favorites`);
        if (res.ok) {
          const favorites = await res.json();
          setIsFavorited(favorites.some((fav) => fav._id === _id));
        } else {
          throw new Error("Failed to fetch favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    checkIfFavorite();
  }, [_id, user]);

  return (
    <Link
      to={`/${prefix}/${_id}`}
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
