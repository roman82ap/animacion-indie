// pages/_type-page.js
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import ContentGrid from "../components/ContentGrid";
import FilterPills from "../components/FilterPills";

export default function TypePage({ works, type }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Cargando...</div>;
  }

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

// Helper reutilizable para las 4 páginas
export async function getStaticPropsForType(typeKey, typeLabel) {
  // Import dinámico -> evita que webpack intente empaquetar 'fs' en cliente
  const { getAllWorks } = await import("../lib/server/content.js");
  const all = await getAllWorks();

  // 'typeKey' debe coincidir con lo que guardas en tus JSON: "Serie" | "Corto" | "Película" | "Trailer"
  const works = all.filter(
    (w) => String(w.type || w.tipo).toLowerCase() === typeKey.toLowerCase()
  );

  return {
    props: {
      works,
      type: typeLabel,
    },
    // si quieres ISR (rebuild cada X seg) puedes activar:
    // revalidate: 60,
  };
}
