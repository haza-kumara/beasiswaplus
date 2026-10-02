import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeasiswaPlus — Akses Beasiswa untuk Semua",
  description:
    "Platform beasiswa inklusif berbasis kebutuhan. Temukan beasiswa yang tepat, ajukan bantuan darurat, dan kelola dokumen aplikasi dengan mudah.",
  keywords: [
    "beasiswa",
    "mahasiswa",
    "bantuan pendidikan",
    "beasiswa inklusif",
    "bantuan darurat",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f9ff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
