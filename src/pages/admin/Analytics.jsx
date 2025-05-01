import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastProvider";

export default function Analytics() {
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalListings: 0,
    pendingListings: 0,
    totalUsers: 0,
    activeAgents: 0,
    admins: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:4000/api/admin/stats");
        if (!res.ok) {
          const fallback = await res.text();
          throw new Error(`Fetch failed: ${res.status} - ${fallback}`);
        }
        const data = await res.json();
        console.log("Fetched analytics:", data);
        setStats(data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load analytics data", "error");
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Listings", value: stats.totalListings },
    { label: "Pending Listings", value: stats.pendingListings },
    { label: "Total Users", value: stats.totalUsers },
    { label: "Active Agents", value: stats.activeAgents },
    { label: "Admins", value: stats.admins },
  ];

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Platform Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={`${card.label}-${index}`}
            className="bg-white p-6 rounded-lg shadow text-center"
          >
            <div className="text-4xl font-bold text-blue-600">{card.value}</div>
            <div className="text-gray-700 mt-2">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
