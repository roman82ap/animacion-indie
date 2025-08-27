import { useEffect, useMemo, useState } from "react";

export default function HeroCarousel({ items = [], auto = true, interval = 6000, showCounter = true, showArrows = true }) {
  const total = items.length;
  const [i, setI] = useState(0);

  const next = () => setI((p) => (p + 1) % total);
  const prev = () => setI((p) => (p - 1 + total) % total);

  useEffect(() => {
    if (!auto || total <= 1) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [total, auto, interval]);

  const current = useMemo(() => items[i] || null, [i, items]);

  if (!current) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800">
      {/* Contenedor del banner (solo imagen) */}
      <a href={current.href || "#"} className="block">
        <div className="relative w-full" style={{ aspectRatio: "16 / 6" }}>
          <img
            src={current.banner}
            alt={current.title || ""}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Si quieres eliminar el oscurecido, borra el div siguiente */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" /> */}
        </div>
      </a>

      {/* Indicador 01/03 (opcional) */}
      {showCounter && (
        <div className="absolute left-4 top-4 bg-black/70 backdrop-blur px-2.5 py-1.5 rounded-md text-xs">
          {String(i + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </div>
      )}

      {/* Flechas (opcional) */}
      {showArrows && total > 1 && (
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

    </div>
  );
}
