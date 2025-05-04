import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick"; // Import the slick carousel
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthProvider"; // Assuming you're using Auth context

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth(); // Access the current user from the auth context
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchListing() {
      try {
        // Fetch listing data from the API
        const response = await fetch(`${API_URL}/listings/${id}`, {
          headers: {
            "Cache-Control": "no-cache", // Disable caching to force fresh response
          },
        });

        // Ensure response is okay and content type is JSON
        if (
          response.ok &&
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await response.json();
          setListing(data);

          // Check if the listing is favorited by the current user
          if (user) {
            const res = await fetch(`${API_URL}/users/${user._id}/favorites`);
            const favorites = await res.json();

            // Log favorites to check if we are receiving the correct data
            console.log("User Favorites:", favorites);

            // Set the favorite status based on the user's favorites
            const isFavorite = favorites.some((fav) => fav._id === id);
            setIsFavorited(isFavorite);
          }
        } else {
          setError("Failed to load listing data.");
          console.error("Unexpected response format:", response);
        }
      } catch (err) {
        setError("Failed to fetch listing.");
        console.error("Fetch error:", err);
      }
    }

    fetchListing();
  }, [id, user]); // Depend on `id` and `user` to re-fetch if they change

  const handleFavoriteClick = async () => {
    if (!user) {
      alert("You must be logged in to add or remove favorites");
      return;
    }

    try {
      let updatedFavorites;
      if (isFavorited) {
        updatedFavorites = await removeFavorite(user._id, id);
      } else {
        updatedFavorites = await addFavorite(user._id, id);
      }

      // Update the favorite state based on the response
      setIsFavorited(updatedFavorites.includes(id));
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  // Navigate to next image
  const handleNextImage = () => {
    if (listing?.images?.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Navigate to previous image
  const handlePreviousImage = () => {
    if (listing?.images?.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Hero Image with Manual Navigation */}
      <div
        className="hero-image"
        style={{
          backgroundImage: `url(/assets/${listing.images[currentImageIndex]})`,
          backgroundSize: "cover", // Ensures it covers the entire container
          backgroundPosition: "center center",
        }}
      >
        {/* Hiding the img tag as it's covered by background */}
        <img
          src={`/assets/${listing.images[currentImageIndex]}`}
          alt="Listing Image"
          className="hidden" // Hide this image since it's covered by backgroundImage
        />
        {/* Buttons for navigation */}
        {listing.images?.length > 1 && (
          <div className="absolute top-60 left-0 right-0 flex justify-between px-4 z-10">
            <button
              onClick={handlePreviousImage}
              className="bg-white bg-opacity-50 p-2 rounded-full"
            >
              Previous
            </button>
            <button
              onClick={handleNextImage}
              className="bg-white bg-opacity-50 p-2 rounded-full"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="flex flex-col items-center p-10 space-y-6">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          {listing.title}
        </h1>
        <p className="text-gray-500 text-lg">{listing.location}</p>
        <p className="text-blue-600 text-2xl font-semibold">
          {listing.price && !isNaN(Number(listing.price))
            ? `$${Number(listing.price).toLocaleString()}`
            : "Price not available"}
        </p>
        <p className="max-w-3xl text-gray-700 text-center mt-6">
          {listing.description}
        </p>

        {/* Favorite Button */}
        <Button
          onClick={handleFavoriteClick}
          size="lg"
          variant={isFavorited ? "primaryLight" : "cta"}
        >
          {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        </Button>

        {/* Contact Agent Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => alert("Contacting the agent...")}
            size="lg"
            variant="primaryLight"
          >
            Contact Agent
          </Button>
        </div>
      </div>
    </div>
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

  if (res.ok) {
    return await res.json();
  }
  throw new Error("Failed to add to favorites");
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

  if (res.ok) {
    return await res.json();
  }
  throw new Error("Failed to remove from favorites");
}
