// Diagramme : entonnoir du process multi-timeframe (Leçon 5 multi-timeframe)
// 4 étages empilés verticalement de plus en plus étroits — chaque étage filtre le suivant.

interface ProcessFunnelDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function ProcessFunnelDiagram({ className = "", locale = "fr" }: ProcessFunnelDiagramProps) {
  const isEs = locale === "es";
  const L = {
    block1:        isEs ? "Daily / H4 — Dirección dominante" : "Daily / H4 — Direction dominante",
    block2:        isEs ? "H1 — Zona de interés" : "H1 — Zone d'intérêt",
    block3:        isEs ? "M15 / M30 — Confirmación" : "M15 / M30 — Confirmation",
    trade:         "TRADE",
    annot1:        isEs ? "El escenario" : "Le scénario",
    annot2:        isEs ? "se construye" : "se construit",
    annot3:        isEs ? "de arriba" : "du haut",
    annot4:        isEs ? "hacia abajo" : "vers le bas",
    caption:       isEs ? "Cada etapa reduce las posibilidades antes de la siguiente" : "Chaque étage réduit les possibilités avant le suivant",
    mobTitle:      isEs ? "Embudo del proceso top-down" : "Entonnoir du process top-down",
    mobStage1:     isEs ? "Etapa 1: contexto direccional." : "Étage 1 : contexte directionnel.",
    mobBlock2:     isEs ? "H1 — Zona de interés" : "H1 — Zone d'intérêt",
    mobStage2:     isEs ? "Etapa 2: preparación táctica." : "Étage 2 : préparation tactique.",
    mobBlock3:     isEs ? "M15 / M5 — Disparador" : "M15 / M5 — Déclencheur",
    mobStage3:     isEs ? "Etapa 3: timing de entrada preciso." : "Étage 3 : timing d'entrée précis.",
    mobFooter:     isEs ? "El trade solo llega al final del embudo." : "Le trade n'arrive qu'au bout de l'entonnoir.",
    legendStages:  isEs ? "3 etapas de análisis — del contexto al timing" : "3 étages d'analyse — du contexte au timing",
    legendTrade:   isEs ? "El trade solo llega al final del embudo" : "Le trade n'arrive qu'au bout de l'entonnoir",
  };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        {/* Bloc 1 — Daily / H4 */}
        <rect x="110" y="30" width="480" height="50" rx="6" fill="#27272a" stroke="#3f3f46" />
        <text x="350" y="60" fill="#a1a1aa" fontSize="13" fontWeight="700" textAnchor="middle">{L.block1}</text>

        {/* Flèche 1→2 */}
        <line x1="350" y1="82" x2="350" y2="91" stroke="#71717a" strokeWidth="1.5" />
        <path d="M345,88 L350,94 L355,88" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Bloc 2 — H1 */}
        <rect x="170" y="95" width="360" height="50" rx="6" fill="#27272a" stroke="#3f3f46" />
        <text x="350" y="125" fill="#a1a1aa" fontSize="13" fontWeight="700" textAnchor="middle">{L.block2}</text>

        {/* Flèche 2→3 */}
        <line x1="350" y1="147" x2="350" y2="156" stroke="#71717a" strokeWidth="1.5" />
        <path d="M345,153 L350,159 L355,153" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Bloc 3 — M15 / M5 */}
        <rect x="230" y="160" width="240" height="50" rx="6" fill="#27272a" stroke="#3f3f46" />
        <text x="350" y="190" fill="#a1a1aa" fontSize="13" fontWeight="700" textAnchor="middle">{L.block3}</text>

        {/* Flèche 3→4 */}
        <line x1="350" y1="212" x2="350" y2="221" stroke="#71717a" strokeWidth="1.5" />
        <path d="M345,218 L350,224 L355,218" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Bloc 4 — TRADE */}
        <rect x="280" y="225" width="140" height="50" rx="6" fill="#10b981" stroke="#059669" />
        <text x="350" y="256" fill="#09090b" fontSize="14" fontWeight="800" textAnchor="middle">{L.trade}</text>

        {/* Annotation à droite */}
        <text x="610" y="62" fill="#f59e0b" fontSize="9" fontWeight="600">{L.annot1}</text>
        <text x="610" y="78" fill="#f59e0b" fontSize="9" fontWeight="600">{L.annot2}</text>
        <text x="610" y="130" fill="#f59e0b" fontSize="9" fontWeight="600">{L.annot3}</text>
        <text x="610" y="146" fill="#f59e0b" fontSize="9" fontWeight="600">{L.annot4}</text>

        {/* Caption */}
        <text x="350" y="302" fill="#a1a1aa" fontSize="10" textAnchor="middle">
          {L.caption}
        </text>
      </svg>

      {/* MOBILE : entonnoir process ────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>

        {/* Mini-SVG : funnel HTF → MTF → LTF (entonnoir vertical) */}
        <svg viewBox="0 0 280 130" className="w-full h-auto" aria-label="Process funnel HTF/MTF/LTF" fill="none">
          {/* Trapèze funnel */}
          <path d="M40,10 L240,10 L200,55 L80,55 Z" fill="#10b98115" stroke="#10b98155" strokeWidth="1" />
          <text x="140" y="35" fontSize="11" fill="#10b981" textAnchor="middle" fontWeight="700">D / W bias</text>
          <text x="140" y="48" fontSize="8" fill="#a1a1aa" textAnchor="middle">HTF</text>
          <path d="M80,60 L200,60 L170,90 L110,90 Z" fill="#60a5fa15" stroke="#60a5fa55" strokeWidth="1" />
          <text x="140" y="78" fontSize="11" fill="#60a5fa" textAnchor="middle" fontWeight="700">H4 / H1 zone</text>
          <text x="140" y="88" fontSize="8" fill="#a1a1aa" textAnchor="middle">MTF</text>
          <path d="M110,95 L170,95 L155,120 L125,120 Z" fill="#f59e0b15" stroke="#f59e0b55" strokeWidth="1" />
          <text x="140" y="111" fontSize="11" fill="#f59e0b" textAnchor="middle" fontWeight="700">M15 entry</text>
          <text x="140" y="119" fontSize="7" fill="#a1a1aa" textAnchor="middle">LTF</text>
        </svg>

        <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/8 p-3 text-center">
          <p className="text-[13px] font-bold text-emerald-400">{L.block1}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobStage1}</p>
        </div>
        <p className="text-center text-zinc-600 text-[14px]">↓</p>
        <div className="rounded-lg border-2 border-blue-400 bg-blue-500/8 p-3 text-center">
          <p className="text-[13px] font-bold text-blue-400">{L.mobBlock2}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobStage2}</p>
        </div>
        <p className="text-center text-zinc-600 text-[14px]">↓</p>
        <div className="rounded-lg border-2 border-amber-400 bg-amber-400/8 p-3 text-center">
          <p className="text-[13px] font-bold text-amber-400">{L.mobBlock3}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobStage3}</p>
        </div>
        <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
          {L.mobFooter}
        </p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-700" />
          <span className="text-[10px] text-zinc-500">{L.legendStages}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{L.legendTrade}</span>
        </div>
      </div>
    </div>
  );
}
