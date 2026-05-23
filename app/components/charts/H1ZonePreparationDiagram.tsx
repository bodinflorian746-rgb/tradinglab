// Diagramme : le H1 prépare la zone (Leçon 5 multi-timeframe)
// EUR/USD H1 — bande FVG bearish (1.1750-1.1760), 8 bougies haussières d'amplitude décroissante
// qui montent vers la zone et ralentissent à son approche.

interface H1ZonePreparationDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

type CandleSpec = {
  cx: number;
  wickTop: number;
  bodyY: number;
  bodyH: number;
  wickBottom: number;
};

const CANDLES: CandleSpec[] = [
  // Amplitude des corps décroissante (36 → 8), sommets qui montent de y=235 vers y=93 (bord bas de la bande)
  { cx:  90, wickTop: 235, bodyY: 238, bodyH: 36, wickBottom: 277 },
  { cx: 157, wickTop: 215, bodyY: 218, bodyH: 32, wickBottom: 253 },
  { cx: 224, wickTop: 194, bodyY: 197, bodyH: 28, wickBottom: 228 },
  { cx: 291, wickTop: 174, bodyY: 177, bodyH: 24, wickBottom: 204 },
  { cx: 358, wickTop: 154, bodyY: 157, bodyH: 20, wickBottom: 180 },
  { cx: 425, wickTop: 134, bodyY: 137, bodyH: 16, wickBottom: 156 },
  { cx: 492, wickTop: 114, bodyY: 117, bodyH: 12, wickBottom: 132 },
  { cx: 560, wickTop:  93, bodyY:  96, bodyH:  8, wickBottom: 107 },
];

const BODY_W = 14;

export function H1ZonePreparationDiagram({ className = "", locale = "fr" }: H1ZonePreparationDiagramProps) {
  const L = locale === "es"
    ? {
        fvgBearish: "FVG bearish",
        annotation: "La zona prepara el escenario",
        mobTitle: "Preparación zona H1",
        mobZoneTitle: "Zona trazada por adelantado",
        mobZoneDesc: "FVG bearish + resistencia H1 = zona de interés preparada antes de la llegada del precio.",
        mobBougiesTitle: "Velas que se acortan",
        mobBougiesDesc: "Velas cada vez más cortas al acercarse = precio que se ralentiza → preparación a un giro.",
        legendZone: "Zona trazada por adelantado — FVG bearish + resistencia",
        legendBougies: "Velas cada vez más cortas = precio que se ralentiza al acercarse",
      }
    : {
        fvgBearish: "FVG bearish",
        annotation: "La zone prépare le scénario",
        mobTitle: "Préparation zone H1",
        mobZoneTitle: "Zone tracée à l'avance",
        mobZoneDesc: "FVG bearish + résistance H1 = zone d'intérêt préparée avant l'arrivée du prix.",
        mobBougiesTitle: "Bougies qui raccourcissent",
        mobBougiesDesc: "Bougies de plus en plus courtes en approchant = prix qui ralentit → préparation à un retournement.",
        legendZone: "Zone tracée à l'avance — FVG bearish + résistance",
        legendBougies: "Bougies de plus en plus courtes = prix qui ralentit en approchant",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Bande FVG / résistance — y=55 à y=92 */}
        <rect x="60" y="55" width="560" height="37" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        {/* Label 1.1760 */}
        <rect x="60" y="42" width="56" height="12" rx="3" fill="#09090b" />
        <text x="88" y="51" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1760</text>

        {/* Label 1.1750 */}
        <rect x="60" y="94" width="56" height="12" rx="3" fill="#09090b" />
        <text x="88" y="103" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1750</text>

        {/* Label FVG bearish dans la bande à droite */}
        <rect x="520" y="65" width="92" height="13" rx="3" fill="#09090b" />
        <text x="566" y="75" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">{L.fvgBearish}</text>

        {/* Bougies haussières — amplitude décroissante = ralentissement */}
        {CANDLES.map(({ cx, wickTop, bodyY, bodyH, wickBottom }, i) => (
          <g key={i}>
            <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
            <rect x={cx - BODY_W / 2} y={bodyY} width={BODY_W} height={bodyH} fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
          </g>
        ))}

        {/* Annotation */}
        <rect x="190" y="280" width="320" height="22" rx="11" fill="#09090b" />
        <rect x="190" y="280" width="320" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="294" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {L.annotation}
        </text>
      </svg>

      {/* MOBILE : préparation zone H1 ──────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
        <div className="rounded-lg border border-blue-400/40 bg-blue-500/8 p-3">
          <p className="text-[13px] font-bold text-blue-400">{L.mobZoneTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobZoneDesc}</p>
        </div>
        <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
          <p className="text-[13px] font-bold text-amber-400">{L.mobBougiesTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobBougiesDesc}</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500/40 border border-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legendZone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{L.legendBougies}</span>
        </div>
      </div>
    </div>
  );
}
