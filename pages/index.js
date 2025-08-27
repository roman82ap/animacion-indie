import { useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import ThumbCard from "../components/ThumbCard";

const TABS = ["Series", "Películas", "Cortos", "Trailers"];

const HERO_DATA = [
  {
    id: "fa1",
    title: "Ecos del Vacío",
    banner: "/banner/FA-Banner-0001.png",
    href: "/serie/ecos-del-vacio",
    badges: ["Serie", "Sci-Fi", "2D"],
  },
  {
    id: "fa2",
    title: "Ciudad Espectral",
    banner: "/banner/FA-Banner-0002.png",
    href: "/pelicula/ciudad-espectral",
    badges: ["Película", "Terror", "3D"],
  },
  {
    id: "crujido",
    title: "El Crujido",
    banner: "/banner/Crujido-Banner-001.png",
    href: "/serie/el-crujido",
    badges: ["Serie", "Misterio", "2D"],
  },
];

const HIGHLIGHTS = [
  {
    id: "m1",
    title: "Mate & Monstruos",
    thumb: "/thumbs/mate.jpg",
    href: "/corto/mate-y-monstruos",
    tag: "Corto",
    meta: "Comedia • 2D",
  },
  {
    id: "m2",
    title: "Helheim Zero",
    thumb: "/thumbs/helheim.jpg",
    href: "/serie/helheim-zero",
    tag: "Serie",
    meta: "Acción • 3D",
  },
  {
    id: "m3",
    title: "Teaser — Nexo 7",
    thumb: "/thumbs/nexo.jpg",
    href: "/trailer/nexo-7",
    tag: "Trailer",
    meta: "Sci-Fi • Híbrido",
  },
  {
    id: "m4",
    title: "Bosque de Humo",
    thumb: "/thumbs/bosque.jpg",
    href: "/pelicula/bosque-de-humo",
    tag: "Película",
    meta: "Misterio • 2D",
  },
  {
    id: "m5",
    title: "Anomalía 03",
    thumb: "/thumbs/anomalia.jpg",
    href: "/serie/anomalia-03",
    tag: "Serie",
    meta: "Thriller • 2D",
  },
];

export default function Home() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Tabs arriba del banner */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                active
                  ? "bg-fuchsia-600 border-fuchsia-500"
                  : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Hero */}
      <HeroCarousel items={HERO_DATA} />

      {/* Destacados (debajo del banner) */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Destacados</h2>
          <a href="/series" className="text-sm text-fuchsia-400 hover:underline">
            Ver todos →
          </a>
        </div>

        {/* Carril horizontal (scroll) */}
        <div className="flex gap-3 overflow-x-auto pb-2 pr-1 snap-x">
          {HIGHLIGHTS.map((it) => (
            <div key={it.id} className="snap-start">
              <ThumbCard item={it} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
