import "./globals.css";
import { Inter } from "next/font/google";
import type { Viewport } from "next";
import Navbar from "@/app/components/Navbar";
import { OnboardingOverlay } from "@/app/components/OnboardingOverlay";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "TradingLab – Apprends le trading comme un pro",
  description:
    "La plateforme d'apprentissage du trading la plus complète.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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

        {/* Onboarding overlay — première visite uniquement */}
        <OnboardingOverlay />
      </body>
    </html>
  );
}