export const ownershipLabel = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  DEEMED: "Deemed university",
};
export function formatInr(value: number | null) {
  return value === null
    ? "Unavailable"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);
}
export function safeWebsite(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
export function discoveryReturn(value: string | string[] | undefined) {
  return typeof value === "string" &&
    (value === "/discover" || value.startsWith("/discover?"))
    ? value
    : "/discover";
}
export function placementRate(placed: number | null, eligible: number | null) {
  return placed !== null && eligible !== null && eligible > 0
    ? `${((placed / eligible) * 100).toFixed(1)}%`
    : "Unavailable";
}
