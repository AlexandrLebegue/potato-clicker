import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Export statique : out/ est servi par Capacitor (Android) et n'importe quel CDN.
  output: "export",
  // Pas de next/image optimisé sur un export statique.
  images: { unoptimized: true },
};

export default nextConfig;
