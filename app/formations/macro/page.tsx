import Link from "next/link";

const levels = [
  {
    href: "/formations/macro/debutant",
    label: "Débutant",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    buttonClass: "bg-emerald-500/10 text-emerald-500",
    description: "Les fondamentaux : qui contrôle le marché, pourquoi la macro compte en trading.",
    count: "6 leçons",
    disabled: false,
  },
  {
    href: "/formations/macro/intermediaire",
    label: "Intermédiaire",
    badgeClass: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
    buttonClass: "bg-blue-400/10 text-blue-400",
    description: "Hawkish vs Dovish, prévision vs réel, corrélations entre marchés.",
    count: "6 leçons",
    disabled: false,
  },
  {
    href: "/formations/macro/avance",
    label: "Avancé",
    badgeClass: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    buttonClass: "bg-amber-400/10 text-amber-400",
    description: "FOMC, NFP, rendements obligataires US et régimes de marché — comprendre les news qui font bouger les marchés",
    count: "4 leçons",
    disabled: false,
  },
];

export default function MacroPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Formations</Link>
          <span>/</span>
          <span className="text-zinc-400">Macro Trading</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Macro Trading</h1>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Comprends pourquoi les marchés bougent et utilise-le pour mieux trader. La macro n&apos;est pas une théorie académique — c&apos;est un outil de décision.
          </p>
        </div>

        <div className="space-y-4">
          {levels.map((level) =>
            level.disabled ? (
              <div
                key={level.label}
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl overflow-hidden opacity-50"
              >
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h2 className="text-xl font-semibold">{level.label}</h2>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${level.badgeClass}`}>
                          {level.count}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                          Bientôt disponible
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">{level.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={level.label}
                href={level.href}
                className="block bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors"
              >
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h2 className="text-xl font-semibold">{level.label}</h2>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${level.badgeClass}`}>
                          {level.count}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">{level.description}</p>
                    </div>
                    <div className="shrink-0 hidden md:block">
                      <span className={`inline-flex items-center gap-1.5 ${level.buttonClass ?? ""} text-xs font-semibold px-3.5 py-2 rounded-lg`}>
                        Commencer
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4 9l4-3-4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>

      </div>
    </main>
  );
}
