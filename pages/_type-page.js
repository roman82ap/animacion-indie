// pages/_type-page.js
import { getAllWorks } from "@/lib/server/content";

// UI muy simple por ahora (luego metemos grilla, filtros, etc.)
export default function TypePage({ title, items }) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {items?.length ? (
        <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((w) => (
            <li key={w.slug} className="rounded-lg bg-neutral-900 border border-neutral-800 p-4">
              <a href={`/obra/${w.slug}`} className="block">
                <div className="aspect-video rounded bg-neutral-800 mb-3" />
                <div className="font-semibold">{w.title}</div>
                <div className="text-sm text-neutral-400">
                  {(w.genres || []).join(", ")}
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-neutral-400">Pronto…</p>
      )}
    </main>
  );
}

// ---------- Helper para las páginas por tipo ----------
export async function getStaticPropsForType(typeSingular, pageTitle) {
  const all = await getAllWorks();
  const items = (all || [])
    .filter((x) => (x.type || "").toLowerCase() === typeSingular.toLowerCase())
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    props: { title: pageTitle, items },
    revalidate: 60,
  };
}
