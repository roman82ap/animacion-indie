export default function YouTubeGrid({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((w) => {
        const first = Array.isArray(w.episodes) ? w.episodes[0] : null;
        const id = first?.youtubeId;
        const thumb = id
          ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
          : (w.thumb || "/Logo.png");
        return (
          <a
            key={w.slug}
            href={`/obra/${w.slug}`}
            className="group rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-brand-500 transition"
          >
            <img
              src={thumb}
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
        );
      })}
    </div>
  );
}
