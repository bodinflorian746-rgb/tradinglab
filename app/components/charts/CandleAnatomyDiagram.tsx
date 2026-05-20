interface CandleAnatomyDiagramProps {
  className?: string;
}

export function CandleAnatomyDiagram({ className = '' }: CandleAnatomyDiagramProps) {
  // Green (bullish) candle — Close at top, Open at bottom
  const gCx = 240;
  const gWickTopY = 62;
  const gBodyTopY = 100;  // Close
  const gBodyBotY = 240;  // Open
  const gWickBotY = 278;

  // Red (bearish) candle — Open at top, Close at bottom
  const rCx = 460;
  const rWickTopY = 70;
  const rBodyTopY = 108;  // Open
  const rBodyBotY = 228;  // Close
  const rWickBotY = 262;

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center py-3 border-b border-zinc-800/60">
        Bougie verte (haussière) · Bougie rouge (baissière)
      </p>
      <svg
        viewBox="0 0 700 360"
        width="100%"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Anatomie d'une bougie japonaise"
      >
        <style>{`
          @media (max-width: 640px) {
            .chart-detail-labels { display: none; }
          }
        `}</style>

        {/* Zone separator */}
        <line x1="350" y1="20" x2="350" y2="346" stroke="#3f3f46" strokeWidth="1" />

        {/* Bougies — toujours visibles */}
        {/* ── GREEN CANDLE ─── */}
        <line x1={gCx} y1={gWickTopY} x2={gCx} y2={gBodyTopY} stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
        <rect x={gCx - 20} y={gBodyTopY} width="40" height={gBodyBotY - gBodyTopY} rx="3" fill="#10b981" />
        <line x1={gCx} y1={gBodyBotY} x2={gCx} y2={gWickBotY} stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />

        {/* ── RED CANDLE ─── */}
        <line x1={rCx} y1={rWickTopY} x2={rCx} y2={rBodyTopY} stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
        <rect x={rCx - 20} y={rBodyTopY} width="40" height={rBodyBotY - rBodyTopY} rx="3" fill="#ef4444" />
        <line x1={rCx} y1={rBodyBotY} x2={rCx} y2={rWickBotY} stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />

        {/* Labels détaillés — masqués sur mobile, repris en HTML dessous */}
        <g className="chart-detail-labels">
          {/* Green: High — centered above, connector down to wick tip */}
          <line x1={gCx} y1={gWickTopY} x2={gCx} y2={47} stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x={gCx} y="41" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="monospace">High — point haut</text>

          {/* Green: Close — horizontal connector left from body top */}
          <line x1={gCx - 22} y1={gBodyTopY} x2={130} y2={gBodyTopY} stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x="126" y={gBodyTopY + 5} textAnchor="end" fontSize="11" fill="#34d399" fontFamily="monospace">Close — clôture</text>

          {/* Green: Open — horizontal connector left from body bottom */}
          <line x1={gCx - 22} y1={gBodyBotY} x2={130} y2={gBodyBotY} stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x="126" y={gBodyBotY + 5} textAnchor="end" fontSize="11" fill="#34d399" fontFamily="monospace">Open — ouverture</text>

          {/* Green: Low — centered below, connector up from wick tip */}
          <line x1={gCx} y1={gWickBotY} x2={gCx} y2={298} stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x={gCx} y="308" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="monospace">Low — point bas</text>

          {/* Green: subtitle */}
          <text x={gCx} y="338" textAnchor="middle" fontSize="12" fill="#34d399" fontFamily="sans-serif" fontWeight="700">Acheteurs ↑</text>

          {/* Red: High — centered above, connector down to wick tip */}
          <line x1={rCx} y1={rWickTopY} x2={rCx} y2={49} stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x={rCx} y="43" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="monospace">High — point haut</text>

          {/* Red: Open — horizontal connector right from body top */}
          <line x1={rCx + 22} y1={rBodyTopY} x2={570} y2={rBodyTopY} stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x="574" y={rBodyTopY + 5} textAnchor="start" fontSize="11" fill="#f87171" fontFamily="monospace">Open — ouverture</text>

          {/* Red: Close — horizontal connector right from body bottom */}
          <line x1={rCx + 22} y1={rBodyBotY} x2={570} y2={rBodyBotY} stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x="574" y={rBodyBotY + 5} textAnchor="start" fontSize="11" fill="#f87171" fontFamily="monospace">Close — clôture</text>

          {/* Red: Low — centered below, connector up from wick tip */}
          <line x1={rCx} y1={rWickBotY} x2={rCx} y2={285} stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          <text x={rCx} y="295" textAnchor="middle" fontSize="11" fill="#a1a1aa" fontFamily="monospace">Low — point bas</text>

          {/* Red: subtitle */}
          <text x={rCx} y="326" textAnchor="middle" fontSize="12" fill="#f87171" fontFamily="sans-serif" fontWeight="700">Vendeurs ↓</text>
        </g>
      </svg>

      {/* Mobile : anatomie expliquée en HTML (remplace les labels SVG illisibles) */}
      <div className="sm:hidden grid grid-cols-1 gap-3 px-4 py-3 border-t border-zinc-800/50">
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3 space-y-1.5">
          <p className="text-[12px] font-bold text-emerald-400 uppercase tracking-wide">Bougie verte — Acheteurs ↑</p>
          <ul className="space-y-1 text-[13px] text-white">
            <li><span className="text-zinc-300">High</span> — point le plus haut atteint</li>
            <li><span className="text-emerald-400 font-semibold">Close</span> — clôture en haut du corps</li>
            <li><span className="text-emerald-400 font-semibold">Open</span> — ouverture en bas du corps</li>
            <li><span className="text-zinc-300">Low</span> — point le plus bas atteint</li>
          </ul>
        </div>
        <div className="rounded-lg border border-red-500/25 bg-red-500/5 p-3 space-y-1.5">
          <p className="text-[12px] font-bold text-red-400 uppercase tracking-wide">Bougie rouge — Vendeurs ↓</p>
          <ul className="space-y-1 text-[13px] text-white">
            <li><span className="text-zinc-300">High</span> — point le plus haut atteint</li>
            <li><span className="text-red-400 font-semibold">Open</span> — ouverture en haut du corps</li>
            <li><span className="text-red-400 font-semibold">Close</span> — clôture en bas du corps</li>
            <li><span className="text-zinc-300">Low</span> — point le plus bas atteint</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
