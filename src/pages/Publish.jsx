import { useState } from "react";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastProvider";

export default function Publish() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, location, price, description, images } = formData;

    // --- Strict Validation
    if (
      title.trim().length < 3 ||
      location.trim().length < 3 ||
      description.trim().length < 10
    ) {
      showToast("Please fill out all fields properly.", "error");
      return;
    }

    const numericPrice = Number(price.replace(/[^0-9.]/g, ""));
    if (isNaN(numericPrice) || numericPrice < 100) {
      showToast("Please enter a valid price (at least 3 digits).", "error");
      return;
    }

    const imageList = images
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.endsWith(".jpg") || img.endsWith(".jpeg"));

    if (imageList.length === 0) {
      showToast(
        "Please provide at least one valid image filename (.jpg).",
        "error"
      );
      return;
    }

    // --- Construct listing object
    const listing = {
      title: title.trim(),
      location: location.trim(),
      price: numericPrice.toString(),
      description: description.trim(),
      images: imageList,
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

      showToast("Listing submitted for review.", "success");
      setSubmitted(true);
      setFormData({
        title: "",
        location: "",
        price: "",
        description: "",
        images: "",
      });
    } catch (err) {
      console.error("Submission failed:", err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          {[
            { name: "title", label: "Title", placeholder: "Luxury Penthouse" },
            {
              name: "location",
              label: "Location",
              placeholder: "New York City, NY",
            },
            { name: "price", label: "Price", placeholder: "$4,500,000" },
          ].map(({ name, label, placeholder }) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="text-sm font-medium text-gray-700 mb-1"
              >
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-800"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your property in detail..."
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-800"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="images"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Image Filenames (comma-separated)
            </label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="villa1.jpg, villa2.jpg"
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-800"
            />
          </div>

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
