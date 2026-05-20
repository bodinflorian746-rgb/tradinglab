interface TradingJournalDiagramProps {
  className?: string;
}

type Trade = {
  date: string;
  setup: string;
  rr: string;
  result: string;
  win: boolean;
};

const TRADES: Trade[] = [
  { date: "12/04", setup: "OB Bullish",  rr: "1:2",   result: "+2R",   win: true  },
  { date: "13/04", setup: "OTE Long",    rr: "1:1.5", result: "+1.5R", win: true  },
  { date: "14/04", setup: "FVG Bullish", rr: "1:1.5", result: "+1.5R", win: true  },
  { date: "15/04", setup: "Range Break", rr: "1:1",   result: "-1R",   win: false },
  { date: "16/04", setup: "OTE Long",    rr: "1:2",   result: "-1R",   win: false },
  { date: "17/04", setup: "OB Bullish",  rr: "1:2",   result: "+1R",   win: true  },
  { date: "19/04", setup: "Range Break", rr: "1:2",   result: "-1R",   win: false },
  { date: "20/04", setup: "FVG Bearish", rr: "1:2",   result: "-1R",   win: false },
  { date: "21/04", setup: "OTE Long",    rr: "1:2",   result: "+1R",   win: true  },
  { date: "22/04", setup: "OB Bullish",  rr: "1:2.5", result: "+2.5R", win: true  },
];

// Equity: zero at y=340, scale=40px per R
// Cumulative R: 0 → 2 → 3.5 → 5 → 4 → 3 → 4 → 3 → 2 → 3 → 5.5
const EQ_PTS: [number, number][] = [
  [452, 340], [496, 260], [540, 200], [584, 140],
  [628, 180], [672, 220], [716, 180], [760, 220],
  [804, 260], [848, 220], [892, 120],
];

const eqPath = "M" + EQ_PTS.map(([x, y]) => `${x},${y}`).join(" L");

const COL = { date: 15, setup: 80, rr: 218, result: 292 };
const HDR_SEP = 66;
const ROW_Y0 = 86;
const ROW_DY = 28;

export function TradingJournalDiagram({ className = "" }: TradingJournalDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      {/* ── DESKTOP (SVG 900×490, inchangé) ───────────────────────── */}
      <svg
        width="100%"
        viewBox="0 0 900 490"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden sm:block"
      >
        {/* ── LEFT PANEL — TABLE ── */}

        <rect x={15} y={12} width={90} height={17} rx="3"
          fill="#10b98114" stroke="#10b98130" strokeWidth="0.8" />
        <text x={60} y={24} fontSize="9" fill="#10b981"
          textAnchor="middle" fontWeight="700">Win Rate 60%</text>

        <rect x={115} y={12} width={72} height={17} rx="3"
          fill="#10b98114" stroke="#10b98130" strokeWidth="0.8" />
        <text x={151} y={24} fontSize="9" fill="#10b981"
          textAnchor="middle" fontWeight="700">+5.5R net</text>

        <rect x={10} y={38} width={425} height={28} fill="#18181b" />
        <text x={COL.date}   y={57} fontSize="10" fill="#52525b" fontWeight="700" letterSpacing="0.5">DATE</text>
        <text x={COL.setup}  y={57} fontSize="10" fill="#52525b" fontWeight="700" letterSpacing="0.5">SETUP</text>
        <text x={COL.rr}     y={57} fontSize="10" fill="#52525b" fontWeight="700" letterSpacing="0.5">R/R</text>
        <text x={COL.result} y={57} fontSize="10" fill="#52525b" fontWeight="700" letterSpacing="0.5">RÉSULTAT</text>
        <line x1={10} y1={HDR_SEP} x2={435} y2={HDR_SEP} stroke="#3f3f46" strokeWidth="1.2" />

        {TRADES.map((t, i) => {
          const y = ROW_Y0 + i * ROW_DY;
          const sepY = HDR_SEP + (i + 1) * ROW_DY;
          return (
            <g key={i}>
              <rect x={10} y={y - 19} width={425} height={27}
                fill={t.win ? "#10b9810a" : "#ef44440a"} />
              <line x1={10} y1={sepY} x2={435} y2={sepY}
                stroke="#1f1f23" strokeWidth="0.8" />
              <text x={COL.date}   y={y} fontSize="11" fill="#71717a">{t.date}</text>
              <text x={COL.setup}  y={y} fontSize="11" fill="#a1a1aa">{t.setup}</text>
              <text x={COL.rr}     y={y} fontSize="10" fill="#52525b">{t.rr}</text>
              <text x={COL.result} y={y} fontSize="11" fontWeight="600"
                fill={t.win ? "#34d399" : "#f87171"}>{t.result}</text>
            </g>
          );
        })}

        {/* ── DIVIDER ── */}
        <line x1={445} y1={8} x2={445} y2={382} stroke="#27272a" strokeWidth="1" />

        {/* ── RIGHT PANEL — EQUITY CURVE ── */}

        <rect x={588} y={12} width={190} height={16} rx="3"
          fill="#09090b" fillOpacity="0.85" />
        <text x={683} y={23} fontSize="8.5" fill="#52525b"
          textAnchor="middle" fontWeight="600">Equity — capital cumulé (en R)</text>

        {/* Zero baseline */}
        <line x1={452} y1={340} x2={892} y2={340}
          stroke="#3f3f46" strokeWidth="1" strokeDasharray="5 3" opacity="0.8" />
        <text x={449} y={344} fontSize="8" fill="#52525b" textAnchor="end">0R</text>

        {/* Grid lines */}
        {[{ label: "+2R", y: 260 }, { label: "+4R", y: 180 }].map(({ label, y }) => (
          <g key={label}>
            <line x1={452} y1={y} x2={892} y2={y}
              stroke="#27272a" strokeWidth="0.7" strokeDasharray="3 4" />
            <text x={449} y={y + 4} fontSize="8" fill="#3f3f46" textAnchor="end">{label}</text>
          </g>
        ))}

        {/* X-axis */}
        {EQ_PTS.slice(1).map(([x], i) => (
          <g key={i}>
            <line x1={x} y1={340} x2={x} y2={348} stroke="#3f3f46" strokeWidth="0.8" />
            <text x={x} y={360} fontSize="8" fill="#52525b" textAnchor="middle">{i + 1}</text>
          </g>
        ))}
        <text x={672} y={374} fontSize="8" fill="#3f3f46" textAnchor="middle">Trade #</text>

        {/* Equity fill */}
        <path d={`${eqPath} L892,340 L452,340 Z`} fill="#10b98108" />

        {/* Equity curve */}
        <path d={eqPath}
          stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots */}
        {EQ_PTS.slice(1).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3"
            fill="#10b981" opacity={y <= 200 ? "0.9" : "0.4"} />
        ))}

        {/* Best streak — T3 peak (584, 140) */}
        <circle cx={584} cy={140} r="5" fill="#10b981" opacity="0.9" />
        <line x1={584} y1={135} x2={584} y2={127}
          stroke="#10b981" strokeWidth="0.8" opacity="0.5" />
        <rect x={524} y={109} width={120} height={16} rx="3"
          fill="#09090b" fillOpacity="0.85" />
        <rect x={524} y={109} width={120} height={16} rx="3"
          fill="#10b98112" stroke="#10b98130" strokeWidth="0.7" />
        <text x={584} y={121} fontSize="8.5" fill="#10b981"
          textAnchor="middle" fontWeight="700">Best streak +5R</text>

        {/* Worst drawdown — T5 trough (672, 220) */}
        <circle cx={672} cy={220} r="5" fill="#ef4444" opacity="0.9" />
        <line x1={672} y1={225} x2={672} y2={233}
          stroke="#ef4444" strokeWidth="0.8" opacity="0.5" />
        <rect x={606} y={233} width={132} height={16} rx="3"
          fill="#09090b" fillOpacity="0.85" />
        <rect x={606} y={233} width={132} height={16} rx="3"
          fill="#ef444412" stroke="#ef444430" strokeWidth="0.7" />
        <text x={672} y={245} fontSize="8.5" fill="#ef4444"
          textAnchor="middle" fontWeight="700">Worst drawdown -2R</text>

        {/* ── INSIGHTS BAND ── */}
        <line x1={10} y1={386} x2={892} y2={386} stroke="#27272a" strokeWidth="1" />

        <rect x={10}  y={394} width={280} height={80} rx="4"
          fill="#10b9810a" stroke="#10b98120" strokeWidth="0.8" />
        <text x={22} y={414} fontSize="8.5" fill="#34d399" fontWeight="700">✓  Setup le plus rentable</text>
        <text x={22} y={432} fontSize="10"  fill="#a1a1aa">OB Bullish — 3 / 3 gagnants</text>
        <text x={22} y={450} fontSize="8.5" fill="#52525b">Ratio moyen : +1.83R / trade</text>

        <rect x={306} y={394} width={280} height={80} rx="4"
          fill="#ef44440a" stroke="#ef444420" strokeWidth="0.8" />
        <text x={318} y={414} fontSize="8.5" fill="#f87171" fontWeight="700">✗  Setup à éviter</text>
        <text x={318} y={432} fontSize="10"  fill="#a1a1aa">Range Break — 0 / 2 gagnants</text>
        <text x={318} y={450} fontSize="8.5" fill="#52525b">Supprimer de ton plan de trading</text>

        <rect x={602} y={394} width={286} height={80} rx="4"
          fill="#60a5fa0a" stroke="#60a5fa20" strokeWidth="0.8" />
        <text x={614} y={414} fontSize="8.5" fill="#60a5fa" fontWeight="700">⚠  Erreur récurrente</text>
        <text x={614} y={432} fontSize="10"  fill="#a1a1aa">SL trop serré sur 3 trades</text>
        <text x={614} y={450} fontSize="8.5" fill="#52525b">Revoir sizing et placement du SL</text>
      </svg>

      {/* ── MOBILE (HTML reconstruit — tailles aggressives) ────────────────── */}
      <div className="sm:hidden p-4 space-y-4">
        {/* Hero metrics : 2 chiffres XXL */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
            <p className="text-[12px] text-emerald-400/80 uppercase tracking-wider font-bold">Win rate</p>
            <p className="text-[32px] font-bold text-emerald-400 mt-1 leading-none">60%</p>
            <p className="text-[12px] text-zinc-500 mt-1">6 / 10 trades</p>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
            <p className="text-[12px] text-emerald-400/80 uppercase tracking-wider font-bold">Net</p>
            <p className="text-[32px] font-bold text-emerald-400 mt-1 leading-none">+5.5R</p>
            <p className="text-[12px] text-zinc-500 mt-1">capital cumulé</p>
          </div>
        </div>

        {/* Equity curve simplifié — pleine largeur, plus haut, sans texte SVG */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
          <p className="text-[13px] font-bold text-zinc-400 uppercase tracking-wider text-center mb-3">
            Equity cumulée (en R)
          </p>
          <svg viewBox="0 0 320 130" width="100%" fill="none" aria-label="Equity curve">
            {/* Grille discrète */}
            <line x1={0} y1={118} x2={320} y2={118} stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" opacity="0.8" />
            <line x1={0} y1={36}  x2={320} y2={36}  stroke="#27272a" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.6" />
            {/* Fill area */}
            <path
              d="M0,118 L32,90 L64,68 L96,46 L128,60 L160,74 L192,60 L224,74 L256,90 L288,74 L320,28 L320,118 Z"
              fill="#10b98115"
            />
            {/* Curve épaisse */}
            <path
              d="M0,118 L32,90 L64,68 L96,46 L128,60 L160,74 L192,60 L224,74 L256,90 L288,74 L320,28"
              stroke="#10b981" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
            />
            {/* Drawdown segment T3→T5 */}
            <path d="M96,46 L128,60 L160,74"
              stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.85"
            />
            {/* Markers gros */}
            <circle cx={96} cy={46} r="6" fill="#10b981" stroke="#09090b" strokeWidth="2" />
            <circle cx={160} cy={74} r="6" fill="#ef4444" stroke="#09090b" strokeWidth="2" />
            <circle cx={320} cy={28} r="6" fill="#10b981" stroke="#09090b" strokeWidth="2" />
          </svg>
          {/* Legend hors SVG, gros texte */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex items-center gap-2">
              <span className="shrink-0 w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-[13px] text-emerald-400 font-bold">Best +5R</span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="shrink-0 w-3 h-3 rounded-full bg-red-400" />
              <span className="text-[13px] text-red-400 font-bold">Drawdown −2R</span>
            </div>
          </div>
        </div>

        {/* Table 10 trades — colonnes optimisées, noms complets */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-[48px_1fr_40px_56px] gap-1.5 px-2.5 py-2.5 bg-zinc-900 border-b border-zinc-800 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
            <span>Date</span>
            <span>Setup</span>
            <span className="text-center">R/R</span>
            <span className="text-right">Résult.</span>
          </div>
          <div className="divide-y divide-zinc-800/70">
            {TRADES.map((t, i) => (
              <div
                key={i}
                className={`grid grid-cols-[48px_1fr_40px_56px] gap-1.5 px-2.5 py-2.5 items-center text-[14px] ${
                  t.win ? "bg-emerald-500/[0.05]" : "bg-red-500/[0.05]"
                }`}
              >
                <span className="text-zinc-400 font-mono text-[12px]">{t.date}</span>
                <span className="text-white font-medium text-[13px] leading-tight">{t.setup}</span>
                <span className="text-center text-zinc-500 font-mono text-[12px]">{t.rr}</span>
                <span className={`text-right font-bold font-mono ${t.win ? "text-emerald-400" : "text-red-400"}`}>
                  {t.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights — 3 cartes, texte aggressif */}
        <div className="space-y-2.5">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-3">
            <p className="text-[14px] font-bold text-emerald-400">✓ Setup le plus rentable</p>
            <p className="text-[14px] text-white leading-snug mt-1">OB Bullish — <span className="font-bold text-emerald-400">3/3 gagnants</span></p>
            <p className="text-[13px] text-zinc-400 leading-snug mt-0.5">Ratio moyen : +1.83R / trade</p>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-3">
            <p className="text-[14px] font-bold text-red-400">✗ Setup à éviter</p>
            <p className="text-[14px] text-white leading-snug mt-1">Range Break — <span className="font-bold text-red-400">0/2 gagnants</span></p>
            <p className="text-[13px] text-zinc-400 leading-snug mt-0.5">À supprimer du plan de trading</p>
          </div>
          <div className="rounded-xl border border-blue-400/30 bg-blue-500/8 p-3">
            <p className="text-[14px] font-bold text-blue-400">⚠ Erreur récurrente</p>
            <p className="text-[14px] text-white leading-snug mt-1">SL trop serré — <span className="font-bold text-blue-400">3 trades</span> stoppés</p>
            <p className="text-[13px] text-zinc-400 leading-snug mt-0.5">Revoir sizing et placement du SL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
