// pages/_type-page.js
import React from "react";
import TopTabs from "@/components/TopTabs";        // tus tabs arriba
import YouTubeGrid from "@/components/YouTubeGrid"; // grid de miniaturas
import {
  getAllWorksByType,
  getAllGenresForType,
  ytThumb,
} from "@/lib/server/content";

export default function TypePage({ title, items, genres }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <TopTabs />

      {/* Filtros por género */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map((g) => (
            <span key={g} className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-200 text-sm">
              {g}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <YouTubeGrid items={items} />
    </div>
  );
}

export async function getStaticPropsForType(type, titleText) {
  const items = getAllWorksByType(type).map((w) => ({
    slug: w.slug,
    title: w.title,
    youtubeId: (w.episodes?.[0]?.youtubeId) || "",
    thumb: w.episodes?.[0]?.youtubeId ? ytThumb(w.episodes[0].youtubeId) : "",
  }));

  const genres = getAllGenresForType(type);
  return {
    props: {
      title: titleText,
      items,
      genres,
    },
    revalidate: 60,
  };
}
