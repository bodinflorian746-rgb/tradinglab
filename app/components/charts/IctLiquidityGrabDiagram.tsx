// Diagramme : prise de liquidité sur equal highs (Leçon 1 ICT)
// EUR/USD H1 — deux sommets identiques reliés par une ligne pointillée rouge, puis une mèche
// qui dépasse brièvement (sweep), puis chute franche (rejet).

interface IctLiquidityGrabDiagramProps {
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

const CANDLES: CandleSpec[] = [
  { cx:  80, wickTop: 195, bodyY: 200, bodyH: 30, wickBottom: 235, type: "bull" },
  { cx: 130, wickTop: 155, bodyY: 160, bodyH: 40, wickBottom: 205, type: "bull" },
  // 1er equal high — mèche au contact de la ligne y=70
  { cx: 180, wickTop:  70, bodyY:  78, bodyH: 52, wickBottom: 135, type: "bull" },
  // Pullback
  { cx: 230, wickTop:  75, bodyY:  82, bodyH: 38, wickBottom: 125, type: "bear" },
  // 2e equal high — autre mèche au contact de la ligne
  { cx: 280, wickTop:  70, bodyY:  78, bodyH: 42, wickBottom: 122, type: "bull" },
  // SWEEP — mèche qui dépasse vers y=45, corps qui referme près de la ligne
  { cx: 330, wickTop:  45, bodyY:  75, bodyH: 28, wickBottom: 108, type: "bear" },
  // Rejet — cascade baissière
  { cx: 380, wickTop:  98, bodyY: 102, bodyH: 46, wickBottom: 152, type: "bear" },
  { cx: 430, wickTop: 145, bodyY: 150, bodyH: 42, wickBottom: 195, type: "bear" },
  { cx: 480, wickTop: 188, bodyY: 192, bodyH: 30, wickBottom: 225, type: "bear" },
  { cx: 530, wickTop: 218, bodyY: 222, bodyH: 22, wickBottom: 248, type: "bear" },
  { cx: 580, wickTop: 238, bodyY: 242, bodyH: 10, wickBottom: 256, type: "bear" },
];

const BODY_W = 12;

export function IctLiquidityGrabDiagram({ className = "", locale = "fr" }: IctLiquidityGrabDiagramProps) {
  const t = locale === "es"
    ? {
        equalHighs: "Equal highs 1.1780",
        sweep: "Sweep 1.1792",
        rejet: "Rechazo 1.1720",
        annotation: "El mercado toma la liquidez antes del displacement",
        mobileTitle: "Liquidity grab en equal highs · EUR/USD H1",
        m1a: "Equal highs",
        m1b: " en 1.1780 = liquidez visible.",
        m2a: "Sweep en 1.1792",
        m2b: " · la mecha dispara los stops.",
        m3a: "Rechazo hacia 1.1720",
        m3b: " = movimiento institucional real.",
        leg1: "Equal highs = liquidez visible por encima",
        leg2: "Sweep y luego rechazo = movimiento real",
      }
    : {
        equalHighs: "Equal highs 1.1780",
        sweep: "Sweep 1.1792",
        rejet: "Rejet 1.1720",
        annotation: "Le marché prend la liquidité avant le déplacement",
        mobileTitle: "Liquidity grab sur equal highs · EUR/USD H1",
        m1a: "Equal highs",
        m1b: " à 1.1780 = liquidité visible.",
        m2a: "Sweep à 1.1792",
        m2b: " · mèche déclenche les stops.",
        m3a: "Rejet vers 1.1720",
        m3b: " = vrai mouvement institutionnel.",
        leg1: "Equal highs = liquidité visible au-dessus",
        leg2: "Sweep puis rejet = mouvement réel",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Ligne equal highs */}
        <line x1="60" y1="70" x2="620" y2="70" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="488" y="58" width="124" height="13" rx="3" fill="#09090b" />
        <text x="550" y="68" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">{t.equalHighs}</text>

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

        {/* Label SWEEP au-dessus du pic */}
        <line x1="332" y1="48" x2="350" y2="42" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.7" />
        <rect x="350" y="32" width="92" height="14" rx="3" fill="#09090b" />
        <text x="396" y="42" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">{t.sweep}</text>

        {/* Label REJET en bas */}
        <rect x="528" y="262" width="84" height="14" rx="3" fill="#09090b" />
        <text x="570" y="272" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">{t.rejet}</text>

        {/* Annotation */}
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {t.annotation}
        </text>
      </svg>

      {/* MOBILE : liquidity grab equal highs ────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">1</span>
            <span className="text-zinc-300"><span className="font-bold text-red-400">{t.m1a}</span>{t.m1b}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-400 mt-0.5">2</span>
            <span className="text-zinc-300"><span className="font-bold text-amber-400">{t.m2a}</span>{t.m2b}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[11px] font-bold text-emerald-400 mt-0.5">3</span>
            <span className="text-zinc-300"><span className="font-bold text-emerald-400">{t.m3a}</span>{t.m3b}</span>
          </li>
        </ul>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{t.leg1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{t.leg2}</span>
        </div>
      </div>
    </div>
  );
}
