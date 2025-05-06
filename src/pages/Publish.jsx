import { createListing } from "../services/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getListingById, updateListing } from "../services/api";
import Button from "../components/common/Button";
import { useToast } from "../context/ToastProvider";
import { useAuth } from "../context/AuthProvider";
import ReviewModal from "../components/ReviewModal";
import { useModalHandlers } from "../utils/modalHandlers";
import ListingForm from "../components/form/ListingForm";
import {
  handleChange,
  handleSubmit,
  handleOpenReview,
} from "../utils/formHandlers";
import { useLoadDraft } from "../hooks/useLoadDraft";
import { validateField } from "../utils/validation";
import { optimizeAndUploadImages } from "../utils/imageUpload";
import { normalize } from "../utils/normalize";
import { useFormErrors } from "../utils/formErrors";
import { useImageInputHandler } from "../hooks/useImageInputHandler";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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

  const {
    errors,
    setErrors,
    warnings,
    setWarnings,
    submitted,
    setSubmitted,
    submitting,
    setSubmitting,
  } = useFormErrors();

  const handleImageChange = useImageInputHandler({
    setFormData,
    setErrors,
    setWarnings,
  });

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
              const { error, warning } = validateField(field, value);
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
  const { showReviewModal, reviewData, openModal, closeModal } =
    useModalHandlers();

  // Prevent multiple redundant login toasts: show only after restoring draft and add delay
  useEffect(() => {
    if (!isRestoringDraft && (!user || !user._id)) {
      setTimeout(() => {
        showToast("You must be logged in to publish a listing.", "error");
      }, 200); // Add slight delay to avoid overlap
    }
  }, [user, isRestoringDraft]);

  useLoadDraft(isEditing, draftId, storageKey, setFormData, showToast);

  // Determine if we should block rendering (after all hooks)
  const shouldBlockRender = !user || !user._id || isRestoringDraft;
  if (shouldBlockRender) return null;

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
          listing={{
            ...(reviewData || {}),
            images: Array.isArray(reviewData?.images)
              ? reviewData.images.map((img) =>
                  typeof img === "string"
                    ? { name: img.split("/").pop(), url: img }
                    : {
                        name: img.name,
                        url: URL.createObjectURL(img),
                      }
                )
              : [],
          }}
          onClose={closeModal}
          onConfirm={() => {
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
            const invalid = requiredFields.some((field) => !formData[field]);
            if (invalid) {
              showToast(
                "Please complete the required fields before submitting.",
                "error"
              );
              return;
            }
            handleSubmit();
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
        <ListingForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          warnings={warnings}
          setErrors={setErrors}
          setWarnings={setWarnings}
          submitting={submitting}
          submitted={submitted}
          isEditing={isEditing}
          showToast={showToast}
          openModal={openModal}
          handleImageChange={handleImageChange}
          user={user}
          storageKey={storageKey}
          draftId={draftId}
          navigate={navigate}
          setReviewData={(reviewData) =>
            setFormData({ ...formData, reviewData })
          }
          setShowReviewModal={openModal}
          setImagesForReview={(images) => {
            setFormData((prev) => ({ ...prev, reviewImages: images }));
          }}
          setSubmitting={setSubmitting}
          handleSaveDraft={(data) => {
            const {
              formData,
              user,
              toast,
              setSubmitting,
              navigate,
              isEditMode,
              listingId,
            } = data;
            if (!user || !user._id) {
              toast("You must be logged in to save a draft.", "error");
              return;
            }
            setSubmitting(true);
            optimizeAndUploadImages(formData.images)
              .then((uploadedImages) => {
                const draftData = {
                  ...formData,
                  images: uploadedImages,
                  isDraft: true,
                  userId: user._id,
                };
                return isEditMode && listingId
                  ? updateListing(listingId, draftData)
                  : createListing(draftData);
              })
              .then((res) => {
                toast("Draft saved successfully!", "success");
                navigate(`/agent-dashboard?tab=drafts`);
              })
              .catch((err) => {
                console.error("Failed to save draft:", err);
                toast("Failed to save draft. Try again.", "error");
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        />
      </div>
    </div>
  );
}
