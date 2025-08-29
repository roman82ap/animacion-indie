// pages/series.js
import ContentGrid from "../components/ContentGrid";
import { getAllWorks } from "../lib/content"; // OJO: ruta relativa sin alias

export default function SeriesPage({ items }) {
  return <ContentGrid title="Series" items={items} />;
}

export async function getStaticProps() {
  // Trae TODAS las obras ya normalizadas desde lib/content.js
  const all = await getAllWorks();

  // Filtra solo tipo Serie (ajusta si en tu modelo el campo se llama distinto)
  const items = (all || [])
    .filter((x) => (x.type || x.kind || x.category) === "Serie")
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    props: { items },
    revalidate: 60, // ISR opcional
  };
}
