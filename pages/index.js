import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Veridion23 — Animación indie</title>
        <meta
          name="description"
          content="Directorio de series, cortos y películas de animación independiente. Descubre y apoya a sus creadores."
        />
        <meta property="og:title" content="Veridion23 — Animación indie" />
        <meta
          property="og:description"
          content="Descubre y apoya animación independiente."
        />
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero principal */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-700/15 via-transparent to-transparent" />
        <div className="mx-auto max-w-6xl px-4 py-16 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Animación{" "}
            <span className="text-fuchsia-400">independiente</span> en un solo
            lugar
          </h1>
          <p className="mt-4 text-neutral-300 max-w-2xl">
            Series, cortos y películas de creadores sin estudio. Mira, sigue y
            apoya sus proyectos.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="#galeria"
              className="px-5 py-3 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-400 font-semibold"
            >
              Explorar
            </a>
            <a
              href="#postula"
              className="px-5 py-3 rounded-2xl border border-neutral-700 hover:border-neutral-500 font-semibold"
            >
              Postula tu proyecto
            </a>
          </div>
        </div>
      </section>

      {/* Galería mínima con ejemplos */}
      <section id="galeria" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4">Destacados</h2>
        <GridDemo />
      </section>

      {/* Sección Postula */}
      <section id="postula" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold">Postula tu proyecto</h2>
          <p className="text-neutral-300 mt-2">
            Pronto habrá un formulario propio. Por ahora, comparte tu trailer y
            datos con este enlace:
          </p>
          <a
            href="#"
            className="inline-block mt-4 px-5 py-3 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-400 font-semibold"
          >
            Enviar propuesta
          </a>
        </div>
      </section>
    </>
  );
}

// Componente demo de grilla
function GridDemo() {
  const items = [
    {
      id: "1",
      title: "Ecos del Vacío",
      yt: "dQw4w9WgXcQ",
      info: "Serie • Sci-Fi • 2025",
    },
    {
      id: "2",
      title: "Mate & Monstruos",
      yt: "9bZkp7q19f0",
      info: "Corto • Comedia • 2024",
    },
    {
      id: "3",
      title: "Huesos y Tinta",
      yt: "3JZ_D3ELwOQ",
      info: "En desarrollo • Fantasía",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((s) => (
        <article
          key={s.id}
          className="group rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50 hover:-translate-y-0.5 transition"
        >
          <a
            href={`https://youtu.be/${s.yt}`}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <div className="relative aspect-video">
              <img
                src={`https://img.youtube.com/vi/${s.yt}/hqdefault.jpg`}
                alt={s.title}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="text-sm text-neutral-400">{s.info}</p>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
