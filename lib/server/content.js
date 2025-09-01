// lib/server/content.js
import catalog from "../data/catalog.json";

export function getAllWorks() {
  return Array.isArray(catalog?.works) ? catalog.works : [];
}

export function getWorksByType(type) {
  const t = String(type || "").toLowerCase();
  return getAllWorks().filter(
    (w) => String(w.tipo || "").toLowerCase() === t
  );
}

export function getWorkBySlug(slug) {
  return getAllWorks().find((w) => w.slug === slug);
}

export function getRelated(slug, limit = 8) {
  const current = getWorkBySlug(slug);
  if (!current) return [];
  const sameType = getAllWorks().filter(
    (w) =>
      w.slug !== slug &&
      String(w.tipo || "").toLowerCase() ===
        String(current.tipo || "").toLowerCase()
  );
  return sameType.slice(0, limit);
}
