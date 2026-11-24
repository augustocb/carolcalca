/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",          // gera o site estático em out/ (prints.html, sobre.html…)
  trailingSlash: false,
  images: { unoptimized: true },
  basePath,                  // "/carolcalca" ao publicar no GitHub Pages
};

export default nextConfig;
