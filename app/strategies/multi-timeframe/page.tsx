import Link from "next/link";

const LESSONS = Array.from({ length: 5 }, (_, i) => i + 1);

export default function MultiTimeframePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-8">
          <Link href="/strategies" className="hover:text-zinc-400 transition-colors">Stratégies</Link>
          <span>/</span>
          <span className="text-zinc-400">Multi-timeframe Process</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-bold">Multi-timeframe Process</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              Intermédiaire
            </span>
          </div>
          <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
            Méthode top-down disciplinée pour transformer une lecture macro en exécution précise — Daily → H4 → H1 → entrée.
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
