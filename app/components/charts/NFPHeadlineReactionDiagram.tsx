// Diagramme : réaction headline NFP (Leçon 2 Macro Trading)
// XAU/USD M15 — prix stable 4 640 $, grande bougie NFP bearish jusqu'à 4 575 $ cassant
// le support, stabilisation 4 580-4 585 $, puis retour progressif vers 4 625 $.

interface NFPHeadlineReactionDiagramProps {
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

// Continuité : open = close de la précédente.
// 4 640 $ ≈ y=70, 4 625 $ ≈ y=100, support 4 600 $ ≈ y=150, 4 585 $ ≈ y=180, 4 575 $ ≈ y=200.
const CANDLES: CandleSpec[] = [
  // Pré-NFP — stable autour de y=70-82
  { cx:  50, wickTop:  64, bodyY:  70, bodyH: 18, wickBottom:  92, type: "bull" }, // close 70
  { cx:  88, wickTop:  64, bodyY:  70, bodyH: 12, wickBottom:  88, type: "bear" }, // open 70 close 82
  { cx: 126, wickTop:  64, bodyY:  68, bodyH: 14, wickBottom:  88, type: "bull" }, // open 82 close 68
  { cx: 164, wickTop:  64, bodyY:  68, bodyH: 10, wickBottom:  86, type: "bear" }, // open 68 close 78

  // GRANDE bougie NFP bearish — chute massive 78 → 200
  { cx: 208, wickTop:  72, bodyY:  78, bodyH: 122, wickBottom: 210, type: "bear" }, // open 78 close 200

  // Stabilisation autour de y=180-200 (4 580-4 585 $)
  { cx: 250, wickTop: 178, bodyY: 185, bodyH: 15, wickBottom: 208, type: "bull" }, // open 200 close 185
  { cx: 285, wickTop: 180, bodyY: 185, bodyH: 10, wickBottom: 205, type: "bear" }, // open 185 close 195
  { cx: 320, wickTop: 178, bodyY: 182, bodyH: 13, wickBottom: 205, type: "bull" }, // open 195 close 182
  { cx: 355, wickTop: 178, bodyY: 182, bodyH: 11, wickBottom: 205, type: "bear" }, // open 182 close 193

  // Retour progressif vers y=100 (4 625 $)
  { cx: 395, wickTop: 166, bodyY: 170, bodyH: 23, wickBottom: 200, type: "bull" }, // open 193 close 170
  { cx: 435, wickTop: 142, bodyY: 145, bodyH: 25, wickBottom: 178, type: "bull" }, // open 170 close 145
  { cx: 475, wickTop: 142, bodyY: 145, bodyH:  7, wickBottom: 160, type: "bear" }, // open 145 close 152
  { cx: 515, wickTop: 120, bodyY: 125, bodyH: 27, wickBottom: 160, type: "bull" }, // open 152 close 125
  { cx: 555, wickTop: 100, bodyY: 105, bodyH: 20, wickBottom: 132, type: "bull" }, // open 125 close 105 (~4 625)
];

const BODY_W = 12;

export function NFPHeadlineReactionDiagram({ className = "", locale = "fr" }: NFPHeadlineReactionDiagramProps) {
  const t = locale === "es"
    ? {
        support: "Soporte 4 600 $",
        avantNfp: "4 640 $ — antes NFP",
        reactionHeadline: "Reacción headline",
        reevaluation: "Reevaluación del mercado",
        mobileTitle: "NFP reacción headline · XAU/USD M15",
        mobileExcess: "Reacción excesiva en el headline",
        mobileExcessDesc: "Movimiento violento inmediato → ruptura del soporte en pocos minutos.",
        mobileReeval: "Reevaluación tras estabilización",
        mobileReevalDesc: "El mercado digiere los sub-datos y revisa el movimiento inicial.",
        legendHeadline: "Reacción headline excesiva, ruptura del soporte",
        legendReeval: "Reevaluación del mercado tras estabilización",
      }
    : {
        support: "Support 4 600 $",
        avantNfp: "4 640 $ — avant NFP",
        reactionHeadline: "Réaction headline",
        reevaluation: "Réévaluation du marché",
        mobileTitle: "NFP réaction headline · XAU/USD M15",
        mobileExcess: "Réaction excessive sur le headline",
        mobileExcessDesc: "Mouvement violent immédiat → casse du support en quelques minutes.",
        mobileReeval: "Réévaluation après stabilisation",
        mobileReevalDesc: "Le marché digère les sous-données et révise le mouvement initial.",
        legendHeadline: "Réaction headline excessive, casse du support",
        legendReeval: "Réévaluation du marché après stabilisation",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Ligne de support 4 600 $ — cassée par la grande bougie NFP */}
        <line x1="40" y1="150" x2="660" y2="150" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.8" />
        <rect x="556" y="138" width="92" height="13" rx="3" fill="#09090b" />
        <text x="602" y="148" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">{t.support}</text>

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

        {/* Label "4 640 $ — avant NFP" */}
        <rect x="6" y="54" width="142" height="13" rx="3" fill="#09090b" />
        <text x="77" y="64" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">{t.avantNfp}</text>

        {/* Label "4 575 $" au creux */}
        <rect x="156" y="214" width="58" height="13" rx="3" fill="#09090b" />
        <text x="185" y="224" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 575 $</text>

        {/* Label "4 625 $" au sommet du retour */}
        <rect x="524" y="86" width="58" height="13" rx="3" fill="#09090b" />
        <text x="553" y="96" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">4 625 $</text>

        {/* Annotation "Réaction headline" — à GAUCHE de la grande bougie */}
        <rect x="64" y="110" width="120" height="14" rx="3" fill="#09090b" />
        <rect x="64" y="110" width="120" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="124" y="120" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">{t.reactionHeadline}</text>
        <line x1="184" y1="117" x2="202" y2="117" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />

        {/* Annotation "Réévaluation du marché" — au-dessus de la remontée */}
        <rect x="394" y="36" width="148" height="14" rx="3" fill="#09090b" />
        <rect x="394" y="36" width="148" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="468" y="46" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">{t.reevaluation}</text>
        <line x1="468" y1="50" x2="468" y2="100" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.6" />
      </svg>

      {/* MOBILE : NFP headline reaction ───────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        {/* Mini-SVG : pré-NFP stable + spike bearish + stabilisation + réévaluation */}
        <svg viewBox="0 0 280 130" className="w-full h-auto" aria-label="NFP headline reaction" fill="none">
          {/* Support */}
          <line x1="15" y1="55" x2="265" y2="55" stroke="#ef4444" strokeWidth="0.9" strokeDasharray="3 2" />
          <text x="265" y="50" fontSize="8" fill="#ef4444" fontWeight="700" textAnchor="end">Support</text>
          {/* Pré-NFP — bougies stables */}
          <line x1="22" y1="38" x2="22" y2="48" stroke="#059669" strokeWidth="0.8" />
          <rect x="19" y="40" width="6" height="7" fill="#10b981" rx="0.5" />
          <line x1="38" y1="38" x2="38" y2="48" stroke="#b91c1c" strokeWidth="0.8" />
          <rect x="35" y="40" width="6" height="7" fill="#ef4444" rx="0.5" />
          <line x1="54" y1="38" x2="54" y2="48" stroke="#059669" strokeWidth="0.8" />
          <rect x="51" y="40" width="6" height="7" fill="#10b981" rx="0.5" />
          {/* GRANDE bougie NFP — spike vers le bas */}
          <line x1="75" y1="40" x2="75" y2="100" stroke="#b91c1c" strokeWidth="1.4" />
          <rect x="70" y="42" width="10" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.6" rx="1" />
          {/* Stabilisation autour de y=90 */}
          <line x1="95" y1="85" x2="95" y2="100" stroke="#b91c1c" strokeWidth="0.8" />
          <rect x="92" y="88" width="6" height="10" fill="#ef4444" rx="0.5" />
          <line x1="111" y1="85" x2="111" y2="100" stroke="#059669" strokeWidth="0.8" />
          <rect x="108" y="88" width="6" height="10" fill="#10b981" rx="0.5" />
          <line x1="127" y1="85" x2="127" y2="100" stroke="#b91c1c" strokeWidth="0.8" />
          <rect x="124" y="88" width="6" height="10" fill="#ef4444" rx="0.5" />
          {/* Réévaluation — remontée progressive */}
          <line x1="148" y1="72" x2="148" y2="92" stroke="#059669" strokeWidth="0.8" />
          <rect x="145" y="75" width="6" height="15" fill="#10b981" rx="0.5" />
          <line x1="166" y1="58" x2="166" y2="80" stroke="#059669" strokeWidth="0.8" />
          <rect x="163" y="62" width="6" height="18" fill="#10b981" rx="0.5" />
          <line x1="184" y1="48" x2="184" y2="68" stroke="#059669" strokeWidth="0.8" />
          <rect x="181" y="50" width="6" height="16" fill="#10b981" rx="0.5" />
          <line x1="202" y1="40" x2="202" y2="58" stroke="#059669" strokeWidth="0.8" />
          <rect x="199" y="42" width="6" height="14" fill="#10b981" rx="0.5" />
          <line x1="220" y1="32" x2="220" y2="48" stroke="#059669" strokeWidth="0.8" />
          <rect x="217" y="35" width="6" height="12" fill="#10b981" rx="0.5" />
          {/* Labels */}
          <rect x="58" y="6" width="50" height="13" rx="2" fill="#ef444418" stroke="#ef4444" strokeWidth="0.6" />
          <text x="83" y="15" fontSize="8" fill="#ef4444" textAnchor="middle" fontWeight="700">Headline</text>
          <rect x="160" y="6" width="80" height="13" rx="2" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.6" />
          <text x="200" y="15" fontSize="8" fill="#f59e0b" textAnchor="middle" fontWeight="700">Réévaluation</text>
        </svg>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">{t.mobileExcess}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.mobileExcessDesc}</p>
        </div>
        <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
          <p className="text-[13px] font-bold text-amber-400">{t.mobileReeval}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.mobileReevalDesc}</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{t.legendHeadline}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{t.legendReeval}</span>
        </div>
      </div>
    </div>
  );
}
