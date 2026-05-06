import Link from "next/link";

const lessons = [
  {
    id: "lecon1",
    number: 1,
    title: "Hawkish vs Dovish — comment lire le ton d'une banque centrale",
    duration: "18 min",
    description: "Décoder le langage des banques centrales pour anticiper les mouvements de fond.",
    href: "/formations/macro/intermediaire/lecon1",
    disabled: false,
  },
  {
    id: "lecon2",
    number: 2,
    title: "Comprendre le calendrier économique — comment lire le marché à l'avance",
    duration: "14 min",
    description: "Consensus, précédent, révisions : les 4 colonnes qui font la différence entre subir et anticiper.",
    href: "/formations/macro/intermediaire/lecon2",
    disabled: false,
  },
  {
    id: "lecon3",
    number: 3,
    title: "CPI, PPI et inflation — décoder les chiffres qui font bouger le marché",
    duration: "16 min",
    description: "PPI, CPI Headline, Core CPI, Core PCE : la chaîne complète et comment trader chaque publication.",
    href: "/formations/macro/intermediaire/lecon3",
    disabled: false,
  },
  {
    id: "lecon4",
    number: 4,
    title: "Sessions de trading et liquidité — quand le marché bouge vraiment",
    duration: "14 min",
    description: "Asie, Londres, New York : pourquoi l'overlap 14h-17h concentre les vrais mouvements et comment adapter ta fenêtre de trading.",
    href: "/formations/macro/intermediaire/lecon4",
    disabled: false,
  },
  {
    id: "lecon5",
    number: 5,
    title: "Les corrélations — comment les marchés bougent ensemble",
    duration: "14 min",
    description: "Corrélations positives, négatives, cassures : comment éviter d'empiler le même risque macro sur plusieurs actifs.",
    href: "/formations/macro/intermediaire/lecon5",
    disabled: false,
  },
  {
    id: "lecon6",
    number: 6,
    title: "Construire son biais hebdomadaire",
    duration: "14 min",
    description: "Routine pro pour préparer ta semaine — calendrier, corrélations, biais par actif.",
    href: "/formations/macro/intermediaire/lecon6",
    disabled: false,
  },
];

export default function MacroIntermediairePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Formations</Link>
          <span>/</span>
          <Link href="/formations/macro" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <span className="text-zinc-400">Intermédiaire</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">Macro Trading — Intermédiaire</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20 shrink-0">
              Intermédiaire
            </span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Décode les banques centrales, anticipe les mouvements macro et structure ton biais hebdomadaire.
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
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-blue-400/10 border border-blue-400/20 text-blue-400">
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
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-blue-400">
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
