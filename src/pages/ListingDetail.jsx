import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
      }
    }

    fetchListing();
  }, [id]);

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

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Listing Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The listing you're trying to view doesn't exist or was removed.
          </p>
          <Button variant="primaryLight" to="/listings">
            Browse Listings
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Image */}
      <div
        className="h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(/assets/${listing.images[0]})` }}
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
      </div>
    </div>
  );
}
