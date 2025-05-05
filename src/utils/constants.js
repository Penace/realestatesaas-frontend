// API Base URL (Optional if you want direct access in some cases)
export const API_URL = import.meta.env.VITE_API_URL;

// Site Information
export const SITE_NAME = "RealEstateSaaS";

// Other Settings
export const FEATURED_LISTINGS_LIMIT = 3;

// You can add more as needed later:
// export const DEFAULT_AVATAR = "/src/assets/default-avatar.png";
// export const MOBILE_BREAKPOINT = 768;

// Listing Options
export const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Penthouse",
  "Cottage",
  "Loft",
  "Farmhouse",
  "Castle",
  "Other",
];

export const listingTypes = ["Sale", "Rent", "Auction"];

export const features = [
  "Garage",
  "Pool",
  "Garden",
  "Balcony",
  "Fireplace",
  "Smart Home",
  "Home Theater",
];

export const amenities = [
  "Wi-Fi",
  "Air Conditioning",
  "Heating",
  "Security System",
  "Gym Access",
  "Pet Friendly",
  "Laundry Room",
];

export const facilities = [
  "Elevator",
  "Wheelchair Access",
  "Conference Room",
  "Rooftop Terrace",
  "Private Beach",
];

export const parkingOptions = [
  "Yes",
  "No",
  "Street",
  "Garage",
  "Private",
  "Underground",
  "Valet",
  "Assigned",
];
