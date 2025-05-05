import { useEffect, useState } from "react";
import { fetchListingsByStatus } from "../services/api";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import { useAuth } from "../context/AuthProvider";
import DashboardSidebar from "../components/common/DashboardSidebar";

export default function AgentDashboard() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "draft";
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadListings() {
      try {
        // Add cache-busting timestamp to the status query
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
    <div className="flex">
      <DashboardSidebar
        title="Agent Panel"
        links={[
          { to: "/agent-dashboard", label: "My Listings" },
          { to: "/publish", label: "Create New Listing" },
          { to: "/agent-dashboard?status=pending", label: "Pending Approval" },
        ]}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 max-w-5xl mx-auto py-4 px-4 mb-24">
        <h1 className="text-2xl font-bold mb-4 capitalize">
          {status} Listings
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : listings.length === 0 ? (
          <>
            {console.log("Listings array is empty:", listings)}
            <p>
              {status === "draft"
                ? "No saved drafts found."
                : "No listings found for this status."}
            </p>
          </>
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
      </main>
    </div>
  );
}
