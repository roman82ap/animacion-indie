export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1>Veridion23</h1>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-gray-400 p-4 text-center">
        © 2024 Veridion23. Todos los derechos reservados.
      </footer>
    </div>
  );
}
