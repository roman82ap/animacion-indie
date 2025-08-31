// components/Layout.js
import Head from 'next/head';
import Navbar from './Navbar';

export default function Layout({ children, title = 'Veridion23' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="theme-color" content="#000000" />
      </Head>
      <div className="min-h-screen bg-neutral-950 text-white">
        <Navbar />
        {children}
        <footer className="text-center text-sm opacity-70 py-10">© {new Date().getFullYear()} Veridion23</footer>
      </div>
    </>
  );
}
