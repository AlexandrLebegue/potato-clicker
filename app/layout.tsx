import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Potato Farm — clicker de patates",
  description:
    "Un clicker / idle game d'élevage de patates, 100 % dessiné en SVG. Clique, arrose, améliore, deviens une légende patatière.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-[#7ec8f7]">{children}</body>
    </html>
  );
}
