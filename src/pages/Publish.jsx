import { useState } from "react";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastProvider";

export default function Publish() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "$",
    description: "",
    images: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name, value) => {
    if (!value.trim() || (name === "price" && value.trim() === "$")) {
      return "This field is required.";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for price field
    let newValue = value;
    if (name === "price") {
      newValue = value.startsWith("$")
        ? value
        : `$${value.replace(/[^0-9]/g, "")}`;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation
    const error = validateField(name, newValue);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      showToast("Please fix the form errors.", "error");
      return;
    }

    const listing = {
      ...formData,
      price: formData.price.trim(),
      images: formData.images.split(",").map((img) => img.trim()),
      isFeatured: false,
      isAuction: false,
      isSponsored: false,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/pendingListings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listing),
        }
      );

      if (!res.ok) throw new Error("Failed to submit listing");

      setSubmitted(true);
      setFormData({
        title: "",
        location: "",
        price: "$",
        description: "",
        images: "",
      });
      setFormErrors({});
    } catch (err) {
      console.error("Submission failed:", err);
      showToast("Submission failed. Please try again.", "error");
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
                className={`px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  formErrors[name]
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                } transition-all`}
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
              className={`px-4 py-3 border rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 ${
                formErrors.description
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              } transition-all`}
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
              className={`px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                formErrors.images
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              } transition-all`}
            />
          </div>

          <div className="pt-6">
            <Button size="lg" variant="primaryLight" type="submit">
              Submit Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
