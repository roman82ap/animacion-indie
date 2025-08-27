// Lista de videos de YouTube con ID directo y un título de referencia
export const YT_VIDEOS = [
  { id: "Jro1TkqpEXg", title: "Trailer 1" },
  { id: "lS8Is7zlJC0", title: "Trailer 2" },
  { id: "7QF7j8axtl4", title: "Trailer 3" },
  { id: "8pr352T1Ae4", title: "El Crujido – Clip" },
];

// Función para obtener la miniatura HQ de YouTube
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
