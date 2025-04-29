import { useState } from "react";
import Button from "../components/Button";

export default function Publish() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listing),
        }
      );

      if (!res.ok) throw new Error("Failed to submit listing");

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
                className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
              className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          <div className="pt-6">
            <Button size="lg" variant="primary" type="submit">
              Submit Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
