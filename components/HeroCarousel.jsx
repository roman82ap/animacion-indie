import { useEffect, useState } from "react";

export default function HeroCarousel({ items = [] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const current = items[i];

  return (
    <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10">
      <a href={`/obra/${current.slug}`}>
        <img
          src={current.thumb || "/Logo.png"}
          alt={current.title}
          className="w-full h-[38vh] md:h-[46vh] object-cover"
        />
      </a>

      <div className="absolute bottom-3 right-3 bg-black/60 text-xs px-2 py-1 rounded">
        {i + 1}/{items.length}
      </div>
    </div>
  );
}
