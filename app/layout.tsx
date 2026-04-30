import type { Metadata } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin-ext"]
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin-ext"]
});

export const metadata: Metadata = {
  title: "EU Funds Operations Hub",
  description: "Dashboard intern pentru Fondul de Modernizare și PNRR / REPowerEU"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
