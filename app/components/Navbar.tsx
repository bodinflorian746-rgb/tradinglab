"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/formations", label: "Trading" },
  { href: "/formations/macro", label: "Macro" },
  { href: "/jeux", label: "Jeux" },
  { href: "/strategies", label: "Stratégies" },
  { href: "/pricing", label: "Tarifs" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            📈
          </div>
          <span className="text-lg font-bold">TradingLab</span>
        </Link>

        {/* Nav desktop */}
        <div className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right cluster — bouton Commencer + burger mobile */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:inline-flex bg-emerald-500 text-black px-4 py-2 rounded-lg"
          >
            Commencer
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            {isOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-800/60 bg-zinc-950/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className="text-zinc-300 hover:text-white py-3 text-sm font-medium border-b border-zinc-800/60 last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-4 mb-3 bg-emerald-500 text-black text-center px-4 py-3 rounded-lg text-sm font-semibold"
            >
              Commencer
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
