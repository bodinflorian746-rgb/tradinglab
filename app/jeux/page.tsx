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
  icon:        React.ReactNode;
}

// ─── Game definitions ─────────────────────────────────────────────────────────

const GAMES: Game[] = [
  {
    id:          "stop",
    title:       "Place ton Stop",
    description: "Un graphique figé avec une entrée marquée. Tu places ton stop loss — le système évalue si c'est trop serré, correct ou trop large.",
    level:       "Intermédiaire",
    levelColor:  "text-blue-400 border-blue-500/30",
    duration:    "~3 min",
    available:   false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 20L10 12l5 4 5-8 4 3" stroke="#52525b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" y1="16" x2="24" y2="16" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2.5" strokeLinecap="round" />
        <circle cx="14" cy="16" r="2.5" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
    ),
  },
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

// ─── Game card ─────────────────────────────────────────────────────────────────

function GameCard({ game }: { game: Game }) {
  return (
    <div className="group relative bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4 opacity-70">
      {/* Coming soon badge */}
      <div className="absolute top-4 right-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest border border-zinc-700/50 rounded-full px-2.5 py-0.5">
        Bientôt
      </div>

      {/* Icon + level */}
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center shrink-0">
          {game.icon}
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wide border rounded-full px-2.5 py-0.5 ${game.levelColor}`}>
          {game.level}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-base font-bold text-zinc-400 mb-1.5">{game.title}</h3>
        <p className="text-zinc-600 text-sm leading-relaxed">{game.description}</p>
      </div>

      {/* Footer */}
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
      <div className="max-w-4xl mx-auto px-6 py-14">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">
            Mini jeux
          </p>
          <h1 className="text-3xl font-bold text-white mb-3">Entraîne-toi</h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
            Des exercices courts pour ancrer les concepts dans la pratique.
            Chaque jeu cible une compétence précise du trader.
          </p>
        </div>

        {/* Coming soon banner */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-5 mb-10 flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-zinc-400">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9 5.5v4l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white mb-0.5">Les mini-jeux arrivent bientôt</p>
            <p className="text-xs text-zinc-500">
              En cours de développement — des exercices interactifs pour pratiquer le placement de stops, la gestion du risque et la lecture de structure.
            </p>
          </div>
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-xl font-black text-zinc-700 tabular-nums">{GAMES.length}</p>
            <p className="text-[10px] text-zinc-700 uppercase tracking-wide">À venir</p>
          </div>
        </div>

        {/* Upcoming games grid */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-sm font-semibold text-zinc-500">Prochainement</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map((g) => <GameCard key={g.id} game={g} />)}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            En attendant les jeux, commence par les leçons.
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
