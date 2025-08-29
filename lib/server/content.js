// lib/server/content.js
import fs from "fs";
import path from "path";

/* =========================
   RUTAS BASE
   ========================= */
const ROOT = process.cwd();
const CONTENT_DIR  = path.join(ROOT, "content");
const CREATORS_DIR = path.join(CONTENT_DIR, "creators");
const ORPHANS_DIR  = path.join(CONTENT_DIR, "orphans");
const FORMS_DIR    = path.join(CONTENT_DIR, "forms");
const FEATURED_FILE = path.join(ROOT, "public", "featured.json");

/* =========================
   HELPERS
   ========================= */
const readJSON = (filePath) =>
  JSON.parse(fs.readFileSync(filePath, "utf8"));

export const ytThumb = (id) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/* slug seguro desde nombre de archivo o título */
function safeSlug(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* =========================
   CARGA DE CREATOR Y OBRAS
   ========================= */
function readCreator(dir) {
  const creatorFile = path.join(dir, "creator.json");
  if (!fs.existsSync(creatorFile)) return null;
  try {
    const c = readJSON(creatorFile);
    c.slug = c.slug || path.basename(dir);
    return c;
  } catch {
    return null;
  }
}

function readWorksInDirectory(dir, creatorSlug = null) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  const works = [];

  for (const f of files) {
    const fp = path.join(dir, f);
    if (!f.endsWith(".json")) continue;
    if (f === "creator.json") continue;

    try {
      const w = readJSON(fp);
      w.slug = w.slug || safeSlug(w.title || path.basename(f, ".json"));
      if (!Array.isArray(w.episodes)) w.episodes = [];
      // mezcla youtubeId y url → solo youtubeId
      w.episodes = w.episodes.map((ep) => {
        let id = ep.youtubeId || ep.url || "";
        try {
          const u = new URL(id.startsWith("http") ? id : "https://" + id);
          if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
          else if (u.searchParams.has("v")) id = u.searchParams.get("v");
        } catch {}
        return { ...ep, youtubeId: id };
      });
      if (creatorSlug) w.creatorSlug = creatorSlug;
      works.push(w);
    } catch {}
  }
  return works;
}

/* =========================
   API que usaremos desde páginas
   ========================= */
export function getAllWorks() {
  const creators = [];
  const works = [];

  if (fs.existsSync(CREATORS_DIR)) {
    const creatorDirs = fs.readdirSync(CREATORS_DIR);
    for (const d of creatorDirs) {
      const full = path.join(CREATORS_DIR, d);
      if (!fs.statSync(full).isDirectory()) continue;

      const creator = readCreator(full);
      if (creator) creators.push(creator);
      works.push(...readWorksInDirectory(full, creator?.slug || null));
    }
  }

  works.push(...readWorksInDirectory(ORPHANS_DIR, null));
  return { creators, works };
}

export function getAllWorksByType(type) {
  const { works } = getAllWorks();
  return works.filter((w) => (w.type || "").toLowerCase() === type.toLowerCase());
}

export function getAllGenresForType(type) {
  const list = getAllWorksByType(type)
    .flatMap((w) => w.genres || [])
    .map((g) => g.trim())
    .filter(Boolean);
  return Array.from(new Set(list)).sort();
}

export function getFeatured() {
  if (!fs.existsSync(FEATURED_FILE)) return [];
  try {
    return readJSON(FEATURED_FILE);
  } catch {
    return [];
  }
}

export function getWorkBySlug(slug) {
  const { works } = getAllWorks();
  return works.find((w) => w.slug === slug) || null;
}
