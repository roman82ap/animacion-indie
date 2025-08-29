// components/YouTubeGrid.jsx
import Link from "next/link";
import { ytThumb } from "../data/catalog";

export default function YouTubeGrid({ items = [] }) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Últimos trailers</h2>
        <a
          href="/trailers"
          className="text-sm text-fuchsia-400 hover:underline"
        >
          Ver todos →
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((v) => (
          <Link
            key={v.slug}
            href={`/obra/${v.slug}`}
            className="group relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900"
            title={v.title}
          >
            <div className="relative">
              <img
                src={ytThumb(v.youtubeId)}
                alt={v.title}
                className="h-48 w-full object-cover transition group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition grid place-items-center">
                <div className="h-12 w-12 rounded-full bg-white/90 text-black grid place-items-center text-xl font-bold">
                  ▶
                </div>
              </div>
            </div>
            <div className="px-3 py-2 text-sm text-neutral-200 truncate">
              {v.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
