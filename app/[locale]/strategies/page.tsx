import Link from "next/link";
import { STRATEGY_MODULES, type StrategyModule, type StrategyLevel } from "@/lib/strategies";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary, type Dictionaries } from "@/i18n/dictionaries";

type StratDict = Dictionaries["strategies"];

/* ── Icônes ─────────────────────────────────────────────────────────────── */

function IconKnightLarge() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M11 6 C 8 8, 7 11, 8 14 L 6 16 L 6 18 L 9 18 C 9 18, 10 16, 12 16 C 14 16, 13 19, 11 21 L 10 24 L 23 24 L 23 22 C 23 18, 22 14, 20 11 C 18 8, 15 6, 13 6 L 11 6 Z"
        fill="#fbbf24"
        stroke="#d97706"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <rect x="9" y="24" width="15" height="3" rx="1" fill="#fbbf24" />
      <circle cx="13" cy="11" r="0.9" fill="#09090b" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 6c0-1.1.9-2 2-2h7v18H6c-1.1 0-2-.9-2-2V6z" stroke="#34d399" strokeWidth="1.6" strokeLinejoin="round" fill="#10b981" fillOpacity="0.1" />
      <path d="M24 6c0-1.1-.9-2-2-2h-7v18h7c1.1 0 2-.9 2-2V6z" stroke="#34d399" strokeWidth="1.6" strokeLinejoin="round" fill="#10b981" fillOpacity="0.1" />
      <line x1="7" y1="9" x2="11" y2="9" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="12.5" x2="11" y2="12.5" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="9" x2="21" y2="9" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="12.5" x2="21" y2="12.5" stroke="#10b981" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconChartUp() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M6 18l5-5 4 4 7-9" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M17 8h5v5" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="11" cy="13" r="1.6" fill="#60a5fa" />
      <circle cx="15" cy="17" r="1.6" fill="#60a5fa" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 4l5 6-5 16-5-16 5-6z" stroke="#fbbf24" strokeWidth="1.6" strokeLinejoin="round" fill="#fbbf24" fillOpacity="0.2" />
      <path d="M6 10h16" stroke="#fbbf24" strokeWidth="1.6" />
      <path d="M14 4l-5 6h10l-5-6z" fill="#fbbf24" fillOpacity="0.35" stroke="#fbbf24" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Theme par niveau ───────────────────────────────────────────────────── */

type LevelTheme = {
  Icon:       () => React.ReactElement;
  iconBg:     string;
  iconBorder: string;
  iconGlow:   string;
  badgeClass: string;
  dotClass:   string;
  textAccent: string;
  cardHover:  string;
};

const LEVEL_THEMES: Record<StrategyLevel, LevelTheme> = {
  debutant: {
    Icon:       IconBook,
    iconBg:     "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconGlow:   "shadow-[0_0_16px_rgba(16,185,129,0.15)]",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dotClass:   "bg-emerald-500",
    textAccent: "text-emerald-400",
    cardHover:  "hover:border-emerald-500/40 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.25)] hover:scale-[1.02]",
  },
  intermediaire: {
    Icon:       IconChartUp,
    iconBg:     "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    iconGlow:   "shadow-[0_0_16px_rgba(59,130,246,0.15)]",
    badgeClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    dotClass:   "bg-blue-400",
    textAccent: "text-blue-400",
    cardHover:  "hover:border-blue-500/40 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.25)] hover:scale-[1.02]",
  },
  avance: {
    Icon:       IconDiamond,
    iconBg:     "bg-amber-400/10",
    iconBorder: "border-amber-400/20",
    iconGlow:   "shadow-[0_0_16px_rgba(251,191,36,0.15)]",
    badgeClass: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    dotClass:   "bg-amber-400",
    textAccent: "text-amber-400",
    cardHover:  "hover:border-amber-400/40 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.25)] hover:scale-[1.02]",
  },
};

/* ── Module card ─────────────────────────────────────────────────────────── */

function ModuleCard({ module, locale, t }: { module: StrategyModule; locale: Locale; t: StratDict }) {
  const theme = LEVEL_THEMES[module.level];
  const lvl = t.page.levels[module.level];
  const mod = t.modules[module.id as keyof StratDict["modules"]];

  return (
    <Link
      href={localizedHref(`/strategies/${module.id}`, locale)}
      className={`group flex flex-col bg-gradient-to-b from-zinc-900/80 to-zinc-900/30 border border-zinc-800 rounded-2xl p-5 transition-all duration-200 ${theme.cardHover}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={`w-11 h-11 rounded-xl ${theme.iconBg} border ${theme.iconBorder} flex items-center justify-center ${theme.iconGlow} shrink-0`}
        >
          <theme.Icon />
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${theme.badgeClass}`}>
          {lvl.label}
        </span>
      </div>

      <h3 className="text-sm font-bold text-white leading-snug mb-2">
        {mod?.title ?? module.title}
      </h3>

      <p className="text-xs text-zinc-500 leading-relaxed flex-1 mb-4">
        {mod?.subtitle ?? module.subtitle}
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${theme.badgeClass}`}>
          {t.page.card.lessonsCount.replace("{n}", String(module.lessonCount))}
        </span>
        <span
          className={`text-xs font-semibold inline-flex items-center gap-1 ${theme.textAccent} group-hover:gap-1.5 transition-all`}
        >
          {t.page.card.viewModule}
          <IconArrow />
        </span>
      </div>
    </Link>
  );
}

/* ── Level section ───────────────────────────────────────────────────────── */

function LevelSection({ level, locale, t }: { level: StrategyLevel; locale: Locale; t: StratDict }) {
  const theme = LEVEL_THEMES[level];
  const lvl = t.page.levels[level];
  const modules = STRATEGY_MODULES
    .filter((m) => m.level === level)
    .sort((a, b) => a.order - b.order);

  const gridClass = modules.length >= 3
    ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
    : "grid sm:grid-cols-2 gap-4";

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-2 h-2 rounded-full ${theme.dotClass}`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textAccent}`}>
          {lvl.label}
        </span>
        <span className="text-[10px] text-zinc-700">·</span>
        <span className="text-[10px] text-zinc-600 font-medium">
          {t.page.card.countByLevelShort.replace("{n}", String(modules.length))}
        </span>
      </div>
      <p className="text-sm text-zinc-500 mb-5 max-w-lg">{lvl.description}</p>
      <div className={gridClass}>
        {modules.map((m) => (
          <ModuleCard key={m.id} module={m} locale={locale} t={t} />
        ))}
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

const LEVELS: StrategyLevel[] = ["debutant", "intermediaire", "avance"];

export default async function StrategiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale, "strategies");

  return (
    <main className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Halo amber radial diffus en haut */}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(251,191,36,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">

        {/* ── Hero ── */}
        <div className="text-center mb-14">

          <div className="inline-flex w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.2)] mb-6">
            <IconKnightLarge />
          </div>

          <div className="inline-flex max-w-full items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] text-zinc-500 mb-6 font-medium">
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
              style={{ boxShadow: "0 0 6px rgba(251,191,36,0.7)" }}
            />
            <span className="truncate">
              <span className="sm:hidden">{t.page.hero.badgeShort}</span>
              <span className="hidden sm:inline">{t.page.hero.badgeLong}</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
            {t.page.hero.titleLine1}
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              {t.page.hero.titleLine2}
            </span>
          </h1>

          <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed mb-8">
            {t.page.hero.subtitle}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:inline-flex sm:items-center sm:divide-x divide-zinc-800 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
            {[
              { value: "8",                    label: t.page.stats.strategies },
              { value: "8",                    label: t.page.stats.free       },
              { value: t.page.stats.premiumTBD, label: t.page.stats.premium    },
              { value: "3",                    label: t.page.stats.levels     },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`px-4 sm:px-5 py-3 text-center border-zinc-800 ${
                  i < 2 ? "border-b sm:border-b-0" : ""
                } ${i % 2 === 0 ? "border-r sm:border-r-0" : ""}`}
              >
                <p className="text-base sm:text-lg font-black text-white tabular-nums">{s.value}</p>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Progression path ── */}
        <div className="flex items-center justify-center gap-0 mb-14">
          {LEVELS.map((level, i) => {
            const theme = LEVEL_THEMES[level];
            const lvl = t.page.levels[level];
            const count = STRATEGY_MODULES.filter((m) => m.level === level).length;
            return (
              <div key={level} className="flex items-center">
                <div className="flex flex-col items-center text-center px-2 sm:px-6 py-3 rounded-xl">
                  <div className={`w-2.5 h-2.5 rounded-full mb-2 ${theme.dotClass}`} />
                  <span className="text-xs sm:text-sm font-bold text-white">{lvl.label}</span>
                  <span className={`text-[10px] font-medium mt-0.5 ${theme.textAccent}`}>{lvl.tagline}</span>
                  <span className="text-[10px] text-zinc-700 mt-0.5">
                    {t.page.card.countByLevelShort.replace("{n}", String(count))}
                  </span>
                </div>
                {i < LEVELS.length - 1 && (
                  <div className="flex items-center gap-1 text-zinc-800 mb-5">
                    <div className="w-4 sm:w-10 h-px bg-zinc-800" />
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M2 1.5l4.5 3-4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Level sections ── */}
        <div className="space-y-14">
          {LEVELS.map((level) => (
            <LevelSection key={level} level={level} locale={locale} t={t} />
          ))}
        </div>

      </div>
    </main>
  );
}
