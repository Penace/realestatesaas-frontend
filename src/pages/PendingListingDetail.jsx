import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPendingListings } from "../services/api";

export default function PendingListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchPendingListings();
        const found = all.find((l) => l.id === id);
        if (!found) throw new Error("Pending listing not found.");
        setListing(found);
      } catch (err) {
        setError(err.message);
      }
    }

    load();
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
        className="h-[60vh] bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{
          backgroundImage: `url('/assets/${
            listing.images?.[0] || "fallback.jpg"
          }')`,
        }}
      >
        <div className="h-full w-full bg-black/40 backdrop-blur-sm flex items-end justify-start p-6">
          <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full shadow backdrop-blur-sm">
            ⏳ Awaiting Approval
          </span>
        </div>
      </div>

      {/* Listing Details */}
      <div className="flex flex-col items-center p-10 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
        <p className="text-gray-500 text-lg">{listing.location}</p>
        <p className="text-blue-600 text-2xl font-semibold">
          ${Number(listing.price).toLocaleString()}
        </p>
        <p className="max-w-3xl text-gray-700 text-center mt-6 leading-relaxed">
          {listing.description}
        </p>

        {/* CTA Placeholder Row */}
        <div className="flex space-x-4 pt-4">
          <button className="px-6 py-3 rounded-xl bg-blue-100 text-blue-600 font-medium cursor-not-allowed shadow ring-1 ring-blue-300/30">
            Contact Seller
          </button>
          <button className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium cursor-not-allowed shadow ring-1 ring-gray-300/30">
            Schedule Viewing
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      {listing.images?.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 pb-20 max-w-5xl mx-auto">
          {listing.images.slice(1).map((img, idx) => (
            <img
              key={idx}
              src={`/assets/${img}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/fallback.jpg";
              }}
              alt={`Preview ${idx + 2}`}
              className="w-full h-72 object-cover rounded-xl shadow-sm"
            />
          ))}
        </div>
      )}
    </div>
  );
}
