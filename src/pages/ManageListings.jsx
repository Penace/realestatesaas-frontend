import { useEffect, useState } from "react";
import { fetchListings, deleteListing } from "../services/api";
import ModalConfirm from "../components/ModalConfirm";
import Button from "../components/Button";
import { useToast } from "../context/ToastProvider";

export default function ManageListings() {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const data = await fetchListings();
    setListings(data);
  };

  const handleDelete = async () => {
    if (!selectedListing) return;
    setLoading(true);

    try {
      await deleteListing(selectedListing.id);
      showToast("Listing deleted.", "success");
      await loadListings();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete listing.", "error");
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-10 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 mt-12">
        Manage Listings
      </h1>

      {listings.length === 0 ? (
        <p className="text-gray-500">No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {listings.map((listing) => (
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
                <Button
                  size="sm"
                  variant="primaryLight"
                  onClick={() => console.log("Edit not implemented yet")}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="reject"
                  onClick={() => {
                    setSelectedListing(listing);
                    setModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ModalConfirm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete this listing?"
        description="This action cannot be undone."
        loading={loading}
      />
    </div>
  );
}
