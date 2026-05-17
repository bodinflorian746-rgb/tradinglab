import Link from "next/link";

const LESSONS = [
  {
    id:          "lecon1",
    number:      1,
    title:       "Double top / Double bottom : la signature du retournement",
    description: "Reconnaître les 2 patterns de retournement les plus simples et les trader avec un R/R 2:1 propre.",
    duration:    "16 min",
    href:        "/strategies/reversal/lecon1",
    disabled:    false,
  },
  {
    id:          "lecon2",
    number:      2,
    title:       "Head & Shoulders : le retournement majeur",
    description: "Le pattern de retournement le plus réputé. Comment le repérer, le valider et le trader avec un R/R rond de 1,5:1.",
    duration:    "18 min",
    href:        "/strategies/reversal/lecon2",
    disabled:    false,
  },
  {
    id:          "lecon3",
    number:      3,
    title:       "Divergence RSI : quand le momentum trahit la tendance",
    description: "Le RSI révèle le momentum invisible derrière le prix. Comment lire et trader les divergences classiques avec un R/R 2:1.",
    duration:    "17 min",
    href:        "/strategies/reversal/lecon3",
    disabled:    false,
  },
  {
    id:          "lecon4",
    number:      4,
    title:       "Trader un reversal : checklist d’invalidation",
    description: "La checklist pratique pour identifier une invalidation et couper avant de rendre ton compte. Synthèse du module.",
    duration:    "18 min",
    href:        "/strategies/reversal/lecon4",
    disabled:    false,
  },
];

export default function ReversalPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <span className="text-zinc-400">Reversal &amp; Retournements</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">Reversal &amp; Retournements</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              Intermédiaire
            </span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Identifie et trade les retournements aux extrêmes — Fibonacci 0.618/0.786, divergences, confirmations combinées.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-zinc-800/60">
            {LESSONS.map((lesson) =>
              lesson.disabled ? (
                <div key={lesson.id} className="flex items-center justify-between px-6 py-4 opacity-40">
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
                <Link
                  key={lesson.id}
                  href={lesson.href}
                  className="block hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        {lesson.number}
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-white block">{lesson.title}</span>
                        {lesson.description && (
                          <span className="text-xs text-zinc-500 mt-0.5 block">{lesson.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {lesson.duration && (
                        <span className="text-xs text-zinc-700">{lesson.duration}</span>
                      )}
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-emerald-400">
                        <path d="M5.5 10.5l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
