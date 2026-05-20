// Diagramme : le timeframe intermédiaire prépare le scénario (Leçon 3 multi-timeframe)
// EUR/USD H1 — 9 bougies haussières uniformes qui montent et viennent buter contre la bande de résistance.
// Toutes les bougies sont vertes ; l'amplitude décroît à mesure que le prix se rapproche de la zone,
// la dernière mèche atteint exactement le bord bas de la bande (1.1750) pour matérialiser le contact.

interface ScenarioZoneDiagramProps {
  className?: string;
}

// Géométrie imposée : sommets de mèche progressent de y=250 (loin de la zone) à y=90 (contact bord bas),
// body height décroît de 45 → 6 (perte d'impulsion). cx réparti uniformément de 70 à 600.
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

export function ScenarioZoneDiagram({ className = "" }: ScenarioZoneDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Bande résistance 1.1750-1.1760 — bord haut y=55, bord bas y=90 */}
        <rect x="40" y="55" width="620" height="35" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        {/* Label 1.1760 au-dessus de la bande */}
        <rect x="40" y="42" width="56" height="12" rx="3" fill="#09090b" />
        <text x="68" y="51" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1760</text>

        {/* Label 1.1750 sous la bande */}
        <rect x="40" y="92" width="56" height="12" rx="3" fill="#09090b" />
        <text x="68" y="101" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1750</text>

        {/* Label "Zone de résistance" centré dans la bande à droite */}
        <rect x="540" y="65" width="108" height="13" rx="3" fill="#09090b" />
        <text x="594" y="75" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">Zone de résistance</text>

        {/* 9 bougies haussières — corps emerald-500, mèches emerald-600. Amplitude décroissante.
            Sommet de mèche de la dernière bougie atteint y=90 (bord bas de la bande). */}
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

        {/* Annotation principale */}
        <rect x="190" y="284" width="320" height="22" rx="11" fill="#09090b" />
        <rect x="190" y="284" width="320" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          La zone prépare le scénario avant l&apos;exécution
        </text>
      </svg>

      {/* MOBILE : scénario zone tracée à l'avance ──────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">Scénario zone tracée à l'avance</p>
        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[11px] font-bold text-blue-400 mt-0.5">1</span><span className="text-zinc-300">Zone tracée <span className="font-bold">AVANT</span> l'arrivée du prix.</span></li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-400 mt-0.5">2</span><span className="text-zinc-300">Bougies haussières <span className="font-bold">rétrécissent</span> en approchant = perte d'impulsion.</span></li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">3</span><span className="text-zinc-300">Confirmation rejection = entrée short à la zone.</span></li>
        </ul>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500/40 border border-red-500" />
          <span className="text-[10px] text-zinc-500">Zone tracée AVANT l&apos;arrivée du prix</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Bougies haussières qui rétrécissent en approchant = perte d&apos;impulsion</span>
        </div>
      </div>
    </div>
  );
}
