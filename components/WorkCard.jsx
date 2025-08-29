// components/WorkCard.jsx
import Link from "next/link";

export default function WorkCard({ item }) {
  // thumb: banner si existe; si no, miniatura del primer video
  const thumb =
    item.banner ||
    (item.episodes?.[0]?.thumb ??
      (item.episodes?.[0]?.youtubeId
        ? `https://i.ytimg.com/vi/${item.episodes[0].youtubeId}/hqdefault.jpg`
        : "/Logo.png"));

  return (
    <Link
      href={`/obra/${item.slug}`}
      className="group block rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
    >
      <div className="aspect-video w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={item.title}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3 className="text-white text-base font-semibold line-clamp-1">
          {item.title}
        </h3>
        {item.genres?.length ? (
          <p className="mt-1 text-xs text-white/60 line-clamp-1">
            {item.genres.join(" • ")}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
