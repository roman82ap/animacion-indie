// pages/index.js
import path from "path";
import fs from "fs";
import HeroCarousel from "../components/HeroCarousel"; // tu carrusel "limpio"

export default function Home({ banners }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <HeroCarousel items={banners} auto interval={6000} showCounter showArrows />
      {/* ...resto de la página... */}
    </div>
  );
}

export async function getStaticProps() {
  const bannersDir = path.join(process.cwd(), "public", "banner"); // carpeta singular
  let files = [];

  try {
    files = await fs.promises.readdir(bannersDir);
  } catch (e) {
    console.warn("No se pudo leer /public/banner:", e.message);
  }

  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  const banners = files
    .filter((name) => allowed.has(path.extname(name).toLowerCase()))
    .sort() // orden por nombre (FA-Banner-0001.png, etc.)
    .map((name) => {
      const id = name.replace(path.extname(name), "");
      return {
        id,
        title: id.replace(/[-_]+/g, " "), // opcional: título a partir del nombre
        banner: `/banner/${name}`,       // ruta pública
        href: "#",                       // si quieres que haga click a algún lado
        badges: [],                      // no se usan, ya quitaste textos
      };
    });

  return {
    props: { banners },
    // opcional: ISR para regenerar cada X seg (si usas API de subida)
    revalidate: 60,
  };
}
