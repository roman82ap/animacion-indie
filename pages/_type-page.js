// pages/_type-page.js
// Componente reutilizable para Series, Cortos, Películas, Trailers.

import Link from "next/link";

// Mini card simple para evitar dependencias
function Card({ item }) {
  const thumb =
    item.thumb ||
    (item.episodes && item.episodes[0]?.youtubeId
      ? `https://i.ytimg.com/vi/${item.episodes[0].youtubeId}/hqdefault.jpg`
      : "/Logo.png");

  return (
    <Link
      href={`/obra/${item.slug}`}
      className="block rounded-xl overflow-hidden bg-neutral-800 hover:bg-neutral-700 transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumb} alt={item.title} className="w-full aspect-video object-cover" />
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h3>
        <div className="text-xs text-neutral-400 mt-1">
          {item.type} • {item.medium || "—"}
          {item.genres?.length ? (
            <> • {item.genres.slice(0, 2).join(", ")}{item.genres.length > 2 ? "…" : ""}</>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function TypePage({ pageTitle, items }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">{pageTitle}</h1>

      {items.length === 0 ? (
        <p className="text-neutral-400">No hay contenido todavía.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((it) => (
            <Card key={it.slug} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}

// Utilidad compartida para cada página de tipo:
export async function getStaticPropsForType(typeName, pageTitle) {
  // import dinámico para no empaquetar 'fs' en cliente
  const { getAllWorks } = await import("../lib/server/content");
  const all = await getAllWorks();

  const items = (all || [])
    .filter((x) => x.type === typeName)
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));

  return {
    props: { pageTitle, items },
    revalidate: 60, // ISR
  };
}
