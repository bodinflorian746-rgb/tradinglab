// Diagramme : sweep du range Asia (Leçon 3 ICT)
// EUR/USD M15 — rectangle "Asia Session" qui contient des bougies serrées (1.1710-1.1725),
// puis sweep d'une mèche sous le bas du range (1.1702), puis rejet violent vers 1.1750.

interface AsiaRangeSweepDiagramProps {
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
  // Range Asia (continuité ouvertures/clôtures dans le range y=110-160)
  { cx:  80, wickTop: 115, bodyY: 118, bodyH: 22, wickBottom: 148, type: "bear" },
  { cx: 110, wickTop: 135, bodyY: 125, bodyH: 15, wickBottom: 152, type: "bull" },
  { cx: 140, wickTop: 122, bodyY: 125, bodyH: 18, wickBottom: 150, type: "bear" },
  { cx: 170, wickTop: 142, bodyY: 130, bodyH: 13, wickBottom: 152, type: "bull" },
  { cx: 200, wickTop: 128, bodyY: 130, bodyH: 18, wickBottom: 158, type: "bear" },
  { cx: 230, wickTop: 145, bodyY: 132, bodyH: 16, wickBottom: 155, type: "bull" },
  { cx: 260, wickTop: 130, bodyY: 132, bodyH: 22, wickBottom: 160, type: "bear" },

  // SWEEP — mèche qui casse sous le range (range bord bas y=160)
  { cx: 295, wickTop: 152, bodyY: 154, bodyH: 18, wickBottom: 202, type: "bear" },

  // Rejet violent — bougies haussières impulsives
  { cx: 330, wickTop: 132, bodyY: 138, bodyH: 35, wickBottom: 178, type: "bull" },
  { cx: 365, wickTop:  98, bodyY: 102, bodyH: 38, wickBottom: 145, type: "bull" },
  { cx: 400, wickTop:  68, bodyY:  72, bodyH: 32, wickBottom: 108, type: "bull" },
  { cx: 435, wickTop:  48, bodyY:  52, bodyH: 22, wickBottom:  80, type: "bull" },
  { cx: 470, wickTop:  38, bodyY:  42, bodyH: 14, wickBottom:  60, type: "bull" },
  { cx: 505, wickTop:  35, bodyY:  38, bodyH: 10, wickBottom:  52, type: "bull" },
  { cx: 540, wickTop:  32, bodyY:  35, bodyH:  8, wickBottom:  48, type: "bull" },
];

const BODY_W = 12;

export function AsiaRangeSweepDiagram({ className = "", locale = "fr" }: AsiaRangeSweepDiagramProps) {
  const t = locale === "es"
    ? {
        asiaSession: "Asia Session",
        sweep: "Sweep 1.1702",
        annotation: "El range asiático se vuelve el objetivo",
        mobileTitle: "Asia range sweep · EUR/USD M15",
        m1a: "Range Asia",
        m1b: " = bolsa de liquidez visible.",
        m2a: "Sweep",
        m2b: " bajo el range — dispara los stops.",
        m3a: "Expansión violenta",
        m3b: " en sentido opuesto en London Open.",
        leg1: "Range Asia = bolsa de liquidez visible",
        leg2: "Sweep bajo el range y luego expansión violenta",
      }
    : {
        asiaSession: "Asia Session",
        sweep: "Sweep 1.1702",
        annotation: "Le range asiatique devient la cible",
        mobileTitle: "Asia range sweep · EUR/USD M15",
        m1a: "Range Asia",
        m1b: " = poche de liquidité visible.",
        m2a: "Sweep",
        m2b: " sous le range — déclenche les stops.",
        m3a: "Expansion violente",
        m3b: " dans le sens opposé en London Open.",
        leg1: "Range Asia = poche de liquidité visible",
        leg2: "Sweep sous le range puis expansion violente",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · M15</text>

        {/* Rectangle Asia Session — range y=110 à y=160 */}
        <rect x="60" y="110" width="220" height="50" fill="#27272a40" stroke="#71717a" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.9" />

        {/* Label "Asia Session" en haut du rectangle */}
        <rect x="100" y="92" width="120" height="14" rx="3" fill="#09090b" />
        <text x="160" y="102" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">{t.asiaSession}</text>

        {/* Labels niveaux 1.1725 (haut) / 1.1710 (bas) — à GAUCHE du rectangle Asia, alignés sur ses bords */}
        <rect x="6" y="103" width="50" height="13" rx="3" fill="#09090b" />
        <text x="31" y="113" fill="#a1a1aa" fontSize="9" fontWeight="600" textAnchor="middle">1.1725</text>
        <rect x="6" y="154" width="50" height="13" rx="3" fill="#09090b" />
        <text x="31" y="164" fill="#a1a1aa" fontSize="9" fontWeight="600" textAnchor="middle">1.1710</text>

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

        {/* Label SWEEP 1.1702 */}
        <line x1="295" y1="206" x2="335" y2="222" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="335" y="218" width="74" height="14" rx="3" fill="#09090b" />
        <text x="372" y="228" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">{t.sweep}</text>

        {/* Label sommet 1.1750 */}
        <rect x="556" y="28" width="62" height="14" rx="3" fill="#09090b" />
        <text x="587" y="38" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">1.1750</text>

        {/* Annotation */}
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {t.annotation}
        </text>
      </svg>

      {/* MOBILE : Asia range sweep ──────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-700 border border-zinc-500 flex items-center justify-center text-[11px] font-bold text-zinc-300 mt-0.5">1</span>
            <span className="text-zinc-300"><span className="font-bold text-zinc-300">{t.m1a}</span>{t.m1b}</span>
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
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
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
