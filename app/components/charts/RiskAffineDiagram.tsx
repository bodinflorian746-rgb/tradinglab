// Diagramme : le LTF affine le risque (Leçon 4 multi-timeframe)
// EUR/USD — graphique à gauche (x=60-470), accolades de comparaison à droite (x=500-660).
// Même entrée, deux niveaux de SL (H4 large vs M5 serré) — aucune mention d'argent, uniquement pts/prix.

interface RiskAffineDiagramProps {
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

// 6 bougies dans x=110-420 : 3 haussières montent dans la bande, 3 baissières rejettent en dessous
const CANDLES: CandleSpec[] = [
  { cx: 110, wickTop: 150, wickBottom: 183, bodyY: 156, bodyH: 22, type: "bull" },
  { cx: 172, wickTop: 120, wickBottom: 150, bodyY: 125, bodyH: 20, type: "bull" },
  { cx: 234, wickTop:  85, wickBottom: 108, bodyY:  88, bodyH: 16, type: "bull" },
  { cx: 296, wickTop:  75, wickBottom: 135, bodyY:  92, bodyH: 38, type: "bear" },
  { cx: 358, wickTop: 125, wickBottom: 167, bodyY: 132, bodyH: 30, type: "bear" },
  { cx: 420, wickTop: 155, wickBottom: 197, bodyY: 164, bodyH: 28, type: "bear" },
];

const BODY_W = 14;

export function RiskAffineDiagram({ className = "", locale = "fr" }: RiskAffineDiagramProps) {
  const isEs = locale === "es";
  const L = {
    slH4:        isEs ? "SL H4 · 1.1790 · 35 pts" : "SL H4 · 1.1790 · 35 pts",
    slM5:        isEs ? "SL M5 · 1.1772 · 14 pts" : "SL M5 · 1.1772 · 14 pts",
    entry:       isEs ? "Entrada 1.1758" : "Entrée 1.1758",
    annot:       isEs ? "Misma idea. Riesgo diferente." : "Même idée. Risque différent.",
    mobTitle:    isEs ? "Afinar el riesgo: H4 → M5" : "Affiner le risque : H4 → M5",
    mobSlH4T:    isEs ? "SL H4 amplio — riesgo no optimizado" : "SL H4 large — risque non optimisé",
    mobSlH4D:    isEs ? "SL más allá de la mecha H4 = pérdida potencial amplia, tamaño de posición pequeño." : "SL au-delà de la mèche H4 = perte potentielle large, taille position petite.",
    mobSlM5T:    isEs ? "SL M5 reducido tras confirmación LTF" : "SL M5 réduit après confirmation LTF",
    mobSlM5D:    isEs ? "Una vez CHoCH M5 confirmado → SL mucho más ajustado, R/R mejorado." : "Une fois CHoCH M5 confirmé → SL beaucoup plus serré, R/R amélioré.",
    mobFooter:   isEs ? "Entrada común, SL adaptado al timing LTF = R/R maximizado." : "Entrée commune, SL adapté au timing LTF = R/R maximisé.",
    legendH4:    isEs ? "SL H4 amplio — riesgo no optimizado" : "SL H4 large — risque non optimisé",
    legendM5:    isEs ? "SL M5 reducido tras confirmación LTF" : "SL M5 réduit après confirmation LTF",
    legendEntry: isEs ? "Entrada común a los dos escenarios" : "Entrée commune aux deux scénarios",
  };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="100" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="70" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD</text>

        {/* Bande de résistance — y=70 à y=100, x=60 à x=470 */}
        <rect x="60" y="70" width="410" height="30" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        {/* Label 1.1760 au-dessus de la bande (gauche, hors zone des accolades) */}
        <rect x="60" y="54" width="56" height="13" rx="3" fill="#09090b" />
        <text x="88" y="64" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1760</text>

        {/* Label 1.1750 sous la bande */}
        <rect x="60" y="103" width="56" height="13" rx="3" fill="#09090b" />
        <text x="88" y="113" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1750</text>

        {/* Ligne SL H4 large — y=38, bien au-dessus de la bande */}
        <line x1="60" y1="38" x2="470" y2="38" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="5 3" />
        <rect x="326" y="31" width="144" height="14" rx="3" fill="#09090b" />
        <text x="398" y="42" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.slH4}</text>

        {/* Ligne SL M5 serré — y=92, dans la bande, halo opaque pour lisibilité */}
        <line x1="60" y1="92" x2="470" y2="92" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="5 3" />
        <rect x="326" y="85" width="144" height="14" rx="3" fill="#09090b" />
        <text x="398" y="96" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.slM5}</text>

        {/* Ligne d'entrée — y=115, juste sous la bande, blue plein */}
        <line x1="60" y1="115" x2="470" y2="115" stroke="#60a5fa" strokeWidth="1.4" strokeDasharray="3 2" />
        <rect x="378" y="119" width="92" height="14" rx="3" fill="#09090b" />
        <text x="424" y="130" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="middle">{L.entry}</text>

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

        {/* ═══ ZONE ACCOLADES (x=500 à x=660) — RIEN d'autre ici ═══ */}

        {/* Accolade LONGUE : SL H4 (y=38) → Entrée (y=115), x=520 */}
        <line x1="520" y1="38" x2="520" y2="115" stroke="#71717a" strokeWidth="1.4" />
        <line x1="514" y1="38" x2="526" y2="38" stroke="#71717a" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="514" y1="115" x2="526" y2="115" stroke="#71717a" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="536" y="69" width="44" height="14" rx="3" fill="#09090b" />
        <text x="558" y="80" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">35 pts</text>

        {/* Accolade COURTE : SL M5 (y=92) → Entrée (y=115), x=600 */}
        <line x1="600" y1="92" x2="600" y2="115" stroke="#71717a" strokeWidth="1.4" />
        <line x1="594" y1="92" x2="606" y2="92" stroke="#71717a" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="594" y1="115" x2="606" y2="115" stroke="#71717a" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="616" y="96" width="44" height="14" rx="3" fill="#09090b" />
        <text x="638" y="107" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">14 pts</text>

        {/* Annotation */}
        <rect x="190" y="262" width="320" height="22" rx="11" fill="#09090b" />
        <rect x="190" y="262" width="320" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="276" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {L.annot}
        </text>
      </svg>

      {/* MOBILE : risque affiné ──────────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
        <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
          <p className="text-[13px] font-bold text-amber-400">{L.mobSlH4T}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobSlH4D}</p>
        </div>
        <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{L.mobSlM5T}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobSlM5D}</p>
        </div>
        <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
          {L.mobFooter}
        </p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legendH4}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legendM5}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400" />
          <span className="text-[10px] text-zinc-500">{L.legendEntry}</span>
        </div>
      </div>
    </div>
  );
}
