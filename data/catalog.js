// data/catalog.js
// Estructura base para obras. Puedes ir agregando más.
export const CATALOG = [
  {
    slug: "el-crujido",
    title: "El Crujido",
    type: "Serie", // Serie | Corto | Película | Trailer
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
      { id: "ep1", title: "Clip / Trailer", youtubeId: "8pr352T1Ae4" },
    ],
  },
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
      { id: "ep1", title: "Episodio 1", youtubeId: "Jro1TkqpEXg" },
    ],
  },
  {
    slug: "fuerza-abusiva-trailer-01",
    title: "Fuerza Abusiva – Leoric Trailer Oficial",
    type: "Trailer",
    medium: "3D",
    genres: ["Acción"],
    year: 2024,
    description: "Primer trailer oficial de Fuerza Abusiva (Leoric).",
    creator: { name: "Indie Studio", channelUrl: "", socials: [], support: [] },
    episodes: [
      { id: "t1", title: "Trailer Oficial (Leoric)", youtubeId: "lS8Is7zlJC0" },
    ],
  },
  {
    slug: "fuerza-abusiva-trailer-02",
    title: "Fuerza Abusiva – Trailer Oficial",
    type: "Trailer",
    medium: "3D",
    genres: ["Acción"],
    year: 2024,
    description: "Segundo trailer oficial de Fuerza Abusiva.",
    creator: { name: "Indie Studio", channelUrl: "", socials: [], support: [] },
    episodes: [
      { id: "t1", title: "Trailer Oficial", youtubeId: "7QF7j8axtl4" },
    ],
  },
];

// Escoge 4 destacados (los que saldrán en la home)
export const FEATURED = [
  { slug: "el-crujido", title: "El Crujido", youtubeId: "8pr352T1Ae4" },
  { slug: "holgazanes-y-demonios", title: "Holgazanes y demonios – Episodio 1", youtubeId: "Jro1TkqpEXg" },
  { slug: "fuerza-abusiva-trailer-01", title: "Fuerza Abusiva – Leoric Trailer Oficial", youtubeId: "lS8Is7zlJC0" },
  { slug: "fuerza-abusiva-trailer-02", title: "Fuerza Abusiva – Trailer Oficial", youtubeId: "7QF7j8axtl4" },
];

// Helper para miniaturas de YouTube
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// Helper para buscar por slug
export function getBySlug(slug) {
  return CATALOG.find((x) => x.slug === slug) || null;
}

// Paths para getStaticPaths
export const ALL_SLUGS = CATALOG.map((x) => x.slug);

