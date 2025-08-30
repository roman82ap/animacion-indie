// pages/_type-page.js
// Plantilla genérica reutilizada por /series, /cortos, /peliculas, /trailers

import React from "react";
import ContentGrid from "@/components/ContentGrid";

function Thumb({ item }) {
  const first = item.episodes?.[0];
  const src = first?.youtubeId
    ? `https://i.ytimg.com/vi/${first.youtubeId}/hqdefault.jpg`
    : "/Logo.png";
  const href = `/obra/${item.slug}`;
  return (
    <a href={href} className="block rounded-xl overflow-hidden bg-neutral-800 hover:ring-1 hover:ring-fuchsia-500 transition">
      <div className="aspect-video w-full bg-neutral-700">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={item.title} src={src} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 text-sm text-neutral-200">{item.title}</div>
    </a>
  );
}

export default function TypePage({ title, items }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {items?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => <Thumb key={it.slug} item={it} />)}
        </div>
      ) : (
        <p>Pronto…</p>
      )}
    </div>
  );
}

// Helper para obtener props por tipo SIN importar 'fs' al cliente
export async function getStaticPropsForType(singularName, pageTitle) {
  const { getWorksByType } = await import("@/lib/server/content");
  const items = getWorksByType(singularName) || [];
  return {
    props: { title: pageTitle, items },
    revalidate: 60
  };
}
