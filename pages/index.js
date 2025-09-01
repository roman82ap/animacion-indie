import Layout from "../components/Layout";

export default function Home({ featured, latest }) {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Carrusel */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Destacados</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((w) => (
              <a
                key={w.slug}
                href={`/obra/${w.slug}`}
                className="group rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-brand-500 transition"
              >
                <img
                  src={w.thumb || "/Logo.png"}
                  alt={w.title}
                  className="w-full aspect-video object-cover group-hover:opacity-90"
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
        </section>

        {/* Últimos (ejemplo: trailers o lo que definas) */}
        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-xl font-semibold">Últimos</h2>
            <a href="/trailers" className="text-brand-500 hover:underline">
              Ver todos →
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((w) => (
              <a
                key={w.slug}
                href={`/obra/${w.slug}`}
                className="group rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-brand-500 transition"
              >
                <img
                  src={w.thumb || "/Logo.png"}
                  alt={w.title}
                  className="w-full aspect-video object-cover group-hover:opacity-90"
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
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { getAllWorks } = await import("../lib/server/content.js");
  const all = getAllWorks();
  const featured = all.slice(0, 4);
  const latest = all.slice(0, 8);
  return { props: { featured, latest }, revalidate: 60 };
}
