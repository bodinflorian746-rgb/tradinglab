// Diagramme : le timeframe intermédiaire prépare le scénario (Leçon 3 multi-timeframe)
// EUR/USD H1 — 9 bougies haussières uniformes qui montent et viennent buter contre la bande de résistance.

interface ScenarioZoneDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

type CandleSpec = { cx: number; wickTop: number; bodyH: number };

const CANDLES: CandleSpec[] = [
  { cx:  70, wickTop: 250, bodyH: 45 },
  { cx: 136, wickTop: 230, bodyH: 40 },
  { cx: 202, wickTop: 210, bodyH: 35 },
  { cx: 269, wickTop: 190, bodyH: 30 },
  { cx: 335, wickTop: 170, bodyH: 25 },
  { cx: 401, wickTop: 150, bodyH: 21 },
  { cx: 468, wickTop: 130, bodyH: 16 },
  { cx: 534, wickTop: 110, bodyH: 11 },
  { cx: 600, wickTop:  90, bodyH:  6 },
];

const WICK_EXT = 3;
const BODY_W = 14;

export function ScenarioZoneDiagram({ className = "", locale = "fr" }: ScenarioZoneDiagramProps) {
  const isEs = locale === "es";
  const L = {
    zoneRes:       isEs ? "Zona de resistencia" : "Zone de résistance",
    annot:         isEs ? "La zona prepara el escenario antes de la ejecución" : "La zone prépare le scénario avant l'exécution",
    mobTitle:      isEs ? "Escenario zona trazada con anticipación" : "Scénario zone tracée à l'avance",
    mob1A:         isEs ? "Zona trazada" : "Zone tracée",
    mob1B:         isEs ? "ANTES" : "AVANT",
    mob1C:         isEs ? "de la llegada del precio." : "l'arrivée du prix.",
    mob2A:         isEs ? "Las velas alcistas" : "Bougies haussières",
    mob2B:         isEs ? "se reducen" : "rétrécissent",
    mob2C:         isEs ? "al acercarse = pérdida de impulso." : "en approchant = perte d'impulsion.",
    mob3:          isEs ? "Confirmación rejection = entrada short en la zona." : "Confirmation rejection = entrée short à la zone.",
    legend1:       isEs ? "Zona trazada ANTES de la llegada del precio" : "Zone tracée AVANT l'arrivée du prix",
    legend2:       isEs ? "Velas alcistas que se reducen al acercarse = pérdida de impulso" : "Bougies haussières qui rétrécissent en approchant = perte d'impulsion",
  };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        <rect x="40" y="55" width="620" height="35" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        <rect x="40" y="42" width="56" height="12" rx="3" fill="#09090b" />
        <text x="68" y="51" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1760</text>

        <rect x="40" y="92" width="56" height="12" rx="3" fill="#09090b" />
        <text x="68" y="101" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1750</text>

        <rect x="540" y="65" width="108" height="13" rx="3" fill="#09090b" />
        <text x="594" y="75" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">{L.zoneRes}</text>

        {CANDLES.map(({ cx, wickTop, bodyH }, i) => {
          const closeY = wickTop + WICK_EXT;
          const openY = closeY + bodyH;
          const wickBottom = openY + WICK_EXT;
          return (
            <g key={i}>
              <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
              <rect x={cx - BODY_W / 2} y={closeY} width={BODY_W} height={bodyH} fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
            </g>
          );
        })}

        <rect x="190" y="284" width="320" height="22" rx="11" fill="#09090b" />
        <rect x="190" y="284" width="320" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {L.annot}
        </text>
      </svg>

      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>

        {/* Mini-SVG : zone + 2 scénarios (rebond emerald / cassure red) */}
        <svg viewBox="0 0 280 120" className="w-full h-auto" aria-label="Zone et 2 scenarios" fill="none">
          {/* Zone S/R */}
          <rect x="20" y="58" width="240" height="18" fill="#60a5fa15" stroke="#60a5fa55" strokeWidth="1" strokeDasharray="3 2" />
          <rect x="100" y="40" width="80" height="13" rx="2" fill="#60a5fa18" stroke="#60a5fa55" strokeWidth="0.7" />
          <text x="140" y="49" fontSize="9" fill="#60a5fa" textAnchor="middle" fontWeight="700">Zone clé</text>
          {/* Approche commune */}
          <path d="M25,30 L55,45 L85,60 L115,68" stroke="#71717a" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
          {/* Scénario 1 — rebond emerald */}
          <path d="M115,68 L135,50 L160,30 L185,15" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="185" cy="15" r="3" fill="#10b981" />
          <text x="178" y="32" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">Rebond ↑</text>
          {/* Scénario 2 — cassure red */}
          <path d="M115,68 L140,82 L165,95 L195,108 L225,115" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="225" cy="115" r="3" fill="#ef4444" />
          <text x="225" y="105" fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="700">Cassure ↓</text>
        </svg>

        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[11px] font-bold text-blue-400 mt-0.5">1</span><span className="text-zinc-300">{L.mob1A} <span className="font-bold">{L.mob1B}</span> {L.mob1C}</span></li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-400 mt-0.5">2</span><span className="text-zinc-300">{L.mob2A} <span className="font-bold">{L.mob2B}</span> {L.mob2C}</span></li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">3</span><span className="text-zinc-300">{L.mob3}</span></li>
        </ul>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500/40 border border-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legend1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{L.legend2}</span>
        </div>
      </div>
    </div>
  );
}
