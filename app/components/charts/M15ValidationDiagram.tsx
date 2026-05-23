// Diagramme : le M15 valide l'exécution (Leçon 5 multi-timeframe)
// EUR/USD M15 — 3 bougies haussières montent dans la zone, 3 bougies à mèches hautes rejettent,
// repère du creux local à y=150, 3 bougies bearish cassent franchement sous le creux.

interface M15ValidationDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

type CandleSpec = {
  cx: number;
  wickTop: number;
  wickBottom: number;
  bodyY: number;
  bodyH: number;
  type: "bull" | "bear";
};

const CANDLES: CandleSpec[] = [
  // 3 haussières — montée dans la zone
  { cx:  90, wickTop: 230, wickBottom: 270, bodyY: 235, bodyH: 30, type: "bull" },
  { cx: 149, wickTop: 180, wickBottom: 218, bodyY: 185, bodyH: 28, type: "bull" },
  { cx: 208, wickTop: 130, wickBottom: 165, bodyY: 134, bodyH: 26, type: "bull" },
  // 3 bougies de rejet dans la zone (sommets 58-78, mèches hautes ≥16px, mèches basses jusqu'au creux y=150)
  { cx: 266, wickTop:  58, wickBottom: 110, bodyY:  76, bodyH: 10, type: "bear" },
  { cx: 325, wickTop:  66, wickBottom: 150, bodyY:  84, bodyH: 10, type: "bear" },
  { cx: 384, wickTop:  78, wickBottom: 150, bodyY:  96, bodyH: 10, type: "bear" },
  // 3 baissières — cassent NETTEMENT sous y=150, corps sous y=180
  { cx: 443, wickTop: 140, wickBottom: 218, bodyY: 185, bodyH: 28, type: "bear" },
  { cx: 502, wickTop: 175, wickBottom: 240, bodyY: 205, bodyH: 28, type: "bear" },
  { cx: 560, wickTop: 210, wickBottom: 262, bodyY: 230, bodyH: 25, type: "bear" },
];

const BODY_W = 14;

export function M15ValidationDiagram({ className = "", locale = "fr" }: M15ValidationDiagramProps) {
  const L = locale === "es"
    ? {
        zoneH1: "Zona H1",
        creux: "valle local",
        annotation: "La reacción valida la entrada",
        mobTitle: "Validación M15 — confirmación entrada",
        mobMeches: "Mechas de rechazo en la zona",
        mobMechesDesc: "Mechas de rechazo = presión vendedora presente en la zona H1.",
        mobCassure: "Ruptura del valle local = confirmación",
        mobCassureDesc: "CHoCH en M15 → entrada short validada, SL más allá de la mecha extrema.",
        legendMeches: "Mechas de rechazo en la zona",
        legendCassure: "Ruptura del valle local = confirmación",
      }
    : {
        zoneH1: "Zone H1",
        creux: "creux local",
        annotation: "La réaction valide l'entrée",
        mobTitle: "Validation M15 — confirmation entrée",
        mobMeches: "Mèches de rejet dans la zone",
        mobMechesDesc: "Mèches de refus = pression vendeuse présente sur la zone H1.",
        mobCassure: "Cassure du creux local = confirmation",
        mobCassureDesc: "CHoCH sur M15 → entrée short validée, SL au-delà de la mèche extrême.",
        legendMeches: "Mèches de rejet dans la zone",
        legendCassure: "Cassure du creux local = confirmation",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · M15</text>

        {/* Bande zone H1 — y=50 à y=88 */}
        <rect x="60" y="50" width="560" height="38" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        {/* Label 1.1760 */}
        <rect x="60" y="36" width="56" height="13" rx="3" fill="#09090b" />
        <text x="88" y="46" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1760</text>

        {/* Label 1.1750 */}
        <rect x="60" y="92" width="56" height="13" rx="3" fill="#09090b" />
        <text x="88" y="102" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1750</text>

        {/* Label "Zone H1" dans la bande à droite */}
        <rect x="540" y="62" width="76" height="13" rx="3" fill="#09090b" />
        <text x="578" y="72" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">{L.zoneH1}</text>

        {/* Bougies */}
        {CANDLES.map(({ cx, wickTop, wickBottom, bodyY, bodyH, type }, i) => {
          const bodyFill = type === "bull" ? "#10b981" : "#ef4444";
          const wickStroke = type === "bull" ? "#059669" : "#b91c1c";
          return (
            <g key={i}>
              <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke={wickStroke} strokeWidth="1.4" strokeLinecap="round" />
              <rect x={cx - BODY_W / 2} y={bodyY} width={BODY_W} height={bodyH} fill={bodyFill} stroke={wickStroke} strokeWidth="1" rx="1" />
            </g>
          );
        })}

        {/* Repère du creux local à y=150 */}
        <line x1="340" y1="150" x2="520" y2="150" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity="0.8" />
        <rect x="370" y="134" width="76" height="13" rx="3" fill="#09090b" />
        <text x="408" y="144" fill="#71717a" fontSize="9" fontWeight="600" textAnchor="middle">{L.creux}</text>

        {/* Marqueur de cassure — point amber à l'intersection B7/creux */}
        <circle cx="443" cy="150" r="4" fill="#f59e0b" stroke="#09090b" strokeWidth="1" />

        {/* Annotation */}
        <rect x="190" y="284" width="320" height="22" rx="11" fill="#09090b" />
        <rect x="190" y="284" width="320" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {L.annotation}
        </text>
      </svg>

      {/* MOBILE : validation M15 ─────────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{L.mobMeches}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobMechesDesc}</p>
        </div>
        <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/10 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{L.mobCassure}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobCassureDesc}</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legendMeches}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{L.legendCassure}</span>
        </div>
      </div>
    </div>
  );
}
