import { useEffect, useState } from "react";
import { fetchListingsByStatus } from "../services/api";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import { useAuth } from "../context/AuthProvider";

export default function AgentDashboard() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "draft";
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetchListingsByStatus(status, user?._id);
        console.log("Fetched Listings:", res); // Debug log
        setListings(res);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user?._id) {
      loadListings();
    }
  }, [status, user]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4 capitalize">{status} Listings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p>No listings found for status: {status}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={{ ...listing, _id: listing._id }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
