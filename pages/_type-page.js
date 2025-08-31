// pages/_type-page.js
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getWorksByType } from '@/lib/server/content';

function Card({ item }) {
  return (
    <Link
      href={`/obra/${item.slug}`}
      className="block rounded-xl overflow-hidden bg-neutral-800 hover:bg-neutral-700 ring-1 ring-white/10 hover:ring-fuchsia-500 transition"
    >
      <img
        src={item.thumb || '/Logo.png'}
        alt={item.title}
        className="w-full aspect-video object-cover"
        loading="lazy"
      />
      <div className="p-3">
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-xs text-neutral-300 mt-1">
          {item.media ? `${item.media} • ` : ''}
          {(item.genres || []).join(', ')}
        </p>
      </div>
    </Link>
  );
}

export default function TypePage({ title, items }) {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        {items.length === 0 ? (
          <p className="opacity-70">Pronto…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((it) => (
              <Card key={it.slug} item={it} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps(ctx) {
  // Este archivo lo usan pages/series, /cortos, /peliculas, /trailers
  // En cada una le pasamos 'type' via getStaticPropsForType (abajo).
  return { props: { title: 'Contenido', items: [] } };
}

// Helper que usarán las páginas específicas
export async function getStaticPropsForType(label, typeKey) {
  const items = getWorksByType(typeKey.toLowerCase());
  return {
    props: { title: label, items },
    revalidate: 60
  };
}
