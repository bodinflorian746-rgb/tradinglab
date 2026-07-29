"use client";

// Sélecteur de langue compact ("FR ▾") — remplace l'ancien switcher FR | EN | ES
// en ligne. Un seul bouton affichant la locale courante, qui ouvre un petit
// menu déroulant listant les 2 autres locales. Fermeture au clic extérieur,
// à l'Échap, ou après sélection (navigation).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale, useDict } from "@/app/components/LocaleProvider";
import { localizedHref, stripLocalePrefix } from "@/lib/i18n/href";
import type { Locale } from "@/i18n/config";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export function LangMenu({ onNavigate }: { onNavigate?: () => void }) {
  const t = useDict("nav");
  const currentLocale = useLocale();
  const pathname = usePathname() ?? "/";
  const basePath = stripLocalePrefix(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        data-testid="nav-lang-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.language}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold tracking-wide text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
      >
        {current.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t.language}
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[88px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 py-1 shadow-xl shadow-black/40"
        >
          {LOCALES.map((l) => {
            const isActive = l.code === currentLocale;
            return (
              <Link
                key={l.code}
                role="menuitem"
                href={localizedHref(basePath, l.code)}
                hrefLang={l.code}
                aria-current={isActive ? "true" : undefined}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className={`block px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive ? "text-emerald-400" : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
