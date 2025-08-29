// pages/series.js
import TypePage, { getStaticPropsForType } from "./_type-page";

export default function Page(props) {
  return <TypePage {...props} />;
}

export async function getStaticProps() {
  return getStaticPropsForType("Serie", "Series");
}
