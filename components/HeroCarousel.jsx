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
  {/* relación de aspecto 16:6 aprox */}
  <div className="relative w-full" style={{ aspectRatio: '16 / 6' }}>
    <img
      src={current.banner}
      alt={current.title}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
  </div>

  {/* ... título, badges, contador, flechas ... */}
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
