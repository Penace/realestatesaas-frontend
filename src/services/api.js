const API_URL = import.meta.env.VITE_API_URL;

// --- Centralized Fetch Helper
async function fetchWithHandling(url, options = {}, fallback = null) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error:`, error.message);
    return fallback;
  }
}

// --- Listings
export async function fetchListings() {
  return fetchWithHandling(`${API_URL}/listings`, {}, []);
}

export async function fetchListingById(id) {
  return fetchWithHandling(`${API_URL}/listings/${id}`, {}, null);
}

// --- Publish
export async function createListing(listingData) {
  return fetchWithHandling(`${API_URL}/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listingData),
  });
}

// --- Admin Moderation
export async function fetchPendingListings() {
  return fetchWithHandling(`${API_URL}/pendingListings`, {}, []);
}

export async function approveListing(id) {
  try {
    // Fetch the pending listing by ID
    const pending = await fetchWithHandling(
      `${API_URL}/pendingListings/${id}`,
      {},
      null
    );
    if (!pending) throw new Error("Listing not found");

    // Add to main listings
    await fetchWithHandling(`${API_URL}/listings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending),
    });

    // Remove from pending
    await fetchWithHandling(
      `${API_URL}/pendingListings/${id}`,
      { method: "DELETE" },
      true
    );
    return true;
  } catch (err) {
    console.error("Approval Error:", err.message);
    return false;
  }
}

export async function rejectListing(id) {
  return fetchWithHandling(
    `${API_URL}/pendingListings/${id}`,
    { method: "DELETE" },
    true
  );
}
