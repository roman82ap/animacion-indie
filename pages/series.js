import Layout from "../components/Layout";
import ContentGrid from "../components/ContentGrid";

export default function Page({ works }) {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Series</h1>
        <ContentGrid works={works} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { getWorksByType } = await import("../lib/server/content.js");
  return { props: { works: getWorksByType("serie") }, revalidate: 60 };
}
