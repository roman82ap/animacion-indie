// lib/server/content.js
// Utilidades de lectura de catálogo (sólo del lado servidor)

import catalog from "../data/catalog.json";

// Devuelve TODO el catálogo
export function getCatalog() {
  return catalog;
}

// Devuelve todas las obras (array)
export function getAllWorks() {
  return Array.isArray(catalog.works) ? catalog.works : [];
}

// Devuelve una obra por slug
export function getWorkBySlug(slug) {
  return getAllWorks().find((w) => w.slug === slug);
}

// Devuelve obras por tipo (serie | corto | pelicula | trailer)
export function getWorksByType(type) {
  const t = String(type || "").toLowerCase();
  return getAllWorks().filter(
    (w) => String(w.tipo || "").toLowerCase() === t
  );
}
