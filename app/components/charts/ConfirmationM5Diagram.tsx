// Diagramme : confirmation M5 dans la zone (Leçon 4 multi-timeframe)
// EUR/USD M5 — 4 bougies haussières montent vers la zone H1, 3 bougies à mèches hautes rejettent
// dans la bande, puis 3 bougies baissières cassent le creux local = confirmation d'exécution.

interface ConfirmationM5DiagramProps {
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
  // 4 haussières — montée vers la zone (sommets 230 → 110)
  { cx:  90, wickTop: 230, wickBottom: 263, bodyY: 234, bodyH: 24, type: "bull" },
  { cx: 142, wickTop: 190, wickBottom: 223, bodyY: 194, bodyH: 24, type: "bull" },
  { cx: 194, wickTop: 150, wickBottom: 183, bodyY: 154, bodyH: 24, type: "bull" },
  { cx: 246, wickTop: 110, wickBottom: 143, bodyY: 114, bodyH: 24, type: "bull" },
  // 3 bougies de rejet dans la zone (sommets 60-72, mèches hautes ≥16px, mèches basses jusqu'au creux y=155)
  { cx: 298, wickTop:  60, wickBottom: 110, bodyY:  78, bodyH: 10, type: "bear" },
  { cx: 350, wickTop:  66, wickBottom: 155, bodyY:  84, bodyH: 10, type: "bear" },
  { cx: 402, wickTop:  72, wickBottom: 155, bodyY:  90, bodyH: 10, type: "bear" },
  // 3 baissières qui cassent le creux local y=155 — corps clairement sous y=180
  { cx: 454, wickTop: 148, wickBottom: 213, bodyY: 180, bodyH: 28, type: "bear" },
  { cx: 506, wickTop: 180, wickBottom: 243, bodyY: 210, bodyH: 28, type: "bear" },
  { cx: 558, wickTop: 210, wickBottom: 262, bodyY: 235, bodyH: 22, type: "bear" },
];

const BODY_W = 14;

export function ConfirmationM5Diagram({ className = "", locale = "fr" }: ConfirmationM5DiagramProps) {
  const L = locale === "es"
    ? {
        zoneH1: "Zona H1",
        creux: "valle local",
        annotation: "La reacción confirma la zona",
        mobTitle: "Confirmación M5 — disparador LTF",
        mobMeches: "Mechas de rechazo en la zona",
        mobMechesDesc: "El precio entra en la zona y hace mechas de rechazo — señal de presión.",
        mobCassure: "Ruptura del valle local = confirmación",
        mobCassureDesc: "CHoCH en M5 valida la entrada short con SL más allá de la mecha extrema.",
        legendMeches: "Mechas de rechazo en la zona",
        legendCassure: "Ruptura del valle local = confirmación",
      }
    : {
        zoneH1: "Zone H1",
        creux: "creux local",
        annotation: "La réaction confirme la zone",
        mobTitle: "Confirmation M5 — déclencheur LTF",
        mobMeches: "Mèches de rejet dans la zone",
        mobMechesDesc: "Le prix entre dans la zone et fait des mèches de refus — signal de pression.",
        mobCassure: "Cassure du creux local = confirmation",
        mobCassureDesc: "CHoCH sur M5 valide l'entrée short avec SL au-delà de la mèche extrême.",
        legendMeches: "Mèches de rejet dans la zone",
        legendCassure: "Cassure du creux local = confirmation",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · M5</text>

        {/* Bande zone H1 résistance — y=50 à y=88 */}
        <rect x="60" y="50" width="580" height="38" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        {/* Label 1.1760 haut */}
        <rect x="60" y="36" width="56" height="13" rx="3" fill="#09090b" />
        <text x="88" y="46" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1760</text>

        {/* Label 1.1750 bas */}
        <rect x="60" y="92" width="56" height="13" rx="3" fill="#09090b" />
        <text x="88" y="102" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1750</text>

        {/* Label "Zone H1" dans la bande à droite */}
        <rect x="556" y="62" width="80" height="13" rx="3" fill="#09090b" />
        <text x="596" y="72" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">{L.zoneH1}</text>

        {/* Bougies — aucune ligne reliante */}
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

        {/* Repère du creux local à y=155 — étendu jusqu'à x=520 pour traverser le point de cassure */}
        <line x1="340" y1="155" x2="520" y2="155" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity="0.8" />
        <rect x="370" y="138" width="76" height="13" rx="3" fill="#09090b" />
        <text x="408" y="148" fill="#71717a" fontSize="9" fontWeight="600" textAnchor="middle">{L.creux}</text>

        {/* Marqueur de cassure — petit point amber à l'intersection B8/creux */}
        <circle cx="454" cy="155" r="4" fill="#f59e0b" stroke="#09090b" strokeWidth="1" />

        {/* Annotation */}
        <rect x="190" y="284" width="320" height="22" rx="11" fill="#09090b" />
        <rect x="190" y="284" width="320" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {L.annotation}
        </text>
      </svg>

      {/* MOBILE : confirmation M5 ──────────────────────────── */}
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
