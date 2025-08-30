// lib/content.js (sin fs)
import catalog from "../data/catalog.json";

export function getAllWorks() {
  return Array.isArray(catalog?.works) ? catalog.works : [];
}
export function getWorksByType(type) {
  return getAllWorks().filter(
    (w) => String(w.type || "").toLowerCase() === String(type || "").toLowerCase()
  );
}
export function getWorkBySlug(slug) {
  return getAllWorks().find((w) => w.slug === slug) || null;
}
