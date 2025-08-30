// pages/series.js
import TypePage, { getStaticPropsForType } from "./_type-page";

export default function Page(props) {
  return <TypePage {...props} />;
}

export async function getStaticProps() {
  // "Serie" debe coincidir con el campo type/tipo en tus JSON
  return getStaticPropsForType("Serie", "Series");
}
