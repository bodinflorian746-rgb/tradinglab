import Link from "next/link";
import { TOTAL_FREE_LESSONS } from "@/lib/progress";
import { FORMATIONS } from "@/lib/formations";
import { STRATEGY_MODULES } from "@/lib/strategies";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary } from "@/i18n/dictionaries";

// Icônes des 4 cards "audiences" — appariées par index avec home.audiencesSection.cards
const AUDIENCE_ICONS = [
  // Horloge — peu de temps
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 5.2v3.8l2.6 1.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Bouclier — protection capital
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2L3 4.2v4.6c0 3.7 2.7 6.4 6 7.2 3.3-0.8 6-3.5 6-7.2V4.2L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 9l2 2L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Éclair — réflexes
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M10.2 2L4 10.2h3.8l-1.2 5.8L13 8.2h-3.8l1.2-6.2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Boussole — discipline
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 4.5l1.6 4.5L9 13.5 7.4 9 9 4.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="currentColor" fillOpacity="0.18" />
    </svg>
  ),
];

// Icônes des 6 cards "memberContent" — appariées par index avec home.memberSection.cards
const MEMBER_ICONS = [
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 9h6M6 12h4M6 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 13L5.5 8 9 11 13 5.5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 5.5v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 9h3M6 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2L11 7h5l-4 3 1.5 5L9 12l-4.5 3L6 10 2 7h5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
];

type TradingLevelKey = "debutant" | "intermediaire" | "avance";
const TRADING_LEVELS: { key: TradingLevelKey; href: string; badgeClass: string }[] = [
  { key: "debutant",      href: "/formations/debutant/lecon1",      badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  { key: "intermediaire", href: "/formations/intermediaire/lecon1", badgeClass: "bg-blue-400/10 text-blue-400 border border-blue-400/20" },
  { key: "avance",        href: "/formations/avance/lecon1",        badgeClass: "bg-amber-400/10 text-amber-400 border border-amber-400/20" },
];

type MacroLevelKey = "debutant" | "intermediaire" | "avance";
const MACRO_LEVELS: { key: MacroLevelKey; href: string; badgeClass: string; commencerClass: string; disabled?: boolean }[] = [
  { key: "debutant",      href: "/formations/macro/debutant",      badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", commencerClass: "text-emerald-400" },
  { key: "intermediaire", href: "/formations/macro/intermediaire", badgeClass: "bg-blue-400/10 text-blue-400 border border-blue-400/20",         commencerClass: "text-blue-400" },
  { key: "avance",        href: "/formations/macro/avance",        badgeClass: "bg-amber-400/10 text-amber-400 border border-amber-400/20",     commencerClass: "text-amber-400" },
];

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0 text-emerald-400 mt-0.5">
      <path d="M2.5 7.5l3.5 3.5 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const h = (p: string) => localizedHref(p, locale);
  const t = await getDictionary(locale, "home");

  const lessonCountBy: Record<TradingLevelKey, number> = {
    debutant:      FORMATIONS.find((f) => f.id === "debutant")?.lessons.length ?? 0,
    intermediaire: FORMATIONS.find((f) => f.id === "intermediaire")?.lessons.length ?? 0,
    avance:        FORMATIONS.find((f) => f.id === "avance")?.lessons.length ?? 0,
  };

  const stats = [
    { value: String(TOTAL_FREE_LESSONS),         label: t.stats.lessons    },
    { value: String(STRATEGY_MODULES.length),    label: t.stats.strategies },
    { value: t.stats.levels,                     label: t.stats.levelsLabel },
    { value: t.stats.online,                     label: t.stats.onlineLabel },
  ];

  return (
    <main>

      {/* ── Hero ────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-40 px-6">
        {/* Ambient glow — double couche pour profondeur */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[420px] h-[300px] bg-emerald-500/[0.04] rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm text-zinc-300 mb-8 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            {t.hero.badge}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
            {t.hero.titleLine1}
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">{t.hero.titleLine2}</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={h("/formations")}
              className="group bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-8 py-4 rounded-xl transition-all text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href={h("/formations")}
              className="border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40 text-white font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────── */}
      <section className="relative border-y border-zinc-900 bg-gradient-to-b from-zinc-900/20 to-zinc-900/40 py-12 md:py-14 px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1.5 tracking-tight">{s.value}</div>
              <div className="text-xs md:text-sm text-zinc-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formations ──────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto space-y-20">

          {/* Formation Trading */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-px bg-emerald-500/60" />
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">{t.tradingSection.eyebrow}</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.tradingSection.title}</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {TRADING_LEVELS.map((lvl) => {
                const lt = t.tradingSection.levels[lvl.key];
                return (
                  <Link
                    key={lvl.key}
                    href={h(lvl.href)}
                    className="group relative bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-[15px]">{lt.label}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${lvl.badgeClass}`}>
                        {lt.count.replace("{n}", String(lessonCountBy[lvl.key]))}
                      </span>
                    </div>
                    <p className="text-[13px] text-zinc-500 leading-relaxed flex-1">{lt.description}</p>
                    <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
                      {t.tradingSection.cta}
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                        <path d="M4 9l4-3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Macro Trading */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-px bg-amber-400/60" />
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-[0.18em]">{t.macroSection.eyebrow}</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.macroSection.title}</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {MACRO_LEVELS.map((lvl) => {
                const lt = t.macroSection.levels[lvl.key];
                return (
                  <Link
                    key={lvl.key}
                    href={h(lvl.href)}
                    className="group relative bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.12)] transition-all duration-300 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-[15px]">{lt.label}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${lvl.badgeClass}`}>
                        {lt.count}
                      </span>
                    </div>
                    <p className="text-[13px] text-zinc-500 leading-relaxed flex-1">{lt.description}</p>
                    <span className={`text-xs font-semibold ${lvl.commencerClass} flex items-center gap-1`}>
                      {t.macroSection.cta}
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                        <path d="M4 9l4-3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ── Ce que tu construis ici ─────────────── */}
      <section className="relative py-20 md:py-28 px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-px bg-emerald-500/60" />
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
                {t.audiencesSection.eyebrow}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl tracking-tight leading-tight">
              {t.audiencesSection.title}
            </h2>
            <p className="text-zinc-400 max-w-xl leading-relaxed text-[15px]">
              {t.audiencesSection.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {t.audiencesSection.cards.map((a, i) => (
              <div
                key={a.title}
                className="group bg-gradient-to-b from-zinc-900/70 to-zinc-900/30 border border-zinc-800 rounded-2xl p-7 hover:border-zinc-700 hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.12)] transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                  {AUDIENCE_ICONS[i]}
                </div>
                <h3 className="font-semibold text-white mb-2 text-[15px]">{a.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce que tu trouveras ─────────────────── */}
      <section className="relative py-20 md:py-28 px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-px bg-emerald-500/60" />
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
                {t.memberSection.eyebrow}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl tracking-tight leading-tight">
              {t.memberSection.title}
            </h2>
            <p className="text-zinc-400 max-w-xl leading-relaxed text-[15px]">
              {t.memberSection.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {t.memberSection.cards.map((c, i) => (
              <div
                key={c.title}
                className="group bg-gradient-to-b from-zinc-900/70 to-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.1)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  {MEMBER_ICONS[i]}
                </div>
                <h3 className="font-semibold text-white text-[14px] mb-2">{c.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approche pédagogique ────────────────── */}
      <section className="relative py-20 md:py-28 px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-start">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-6 h-px bg-emerald-500/60" />
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.18em]">
                  {t.methodSection.eyebrow}
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight tracking-tight">
                {t.methodSection.titleLine1}
                {" "}
                {t.methodSection.titleLine2}
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8 text-[15px]">
                {t.methodSection.subtitle}
              </p>
              <Link
                href={h("/formations")}
                className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/60 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
              >
                {t.methodSection.cta}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {t.methodSection.benefits.map((b) => (
                <div key={b.title} className="flex gap-4">
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                      <path d="M2.5 7.5l3.5 3.5 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-[15px] mb-1.5">{b.title}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────── */}
      <section className="relative px-6 pb-28 md:pb-32 pt-4">
        <div className="max-w-3xl mx-auto relative">
          {/* Halo emerald derrière la carte */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[280px] bg-emerald-500/[0.06] rounded-full blur-3xl" />
          </div>
          <div className="relative border border-zinc-800 bg-gradient-to-b from-zinc-900/70 to-zinc-900/30 rounded-3xl px-8 py-14 md:py-16 text-center shadow-[0_0_60px_-20px_rgba(16,185,129,0.15)]">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
              {t.finalCta.title}
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed text-[15px]">
              {t.finalCta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={h("/formations")}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-7 py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              >
                {t.finalCta.ctaPrimary}
              </Link>
              <Link
                href={h("/pricing")}
                className="border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-sm"
              >
                {t.finalCta.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
