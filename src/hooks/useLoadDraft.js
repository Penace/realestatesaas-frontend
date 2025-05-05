import { useEffect } from "react";
import { getListingById } from "../services/api";

export function useLoadDraft(
  isEditing,
  draftId,
  storageKey,
  setFormData,
  showToast
) {
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
  }, [isEditing, draftId, storageKey, setFormData, showToast]);
}
