import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="mt-16 py-10 text-center text-sm opacity-60">
        © {new Date().getFullYear()} Veridion23 • Animación indie
      </footer>
    </>
  );
}
