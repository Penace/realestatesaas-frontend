import { createListing } from "../services/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getListingById, updateListing } from "../services/api";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastProvider";
import { useAuth } from "../context/AuthProvider";
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
  const { id: draftId } = useParams();
  const location = useLocation(); // moved here
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
  // Track whether we're restoring draft from localStorage
  const [isRestoringDraft, setIsRestoringDraft] = useState(true);

  // Determine if editing or creating a new listing, and set the correct localStorage key
  const isEditing =
    (location.pathname.includes("/publish/draft/") ||
      location.pathname.includes("/listings/")) &&
    draftId;
  const storageKey = isEditing
    ? `editDraftForm_${draftId}`
    : "newListingDraftForm";

  // Restore form data from localStorage if available
  useEffect(() => {
    const savedForm = localStorage.getItem(storageKey);

    // Only restore if not editing an existing draft for new publish page
    const isNewPublishPage =
      location.pathname === "/publish" || location.pathname === "/publish/";

    if (
      savedForm &&
      ((isEditing && location.pathname.includes("/listings/")) ||
        (!isEditing && isNewPublishPage))
    ) {
      try {
        const parsedForm = JSON.parse(savedForm);
        if (
          parsedForm &&
          typeof parsedForm === "object" &&
          Object.keys(parsedForm).length > 5
        ) {
          setFormData(parsedForm);
        }
      } catch (err) {
        console.error("Failed to parse saved draft from localStorage:", err);
      }
    }

    setIsRestoringDraft(false);
    // eslint-disable-next-line
  }, [draftId, location.pathname]);

  // Show toast after restoring draft from previous session (only for new listing)
  useEffect(() => {
    if (!isRestoringDraft && !isEditing) {
      showToast("Draft restored from previous session", "info");
    }
  }, [isRestoringDraft, isEditing]);
  // Warn user if leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formData.title || formData.description) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData]);

  // Persist form data to localStorage whenever it changes,
  // but avoid overwriting valid saved form data with an empty form
  useEffect(() => {
    // Avoid overwriting valid saved form data with an empty form
    const isFormMostlyEmpty =
      Object.values(formData).filter((v) => !!v && v !== "").length < 2;
    if (!isFormMostlyEmpty) {
      localStorage.setItem(storageKey, JSON.stringify(formData));
    }
  }, [formData, storageKey]);

  const { user } = useAuth();
  // (isEditing moved above)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Unconditionally run this effect, but early return if restoring draft
  useEffect(() => {
    if (isRestoringDraft) return;
    if (!user || !user._id) {
      showToast("You must be logged in to publish a listing.", "error");
      // Optionally, redirect to login page here if desired, e.g.:
      // navigate("/login");
    }
    // No toast for isRestoringDraft, just block render
  }, [user, isRestoringDraft, showToast]);

  useEffect(() => {
    if (isEditing) {
      (async () => {
        try {
          const draft = await getListingById(draftId);
          if (!draft) return;

          const loadedFormData = {
            title: draft.title || "",
            location: draft.location || "",
            price: draft.price ? `$${draft.price}` : "",
            description: draft.description || "",
            images: draft.images || [],
            address: draft.address || "",
            bedrooms: draft.bedrooms?.toString() || "",
            bathrooms: draft.bathrooms?.toString() || "",
            squareFootage: draft.squareFootage?.toString() || "",
            propertyType: draft.propertyType || "",
            yearBuilt: draft.yearBuilt?.toString() || "",
            parkingAvailable: draft.parkingAvailable || "",
            listingType: draft.listingType || "",
            availableFrom: draft.availableFrom
              ? new Date(draft.availableFrom).toISOString().split("T")[0]
              : "",
            features: draft.features?.join(", ") || "",
            amenities: draft.amenities?.join(", ") || "",
            facilities: draft.facilities?.join(", ") || "",
            slug: draft.slug || "",
          };
          setFormData(loadedFormData);
          // Persist loaded draft to localStorage for consistency
          localStorage.setItem(storageKey, JSON.stringify(loadedFormData));
        } catch (err) {
          console.error("Failed to load draft:", err);
          showToast("Failed to load draft", "error");
        }
      })();
    }
  }, [isEditing, draftId, storageKey, showToast]);

  // Determine if we should block rendering (after all hooks)
  const shouldBlockRender = !user || !user._id || isRestoringDraft;
  if (shouldBlockRender) return null;

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
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i),
      amenities: amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i),
      facilities: facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i),
      slug: slug.trim(),
      status: "pending",
      createdBy: user._id,
      // Removed isFeatured, isAuction, isSponsored. These are admin controlled.
    };

    try {
      setSubmitting(true);
      const createdListing = await createListing(listing);
      if (!createdListing || !createdListing._id) {
        throw new Error("Listing creation failed or invalid response");
      }
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
      // Remove draft backup from localStorage after successful submit
      localStorage.removeItem(storageKey);
      // Redirect to dashboard pending listings instead of the new listing page
      navigate("/dashboard/listings?status=pending");
      return;
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
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i),
      amenities: amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i),
      facilities: facilities
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i),
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
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Publish Your Listing
          </h1>
          {!isEditing && (
            <button
              type="button"
              className="text-sm text-red-500 hover:underline"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to clear the entire form?"
                );
                if (confirmed) {
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
                  localStorage.removeItem("newListingDraftForm");
                  showToast("Form cleared.", "info");
                }
              }}
            >
              🧹 Clear Form
            </button>
          )}
        </div>

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
              status: "pending",
              createdBy: user._id,
              // Removed isFeatured, isAuction, isSponsored. These are admin controlled.
            };
            try {
              setSubmitting(true);
              const createdListing = await createListing(listing);
              if (!createdListing || !createdListing._id) {
                throw new Error("Listing creation failed or invalid response");
              }
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
              // Remove draft backup from localStorage after successful submit
              localStorage.removeItem(storageKey);
              // Redirect to dashboard pending listings instead of the new listing page
              navigate("/dashboard/listings?status=pending");
              return;
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
            helperText={
              errors.title ? "Title must be at least 3 characters." : ""
            }
          />
          <TextInput
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            placeholder="New York City, NY"
            error={errors.location}
            helperText={
              errors.location ? "Location must be at least 3 characters." : ""
            }
          />
          <TextInput
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
            error={errors.address}
            helperText={
              errors.address ? "Address must be at least 3 characters." : ""
            }
          />
          <PriceInput
            name="price"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            helperText={errors.price ? "Price must be at least $100." : ""}
          />
          <TextInput
            name="bedrooms"
            label="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="3"
            error={errors.bedrooms}
            helperText={
              errors.bedrooms ? "Please enter a valid number of bedrooms." : ""
            }
          />
          <TextInput
            name="bathrooms"
            label="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="2"
            error={errors.bathrooms}
            helperText={
              errors.bathrooms
                ? "Please enter a valid number of bathrooms."
                : ""
            }
          />
          <TextInput
            name="squareFootage"
            label="Square Footage"
            value={formData.squareFootage}
            onChange={handleChange}
            placeholder="1500"
            error={errors.squareFootage}
            helperText={
              errors.squareFootage ? "Please enter a valid square footage." : ""
            }
          />
          <TextInput
            name="propertyType"
            label="Property Type"
            value={formData.propertyType}
            onChange={handleChange}
            placeholder="Apartment"
            error={errors.propertyType}
            helperText={
              errors.propertyType
                ? "Property type must be at least 3 characters."
                : ""
            }
          />
          <TextInput
            name="yearBuilt"
            label="Year Built"
            value={formData.yearBuilt}
            onChange={handleChange}
            placeholder="1990"
            error={errors.yearBuilt}
            helperText={errors.yearBuilt ? "Please enter a valid year." : ""}
          />
          <TextInput
            name="parkingAvailable"
            label="Parking Available"
            value={formData.parkingAvailable}
            onChange={handleChange}
            placeholder="Yes"
            error={errors.parkingAvailable}
            helperText={
              errors.parkingAvailable
                ? "Parking must be at least 3 characters."
                : ""
            }
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
            helperText={
              errors.listingType ? "Please select a listing type." : ""
            }
          />
          <TextInput
            name="slug"
            label="Slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="luxury-penthouse-nyc"
            error={errors.slug}
            helperText={
              errors.slug ? "Slug must be at least 3 characters." : ""
            }
          />
          <DateInput
            name="availableFrom"
            label="Available From"
            value={formData.availableFrom}
            onChange={handleChange}
            error={errors.availableFrom}
            helperText={
              errors.availableFrom ? "Please enter a valid date." : ""
            }
          />
          <CommaInput
            name="features"
            label="Features"
            value={formData.features}
            onChange={handleChange}
            error={errors.features}
            helperText={
              errors.features ? "Please enter at least one feature." : ""
            }
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
            helperText={
              errors.amenities ? "Please enter at least one amenity." : ""
            }
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
            helperText={
              errors.facilities ? "Please enter at least one facility." : ""
            }
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
            helperText={
              errors.description
                ? "Description must be at least 10 characters."
                : ""
            }
          />
          <ImageInput
            name="images"
            value={formData.images}
            onChange={handleChange}
            error={errors.images}
            helperText={
              errors.images ? "Please upload at least one JPG/JPEG image." : ""
            }
          />

          <div className="pt-6 flex justify-center space-x-4">
            <Button size="lg" variant="cta" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Listing"}
            </Button>
            <Button
              size="lg"
              variant="primaryLight"
              type="button"
              onClick={async () => {
                // Prevent creating duplicate drafts when editing
                if (isEditing && !draftId) {
                  showToast("Missing draft ID for editing", "error");
                  return;
                }
                const alreadyUploaded = formData.images.filter(
                  (img) => typeof img === "string" && img.startsWith("http")
                );
                const newImages = formData.images.filter(
                  (img) => img instanceof File
                );
                const optimizedNewImages = await optimizeAndUploadImages(
                  newImages
                );

                const allImages = [
                  ...alreadyUploaded,
                  ...optimizedNewImages.map((img) =>
                    typeof img === "string" ? img : img.url
                  ),
                ];

                const draft = {
                  ...formData,
                  price: Number(formData.price.replace(/[^0-9]/g, "")),
                  bedrooms: Number(formData.bedrooms),
                  bathrooms: Number(formData.bathrooms),
                  squareFootage: Number(formData.squareFootage),
                  yearBuilt: Number(formData.yearBuilt),
                  availableFrom: new Date(formData.availableFrom),
                  features: formData.features
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean)
                    .filter((v, i, a) => a.indexOf(v) === i),
                  amenities: formData.amenities
                    .split(",")
                    .map((a) => a.trim())
                    .filter(Boolean)
                    .filter((v, i, a) => a.indexOf(v) === i),
                  facilities: formData.facilities
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean)
                    .filter((v, i, a) => a.indexOf(v) === i),
                  slug: formData.slug.trim(),
                  images: allImages,
                  status: "draft",
                  createdBy: user._id,
                };

                // Log user ID before creating draft
                console.log("Saving draft with user ID:", user._id);

                try {
                  const saved = isEditing
                    ? await updateListing(draftId, draft)
                    : await createListing(draft);
                  if (!saved || !saved._id) {
                    throw new Error("Draft save failed");
                  }
                  showToast("Draft saved successfully", "success");
                  // Remove draft backup from localStorage after successful save
                  localStorage.removeItem(storageKey);
                  // Always redirect to agent dashboard drafts tab after saving
                  navigate("/agent-dashboard?tab=drafts");
                } catch (err) {
                  console.error("Draft save failed:", err);
                  showToast("Failed to save draft", "error");
                }
              }}
            >
              Save Draft
            </Button>
            {!isEditing && (
              <Button
                size="md"
                variant="cancel"
                type="button"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to clear the entire form?"
                  );
                  if (confirmed) {
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
                    localStorage.removeItem("newListingDraftForm");
                    showToast("Form cleared.", "info");
                  }
                }}
              >
                🧹 Clear All Fields
              </Button>
            )}
            {isEditing && (
              <Button
                size="lg"
                variant="cancel"
                type="button"
                onClick={() => navigate("/agent-dashboard?tab=drafts")}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
