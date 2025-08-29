// lib/content.js
import fs from "fs";
import path from "path";

/* ===============================
   RUTAS BASE (en el filesystem)
================================= */
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const CREATORS_DIR = path.join(CONTENT_DIR, "creators");
const FORMS_DIR = path.join(CONTENT_DIR, "forms"); // (reservado / opcional)
const FEATURED_FILE = path.join(ROOT, "featured.json");

/* ===============================
   HELPERS
================================= */

// Lee archivo JSON con fallback seguro (no rompe el build si falta)
const readJSON = (filePath, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
};

// Lee archivo de texto con fallback
const safeReadFile = (filePath, defaultVal = "") => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (_) {
    return defaultVal;
  }
};

// Slug seguro (minúsculas, sin acentos/espacios)
function safeSlug(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Acepta id o URL de YouTube y devuelve el ID.
export function parseYouTubeId(maybeUrl) {
  if (!maybeUrl) return "";
  const s = String(maybeUrl).trim();

  // id puro
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  try {
    const u = new URL(s);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.searchParams.has("v")) {
      return u.searchParams.get("v") || "";
    }
    // /embed/<id>
    const m = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  } catch (_) {
    // no era URL válida → si parece id, úsalo
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  }
  return s;
}

// Miniatura de YouTube
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// Listar subdirectorios
function listDirs(dir) {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => path.join(dir, d.name));
  } catch (_) {
    return [];
  }
}

// Listar archivos (filtra por extensión opcional)
function listFiles(dir, ext = null) {
  try {
    let files = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => path.join(dir, d.name));
    if (ext) files = files.filter((f) => f.toLowerCase().endsWith(ext.toLowerCase()));
    return files;
  } catch (_) {
    return [];
  }
}

/* ===============================
   NORMALIZACIÓN DE DATOS
================================= */

function normalizeEpisode(ep, workSlug) {
  const id = parseYouTubeId(ep.youtubeId || ep.url || "");
  return {
    id: ep.id || safeSlug(ep.title || id || "episodio"),
    title: ep.title || "Episodio",
    youtubeId: id,
    kind: ep.kind || "episode", // "trailer" o lo que quieras
    slug: `${workSlug}--${safeSlug(ep.title || id)}`,
  };
}

function normalizeWork(rawWork, creator) {
  const slug = rawWork.slug ? safeSlug(rawWork.slug) : safeSlug(rawWork.title || "obra");
  const episodes = Array.isArray(rawWork.episodes) ? rawWork.episodes : [];
  const normalizedEps = episodes.map((ep) => normalizeEpisode(ep, slug));

  // banner: si no es ruta absoluta, déjalo tal cual (lo resolverá Next con /public si hace falta)
  const banner = rawWork.banner || null;

  return {
    slug,
    title: rawWork.title || "Obra",
    type: rawWork.type || "Serie", // "Serie" | "Corto" | "Película" | "Trailer"
    medium: rawWork.medium || "2D",
    genres: Array.isArray(rawWork.genres) ? rawWork.genres : [],
    description: rawWork.description || "",
    banner, // ej. "/works/fuerza-abusiva/banner.jpg" (debería existir en /public)
    creator: creator
      ? { slug: creator.slug, name: creator.name || creator.slug }
      : null,
    support: Array.isArray(rawWork.support) ? rawWork.support : [],
    episodes: normalizedEps,
  };
}

function normalizeCreator(rawCreator, dirName) {
  const slug = rawCreator?.slug ? safeSlug(rawCreator.slug) : safeSlug(dirName);
  return {
    slug,
    name: rawCreator?.name || slug,
    socials: Array.isArray(rawCreator?.socials) ? rawCreator.socials : [],
    support: Array.isArray(rawCreator?.support) ? rawCreator.support : [],
    avatar: rawCreator?.avatar || null, // ej. "/creators/veridion23/avatar.png" (en public)
  };
}

/* ===============================
   LECTURA DE CREADORES Y OBRAS
================================= */

function loadCreatorFolder(folderPath) {
  const creatorJsonPath = path.join(folderPath, "creator.json");
  const dirName = path.basename(folderPath);

  const creatorRaw = readJSON(creatorJsonPath, {});
  const creator = normalizeCreator(creatorRaw, dirName);

  // todas las obras (*.json excepto creator.json)
  const workFiles = listFiles(folderPath, ".json").filter(
    (f) => path.basename(f).toLowerCase() !== "creator.json"
  );

  const works = workFiles
    .map((file) => readJSON(file, null))
    .filter(Boolean)
    .map((raw) => normalizeWork(raw, creator));

  return { creator, works };
}

function loadAllCreatorsAndWorks() {
  const creators = [];
  const works = [];

  const creatorDirs = listDirs(CREATORS_DIR);

  for (const cdir of creatorDirs) {
    const { creator, works: cw } = loadCreatorFolder(cdir);
    creators.push(creator);
    works.push(...cw);
  }

  return { creators, works };
}

/* ===============================
   FEATURED
================================= */

export function getFeatured() {
  const featured = readJSON(FEATURED_FILE, { featured: [] });
  return Array.isArray(featured?.featured) ? featured.featured : [];
}

/* ===============================
   APIS PRINCIPALES (para páginas)
================================= */

export function getCatalog() {
  // Todo el catálogo (creadores + obras)
  return loadAllCreatorsAndWorks();
}

export function getCreators() {
  const { creators } = loadAllCreatorsAndWorks();
  return creators;
}

export function getCreatorBySlug(slug) {
  const { creators } = loadAllCreatorsAndWorks();
  return creators.find((c) => c.slug === slug) || null;
}

export function getWorks() {
  const { works } = loadAllCreatorsAndWorks();
  return works;
}

export function getWorksByType(type /* "Serie" | "Corto" | "Película" | "Trailer" */) {
  const { works } = loadAllCreatorsAndWorks();
  if (!type) return works;
  return works.filter((w) => (w.type || "").toLowerCase() === String(type).toLowerCase());
}

export function getWorkBySlug(slug) {
  const { works } = loadAllCreatorsAndWorks();
  return works.find((w) => w.slug === slug) || null;
}

export function getAllSlugs() {
  const { works } = loadAllCreatorsAndWorks();
  return works.map((w) => w.slug);
}
