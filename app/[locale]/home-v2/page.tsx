// /[locale]/home-v2 — nouvelle home en charte v2, à comparer avec la home
// actuelle (app/[locale]/page.tsx, inchangée). Hors navigation et noindex.
// Contenu réel uniquement : textes des dictionnaires home / games et textes en
// ligne de la home actuelle (./_components/strings.ts) ; avis et note tels quels.
// FR et ES (l'anglais n'est pas traité : 404).

import type { Metadata } from "next";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary, type Dictionaries } from "@/i18n/dictionaries";
import { FORMATIONS } from "@/lib/formations";
import { REVIEWS, type Review } from "@/lib/reviews";
import Logo from "@/app/components/Logo";
import { GameChartV2 } from "@/app/components/games/v2/GameChartV2";
import { buildGamePreviews, type PreviewId } from "@/app/[locale]/(premium)/jeux/_components/previews";
import { requestTrialCode } from "@/app/[locale]/pricing/actions";
import { RevealOnView } from "./_components/RevealOnView";
import { homeStrings, type HomeLocale } from "./_components/strings";
import "./home-v2.css";

export const metadata: Metadata = {
  title: "TradeScaleX — Home v2",
  robots: { index: false, follow: false },
};

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

// Couleur signature de chaque jeu (identique au hub /jeux)
const GAMES: { id: PreviewId; accent: string; level: "allLevels" | "intermediate" }[] = [
  { id: "buy-sell-no-trade", accent: "v2-accent--emerald", level: "allLevels" },
  { id: "place-stop",        accent: "v2-accent--violet",  level: "intermediate" },
  { id: "find-the-mistake",  accent: "v2-accent--red",     level: "allLevels" },
  { id: "build-the-trade",   accent: "v2-accent--blue",    level: "intermediate" },
];

// Couleur de chaque pilier (charte v2)
const PILLAR_ACCENT: Record<string, string> = {
  trading: "#10b981",
  macro: "#3b82f6",
  strategies: "#f59e0b",
  games: "#8b5cf6",
};
const PILLAR_HREF: Record<string, string> = {
  trading: "/formations",
  macro: "/formations/macro",
  strategies: "/strategies",
  games: "/jeux",
};

const Arrow = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Lock = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M4 6V4.5a3 3 0 1 1 6 0V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <rect x="2.5" y="6" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const Clock = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
    <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5.5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** « [[mot]] » surligné, comme dans le carrousel de la home actuelle */
function highlight(text: string): ReactNode {
  return text.split(/(\[\[[^\]]+\]\])/g).map((part, i) =>
    part.startsWith("[[") && part.endsWith("]]") ? <mark key={i}>{part.slice(2, -2)}</mark> : <Fragment key={i}>{part}</Fragment>,
  );
}

/** En-tête de section : sur-titre, titre, sous-titre */
function SectionHead({ eyebrow, title, sub, center }: { eyebrow?: string; title: ReactNode; sub?: string; center?: boolean }) {
  return (
    <div data-reveal className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      {eyebrow && <p className="v2-eyebrow">{eyebrow}</p>}
      <h2 className="hv2-h2 max-w-3xl">{title}</h2>
      {sub && <p className="v2-lead max-w-2xl text-[color:var(--v2-text-2)]">{sub}</p>}
    </div>
  );
}

function ReviewCard({ review, locale, s }: { review: Review; locale: HomeLocale; s: ReturnType<typeof homeStrings> }) {
  return (
    <article className="hv2-review v2-card flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15px] tracking-[2px] text-[color:var(--v2-emerald)]" aria-label={`${review.rating}/5`}>
            {"★".repeat(review.rating)}
            <span className="text-[color:var(--v2-edge-strong)]">{"★".repeat(5 - review.rating)}</span>
          </span>
          <span className={`v2-chip ${review.verified ? "v2-chip--emerald" : "v2-chip--blue"}`}>
            {review.verified ? s.reviews.verified : s.reviews.earlyUser}
          </span>
        </div>
        <p className="flex-1 text-[15px] leading-relaxed text-[color:var(--v2-text)]">&ldquo;{highlight(review.text[locale])}&rdquo;</p>
        <div className="flex items-center gap-3 border-t border-[color:var(--v2-edge)] pt-4">
          <span aria-hidden="true" className="v2-display grid h-9 w-9 place-items-center rounded-full bg-[color:var(--v2-surface-2)] text-[14px] font-bold text-[color:var(--v2-emerald)] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.35)]">
            {review.initial}
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold">{review.name}</p>
            <p className="text-[12px] text-[color:var(--v2-text-3)]">{review.role[locale]}</p>
          </div>
        </div>
      </div>
      {review.founderReply && (
        <div className="flex gap-3 rounded-b-[24px] border-t border-[color:rgba(16,185,129,0.18)] bg-[color:rgba(16,185,129,0.06)] px-5 py-4">
          <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[color:var(--v2-bull)] text-[12px] font-extrabold text-[color:var(--v2-bg)]">F</span>
          <div>
            <p className="text-[12px] font-bold text-[color:var(--v2-emerald)]">{s.reviews.founder}</p>
            <p className="text-[13px] leading-relaxed text-[color:var(--v2-text-2)]">{review.founderReply[locale]}</p>
          </div>
        </div>
      )}
    </article>
  );
}

export default async function HomeV2({ params }: { params: Promise<{ locale: string }> }) {
  const raw = (await params).locale;
  if (!hasLocale(raw) || raw === "en") notFound();
  const locale = raw as HomeLocale;
  const h = (p: string) => localizedHref(p, locale as Locale);
  const t = await getDictionary(locale, "home");
  const g: Dictionaries["games"] = await getDictionary(locale, "games");
  const s = homeStrings(locale);
  const previews = buildGamePreviews(locale);

  const count = (id: string) => FORMATIONS.find((f) => f.id === id)?.lessons.length ?? 0;
  const levels = [
    { ...s.progression.levels[0], n: count("debutant"), href: "/formations", color: "#34d399" },
    { ...s.progression.levels[1], n: count("intermediaire"), href: "/formations/intermediaire", color: "#60a5fa" },
    { ...s.progression.levels[2], n: count("avance"), href: "/formations/avance", color: "#fbbf24" },
  ];

  return (
    <div className="tsx-v2">
      <RevealOnView />
      <noscript>
        <style>{".tsx-v2 [data-reveal]{opacity:1!important;transform:none!important}"}</style>
      </noscript>

      {/* ═══ 1. HÉROS : promesse + le produit (un vrai jeu, vraies bougies) ═══ */}
      <section className="hv2-wrap hv2-hero">
        <div className="hv2-hero-in flex flex-col items-start gap-5">
          <span className="v2-chip v2-chip--emerald" style={css({ "--i": 0 })}>{t.hero.badge}</span>
          <h1 className="hv2-h1" style={css({ "--i": 1 })}>
            {t.hero.titleLine1} <span className="hv2-accent block">{t.hero.titleLine2}</span>
          </h1>
          <p className="v2-lead max-w-xl text-[color:var(--v2-text-2)]" style={css({ "--i": 2 })}>{t.hero.subtitle}</p>
          {/* Un seul bouton plein ; « J'ai déjà un code » en lien discret à côté */}
          <div className="flex w-full flex-wrap items-center gap-x-5 gap-y-3" style={css({ "--i": 3 })}>
            <Link href={h("/pricing")} className="hv2-btn-main">
              {t.hero.ctaPrimary}
              <Arrow />
            </Link>
            <Link href={h("/activer-code")} className="hv2-link">
              <Lock />
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="hv2-stage">
          {/* Seconde carte, inclinée derrière (desktop) : Place ton Stop, ses 3 stops dépassent */}
          <div aria-hidden="true" className="hv2-stage-back hidden lg:block">
            <div className="v2-card v2-card--accent v2-accent--violet flex h-full flex-col justify-end p-4">
              <GameChartV2 {...previews["place-stop"]} preview />
            </div>
          </div>
          {/* Carte au premier plan : BUY / SELL / NO TRADE, comme dans le jeu */}
          <Link href={h("/jeux")} className="hv2-stage-front v2-card v2-card--accent v2-accent--emerald flex flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[14px] font-semibold">
                <span className="v2-step">1</span>
                {s.question}
              </span>
              <span className="v2-mono flex items-center gap-1.5 text-[12px] text-[color:var(--v2-text-3)]">
                <Clock />
                {g.available["buy-sell-no-trade"].duration}
              </span>
            </div>
            <div aria-hidden="true">
              <GameChartV2 {...previews["buy-sell-no-trade"]} preview />
            </div>
            <div className="hv2-choices" aria-hidden="true">
              <span className="v2-choice v2-choice--buy">BUY</span>
              <span className="v2-choice v2-choice--sell">SELL</span>
              <span className="v2-choice v2-choice--none">NO TRADE</span>
            </div>
            <span className="sr-only">{g.available["buy-sell-no-trade"].title}</span>
          </Link>
        </div>
      </section>

      {/* Chiffres clés (ceux de la home actuelle) */}
      <section className="hv2-wrap pb-4">
        <div className="hv2-stats">
          {s.stats.map((st, i) => (
            <div key={st.value} data-reveal className="hv2-stat" style={css({ "--d": `${i * 70}ms` })}>
              <p className="hv2-stat-value" style={{ color: ["#34d399", "#60a5fa", "#fbbf24", "#a78bfa"][i] }}>{st.value}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-[color:var(--v2-text-2)]">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 2. LES 4 JEUX : couleur signature, aperçus animés ═══ */}
      <section className="hv2-section hv2-glow" style={css({ "--hv2-glow": "radial-gradient(60% 50% at 80% 30%, rgba(139,92,246,0.10), transparent 70%), radial-gradient(50% 45% at 10% 70%, rgba(59,130,246,0.08), transparent 70%)" })}>
        <div className="hv2-wrap flex flex-col gap-8">
          <SectionHead eyebrow={g.index.eyebrow} title={g.index.title} sub={g.index.subtitle} />
          <div className="hv2-rail hv2-rail--games">
            {GAMES.map((gm, i) => {
              const game = g.available[gm.id];
              return (
                <Link
                  key={gm.id}
                  href={h("/jeux")}
                  data-reveal
                  style={css({ "--d": `${i * 90}ms` })}
                  className={`v2-card v2-card--accent ${gm.accent} flex flex-col gap-4 p-4`}
                >
                  <div aria-hidden="true">
                    <GameChartV2 {...previews[gm.id]} preview />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="v2-chip">{g.index.levels[gm.level]}</span>
                      <span className="v2-mono flex items-center gap-1.5 text-[12px] text-[color:var(--v2-text-3)]">
                        <Clock />
                        {game.duration}
                      </span>
                    </div>
                    <h3 className="v2-display text-[20px] font-bold leading-tight">{game.title}</h3>
                  </div>
                  <span className="v2-btn v2-btn--accent mt-auto w-full">
                    {g.index.playNow}
                    <Arrow />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 3. LES 4 PILIERS + PARCOURS PROGRESSIF ═══ */}
      <section className="hv2-section">
        <div className="hv2-wrap flex flex-col gap-8">
          <SectionHead title={t.piliers.title} sub={t.piliers.subtitle} />
          <div className="hv2-bento">
            {t.piliers.items.map((p, i) => {
              const accent = PILLAR_ACCENT[p.key] ?? "#10b981";
              const metric = p.bullets[p.bullets.length - 1];
              const isTrading = p.key === "trading";
              const intro = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="v2-display text-[22px] font-bold" style={{ color: accent }}>{p.title}</h3>
                    <span className="v2-mono rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ color: accent, background: `${accent}1f`, boxShadow: `inset 0 0 0 1px ${accent}59` }}>
                      {metric}
                    </span>
                  </div>
                  <p className="v2-body text-[color:var(--v2-text)]">{s.pillarDesc[p.key] ?? p.description}</p>
                  <ul className="hv2-list">
                    {p.bullets.slice(0, -1).map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </>
              );
              return (
                <div
                  key={p.key}
                  data-reveal
                  className={`v2-card p-5 sm:p-6 ${isTrading ? "hv2-pillar-main" : "flex flex-col gap-4"}`}
                  style={css({ "--d": `${i * 80}ms`, "--accent": accent, boxShadow: `inset 0 0 0 1px ${accent}33, inset 0 1px 0 rgba(255,255,255,0.07), 0 30px 80px -36px ${accent}88, 0 12px 32px -16px rgba(0,0,0,0.9)` })}
                >
                  {isTrading ? <div className="flex flex-col gap-4">{intro}</div> : intro}

                  {isTrading ? (
                    <div className="hv2-pillar-path flex flex-col gap-3">
                      <p className="text-[13px] font-semibold text-[color:var(--v2-text-2)]">{s.progression.title}</p>
                      <div className="hv2-steps">
                        {levels.map((lv, k) => (
                          <Link key={lv.href} href={h(lv.href)} className="hv2-step" style={css({ "--step": lv.color })}>
                            <span className="hv2-step-n">{k + 1}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[14px] font-semibold" style={{ color: lv.color }}>{lv.label}</span>
                              <span className="block text-[13px] text-[color:var(--v2-text-2)]">{lv.desc}</span>
                            </span>
                            <span className="v2-mono shrink-0 text-[12px] text-[color:var(--v2-text-3)]">{lv.n} {s.progression.lessons}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link href={h(PILLAR_HREF[p.key] ?? "/")} className="mt-auto inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: accent }}>
                      {s.discover}
                      <Arrow size={12} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 4. L'APPROCHE : les objections, sans promesse ═══ */}
      <section className="hv2-section hv2-glow" style={css({ "--hv2-glow": "radial-gradient(55% 45% at 50% 40%, rgba(16,185,129,0.09), transparent 70%)" })}>
        <div className="hv2-wrap flex flex-col gap-8">
          <SectionHead eyebrow={t.approche.eyebrow} title={<>{t.approche.titleLine1} <span className="hv2-accent">{t.approche.titleLine2}</span></>} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {t.approche.features.map((f, i) => (
              <div key={f.title} data-reveal className="v2-well flex flex-col gap-1.5 p-4 sm:p-5" style={css({ "--d": `${(i % 3) * 70}ms` })}>
                <p className="v2-display text-[18px] font-bold leading-snug">{f.title}</p>
                <p className="text-[14.5px] leading-relaxed text-[color:var(--v2-text-2)]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. TÉMOIGNAGES (tels quels) ═══ */}
      <section className="hv2-section">
        <div className="hv2-wrap flex flex-col gap-8">
          <div data-reveal className="flex flex-col items-start gap-4">
            <p className="v2-eyebrow">{t.testimonialsSection.eyebrow}</p>
            <h2 className="hv2-h2">{t.testimonialsSection.title}</h2>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-[color:rgba(255,255,255,0.05)] px-4 py-2 text-[13px] text-[color:var(--v2-text-2)] shadow-[inset_0_0_0_1px_var(--v2-edge-strong)]">
              <span className="tracking-[2px] text-[color:var(--v2-emerald)]" aria-hidden="true">★★★★★</span>
              <span>
                <strong className="v2-mono text-[color:var(--v2-text)]">{t.testimonialsSection.trustRating}</strong>
                {" · "}
                {t.testimonialsSection.trustText}
              </span>
            </div>
          </div>
          <div className="hv2-rail hv2-rail--reviews">
            {REVIEWS.map((r) => <ReviewCard key={r.id} review={r} locale={locale} s={s} />)}
          </div>
          <div data-reveal className="v2-well flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[15px] font-semibold">{t.leaveReview.title}</p>
              <p className="text-[14px] text-[color:var(--v2-text-2)]">{t.leaveReview.subtitle}</p>
            </div>
            <Link href={h("/reviews/new")} className="v2-btn shrink-0">
              {t.leaveReview.ctaLabel}
              <Arrow size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 6. COMMENT ACCÉDER ═══ */}
      <section className="hv2-section hv2-glow" style={css({ "--hv2-glow": "radial-gradient(60% 50% at 50% 55%, rgba(16,185,129,0.12), transparent 70%)" })}>
        <div className="hv2-wrap flex flex-col gap-8">
          <SectionHead title={s.access.title} sub={s.access.subtitle} center />

          <div data-reveal className="v2-card v2-card--accent v2-accent--emerald mx-auto flex w-full max-w-4xl flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="v2-display text-[22px] font-bold">{s.access.trial.title}</p>
              <p className="text-[14.5px] text-[color:var(--v2-text-2)]">{s.access.trial.desc}</p>
            </div>
            <form action={requestTrialCode} className="w-full shrink-0 sm:w-auto">
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="hv2-btn-main w-full sm:w-auto">
                {s.access.trial.cta}
                <Arrow />
              </button>
            </form>
          </div>

          <div className="mx-auto grid w-full max-w-4xl gap-4 md:grid-cols-2">
            {/* Via broker partenaire (recommandé) */}
            <div data-reveal className="v2-card v2-card--accent v2-accent--emerald relative flex flex-col gap-4 p-6">
              <span className="v2-chip v2-chip--emerald absolute -top-3 left-6 bg-[color:var(--v2-surface)]">{s.access.broker.badge}</span>
              <p className="v2-display text-[20px] font-bold">{s.access.broker.title}</p>
              <p className="v2-mono text-[44px] font-bold leading-none text-[color:var(--v2-emerald)]">{s.access.broker.price}</p>
              <p className="text-[14.5px] leading-relaxed text-[color:var(--v2-text-2)]">{s.access.broker.desc}</p>
              <ul className="hv2-list" style={css({ "--accent": "#34d399" })}>
                {s.access.broker.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <p className="rounded-xl bg-[color:rgba(16,185,129,0.07)] px-3 py-2 text-[13px] leading-snug text-[color:var(--v2-text-2)] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]">
                {s.access.broker.depositNote}
              </p>
              <Link href={h("/pricing")} className="v2-btn v2-btn--accent mt-auto w-full">
                {s.access.cta}
                <Arrow size={12} />
              </Link>
            </div>
            {/* Accès direct */}
            <div data-reveal className="v2-card flex flex-col gap-4 p-6" style={css({ "--d": "90ms" })}>
              <p className="v2-display text-[20px] font-bold">{s.access.direct.title}</p>
              <p className="flex items-baseline gap-1">
                <span className="v2-mono text-[44px] font-bold leading-none">{s.access.direct.price}</span>
                <span className="text-[14px] text-[color:var(--v2-text-3)]">{s.access.direct.period}</span>
              </p>
              <p className="text-[14.5px] leading-relaxed text-[color:var(--v2-text-2)]">{s.access.direct.desc}</p>
              <ul className="hv2-list" style={css({ "--accent": "#a1a1aa" })}>
                {s.access.direct.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <Link href={h("/pricing")} className="v2-btn mt-auto w-full">
                {s.access.cta}
                <Arrow size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. LE MOMENT DE DÉCIDER ═══ */}
      <section className="hv2-section">
        <div className="hv2-wrap">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <div data-reveal className="flex flex-col items-center gap-3">
            <p className="v2-eyebrow">{t.transformation.label}</p>
            <h2 className="hv2-h2">
              {t.transformation.titlePrefix} <span className="hv2-accent">{t.transformation.titleAccent}</span>
            </h2>
          </div>
          <div className="grid w-full gap-3 text-left md:grid-cols-2">
            <div data-reveal className="v2-well flex flex-col gap-2 p-5">
              <p className="v2-mono text-[12px] font-bold tracking-[0.1em] text-[color:var(--v2-text-3)]">{t.transformation.choiceA.label}</p>
              <p className="text-[14.5px] leading-relaxed text-[color:var(--v2-text-3)]">{t.transformation.choiceA.body}</p>
            </div>
            <div data-reveal className="hv2-option-b flex flex-col gap-2 rounded-[18px] p-5" style={css({ "--d": "90ms" })}>
              <p className="v2-mono text-[12px] font-bold tracking-[0.1em] text-[color:var(--v2-emerald)]">{t.transformation.choiceB.label}</p>
              <p className="text-[14.5px] leading-relaxed text-[color:var(--v2-text)]">{t.transformation.choiceB.body}</p>
            </div>
          </div>
          <div data-reveal className="flex flex-wrap justify-center gap-2.5">
            <Link href={h("/pricing")} className="hv2-btn-main">
              {t.transformation.ctaPrimary}
              <Arrow />
            </Link>
            <Link href={h("/activer-code")} className="v2-btn hv2-btn-ghost">
              <Lock />
              {t.transformation.ctaSecondary}
            </Link>
          </div>
        </div>
        </div>
      </section>

      {/* ═══ 8. FOOTER (mêmes liens que la home actuelle) ═══ */}
      <footer className="border-t border-[color:var(--v2-edge)] bg-[color:rgba(4,6,10,0.7)] pt-14 pb-8">
        <div className="hv2-wrap">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            <div className="col-span-2 lg:col-span-1">
              <Link href={h("/")} aria-label="TradeScaleX" className="mb-4 inline-block">
                <Logo size="md" />
              </Link>
              <p className="text-[14px] leading-relaxed text-[color:var(--v2-text-2)]">
                {s.footer.taglineL1}
                <br />
                {s.footer.taglineL2}
              </p>
              <div className="mt-5 flex gap-3">
                <a href="#" aria-label="X" className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--v2-text-2)] shadow-[inset_0_0_0_1px_var(--v2-edge-strong)] hover:text-white">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M10.6 1.5h2.1L8.1 6.8l5.4 7.2H9.3L6 9.5l-3.8 4.5H0l4.9-5.7L0 1.5h4.4L7.4 5.6l3.2-4.1zm-0.7 11h1.2L4.2 2.6H2.9l7 9.9z" /></svg>
                </a>
                <a href="#" aria-label="YouTube" className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--v2-text-2)] shadow-[inset_0_0_0_1px_var(--v2-edge-strong)] hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M15.7 4.2c-.2-.7-.7-1.2-1.4-1.4C13 2.5 8 2.5 8 2.5s-5 0-6.3.3c-.7.2-1.2.7-1.4 1.4C0 5.5 0 8 0 8s0 2.5.3 3.8c.2.7.7 1.2 1.4 1.4 1.3.3 6.3.3 6.3.3s5 0 6.3-.3c.7-.2 1.2-.7 1.4-1.4.3-1.3.3-3.8.3-3.8s0-2.5-.3-3.8zM6.4 10.5V5.5l4.2 2.5-4.2 2.5z" /></svg>
                </a>
                <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--v2-text-2)] shadow-[inset_0_0_0_1px_var(--v2-edge-strong)] hover:text-white">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.3" /><circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.3" /><circle cx="10.5" cy="3.5" r="0.8" fill="currentColor" /></svg>
                </a>
              </div>
            </div>
            {[
              { title: s.footer.platform, links: [["/formations", s.footer.trading], ["/formations/macro", s.footer.macro], ["/jeux", s.footer.games], ["/strategies", s.footer.strategies]] },
              { title: s.footer.account, links: [["/profil-trader", s.footer.profile], ["/dashboard", s.footer.progress], ["/login", s.footer.settings]] },
              { title: s.footer.resources, links: [["/pricing", s.footer.pricing], ["/", s.footer.about], ["/contact", s.footer.contact]] },
            ].map((col) => (
              <div key={col.title}>
                <p className="v2-eyebrow mb-4">{col.title}</p>
                <ul className="flex flex-col gap-3 text-[14px] text-[color:var(--v2-text-2)]">
                  {col.links.map(([href, label]) => (
                    <li key={label}><Link href={h(href)} className="hover:text-white">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[color:var(--v2-edge)] pt-6 text-[12px] text-[color:var(--v2-text-3)] md:flex-row">
            <p>{s.footer.copyright}</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href={h("/mentions-legales")} className="hover:text-white">{s.footer.legalNotice}</Link>
              <Link href={h("/cgu")} className="hover:text-white">{s.footer.terms}</Link>
              <Link href={h("/cgv")} className="hover:text-white">{s.footer.cgv}</Link>
              <Link href={h("/confidentialite")} className="hover:text-white">{s.footer.privacy}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
