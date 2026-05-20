import Link from "next/link";
import { STRATEGY_MODULES, type StrategyModule, type StrategyLevel } from "@/lib/strategies";

// ─── Level config ──────────────────────────────────────────────────────────────

const LEVEL_CONFIG: Record<StrategyLevel, {
  label:       string;
  tagline:     string;
  description: string;
  badgeClass:  string;
  dotClass:    string;
  labelClass:  string;
}> = {
  debutant: {
    label:       "Débutant",
    tagline:     "Les fondations",
    description: "Les concepts essentiels pour lire le marché et construire des setups solides.",
    badgeClass:  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dotClass:    "bg-emerald-500",
    labelClass:  "text-emerald-400",
  },
  intermediaire: {
    label:       "Intermédiaire",
    tagline:     "La structure",
    description: "Les concepts institutionnels pour comprendre comment le marché se déplace réellement.",
    badgeClass:  "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    dotClass:    "bg-blue-400",
    labelClass:  "text-blue-400",
  },
  avance: {
    label:       "Avancé",
    tagline:     "La maîtrise",
    description: "Les techniques des traders professionnels — précision chirurgicale et lecture institutionnelle.",
    badgeClass:  "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    dotClass:    "bg-amber-400",
    labelClass:  "text-amber-400",
  },
};

// ─── Module card ───────────────────────────────────────────────────────────────

function ModuleCard({ module }: { module: StrategyModule }) {
  const cfg = LEVEL_CONFIG[module.level];

  return (
    <Link
      href={`/strategies/${module.id}`}
      className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-bold text-white leading-snug flex-1 min-w-0">
          {module.title}
        </span>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${cfg.badgeClass}`}>
          {cfg.label}
        </span>
      </div>

      <p className="text-xs text-zinc-500 leading-relaxed flex-1">{module.subtitle}</p>

      <div className="flex items-center justify-between pt-1">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badgeClass}`}>
          {module.lessonCount} leçons
        </span>
        <span className={`text-xs font-semibold flex items-center gap-1 ${cfg.labelClass} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
          Voir le module
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M4 9l4-3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

// ─── Level section ─────────────────────────────────────────────────────────────

function LevelSection({ level }: { level: StrategyLevel }) {
  const cfg     = LEVEL_CONFIG[level];
  const modules = STRATEGY_MODULES
    .filter((m) => m.level === level)
    .sort((a, b) => a.order - b.order);

  const gridClass = modules.length >= 3
    ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
    : "grid sm:grid-cols-2 gap-4";

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.labelClass}`}>
          {cfg.label}
        </span>
        <span className="text-[10px] text-zinc-700">·</span>
        <span className="text-[10px] text-zinc-600 font-medium">
          {modules.length} stratégies
        </span>
      </div>
      <p className="text-sm text-zinc-500 mb-5 max-w-lg">{cfg.description}</p>
      <div className={gridClass}>
        {modules.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const LEVELS: StrategyLevel[] = ["debutant", "intermediaire", "avance"];

export default function StrategiesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ── Hero ── */}
        <div className="text-center mb-14">

          <div className="inline-flex max-w-full items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] text-zinc-500 mb-7 font-medium">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
              style={{ boxShadow: "0 0 6px rgba(16,185,129,0.7)" }}
            />
            <span className="truncate">
              <span className="sm:hidden">8 stratégies · 3 niveaux · Niveau pro</span>
              <span className="hidden sm:inline">8 stratégies · 3 niveaux · Du retail au niveau institutionnel</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
            Apprends à trader
            <br />
            <span className="text-zinc-500">avec une vraie méthode.</span>
          </h1>

          <p className="text-zinc-400 text-base max-w-lg mx-auto leading-relaxed mb-8">
            Un parcours structuré — des fondations aux techniques institutionnelles —
            pour construire une approche solide et reproductible.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:inline-flex sm:items-center sm:divide-x divide-zinc-800 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
            {[
              { value: "8",       label: "Stratégies" },
              { value: "8",       label: "Gratuites" },
              { value: "À venir", label: "Premium" },
              { value: "3",       label: "Niveaux" },
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
            const cfg   = LEVEL_CONFIG[level];
            const count = STRATEGY_MODULES.filter((m) => m.level === level).length;
            return (
              <div key={level} className="flex items-center">
                <div className="flex flex-col items-center text-center px-2 sm:px-6 py-3 rounded-xl">
                  <div className={`w-2.5 h-2.5 rounded-full mb-2 ${cfg.dotClass}`} />
                  <span className="text-xs sm:text-sm font-bold text-white">{cfg.label}</span>
                  <span className={`text-[10px] font-medium mt-0.5 ${cfg.labelClass}`}>{cfg.tagline}</span>
                  <span className="text-[10px] text-zinc-700 mt-0.5">{count} stratégies</span>
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
            <LevelSection key={level} level={level} />
          ))}
        </div>

      </div>
    </main>
  );
}
