export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-black text-white p-4">
        <h1 className="text-xl font-bold">Veridion23</h1>
      </header>

      {/* Contenido */}
      <main className="flex-1 container mx-auto p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center p-4">
        © {new Date().getFullYear()} Veridion23
      </footer>
    </div>
  )
}
