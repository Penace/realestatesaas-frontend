import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastProvider";
import ReviewModal from "../components/ReviewModal";
import TextInput from "../components/form/TextInput";
import TextareaInput from "../components/form/TextareaInput";
import PriceInput from "../components/form/PriceInput";
import ImageInput from "../components/form/ImageInput";

export default function Publish() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: "",
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (field, value) => {
    switch (field) {
      case "title":
      case "location":
        return value.trim().length >= 3;
      case "price":
        const numeric = Number(value.replace(/[^0-9.]/g, ""));
        return !isNaN(numeric) && numeric >= 100;
      case "description":
        return value.trim().length >= 10;
      case "images":
        return (
          value.split(",").filter((img) => img.trim().endsWith(".jpg")).length >
          0
        );
      default:
        return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "price") {
      newValue = value.replace(/[^\d]/g, "");
      if (newValue.length > 0) {
        newValue = `$${newValue}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: !validate(name, newValue),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, location, price, description, images } = formData;

    const numericPrice = Number(price.replace(/[^0-9]/g, ""));
    const imageListRaw = images.split(",").map((img) => img.trim());
    const invalidImages = imageListRaw.filter(
      (img) => !img.endsWith(".jpg") && !img.endsWith(".jpeg")
    );

    const listing = {
      title: title.trim(),
      location: location.trim(),
      price: numericPrice.toString(),
      description: description.trim(),
      images: imageListRaw,
      isFeatured: false,
      isAuction: false,
      isSponsored: false,
    };

    try {
      setSubmitting(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/pendingListings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listing),
        }
      );

      if (!res.ok) throw new Error("Failed to submit listing");

      const createdListing = await res.json();

      showToast("Listing submitted for review.", "success");
      setSubmitted(true);
      setShowReviewModal(false);

      setFormData({
        title: "",
        location: "",
        price: "",
        description: "",
        images: "",
      });

      navigate(`/pending/${createdListing.id}`);
    } catch (err) {
      console.error("Submission failed:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReview = (e) => {
    e.preventDefault();

    const { title, location, price, description, images } = formData;

    const numericPrice = Number(price.replace(/[^0-9]/g, ""));
    const imageListRaw = images.split(",").map((img) => img.trim());
    const invalidImages = imageListRaw.filter(
      (img) => !img.endsWith(".jpg") && !img.endsWith(".jpeg")
    );

    const listing = {
      title: title.trim(),
      location: location.trim(),
      price: numericPrice.toString(),
      description: description.trim(),
      images: imageListRaw,
      isFeatured: false,
      isAuction: false,
      isSponsored: false,
    };

    if (
      title.trim().length < 3 ||
      location.trim().length < 3 ||
      description.trim().length < 10 ||
      isNaN(numericPrice) ||
      numericPrice < 100 ||
      numericPrice > 999999999 ||
      imageListRaw.length === 0 ||
      invalidImages.length > 0
    ) {
      showToast("Please fix the errors before reviewing.", "error");
      return;
    }

    setReviewData(listing);
    setShowReviewModal(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-20 px-6">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Publish Your Listing
        </h1>

        {submitted && (
          <div className="p-4 rounded-xl bg-green-100 text-green-700 font-medium text-center shadow">
            ✅ Your listing has been submitted!
          </div>
        )}

        <ReviewModal
          isOpen={showReviewModal}
          listing={reviewData}
          onClose={() => setShowReviewModal(false)}
          onConfirm={handleSubmit}
        />

        <form className="space-y-6" onSubmit={handleOpenReview}>
          <TextInput
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Luxury Penthouse"
            error={errors.title}
          />
          <TextInput
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            placeholder="New York City, NY"
            error={errors.location}
          />
          <PriceInput
            name="price"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
          />
          <TextareaInput
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your property in detail..."
            error={errors.description}
          />
          <ImageInput
            name="images"
            value={formData.images}
            onChange={handleChange}
            error={errors.images}
          />

          <div className="pt-6">
            <Button
              size="lg"
              variant="primaryLight"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
