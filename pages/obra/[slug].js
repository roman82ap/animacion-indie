import Head from "next/head";
import { ALL_SLUGS, getBySlug, ytThumb } from "../../data/catalog";
import YouTubePlayer from "../../components/YouTubePlayer";
import { useState } from "react";

export default function ObraPage({ obra }) {
  const [current, setCurrent] = useState(obra.episodes?.[0] || null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Head>
        <title>{obra.title} — Veridion23</title>
        <meta name="description" content={`${obra.title} — ${obra.creator?.name || ""}`} />
      </Head>

      {/* Header de la obra */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold">{obra.title}</h1>
        <p className="text-sm text-neutral-400 mt-1">
          {obra.type} • {obra.medium} {obra.year ? `• ${obra.year}` : ""}
          {obra.genres?.length ? ` • ${obra.genres.join(", ")}` : ""}
        </p>
      </div>

      {/* Layout: player + info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <YouTubePlayer youtubeId={current?.youtubeId} title={`${obra.title} — ${current?.title || ""}`} />
          {current?.title && (
            <div className="mt-2 text-neutral-300">
              Reproduciendo: <span className="font-semibold">{current.title}</span>
            </div>
          )}
        </div>

        {/* Info del creador y links */}
        <aside className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 h-max">
          {obra.creator?.name && (
            <div className="mb-2">
              <div className="text-sm text-neutral-400">Creador</div>
              <div className="font-semibold">{obra.creator.name}</div>
            </div>
          )}

          {obra.creator?.channelUrl && (
            <a
              href={obra.creator.channelUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 px-3 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-sm"
            >
              Canal de YouTube
            </a>
          )}

          {/* Redes / Apoyo */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(obra.creator?.socials || []).map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-md border border-neutral-700">
                {l.label}
              </a>
            ))}
            {(obra.creator?.support || []).map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-md bg-fuchsia-600 hover:bg-fuchsia-500">
                {l.label}
              </a>
            ))}
          </div>

          {obra.description && <p className="text-sm text-neutral-300 mt-4">{obra.description}</p>}
        </aside>
      </div>

      {/* Lista de episodios / cortos */}
      {obra.episodes?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-3">Episodios / Videos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {obra.episodes.map((ep) => (
              <button
                key={ep.id}
                onClick={() => setCurrent(ep)}
                className={`text-left group rounded-xl overflow-hidden border ${
                  current?.id === ep.id ? "border-fuchsia-500" : "border-neutral-800"
                } bg-neutral-900 hover:-translate-y-0.5 transition`}
              >
                <div className="relative aspect-video">
                  <img src={ytThumb(ep.youtubeId)} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="p-2">
                  <div className="text-sm font-semibold line-clamp-2">{ep.title}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Generación estática de rutas
export async function getStaticPaths() {
  return {
    paths: ALL_SLUGS.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const obra = getBySlug(params.slug);
  if (!obra) return { notFound: true };
  return { props: { obra } };
}
