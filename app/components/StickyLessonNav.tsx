// Navigation sticky mobile-only pour les pages de leçons longues.
//
// Architecture : mount GLOBAL dans app/layout.tsx. Le composant détecte
// lui-même s'il est sur une page de leçon (pattern /.../leconN) et calcule
// module / prev / next à partir du pathname + FORMATIONS / STRATEGY_MODULES.
// Aucune intégration nécessaire dans les pages individuelles.
//
// Comportement :
// - Mobile uniquement (sm:hidden)
// - Apparait après ~200px de scroll vers le bas
// - Disparait à 240px du bas pour ne pas masquer le bouton "Terminer"
// - 4 actions : module / précédent / suivant / haut de page

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FORMATIONS } from "@/lib/formations";
import { STRATEGY_MODULES } from "@/lib/strategies";
import { hasLocale } from "@/i18n/config";
import { useDict } from "@/app/components/LocaleProvider";

// Counts hardcodés pour macro (l'app/formations/macro/{level}/lecon{N} n'est
// pas modélisé dans FORMATIONS — counts validés par glob du repo).
const MACRO_LESSON_COUNTS: Record<string, number> = {
  debutant:     6,
  intermediaire: 6,
  avance:        4,
};

// Clé i18n du label du module (résolue côté composant via le dico).
type ModuleLabelKey = "moduleMacro" | "moduleDefault" | "formations";

interface DerivedNav {
  isLesson:       boolean;
  moduleHref:     string;
  moduleLabelKey: ModuleLabelKey;
  prevHref:       string | null;
  nextHref:       string | null;
}

function deriveFromPathname(pathname: string | null): DerivedNav {
  const empty: DerivedNav = { isLesson: false, moduleHref: "/formations", moduleLabelKey: "moduleDefault", prevHref: null, nextHref: null };
  if (!pathname) return empty;
  const m = pathname.match(/^(.+)\/lecon(\d+)\/?$/);
  if (!m) return empty;
  const baseSegment = m[1];       // ex: /fr/formations/debutant
  const lessonNum   = parseInt(m[2], 10);
  if (Number.isNaN(lessonNum)) return empty;

  const parts = baseSegment.split("/").filter(Boolean);
  // Skipper le segment locale (parts[0]) s'il en est un. Conserver le préfixe
  // pour reconstruire les hrefs.
  const localePrefix = parts.length > 0 && hasLocale(parts[0]) ? `/${parts.shift()}` : "";

  let moduleHref:     string;
  let moduleLabelKey: ModuleLabelKey;
  let total:          number | null = null;

  if (parts[0] === "formations") {
    if (parts[1] === "macro") {
      // /formations/macro/{level}/leconN
      const level = parts[2];
      moduleHref     = `${localePrefix}/formations/macro/${level}`;
      moduleLabelKey = "moduleMacro";
      total = MACRO_LESSON_COUNTS[level] ?? null;
    } else {
      // /formations/{level}/leconN
      const level = parts[1];
      moduleHref     = `${localePrefix}/formations`;
      moduleLabelKey = "formations";
      const formation = FORMATIONS.find((f) => f.id === level);
      total = formation?.lessons.length ?? null;
    }
  } else if (parts[0] === "strategies") {
    const module = parts[1];
    moduleHref     = `${localePrefix}/strategies/${module}`;
    moduleLabelKey = "moduleDefault";
    const mod = STRATEGY_MODULES.find((mm) => mm.id === module);
    total = mod?.lessonCount ?? null;
  } else {
    return empty;
  }

  const prevNum = lessonNum > 1 ? lessonNum - 1 : null;
  const nextNum = total !== null && lessonNum < total ? lessonNum + 1 : null;
  return {
    isLesson:       true,
    moduleHref,
    moduleLabelKey,
    prevHref:    prevNum !== null ? `${baseSegment}/lecon${prevNum}` : null,
    nextHref:    nextNum !== null ? `${baseSegment}/lecon${nextNum}` : null,
  };
}

export function StickyLessonNav() {
  const pathname = usePathname();
  const nav = deriveFromPathname(pathname);
  if (!nav.isLesson) return null;
  return <StickyNavBar moduleHref={nav.moduleHref} moduleLabelKey={nav.moduleLabelKey} prevHref={nav.prevHref} nextHref={nav.nextHref} />;
}

interface StickyNavBarProps {
  moduleHref:     string;
  moduleLabelKey: ModuleLabelKey;
  prevHref:       string | null;
  nextHref:       string | null;
}

function StickyNavBar({ moduleHref, moduleLabelKey, prevHref, nextHref }: StickyNavBarProps) {
  const [show, setShow] = useState(false);
  const t = useDict("common").stickyNav;
  const moduleLabel = t[moduleLabelKey];
  const backToModuleLabel = t.backToModule.replace("{label}", moduleLabel);

  useEffect(() => {
    let lastShow = false;
    const onScroll = () => {
      const scrollY    = window.scrollY;
      const viewportH  = window.innerHeight;
      const docH       = document.documentElement.scrollHeight;
      const nearBottom = scrollY + viewportH >= docH - 240;
      const nextShow   = scrollY > 200 && !nearBottom;
      if (nextShow !== lastShow) {
        setShow(nextShow);
        lastShow = nextShow;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className={`sm:hidden fixed bottom-3 inset-x-3 z-40 transition-all duration-200 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      aria-hidden={!show}
    >
      <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] flex items-center justify-around px-1.5 py-1.5">
        <NavButton href={moduleHref} ariaLabel={backToModuleLabel}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {/* Module icon (grid) */}
            <rect x="2"  y="2"  width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="9"  y="2"  width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="2"  y="9"  width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="9"  y="9"  width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </NavButton>

        <NavButton href={prevHref} ariaLabel={t.previousLesson} disabled={!prevHref}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavButton>

        <NavButton href={nextHref} ariaLabel={t.nextLesson} disabled={!nextHref}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavButton>

        <button
          onClick={scrollToTop}
          aria-label={t.topOfPage}
          className="w-11 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-[0.95] transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 9l5-5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 4v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function NavButton({
  href, ariaLabel, disabled, children,
}: {
  href: string | null;
  ariaLabel: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled || !href) {
    return (
      <span
        className="w-11 h-9 rounded-xl flex items-center justify-center text-zinc-700 cursor-not-allowed"
        aria-label={ariaLabel}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="w-11 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-[0.95] transition-all"
    >
      {children}
    </Link>
  );
}
