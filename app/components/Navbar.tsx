"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLocale, useDict } from "@/app/components/LocaleProvider";
import { localizedHref, stripLocalePrefix } from "@/lib/i18n/href";
import type { Locale } from "@/i18n/config";
import Logo from "@/app/components/Logo";

const SWITCHER_LOCALES: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

function LangSwitcher({ onNavigate }: { onNavigate?: () => void }) {
  const currentLocale = useLocale();
  const pathname = usePathname() ?? "/";
  const basePath = stripLocalePrefix(pathname);

  return (
    <div
      className="inline-flex items-center text-[12px] font-semibold tracking-wide select-none"
      aria-label="Sélecteur de langue"
    >
      {SWITCHER_LOCALES.map((l, i) => {
        const isActive = currentLocale === l.code;
        const href = localizedHref(basePath, l.code);
        return (
          <span key={l.code} className="inline-flex items-center">
            <Link
              href={href}
              hrefLang={l.code}
              aria-current={isActive ? "true" : undefined}
              onClick={onNavigate}
              className={
                isActive
                  ? "text-white px-1.5 py-0.5 cursor-default transition-colors"
                  : "text-zinc-500 hover:text-zinc-200 px-1.5 py-0.5 transition-colors"
              }
            >
              {l.label}
            </Link>
            {i < SWITCHER_LOCALES.length - 1 && (
              <span aria-hidden="true" className="text-zinc-700">|</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

const LINK_DEFS = [
  { href: "/formations", key: "trading" as const },
  { href: "/formations/macro", key: "macro" as const },
  { href: "/jeux", key: "games" as const },
  { href: "/strategies", key: "strategies" as const },
  { href: "/profil-trader", key: "profile" as const },
  { href: "/pricing", key: "pricing" as const },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useDict("nav");

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link href={localizedHref("/", locale)} aria-label="TradeScaleX">
          <Logo size="sm" showTagline={false} />
        </Link>

        {/* Nav desktop */}
        <div className="hidden md:flex items-center gap-7">
          {LINK_DEFS.map((l) => (
            <Link
              key={l.href}
              href={localizedHref(l.href, locale)}
              className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              {t.links[l.key]}
            </Link>
          ))}
        </div>

        {/* Right cluster — switcher langue + bouton Commencer + burger mobile */}
        <div className="flex items-center gap-3">
          <LangSwitcher />

          <Link
            href={localizedHref("/login", locale)}
            className="hidden md:inline-flex bg-emerald-500 text-black px-4 py-2 rounded-lg"
          >
            {t.cta}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t.closeMenu : t.openMenu}
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
            {LINK_DEFS.map((l) => (
              <Link
                key={l.href}
                href={localizedHref(l.href, locale)}
                onClick={() => setIsOpen(false)}
                className="text-zinc-300 hover:text-white py-3 text-sm font-medium border-b border-zinc-800/60 last:border-b-0"
              >
                {t.links[l.key]}
              </Link>
            ))}
            <Link
              href={localizedHref("/login", locale)}
              onClick={() => setIsOpen(false)}
              className="mt-4 mb-3 bg-emerald-500 text-black text-center px-4 py-3 rounded-lg text-sm font-semibold"
            >
              {t.cta}
            </Link>
            <div className="pt-1 pb-3 flex justify-center">
              <LangSwitcher onNavigate={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
