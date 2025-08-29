// components/TopTabs.jsx
export default function TopTabs({ items, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {items.map((g) => {
        const isActive = g === active;
        return (
          <button
            key={g}
            onClick={() => onChange?.(g)}
            className={
              "px-3 py-1 rounded-full text-sm ring-1 transition " +
              (isActive
                ? "bg-fuchsia-600 text-white ring-fuchsia-500"
                : "bg-neutral-900 text-neutral-300 ring-white/10 hover:ring-fuchsia-500")
            }
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
