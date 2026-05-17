import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "TradingLab – Apprends le trading comme un pro",
  description:
    "La plateforme d'apprentissage du trading la plus complète.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className}>
      <body className="bg-zinc-950 text-white antialiased">
        <Navbar />

        {children}
      </body>
    </html>
  );
}