// data/creators.js
// Diccionario de creadores por slug (creador opcional).
// Si una obra no tiene creatorSlug, se considera "huérfana" y no se mostrará ficha del creador.

export const CREATORS = {
  "crunch-el-crujido": {
    slug: "crunch-el-crujido",
    name: "Crunch, el crujido",
    socials: [
      { label: "YouTube", href: "https://www.youtube.com/@elcrujido" },
      // { label: "Instagram", href: "https://instagram.com/..." },
      // { label: "X/Twitter", href: "https://x.com/..." },
    ],
    support: [
      // Si el creador tiene financiamiento propio, ponlo aquí:
      // { label: "Patreon", href: "https://patreon.com/..." },
      // { label: "Ko-fi", href: "https://ko-fi.com/..." },
      // { label: "PayPal", href: "https://paypal.me/..." },
    ],
  },

  "indie-studio": {
    slug: "indie-studio",
    name: "Indie Studio",
    socials: [
      // { label: "YouTube", href: "https://www.youtube.com/@..." },
    ],
    support: [
      // { label: "Patreon", href: "https://patreon.com/..." },
    ],
  },
};

// Helper
export function getCreator(slug) {
  return CREATORS[slug] || null;
}
