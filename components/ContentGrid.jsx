export default function ContentGrid({ works = [] }) {
  if (!works.length) return <p className="opacity-70">Pronto…</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((w) => (
        <a
          key={w.slug}
          href={`/obra/${w.slug}`}
          className="group rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-brand-500 transition"
        >
          <img
            src={w.thumb || "/Logo.png"}
            alt={w.title}
            className="w-full aspect-video object-cover group-hover:opacity-90"
            loading="lazy"
          />
          <div className="p-3">
            <h3 className="font-medium truncate">{w.title}</h3>
            <p className="text-xs opacity-70 truncate">
              {(w.media || w.medium) ? `${w.media || w.medium} • ` : ""}
              {(w.genres || []).join(", ")}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
