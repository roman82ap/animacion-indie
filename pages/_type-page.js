// pages/_type-page.js
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import ContentGrid from "../components/ContentGrid";
import FilterPills from "../components/FilterPills";

export default function TypePage({ works, type }) {
  const router = useRouter();

  if (router.isFallback) return <div>Cargando...</div>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{type}</h1>
        <FilterPills />
        <ContentGrid works={works} />
      </div>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  // Import dinámico para que no se empaquete en el cliente
  const { getWorksByType } = await import("../lib/server/content.js");

  const type = (params?.type || "series").toLowerCase();
  // Mapeo: url -> tipo guardado en JSON
  const map = {
    series: "serie",
    cortos: "corto",
    peliculas: "pelicula",
    trailers: "trailer",
  };
  const normalized = map[type] || type;

  const works = getWorksByType(normalized);

  return {
    props: { works, type },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const paths = ["series", "cortos", "peliculas", "trailers"].map((type) => ({
    params: { type },
  }));
  return { paths, fallback: false };
}
