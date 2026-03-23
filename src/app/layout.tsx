// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Seu Nome — Designer & Videomaker",
    default: "Seu Nome — Designer Gráfico & Videomaker",
  },
  description:
    "Portfolio de Seu Nome — Designer gráfico especializado em branding, social media, edição de vídeo e motion graphics.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Seu Nome Portfolio",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
