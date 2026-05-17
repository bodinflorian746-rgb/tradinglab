import Link from "next/link";

const LESSONS = [
  {
    id:          "lecon1",
    number:      1,
    title:       "Support et résistance : les zones où le marché réagit",
    description: "Comprends ce qu'est un support et une résistance — les zones où le prix rebondit ou rejette régulièrement.",
    duration:    "15 min",
    href:        "/strategies/support-resistance/lecon1",
    disabled:    false,
  },
  {
    id:          "lecon2",
    number:      2,
    title:       "Identifier un vrai niveau (vs une ligne tracée au hasard)",
    description: "Les critères pour distinguer un vrai niveau d'une ligne au hasard — touches multiples, rejets visibles, niveau récent.",
    duration:    "15 min",
    href:        "/strategies/support-resistance/lecon2",
    disabled:    false,
  },
  {
    id:          "lecon3",
    number:      3,
    title:       "Flip support↔résistance et trader un rebond",
    description: "Les niveaux ne disparaissent pas quand ils cassent — ils changent souvent de rôle. Trade les retests après flip pour des setups classiques.",
    duration:    "18 min",
    href:        "/strategies/support-resistance/lecon3",
    disabled:    false,
  },
  {
    id:          "lecon4",
    number:      4,
    title:       "Cassure vraie vs fake breakout",
    description: "Distinguer les vraies cassures des pièges. Les fakes sont violentes et rejettent vite — un setup à part entière.",
    duration:    "17 min",
    href:        "/strategies/support-resistance/lecon4",
    disabled:    false,
  },
];

export default function SupportResistancePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <span className="text-zinc-400">Support / Résistance &amp; Range</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">Support / Résistance &amp; Range</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              Débutant
            </span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Identifie les zones de prix qui comptent et trade les marchés latéraux — polarité, range, breakout vs fakeout.
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
                        {"description" in lesson && lesson.description && (
                          <span className="text-xs text-zinc-500 mt-0.5 block">{lesson.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {"duration" in lesson && lesson.duration && (
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
