import { useEffect, useState } from "react";
import {
  fetchPendingListings,
  approveListing,
  rejectListing,
} from "../../services/api";
import ModalConfirm from "../../components/common/ModalConfirm";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastProvider";
import ListingCard from "../../components/admin/AdminListingCard";

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
    try {
      const data = await fetchPendingListings(); // or fetchPendingListings
      setPendingListings([...data]); // force new array
      console.log("Loaded pending listings:", data);
    } catch (err) {
      showToast("Failed to fetch data", "error");
    }
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
        await approveListing(selectedListing._id);
        showToast("Listing approved!", "success");
      } else {
        await rejectListing(selectedListing._id);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {pendingListings.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No pending listings.
          </p>
        )}
        {pendingListings.map((listing) => (
          <ListingCard
            key={listing._id}
            id={listing._id}
            title={listing.title}
            location={listing.location}
            price={listing.price}
            image={
              listing.images?.length
                ? `/assets/${listing.images[0]}`
                : "/assets/fallback.jpg"
            }
            fallbackImage="/assets/fallback.jpg"
            to={`/pending/${listing._id}`}
            actions={[
              <Button
                key="approve"
                variant="approve"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openModal(listing, "approve");
                }}
              >
                Approve
              </Button>,
              <Button
                key="reject"
                variant="reject"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openModal(listing, "reject");
                }}
              >
                Reject
              </Button>,
            ]}
          />
        ))}
      </div>

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
