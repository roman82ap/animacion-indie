// lib/server/content.js
// *** SOLO PARA EL SERVIDOR ***
// Lee formularios .txt en /content/forms/, los parsea y devuelve una lista de obras.

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const FORMS_DIR = path.join(CONTENT_DIR, "forms");

// helpers
function safeSlug(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseYouTubeId(maybeUrl = "") {
  const url = String(maybeUrl).trim();
  if (!url) return "";
  try {
    // soporto URLs con o sin https
    const clean = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const u = new URL(clean);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.has("v")) return u.searchParams.get("v");
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2] || "";
      }
    }
  } catch (e) {
    // si no parsea como URL, puede que ya sea un ID
    if (/^[A-Za-z0-9_-]{8,}$/.test(url)) return url;
  }
  return "";
}

function ytThumb(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// Parse muy sencillo del .txt: claves en mayúsculas y bloques por obra con "TIPO:"
function parseFormFile(filePath) {
  const txt = fs.readFileSync(filePath, "utf-8");
  const lines = txt.split(/\r?\n/);

  let current = null;
  const works = [];
  let currentCreator = ""; // si viene "CREADOR: ..."

  const pushCurrent = () => {
    if (!current) return;
    if (!current.title) return;
    current.slug = current.slug || safeSlug(current.title);
    // primera miniatura para la tarjeta
    const firstVideo = (current.episodes || [])[0];
    if (firstVideo && firstVideo.youtubeId) {
      current.thumb = ytThumb(firstVideo.youtubeId);
    }
    works.push(current);
    current = null;
  };

  let mode = ""; // "videos" para leer líneas de videos
  let descBuffer = null;

  for (let raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // rompe con separadores
    if (/^-{5,}$/.test(line)) continue;

    // fin de una obra si llega una nueva "TIPO:"
    if (line.toUpperCase().startsWith("TIPO:")) {
      pushCurrent();
      current = {
        type: line.split(":")[1].trim(), // Serie | Corto | Película | Trailer
        title: "",
        medium: "",
        genres: [],
        description: "",
        episodes: [],
        creator: currentCreator || "",
      };
      mode = "";
      descBuffer = null;
      continue;
    }

    // CREATOR opcional arriba
    if (line.toUpperCase().startsWith("CREADOR:")) {
      currentCreator = line.split(":")[1].trim();
      continue;
    }

    // dentro de una obra
    if (current) {
      if (line.toUpperCase().startsWith("NOMBRE:")) {
        current.title = line.split(":")[1].trim();
        current.slug = safeSlug(current.title);
        continue;
      }
      if (line.toUpperCase().startsWith("MEDIO:")) {
        current.medium = line.split(":")[1].trim();
        continue;
      }
      if (line.toUpperCase().startsWith("GENERO") || line.toUpperCase().startsWith("GÉNERO")) {
        const rawGenres = line.split(":")[1] || "";
        current.genres = rawGenres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);
        continue;
      }
      if (line.toUpperCase().startsWith("DESCRIPCION") || line.toUpperCase().startsWith("DESCRIPCIÓN")) {
        // tomar lo que sigue de la línea
        const rest = line.split(":")[1] || "";
        descBuffer = rest.trim();
        current.description = descBuffer;
        continue;
      }
      if (line.toUpperCase().startsWith("VIDEOS:")) {
        mode = "videos";
        continue;
      }

      // acumular más descripción si no estamos en modo videos y no hay otra clave
      if (!mode && descBuffer !== null && !/^[A-ZÁÉÍÓÚÑ]+:/.test(line)) {
        descBuffer += " " + line;
        current.description = descBuffer.trim();
        continue;
      }

      // videos como:
      // - title=Trailer Oficial | url=https://youtu.be/XXXX
      if (mode === "videos" && line.startsWith("-")) {
        const mTitle = /title\s*=\s*([^|]+)/i.exec(line);
        const mUrl = /url\s*=\s*([^\s|]+)/i.exec(line);
        const title = (mTitle ? mTitle[1] : "").trim();
        const url = (mUrl ? mUrl[1] : "").trim();
        const youtubeId = parseYouTubeId(url);
        if (youtubeId) {
          current.episodes.push({
            id: safeSlug(title) || youtubeId,
            title: title || "Video",
            youtubeId,
          });
        }
      }
    }
  }

  pushCurrent();
  return works;
}

export async function getAllWorks() {
  if (!fs.existsSync(FORMS_DIR)) return [];
  const files = fs.readdirSync(FORMS_DIR).filter((f) => f.endsWith(".txt"));
  let all = [];
  for (const f of files) {
    const works = parseFormFile(path.join(FORMS_DIR, f));
    all = all.concat(works);
  }

  // normalizar tipos
  all.forEach((w) => {
    const t = (w.type || "").toLowerCase();
    if (t.startsWith("serie")) w.type = "Serie";
    else if (t.startsWith("corto")) w.type = "Corto";
    else if (t.startsWith("pel")) w.type = "Película";
    else if (t.startsWith("trail")) w.type = "Trailer";
    else w.type = "Otro";
  });

  return all;
}
