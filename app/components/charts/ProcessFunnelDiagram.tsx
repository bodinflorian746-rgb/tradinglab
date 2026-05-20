// Diagramme : entonnoir du process multi-timeframe (Leçon 5 multi-timeframe)
// 4 étages empilés verticalement de plus en plus étroits — chaque étage filtre le suivant.

interface ProcessFunnelDiagramProps {
  className?: string;
}

export function ProcessFunnelDiagram({ className = "" }: ProcessFunnelDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        {/* Bloc 1 — Daily / H4 */}
        <rect x="110" y="30" width="480" height="50" rx="6" fill="#27272a" stroke="#3f3f46" />
        <text x="350" y="60" fill="#a1a1aa" fontSize="13" fontWeight="700" textAnchor="middle">Daily / H4 — Direction dominante</text>

        {/* Flèche 1→2 */}
        <line x1="350" y1="82" x2="350" y2="91" stroke="#71717a" strokeWidth="1.5" />
        <path d="M345,88 L350,94 L355,88" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Bloc 2 — H1 */}
        <rect x="170" y="95" width="360" height="50" rx="6" fill="#27272a" stroke="#3f3f46" />
        <text x="350" y="125" fill="#a1a1aa" fontSize="13" fontWeight="700" textAnchor="middle">H1 — Zone d&apos;intérêt</text>

        {/* Flèche 2→3 */}
        <line x1="350" y1="147" x2="350" y2="156" stroke="#71717a" strokeWidth="1.5" />
        <path d="M345,153 L350,159 L355,153" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Bloc 3 — M15 / M5 */}
        <rect x="230" y="160" width="240" height="50" rx="6" fill="#27272a" stroke="#3f3f46" />
        <text x="350" y="190" fill="#a1a1aa" fontSize="13" fontWeight="700" textAnchor="middle">M15 / M30 — Confirmation</text>

        {/* Flèche 3→4 */}
        <line x1="350" y1="212" x2="350" y2="221" stroke="#71717a" strokeWidth="1.5" />
        <path d="M345,218 L350,224 L355,218" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Bloc 4 — TRADE */}
        <rect x="280" y="225" width="140" height="50" rx="6" fill="#10b981" stroke="#059669" />
        <text x="350" y="256" fill="#09090b" fontSize="14" fontWeight="800" textAnchor="middle">TRADE</text>

        {/* Annotation à droite */}
        <text x="610" y="62" fill="#f59e0b" fontSize="9" fontWeight="600">Le scénario</text>
        <text x="610" y="78" fill="#f59e0b" fontSize="9" fontWeight="600">se construit</text>
        <text x="610" y="130" fill="#f59e0b" fontSize="9" fontWeight="600">du haut</text>
        <text x="610" y="146" fill="#f59e0b" fontSize="9" fontWeight="600">vers le bas</text>

        {/* Caption */}
        <text x="350" y="302" fill="#a1a1aa" fontSize="10" textAnchor="middle">
          Chaque étage réduit les possibilités avant le suivant
        </text>
      </svg>

      {/* MOBILE : entonnoir process ────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">Entonnoir du process top-down</p>
        <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/8 p-3 text-center">
          <p className="text-[13px] font-bold text-emerald-400">Daily / H4 — Direction dominante</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Étage 1 : contexte directionnel.</p>
        </div>
        <p className="text-center text-zinc-600 text-[14px]">↓</p>
        <div className="rounded-lg border-2 border-blue-400 bg-blue-500/8 p-3 text-center">
          <p className="text-[13px] font-bold text-blue-400">H1 — Zone d'intérêt</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Étage 2 : préparation tactique.</p>
        </div>
        <p className="text-center text-zinc-600 text-[14px]">↓</p>
        <div className="rounded-lg border-2 border-amber-400 bg-amber-400/8 p-3 text-center">
          <p className="text-[13px] font-bold text-amber-400">M15 / M5 — Déclencheur</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Étage 3 : timing d'entrée précis.</p>
        </div>
        <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
          Le trade n'arrive qu'au bout de l'entonnoir.
        </p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-700" />
          <span className="text-[10px] text-zinc-500">3 étages d&apos;analyse — du contexte au timing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Le trade n&apos;arrive qu&apos;au bout de l&apos;entonnoir</span>
        </div>
      </div>
    </div>
  );
}
