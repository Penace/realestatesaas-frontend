import React from "react";
import TextInput from "./TextInput";
import TextareaInput from "./TextareaInput";
import PriceInput from "./PriceInput";
import ImageInput from "./ImageInput";
import Dropdown from "./Dropdown";
import DateInput from "./DateInput";
import MultiSelect from "./MultiSelect";
import CommaInput from "./CommaInput";
import Button from "../common/Button";
import ReviewModal from "../ReviewModal";
import { handleOpenReview, handleChange } from "../../utils/formHandlers";
import {
  propertyTypes,
  listingTypes,
  features,
  amenities,
  facilities,
  parkingOptions,
} from "../../utils/constants";

export default function ListingForm({
  formData,
  setFormData,
  errors,
  warnings,
  submitted,
  submitting,
  openModal,
  closeModal,
  showReviewModal,
  reviewData,
  showToast,
  isEditing,
  handleImageChange,
  handleSubmit,
  handleSaveDraft,
  setImagesForReview,
  setShowReviewModal,
  setReviewData,
  navigate,
  setErrors,
  setWarnings,
}) {
  return (
    <>
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
        onClose={closeModal}
        onConfirm={handleSubmit}
      />

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            handleOpenReview({
              formData,
              setImagesForReview,
              setShowReviewModal,
              setReviewData,
              toast: showToast,
            });
          } catch (error) {
            console.error("Failed to trigger review modal:", error);
            showToast("Please complete all required fields before reviewing.", {
              type: "error",
            });
            return false;
          }
        }}
      >
        <TextInput
          name="title"
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="Luxury Penthouse"
          error={Boolean(errors.title)}
          helperText={errors.title}
          warning={warnings.title}
        />
        <TextInput
          name="slug"
          label="Slug"
          value={formData.slug}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="luxury-penthouse-nyc"
          error={Boolean(errors.slug)}
          helperText={errors.slug}
          warning={warnings.slug}
        />
        <TextInput
          name="location"
          label="Location"
          value={formData.location}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="New York City, NY"
          error={Boolean(errors.location)}
          helperText={errors.location}
          warning={warnings.location}
        />
        <TextInput
          name="address"
          label="Address"
          value={formData.address}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="123 Main St"
          error={Boolean(errors.address)}
          helperText={errors.address}
          warning={warnings.address}
        />
        <PriceInput
          name="price"
          value={formData.price}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          error={Boolean(errors.price)}
          helperText={errors.price}
          warning={warnings.price}
        />
        <TextInput
          name="bedrooms"
          label="Bedrooms"
          value={formData.bedrooms}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="3"
          error={Boolean(errors.bedrooms)}
          helperText={errors.bedrooms}
          warning={warnings.bedrooms}
        />
        <TextInput
          name="bathrooms"
          label="Bathrooms"
          value={formData.bathrooms}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="2"
          error={Boolean(errors.bathrooms)}
          helperText={errors.bathrooms}
          warning={warnings.bathrooms}
        />
        <TextInput
          name="squareFootage"
          label="Square Footage"
          value={formData.squareFootage}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="1500"
          error={Boolean(errors.squareFootage)}
          helperText={errors.squareFootage}
          warning={warnings.squareFootage}
        />
        <TextInput
          name="yearBuilt"
          label="Year Built"
          value={formData.yearBuilt}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="1990"
          error={Boolean(errors.yearBuilt)}
          helperText={errors.yearBuilt}
          warning={warnings.yearBuilt}
        />
        <Dropdown
          name="propertyType"
          label="Property Type"
          options={propertyTypes}
          value={formData.propertyType}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          error={errors.propertyType}
          warning={warnings.propertyType}
        />
        <Dropdown
          name="listingType"
          label="Listing Type"
          options={listingTypes}
          value={formData.listingType}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          error={errors.listingType}
          warning={warnings.listingType}
        />
        <Dropdown
          name="parkingAvailable"
          label="Parking Availability"
          options={parkingOptions}
          value={formData.parkingAvailable}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          error={errors.parkingAvailable}
          warning={warnings.parkingAvailable}
        />
        <DateInput
          name="availableFrom"
          label="Available From"
          value={formData.availableFrom}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          error={Boolean(errors.availableFrom)}
          helperText={errors.availableFrom}
          warning={warnings.availableFrom}
        />
        <TextareaInput
          name="description"
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
          placeholder="Describe your property in detail..."
          error={Boolean(errors.description)}
          helperText={errors.description}
          warning={warnings.description}
        />
        <MultiSelect
          label="Features"
          name="features"
          options={features}
          selected={formData.features}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
        />
        <CommaInput
          name="features"
          label="Additional Features"
          value={formData.features}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
        />
        <MultiSelect
          label="Amenities"
          name="amenities"
          options={amenities}
          selected={formData.amenities}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
        />
        <CommaInput
          name="amenities"
          label="Additional Amenities"
          value={formData.amenities}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
        />
        <MultiSelect
          label="Facilities"
          name="facilities"
          options={facilities}
          selected={formData.facilities}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
        />
        <CommaInput
          name="facilities"
          label="Additional Facilities"
          value={formData.facilities}
          onChange={(e) => handleChange(e, setFormData, setErrors, setWarnings)}
        />
        <ImageInput
          name="images"
          value={formData.images}
          onChange={handleImageChange}
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
            onClick={() => {
              const images = Array.isArray(formData.images)
                ? formData.images
                : [];
              handleSaveDraft({
                formData: { ...formData, images },
                toast: showToast,
                user: formData.createdBy || { _id: "temp-user-id" },
                isEditMode: isEditing,
                listingId: formData._id,
                setSubmitting: () => {},
                navigate,
              });
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
    </>
  );
}
