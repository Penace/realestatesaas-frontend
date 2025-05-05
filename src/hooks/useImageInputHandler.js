import { validateField } from "../utils/validation";

export const useImageInputHandler = ({
  setFormData,
  setErrors,
  setWarnings,
}) => {
  const handleImageChange = (files) => {
    if (!setFormData || !setErrors || !setWarnings) return;

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

    const { error, warning } = validateField("images", imageArray);
    setErrors((prev) => ({ ...prev, images: error }));
    setWarnings((prev) => ({ ...prev, images: warning }));
  };

  return handleImageChange;
};
