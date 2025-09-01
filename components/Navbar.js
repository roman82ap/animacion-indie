export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        <a href="/" className="flex items-center gap-3">
          <img src="/Logo.png" alt="Veridion23" className="h-7 w-auto" />
          <span className="font-semibold tracking-wide">VERIDION23</span>
        </a>
        <nav className="flex gap-4 text-sm">
          <a href="/series" className="hover:text-brand-500">Series</a>
          <a href="/cortos" className="hover:text-brand-500">Cortos</a>
          <a href="/peliculas" className="hover:text-brand-500">Películas</a>
          <a href="/trailers" className="hover:text-brand-500">Trailers</a>
        </nav>
      </div>
    </header>
  );
}
