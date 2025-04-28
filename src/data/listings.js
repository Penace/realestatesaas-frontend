// listings.js (now dynamic helper functions)

import { API_URL } from "../constants";

// Fetch all listings
export async function getAllListings() {
  const response = await fetch(`${API_URL}/listings`);
  if (!response.ok) {
    throw new Error("Failed to fetch listings.");
  }
  return await response.json();
}

// Fetch single listing by ID
export async function getListingById(id) {
  const response = await fetch(`${API_URL}/listings/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch listing.");
  }
  return await response.json();
}
