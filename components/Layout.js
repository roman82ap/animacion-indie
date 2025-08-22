export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-lg text-fuchsia-400">
            Veridion23
          </a>
          <nav className="flex gap-4 text-sm">
            <a href="/" className="hover:text-fuchsia-400">
              Inicio
            </a>
            <a href="/series" className="hover:text-fuchsia-400">
              Series
            </a>
            <a href="#postula" className="hover:text-fuchsia-400">
              Postula
            </a>
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6 text-center text-sm text-neutral-400">
        © {new Date().getFullYear()} Veridion23
      </footer>
    </div>
  );
}
