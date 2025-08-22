const SERIES = [
  {
    id: "1",
    title: "Ecos del Vacío",
    type: "Serie",
    year: 2025,
    genre: "Ciencia ficción",
    tags: ["space", "mechas", "indie", "latam"],
    description: "Una tripulación marginada encuentra señales imposibles en los restos de un mundo muerto. Animación 2D con toques de 3D, hecha por 3 personas en su tiempo libre.",
    featuredVideoId: "dQw4w9WgXcQ",
    website: "https://example.com",
    creator: {
      name: "Estudio Fantasma",
      social: { main: "https://twitter.com" },
      support: [
        { label: "Apoya en Patreon", href: "https://patreon.com" },
        { label: "Ko-fi", href: "https://ko-fi.com" }
      ]
    },
    episodes: [
      { id: "e1", title: "Piloto — Llamado", youtubeId: "dQw4w9WgXcQ", duration: "7:42" },
      { id: "e2", title: "Ep. 2 — Interferencia", youtubeId: "9bZkp7q19f0", duration: "9:10" },
      { id: "e3", title: "Ep. 3 — Ecos", youtubeId: "3JZ_D3ELwOQ", duration: "8:03" }
    ]
  },
  {
    id: "2",
    title: "Mate & Monstruos",
    type: "Corto",
    year: 2024,
    genre: "Comedia",
    tags: ["humor", "2D", "cotidiano"],
    description: "Un día normal se arruina cuando un monstruo decide que quiere aprender a cebar mate.",
    featuredVideoId: "9bZkp7q19f0",
    creator: {
      name: "Clara B.",
      social: { main: "https://instagram.com" },
      support: [{ label: "Paypal", href: "https://paypal.me" }]
    },
    episodes: [{ id: "c1", title: "Corto completo", youtubeId: "9bZkp7q19f0", duration: "4:55" }]
  },
  {
    id: "3",
    title: "Huesos y Tinta",
    type: "En desarrollo",
    year: 2025,
    genre: "Fantasía",
    tags: ["grimdark", "espadas", "magia"],
    description: "Teaser de una serie grimdark de fantasía ilustrada con texturas de tinta y sombreado procedural.",
    featuredVideoId: "3JZ_D3ELwOQ",
    creator: {
      name: "Bruma Colectivo",
      social: { main: "https://youtube.com/@bruma" },
      support: [
        { label: "Apoya en Patreon", href: "https://patreon.com" },
        { label: "Ko-fi", href: "https://ko-fi.com" }
      ]
    },
    episodes: [{ id: "t1", title: "Teaser 01", youtubeId: "3JZ_D3ELwOQ", duration: "1:12" }]
  },
  {
    id: "4",
    title: "Ciudad Espectral",
    type: "Película",
    year: 2023,
    genre: "Terror",
    tags: ["noir", "fantasmas", "suspenso"],
    description: "Una investigadora paranormal recorre una ciudad donde las sombras recuerdan.",
    featuredVideoId: "hY7m5jjJ9mM",
    creator: {
      name: "Lumen Estudio",
      social: { main: "https://linktr.ee" },
      support: [{ label: "Paypal", href: "https://paypal.me" }]
    },
    episodes: [{ id: "p1", title: "Película completa", youtubeId: "hY7m5jjJ9mM", duration: "58:31" }]
  }
];

export default SERIES;
