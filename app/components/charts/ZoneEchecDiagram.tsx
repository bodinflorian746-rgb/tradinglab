// Diagramme : une zone peut échouer (Leçon 4 multi-timeframe)
// XAU/USD M5 — 9 bougies baissières traversent un support H1 sans aucune mèche de rejet,
// la continuation s'enchaîne franchement sous la zone = setup invalidé.

interface ZoneEchecDiagramProps {
  className?: string;
}

type CandleSpec = {
  cx: number;
  wickTop: number;
  wickBottom: number;
  bodyY: number;
  bodyH: number;
};

// 9 bougies bearish, sommets de 70 (haut du graphe) jusqu'à 270 (bas)
const CANDLES: CandleSpec[] = [
  { cx:  90, wickTop:  70, wickBottom: 109, bodyY:  76, bodyH: 28 },
  { cx: 149, wickTop:  95, wickBottom: 134, bodyY: 101, bodyH: 28 },
  { cx: 208, wickTop: 120, wickBottom: 159, bodyY: 126, bodyH: 28 },
  { cx: 266, wickTop: 145, wickBottom: 184, bodyY: 151, bodyH: 28 },
  { cx: 325, wickTop: 170, wickBottom: 209, bodyY: 176, bodyH: 28 },
  { cx: 384, wickTop: 195, wickBottom: 234, bodyY: 201, bodyH: 28 },
  { cx: 443, wickTop: 220, wickBottom: 259, bodyY: 226, bodyH: 28 },
  { cx: 501, wickTop: 245, wickBottom: 284, bodyY: 251, bodyH: 28 },
  { cx: 560, wickTop: 270, wickBottom: 306, bodyY: 276, bodyH: 25 },
];

const BODY_W = 14;

export function ZoneEchecDiagram({ className = "" }: ZoneEchecDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M5</text>

        {/* Bande support H1 — y=150 à y=185 */}
        <rect x="60" y="150" width="580" height="35" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        {/* Label "Support H1 — 4 545 $" à gauche au-dessus de la bande */}
        <rect x="60" y="135" width="148" height="13" rx="3" fill="#09090b" />
        <text x="134" y="145" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Support H1 — 4 545 $</text>

        {/* 9 bougies bearish — aucune mèche basse de rejet, traversée nette */}
        {CANDLES.map(({ cx, wickTop, wickBottom, bodyY, bodyH }, i) => (
          <g key={i}>
            <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
            <rect x={cx - BODY_W / 2} y={bodyY} width={BODY_W} height={bodyH} fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
          </g>
        ))}

        {/* Annotation */}
        <rect x="190" y="288" width="320" height="22" rx="11" fill="#09090b" />
        <rect x="190" y="288" width="320" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="302" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Pas de réaction = pas d&apos;entrée
        </text>
      </svg>

      {/* MOBILE : zone qui échoue ───────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-red-400 text-center">Zone qui échoue — setup invalidé</p>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">Prix traverse la zone sans réaction</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Pas de mèche de rejet, pas de signal LTF → la zone ne tient pas.</p>
        </div>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">Continuation bearish = setup invalidé</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Le prix continue en chute après la zone → pas d'entrée short, sortir si déjà entré.</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Prix qui traverse la zone sans réaction</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Continuation bearish = setup invalidé</span>
        </div>
      </div>
    </div>
  );
}
