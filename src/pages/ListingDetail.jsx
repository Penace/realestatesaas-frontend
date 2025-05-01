import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthProvider"; // Assuming you're using Auth context

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth(); // Access the current user from the auth context
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    console.log("Fetching:", `${import.meta.env.VITE_API_URL}/listings/${id}`);
    async function fetchListing() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/listings/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch listing.");
        }
        const data = await response.json();
        setListing(data);

        // Check if the listing is favorited by the current user
        if (user) {
          const res = await fetch(`/api/users/${user._id}/favorites`);
          const favorites = await res.json();
          setIsFavorited(favorites.some((fav) => fav._id === id)); // Check if the listing is in the user's favorites
        }
      } catch (err) {
        setError(err.message);
      }
    }

    fetchListing();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      alert("You must be logged in to add favorites");
      return;
    }

    try {
      // Send the request to add/remove from favorites
      const res = await fetch("/api/users/addFavorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id, // Use the logged-in user's ID
          listingId: id,
        }),
      });

      const updatedFavorites = await res.json();
      setIsFavorited(updatedFavorites.includes(id)); // Update the favorite state based on response
    } catch (error) {
      console.error("Error adding favorite:", error);
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
    <div className="min-h-screen flex flex-col">
      {/* Hero Image */}
      <div
        className="h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(/assets/${
            listing.images?.[0] || "fallback.jpg"
          })`,
        }}
      ></div>

      {/* Property Details */}
      <div className="flex flex-col items-center p-10 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
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
          onClick={toggleFavorite}
          size="lg"
          variant={isFavorited ? "primaryLight" : "secondary"}
        >
          {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
      </div>
    </div>
  );
}
