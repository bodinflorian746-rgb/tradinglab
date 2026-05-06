import Link from "next/link";

const LESSONS = Array.from({ length: 4 }, (_, i) => i + 1);

export default function SupportResistancePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">
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
            {LESSONS.map((n) => (
              <div key={n} className="flex items-center justify-between px-6 py-4 opacity-40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-zinc-800 border border-zinc-700 text-zinc-600">
                    {n}
                  </div>
                  <span className="text-sm font-medium text-zinc-500 truncate">Leçon {n} — À venir</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-600 border border-zinc-700 shrink-0">
                  Bientôt
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
