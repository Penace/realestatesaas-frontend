import { useEffect, useState, useRef } from "react";
import {
  fetchListings,
  deleteListing,
  updateListing,
} from "../../services/api";
import ModalConfirm from "../../components/common/ModalConfirm";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastProvider";
import { Link } from "react-router-dom";

export default function ManageListings() {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [savingListingId, setSavingListingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    price: "",
    tag: "",
  });
  const titleInputRef = useRef();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    loadListings().finally(() => setLoading(false));
  }, []);

  const loadListings = async () => {
    const data = await fetchListings();
    setListings(data);
  };

  const handleDelete = async () => {
    if (!selectedListing) return;
    setLoading(true);
    try {
      await deleteListing(selectedListing._id || selectedListing.id);
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

  if (loading && !listings.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={36} />
      </div>
    );
  }

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
              key={listing._id || listing.id}
              className="relative z-0 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out backdrop-blur-sm space-y-4"
            >
              {/* Thumbnail */}
              <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                {listing.images?.length ? (
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
                {editingListingId === (listing._id || listing.id) ? (
                  <>
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center text-gray-800"
                    />
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center text-gray-800"
                    />
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center text-gray-800"
                    />
                    <select
                      value={editForm.tag}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tag: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg text-center text-gray-800"
                    >
                      <option value="">No Tag</option>
                      <option value="featured">Featured</option>
                      <option value="auction">Auction</option>
                      <option value="sponsored">Sponsored</option>
                    </select>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {listing.title}
                    </h2>
                    <p className="text-gray-500">{listing.location}</p>
                    <p className="text-blue-600 font-semibold">
                      {listing.price && !isNaN(Number(listing.price))
                        ? `$${Number(listing.price).toLocaleString()}`
                        : "Price not available"}
                    </p>
                    {listing.tag && (
                      <p className="text-sm text-purple-600 font-medium">
                        {listing.tag}
                      </p>
                    )}
                  </>
                )}
              </div>

              {editingListingId !== (listing._id || listing.id) && (
                <Link
                  to={`/listings/${listing._id || listing.id}`}
                  className="absolute inset-0 z-0"
                  style={{ zIndex: 0 }}
                  aria-label="View listing details"
                />
              )}

              {/* Actions */}
              <div className="flex space-x-4 pt-4 justify-center z-10 relative">
                {editingListingId === (listing._id || listing.id) ? (
                  <>
                    <Button
                      size="sm"
                      variant="approve"
                      onClick={async () => {
                        setSavingListingId(editingListingId);
                        try {
                          await updateListing(editingListingId, editForm);
                          showToast("Listing updated.", "success");
                          await loadListings();
                          setEditingListingId(null);
                        } catch (err) {
                          console.error(err);
                          showToast("Failed to update listing.", "error");
                        } finally {
                          setSavingListingId(null);
                        }
                      }}
                    >
                      {savingListingId === (listing._id || listing.id) ? (
                        <div className="flex items-center justify-center space-x-2">
                          <LoadingSpinner size={18} />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        "Save"
                      )}
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
                        setEditingListingId(listing._id || listing.id);
                        setEditForm({
                          title: listing.title,
                          location: listing.location,
                          price: listing.price,
                          tag: listing.tag || "",
                        });
                        setTimeout(() => titleInputRef.current?.focus(), 10);
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
