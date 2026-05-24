import Link from "next/link";

const lessons = [
  {
    id: "lecon1",
    number: 1,
    title: "C'est quoi la macro et pourquoi ça compte en trading",
    duration: "12 min",
    description: "Comprends pourquoi le marché bouge avant même de regarder un graphique.",
    href: "/formations/macro/debutant/lecon1",
    disabled: false,
  },
  {
    id: "lecon2",
    number: 2,
    title: "Les 4 grandes banques centrales",
    duration: "12 min",
    description: "Fed, BCE, BoE, BoJ, comprends qui fixe les règles du jeu et pourquoi le dollar domine tout.",
    href: "/formations/macro/debutant/lecon2",
    disabled: false,
  },
  {
    id: "lecon3",
    number: 3,
    title: "Les chiffres macro à surveiller",
    duration: "12 min",
    description: "Quels chiffres font bouger les marchés, pourquoi, et comment les anticiper.",
    href: "/formations/macro/debutant/lecon3",
    disabled: false,
  },
  {
    id: "lecon4",
    number: 4,
    title: "Comprendre l'inflation",
    duration: "12 min",
    description: "Pourquoi tout part de là, la chaîne inflation → taux → devise → marchés.",
    href: "/formations/macro/debutant/lecon4",
    disabled: false,
  },
  {
    id: "lecon5",
    number: 5,
    title: "Le rôle du dollar dans le monde",
    duration: "12 min",
    description: "Pourquoi tout passe par lui. DXY, devise pivot et impact sur tous les marchés.",
    href: "/formations/macro/debutant/lecon5",
    disabled: false,
  },
  {
    id: "lecon6",
    number: 6,
    title: "Macro et risk management",
    duration: "12 min",
    description: "Adapter ton risque au contexte macro, fenêtres dangereuses, grille de décision et règles d'or.",
    href: "/formations/macro/debutant/lecon6",
    disabled: false,
  },
];

export default function MacroDebutantPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Formations</Link>
          <span>/</span>
          <Link href="/formations/macro" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <span className="text-zinc-400">Débutant</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">Macro Trading : Débutant</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              Débutant
            </span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Les fondations : comprends pourquoi les marchés bougent vraiment, avant même de regarder un graphique.
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
