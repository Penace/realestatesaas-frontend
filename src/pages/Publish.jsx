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
  useEffect(() => {
    console.log("🚀 Publish component mounted");
  }, []);
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

  // --- Move validate function above useEffect hooks ---
  const [warnings, setWarnings] = useState({});
  const validate = (field, value) => {
    let error = "";
    let warning = "";

    switch (field) {
      case "title":
        error =
          value.trim().length >= 3
            ? ""
            : "Title must be at least 3 characters.";
        break;
      case "location":
        error =
          value.trim().length >= 3
            ? ""
            : "Location must be at least 3 characters.";
        break;
      case "address":
        error =
          value.trim().length >= 3
            ? ""
            : "Address must be at least 3 characters.";
        break;
      case "propertyType":
        error =
          value.trim().length >= 3
            ? ""
            : "Property type must be at least 3 characters.";
        break;
      case "parkingAvailable":
        error =
          value.trim().length >= 3
            ? ""
            : "Parking must be at least 3 characters.";
        break;
      case "slug":
        error =
          value.trim().length >= 3 ? "" : "Slug must be at least 3 characters.";
        break;
      case "price": {
        const numeric = Number(value.replace(/[^0-9.]/g, ""));
        if (isNaN(numeric) || numeric < 100) {
          error = "Price must be at least $100.";
        } else if (numeric > 100_000_000) {
          warning = "This is an extremely high price. Please confirm.";
        }
        break;
      }
      case "description":
        error =
          value.trim().length >= 10
            ? ""
            : "Description must be at least 10 characters.";
        break;
      case "images":
        error =
          Array.isArray(value) &&
          value.length >= 3 &&
          value.every(
            (file) =>
              typeof file.name === "string" &&
              (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg"))
          )
            ? ""
            : "Please upload at least 3 JPG/JPEG images.";
        break;
      case "bedrooms":
      case "bathrooms": {
        const numVal = Number(value);
        if (isNaN(numVal) || numVal < 0) {
          error = `Please enter a valid number of ${field}.`;
        } else if (numVal > 100) {
          error = `Maximum allowed for ${field} is 100.`;
        } else if (numVal > 50) {
          warning = `Unusually high number of ${field}. Please confirm.`;
        }
        break;
      }
      case "squareFootage": {
        const numVal = Number(value);
        if (isNaN(numVal) || numVal < 0) {
          error = "Please enter a valid square footage.";
        } else if (numVal > 50000) {
          warning =
            "That's a massive property. Double-check the square footage.";
        }
        break;
      }
      case "yearBuilt": {
        const numVal = Number(value);
        const currentYear = new Date().getFullYear();
        if (isNaN(numVal) || numVal < 0) {
          error = "Please enter a valid year.";
        } else if (numVal < 1600) {
          warning = "Is this a heritage listing? Very old year.";
        } else if (numVal > currentYear + 5) {
          error = `Year cannot be more than ${currentYear + 5}.`;
        } else if (numVal > currentYear) {
          warning = "Future year? Please confirm it's correct.";
        }
        break;
      }
      case "listingType":
        error = value.trim().length > 0 ? "" : "Please select a listing type.";
        break;
      case "availableFrom":
        error = !isNaN(Date.parse(value)) ? "" : "Please enter a valid date.";
        break;
      case "features":
        error =
          value.trim().length > 0 ? "" : "Please enter at least one feature.";
        break;
      case "amenities":
        error =
          value.trim().length > 0 ? "" : "Please enter at least one amenity.";
        break;
      case "facilities":
        error =
          value.trim().length > 0 ? "" : "Please enter at least one facility.";
        break;
      default:
        break;
    }
    return { error, warning };
  };

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
          // Immediately validate fields after restoring
          const restoredErrors = {};
          const restoredWarnings = {};
          Object.entries(parsedForm).forEach(([field, value]) => {
            if (
              [
                "title",
                "location",
                "address",
                "price",
                "description",
                "images",
                "features",
                "amenities",
                "facilities",
              ].includes(field)
            ) {
              const { error, warning } = validate(field, value);
              restoredErrors[field] = error;
              restoredWarnings[field] = warning;
            }
          });
          setErrors((prev) => ({ ...prev, ...restoredErrors }));
          setWarnings((prev) => ({ ...prev, ...restoredWarnings }));
        }
      } catch (err) {
        console.error("Failed to parse saved draft from localStorage:", err);
      }
    }

    setIsRestoringDraft(false);
    // eslint-disable-next-line
  }, [draftId, location.pathname]);

  // Show toast after restoring draft from previous session (only for new listing, and only if data exists)
  useEffect(() => {
    if (
      !isRestoringDraft &&
      !isEditing &&
      formData &&
      Object.values(formData).filter((v) => !!v && v !== "").length > 2
    ) {
      const hasToastShown = sessionStorage.getItem("draftToastShown");
      if (!hasToastShown) {
        showToast("Draft restored from previous session", "info");
        sessionStorage.setItem("draftToastShown", "true");
      }
    }
  }, [isRestoringDraft, isEditing, formData]);
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
    const isFormMostlyEmpty =
      Object.values(formData).filter((v) => !!v && v !== "").length < 2;

    if (!isFormMostlyEmpty) {
      const dataToPersist =
        storageKey === "newListingDraftForm"
          ? Object.fromEntries(
              Object.entries(formData).filter(([key]) => key !== "images")
            )
          : formData;

      localStorage.setItem(storageKey, JSON.stringify(dataToPersist));
    }
  }, [formData, storageKey]);

  const { user } = useAuth();
  // (isEditing moved above)
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Prevent multiple redundant login toasts: show only after restoring draft and add delay
  useEffect(() => {
    if (!isRestoringDraft && (!user || !user._id)) {
      setTimeout(() => {
        showToast("You must be logged in to publish a listing.", "error");
      }, 200); // Add slight delay to avoid overlap
    }
  }, [user, isRestoringDraft]);

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
          const existingDraft = localStorage.getItem(storageKey);
          if (!existingDraft) {
            setFormData(loadedFormData);
            localStorage.setItem(storageKey, JSON.stringify(loadedFormData));
          }
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

  const handleChange = (e) => {
    console.log("📝 handleChange called with:", e);
    const { name, value } = e.target;

    let newValue = value;

    if (name === "price") {
      newValue = value.replace(/[^\d]/g, "");
      if (newValue.length > 0) {
        newValue = `$${newValue}`;
      }
    }

    // Handle special case for images (value is passed as FileList or array)
    if (name === "images" && !(typeof newValue === "string")) {
      if (newValue instanceof FileList) {
        newValue = Array.from(newValue);
      } else if (!Array.isArray(newValue)) {
        newValue = [];
      }
    }

    console.log(`🛠️ Updating ${name} with:`, newValue);
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      const { error, warning } = validate(name, newValue);
      updatedErrors[name] = error;
      setWarnings((prevWarnings) => ({
        ...prevWarnings,
        [name]: warning,
      }));
      return updatedErrors;
    });
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
      images.length < 3 ||
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

        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
          <p>
            <strong>Listing Instructions:</strong>
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              Please ensure all required fields are filled before submitting.
            </li>
            <li>Drafts can be saved with basic info and completed later.</li>
            <li>
              Listings with extreme values (e.g., very high price, many rooms)
              are allowed but will be flagged for admin review.
            </li>
            <li>Upload at least 3 high-quality JPG/JPEG images.</li>
          </ul>
        </div>
        <form className="space-y-6" onSubmit={handleOpenReview}>
          {/* Basic Info */}
          <TextInput
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Luxury Penthouse"
            error={Boolean(errors.title)}
            helperText={errors.title}
          />
          <TextInput
            name="slug"
            label="Slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="luxury-penthouse-nyc"
            error={Boolean(errors.slug)}
            helperText={errors.slug}
          />
          <TextInput
            name="location"
            label="Location"
            value={formData.location}
            onChange={handleChange}
            placeholder="New York City, NY"
            error={Boolean(errors.location)}
            helperText={errors.location}
          />
          <TextInput
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St"
            error={Boolean(errors.address)}
            helperText={errors.address}
          />

          {/* Property Details */}
          <PriceInput
            name="price"
            value={formData.price}
            onChange={handleChange}
            error={Boolean(errors.price)}
            helperText={errors.price}
          />
          <TextInput
            name="bedrooms"
            label="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="3"
            error={Boolean(errors.bedrooms)}
            helperText={errors.bedrooms}
          />
          <TextInput
            name="bathrooms"
            label="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="2"
            error={Boolean(errors.bathrooms)}
            helperText={errors.bathrooms}
          />
          <TextInput
            name="squareFootage"
            label="Square Footage"
            value={formData.squareFootage}
            onChange={handleChange}
            placeholder="1500"
            error={Boolean(errors.squareFootage)}
            helperText={errors.squareFootage}
          />
          <TextInput
            name="yearBuilt"
            label="Year Built"
            value={formData.yearBuilt}
            onChange={handleChange}
            placeholder="1990"
            error={Boolean(errors.yearBuilt)}
            helperText={errors.yearBuilt}
          />
          <TextInput
            name="propertyType"
            label="Property Type"
            value={formData.propertyType}
            onChange={handleChange}
            placeholder="Apartment"
            error={Boolean(errors.propertyType)}
            helperText={errors.propertyType}
          />
          <TextInput
            name="parkingAvailable"
            label="Parking Available"
            value={formData.parkingAvailable}
            onChange={handleChange}
            placeholder="Yes"
            error={Boolean(errors.parkingAvailable)}
            helperText={errors.parkingAvailable}
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
            error={Boolean(errors.listingType)}
            helperText={errors.listingType}
          />
          <DateInput
            name="availableFrom"
            label="Available From"
            value={formData.availableFrom}
            onChange={handleChange}
            error={Boolean(errors.availableFrom)}
            helperText={errors.availableFrom}
          />

          {/* Description & Tags */}
          <TextareaInput
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your property in detail..."
            error={Boolean(errors.description)}
            helperText={errors.description}
          />
          <CommaInput
            name="features"
            label="Features"
            value={formData.features}
            onChange={handleChange}
            error={Boolean(errors.features)}
            helperText={errors.features}
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
            error={Boolean(errors.amenities)}
            helperText={errors.amenities}
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
            error={Boolean(errors.facilities)}
            helperText={errors.facilities}
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

          {/* Images */}
          <ImageInput
            name="images"
            label="Images"
            value={formData.images}
            onChange={(files) => {
              let imageArray = [];
              if (Array.isArray(files)) {
                imageArray = files.filter(
                  (file) => file instanceof File || typeof file === "string"
                );
              } else if (files instanceof FileList) {
                imageArray = Array.from(files);
              }

              setFormData((prev) => ({
                ...prev,
                images: imageArray,
              }));

              const { error, warning } = validate("images", imageArray);
              setErrors((prev) => ({ ...prev, images: error }));
              setWarnings((prev) => ({ ...prev, images: warning }));
            }}
            error={Boolean(errors.images)}
            helperText={errors.images}
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
                const imageArray = Array.isArray(formData.images)
                  ? formData.images
                  : [];
                const alreadyUploaded = imageArray.filter(
                  (img) => typeof img === "string" && img.startsWith("http")
                );
                const newImages = imageArray.filter(
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

                // Helper to normalize string fields: trim and set to null if empty or undefined
                const normalize = (value) =>
                  typeof value === "string" && value.trim() === ""
                    ? null
                    : value?.trim?.() ?? null;

                const draft = {
                  title: normalize(formData.title),
                  location: normalize(formData.location),
                  price: formData.price
                    ? Number(formData.price.replace(/[^0-9]/g, ""))
                    : null,
                  description: normalize(formData.description),
                  address: normalize(formData.address),
                  bedrooms:
                    formData.bedrooms && !isNaN(Number(formData.bedrooms))
                      ? Math.min(Number(formData.bedrooms), 100)
                      : null,
                  bathrooms:
                    formData.bathrooms && !isNaN(Number(formData.bathrooms))
                      ? Math.min(Number(formData.bathrooms), 100)
                      : null,
                  squareFootage:
                    formData.squareFootage &&
                    !isNaN(Number(formData.squareFootage))
                      ? Math.min(Number(formData.squareFootage), 500000)
                      : null,
                  propertyType: normalize(formData.propertyType),
                  yearBuilt: formData.yearBuilt
                    ? Number(formData.yearBuilt)
                    : null,
                  parkingAvailable: normalize(formData.parkingAvailable),
                  listingType:
                    formData.listingType &&
                    formData.listingType.trim().length > 0
                      ? formData.listingType.trim()
                      : undefined,
                  availableFrom:
                    formData.availableFrom &&
                    !isNaN(Date.parse(formData.availableFrom))
                      ? new Date(formData.availableFrom)
                      : undefined,
                  features: formData.features
                    ? formData.features
                        .split(",")
                        .map((f) => f.trim())
                        .filter(Boolean)
                        .filter((v, i, a) => a.indexOf(v) === i)
                    : undefined,
                  amenities: formData.amenities
                    ? formData.amenities
                        .split(",")
                        .map((a) => a.trim())
                        .filter(Boolean)
                        .filter((v, i, a) => a.indexOf(v) === i)
                    : undefined,
                  facilities: formData.facilities
                    ? formData.facilities
                        .split(",")
                        .map((f) => f.trim())
                        .filter(Boolean)
                        .filter((v, i, a) => a.indexOf(v) === i)
                    : undefined,
                  slug:
                    formData.slug && formData.slug.trim().length > 0
                      ? formData.slug.trim()
                      : undefined,
                  images: allImages.length > 0 ? allImages : undefined,
                  status: "draft",
                  createdBy: user._id,
                };

                // Log user ID before creating draft
                console.log("Saving draft with user ID:", user._id);

                try {
                  // DRAFT VALIDATION: Allow saving even with minimal fields, so do NOT block for missing/invalid fields.
                  // (Removed strict validation for drafts.)
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
