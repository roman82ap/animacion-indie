// pages/index.js
import path from "path";
import fs from "fs";

import TopTabs from "../components/TopTabs";
import YouTubeGrid from "../components/YouTubeGrid";
import { YT_VIDEOS } from "../data/youtube";

// Asegúrate que el nombre coincida con tu archivo de carrusel "limpio"
import HeroCarousel from "../components/HeroCarousel";

export default function Home({ banners }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Botonera */}
      <TopTabs />

      {/* Carrusel de banners */}
      <HeroCarousel items={banners} auto interval={6000} showCounter showArrows />

      {/* 4 miniaturas de YouTube */}
      <YouTubeGrid videos={YT_VIDEOS} />
    </div>
  );
}

// Listado automático de /public/banner
export async function getStaticProps() {
  const bannersDir = path.join(process.cwd(), "public", "banner");
  let files = [];

  try {
    files = await fs.promises.readdir(bannersDir);
  } catch (e) {
    console.warn("No se pudo leer /public/banner:", e.message);
  }

  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  const banners = files
    .filter((name) => allowed.has(path.extname(name).toLowerCase()))
    .sort()
    .map((name) => {
      const id = name.replace(path.extname(name), "");
      return {
        id,
        title: id.replace(/[-_]+/g, " "),
        banner: `/banner/${name}`,
        href: "#",
        badges: [],
      };
    });

  return {
    props: { banners },
    revalidate: 60,
  };
}
