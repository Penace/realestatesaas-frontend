import { useEffect, useState } from "react";
import {
  fetchPendingListings,
  approveListing,
  rejectListing,
} from "../services/api";
import ModalConfirm from "../components/ModalConfirm";
import Button from "../components/Button";
import { useToast } from "../context/ToastProvider";

export default function AdminModeration() {
  const [pendingListings, setPendingListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalMode, setModalMode] = useState(null); // "approve" or "reject"
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
      } else if (modalMode === "reject") {
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
    <div className="min-h-screen flex flex-col items-center p-10 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 mt-12">
        Moderate Listings
      </h1>

      {pendingListings.length === 0 ? (
        <p className="text-gray-500">No pending listings.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {pendingListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white p-6 rounded-xl shadow-md space-y-4"
            >
              <h2 className="text-2xl font-semibold text-gray-800">
                {listing.title}
              </h2>
              <p className="text-gray-500">{listing.location}</p>
              <p className="text-blue-600 font-semibold">{listing.price}</p>

              <div className="flex space-x-4 pt-4 justify-center">
                <Button variant="approve" size="sm">
                  Approve
                </Button>
                <Button variant="reject" size="sm">
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Confirm */}
      <ModalConfirm
        isOpen={!!selectedListing}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={
          modalMode === "approve"
            ? "Approve this listing?"
            : "Reject this listing?"
        }
        description="This action will update the listing's status immediately."
        loading={loading}
      />
    </div>
  );
}
