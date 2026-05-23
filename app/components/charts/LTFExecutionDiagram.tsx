// Diagramme : exécution LTF (M5)
// Le LTF donne le déclencheur précis (sweep + CHoCH) dans la zone préparée.

interface LTFExecutionDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function LTFExecutionDiagram({ className = "", locale = "fr" }: LTFExecutionDiagramProps) {
  const isEs = locale === "es";
  const L = {
    levelLabel:  isEs ? "Nivel ~1.1775" : "Niveau ~1.1775",
    localLow:    isEs ? "Mínimo local" : "Creux local",
    slLabel:     isEs ? "SL arriba del sweep" : "SL au-dessus du sweep",
    entryShort:  isEs ? "Entrada SHORT" : "Entrée SHORT",
    caption:     isEs ? "Sweep + CHoCH en la zona HTF = disparador de ejecución" : "Sweep + CHoCH dans la zone HTF = déclencheur d'exécution",
    mobTitle:    isEs ? "Ejecución M5 — sweep + CHoCH" : "Exécution M5 — sweep + CHoCH",
    mob1:        isEs ? "mecha por encima de ~1.1775 (caza de stops)." : "mèche au-dessus de ~1.1775 (chasse de stops).",
    mob2:        isEs ? "ruptura del mínimo local M5 = señal de entrada short." : "cassure du creux local M5 = signal d'entrée short.",
    mob3pre:     isEs ? "SL más allá del sweep" : "SL au-delà du sweep",
    mob3post:    isEs ? "entrada tras CHoCH." : "entrée après CHoCH.",
    legend1:     isEs ? "Sweep = mecha por encima del nivel" : "Sweep = mèche au-dessus du niveau",
    legend2:     isEs ? "CHoCH = ruptura del mínimo local" : "CHoCH = cassure du creux local",
    legend3:     isEs ? "SL más allá del sweep, entrada tras CHoCH" : "SL au-delà du sweep, entrée après CHoCH",
  };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 700 320"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden sm:block"
      >
        <rect x="20" y="20" width="80" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="60" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">M5</text>

        <line x1="40" y1="100" x2="660" y2="100" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.7" />
        <rect x="40" y="86" width="80" height="13" rx="3" fill="#09090b" />
        <text x="80" y="96" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.levelLabel}</text>

        <line x1="100" y1="180" x2="660" y2="180" stroke="#71717a" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.55" />
        <rect x="20" y="173" width="72" height="13" rx="3" fill="#09090b" />
        <text x="56" y="183" fill="#71717a" fontSize="9" fontWeight="600" textAnchor="middle">{L.localLow}</text>

        <line x1="120" y1="155" x2="120" y2="195" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="112" y="165" width="16" height="22" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        <line x1="158" y1="125" x2="158" y2="170" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="150" y="135" width="16" height="28" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        <line x1="196" y1="108" x2="196" y2="145" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="188" y="115" width="16" height="22" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        <line x1="234" y1="78" x2="234" y2="135" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="226" y="105" width="16" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
        <line x1="272" y1="110" x2="272" y2="200" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="264" y="120" width="16" height="72" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
        <line x1="310" y1="175" x2="310" y2="225" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="302" y="185" width="16" height="32" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
        <line x1="348" y1="210" x2="348" y2="255" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="340" y="220" width="16" height="28" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
        <line x1="386" y1="240" x2="386" y2="280" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="378" y="250" width="16" height="24" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

        <line x1="450" y1="78" x2="244" y2="78" stroke="#ef4444" strokeDasharray="3 2" strokeWidth="1" strokeOpacity="0.6" />
        <rect x="450" y="67" width="60" height="22" rx="10" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
        <text x="480" y="82" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">Sweep</text>

        <line x1="450" y1="200" x2="320" y2="195" stroke="#f59e0b" strokeDasharray="3 2" strokeWidth="1" strokeOpacity="0.7" />
        <rect x="450" y="189" width="60" height="22" rx="10" fill="#f59e0b22" stroke="#f59e0b" strokeWidth="1" />
        <text x="480" y="204" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">CHoCH</text>

        <line x1="420" y1="68" x2="660" y2="68" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
        <rect x="572" y="55" width="86" height="14" rx="3" fill="#09090b" />
        <text x="615" y="65" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.slLabel}</text>

        <circle cx="348" cy="215" r="6" fill="#ef4444" />
        <line x1="356" y1="215" x2="540" y2="215" stroke="#ef4444" strokeDasharray="3 2" strokeWidth="1" strokeOpacity="0.6" />
        <rect x="540" y="205" width="100" height="22" rx="10" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
        <text x="590" y="220" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">{L.entryShort}</text>

        <text x="350" y="305" fill="#a1a1aa" fontSize="10" textAnchor="middle">
          {L.caption}
        </text>
      </svg>

      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-400 mt-0.5">1</span>
            <span className="text-zinc-300"><span className="font-bold text-amber-400">Sweep</span> · {L.mob1}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">2</span>
            <span className="text-zinc-300"><span className="font-bold text-red-400">CHoCH</span> · {L.mob2}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[11px] font-bold text-emerald-400 mt-0.5">3</span>
            <span className="text-zinc-300"><span className="font-bold text-emerald-400">{L.mob3pre}</span>, {L.mob3post}</span>
          </li>
        </ul>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legend1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{L.legend2}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-600" />
          <span className="text-[10px] text-zinc-500">{L.legend3}</span>
        </div>
      </div>
    </div>
  );
}
