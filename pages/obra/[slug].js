import Layout from '@/components/Layout';
import Image from 'next/image';

// helper para miniaturas de YouTube
const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export default function WorkPage({ work }) {
  if (!work) return <Layout><div className="max-w-6xl mx-auto p-6">No encontrado.</div></Layout>;

  const banner =
    work.banner ||
    (work.episodes?.[0]?.youtubeId ? ytThumb(work.episodes[0].youtubeId) : '/Logo.png');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* HERO */}
        <div className="rounded-2xl overflow-hidden ring-1 ring-neutral-800/60 bg-neutral-950">
          <div className="relative aspect-[21/9] sm:aspect-[16/6] bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner}
              alt={work.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute left-6 right-6 bottom-6">
              <div className="text-2xl sm:text-3xl font-bold text-white">{work.title}</div>
              <div className="mt-1 text-sm text-neutral-300">
                {work.type} • {work.medium} • {Array.isArray(work.genres) ? work.genres.join(', ') : work.genres}
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Info principal */}
          <div className="lg:col-span-2">
            {work.description && (
              <p className="text-neutral-300 leading-relaxed mb-4">{work.description}</p>
            )}

            {/* Episodios */}
            {Array.isArray(work.episodes) && work.episodes.length > 0 && (
              <>
                <h2 className="text-white font-semibold mb-3">Episodios</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {work.episodes.map((ep) => (
                    <a
                      key={ep.youtubeId}
                      href={`https://www.youtube.com/watch?v=${ep.youtubeId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl overflow-hidden ring-1 ring-neutral-800/70 hover:ring-fuchsia-500/40 transition bg-neutral-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ytThumb(ep.youtubeId)}
                        alt={ep.title || work.title}
                        className="aspect-video w-full object-cover"
                      />
                      <div className="p-3">
                        <div className="text-neutral-200 font-medium line-clamp-1">
                          {ep.title || 'Episodio'}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">YouTube</div>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl ring-1 ring-neutral-800/70 bg-neutral-950 p-4">
              <div className="text-white font-semibold mb-2">Acerca de</div>
              <ul className="text-sm text-neutral-300 space-y-1">
                <li><b>Tipo:</b> {work.type}</li>
                <li><b>Medio:</b> {work.medium}</li>
                {work.genres?.length ? (
                  <li><b>Géneros:</b> {Array.isArray(work.genres) ? work.genres.join(', ') : work.genres}</li>
                ) : null}
              </ul>

              {(work.support && work.support.length > 0) && (
                <>
                  <div className="text-white font-semibold mt-4 mb-2">Apóyalo</div>
                  <div className="flex flex-col gap-2">
                    {work.support.map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-lg px-3 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

// ================== DATA (SSG) ==================
export async function getStaticPaths() {
  const { getAllWorks } = await import('@/lib/server/content'); // carga solo en build/server
  const all = await getAllWorks();
  const paths = all.map((w) => ({ params: { slug: w.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { getAllWorks } = await import('@/lib/server/content');
  const all = await getAllWorks();
  const work = all.find((w) => w.slug === params.slug) || null;

  return {
    props: { work },
    revalidate: 60, // ISR
  };
}
