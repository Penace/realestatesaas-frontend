import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function AdminModeration() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/pendingListings`)
      .then((res) => res.json())
      .then(setPending)
      .catch((err) => console.error("Failed to fetch pending listings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (listing) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...listing,
          id: listing.id || crypto.randomUUID(),
        }),
      });

      await fetch(
        `${import.meta.env.VITE_API_URL}/pendingListings/${listing.id}`,
        {
          method: "DELETE",
        }
      );

      setPending(pending.filter((l) => l.id !== listing.id));
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/pendingListings/${id}`, {
        method: "DELETE",
      });

      setPending(pending.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-mono">
      <h1 className="text-3xl font-bold mb-6 border-b border-white/10 pb-2 mt-10">
        Admin Moderation Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading pending listings...</p>
      ) : pending.length === 0 ? (
        <p className="text-green-400">No pending listings. All clear.</p>
      ) : (
        <div className="grid gap-6">
          {pending.map((listing) => (
            <div
              key={listing.id}
              className="border border-white/10 bg-gray-900 p-6 rounded-lg shadow-inner flex flex-col space-y-4"
            >
              <div className="text-lg font-semibold text-cyan-300">
                {listing.title}
              </div>
              <div className="text-sm text-gray-400">{listing.location}</div>
              <div className="text-sm text-gray-500">{listing.description}</div>

              {listing.images?.length > 0 && (
                <div className="mt-2 overflow-hidden rounded-md border border-white/5 w-full max-w-xs">
                  <img
                    src={`/assets/${listing.images[0]}`}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              <div className="flex space-x-4 mt-4">
                <Button
                  onClick={() => handleApprove(listing)}
                  variant="primary"
                  size="sm"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(listing.id)}
                  variant="secondary"
                  size="sm"
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
