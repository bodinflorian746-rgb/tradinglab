interface DrawdownRecoveryDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

interface DataPoint {
  dd: number;
  rec: number;
  px: number;
  py: number;
  anchor: "start" | "end";
  labelDx: number;
  labelDy: number;
  pillW: number;
}

// Plot area : x = [70, 860], y = [90, 540]
// X scale : 9.875 px / % drawdown  ·  Y scale : 1.125 px / % recovery
// xCoord(dd) = 70 + dd * 9.875  ·  yCoord(rec) = 540 - rec * 1.125

const ORIGIN_X = 70;
const ORIGIN_Y = 540;

const POINTS: DataPoint[] = [
  { dd: 10, rec: 11,  px: 169, py: 528, anchor: "start", labelDx:  10, labelDy: -8,  pillW: 68 },
  { dd: 20, rec: 25,  px: 268, py: 512, anchor: "start", labelDx:  10, labelDy: -8,  pillW: 68 },
  { dd: 30, rec: 43,  px: 366, py: 492, anchor: "start", labelDx:  10, labelDy: -8,  pillW: 68 },
  { dd: 40, rec: 67,  px: 465, py: 465, anchor: "start", labelDx:  10, labelDy: -8,  pillW: 68 },
  { dd: 50, rec: 100, px: 564, py: 428, anchor: "end",   labelDx: -10, labelDy: -8,  pillW: 78 },
  { dd: 60, rec: 150, px: 663, py: 371, anchor: "end",   labelDx: -10, labelDy: -8,  pillW: 78 },
  { dd: 70, rec: 233, px: 761, py: 278, anchor: "end",   labelDx: -10, labelDy: -8,  pillW: 78 },
  { dd: 80, rec: 400, px: 860, py: 90,  anchor: "end",   labelDx: -10, labelDy: 22,  pillW: 78 },
];

// Curve split in 3 colored segments matching the 3 background zones :
// emerald (0 → 20%)  ·  amber (20 → 50%)  ·  red (50 → 80%)
const PATH_SURVIVAL = `M${ORIGIN_X},${ORIGIN_Y} L169,528 L268,512`;
const PATH_DANGER   = `M268,512 L366,492 L465,465 L564,428`;
const PATH_CRITICAL = `M564,428 L663,371 L761,278 L860,90`;

const FILL_AREA = `M${ORIGIN_X},${ORIGIN_Y} L169,528 L268,512 L366,492 L465,465 L564,428 L663,371 L761,278 L860,90 L860,${ORIGIN_Y} Z`;

export default function DrawdownRecoveryDiagram({ className = "", locale = "fr" }: DrawdownRecoveryDiagramProps) {
  const isEs = locale === "es";
  const L = {
    title:        isEs ? "Cuanto más pierdes, más debes rendir para volver" : "Plus tu perds, plus il faut performer pour revenir",
    subtitle:     isEs ? "El coste matemático del drawdown" : "Le coût mathématique du drawdown",
    axisX:        isEs ? "Drawdown sufrido (%)" : "Drawdown subi (%)",
    axisY:        isEs ? "Ganancia necesaria (%)" : "Gain nécessaire (%)",
    zoneSurvival: isEs ? "Zona de supervivencia" : "Zone de survie",
    zoneDanger:   isEs ? "Zona peligrosa" : "Zone dangereuse",
    zoneCritical: isEs ? "Zona crítica" : "Zone critique",
    footer:       isEs ? "Una pérdida del 50% exige +100% para volver. Una del 70% exige +233%." : "Une perte de 50% impose +100% pour revenir. Une de 70% impose +233%.",
    mobTitle:     isEs ? "Cuanto más pierdes, más debes rendir para volver" : "Plus tu perds, plus il faut performer pour revenir",
    mobSubtitle:  isEs ? "El coste matemático del drawdown" : "Le coût mathématique du drawdown",
    mobDdHeader:  isEs ? "Drawdown" : "Drawdown",
    mobRecHeader: isEs ? "Ganancia necesaria" : "Gain nécessaire",
    mobFooter:    isEs ? "La curva explota: cada punto perdido cuesta cada vez más para recuperar." : "La courbe explose : chaque point perdu coûte de plus en plus à récupérer.",
  };

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      {/* ── DESKTOP (SVG 900×600) ────────────────────────────────── */}
      <svg
        width="100%"
        viewBox="0 0 900 600"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden sm:block"
      >
        {/* Titre + sous-titre */}
        <text x={450} y={32} fontSize="16" fill="#ffffff" textAnchor="middle" fontWeight="700">
          {L.title}
        </text>
        <text x={450} y={54} fontSize="11" fill="#a1a1aa" textAnchor="middle" fontStyle="italic">
          {L.subtitle}
        </text>

        {/* ── ZONES DE FOND ── */}
        {/* Zone de survie : 0% → 20% drawdown */}
        <rect x={70}  y={90} width={198} height={450} fill="#10b981" fillOpacity="0.08" />
        {/* Zone dangereuse : 20% → 50% drawdown */}
        <rect x={268} y={90} width={296} height={450} fill="#fbbf24" fillOpacity="0.08" />
        {/* Zone critique : 50% → 80% drawdown */}
        <rect x={564} y={90} width={296} height={450} fill="#ef4444" fillOpacity="0.08" />

        {/* Bordures verticales de zones */}
        <line x1={268} y1={90} x2={268} y2={540} stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1={564} y1={90} x2={564} y2={540} stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Labels de zones — pastilles opaques */}
        <rect x={92} y={100} width={154} height={18} rx="3" fill="#09090b" fillOpacity="0.85" />
        <text x={169} y={113} fontSize="10" fill="#34d399" textAnchor="middle" fontWeight="700" letterSpacing="0.5">
          {L.zoneSurvival.toUpperCase()}
        </text>

        <rect x={336} y={100} width={160} height={18} rx="3" fill="#09090b" fillOpacity="0.85" />
        <text x={416} y={113} fontSize="10" fill="#fbbf24" textAnchor="middle" fontWeight="700" letterSpacing="0.5">
          {L.zoneDanger.toUpperCase()}
        </text>

        <rect x={632} y={100} width={160} height={18} rx="3" fill="#09090b" fillOpacity="0.85" />
        <text x={712} y={113} fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="700" letterSpacing="0.5">
          {L.zoneCritical.toUpperCase()}
        </text>

        {/* ── GRILLE Y (lignes horizontales) ── */}
        {[
          { rec:  50, y: 484 },
          { rec: 100, y: 428 },
          { rec: 150, y: 371 },
          { rec: 200, y: 315 },
          { rec: 250, y: 259 },
          { rec: 300, y: 203 },
          { rec: 350, y: 146 },
          { rec: 400, y:  90 },
        ].map(({ rec, y }) => (
          <g key={rec}>
            <line x1={70} y1={y} x2={860} y2={y} stroke="#27272a" strokeWidth="0.7" strokeDasharray="3 4" />
            <text x={64} y={y + 3} fontSize="9" fill="#71717a" textAnchor="end">+{rec}%</text>
          </g>
        ))}

        {/* ── AXES PRINCIPAUX ── */}
        <line x1={70} y1={540} x2={860} y2={540} stroke="#3f3f46" strokeWidth="1.2" />
        <line x1={70} y1={90}  x2={70}  y2={540} stroke="#3f3f46" strokeWidth="1.2" />

        {/* Graduations X */}
        {[0, 10, 20, 30, 40, 50, 60, 70, 80].map((dd) => {
          const x = 70 + dd * 9.875;
          return (
            <g key={dd}>
              <line x1={x} y1={540} x2={x} y2={546} stroke="#3f3f46" strokeWidth="1" />
              <text x={x} y={559} fontSize="9.5" fill="#a1a1aa" textAnchor="middle" fontWeight="600">{dd}%</text>
            </g>
          );
        })}

        {/* Labels d'axes */}
        <text x={465} y={585} fontSize="10" fill="#71717a" textAnchor="middle" fontStyle="italic">
          {L.axisX}
        </text>
        <text x={20} y={315} fontSize="10" fill="#71717a" textAnchor="middle" fontStyle="italic" transform="rotate(-90 20 315)">
          {L.axisY}
        </text>

        {/* ── AIRE SOUS COURBE (très légère) ── */}
        <path d={FILL_AREA} fill="#ef4444" fillOpacity="0.04" />

        {/* ── COURBE EXPONENTIELLE EN 3 SEGMENTS ── */}
        <path d={PATH_SURVIVAL} stroke="#34d399" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={PATH_DANGER}   stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={PATH_CRITICAL} stroke="#ef4444" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />

        {/* ── 8 POINTS DE DONNÉES + LABELS ── */}
        {POINTS.map((p) => {
          // Couleur du point selon la zone
          const color =
            p.dd <= 20 ? "#34d399" :
            p.dd <= 50 ? "#fbbf24" :
            "#ef4444";

          // Position du label
          const labelX = p.px + p.labelDx;
          const labelY = p.py + p.labelDy;
          // Pastille positionnée selon l'anchor du texte
          const pillX = p.anchor === "start" ? labelX - 4 : labelX - p.pillW + 4;
          const pillY = labelY - 12;

          return (
            <g key={p.dd}>
              {/* Marqueur extérieur (halo discret) */}
              <circle cx={p.px} cy={p.py} r={7} fill={color} fillOpacity="0.2" />
              {/* Marqueur principal */}
              <circle cx={p.px} cy={p.py} r={4.5} fill={color} stroke="#09090b" strokeWidth="1.5" />

              {/* Pastille opaque derrière le label */}
              <rect x={pillX} y={pillY} width={p.pillW} height={17} rx="3" fill="#09090b" fillOpacity="0.85" />
              <rect x={pillX} y={pillY} width={p.pillW} height={17} rx="3" fill={color} fillOpacity="0.12" stroke={color} strokeOpacity="0.4" strokeWidth="0.8" />
              <text
                x={labelX}
                y={labelY}
                fontSize="10"
                fill={color}
                textAnchor={p.anchor}
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                {p.dd}% → +{p.rec}%
              </text>
            </g>
          );
        })}

        {/* ── FOOTER ── */}
        <rect x={70} y={569} width={790} height={1} fill="#1f1f23" />
        <rect x={250} y={578} width={400} height={16} rx="3" fill="#09090b" fillOpacity="0.85" />
        <text x={450} y={590} fontSize="10.5" fill="#f87171" textAnchor="middle" fontWeight="600" fontStyle="italic">
          {L.footer}
        </text>
      </svg>

      {/* ── MOBILE (HTML reconstitué) ──────────────────────────── */}
      <div className="sm:hidden p-4 space-y-4">
        <div className="text-center">
          <p className="text-[15px] font-bold text-white leading-snug">{L.mobTitle}</p>
          <p className="text-[12px] text-zinc-400 italic mt-1">{L.mobSubtitle}</p>
        </div>

        {/* Mini-courbe mobile pour effet "5 secondes" */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
          <svg viewBox="0 0 320 180" width="100%" fill="none" preserveAspectRatio="xMidYMid meet" aria-label="Drawdown vs recovery">
            {/* Zones de fond */}
            <rect x={20}  y={20} width={75}  height={140} fill="#10b981" fillOpacity="0.08" />
            <rect x={95}  y={20} width={112} height={140} fill="#fbbf24" fillOpacity="0.08" />
            <rect x={207} y={20} width={113} height={140} fill="#ef4444" fillOpacity="0.08" />
            {/* Axes */}
            <line x1={20} y1={160} x2={320} y2={160} stroke="#3f3f46" strokeWidth="1" />
            <line x1={20} y1={20}  x2={20}  y2={160} stroke="#3f3f46" strokeWidth="1" />
            {/* Aire sous courbe */}
            <path
              d="M20,160 L57,156 L95,150 L132,142 L170,132 L207,118 L245,98 L282,65 L320,20 L320,160 Z"
              fill="#ef4444" fillOpacity="0.05"
            />
            {/* Courbe en 3 segments */}
            <path d="M20,160 L57,156 L95,150" stroke="#34d399" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M95,150 L132,142 L170,132 L207,118" stroke="#fbbf24" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M207,118 L245,98 L282,65 L320,20" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {/* Points clés */}
            <circle cx={95}  cy={150} r="3.5" fill="#34d399" stroke="#09090b" strokeWidth="1.5" />
            <circle cx={207} cy={118} r="3.5" fill="#fbbf24" stroke="#09090b" strokeWidth="1.5" />
            <circle cx={282} cy={65}  r="3.5" fill="#ef4444" stroke="#09090b" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Tableau des 8 points */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="grid grid-cols-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/60">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{L.mobDdHeader}</p>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">{L.mobRecHeader}</p>
          </div>
          {POINTS.map((p) => {
            const color =
              p.dd <= 20 ? "text-emerald-400" :
              p.dd <= 50 ? "text-amber-400" :
              "text-red-400";
            return (
              <div key={p.dd} className="grid grid-cols-2 px-3 py-2 border-b border-zinc-800/60 last:border-b-0">
                <p className={`text-[14px] font-bold font-mono ${color}`}>−{p.dd}%</p>
                <p className={`text-[14px] font-bold font-mono text-right ${color}`}>+{p.rec}%</p>
              </div>
            );
          })}
        </div>

        {/* Légende zones */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/8 p-2 text-center">
            <p className="text-[11px] font-bold text-emerald-400 leading-tight">{L.zoneSurvival}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">0 → 20%</p>
          </div>
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/8 p-2 text-center">
            <p className="text-[11px] font-bold text-amber-400 leading-tight">{L.zoneDanger}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">20 → 50%</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/8 p-2 text-center">
            <p className="text-[11px] font-bold text-red-400 leading-tight">{L.zoneCritical}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">50 → 80%</p>
          </div>
        </div>

        <p className="text-[12px] text-zinc-400 italic text-center leading-snug">
          {L.mobFooter}
        </p>
      </div>
    </div>
  );
}
