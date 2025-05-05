/**
 * Normalizes string input:
 * - Converts empty or whitespace-only strings to null
 * - Trims non-empty strings
 * - Returns null for undefined or invalid values
 */
export const normalize = (value) =>
  typeof value === "string" && value.trim() === ""
    ? null
    : value?.trim?.() ?? null;
