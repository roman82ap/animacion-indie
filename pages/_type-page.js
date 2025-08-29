// pages/_type-page.js
// Plantilla genérica de páginas por tipo

import React from "react";

// Tarjetas simples
function Thumb({ item }) {
  const first = item.episodes && item.episodes[0];
  const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const thumb = first?.youtubeId ? ytThumb(first.youtubeId) : "/Logo.png";

  const href = `/obra/${item.slug}`; // ajusta si tu [slug].js espera otro slug

  return (
    <a
      href={href}
      className="block rounded-xl overflow-hidden bg-neutral-900/60 ring-1 ring-white/10 hover:ring-fuchsia-500 transition"
    >
      <div className="aspect-video bg-neutral-800">
        <img src={thumb} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
        <p className="text-xs text-neutral-400">
          {(item.genres || []).join(" • ")}
        </p>
      </div>
    </a>
  );
}

function ContentGrid({ title, items }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {items.length === 0 ? (
        <p className="text-neutral-400">Pronto…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((it) => (
            <Thumb key={it.slug} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TypePage(props) {
  return <ContentGrid title={props.pageTitle} items={props.items} />;
}

// helper usado por cada página de tipo (series, películas, etc.)
export async function getStaticPropsForType(typeSingular, pageTitle) {
  // IMPORTANTE: import dinámico -> esto se ejecuta SOLO en build/servidor
  const server = await import("../lib/server/content.js");
  const all = server.getAllByType(typeSingular);
  const items = [...all].sort((a, b) => a.title.localeCompare(b.title));
  return {
    props: {
      pageTitle,
      items,
    },
    revalidate: 60, // ISR opcional
  };
}
