// src/components/ReviewModal.jsx
import Button from "./common/Button";

export default function ReviewModal({ isOpen, onClose, onConfirm, listing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Review Listing
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>Title:</strong> {listing.title}
          </div>
          <div>
            <strong>Location:</strong> {listing.location}
          </div>
          <div>
            <strong>Price:</strong> ${Number(listing.price).toLocaleString()}
          </div>
          <div>
            <strong>Description:</strong>
            <p className="mt-1 text-gray-600">{listing.description}</p>
          </div>
          <div>
            <strong>Images:</strong>
            <ul className="mt-1 list-disc list-inside text-blue-500 space-y-1">
              {listing.images.map((img, i) => (
                <li key={i}>{img}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="primaryLight" onClick={onClose}>
            Edit
          </Button>
          <Button variant="approve" onClick={onConfirm}>
            Confirm & Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
