// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ytimg.com", "img.youtube.com"], // agrega aquí dominios si usas imágenes externas
  },
};

export default nextConfig;
