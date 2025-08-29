// pages/_type-page.js
import ContentGrid from "@/components/ContentGrid";
import { getAllWorks } from "@/lib/content"; // Ajusta el nombre si tu export difiere

export default function TypePage({ title, items }) {
  return <ContentGrid title={title} items={items} />;
}

// SSR/SSG helper para otras páginas
export async function getStaticPropsForType(type, title) {
  const all = await getAllWorks(); // devuelve TODAS las obras ya normalizadas
  const items = all
    .filter((x) => (x.type || x.kind || x.category) === type) // ajusta si tu campo se llama distinto
    .sort((a, b) => a.title.localeCompare(b.title));

  return {
    props: { title, items },
    revalidate: 60, // opcional: ISR 1 min
  };
}
