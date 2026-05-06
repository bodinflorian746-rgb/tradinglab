import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";

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
        <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                📈
              </div>
              <span className="text-lg font-bold">TradingLab</span>
            </Link>

            {/* Nav */}
            <div className="hidden md:flex items-center gap-7">
              <Link
                href="/formations"
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                Trading
              </Link>
              <Link
                href="/formations/macro"
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                Macro
              </Link>
              <Link
                href="/jeux"
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                Jeux
              </Link>
              <Link
                href="/strategies"
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                Stratégies
              </Link>
              <Link
                href="/pricing"
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                Tarifs
              </Link>
            </div>

            {/* Bouton */}
            <Link
              href="/login"
              className="bg-emerald-500 text-black px-4 py-2 rounded-lg"
            >
              Commencer
            </Link>

          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}