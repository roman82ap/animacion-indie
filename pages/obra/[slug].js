// pages/obra/[slug].js
import { useMemo, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getBySlug, ALL_SLUGS, ytThumb } from "../../data/catalog";

export default function ObraPage({ obra }) {
  const router = useRouter();
  const queryEp = router.query.ep;

  const startIndex = useMemo(() => {
    if (!obra?.episodes?.length) return 0;
    if (!queryEp) return 0;
    const i = obra.episodes.findIndex((e) => e.id === queryEp);
    return i >= 0 ? i : 0;
  }, [obra, queryEp]);

  const [current, setCurrent] = useState(startIndex);
  useEffect(() => setCurrent(startIndex), [startIndex]);

  const playing = obra.episodes?.[current];
  const metaTitle = playing ? `${obra.title} – ${playing.title}` : obra.title;

  const changeEpisode = (idx, id) => {
    setCurrent(idx);
    router.push({ pathname: `/obra/${obra.slug}`, query: { ep: id } }, undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={obra.description || obra.title} />
        {playing && <meta property="og:image" content={ytThumb(playing.youtubeId)} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Volver */}
        <div className="mb-4 text-sm">
          <Link href="/" className="text-fuchsia-400 hover:underline">← Volver al inicio</Link>
        </div>

        {/* Título + metadatos */}
        <h1 className="text-2xl md:text-3xl font-extrabold mb-1">
          {obra.title}{playing?.title ? ` – ${playing.title}` : ""}
        </h1>
        <p className="text-white/70 mb-6">
          {obra.type} • {obra.medium}
          {obra.genres?.length ? ` • ${obra.genres.join(", ")}` : ""}
        </p>

        {/* Player */}
        <div className="aspect-video w-full overflow-hidden rounded-lg ring-1 ring-white/10 bg-black mb-6">
          {playing ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${playing.youtubeId}?rel=0&modestbranding=1`}
              title={playing.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-white/60">Sin episodio</div>
          )}
        </div>

        {/* Ficha creador + apoyo (solo si hay creador o support) */}
        {(obra.creator || (obra.support && obra.support.length)) && (
          <section className="mb-8 grid md:grid-cols-2 gap-6">
            <div>
              {obra.description && (
                <>
                  <h2 className="text-lg font-semibold">Descripción</h2>
                  <p className="text-white/80 mt-2">{obra.description}</p>
                </>
              )}
            </div>

            <div className="bg-neutral-900 rounded-lg p-4 ring-1 ring-white/10">
              <h3 className="font-semibold mb-2">Creador</h3>
              <p className="text-white/90">{obra.creator?.name || "No especificado"}</p>

              {/* Sociales */}
              <div className="flex flex-wrap gap-2 mt-3">
                {obra.creator?.socials?.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                     className="px-3 py-1 rounded-md bg-white/10 text-white/90 hover:bg-white/20 transition text-sm">
                    {s.label}
                  </a>
                ))}
              </div>

              {/* Apoyos: primero los de la obra; si no hay, los del creador */}
              {obra.support?.length > 0 && (
                <>
                  <h4 className="font-semibold mt-4 mb-2">Apóyalo</h4>
                  <div className="flex flex-wrap gap-2">
                    {obra.support.map((s) => (
                      <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                         className="px-3 py-1 rounded-md bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 transition text-sm">
                        {s.label}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Lista de episodios */}
        {obra.episodes?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">Videos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {obra.episodes.map((ep, idx) => (
                <button
                  key={ep.id}
                  onClick={() => changeEpisode(idx, ep.id)}
                  className={`text-left rounded-lg overflow-hidden ring-1 ring-white/10 bg-neutral-900 hover:bg-neutral-800 transition focus:outline-none ${
                    idx === current ? "outline outline-2 outline-fuchsia-500" : ""
                  }`}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img alt={ep.title} src={ytThumb(ep.youtubeId)} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium">{ep.title}</p>
                    {ep.kind && <p className="text-xs text-white/60 mt-0.5">{ep.kind}</p>}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const paths = ALL_SLUGS.map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const obra = getBySlug(params.slug);
  if (!obra) return { notFound: true };
  return { props: { obra } };
}
