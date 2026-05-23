import Link from "next/link";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { localizedHref } from "@/lib/i18n/href";
import { getDictionary, type Dictionaries } from "@/i18n/dictionaries";

// ─── Available games ───────────────────────────────────────────────────────────

type AvailableId = keyof Dictionaries["games"]["available"];
type UpcomingId  = keyof Dictionaries["games"]["upcoming"];
type GamesDict   = Dictionaries["games"];

type LevelKey = "allLevels" | "intermediate" | "beginner";

interface AvailableGameMeta {
  id:         AvailableId;
  href:       string;
  levelKey:   LevelKey;
  levelColor: string;
  icon:       React.ReactNode;
}

interface UpcomingGameMeta {
  id:         UpcomingId;
  levelKey:   LevelKey;
  levelColor: string;
  icon:       React.ReactNode;
}

const AVAILABLE_GAMES: AvailableGameMeta[] = [
  {
    id:         "buy-sell-no-trade",
    href:       "/jeux/buy-sell-no-trade",
    levelKey:   "allLevels",
    levelColor: "text-emerald-400 border-emerald-500/30",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 18l4-4 3 3 4-7 4 3 5-2" stroke="#52525b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="17" r="2.2" fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth="1.4" />
        <circle cx="18" cy="13" r="2.2" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id:         "place-stop",
    href:       "/jeux/place-stop",
    levelKey:   "intermediate",
    levelColor: "text-blue-400 border-blue-500/30",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 20L10 12l5 4 5-8 4 3" stroke="#52525b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="16" x2="24" y2="16" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" strokeLinecap="round" />
        <circle cx="14" cy="16" r="2.5" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id:         "find-the-mistake",
    href:       "/jeux/find-the-mistake",
    levelKey:   "allLevels",
    levelColor: "text-emerald-400 border-emerald-500/30",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="11" cy="11" r="6" stroke="#52525b" strokeWidth="1.6" />
        <path d="M15.5 15.5L22 22" stroke="#52525b" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 11l2 2 3-4" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id:         "build-the-trade",
    href:       "/jeux/build-the-trade",
    levelKey:   "intermediate",
    levelColor: "text-blue-400 border-blue-500/30",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <line x1="4" y1="14" x2="24" y2="14" stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="4" y1="8" x2="24" y2="8" stroke="#10b981" strokeWidth="1.6" strokeDasharray="3 2" strokeLinecap="round" />
        <line x1="4" y1="20" x2="24" y2="20" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2" strokeLinecap="round" />
        <circle cx="14" cy="14" r="2" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" strokeWidth="1.4" />
      </svg>
    ),
  },
];

const UPCOMING_GAMES: UpcomingGameMeta[] = [
  {
    id:         "risk",
    levelKey:   "allLevels",
    levelColor: "text-emerald-400 border-emerald-500/30",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="3" stroke="#52525b" strokeWidth="1.5" />
        <path d="M10 14h8M14 10v8" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id:         "zone",
    levelKey:   "intermediate",
    levelColor: "text-blue-400 border-blue-500/30",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 18L9 12l4 3 5-6 6 4" stroke="#52525b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="13" x2="24" y2="13" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 10l2 3-2 3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id:         "rr",
    levelKey:   "beginner",
    levelColor: "text-zinc-400 border-zinc-700",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <line x1="4" y1="20" x2="24" y2="20" stroke="#3f3f46" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="4" y1="8" x2="24" y2="8" stroke="#10b981" strokeWidth="1.4" strokeDasharray="3 2" strokeLinecap="round" />
        <line x1="14" y1="20" x2="14" y2="8" stroke="#52525b" strokeWidth="1.2" strokeDasharray="2 2" strokeLinecap="round" />
        <circle cx="14" cy="14" r="2" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id:         "structure",
    levelKey:   "intermediate",
    levelColor: "text-blue-400 border-blue-500/30",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 18l4-6 4 4 5-8 5 4" stroke="#52525b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="12" x2="20" y2="4" stroke="#3b82f6" strokeWidth="1.4" strokeDasharray="2.5 2" strokeLinecap="round" />
        <circle cx="20" cy="4" r="2" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id:         "sizing",
    levelKey:   "beginner",
    levelColor: "text-zinc-400 border-zinc-700",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="6" y="8" width="16" height="13" rx="2" stroke="#52525b" strokeWidth="1.5" />
        <path d="M10 8V6a4 4 0 018 0v2" stroke="#52525b" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="14" cy="14.5" r="2.5" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.4" />
      </svg>
    ),
  },
];

// ─── Cards ─────────────────────────────────────────────────────────────────────

function AvailableGameCard({
  meta,
  t,
  locale,
}: {
  meta: AvailableGameMeta;
  t: GamesDict;
  locale: Locale;
}) {
  const game = t.available[meta.id];
  return (
    <Link
      href={localizedHref(meta.href, locale)}
      className="group relative block bg-emerald-500/[0.06] border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-7 hover:border-emerald-500/70 hover:bg-emerald-500/[0.10] transition-all"
    >
      {/* Disponible badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/15 border border-emerald-500/40 rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.9)" }} />
        {t.index.availableBadge}
      </div>

      {/* Icon + level */}
      <div className="flex items-start gap-3 mb-4 sm:mb-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
          {meta.icon}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <span className={`text-[10px] font-semibold uppercase tracking-wide border rounded-full px-2 py-0.5 ${meta.levelColor}`}>
            {t.index.levels[meta.levelKey]}
          </span>
          <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5.5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {game.duration}
          </p>
        </div>
      </div>

      {/* Title + desc */}
      <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 leading-tight tracking-tight">{game.title}</h3>
      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">{game.description}</p>

      {/* Bouton CTA Jouer maintenant — clairement visible */}
      <div className="flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 font-bold text-base sm:text-lg px-5 py-3.5 sm:py-4 rounded-xl group-hover:bg-emerald-400 group-active:scale-[0.98] transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]">
        {t.index.playNow}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 8h11M9 3l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

function UpcomingGameCard({ meta, t }: { meta: UpcomingGameMeta; t: GamesDict }) {
  const game = t.upcoming[meta.id];
  return (
    <div className="group relative bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4 opacity-70">
      <div className="absolute top-4 right-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest border border-zinc-700/50 rounded-full px-2.5 py-0.5">
        {t.index.upcomingBadge}
      </div>

      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center shrink-0">
          {meta.icon}
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wide border rounded-full px-2.5 py-0.5 ${meta.levelColor}`}>
          {t.index.levels[meta.levelKey]}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-bold text-zinc-400 mb-1.5">{game.title}</h3>
        <p className="text-zinc-600 text-sm leading-relaxed">{game.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-700">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5.5 3v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {game.duration}
        </div>
        <span className="text-xs text-zinc-700 font-medium">{t.index.unavailable}</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function JeuxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const t = await getDictionary(locale, "games");
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            {t.index.eyebrow}
          </p>
          <h1 className="text-3xl font-bold text-white mb-3">{t.index.title}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            {t.index.subtitle}
          </p>
        </div>

        {/* Available games */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.7)" }} />
            <h2 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
              {t.index.available}
            </h2>
          </div>
          <div className={`grid gap-4 ${AVAILABLE_GAMES.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {AVAILABLE_GAMES.map((g) => <AvailableGameCard key={g.id} meta={g} t={t} locale={locale} />)}
          </div>
        </section>

        {/* Upcoming games */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-sm font-semibold text-zinc-500">{t.index.upcoming}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {UPCOMING_GAMES.map((g) => <UpcomingGameCard key={g.id} meta={g} t={t} />)}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            {t.index.bottomTip}
          </p>
          <Link
            href={localizedHref("/formations/debutant/lecon1", locale)}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-2.5 transition-all duration-200"
          >
            {t.index.bottomCta}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
