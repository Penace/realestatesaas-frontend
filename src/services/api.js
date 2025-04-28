const API_URL = import.meta.env.VITE_API_URL;

// Fetch Listings
export async function fetchListings() {
  try {
    const response = await fetch(`${API_URL}/listings`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return [];
  }
}
// You can add more services later (fetchListingById, createListing, etc.)
