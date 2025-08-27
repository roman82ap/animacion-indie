// components/TopTabs.jsx
import Link from "next/link";
import { useRouter } from "next/router";

const TABS = [
  { label: "Inicio", href: "/" },
  { label: "Series", href: "/series" },
  { label: "Cortos", href: "/cortos" },
  { label: "Películas", href: "/peliculas" },
  { label: "Trailers", href: "/trailers" },
];

export default function TopTabs() {
  const router = useRouter();

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {TABS.map((t) => {
        const active = router.pathname === t.href || (t.href === "/" && router.pathname === "/index");
        return (
          <Link key={t.href} href={t.href} className="group">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm border transition
              ${
                active
                  ? "bg-fuchsia-600 border-fuchsia-500 text-white"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-200 hover:border-neutral-700"
              }`}
            >
              {t.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
