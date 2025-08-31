import Link from 'next/link';

export default function WorkCard({ item }) {
  const thumb =
    (item.episodes && item.episodes[0]?.youtubeId)
      ? `https://i.ytimg.com/vi/${item.episodes[0].youtubeId}/hqdefault.jpg`
      : '/Logo.png';

  return (
    <Link href={`/obra/${item.slug}`} className="block group">
      <div className="rounded-xl overflow-hidden bg-neutral-900 ring-1 ring-neutral-800/70 hover:ring-fuchsia-500/40 transition">
        <div
          className="aspect-[16/9] bg-neutral-800 bg-center bg-cover"
          style={{ backgroundImage: `url(${thumb})` }}
        />
        <div className="p-3">
          <div className="text-white font-semibold group-hover:text-fuchsia-300 transition line-clamp-1">
            {item.title}
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            {item.medium} • {Array.isArray(item.genres) ? item.genres.join(', ') : item.genres}
          </div>
        </div>
      </div>
    </Link>
  );
}
