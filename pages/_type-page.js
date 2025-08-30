// pages/_type-page.js
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import ContentGrid from "../components/ContentGrid";
import FilterPills from "../components/FilterPills";

// Normaliza el tipo a uno de: "series" | "cortos" | "peliculas" | "trailers"
function normalizeType(work) {
  const raw = String(
    work?.type ?? work?.tipo ?? work?.kind ?? ""
  ).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // singular -> plural y variantes en español
  if (raw === "serie") return "series";
  if (raw === "corto") return "cortos";
  if (raw === "pelicula") return "peliculas";
  if (raw === "trailer" || raw === "trailers") return "trailers";

  // por si ya viene plural normalizado
  if (["series", "cortos", "peliculas", "trailers"].includes(raw)) return raw;

  return ""; // desconocido
}

export default function TypePage({ works, type }) {
  const router = useRouter();
  if (router.isFallback) return <div>Cargando...</div>;

  // Título bonito
  const titleMap = {
    series: "Series",
    cortos: "Cortos",
    peliculas: "Películas",
    trailers: "Trailers",
  };
  const niceTitle = titleMap[type] ?? type;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">{niceTitle}</h1>
        <FilterPills />
        <ContentGrid works={works} />
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  // Import dinámico: evita que Vercel intente empacar 'fs' en el cliente
  const { getAllWorks } = await import("../lib/server/content.js");
  const all = await getAllWorks();

  const type = (params?.type || "series").toLowerCase();

  // Filtra usando la normalización anterior
  const works = all.filter((w) => normalizeType(w) === type);

  return {
    props: { works, type },
    revalidate: 60, // ISR
  };
}

export async function getStaticPaths() {
  const paths = ["series", "cortos", "peliculas", "trailers"].map((type) => ({
    params: { type },
  }));
  return { paths, fallback: false };
}
