// pages/index.js
import Link from 'next/link';
import Layout from '@/components/Layout';
import catalog from '@/data/catalog.json';

export default function Home() {
  const works = catalog.works || [];
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Últimos contenidos</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {works.map(item => (
            <Link
              key={item.slug}
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
          ))}
        </div>
      </div>
    </Layout>
  );
}
