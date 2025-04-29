const API_URL = import.meta.env.VITE_API_URL;

// General Fetch Utilities
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

export async function fetchListingById(id) {
  try {
    const response = await fetch(`${API_URL}/listings/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch listing ${id}:`, error);
    return null;
  }
}

// Publish New Listing
export async function createListing(listingData) {
  try {
    const response = await fetch(`${API_URL}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listingData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create listing:", error);
    throw error;
  }
}

// Admin Moderation Services
export async function fetchPendingListings() {
  try {
    const response = await fetch(`${API_URL}/pendingListings`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch pending listings:", error);
    return [];
  }
}

export async function approveListing(id) {
  try {
    const response = await fetch(`${API_URL}/pendingListings/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error(`Failed to approve listing ${id}:`, error);
    return false;
  }
}

export async function rejectListing(id) {
  try {
    const response = await fetch(`${API_URL}/pendingListings/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error(`Failed to reject listing ${id}:`, error);
    return false;
  }
}
