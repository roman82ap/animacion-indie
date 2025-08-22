import Head from "next/head";
import { useMemo, useState } from "react";
import SERIES from "../data/series";

export default function Home() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("todos");
  const [type, setType] = useState("todos");
  const [year, setYear] = useState("todos");
  const [active, setActive] = useState(null);

  const genres = ["Acción","Aventura","Comedia","Ciencia ficción","Fantasía","Terror","Slice of life"];
  const types = ["Serie","Corto","Película","En desarrollo"];
  const years = [2025,2024,2023,2022,2021,2020];

  const filtered = useMemo(() => {
    return SERIES.filter((s) => {
      const matchQ = `${s.title} ${s.creator.name} ${s.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
      const matchG = genre === "todos" || s.genre === genre;
      const matchT = type === "todos" || s.type === type;
      const matchY = year === "todos" || s.year === Number(year);
      return matchQ && matchG && matchT && matchY;
    });
  }, [query, genre, type, year]);

  return (
    <>
      <Head>
        <title>Animación Indie — Descubre y apoya</title>
        <meta name="description" content="Directorio de series animadas independientes. Descubre, sigue y apoya a sus creadores." />
        <meta property="og:title" content="Animación Indie" />
        <meta property="og:description" content="Series, cortos y películas indie curadas con embeds de YouTube." />
      </Head>

      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-700/20 via-fuchsia-700/10 to-neutral-950" />
          <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-fuchsia-300/80 mb-3">
              <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse" /> Plataforma indie
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Donde vive la <span className="text-fuchsia-400">animación independiente</span>
            </h1>
            <p className="mt-4 text-neutral-300 max-w-2xl">
              Descubre, sigue y apoya a creadoras y creadores sin estudios detrás. Todo curado en un solo lugar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#galeria" className="px-5 py-3 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-400 font-semibold transition">Explorar ahora</a>
              <a href="#postula" className="px-5 py-3 rounded-2xl border border-neutral-700 hover:border-neutral-500 font-semibold transition">Postula tu proyecto</a>
            </div>
          </div>
        </header>

        <section id="galeria" className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 bg-neutral-900/60 rounded-3xl p-4 md:p-6 border border-neutral-800">
            <div className="flex-1">
              <label className="text-sm text-neutral-400">Buscar</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Título, creador, tags…"
                className="w-full mt-1 rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
            <Select label="Género" value={genre} onChange={setGenre} options={["todos", ...genres]} />
            <Select label="Tipo" value={type} onChange={setType} options={["todos", ...types]} />
            <Select label="Año" value={year} onChange={setYear} options={["todos", ...years.map(String)]} />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((s) => (
              <article key={s.id} className="group rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50 hover:-translate-y-0.5 transition transform">
                <button onClick={() => setActive(s)} className="text-left w-full">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={`https://img.youtube.com/vi/${s.featuredVideoId}/hqdefault.jpg`} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0" />
                    <span className="absolute bottom-2 right-2 text-xs bg-black/70 px-2 py-1 rounded-md">{s.type} • {s.year}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-2">{s.title}</h3>
                    <p className="text-sm text-neutral-400 mt-1">por {s.creator.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-neutral-800 border border-neutral-700">#{t}</span>
                      ))}
                    </div>
                  </div>
                </button>
                <div className="px-4 pb-4 flex gap-2">
                  {s.creator.support.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" className="text-xs px-2 py-1 rounded-md bg-fuchsia-600 hover:bg-fuchsia-500" rel="noreferrer">{l.label}</a>
                  ))}
                  <a href={s.creator.social.main} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-md border border-neutral-700">Redes</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Proyectos en desarrollo</h2>
          <p className="text-neutral-300 mb-4">Trailers, avances y pilotos que necesitan apoyo para completarse.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERIES.filter(s => s.type === "En desarrollo").map((s) => (
              <article key={s.id} className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50">
                <div className="relative aspect-video">
                  <img src={`https://img.youtube.com/vi/${s.featuredVideoId}/hqdefault.jpg`} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-neutral-400">por {s.creator.name}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {s.creator.support.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded-md bg-fuchsia-600 hover:bg-fuchsia-500">{l.label}</a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="postula" className="mx-auto max-w-7xl px-4 py-12 border-t border-neutral-800">
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6">
            <h2 className="text-2xl md:text-3xl font-bold">Postula tu proyecto</h2>
            <p className="text-neutral-300 mt-2">Pronto habrá un formulario propio; por ahora puedes enlazar un Google Form o Tally.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="#" className="px-5 py-3 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-400 font-semibold">Enviar propuesta</a>
              <a href="#sugerencias" className="px-5 py-3 rounded-2xl border border-neutral-700 hover:border-neutral-500 font-semibold">Sugerencias</a>
            </div>
          </div>
        </section>

        <section id="sugerencias" className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">¿Ideas o feedback?</h2>
          <p className="text-neutral-300 mb-4">Escribe aquí (demo, no envía nada en esta versión).</p>
          <textarea className="w-full min-h-[120px] rounded-2xl bg-neutral-900 border border-neutral-800 p-3 outline-none focus:ring-2 focus:ring-fuchsia-500" placeholder="Escribe aquí…" />
          <div className="mt-3">
            <button className="px-5 py-3 rounded-2xl bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Enviar (demo)</button>
          </div>
        </section>

        {active && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4" onClick={() => setActive(null)}>
            <div className="w-full max-w-5xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${active.featuredVideoId}`}
                      title={active.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold">{active.title}</h3>
                    <p className="text-sm text-neutral-400">{active.genre} • {active.type} • {active.year} • por {active.creator.name}</p>
                    <p className="mt-3 text-neutral-200 whitespace-pre-line">{active.description}</p>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {active.creator.support.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-md bg-fuchsia-600 hover:bg-fuchsia-500">{l.label}</a>
                      ))}
                      <a href={active.creator.social.main} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-md border border-neutral-700">Redes</a>
                      {active.website && <a href={active.website} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-md border border-neutral-700">Web oficial</a>}
                    </div>
                  </div>
                </div>
                <aside className="border-t lg:border-t-0 lg:border-l border-neutral-800 p-4">
                  <h4 className="font-semibold">Episodios</h4>
                  <ul className="mt-3 space-y-2 max-h-[60vh] overflow-auto pr-1">
                    {active.episodes.map((ep) => (
                      <li key={ep.id}>
                        <button onClick={() => setActive({ ...active, featuredVideoId: ep.youtubeId })} className="w-full flex gap-3 text-left">
                          <img src={`https://img.youtube.com/vi/${ep.youtubeId}/mqdefault.jpg`} alt={ep.title} className="w-28 h-16 rounded-lg object-cover border border-neutral-800" />
                          <div>
                            <p className="text-sm font-medium leading-snug line-clamp-2">{ep.title}</p>
                            <p className="text-xs text-neutral-400">{ep.duration}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
              <div className="p-4 flex justify-end gap-2 border-t border-neutral-800">
                <button onClick={() => setActive(null)} className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-neutral-500">Cerrar</button>
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-neutral-800 py-8 text-center text-sm text-neutral-400">
          Hecho con ❤️ por la comunidad — MVP demo.
        </footer>
      </div>
    </>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm text-neutral-400">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
