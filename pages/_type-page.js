// pages/_type-page.js
// Plantilla genérica para listar obras por tipo (Series, Cortos, Películas, Trailers)

import React from "react";
import ContentGrid from "@/components/ContentGrid";
import FilterPills from "@/components/FilterPills";

// UI de la página de tipo
export default function TypePage({ title, items, tags }) {
  return (
    <div className="space-y-6">
      <FilterPills
        title={title}
        tags={tags || []}
        onChange={() => {}}
      />
      <ContentGrid title={title} items={items} />
    </div>
  );
}

/**
 * getStaticPropsForType:
 * NO importes nada de lib/server en el top-level.
 * Haz import dinámico aquí adentro para que solo se ejecute en build/servidor.
 */
export async function getStaticPropsForType(typeSingular, titlePlural) {
  // 👇 Import dinámico (solo servidor)
  const server = await import("@/lib/server/content");
  const { getAllWorks } = server;

  const all = await getAllWorks();

  const items = (all || [])
    .filter((x) => (x.type || "").toLowerCase() === typeSingular.toLowerCase())
    .sort((a, b) => a.title.localeCompare(b.title));

  // Tags/etiquetas (géneros) agregadas automáticamente
  const tagSet = new Set();
  for (const w of items) {
    (w.genres || []).forEach((g) => tagSet.add(g));
  }

  return {
    props: {
      title: titlePlural,
      items,
      tags: Array.from(tagSet),
    },
    revalidate: 60, // ISR
  };
}
