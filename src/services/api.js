const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:4000/api`;

// --- Centralized Fetch Helper
async function fetchWithHandling(url, options = {}, fallback = null) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(
        `API Fetch Error: ${response.status} - ${response.statusText}`
      );
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

export async function fetchListingsByTag(tag) {
  return fetchWithHandling(`${API_URL}/listings?tag=${tag}`, {}, []);
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
export async function createPendingListing(data) {
  return fetchWithHandling(`${API_URL}/pending`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
export async function fetchPendingListings() {
  return fetchWithHandling(`${API_URL}/pending`, {}, []);
}

export async function fetchPendingListingById(id) {
  return fetchWithHandling(`${API_URL}/pending/${id}`, {}, null);
}

export async function approveListing(id) {
  return fetchWithHandling(
    `${API_URL}/pending/${id}/approve`,
    {
      method: "POST",
    },
    false
  );
}

export async function rejectListing(id) {
  return fetchWithHandling(
    `${API_URL}/pending/${id}`,
    { method: "DELETE" },
    true
  );
}

export async function deleteListing(id) {
  return fetchWithHandling(`${API_URL}/listings/${id}`, {
    method: "DELETE",
  });
}

export async function updateListing(id, updateData) {
  return fetchWithHandling(`${API_URL}/listings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
}

// --- Favorites
export async function getFavorites(userId) {
  return fetchWithHandling(`${API_URL}/users/${userId}/favorites`, {}, null);
}

// Add a favorite
export async function addFavorite(userId, listingId) {
  try {
    const res = await fetch(`${API_URL}/users/addFavorite`, {
      method: "POST", // POST for adding a favorite
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        listingId,
      }),
    });

    if (res.ok) {
      return await res.json(); // Return the updated list of favorites
    }
    throw new Error("Failed to add favorite");
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
}

// Remove a favorite
export async function removeFavorite(userId, listingId) {
  try {
    const res = await fetch(`${API_URL}/users/removeFavorite`, {
      method: "DELETE", // DELETE for removing a favorite
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        listingId,
      }),
    });

    if (res.ok) {
      return await res.json(); // Return the updated list of favorites
    }
    throw new Error("Failed to remove favorite");
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
}

// --- Auth
export async function fetchUserByEmail(email) {
  return fetchWithHandling(`${API_URL}/users/email/${email}`, {}, null);
}

// --- User Profile
export async function fetchUserById(id) {
  return fetchWithHandling(`${API_URL}/users/${id}`, {}, null);
}

export async function getUserById(id) {
  return fetchWithHandling(`${API_URL}/users/${id}`, {}, null);
}

// --- Utilities
export function isAgentOrAdmin(user) {
  return user?.role === "agent" || user?.role === "admin";
}

// --- User Moderation
export async function fetchPendingUsers() {
  return fetchWithHandling(`${API_URL}/users?approved=false`, {}, []);
}

export async function approveUser(id) {
  return fetchWithHandling(`${API_URL}/users/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectUser(id) {
  return fetchWithHandling(`${API_URL}/users/${id}/reject`, {
    method: "PATCH",
  });
}
