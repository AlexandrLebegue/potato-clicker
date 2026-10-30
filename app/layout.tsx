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
  // cover : indispensable pour les safe-areas (notch) via env() ;
  // userScalable : non au zoom pincement (c'est un jeu, pas une page).
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-[#7ec8f7]">{children}</body>
    </html>
  );
}
