import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Game {
  id:          string;
  title:       string;
  description: string;
  level:       string;
  levelColor:  string;
  duration:    string;
  available:   boolean;
  href?:       string;
  icon:        React.ReactNode;
}

// ─── Game definitions ─────────────────────────────────────────────────────────

const AVAILABLE_GAMES: Game[] = [
  {
    id:          "buy-sell-no-trade",
    title:       "BUY / SELL / NO TRADE",
    description: "12 scénarios à analyser. Mini graphique, contexte, news. Tu choisis ta décision et le système évalue ta lecture, ta discipline et ta détection de pièges.",
    level:       "Tous niveaux",
    levelColor:  "text-emerald-400 border-emerald-500/30",
    duration:    "~6 min",
    available:   true,
    href:        "/jeux/buy-sell-no-trade",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 18l4-4 3 3 4-7 4 3 5-2" stroke="#52525b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="17" r="2.2" fill="rgba(16,185,129,0.25)" stroke="#10b981" strokeWidth="1.4" />
        <circle cx="18" cy="13" r="2.2" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id:          "place-stop",
    title:       "Place ton Stop",
    description: "Quel stop va survivre ? 10 setups, 3 stops loss proposés à chaque fois (A / B / C). Tu choisis le plus logique — structure, liquidité, RR. Le marché révèle la suite.",
    level:       "Intermédiaire",
    levelColor:  "text-blue-400 border-blue-500/30",
    duration:    "~7 min",
    available:   true,
    href:        "/jeux/place-stop",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 20L10 12l5 4 5-8 4 3" stroke="#52525b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="16" x2="24" y2="16" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" strokeLinecap="round" />
        <circle cx="14" cy="16" r="2.5" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="1.6" />
      </svg>
    ),
  },
];

const UPCOMING_GAMES: Game[] = [
  {
    id:          "risk",
    title:       "Risk Calculator",
    description: "Questions de calcul rapide : taille de position, ratio R/R, montant risqué. 30 secondes par question.",
    level:       "Tous niveaux",
    levelColor:  "text-emerald-400 border-emerald-500/30",
    duration:    "~2 min",
    available:   false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="5" width="18" height="18" rx="3" stroke="#52525b" strokeWidth="1.5" />
        <path d="M10 14h8M14 10v8" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id:          "zone",
    title:       "Touche ou Casse ?",
    description: "Le prix arrive sur une zone clé. Tu parles : rebond ou cassure ? Données historiques réelles, 10 rounds.",
    level:       "Intermédiaire",
    levelColor:  "text-blue-400 border-blue-500/30",
    duration:    "~3 min",
    available:   false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 18L9 12l4 3 5-6 6 4" stroke="#52525b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="13" x2="24" y2="13" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 10l2 3-2 3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id:          "rr",
    title:       "R/R Builder",
    description: "Un trade te est présenté avec une entrée et un stop. Tu places l'objectif pour atteindre le ratio R/R demandé.",
    level:       "Débutant",
    levelColor:  "text-zinc-400 border-zinc-700",
    duration:    "~2 min",
    available:   false,
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
    id:          "structure",
    title:       "Lis la Structure",
    description: "Un graphique s'affiche. Tu identifies le dernier BOS, le CHoCH, et la prochaine zone d'intérêt. 8 rounds.",
    level:       "Intermédiaire",
    levelColor:  "text-blue-400 border-blue-500/30",
    duration:    "~4 min",
    available:   false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 18l4-6 4 4 5-8 5 4" stroke="#52525b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="12" x2="20" y2="4" stroke="#3b82f6" strokeWidth="1.4" strokeDasharray="2.5 2" strokeLinecap="round" />
        <circle cx="20" cy="4" r="2" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id:          "sizing",
    title:       "Position Sizing",
    description: "Capital, risque en %, stop en pips — calcule la bonne taille de lot en moins de 20 secondes. 10 questions.",
    level:       "Débutant",
    levelColor:  "text-zinc-400 border-zinc-700",
    duration:    "~3 min",
    available:   false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="6" y="8" width="16" height="13" rx="2" stroke="#52525b" strokeWidth="1.5" />
        <path d="M10 8V6a4 4 0 018 0v2" stroke="#52525b" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="14" cy="14.5" r="2.5" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1.4" />
      </svg>
    ),
  },
];

// ─── Available game card ──────────────────────────────────────────────────────

function AvailableGameCard({ game }: { game: Game }) {
  return (
    <Link
      href={game.href!}
      className="group relative block bg-emerald-500/[0.06] border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-7 hover:border-emerald-500/70 hover:bg-emerald-500/[0.10] transition-all"
    >
      {/* Disponible badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/15 border border-emerald-500/40 rounded-full px-2.5 py-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.9)" }} />
        Disponible
      </div>

      {/* Icon + level */}
      <div className="flex items-start gap-3 mb-4 sm:mb-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
          {game.icon}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <span className={`text-[10px] font-semibold uppercase tracking-wide border rounded-full px-2 py-0.5 ${game.levelColor}`}>
            {game.level}
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
        Jouer maintenant
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 8h11M9 3l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

// ─── Upcoming game card ───────────────────────────────────────────────────────

function UpcomingGameCard({ game }: { game: Game }) {
  return (
    <div className="group relative bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4 opacity-70">
      <div className="absolute top-4 right-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest border border-zinc-700/50 rounded-full px-2.5 py-0.5">
        Bientôt
      </div>

      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center shrink-0">
          {game.icon}
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wide border rounded-full px-2.5 py-0.5 ${game.levelColor}`}>
          {game.level}
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
        <span className="text-xs text-zinc-700 font-medium">Indisponible</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JeuxPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Mini jeux
          </p>
          <h1 className="text-3xl font-bold text-white mb-3">Entraîne-toi</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            Des exercices courts pour ancrer les concepts dans la pratique.
            Chaque jeu cible une compétence précise du trader.
          </p>
        </div>

        {/* Available games */}
        <section className="mb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px rgba(16,185,129,0.7)" }} />
            <h2 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
              Disponible maintenant
            </h2>
          </div>
          <div className={`grid gap-4 ${AVAILABLE_GAMES.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {AVAILABLE_GAMES.map((g) => <AvailableGameCard key={g.id} game={g} />)}
          </div>
        </section>

        {/* Upcoming games */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-sm font-semibold text-zinc-500">Prochainement</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {UPCOMING_GAMES.map((g) => <UpcomingGameCard key={g.id} game={g} />)}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            Tu peux aussi continuer les leçons en parallèle.
          </p>
          <Link
            href="/formations/debutant/lecon1"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-2.5 transition-all duration-200"
          >
            Voir les leçons débutant
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
