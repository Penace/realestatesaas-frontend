import { validateField } from "./validation";

export const handleChange = (e, setFormData, setErrors, setWarnings) => {
  const { name, value } = e.target;

  let newValue = value;

  if (name === "price") {
    newValue = value.replace(/[^\d]/g, "");
    if (newValue.length > 0) {
      newValue = `$${newValue}`;
    }
  } else if (
    ["bedrooms", "bathrooms", "squareFootage", "yearBuilt"].includes(name)
  ) {
    newValue = Number(value);
  } else if (["features", "amenities", "facilities"].includes(name)) {
    if (!Array.isArray(value)) {
      newValue = [];
    } else {
      newValue = value;
    }
  } else if (name === "images" && !(typeof newValue === "string")) {
    if (newValue instanceof FileList) {
      newValue = Array.from(newValue);
    } else if (!Array.isArray(newValue)) {
      newValue = [];
    }
  }

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  let validationValue = newValue;
  if (Array.isArray(newValue)) {
    validationValue = newValue.filter((item) => item && item.trim() !== "");
  }
  const { error, warning } = validateField(name, validationValue);

  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: error,
  }));

  setWarnings((prevWarnings) => ({
    ...prevWarnings,
    [name]: warning,
  }));
};

import { optimizeAndUploadImages } from "./imageUpload";

/**
 * Handles form submission to server
 */
export const handleSubmit = async ({
  formData,
  user,
  isEditMode,
  listingId,
  setSubmitting,
  navigate,
  toast,
}) => {
  try {
    setSubmitting(true);

    const images = await optimizeAndUploadImages(formData.images);
    const payload = {
      ...formData,
      images,
      createdBy: user._id,
      status: "active",
    };

    const endpoint = isEditMode
      ? `/api/listings/${listingId}`
      : "/api/listings";
    const method = isEditMode ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Submit failed");

    const data = await res.json();
    toast.success("Listing submitted successfully!");
    navigate(`/listings/${data._id}`);
  } catch (err) {
    console.error("Submit failed:", err);
    toast.error("Failed to submit listing.");
  } finally {
    setSubmitting(false);
  }
};

/**
 * Prepares data and opens review modal
 */
export const handleOpenReview = ({
  formData,
  setImagesForReview,
  setShowReviewModal,
  setReviewData,
  toast,
}) => {
  const requiredFields = [
    "title",
    "location",
    "address",
    "price",
    "description",
    "bedrooms",
    "bathrooms",
    "squareFootage",
    "propertyType",
    "yearBuilt",
  ];
  const isValid = requiredFields.every((field) => !!formData[field]);

  if (!isValid) {
    const showToast =
      typeof toast === "function"
        ? toast
        : typeof toast?.error === "function"
        ? (msg) => toast.error(msg)
        : (msg) =>
            console.warn(
              "Toast not available or improperly initialized:",
              toast,
              msg
            );

    showToast("Please complete all required fields before reviewing.", "error");
    return;
  }

  const cleaned = { ...formData };

  if (Array.isArray(cleaned.images)) {
    setImagesForReview(
      cleaned.images.map((file) => file.name || "unnamed.jpg")
    );
  }

  setReviewData(cleaned);
  setShowReviewModal(true);
};

/**
 * Handles saving the form as a draft
 */
export const handleSaveDraft = async ({
  formData,
  user,
  isEditMode,
  listingId,
  setSubmitting,
  toast,
  navigate,
}) => {
  try {
    setSubmitting(true);

    const payload = {
      ...formData,
      createdBy: user._id,
      status: "draft",
    };

    const endpoint = isEditMode
      ? `/api/listings/${listingId}`
      : "/api/listings";
    const method = isEditMode ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Draft save failed");

    const data = await res.json();
    toast("Draft saved successfully.");
    if (!isEditMode) navigate(`/publish/${data._id}/edit`);
  } catch (err) {
    console.error("Draft save failed:", err);
    toast("Failed to save draft.", "error");
  } finally {
    setSubmitting(false);
  }
};
