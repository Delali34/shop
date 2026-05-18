// utils/restock.js
// Helpers for computing/formatting restock ETA on the storefront.

/**
 * Given a product, returns { days, date } if it has a future restock date,
 * or null if it's in stock / has no restock date / the date is in the past.
 */
export function getRestockInfo(product) {
  if (!product) return null;
  if ((product.stockQuantity ?? 0) > 0) return null;
  const raw = product.restockDate ?? product.restock_date;
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = date.getTime() - Date.now();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return null;
  return { days, date };
}

/**
 * Short user-facing label, e.g. "Back in 7 days".
 */
export function formatRestockLabel(info) {
  if (!info) return "";
  const { days } = info;
  return `Back in ${days} day${days === 1 ? "" : "s"}`;
}
