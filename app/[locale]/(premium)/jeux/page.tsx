import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary, type Dictionaries } from "@/i18n/dictionaries";
import { GameChartV2 } from "@/app/components/games/v2/GameChartV2";
import { buildGamePreviews, type GamePreview } from "./_components/previews";

// ─── Available games ───────────────────────────────────────────────────────────

type AvailableId = keyof Dictionaries["games"]["available"];
type GamesDict   = Dictionaries["games"];

type LevelKey = "allLevels" | "intermediate" | "beginner";

interface AvailableGameMeta {
  id:         AvailableId;
  href:       string;
  levelKey:   LevelKey;
  accent:     string;   // couleur signature du jeu (charte v2), reprise de l'intérieur du jeu
}

const AVAILABLE_GAMES: AvailableGameMeta[] = [
  { id: "buy-sell-no-trade", href: "/jeux/buy-sell-no-trade", levelKey: "allLevels",    accent: "v2-accent--emerald" },
  { id: "place-stop",        href: "/jeux/place-stop",        levelKey: "intermediate", accent: "v2-accent--violet" },
  { id: "find-the-mistake",  href: "/jeux/find-the-mistake",  levelKey: "allLevels",    accent: "v2-accent--red" },
  { id: "build-the-trade",   href: "/jeux/build-the-trade",   levelKey: "intermediate", accent: "v2-accent--blue" },
];

// ─── Cards ─────────────────────────────────────────────────────────────────────

function AvailableGameCard({
  meta,
  preview,
  t,
  locale,
}: {
  meta: AvailableGameMeta;
  preview: GamePreview;
  t: GamesDict;
  locale: Locale;
}) {
  const game = t.available[meta.id];
  return (
    <Link
      href={localizedHref(meta.href, locale)}
      className={`v2-card v2-card--accent ${meta.accent} group flex flex-col gap-4 p-4 sm:p-5 motion-safe:hover:-translate-y-0.5`}
    >
      {/* Aperçu animé : vraies bougies du jeu et son élément clé */}
      <div aria-hidden="true">
        <GameChartV2 {...preview} preview />
      </div>

      {/* Niveau, durée et disponibilité */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="v2-chip">{t.index.levels[meta.levelKey]}</span>
          <span className="v2-mono flex items-center gap-1.5 text-[12px] text-[color:var(--v2-text-3)]">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5.5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {game.duration}
          </span>
        </div>
        <span className="v2-chip">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--v2-emerald)]" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.9)" }} />
          {t.index.availableBadge}
        </span>
      </div>

      {/* Titre + description */}
      <div className="flex flex-col gap-2">
        <h3 className="v2-display v2-h3 font-bold">{game.title}</h3>
        <p className="v2-body text-[color:var(--v2-text-2)]">{game.description}</p>
      </div>

      {/* Bouton Jouer maintenant, dans la couleur du jeu */}
      <span className="v2-btn v2-btn--accent mt-auto w-full">
        {t.index.playNow}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 8h11M9 3l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// Hub des jeux en charte v2 : la portée .tsx-v2 est posée ici (et non dans le
// layout /jeux, qui enveloppe aussi les jeux, déjà en .tsx-v2).
export default async function JeuxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale, "games");
  const previews = buildGamePreviews(locale);
  return (
    <div className="tsx-v2">
      <main className="v2-page mx-auto flex w-full max-w-4xl flex-col">

        {/* En-tête */}
        <div className="v2-gap-s flex flex-col">
          <p className="v2-eyebrow">{t.index.eyebrow}</p>
          <h1 className="v2-display v2-h2 font-bold">{t.index.title}</h1>
          <p className="v2-lead max-w-xl text-[color:var(--v2-text-2)]">{t.index.subtitle}</p>
        </div>

        {/* Jeux disponibles */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--v2-emerald)]" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.7)" }} />
            <h2 className="v2-eyebrow">{t.index.available}</h2>
          </div>
          <div className={`grid gap-4 sm:gap-5 ${AVAILABLE_GAMES.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {AVAILABLE_GAMES.map((g) => <AvailableGameCard key={g.id} meta={g} preview={previews[g.id]} t={t} locale={locale} />)}
          </div>
        </section>

        {/* Lien vers les leçons */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[color:var(--v2-edge)] pt-8 sm:flex-row">
          <p className="text-[14px] text-[color:var(--v2-text-3)]">{t.index.bottomTip}</p>
          <Link href={localizedHref("/formations/debutant/lecon1", locale)} className="v2-btn">
            {t.index.bottomCta}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
