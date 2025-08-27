// data/youtube.js
// Cambia los IDs y títulos cuando quieras
export const YT_VIDEOS = [
  { id: "ScMzIvxBSi4", title: "Trailer 1" },
  { id: "dQw4w9WgXcQ", title: "Trailer 2" },
  { id: "l482T0yNkeo", title: "Trailer 3" },
  { id: "aqz-KE-bpKQ", title: "Trailer 4" },
];

// Helper para obtener thumb HQ de YouTube
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
// o `https://img.youtube.com/vi/${id}/hqdefault.jpg`
