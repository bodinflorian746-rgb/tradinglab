// Diagramme : stabilisation post-NFP (Leçon 2 Macro Trading)
// XAU/USD M15 — impulsion bearish 4 640 → 4 575 $, série de bougies à longues mèches basses
// autour de 4 580-4 585 $, puis reprise bullish vers 4 630 $.

interface NFPStabilizationDiagramProps {
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

// 14 bougies, espacement régulier ~42 px de x=70 à x=616.
// Continuité prix : open de chaque bougie = close de la précédente.
// 4 640 $ ≈ y=70, 4 630 $ ≈ y=90, 4 585 $ ≈ y=185, 4 580 $ ≈ y=190, 4 575 $ ≈ y=200.
const CANDLES: CandleSpec[] = [
  // Pré-NFP stable autour de y=70-80
  { cx:  70, wickTop:  64, bodyY:  70, bodyH: 10, wickBottom:  85, type: "bull" }, // open 80 close 70
  { cx: 112, wickTop:  64, bodyY:  70, bodyH: 10, wickBottom:  85, type: "bear" }, // open 70 close 80

  // Impulsion bearish — 3 grandes bougies rouges 80 → 195
  { cx: 154, wickTop:  76, bodyY:  80, bodyH: 40, wickBottom: 128, type: "bear" }, // open 80 close 120
  { cx: 196, wickTop: 116, bodyY: 120, bodyH: 40, wickBottom: 168, type: "bear" }, // open 120 close 160
  { cx: 238, wickTop: 156, bodyY: 160, bodyH: 35, wickBottom: 205, type: "bear" }, // open 160 close 195

  // Stabilisation autour de 4 580-4 585 $ — corps serrés, longues mèches basses jusqu'à 4 575 $
  { cx: 280, wickTop: 181, bodyY: 185, bodyH: 10, wickBottom: 215, type: "bull" }, // open 195 close 185 — mèche basse longue
  { cx: 322, wickTop: 181, bodyY: 185, bodyH: 10, wickBottom: 215, type: "bear" }, // open 185 close 195 — mèche basse longue
  { cx: 364, wickTop: 179, bodyY: 183, bodyH: 12, wickBottom: 212, type: "bull" }, // open 195 close 183 — mèche basse longue
  { cx: 406, wickTop: 179, bodyY: 183, bodyH:  9, wickBottom: 210, type: "bear" }, // open 183 close 192 — mèche basse longue
  { cx: 448, wickTop: 174, bodyY: 178, bodyH: 14, wickBottom: 200, type: "bull" }, // open 192 close 178 — sortie haut de la zone

  // Reprise bullish progressive vers y=90 (4 630 $)
  { cx: 490, wickTop: 146, bodyY: 150, bodyH: 28, wickBottom: 185, type: "bull" }, // open 178 close 150
  { cx: 532, wickTop: 146, bodyY: 150, bodyH:  8, wickBottom: 165, type: "bear" }, // open 150 close 158 — petit reverse
  { cx: 574, wickTop: 121, bodyY: 125, bodyH: 33, wickBottom: 165, type: "bull" }, // open 158 close 125
  { cx: 616, wickTop:  86, bodyY:  90, bodyH: 35, wickBottom: 132, type: "bull" }, // open 125 close 90 (~4 630)
];

const BODY_W = 12;

export function NFPStabilizationDiagram({ className = "", locale = "fr" }: NFPStabilizationDiagramProps) {
  const t = locale === "es"
    ? {
        annotation: "La volatilidad disminuye antes de la reversión",
        mobileTitle: "NFP estabilización · XAU/USD M15",
        mecheTitle: "Mechas bajas repetidas",
        mecheDesc: "Absorción compradora en el nivel alcanzado — fin de la caída.",
        repriseTitle: "Reanudación bullish progresiva",
        repriseDesc: "Tras estabilización, el mercado rebota lentamente = oportunidad long contra-trend.",
        legendMeche: "Mechas bajas repetidas = absorción compradora",
        legendReprise: "Reanudación bullish progresiva tras estabilización",
      }
    : {
        annotation: "La volatilité ralentit avant le retournement",
        mobileTitle: "NFP stabilisation · XAU/USD M15",
        mecheTitle: "Mèches basses répétées",
        mecheDesc: "Absorption acheteuse au niveau atteint — fin de la chute.",
        repriseTitle: "Reprise bullish progressive",
        repriseDesc: "Après stabilisation, le marché rebondit lentement = opportunité long contre-trend.",
        legendMeche: "Mèches basses répétées = absorption acheteuse",
        legendReprise: "Reprise bullish progressive après stabilisation",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Zone de stabilisation — englobe c6 à c10 (corps autour de 4 580-4 585) */}
        <rect x="262" y="178" width="204" height="40" fill="#27272a40" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.85" />

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

        {/* Label "4 640 $" — départ */}
        <rect x="6" y="54" width="58" height="13" rx="3" fill="#09090b" />
        <text x="35" y="64" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 640 $</text>

        {/* Label "4 580-4 585 $" — au-dessus de la zone de stabilisation */}
        <rect x="304" y="160" width="120" height="14" rx="3" fill="#09090b" />
        <text x="364" y="170" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 580-4 585 $</text>

        {/* Label "4 630 $" — fin de la reprise */}
        <rect x="586" y="74" width="58" height="13" rx="3" fill="#09090b" />
        <text x="615" y="84" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">4 630 $</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {t.annotation}
        </text>
      </svg>

      {/* MOBILE : NFP stabilisation ─────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
          <p className="text-[13px] font-bold text-amber-400">{t.mecheTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.mecheDesc}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{t.repriseTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.repriseDesc}</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">{t.legendMeche}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{t.legendReprise}</span>
        </div>
      </div>
    </div>
  );
}
