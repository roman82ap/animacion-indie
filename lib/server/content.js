// lib/server/content.js
// Archivo de uso EXCLUSIVO en el servidor (getStaticProps / getServerSideProps)

import fs from "fs";
import path from "path";

/* ============ RUTAS BASE ============ */
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const CREATORS_DIR = path.join(CONTENT_DIR, "creators");

/* ============ HELPERS ============ */
export const ytThumb = (id) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/**
 * Devuelve TODAS las obras (series, cortos, películas, trailers) encontradas
 * en /content/creators/<slug>/*.json (excepto creator.json)
 * con un esquema unificado listo para pintar.
 */
export async function getAllWorks() {
  const works = [];

  if (!fs.existsSync(CREATORS_DIR)) return works;

  const creators = fs.readdirSync(CREATORS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const cslug of creators) {
    const cdir = path.join(CREATORS_DIR, cslug);

    // Lee todos los .json dentro del creador
    const files = fs.readdirSync(cdir)
      .filter((f) => f.endsWith(".json"));

    // Opcional: carga datos del creador
    let creatorData = null;
    const creatorFile = path.join(cdir, "creator.json");
    if (fs.existsSync(creatorFile)) {
      try {
        creatorData = JSON.parse(fs.readFileSync(creatorFile, "utf8"));
      } catch {}
    }

    for (const file of files) {
      if (file === "creator.json") continue;

      const full = path.join(cdir, file);
      let raw;
      try {
        raw = JSON.parse(fs.readFileSync(full, "utf8"));
      } catch {
        continue;
      }

      const {
        slug,
        title,
        type,            // "Serie" | "Corto" | "Película" | "Trailer"
        medium,          // "2D" | "3D" | "Stop-motion" | "Híbrido"
        genres = [],
        description = "",
        banner = "",
        support = [],
        episodes = [],
      } = raw;

      const normalizedEpisodes = (episodes || []).map((ep) => ({
        id: ep.id || "",
        title: ep.title || "",
        youtubeId: ep.youtubeId || "",
        kind: ep.kind || "episode",
        thumb: ep.thumb || (ep.youtubeId ? ytThumb(ep.youtubeId) : ""),
      }));

      works.push({
        creatorSlug: cslug,
        creator: creatorData
          ? {
              slug: creatorData.slug || cslug,
              name: creatorData.name || cslug,
              socials: creatorData.socials || [],
              support: creatorData.support || [],
              avatar: creatorData.avatar || "",
            }
          : null,
        slug: slug || file.replace(/\.json$/i, ""),
        title: title || slug || file.replace(/\.json$/i, ""),
        type: type || "Serie",
        medium: medium || "",
        genres,
        description,
        banner,
        support,
        episodes: normalizedEpisodes,
      });
    }
  }

  return works;
}
