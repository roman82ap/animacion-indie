import { useEffect, useMemo, useState } from "react";

export default function HeroCarousel({ items = [], auto = true, interval = 6000 }) {
  const total = items.length;
  const [i, setI] = useState(0);

  // Avanzar
  const next = () => setI((p) => (p + 1) % total);
  const prev = () => setI((p) => (p - 1 + total) % total);

  // Autoplay
  useEffect(() => {
    if (!auto || total <= 1) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [total, auto, interval]);

  const current = useMemo(() => items[i] || null, [i, items]);

  if (!current) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800">
      {/* Imagen */}
      <a href={current.href || "#"} className="block group">
        <div className="relative aspect-[16/7] w-full">
          <img
            src={current.banner}
            alt={current.title}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
        </div>

        {/* Texto sobre el banner */}
        <div className="absolute left-6 bottom-6 sm:left-8 sm:bottom-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold">{current.title}</h2>
          {current.badges?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {current.badges.map((b) => (
                <span
                  key={b}
                  className="text-xs px-2 py-1 rounded-md bg-black/60 border border-neutral-700"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Indicador 01/13 */}
        <div className="absolute left-4 top-4 bg-black/70 backdrop-blur px-2.5 py-1.5 rounded-md text-xs">
          {String(i + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </div>
      </a>

      {/* Flechas */}
      {total > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 p-2"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 p-2"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
