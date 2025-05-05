export function validateField(field, value) {
  let error = "";
  let warning = "";

  switch (field) {
    case "title":
    case "location":
    case "address":
    case "propertyType":
    case "parkingAvailable":
    case "slug":
      error =
        value.trim().length >= 3
          ? ""
          : `${field} must be at least 3 characters.`;
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
        warning = "That's a massive property. Double-check the square footage.";
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
    case "amenities":
    case "facilities":
      error =
        value.trim().length > 0 ? "" : `Please enter at least one ${field}.`;
      break;

    default:
      break;
  }

  return { error, warning };
}
