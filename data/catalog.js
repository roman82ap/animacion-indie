// data/catalog.js
// ========================================================
// Catálogo base de obras. Aquí defines todo tu contenido.
// Puedes ir agregando más entradas dentro de CATALOG.
// ========================================================

export const CATALOG = [
  // -----------------------------------------------------
  // 1) FUERZA ABUSIVA (UN SOLO SLUG CON VARIOS VIDEOS)
  // -----------------------------------------------------
  {
    slug: "fuerza-abusiva",
    title: "Fuerza Abusiva",
    type: "Serie",                // Serie | Corto | Película | Trailer
    medium: "3D",
    genres: ["Acción"],
    year: 2024,
    description: "Proyecto indie de sci-fi / acción.",
    creator: {
      name: "Indie Studio",
      channelUrl: "https://www.youtube.com/@TUCANAL", // cámbialo cuando lo tengas
      socials: [
        // { label: "YouTube", href: "https://www.youtube.com/@TUCANAL" },
      ],
      support: [
        // { label: "Patreon", href: "https://patreon.com/..." },
      ],
    },
    episodes: [
      // Puedes agregar todos los videos de esta serie aquí:
      { id: "leoric-trailer",  title: "Leoric Trailer Oficial", youtubeId: "lS8Is7zlJC0", duration: "" },
      { id: "trailer-oficial", title: "Trailer Oficial",        youtubeId: "7QF7j8axtl4", duration: "" },
      // Ejemplo para futuros episodios:
      // { id: "ep-01", title: "Episodio 1", youtubeId: "XXXXXXXXXXX" },
      // { id: "ep-02", title: "Episodio 2", youtubeId: "YYYYYYYYYYY" },
    ],
  },

  // -----------------------------------------------------
  // 2) EL CRUJIDO
  // -----------------------------------------------------
  {
    slug: "el-crujido",
    title: "El Crujido",
    type: "Serie",
    medium: "2D",
    genres: ["Misterio", "Terror"],
    year: 2024,
    description: "Serie indie de misterio/terror.",
    creator: {
      name: "Crunch, el crujido",
      channelUrl: "https://www.youtube.com/@elcrujido",
      socials: [
        { label: "YouTube", href: "https://www.youtube.com/watch?v=8pr352T1Ae4" },
      ],
      support: [],
    },
    episodes: [
      { id: "ep1", title: "Clip / Trailer", youtubeId: "8pr352T1Ae4", duration: "" },
      // Agrega más episodios con sus IDs de YouTube si los tienes
    ],
  },

  // -----------------------------------------------------
  // 3) HOLGAZANES Y DEMONIOS
  // -----------------------------------------------------
  {
    slug: "holgazanes-y-demonios",
    title: "Holgazanes y demonios – Episodio 1",
    type: "Serie",
    medium: "2D",
    genres: ["Comedia", "Fantasía"],
    year: 2024,
    description: "Una comedia animada de demonios y holgazanes.",
    creator: { name: "Indie Studio", channelUrl: "", socials: [], support: [] },
    episodes: [
      { id: "ep1", title: "Episodio 1", youtubeId: "Jro1TkqpEXg", duration: "" },
    ],
  },
];

// ========================================================
// DESTACADOS (HOME)
// Puedes cambiar los 4 que aparecen en la home.
// Para obras con varios videos (como Fuerza Abusiva) puedes
// pasar episodeId para abrir ese episodio concreto.
// ========================================================
export const FEATURED = [
  { slug: "el-crujido",            title: "El Crujido",                          youtubeId: "8pr352T1Ae4" },
  { slug: "fuerza-abusiva",        title: "Fuerza Abusiva – Leoric Trailer",     youtubeId: "lS8Is7zlJC0", episodeId: "leoric-trailer" },
  { slug: "fuerza-abusiva",        title: "Fuerza Abusiva – Trailer Oficial",    youtubeId: "7QF7j8axtl4", episodeId: "trailer-oficial" },
  { slug: "holgazanes-y-demonios", title: "Holgazanes y demonios – Episodio 1", youtubeId: "Jro1TkqpEXg" },
];

// ========================================================
// HELPERS
// ========================================================

// Miniatura de YouTube (usa hqdefault por mejor calidad)
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// Buscar una obra por slug
export function getBySlug(slug) {
  return CATALOG.find((x) => x.slug === slug) || null;
}

// Slugs para getStaticPaths en pages/obra/[slug].js
export const ALL_SLUGS = CATALOG.map((x) => x.slug);
