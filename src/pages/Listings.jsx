import { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/listings`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch listings.");
        }
        const data = await response.json();
        setListings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const term = searchTerm.toLowerCase();
    return (
      listing.title.toLowerCase().includes(term) ||
      listing.location.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">
          Loading Listings...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center space-y-8 py-20 px-6">
      <h1 className="text-4xl font-bold text-gray-900">Featured Listings</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title or location..."
        className="mb-10 px-4 py-2 border border-gray-300 rounder-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
      />

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl transition-all duration-500">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))
        ) : (
          <div className="w-full max-w-7xl flex justify-center items-center py-20 text-gray-400 text-xl">
            No listings found.
          </div>
        )}
      </div>
    </div>
  );
}
