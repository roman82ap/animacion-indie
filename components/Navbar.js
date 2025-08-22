import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex gap-6">
      <Link href="/">Inicio</Link>
      <Link href="/series">Series</Link>
      <Link href="/about">Sobre nosotros</Link>
    </nav>
  )
}
