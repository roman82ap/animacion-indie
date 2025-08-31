import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-black/70 backdrop-blur sticky top-0 z-50 border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/Logo.png"
            width={36}
            height={36}
            alt="Veridion23"
            priority
            className="rounded"
          />
          <span className="text-fuchsia-400 font-semibold tracking-wide group-hover:text-fuchsia-300 transition">
            Veridion23
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-fuchsia-300 transition">Inicio</Link>
          <Link href="/series" className="hover:text-fuchsia-300 transition">Series</Link>
          <Link href="/cortos" className="hover:text-fuchsia-300 transition">Cortos</Link>
          <Link href="/peliculas" className="hover:text-fuchsia-300 transition">Películas</Link>
          <Link href="/trailers" className="hover:text-fuchsia-300 transition">Trailers</Link>
        </div>
      </div>
    </nav>
  );
}
