// components/ContentGrid.jsx
import { useMemo, useState } from "react";
import FilterPills from "./FilterPills";
import WorkCard from "./WorkCard";

export default function ContentGrid({ title, items }) {
  // Géneros únicos (más "Todos")
  const allGenres = useMemo(() => {
    const set = new Set();
    items.forEach((i) => (i.genres || []).forEach((g) => set.add(g)));
    return ["Todos", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const [active, setActive] = useState("Todos");

  const filtered = useMemo(() => {
    if (active === "Todos") return items;
    return items.filter((i) => (i.genres || []).includes(active));
  }, [items, active]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
      </header>

      {/* Filtros por género */}
      <div className="mb-6">
        <FilterPills items={allGenres} active={active} onChange={setActive} />
      </div>

      {/* Grid */}
      {filtered.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <WorkCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-white/70">No hay contenidos en esta categoría.</p>
      )}
    </section>
  );
}
