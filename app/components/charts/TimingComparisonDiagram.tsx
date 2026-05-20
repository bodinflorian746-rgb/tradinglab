// Diagramme : comparaison de réactions à la même résistance selon le timing (Leçon 3 ICT)
// EUR/USD — une même ligne de résistance testée 2 fois sur la même timeline : réaction molle
// hors Killzone (Asia, 03h UTC), puis réaction explosive en Killzone (London Open).

interface TimingComparisonDiagramProps {
  className?: string;
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
  // PARTIE GAUCHE — approche puis test 1 (Asia / 03h UTC) avec réaction molle
  { cx:  60, wickTop: 175, bodyY: 180, bodyH: 18, wickBottom: 210, type: "bull" },
  { cx:  90, wickTop: 145, bodyY: 150, bodyH: 30, wickBottom: 185, type: "bull" },
  { cx: 120, wickTop: 115, bodyY: 120, bodyH: 30, wickBottom: 155, type: "bull" },
  { cx: 150, wickTop:  85, bodyY: 100, bodyH: 22, wickBottom: 128, type: "bull" }, // touche la résistance
  { cx: 175, wickTop:  92, bodyY:  95, bodyH: 12, wickBottom: 115, type: "bear" }, // petite bougie de rejet molle
  { cx: 200, wickTop: 100, bodyY: 102, bodyH: 14, wickBottom: 122, type: "bear" }, // petite
  { cx: 225, wickTop: 110, bodyY: 116, bodyH: 10, wickBottom: 128, type: "bull" }, // petite
  { cx: 250, wickTop: 108, bodyY: 112, bodyH: 12, wickBottom: 128, type: "bear" }, // petite, reste collé sous la zone
  { cx: 275, wickTop: 112, bodyY: 116, bodyH: 10, wickBottom: 130, type: "bull" }, // petite
  { cx: 300, wickTop: 110, bodyY: 112, bodyH: 14, wickBottom: 128, type: "bear" }, // petite, latéralisation
  { cx: 325, wickTop: 108, bodyY: 114, bodyH: 10, wickBottom: 130, type: "bull" }, // petite

  // PARTIE DROITE — second test (London Open) avec sweep puis grande chute
  { cx: 360, wickTop:  98, bodyY: 102, bodyH: 18, wickBottom: 128, type: "bull" }, // remonte vers la zone
  { cx: 390, wickTop:  72, bodyY:  90, bodyH: 14, wickBottom: 110, type: "bull" }, // touche la zone (corps en bas)
  // SWEEP — mèche qui dépasse au-dessus de y=90
  { cx: 420, wickTop:  62, bodyY:  88, bodyH: 18, wickBottom: 112, type: "bear" }, // sweep + body referme sous la résistance
  // Grandes bougies baissières — réaction explosive
  { cx: 455, wickTop: 102, bodyY: 106, bodyH: 60, wickBottom: 172, type: "bear" },
  { cx: 490, wickTop: 165, bodyY: 168, bodyH: 50, wickBottom: 222, type: "bear" },
  { cx: 525, wickTop: 218, bodyY: 220, bodyH: 35, wickBottom: 258, type: "bear" },
  { cx: 560, wickTop: 252, bodyY: 254, bodyH: 18, wickBottom: 272, type: "bear" },
  { cx: 595, wickTop: 268, bodyY: 270, bodyH:  8, wickBottom: 280, type: "bear" },
];

const BODY_W = 12;
const RESISTANCE_Y = 90;

export function TimingComparisonDiagram({ className = "" }: TimingComparisonDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · M15</text>

        {/* Ligne de résistance unique */}
        <line x1="40" y1={RESISTANCE_Y} x2="660" y2={RESISTANCE_Y} stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="552" y="78" width="62" height="13" rx="3" fill="#09090b" />
        <text x="583" y="88" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">1.1780</text>

        {/* Séparateur visuel léger entre les deux tests */}
        <line x1="345" y1="48" x2="345" y2="278" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        {/* Étiquette test 1 — "Asia / 03h UTC" */}
        <rect x="120" y="48" width="110" height="14" rx="3" fill="#09090b" />
        <text x="175" y="58" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Asia / 03h UTC</text>

        {/* Étiquette test 2 — "London Open" */}
        <rect x="402" y="48" width="100" height="14" rx="3" fill="#09090b" />
        <rect x="402" y="48" width="100" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="452" y="58" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">London Open</text>

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

        {/* Étiquette "Réaction molle" sous le test 1 */}
        <rect x="142" y="210" width="100" height="14" rx="3" fill="#09090b" />
        <text x="192" y="220" fill="#71717a" fontSize="9" fontWeight="700" textAnchor="middle">Réaction molle</text>

        {/* Étiquette "Réaction explosive" sous le test 2 */}
        <rect x="425" y="248" width="120" height="14" rx="3" fill="#09090b" />
        <rect x="425" y="248" width="120" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="485" y="258" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Réaction explosive</text>

        {/* Annotation */}
        <rect x="195" y="290" width="310" height="22" rx="11" fill="#09090b" />
        <rect x="195" y="290" width="310" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Même setup. Timing différent.
        </text>
      </svg>

      {/* MOBILE : timing comparaison ───────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">Hors vs En Killzone · EUR/USD M15</p>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">✗ Hors Killzone</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Réaction molle, latéralisation, signaux peu fiables.</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">✓ En Killzone</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Sweep + impulsion franche, signaux clairs.</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-600" />
          <span className="text-[10px] text-zinc-500">Hors Killzone = réaction molle, latéralisation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">En Killzone = sweep + impulsion franche</span>
        </div>
      </div>
    </div>
  );
}
