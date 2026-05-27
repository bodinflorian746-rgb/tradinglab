import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary } from "@/i18n/dictionaries";

/* ── Icônes ─────────────────────────────────────────────────────────────── */

function IconGlobeLarge() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="#60a5fa" strokeWidth="1.8" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#60a5fa" strokeWidth="1.4" />
      <ellipse cx="16" cy="16" rx="5" ry="13" stroke="#60a5fa" strokeWidth="1.4" />
      <line x1="3" y1="16" x2="29" y2="16" stroke="#60a5fa" strokeWidth="1.4" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 6c0-1.1.9-2 2-2h7v18H6c-1.1 0-2-.9-2-2V6z" stroke="#34d399" strokeWidth="1.6" strokeLinejoin="round" fill="#10b981" fillOpacity="0.1" />
      <path d="M24 6c0-1.1-.9-2-2-2h-7v18h7c1.1 0 2-.9 2-2V6z" stroke="#34d399" strokeWidth="1.6" strokeLinejoin="round" fill="#10b981" fillOpacity="0.1" />
      <line x1="7" y1="9" x2="11" y2="9" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="12.5" x2="11" y2="12.5" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="16" x2="10" y2="16" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="9" x2="21" y2="9" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="12.5" x2="21" y2="12.5" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="16" x2="20" y2="16" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconChartUp() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <line x1="4" y1="23" x2="24" y2="23" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="4" y1="23" x2="4" y2="5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M6 18l5-5 4 4 7-9" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M17 8h5v5" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="11" cy="13" r="1.6" fill="#60a5fa" />
      <circle cx="15" cy="17" r="1.6" fill="#60a5fa" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 4l5 6-5 16-5-16 5-6z" stroke="#fbbf24" strokeWidth="1.6" strokeLinejoin="round" fill="#fbbf24" fillOpacity="0.2" />
      <path d="M6 10h16" stroke="#fbbf24" strokeWidth="1.6" />
      <path d="M14 4l-5 6h10l-5-6z" fill="#fbbf24" fillOpacity="0.35" stroke="#fbbf24" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="11" y1="10" x2="14" y2="26" stroke="#fbbf24" strokeWidth="1.2" opacity="0.5" />
      <line x1="17" y1="10" x2="14" y2="26" stroke="#fbbf24" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Theme par niveau ───────────────────────────────────────────────────── */

type LevelKey = "debutant" | "intermediaire" | "avance";

type LevelTheme = {
  Icon:       () => React.ReactElement;
  iconBg:     string;
  iconBorder: string;
  iconGlow:   string;
  cardHover:  string;
  textAccent: string;
  href:       string;
};

const LEVEL_THEMES: Record<LevelKey, LevelTheme> = {
  debutant: {
    Icon:       IconBook,
    iconBg:     "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconGlow:   "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    cardHover:  "hover:border-emerald-500/40 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.25)] hover:scale-[1.02]",
    textAccent: "text-emerald-400",
    href:       "/formations/macro/debutant",
  },
  intermediaire: {
    Icon:       IconChartUp,
    iconBg:     "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    iconGlow:   "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    cardHover:  "hover:border-blue-500/40 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.25)] hover:scale-[1.02]",
    textAccent: "text-blue-400",
    href:       "/formations/macro/intermediaire",
  },
  avance: {
    Icon:       IconDiamond,
    iconBg:     "bg-amber-400/10",
    iconBorder: "border-amber-400/20",
    iconGlow:   "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    cardHover:  "hover:border-amber-400/40 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.25)] hover:scale-[1.02]",
    textAccent: "text-amber-400",
    href:       "/formations/macro/avance",
  },
};

const LEVEL_ORDER: LevelKey[] = ["debutant", "intermediaire", "avance"];

/* ── Page ────────────────────────────────────────────────────────────────── */

export default async function MacroPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const h = (p: string) => localizedHref(p, locale);
  const fdict = await getDictionary(locale, "formations");
  const common = await getDictionary(locale, "common");
  const macro = fdict.macro;
  const isEs = locale === "es";

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Halo blue radial diffus en haut */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href={h("/formations")} className="hover:text-zinc-400 transition-colors">
            {common.lessons.breadcrumbFormations}
          </Link>
          <span>/</span>
          <span className="text-zinc-400">{macro.breadcrumb}</span>
        </nav>

        {/* ── HERO ── */}
        <section className="text-center mb-14 md:mb-16">
          <div className="inline-flex w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] mb-6">
            <IconGlobeLarge />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{macro.title}</h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {macro.subtitle}
          </p>
        </section>

        {/* ── CARDS GRID ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEVEL_ORDER.map((levelKey) => {
            const theme = LEVEL_THEMES[levelKey];
            const lvl = macro.levels[levelKey];
            const lessonsLabel = isEs ? lvl.count.replace("leçons", "lecciones") : lvl.count;

            return (
              <Link
                key={levelKey}
                href={h(theme.href)}
                className={`group flex flex-col bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 rounded-2xl p-6 transition-all duration-200 ${theme.cardHover}`}
              >
                <div className="flex justify-center mb-5">
                  <div
                    className={`w-16 h-16 rounded-2xl ${theme.iconBg} border ${theme.iconBorder} flex items-center justify-center ${theme.iconGlow}`}
                  >
                    <theme.Icon />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-center text-white mb-2">{lvl.label}</h3>
                <p className="text-[13px] text-zinc-400 text-center leading-relaxed mb-5 flex-1">
                  {lvl.description}
                </p>

                {/* Compteur de leçons */}
                <div className="flex items-center justify-center mb-5">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.iconBg} ${theme.textAccent} border ${theme.iconBorder}`}
                  >
                    {lessonsLabel}
                  </span>
                </div>

                {/* CTA */}
                <span
                  className={`inline-flex items-center justify-center gap-1.5 text-sm font-semibold ${theme.textAccent} group-hover:gap-2 transition-all`}
                >
                  {macro.cta}
                  <IconArrow />
                </span>
              </Link>
            );
          })}
        </section>

      </div>
    </main>
  );
}
