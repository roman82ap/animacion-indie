// lib/server/content.js
// UTILIDADES DE CARGA DE CONTENIDO (solo lado servidor)

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const CREATORS_DIR = path.join(CONTENT_DIR, "creators");
const ORPHANS_DIR = path.join(CONTENT_DIR, "orphans"); // opcional

export const ytThumb = (id) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// lee JSON con UTF-8
function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function safeArray(x) {
  return Array.isArray(x) ? x : x ? [x] : [];
}

/**
 * Carga todas las obras desde content/ (creators y, opcionalmente, orphans)
 * Estructura esperada de cada obra *.json:
 * {
 *   "slug": "fuerza-abusiva",
 *   "title": "Fuerza Abusiva",
 *   "type": "Serie"|"Corto"|"Película"|"Trailer",
 *   "medium": "2D"|"3D"|"Stop-motion"|"...",
 *   "genres": ["Acción","Aventura"],
 *   "description": "...",
 *   "banner": "/works/lo-que-sea/banner.jpg",
 *   "episodes": [{ "id":"t1","title":"...","youtubeId":"xxxx", "kind":"trailer" }]
 * }
 */
export function getAllWorks() {
  const results = [];

  // creators/<creatorSlug>/
  if (fs.existsSync(CREATORS_DIR)) {
    const creators = fs.readdirSync(CREATORS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const cslug of creators) {
      const cdir = path.join(CREATORS_DIR, cslug);
      const files = fs.readdirSync(cdir)
        .filter((f) => f.endsWith(".json") && f !== "creator.json");

      let creator = null;
      const creatorFile = path.join(cdir, "creator.json");
      if (fs.existsSync(creatorFile)) {
        creator = readJSON(creatorFile);
      } else {
        creator = { slug: cslug, name: cslug };
      }

      for (const f of files) {
        const fp = path.join(cdir, f);
        const work = readJSON(fp);
        work.slug = work.slug || path.basename(f, ".json");
        work.creator = {
          slug: creator.slug || cslug,
          name: creator.name || cslug,
          socials: creator.socials || [],
          support: creator.support || [],
          avatar: creator.avatar || null,
        };
        work.genres = safeArray(work.genres);
        work.episodes = safeArray(work.episodes);
        results.push(work);
      }
    }
  }

  // (opcional) content/orphans/*.json
  if (fs.existsSync(ORPHANS_DIR)) {
    const files = fs.readdirSync(ORPHANS_DIR)
      .filter((f) => f.endsWith(".json"));
    for (const f of files) {
      const fp = path.join(ORPHANS_DIR, f);
      const work = readJSON(fp);
      work.slug = work.slug || path.basename(f, ".json");
      work.creator = null; // huérfana
      work.genres = safeArray(work.genres);
      work.episodes = safeArray(work.episodes);
      results.push(work);
    }
  }

  return results;
}

export function getAllByType(type) {
  const all = getAllWorks();
  return all.filter((w) => (w.type || "").toLowerCase() === type.toLowerCase());
}

export function getGenresForType(type) {
  const set = new Set();
  for (const w of getAllByType(type)) {
    for (const g of w.genres || []) set.add(g);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
