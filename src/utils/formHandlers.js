import { validateField } from "./validation";

export const handleChange = (e, setFormData, setErrors, setWarnings) => {
  const { name, value } = e.target;

  let newValue = value;

  if (name === "price") {
    newValue = value.replace(/[^\d]/g, "");
    if (newValue.length > 0) {
      newValue = `$${newValue}`;
    }
  }

  if (name === "images" && !(typeof newValue === "string")) {
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

  const { error, warning } = validateField(name, newValue);

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
}) => {
  const cleaned = { ...formData };

  // Don't send files to modal, just file names
  if (Array.isArray(cleaned.images)) {
    setImagesForReview(
      cleaned.images.map((file) => file.name || "unnamed.jpg")
    );
  }

  setReviewData(cleaned);
  setShowReviewModal(true);
};
