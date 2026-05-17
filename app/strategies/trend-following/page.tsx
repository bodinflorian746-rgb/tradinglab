import Link from "next/link";

const LESSONS = [
  {
    id:          "lecon1",
    number:      1,
    title:       "Reconnaître une tendance (HH/HL vs LH/LL)",
    description: "Le marché ne fait que trois choses : monter, descendre, ou attendre. Les critères visuels pour distinguer les trois.",
    duration:    "15 min",
    href:        "/strategies/trend-following/lecon1",
    disabled:    false,
  },
  {
    id:          "lecon2",
    number:      2,
    title:       "Trendline et moyennes mobiles : tracer la tendance",
    description: "La structure HH/HL reste la base. Trendline et MM donnent une lecture plus rapide et plus propre du marché.",
    duration:    "15 min",
    href:        "/strategies/trend-following/lecon2",
    disabled:    false,
  },
  {
    id:          "lecon3",
    number:      3,
    title:       "Trader avec la tendance : pullback et entrée",
    description: "Une tendance ne monte pas en ligne droite. Elle progresse par vagues. Cette leçon te montre comment exploiter ces vagues pour entrer dans le sens du marché au meilleur prix.",
    duration:    "18 min",
    href:        "/strategies/trend-following/lecon3",
    disabled:    false,
  },
  {
    id:          "lecon4",
    number:      4,
    title:       "Quand sortir : retournement de tendance",
    description: "BOS et CHoCH te donnent deux signaux objectifs pour fermer une position avant que la tendance ne s’inverse.",
    duration:    "18 min",
    href:        "/strategies/trend-following/lecon4",
    disabled:    false,
  },
];

export default function TrendFollowingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <span className="text-zinc-400">Trend Following</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">Trend Following</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              Débutant
            </span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Trade dans le sens du marché avec des pullbacks disciplinés — tendance, retracement, sortie sur structure.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-zinc-800/60">
            {LESSONS.map((lesson) => (
              <div key={lesson.id} className={lesson.disabled ? "opacity-40" : ""}>
                {lesson.disabled ? (
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-zinc-800 border border-zinc-700 text-zinc-600">
                        {lesson.number}
                      </div>
                      <span className="text-sm font-medium text-zinc-500 truncate">{lesson.title}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700 shrink-0">
                      Bientôt
                    </span>
                  </div>
                ) : (
                  <Link href={lesson.href} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        {lesson.number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
                        <p className="text-xs text-zinc-500 truncate">{lesson.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0 ml-4">{lesson.duration}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
