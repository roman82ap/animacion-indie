import Layout from '../components/Layout';
import ContentGrid from '../components/ContentGrid';

// mapeo robusto por si el JSON trae "Película" con tilde, etc.
const CANON = {
  serie: 'Serie',
  series: 'Serie',
  'serie(s)': 'Serie',
  corto: 'Corto',
  cortos: 'Corto',
  pelicula: 'Película',
  películas: 'Película',
  peliculaS: 'Película',
  película: 'Película',
  trailer: 'Trailer',
  trailers: 'Trailer',
};

function canonType(input) {
  if (!input) return null;
  const k = String(input).toLowerCase();
  return CANON[k] || input; // devuelve original si no matchea
}

export default function TypePage({ title, items }) {
  return (
    <Layout>
      <ContentGrid title={title} items={items} />
    </Layout>
  );
}

export async function getStaticPropsForType(typeLabel, pageTitle) {
  const { getAllWorks } = await import('../lib/server/content');
  const all = await getAllWorks();

  const wanted = canonType(typeLabel);
  const items = all
    .filter((w) => canonType(w.type) === wanted)
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  return {
    props: {
      title: pageTitle || typeLabel,
      items,
    },
    revalidate: 60, // ISR
  };
}
