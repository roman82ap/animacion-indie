// pages/series.js
import ContentGrid from "../components/ContentGrid";

export default function SeriesPage({ items }) {
  return <ContentGrid title="Series" items={items} />;
}

export async function getStaticProps() {
  // Import dinámico: NO empaqueta 'fs' para el cliente
  const { getAllWorks } = await import("../lib/server/content");
  const all = await getAllWorks();

  const items = (all || [])
    .filter((x) => (x.type || "") === "Serie")
    .sort((a, b) => a.title.localeCompare(b.title));

  return { props: { items }, revalidate: 60 };
}

