interface PullbackContinuationDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

type CD = {
  cx: number;
  wickTop: number;
  bodyTop: number;
  bodyBot: number;
  wickBot: number;
  bull: boolean;
};

function Candle({ cx, wickTop, bodyTop, bodyBot, wickBot, bull }: CD) {
  const hw = 6;
  return (
    <g>
      <line x1={cx} y1={wickTop} x2={cx} y2={wickBot}
        stroke={bull ? "#059669" : "#dc2626"} strokeWidth="1.5" strokeLinecap="round" />
      <rect x={cx - hw} y={bodyTop} width={hw * 2}
        height={Math.max(bodyBot - bodyTop, 3)}
        fill={bull ? "#10b981" : "#ef4444"}
        stroke={bull ? "#059669" : "#dc2626"}
        strokeWidth="0.8" rx="1.2" />
    </g>
  );
}

// Impulsion haussière initiale (5 bougies, swing low → swing high)
const IMPULSE: CD[] = [
  { cx: 22,  wickTop: 170, bodyTop: 174, bodyBot: 184, wickBot: 188, bull: true },
  { cx: 50,  wickTop: 140, bodyTop: 144, bodyBot: 170, wickBot: 174, bull: true },
  { cx: 78,  wickTop: 100, bodyTop: 104, bodyBot: 140, wickBot: 144, bull: true },
  { cx: 106, wickTop: 75,  bodyTop: 79,  bodyBot: 104, wickBot: 108, bull: true },
  { cx: 134, wickTop: 52,  bodyTop: 56,  bodyBot: 75,  wickBot: 80,  bull: true },
];

// Pullback baissier (4 bougies, descend dans la zone OTE)
const PULLBACK: CD[] = [
  { cx: 162, wickTop: 55,  bodyTop: 60,  bodyBot: 82,  wickBot: 88,  bull: false },
  { cx: 190, wickTop: 80,  bodyTop: 86,  bodyBot: 112, wickBot: 118, bull: false },
  { cx: 218, wickTop: 112, bodyTop: 116, bodyBot: 138, wickBot: 142, bull: false },
  { cx: 246, wickTop: 138, bodyTop: 142, bodyBot: 152, wickBot: 156, bull: false },
];

// Bougie signal : rejet haussier dans la zone OB
const SIGNAL: CD = {
  cx: 274, wickTop: 140, bodyTop: 144, bodyBot: 152, wickBot: 156, bull: true,
};

// Continuation haussière post-signal (vise la FVG comme cible, sans la toucher)
const CONTINUATION: CD[] = [
  { cx: 302, wickTop: 125, bodyTop: 129, bodyBot: 146, wickBot: 150, bull: true },
  { cx: 330, wickTop: 118, bodyTop: 122, bodyBot: 132, wickBot: 136, bull: true },
  { cx: 358, wickTop: 112, bodyTop: 116, bodyBot: 124, wickBot: 128, bull: true },
];

export default function PullbackContinuationDiagram({ className = "", locale = "fr" }: PullbackContinuationDiagramProps) {
  const isEs = locale === "es";
  const L = {
    supportLabel:  isEs ? "Soporte H4/Daily" : "Support H4/Daily",
    oteLabel:      isEs ? "OTE 61.8–78.6%"   : "OTE 61.8–78.6%",
    obLabel:       isEs ? "OB (entrada)"     : "OB (entrée)",
    fvgLabel:      isEs ? "FVG (objetivo)"   : "FVG (cible)",
    rejet:         isEs ? "rechazo ↑"        : "rejet ↑",
    swingHigh:     isEs ? "Swing High"       : "Swing High",
    footerDesktop: isEs
      ? "Entrada en OTE + OB, FVG arriba como objetivo : continuación limpia"
      : "Entrée OTE + OB, FVG au-dessus comme cible : continuation propre",
    // Mobile
    mobileTitle:   isEs ? "Pullback OTE — continuación hacia FVG" : "Pullback OTE — continuation vers FVG",
    m1bold:        isEs ? "1 · Soporte H4/Daily"                  : "1 · Support H4/Daily",
    m1desc:        isEs ? "· ancla estructural en la base"        : "· ancrage structurel en bas",
    m2bold:        isEs ? "2 · Pullback en OTE 61.8–78.6%"        : "2 · Pullback vers OTE 61.8–78.6%",
    m2desc:        isEs ? "· zona de retracement óptima"          : "· zone de retracement optimale",
    m3bold:        isEs ? "3 · Order Block en OTE"                : "3 · Order Block dans l'OTE",
    m3desc:        isEs ? "· huella institucional, punto de entrada" : "· trace institutionnelle, point d'entrée",
    m4bold:        isEs ? "4 · FVG arriba"                        : "4 · FVG au-dessus",
    m4desc:        isEs ? "· desequilibrio a llenar, objetivo de continuación" : "· déséquilibre à combler, cible de continuation",
    leg1:          isEs ? "Soporte H4/Daily"                      : "Support H4/Daily",
    leg2:          isEs ? "Zona OTE (61.8–78.6%)"                 : "Zone OTE (61.8–78.6%)",
    leg3:          isEs ? "Order Block (entrada)"                 : "Order Block (entrée)",
    leg4:          isEs ? "FVG (objetivo de continuación)"        : "FVG (cible de continuation)",
  };

  // Zones (en coordonnées SVG y, où small y = high price)
  const supportTop = 158, supportBot = 180;
  const oteTop     = 136, oteBot     = 160;
  const obTop      = 146, obBot      = 160;
  const fvgTop     = 80,  fvgBot     = 108;

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 500 220"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`@media (max-width: 640px) { .chart-detail-labels { display: none; } }`}</style>

        {/* Support HTF — ancrage structurel en bas, emerald */}
        <rect x={10} y={supportTop} width={475} height={supportBot - supportTop}
          fill="#10b98112" stroke="#10b98135" strokeWidth="0.8" rx="2" />

        {/* OTE 61.8–78.6% — zone bleue dashed sur la pullback */}
        <rect x={140} y={oteTop} width={240} height={oteBot - oteTop}
          fill="#60a5fa12" stroke="#60a5fa55" strokeWidth="0.8" strokeDasharray="4 2" rx="2" />

        {/* Order Block — emerald solid, à l'intérieur de l'OTE, au point d'entrée */}
        <rect x={232} y={obTop} width={62} height={obBot - obTop}
          fill="#10b98135" stroke="#10b981" strokeWidth="1" rx="1.5" />

        {/* FVG — amber, au-dessus de l'entrée, cible de continuation */}
        <rect x={280} y={fvgTop} width={200} height={fvgBot - fvgTop}
          fill="#f59e0b15" stroke="#f59e0b55" strokeWidth="0.8" rx="2" />

        {/* Bougies dans l'ordre temporel : impulse → pullback → signal → continuation */}
        {IMPULSE.map((c, i) => <Candle key={`i${i}`} {...c} />)}
        {PULLBACK.map((c, i) => <Candle key={`p${i}`} {...c} />)}
        <Candle {...SIGNAL} />
        {CONTINUATION.map((c, i) => <Candle key={`co${i}`} {...c} />)}

        {/* Flèche de continuation : OB → FVG (cible visée) */}
        <g opacity="0.85">
          <line x1={400} y1={obTop - 2} x2={400} y2={fvgBot + 6}
            stroke="#10b981" strokeWidth="1.8" strokeDasharray="3 2" />
          <polygon points="394,118 406,118 400,108" fill="#10b981" />
        </g>

        {/* Markers swings */}
        <circle cx={22}  cy={186} r="2.8" fill="#71717a" opacity="0.85" />
        <circle cx={134} cy={52}  r="3"   fill="#71717a" opacity="0.85" />

        {/* Labels — masqués sur mobile */}
        <g className="chart-detail-labels">
          {/* Swing High marker label */}
          <rect x={108} y={38} width={56} height={12} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={136} y={47} fontSize="7" fill="#71717a" textAnchor="middle" fontWeight="600">
            {L.swingHigh}
          </text>

          {/* Support HTF label — à gauche dans la zone */}
          <rect x={14} y={supportTop + 4} width={94} height={13} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={61} y={supportTop + 13} fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">
            {L.supportLabel}
          </text>

          {/* OTE label — à droite au-dessus de la zone */}
          <rect x={142} y={oteTop - 13} width={82} height={12} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={183} y={oteTop - 4} fontSize="7.5" fill="#60a5fa" textAnchor="middle" fontWeight="700">
            {L.oteLabel}
          </text>

          {/* OB label — sous la zone OB */}
          <rect x={234} y={obBot + 3} width={58} height={12} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={263} y={obBot + 12} fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">
            {L.obLabel}
          </text>

          {/* FVG label — au centre de la zone amber */}
          <rect x={344} y={fvgTop + (fvgBot - fvgTop) / 2 - 7} width={76} height={14} rx="2"
            fill="#09090b" fillOpacity="0.85" />
          <text x={382} y={fvgTop + (fvgBot - fvgTop) / 2 + 3} fontSize="7.5" fill="#f59e0b" textAnchor="middle" fontWeight="700">
            {L.fvgLabel}
          </text>

          {/* Signal de rejet — sous le signal candle */}
          <rect x={250} y={170} width={48} height={12} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={274} y={179} fontSize="7" fill="#10b981" textAnchor="middle" fontWeight="600">
            {L.rejet}
          </text>
        </g>

        {/* Hint pédagogique en bas */}
        <text x={250} y={207} fontSize="7.5" fill="#71717a" textAnchor="middle">
          {L.footerDesktop}
        </text>
      </svg>

      {/* Mobile : 4 cartes empilées avec la séquence pédagogique */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2">
        <p className="text-[13px] font-bold text-emerald-400">{L.mobileTitle}</p>
        <ul className="space-y-1.5 text-[13px] leading-snug">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500 mt-0.5" />
            <span className="text-white">
              <span className="font-bold text-emerald-400">{L.m1bold}</span>
              <span className="text-zinc-300"> {L.m1desc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-3 rounded-sm bg-blue-500/30 border border-blue-400 mt-0.5" />
            <span className="text-white">
              <span className="font-bold text-blue-400">{L.m2bold}</span>
              <span className="text-zinc-300"> {L.m2desc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-3 rounded-sm bg-emerald-600/50 border border-emerald-500 mt-0.5" />
            <span className="text-white">
              <span className="font-bold text-emerald-400">{L.m3bold}</span>
              <span className="text-zinc-300"> {L.m3desc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500 mt-0.5" />
            <span className="text-white">
              <span className="font-bold text-amber-400">{L.m4bold}</span>
              <span className="text-zinc-300"> {L.m4desc}</span>
            </span>
          </li>
        </ul>
      </div>

      {/* Légende desktop */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/40" />
          <span className="text-[10px] text-zinc-500">{L.leg1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400/40" />
          <span className="text-[10px] text-zinc-500">{L.leg2}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/60 border border-emerald-500" />
          <span className="text-[10px] text-zinc-500">{L.leg3}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500/40" />
          <span className="text-[10px] text-zinc-500">{L.leg4}</span>
        </div>
      </div>
    </div>
  );
}
