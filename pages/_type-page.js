// pages/_type-page.js
import Layout from "../components/Layout";
import ContentGrid from "../components/ContentGrid";
import FilterPills from "../components/FilterPills";

export default function TypePage({ works, type }) {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{type}</h1>
        <FilterPills />
        {works?.length ? (
          <ContentGrid works={works} />
        ) : (
          <p className="opacity-70">Pronto…</p>
        )}
      </div>
    </Layout>
  );
}
