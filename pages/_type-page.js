// pages/_type-page.js
import Layout from '@/components/Layout';
import WorkCard from '@/components/WorkCard';
import { getWorksByType } from '@/lib/server/content';

export default function TypePage({ title, items }) {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        {items.length === 0 ? (
          <p className="opacity-70">Pronto…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((it) => <WorkCard key={it.slug} item={it} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}

// Helper que usarán las páginas específicas
export async function getStaticPropsForType(label, typeKey) {
  const items = getWorksByType(typeKey.toLowerCase());
  return {
    props: { title: label, items },
    revalidate: 60
  };
}
