// components/FilterPills.jsx
export default function FilterPills({ items, active, onChange }) {
  const base =
    "px-3 py-1 rounded-full border border-white/10 hover:border-white/30 transition text-sm";
  const selected = "bg-fuchsia-600/90 border-fuchsia-500 text-white";
  const normal = "bg-white/5 text-white/80";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((g) => (
        <button
          key={g}
          className={`${base} ${active === g ? selected : normal}`}
          onClick={() => onChange(g)}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
