// data/catalog.js
// Estructura base para obras. Puedes ir agregando más.
export const CATALOG = [
  {
    slug: "el-crujido",
    title: "El Crujido",
    type: "Serie", // Serie | Corto | Película | Trailer
    medium: "2D",
    genres: ["Misterio"],
    year: 2024,
    description: "Serie indie de misterio/terror.",
    creator: {
      name: "Crunch, el crujido",
      channelUrl: "https://www.youtube.com/@elcrujido", // ajusta si tienes el canal
      socials: [
        { label: "YouTube", href: "https://www.youtube.com/watch?v=8pr352T1Ae4" },
      ],
      support: [
        // { label: "Patreon", href: "https://patreon.com/..." },
      ],
    },
    episodes: [
      { id: "ep1", title: "Clip / Trailer", youtubeId: "8pr352T1Ae4", duration: "" },
      // Agrega más episodios con sus IDs de YouTube
    ],
  },
  {
    slug: "trailer-1",
    title: "Trailer 1",
    type: "Trailer",
    medium: "2D",
    genres: ["Sci-Fi"],
    year: 2024,
    creator: { name: "Indie Studio", channelUrl: "", socials: [], support: [] },
    episodes: [{ id: "t1", title: "Trailer 1", youtubeId: "Jro1TkqpEXg" }],
  },
  {
    slug: "trailer-2",
    title: "Trailer 2",
    type: "Trailer",
    medium: "3D",
    genres: ["Acción"],
    year: 2024,
    creator: { name: "Indie Studio", channelUrl: "", socials: [], support: [] },
    episodes: [{ id: "t1", title: "Trailer 2", youtubeId: "lS8Is7zlJC0" }],
  },
  {
    slug: "trailer-3",
    title: "Trailer 3",
    type: "Trailer",
    medium: "2D",
    genres: ["Aventura"],
    year: 2024,
    creator: { name: "Indie Studio", channelUrl: "", socials: [], support: [] },
    episodes: [{ id: "t1", title: "Trailer 3", youtubeId: "7QF7j8axtl4" }],
  },
];

// Escoge 4 destacados (los que saldrán en la home)
export const FEATURED = [
  { slug: "el-crujido", title: "El Crujido", youtubeId: "8pr352T1Ae4" },
  { slug: "trailer-1", title: "Trailer 1", youtubeId: "Jro1TkqpEXg" },
  { slug: "trailer-2", title: "Trailer 2", youtubeId: "lS8Is7zlJC0" },
  { slug: "trailer-3", title: "Trailer 3", youtubeId: "7QF7j8axtl4" },
];

// Helper para miniaturas de YouTube
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// Helper para buscar por slug
export function getBySlug(slug) {
  return CATALOG.find((x) => x.slug === slug) || null;
}

// Paths para getStaticPaths
export const ALL_SLUGS = CATALOG.map((x) => x.slug);
