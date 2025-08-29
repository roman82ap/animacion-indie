// pages/index.js
import path from "path";
import fs from "fs";

import TopTabs from "../components/TopTabs";
import HeroCarousel from "../components/HeroCarousel";
import YouTubeGrid from "../components/YouTubeGrid";
import { FEATURED } from "../data/catalog"; // 👈 los destacados vienen del catálogo

export default function Home({ banners }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Botonera arriba */}
      <TopTabs />

      {/* Carrusel de banners */}
      <HeroCarousel items={banners} auto interval={6000} showCounter showArrows />

      {/* Miniaturas de 4 obras destacadas */}
      <YouTubeGrid items={FEATURED} />
    </div>
  );
}

// Genera la lista de banners automáticamente desde /public/banner
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
    .map((name) => ({
      id: name.replace(path.extname(name), ""),
      title: name.replace(path.extname(name), "").replace(/[-_]+/g, " "),
      banner: `/banner/${name}`,
      href: "#",
      badges: [],
    }));

  return { props: { banners }, revalidate: 60 };
}
