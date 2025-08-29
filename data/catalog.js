// data/catalog.js
import { getCreator } from "./creators";

// ========== CATÁLOGO DE OBRAS ==========
// type: "Serie" | "Corto" | "Película" | "Trailer"
// medium: "2D" | "3D" | "Stop-motion" | "Híbrido"

export const CATALOG = [
  // 1) Obra con varios videos y con CREATOR
  {
    slug: "fuerza-abusiva",
    title: "Fuerza Abusiva",
    type: "Serie",
    medium: "3D",
    genres: ["Acción"],
    description: "Proyecto indie de sci-fi / acción.",
    // Si hay creador:
    creatorSlug: "indie-studio",
    // Apoyo específico de la obra (si existe). Si no, tomará el del creador.
    support: [
      // { label: "Patreon", href: "https://patreon.com/fuerzaabusiva" },
    ],
    episodes: [
      { id: "leoric-trailer",  title: "Leoric Trailer Oficial", youtubeId: "lS8Is7zlJC0", kind: "trailer" },
      { id: "trailer-oficial", title: "Trailer Oficial",        youtubeId: "7QF7j8axtl4", kind: "trailer" },
      // { id: "ep-01", title: "Episodio 1", youtubeId: "XXXXXXXXXXX", kind: "episodio" },
    ],
  },

  // 2) Obra con un video y con CREATOR
  {
    slug: "el-crujido",
    title: "El Crujido",
    type: "Serie",
    medium: "2D",
    genres: ["Misterio", "Terror"],
    description: "Serie indie de misterio/terror.",
    creatorSlug: "crunch-el-crujido",
    support: [
      // { label: "Ko-fi", href: "https://ko-fi.com/..." },
    ],
    episodes: [
      { id: "ep1", title: "Clip / Trailer", youtubeId: "8pr352T1Ae4", kind: "trailer" },
    ],
  },

  // 3) Obra “huérfana” (video no oficial o sin datos del autor)
  {
    slug: "holgazanes-y-demonios",
    title: "Holgazanes y demonios – Episodio 1",
    type: "Serie",
    medium: "2D",
    genres: ["Comedia", "Fantasía"],
    description: "Comedia animada de demonios y holgazanes.",
    // Sin creatorSlug => no muestra ficha de creador
    episodes: [
      { id: "ep1", title: "Episodio 1", youtubeId: "Jro1TkqpEXg", kind: "episodio" },
    ],
  },
];

// ========== DESTACADOS (HOME) ==========
export const FEATURED = [
  // Pueden apuntar al mismo slug con episodeId distinto
  { slug: "fuerza-abusiva",        title: "Fuerza Abusiva – Leoric Trailer",  youtubeId: "lS8Is7zlJC0", episodeId: "leoric-trailer" },
  { slug: "fuerza-abusiva",        title: "Fuerza Abusiva – Trailer Oficial", youtubeId: "7QF7j8axtl4", episodeId: "trailer-oficial" },
  { slug: "el-crujido",            title: "El Crujido",                        youtubeId: "8pr352T1Ae4" },
  { slug: "holgazanes-y-demonios", title: "Holgazanes y demonios – Ep. 1",    youtubeId: "Jro1TkqpEXg" },
];

// ========== HELPERS ==========
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export function getBySlug(slug) {
  const obra = CATALOG.find((x) => x.slug === slug) || null;
  if (!obra) return null;

  // Resuelve creador si existe
  const creator = obra.creatorSlug ? getCreator(obra.creatorSlug) : null;

  // El bloque de apoyo preferente: primero el de la obra, luego el del creador.
  const support = (obra.support && obra.support.length > 0)
    ? obra.support
    : (creator?.support || []);

  return { ...obra, creator, support };
}

export const ALL_SLUGS = CATALOG.map((x) => x.slug);
