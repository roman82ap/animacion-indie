// pages/series.js
import TypePage from "./_type-page";

export default function Page(props) { return <TypePage {...props} />; }

export async function getStaticProps() {
  const { getWorksByType } = await import("../lib/server/content.js");
  const works = getWorksByType("serie");
  return { props: { works, type: "series" }, revalidate: 60 };
}
