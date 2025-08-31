// components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-black/70 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Veridion23" width={36} height={36} priority />
          <span className="font-semibold text-fuchsia-400 hidden sm:inline">Veridion23</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/" className="px-3 py-1 rounded-full ring-1 ring-white/10 hover:ring-fuchsia-500 transition text-sm">Inicio</Link>
          <Link href="/series" className="px-3 py-1 rounded-full ring-1 ring-white/10 hover:ring-fuchsia-500 transition text-sm">Series</Link>
          <Link href="/cortos" className="px-3 py-1 rounded-full ring-1 ring-white/10 hover:ring-fuchsia-500 transition text-sm">Cortos</Link>
          <Link href="/peliculas" className="px-3 py-1 rounded-full ring-1 ring-white/10 hover:ring-fuchsia-500 transition text-sm">Películas</Link>
          <Link href="/trailers" className="px-3 py-1 rounded-full ring-1 ring-white/10 hover:ring-fuchsia-500 transition text-sm">Trailers</Link>
        </div>
      </div>
    </nav>
  );
}
