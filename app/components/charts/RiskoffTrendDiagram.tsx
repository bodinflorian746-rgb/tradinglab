// Diagramme : trader dans le sens du régime (Leçon 3 Macro Trading)
// XAU/USD H4 — tendance haussière HH/HL : impulsion 4 610 → 4 690, pullback vers 4 655,
// stabilisation, nouvelle impulsion 4 655 → 4 730.

interface RiskoffTrendDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

type CandleSpec = {
  cx: number;
  wickTop: number;
  bodyY: number;
  bodyH: number;
  wickBottom: number;
  type: "bull" | "bear";
};

// Continuité prix. 4 730 $ ≈ y=50, 4 690 $ ≈ y=110, 4 655 $ ≈ y=160, 4 610 $ ≈ y=220.
// 14 bougies espacées régulièrement de x=50 à x=620.
const CANDLES: CandleSpec[] = [
  // Approche basse
  { cx:  50, wickTop: 218, bodyY: 220, bodyH: 15, wickBottom: 245, type: "bull" }, // open 235 close 220
  // Première impulsion bullish — 4 grandes bougies vertes vers y=110 (4 690)
  { cx:  94, wickTop: 198, bodyY: 200, bodyH: 20, wickBottom: 232, type: "bull" }, // open 220 close 200
  { cx: 138, wickTop: 173, bodyY: 175, bodyH: 25, wickBottom: 210, type: "bull" }, // open 200 close 175
  { cx: 182, wickTop: 143, bodyY: 145, bodyH: 30, wickBottom: 185, type: "bull" }, // open 175 close 145
  { cx: 226, wickTop: 105, bodyY: 110, bodyH: 35, wickBottom: 155, type: "bull" }, // open 145 close 110 (~4 690)

  // Pullback contrôlé H4 vers y=160 (4 655)
  { cx: 270, wickTop: 108, bodyY: 110, bodyH: 25, wickBottom: 145, type: "bear" }, // open 110 close 135
  { cx: 314, wickTop: 133, bodyY: 135, bodyH: 23, wickBottom: 168, type: "bear" }, // open 135 close 158

  // Stabilisation autour de 4 655
  { cx: 358, wickTop: 150, bodyY: 152, bodyH:  6, wickBottom: 168, type: "bull" }, // open 158 close 152
  { cx: 402, wickTop: 150, bodyY: 152, bodyH:  8, wickBottom: 170, type: "bear" }, // open 152 close 160

  // Nouvelle impulsion bullish — vers y=50 (4 730)
  { cx: 446, wickTop: 130, bodyY: 132, bodyH: 28, wickBottom: 168, type: "bull" }, // open 160 close 132
  { cx: 490, wickTop: 100, bodyY: 102, bodyH: 30, wickBottom: 138, type: "bull" }, // open 132 close 102
  { cx: 534, wickTop:  70, bodyY:  72, bodyH: 30, wickBottom: 108, type: "bull" }, // open 102 close 72
  { cx: 578, wickTop:  50, bodyY:  52, bodyH: 20, wickBottom:  78, type: "bull" }, // open 72 close 52 (~4 730)
  { cx: 620, wickTop:  44, bodyY:  48, bodyH:  4, wickBottom:  58, type: "bull" }, // open 52 close 48
];

const BODY_W = 12;

export function RiskoffTrendDiagram({ className = "", locale = "fr" }: RiskoffTrendDiagramProps) {
  const t = locale === "es"
    ? {
        pullback: "Pullback",
        continuationRegime: "Continuación del régimen",
        annotation: "Tradear en el sentido del régimen, no contra",
        mobileTitle: "Risk-off trend · XAU/USD H4",
        structureTitle: "Estructura HH/HL = régimen intacto",
        structureDesc: "El oro hace cimas y suelos sucesivos más altos → régimen risk-off activo.",
        pullbackTitle: "Pullback limitado + continuación",
        pullbackDesc: "Correcciones cortas luego reanudación bullish — entradas en pullbacks.",
        legendStructure: "Estructura HH/HL = régimen intacto",
        legendPullback: "Pullback limitado luego continuación bullish",
      }
    : {
        pullback: "Pullback",
        continuationRegime: "Continuation du régime",
        annotation: "Trader dans le sens du régime, pas contre",
        mobileTitle: "Risk-off trend · XAU/USD H4",
        structureTitle: "Structure HH/HL = régime intact",
        structureDesc: "L'or fait des sommets et creux successifs plus hauts → régime risk-off actif.",
        pullbackTitle: "Pullback limité + continuation",
        pullbackDesc: "Corrections courtes puis reprise bullish — entrées sur pullbacks.",
        legendStructure: "Structure HH/HL = régime intact",
        legendPullback: "Pullback limité puis continuation bullish",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · H4</text>

        {/* Bougies */}
        {CANDLES.map(({ cx, wickTop, bodyY, bodyH, wickBottom, type }, i) => {
          const bodyFill = type === "bull" ? "#10b981" : "#ef4444";
          const wickStroke = type === "bull" ? "#059669" : "#b91c1c";
          return (
            <g key={i}>
              <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke={wickStroke} strokeWidth="1.4" strokeLinecap="round" />
              <rect x={cx - BODY_W / 2} y={bodyY} width={BODY_W} height={bodyH} fill={bodyFill} stroke={wickStroke} strokeWidth="1" rx="1" />
            </g>
          );
        })}

        {/* Label "4 610 $" — départ */}
        <rect x="6" y="226" width="58" height="13" rx="3" fill="#09090b" />
        <text x="35" y="236" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 610 $</text>

        {/* Label "4 690 $" — premier sommet */}
        <rect x="206" y="94" width="58" height="13" rx="3" fill="#09090b" />
        <text x="235" y="104" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 690 $</text>

        {/* Label "4 655 $" — palier stabilisation */}
        <rect x="356" y="174" width="58" height="13" rx="3" fill="#09090b" />
        <text x="385" y="184" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 655 $</text>

        {/* Label "4 730 $" — nouveau sommet */}
        <rect x="552" y="34" width="58" height="13" rx="3" fill="#09090b" />
        <text x="581" y="44" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">4 730 $</text>

        {/* Annotation "Pullback" — sur la correction */}
        <line x1="290" y1="118" x2="290" y2="135" stroke="#71717a" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="262" y="104" width="58" height="14" rx="3" fill="#09090b" />
        <text x="291" y="114" fill="#71717a" fontSize="9" fontWeight="700" textAnchor="middle">{t.pullback}</text>

        {/* Annotation "Continuation du régime" — sur la reprise */}
        <rect x="440" y="200" width="148" height="14" rx="3" fill="#09090b" />
        <rect x="440" y="200" width="148" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="514" y="210" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">{t.continuationRegime}</text>

        {/* Annotation amber */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {t.annotation}
        </text>
      </svg>

      {/* MOBILE : Risk-off trend ──────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{t.structureTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.structureDesc}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{t.pullbackTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.pullbackDesc}</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{t.legendStructure}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{t.legendPullback}</span>
        </div>
      </div>
    </div>
  );
}
