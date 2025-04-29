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
  const [editingListingId, setEditingListingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
  });

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
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out backdrop-blur-sm space-y-4"
            >
              {/* Thumbnail */}
              <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                {listing.images && listing.images.length > 0 ? (
                  <img
                    src={`/assets/${listing.images[0]}`}
                    alt={listing.title}
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
                {editingListingId === listing.id ? (
                  <>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center"
                    />
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center"
                    />
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {listing.title}
                    </h2>
                    <p className="text-gray-500">{listing.location}</p>
                    <p className="text-blue-600 font-semibold">
                      {listing.price}
                    </p>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4 justify-center">
                {editingListingId === listing.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="approve"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          await updateListing(editingListingId, editForm);
                          showToast("Listing updated.", "success");
                          await loadListings();
                          setEditingListingId(null); // Exit edit mode
                        } catch (err) {
                          console.error(err);
                          showToast("Failed to update listing.", "error");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="reject"
                      onClick={() => setEditingListingId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="primaryLight"
                      onClick={() => {
                        setEditingListingId(listing.id);
                        setEditForm({
                          title: listing.title,
                          location: listing.location,
                          price: listing.price,
                        });
                      }}
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
                  </>
                )}
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
