import { createListing } from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastProvider";
import ReviewModal from "../components/ReviewModal";
import TextInput from "../components/form/TextInput";
import TextareaInput from "../components/form/TextareaInput";
import PriceInput from "../components/form/PriceInput";
import ImageInput from "../components/form/ImageInput";
import Dropdown from "../components/form/Dropdown";
import DateInput from "../components/form/DateInput";
import CommaInput from "../components/form/CommaInput";

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
    address: "",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    propertyType: "",
    yearBuilt: "",
    parkingAvailable: "",
    listingType: "",
    availableFrom: "",
    features: "",
    amenities: "",
    facilities: "",
    slug: "",
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
      case "address":
      case "propertyType":
      case "parkingAvailable":
      case "slug":
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
      case "bedrooms":
      case "bathrooms":
      case "squareFootage":
      case "yearBuilt":
        const numVal = Number(value);
        return !isNaN(numVal) && numVal >= 0;
      case "listingType":
        return value.trim().length > 0;
      case "availableFrom":
        return !isNaN(Date.parse(value));
      case "features":
      case "amenities":
        return value.trim().length > 0;
      case "facilities":
        return value.trim().length > 0;
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

    const {
      title,
      location,
      price,
      description,
      images,
      address,
      bedrooms,
      bathrooms,
      squareFootage,
      propertyType,
      yearBuilt,
      parkingAvailable,
      listingType,
      availableFrom,
      features,
      amenities,
      facilities,
      slug,
    } = formData;

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
      address: address.trim(),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      squareFootage: Number(squareFootage),
      propertyType: propertyType.trim(),
      yearBuilt: Number(yearBuilt),
      parkingAvailable: parkingAvailable.trim(),
      listingType: listingType.trim(),
      availableFrom: new Date(availableFrom),
      features: features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      amenities: amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      facilities: facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      slug: slug.trim(),
      isFeatured: false,
      isAuction: false,
      isSponsored: false,
    };

    try {
      setSubmitting(true);
      const createdListing = await createListing(listing);
      showToast("Listing submitted for review.", "success");
      setSubmitted(true);
      setShowReviewModal(false);
      setFormData({
        title: "",
        location: "",
        price: "",
        description: "",
        images: [],
        address: "",
        bedrooms: "",
        bathrooms: "",
        squareFootage: "",
        propertyType: "",
        yearBuilt: "",
        parkingAvailable: "",
        listingType: "",
        availableFrom: "",
        features: "",
        amenities: "",
        facilities: "",
        slug: "",
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

    const {
      title,
      location,
      price,
      description,
      images,
      address,
      bedrooms,
      bathrooms,
      squareFootage,
      propertyType,
      yearBuilt,
      parkingAvailable,
      listingType,
      availableFrom,
      features,
      amenities,
      facilities,
      slug,
    } = formData;

    const numericPrice = Number(price.replace(/[^0-9]/g, ""));

    if (
      title.trim().length < 3 ||
      location.trim().length < 3 ||
      description.trim().length < 10 ||
      isNaN(numericPrice) ||
      numericPrice < 100 ||
      numericPrice > 999999999 ||
      images.length === 0 ||
      address.trim().length < 3 ||
      isNaN(Number(bedrooms)) ||
      isNaN(Number(bathrooms)) ||
      isNaN(Number(squareFootage)) ||
      propertyType.trim().length < 3 ||
      isNaN(Number(yearBuilt)) ||
      parkingAvailable.trim().length < 3 ||
      listingType.trim().length === 0 ||
      isNaN(Date.parse(availableFrom)) ||
      features.trim().length === 0 ||
      amenities.trim().length === 0 ||
      facilities.trim().length === 0 ||
      slug.trim().length < 3
    ) {
      showToast("Please fix the errors before reviewing.", "error");
      return;
    }

    const listing = {
      title: title.trim(),
      location: location.trim(),
      price: numericPrice.toString(),
      description: description.trim(),
      images,
      address: address.trim(),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      squareFootage: Number(squareFootage),
      propertyType: propertyType.trim(),
      yearBuilt: Number(yearBuilt),
      parkingAvailable: parkingAvailable.trim(),
      listingType: listingType.trim(),
      availableFrom: new Date(availableFrom),
      features: features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      amenities: amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      facilities: facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      slug: slug.trim(),
      isFeatured: false,
      isAuction: false,
      isSponsored: false,
    };

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
            const {
              title,
              location,
              price,
              description,
              images,
              address,
              bedrooms,
              bathrooms,
              squareFootage,
              propertyType,
              yearBuilt,
              parkingAvailable,
              listingType,
              availableFrom,
              features,
              amenities,
              facilities,
              slug,
            } = formData;
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
              address: address.trim(),
              bedrooms: Number(bedrooms),
              bathrooms: Number(bathrooms),
              squareFootage: Number(squareFootage),
              propertyType: propertyType.trim(),
              yearBuilt: Number(yearBuilt),
              parkingAvailable: parkingAvailable.trim(),
              listingType: listingType.trim(),
              availableFrom: new Date(availableFrom),
              features: features
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean),
              amenities: amenities
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
              facilities: facilities
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean),
              slug: slug.trim(),
              isFeatured: false,
              isAuction: false,
              isSponsored: false,
            };
            try {
              setSubmitting(true);
              const createdListing = await createListing(listing);
              showToast("Listing submitted for review.", "success");
              setSubmitted(true);
              setShowReviewModal(false);
              setFormData({
                title: "",
                location: "",
                price: "",
                description: "",
                images: [],
                address: "",
                bedrooms: "",
                bathrooms: "",
                squareFootage: "",
                propertyType: "",
                yearBuilt: "",
                parkingAvailable: "",
                listingType: "",
                availableFrom: "",
                features: "",
                amenities: "",
                facilities: "",
                slug: "",
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
          <TextInput
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
            error={errors.address}
          />
          <PriceInput
            name="price"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
          />
          <TextInput
            name="bedrooms"
            label="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="3"
            error={errors.bedrooms}
          />
          <TextInput
            name="bathrooms"
            label="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="2"
            error={errors.bathrooms}
          />
          <TextInput
            name="squareFootage"
            label="Square Footage"
            value={formData.squareFootage}
            onChange={handleChange}
            placeholder="1500"
            error={errors.squareFootage}
          />
          <TextInput
            name="propertyType"
            label="Property Type"
            value={formData.propertyType}
            onChange={handleChange}
            placeholder="Apartment"
            error={errors.propertyType}
          />
          <TextInput
            name="yearBuilt"
            label="Year Built"
            value={formData.yearBuilt}
            onChange={handleChange}
            placeholder="1990"
            error={errors.yearBuilt}
          />
          <TextInput
            name="parkingAvailable"
            label="Parking Available"
            value={formData.parkingAvailable}
            onChange={handleChange}
            placeholder="Yes"
            error={errors.parkingAvailable}
          />
          <Dropdown
            name="listingType"
            label="Listing Type"
            value={formData.listingType}
            onChange={handleChange}
            options={[
              { label: "For Sale", value: "sale" },
              { label: "For Rent", value: "rent" },
              { label: "Auction", value: "auction" },
            ]}
            error={errors.listingType}
          />

          <TextInput
            name="slug"
            label="Slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="luxury-penthouse-nyc"
            error={errors.slug}
          />
          <DateInput
            name="availableFrom"
            label="Available From"
            value={formData.availableFrom}
            onChange={handleChange}
            error={errors.availableFrom}
          />
          <CommaInput
            name="features"
            label="Features"
            value={formData.features}
            onChange={handleChange}
            error={errors.features}
            suggestions={[
              "swimmingPool",
              "garden",
              "garage",
              "fireplace",
              "balcony",
              "gym",
              "furnished",
              "airConditioning",
              "securitySystem",
              "smartHome",
              "petFriendly",
              "elevator",
              "seaView",
            ]}
          />
          <CommaInput
            name="amenities"
            label="Amenities"
            value={formData.amenities}
            onChange={handleChange}
            error={errors.amenities}
            suggestions={[
              "pool",
              "wifi",
              "parking",
              "laundry",
              "cableTV",
              "cleaningService",
              "elevator",
              "gym",
              "petFriendly",
              "securitySystem",
            ]}
          />
          <CommaInput
            name="facilities"
            label="Facilities"
            value={formData.facilities}
            onChange={handleChange}
            error={errors.facilities}
            suggestions={[
              "kitchen",
              "bathroom",
              "parking",
              "laundryRoom",
              "accessibleEntrance",
              "storageRoom",
              "garage",
              "outdoorGrill",
              "backupGenerator",
              "waterTank",
            ]}
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
