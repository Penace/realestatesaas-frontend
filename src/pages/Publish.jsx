import { createPendingListing } from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastProvider";
import ReviewModal from "../components/ReviewModal";
import TextInput from "../components/form/TextInput";
import TextareaInput from "../components/form/TextareaInput";
import PriceInput from "../components/form/PriceInput";
import ImageInput from "../components/form/ImageInput";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function optimizeAndUploadImages(imageListRaw) {
  const optimizedImages = [];

  for (let file of imageListRaw) {
    const formData = new FormData();
    formData.append("image", file, file.name);

    const uploadRes = await fetch(`${API_URL}/uploads`, {
      method: "POST",
      body: formData,
    });

    const { url } = await uploadRes.json();
    optimizedImages.push({ url });
  }

  return optimizedImages;
}

export default function Publish() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: [],
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
          Array.isArray(value) &&
          value.length > 0 &&
          value.every(
            (file) =>
              typeof file.name === "string" &&
              (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg"))
          )
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

    const optimizedImages = await optimizeAndUploadImages(images);

    const listing = {
      title: title.trim(),
      location: location.trim(),
      price: numericPrice.toString(),
      description: description.trim(),
      images: optimizedImages.map((img) =>
        typeof img === "string" ? img : img.url
      ),
      isFeatured: false,
      isAuction: false,
      isSponsored: false,
    };

    try {
      setSubmitting(true);
      const createdListing = await createPendingListing(listing);
      showToast("Listing submitted for review.", "success");
      setSubmitted(true);
      setShowReviewModal(false);
      setFormData({
        title: "",
        location: "",
        price: "",
        description: "",
        images: [],
      });
      navigate(`/pending/${createdListing._id}`);
    } catch (err) {
      console.error("Submission failed:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReview = async (e) => {
    e.preventDefault();

    const { title, location, price, description, images } = formData;

    const numericPrice = Number(price.replace(/[^0-9]/g, ""));
    const invalidImages = [];

    const listing = {
      title: title.trim(),
      location: location.trim(),
      price: numericPrice.toString(),
      description: description.trim(),
      images,
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
      images.length === 0
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
          listing={
            reviewData
              ? {
                  ...reviewData,
                  images: reviewData.images.map((img) =>
                    typeof img === "string"
                      ? { name: img.split("/").pop(), url: img }
                      : {
                          name: img.name,
                          url: URL.createObjectURL(img),
                        }
                  ),
                }
              : null
          }
          onClose={() => setShowReviewModal(false)}
          onConfirm={async (e) => {
            e.preventDefault();
            const { title, location, price, description, images } = formData;
            const numericPrice = Number(price.replace(/[^0-9]/g, ""));
            const optimizedImages = await optimizeAndUploadImages(
              formData.images
            );
            const listing = {
              title: title.trim(),
              location: location.trim(),
              price: numericPrice.toString(),
              description: description.trim(),
              images: optimizedImages.map((img) =>
                typeof img === "string" ? img : img.url
              ),
              isFeatured: false,
              isAuction: false,
              isSponsored: false,
            };
            try {
              setSubmitting(true);
              const createdListing = await createPendingListing(listing);
              showToast("Listing submitted for review.", "success");
              setSubmitted(true);
              setShowReviewModal(false);
              setFormData({
                title: "",
                location: "",
                price: "",
                description: "",
                images: [],
              });
              navigate(`/pending/${createdListing._id}`);
            } catch (err) {
              console.error("Submission failed:", err);
              showToast("Something went wrong. Please try again.", "error");
            } finally {
              setSubmitting(false);
            }
          }}
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

          <div className="pt-6 flex justify-center">
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
