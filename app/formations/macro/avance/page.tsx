import Link from "next/link";

const lessons = [
  {
    id: "lecon1",
    number: 1,
    title: "FOMC : l'événement qui peut changer la direction du marché",
    duration: "22 min",
    description: "Comment lire un FOMC sans se faire piéger par les premiers mouvements.",
    href: "/formations/macro/avance/lecon1",
    disabled: false,
  },
  {
    id: "lecon2",
    number: 2,
    title: "NFP — la news mensuelle qui fait trembler tous les actifs",
    duration: "16 min",
    description: "Lire le rapport complet (headline, chômage, salaires, révisions) et trader la réaction confirmée.",
    href: "/formations/macro/avance/lecon2",
    disabled: false,
  },
  {
    id: "lecon3",
    number: 3,
    title: "Les rendements obligataires US — le marché qui dirige tous les autres",
    duration: "16 min",
    description: "US10Y, courbe des taux et corrélations XAU/Nasdaq/BTC — l'indicateur n°1 que regardent les pros",
    href: "/formations/macro/avance/lecon3",
    disabled: false,
  },
  {
    id: "lecon4",
    number: 4,
    title: "Risk-on / Risk-off — le cadre mental du pro",
    duration: "18 min",
    description: "4 régimes de marché : risk-on, risk-off, reflation, flight to quality. Le vocabulaire et la grille de lecture du pro.",
    href: "/formations/macro/avance/lecon4",
    disabled: false,
  },
];

export default function MacroAvancePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Formations</Link>
          <span>/</span>
          <Link href="/formations/macro" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <span className="text-zinc-400">Avancé</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">Macro Trading — Avancé</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
              Avancé
            </span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Trader les news, lire les banques centrales, construire un biais macro structuré.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-zinc-800/60">
            {lessons.map((lesson) =>
              lesson.disabled ? (
                <div key={lesson.id} className="flex items-center justify-between px-6 py-4 opacity-40">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-zinc-800 border border-zinc-700 text-zinc-600">
                      {lesson.number}
                    </div>
                    <span className="text-sm font-medium text-zinc-500 truncate">{lesson.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {lesson.duration && (
                      <span className="text-xs text-zinc-700">{lesson.duration}</span>
                    )}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700">
                      Bientôt
                    </span>
                  </div>
                </div>
              ) : (
                <Link
                  key={lesson.id}
                  href={lesson.href!}
                  className="block hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-amber-400/10 border border-amber-400/20 text-amber-400">
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
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-amber-400">
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
