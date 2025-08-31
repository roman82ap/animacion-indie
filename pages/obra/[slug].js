// pages/obra/[slug].js
import Layout from '@/components/Layout';
import { getAllWorks, getWorkBySlug, getRelated } from '@/lib/server/content';

function YouTubeEmbed({ id }) {
  if (!id) return null;
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden ring-1 ring-white/10">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export default function WorkPage({ work, related }) {
  if (!work) return <Layout><div className="max-w-6xl mx-auto p-6">No encontrado</div></Layout>;

  const hasEpisodes = Array.isArray(work.episodes) && work.episodes.length > 0;
  const firstId = hasEpisodes ? work.episodes[0].youtubeId : null;

  return (
    <Layout title={work.title}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div>
            {!firstId && (
              <img
                src={work.thumb || '/Logo.png'}
                alt={work.title}
                className="w-full rounded-xl ring-1 ring-white/10 mb-4"
              />
            )}

            <YouTubeEmbed id={firstId} />

            <h1 className="text-3xl font-bold mt-6">{work.title}</h1>
            <p className="mt-2 text-neutral-300">
              {(work.media || work.medium) ? `${work.media || work.medium} • ` : ''}{(work.genres || []).join(', ')}
            </p>
            {work.description && <p className="mt-4">{work.description}</p>}

            {hasEpisodes && (
              <>
                <h2 className="text-xl font-semibold mt-8 mb-3">Episodios</h2>
                <ul className="space-y-3">
                  {work.episodes.map((ep, i) => (
                    <li key={ep.youtubeId} className="flex items-center gap-3">
                      <span className="text-sm opacity-70 w-6">{i + 1}.</span>
                      <a
                        className="underline hover:text-fuchsia-400"
                        href={`https://youtu.be/${ep.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {ep.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside>
            <h3 className="text-lg font-semibold mb-3">Relacionados</h3>
            <div className="grid gap-4">
              {related.map(r => (
                <a
                  key={r.slug}
                  href={`/obra/${r.slug}`}
                  className="flex items-center gap-3 rounded-lg ring-1 ring-white/10 hover:ring-fuchsia-500 transition p-2"
                >
                  <img
                    src={r.thumb || '/Logo.png'}
                    alt={r.title}
                    className="w-24 h-16 object-cover rounded-md"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{r.title}</p>
                    <p className="text-xs opacity-70 truncate">
                      {(r.media || r.medium) ? `${r.media || r.medium} • ` : ''}{(r.genres || []).join(', ')}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const works = getAllWorks();
  return {
    paths: works.map(w => ({ params: { slug: w.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const work = getWorkBySlug(params.slug);
  const related = getRelated(params.slug, 6);
  return { props: { work: work || null, related }, revalidate: 60 };
}
