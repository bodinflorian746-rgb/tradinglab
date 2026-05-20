type CD = { cx: number; wt: number; bt: number; bb: number; wb: number; bull: boolean };

function MiniCandle({ cx, wt, bt, bb, wb, bull }: CD) {
  return (
    <g>
      <line x1={cx} y1={wt} x2={cx} y2={wb}
        stroke={bull ? "#059669" : "#b91c1c"} strokeWidth="1.5" strokeLinecap="round" />
      <rect x={cx - 10} y={bt} width="20" height={Math.max(bb - bt, 3)}
        fill={bull ? "#10b981" : "#ef4444"} rx="2" />
    </g>
  );
}

const SY   = 205; // support level y
const SL_L = 228; // left zone SL (below support — logical)
const SL_R = 183; // right zone SL (above support — arbitrary)

// Left zone: logical SL
const LEFT: CD[] = [
  { cx: 60,  wt: 85,  bt: 95,  bb: 138, wb: 148, bull: true  },
  { cx: 98,  wt: 68,  bt: 78,  bb: 120, wb: 130, bull: true  },
  { cx: 136, wt: 78,  bt: 92,  bb: 158, wb: 168, bull: false },
  { cx: 174, wt: 118, bt: 130, bb: 188, wb: 198, bull: false },
  { cx: 212, wt: 142, bt: 155, bb: 195, wb: 210, bull: false },
  { cx: 250, wt: 148, bt: 158, bb: 200, wb: 215, bull: true  },
  { cx: 288, wt: 118, bt: 128, bb: 162, wb: 172, bull: true  },
  { cx: 326, wt: 96,  bt: 105, bb: 140, wb: 150, bull: true  },
];

const RIGHT: CD[] = [
  { cx: 498, wt: 85,  bt: 95,  bb: 138, wb: 148, bull: true  },
  { cx: 536, wt: 68,  bt: 78,  bb: 120, wb: 130, bull: true  },
  { cx: 574, wt: 78,  bt: 92,  bb: 158, wb: 168, bull: false },
  { cx: 612, wt: 118, bt: 130, bb: 188, wb: 198, bull: false },
  { cx: 650, wt: 148, bt: 158, bb: 200, wb: 210, bull: true  },
  { cx: 688, wt: 155, bt: 162, bb: 183, wb: 188, bull: false },
  { cx: 726, wt: 140, bt: 150, bb: 185, wb: 195, bull: true  },
  { cx: 764, wt: 110, bt: 120, bb: 155, wb: 165, bull: true  },
  { cx: 802, wt: 82,  bt: 92,  bb: 128, wb: 138, bull: true  },
];

// Mobile candles — simplified, 6 candles per scenario
type MC = { x: number; top: number; bot: number; bull: boolean };
const MOB_LEFT: MC[] = [
  { x: 16, top: 18, bot: 50, bull: true  },
  { x: 38, top: 22, bot: 56, bull: false },
  { x: 60, top: 30, bot: 68, bull: false },
  { x: 82, top: 42, bot: 72, bull: false }, // touches support
  { x: 104, top: 38, bot: 65, bull: true }, // bounces
  { x: 126, top: 18, bot: 48, bull: true },
];
const MOB_RIGHT: MC[] = [
  { x: 16, top: 18, bot: 50, bull: true  },
  { x: 38, top: 22, bot: 56, bull: false },
  { x: 60, top: 30, bot: 68, bull: false },
  { x: 82, top: 50, bot: 72, bull: true  }, // entry
  { x: 104, top: 60, bot: 68, bull: false }, // hits SL
  { x: 126, top: 18, bot: 45, bull: true },  // bounces without trader
];

function MobMiniCandle({ x, top, bot, bull }: MC) {
  return (
    <g>
      <line x1={x} y1={top - 4} x2={x} y2={bot + 4} stroke={bull ? "#059669" : "#b91c1c"} strokeWidth="1.2" strokeLinecap="round" />
      <rect x={x - 5} y={top} width={10} height={Math.max(bot - top, 3)} fill={bull ? "#10b981" : "#ef4444"} rx="1.5" />
    </g>
  );
}

interface StopLossChartDiagramProps {
  className?: string;
}

export function StopLossChartDiagram({ className = '' }: StopLossChartDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center py-3 border-b border-zinc-800/60">
        BTC / USD — placement du Stop Loss
      </p>

      {/* ── DESKTOP (inchangé) ───────────────────────────────────────── */}
      <div className="hidden sm:block">
        <svg
          width="100%"
          viewBox="0 0 900 280"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Comparaison bon vs mauvais placement de Stop Loss"
        >
          <rect x={15}  y={10} width={430} height={255} fill="#10b98106" />
          <rect x={455} y={10} width={430} height={255} fill="#ef444406" />

          <line x1={450} y1={10} x2={450} y2={270} stroke="#3f3f46" strokeWidth="1" />

          <line x1={15} y1={SY}   x2={440} y2={SY}   stroke="#71717a" strokeWidth="1.5" strokeDasharray="5 3" />
          <line x1={15} y1={SL_L} x2={440} y2={SL_L} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.75" />
          <line x1={455} y1={SY}   x2={885} y2={SY}   stroke="#71717a" strokeWidth="1.5" strokeDasharray="5 3" />
          <line x1={455} y1={SL_R} x2={885} y2={SL_R} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.75" />

          {LEFT.map((c, i) => <MiniCandle key={i} {...c} />)}
          {RIGHT.map((c, i) => <MiniCandle key={`r${i}`} {...c} />)}

          <circle cx={688} cy={SL_R} r="4.5" fill="#ef4444" opacity="0.9" />

          {/* LEFT — SL LOGIQUE */}
          <text x={225} y={24} textAnchor="middle" fontSize="10" fill="#34d399" fontWeight="600">
            SL LOGIQUE — SOUS UN SUPPORT
          </text>

          <rect x={218} y={130} width={64} height={14} rx="2" fill="#09090b" fillOpacity="0.88" />
          <text x={250} y={141} textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="700">ENTRÉE</text>

          <rect x={15} y={190} width={56} height={14} rx="2" fill="#09090b" fillOpacity="0.88" />
          <text x={43} y={201} textAnchor="middle" fontSize="9" fill="#71717a" fontWeight="600">Support</text>

          <rect x={15} y={214} width={116} height={14} rx="2" fill="#09090b" fillOpacity="0.88" />
          <text x={73} y={225} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="600">SL — sous support ✓</text>

          <line x1={375} y1={158} x2={375} y2={228} stroke="#3f3f46" strokeWidth="1" strokeDasharray="2 2" />
          <text x={382} y={197} fontSize="8" fill="#f87171" fontWeight="700">−1R</text>

          <text x={225} y={258} textAnchor="middle" fontSize="8.5" fill="#52525b">
            Si le support casse → SL déclenché normal
          </text>

          {/* RIGHT — SL ARBITRAIRE */}
          <text x={670} y={24} textAnchor="middle" fontSize="10" fill="#f87171" fontWeight="600">
            SL ARBITRAIRE — SANS LOGIQUE
          </text>

          <rect x={618} y={130} width={64} height={14} rx="2" fill="#09090b" fillOpacity="0.88" />
          <text x={650} y={141} textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="700">ENTRÉE</text>

          <rect x={455} y={190} width={56} height={14} rx="2" fill="#09090b" fillOpacity="0.88" />
          <text x={483} y={201} textAnchor="middle" fontSize="9" fill="#71717a" fontWeight="600">Support</text>

          <rect x={455} y={168} width={102} height={14} rx="2" fill="#09090b" fillOpacity="0.88" />
          <text x={506} y={179} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="600">SL — trop serré ✗</text>

          <line x1={835} y1={158} x2={835} y2={183} stroke="#3f3f46" strokeWidth="1" strokeDasharray="2 2" />
          <text x={842} y={174} fontSize="8" fill="#f87171" fontWeight="700">−1R</text>

          <rect x={690} y={54} width={152} height={14} rx="2" fill="#09090b" fillOpacity="0.88" />
          <text x={766} y={65} textAnchor="middle" fontSize="9" fill="#71717a" fontWeight="600">Le prix repart sans toi ↑</text>

          <text x={670} y={258} textAnchor="middle" fontSize="8.5" fill="#52525b">
            SL sans logique = souvent touché par fluctuation normale
          </text>
        </svg>

        <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-emerald-500/50" />
            <span className="text-[10px] text-zinc-500">Bon SL : sous un niveau structurel</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-red-500/50" />
            <span className="text-[10px] text-zinc-500">Mauvais SL : sans logique = sortie inutile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-zinc-600" />
            <span className="text-[10px] text-zinc-500">Toujours définir le SL AVANT d'entrer</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE (2 scénarios empilés, mini-SVG sans texte) ───────── */}
      <div className="sm:hidden p-4 space-y-3">
        {/* Scénario A — SL logique */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3">
          <p className="text-[13px] font-bold text-emerald-400 mb-2">SL logique — sous un support ✓</p>
          <svg viewBox="0 0 150 90" width="100%" fill="none" aria-label="SL placé sous support">
            {/* Support line */}
            <line x1={0} y1={68} x2={150} y2={68} stroke="#71717a" strokeWidth="1.2" strokeDasharray="4 3" />
            {/* SL line — sous support */}
            <line x1={0} y1={82} x2={150} y2={82} stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
            {MOB_LEFT.map((c, i) => <MobMiniCandle key={i} {...c} />)}
            {/* Marker entry sur candle 4 (bull) */}
            <circle cx={104} cy={38} r="4" fill="#34d399" stroke="#09090b" strokeWidth="1.5" />
          </svg>
          <div className="grid grid-cols-2 gap-1.5 mt-2 text-[12px]">
            <span className="text-zinc-400 flex items-center gap-1.5"><span className="w-3 h-px bg-zinc-500" />Support</span>
            <span className="text-red-400 flex items-center gap-1.5"><span className="w-3 h-px bg-red-400" />SL sous support</span>
          </div>
          <p className="text-[12px] text-emerald-400/80 mt-2 leading-snug">
            Si le support casse, le SL se déclenche. Sinon il tient.
          </p>
        </div>

        {/* Scénario B — SL arbitraire */}
        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-3">
          <p className="text-[13px] font-bold text-red-400 mb-2">SL arbitraire — trop serré ✗</p>
          <svg viewBox="0 0 150 90" width="100%" fill="none" aria-label="SL placé trop serré">
            {/* Support line */}
            <line x1={0} y1={68} x2={150} y2={68} stroke="#71717a" strokeWidth="1.2" strokeDasharray="4 3" />
            {/* SL line — trop serré, au-dessus du support */}
            <line x1={0} y1={62} x2={150} y2={62} stroke="#ef4444" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
            {MOB_RIGHT.map((c, i) => <MobMiniCandle key={i} {...c} />)}
            {/* Marker entry */}
            <circle cx={82} cy={50} r="4" fill="#34d399" stroke="#09090b" strokeWidth="1.5" />
            {/* SL hit marker */}
            <circle cx={104} cy={62} r="4" fill="#ef4444" stroke="#09090b" strokeWidth="1.5" />
          </svg>
          <div className="grid grid-cols-2 gap-1.5 mt-2 text-[12px]">
            <span className="text-zinc-400 flex items-center gap-1.5"><span className="w-3 h-px bg-zinc-500" />Support</span>
            <span className="text-red-400 flex items-center gap-1.5"><span className="w-3 h-px bg-red-400" />SL trop serré</span>
          </div>
          <p className="text-[12px] text-red-400/80 mt-2 leading-snug">
            Une fluctuation normale touche le SL → tu sors. Puis le prix repart sans toi.
          </p>
        </div>

        <p className="text-[12px] text-zinc-400 text-center pt-2 border-t border-zinc-800/50 italic">
          Toujours définir le SL <span className="text-white font-semibold">AVANT</span> d'entrer.
        </p>
      </div>
    </div>
  );
}
