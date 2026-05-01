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
  title: "ProjectTracker | Internal Dashboard",
  description: "Dashboard intern pentru monitorizarea proiectelor PNRR, REPowerEU și Fondul de Modernizare.",
  icons: { icon: "/logo.png" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
