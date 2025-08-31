import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <Navbar />
      <main>{children}</main>
      <footer className="mt-10 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Veridion23
      </footer>
    </div>
  );
}

