import TypePage from "./_type-page";

export default function Page(props) { return <TypePage {...props} />; }

export async function getStaticProps() {
  const { getWorksByType } = await import("../lib/server/content.js");
  const works = getWorksByType("pelicula");
  return { props: { works, type: "peliculas" }, revalidate: 60 };
}
