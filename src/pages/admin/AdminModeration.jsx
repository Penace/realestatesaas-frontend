import { useEffect, useState } from "react";
import {
  fetchPendingListings,
  approveListing,
  rejectListing,
} from "../../services/api";
import ModalConfirm from "../../components/common/ModalConfirm";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastProvider";

export default function AdminModeration() {
  const [pendingListings, setPendingListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    const listings = await fetchPendingListings();
    setPendingListings(listings);
  };

  const openModal = (listing, mode) => {
    setSelectedListing(listing);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedListing(null);
    setModalMode(null);
  };

  const handleConfirm = async () => {
    if (!selectedListing) return;
    setLoading(true);

    try {
      if (modalMode === "approve") {
        await approveListing(selectedListing.id);
        showToast("Listing approved!", "success");
      } else {
        await rejectListing(selectedListing.id);
        showToast("Listing rejected!", "success");
      }
      await loadPending();
    } catch (err) {
      console.error(err);
      showToast("Action failed. Please try again.", "error");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6 bg-gray-50 space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">
        Moderate Listings
      </h1>

      {pendingListings.length === 0 ? (
        <p className="text-gray-500">No pending listings.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {pendingListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out space-y-4"
            >
              {/* Thumbnail */}
              <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                {listing.images?.length > 0 ? (
                  <img
                    src={`/assets/${listing.images[0]}`}
                    alt={listing.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/fallback.jpg"; // ← Add a soft default fallback image here
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {listing.title}
                </h2>
                <p className="text-gray-500">{listing.location}</p>
                <p className="text-blue-600 font-semibold">
                  ${Number(listing.price).toLocaleString()}
                </p>{" "}
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4 justify-center">
                <Button
                  variant="approve"
                  size="sm"
                  onClick={() => openModal(listing, "approve")}
                >
                  Approve
                </Button>
                <Button
                  variant="reject"
                  size="sm"
                  onClick={() => openModal(listing, "reject")}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      <ModalConfirm
        isOpen={!!selectedListing}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={
          modalMode === "approve"
            ? "Approve this listing?"
            : "Reject this listing?"
        }
        description="This action cannot be undone."
        loading={loading}
      />
    </div>
  );
}
