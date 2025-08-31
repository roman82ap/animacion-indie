// lib/server/content.js
import catalog from '@/data/catalog.json';

export function getAllWorks() {
  return Array.isArray(catalog?.works) ? catalog.works : [];
}

export function getWorksByType(type) {
  const t = (type || '').toLowerCase();
  return getAllWorks().filter(w => (w.tipo || '').toLowerCase() === t);
}

export function getWorkBySlug(slug) {
  return getAllWorks().find(w => w.slug === slug);
}

export function getAllTypes() {
  const set = new Set(getAllWorks().map(w => (w.tipo || '').toLowerCase()));
  return Array.from(set);
}

export function getRelated(slug, limit = 8) {
  const current = getWorkBySlug(slug);
  if (!current) return [];
  const sameType = getAllWorks().filter(
    w => w.slug !== slug && (w.tipo || '').toLowerCase() === (current.tipo || '').toLowerCase()
  );
  return sameType.slice(0, limit);
}
