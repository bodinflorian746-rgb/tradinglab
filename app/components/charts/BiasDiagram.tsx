type C = { cx: number; wt: number; bt: number; bb: number; wb: number; bull: boolean };

function MC({ cx, wt, bt, bb, wb, bull }: C) {
  return (
    <g>
      <line x1={cx} y1={wt} x2={cx} y2={wb}
        stroke={bull ? "#059669" : "#b91c1c"} strokeWidth="1.5" strokeLinecap="round" />
      <rect x={cx - 9} y={bt} width="18" height={Math.max(bb - bt, 3)}
        fill={bull ? "#10b981" : "#ef4444"} rx="2" />
    </g>
  );
}

const HIDE_DETAIL_MOBILE = `@media (max-width: 640px) { .chart-detail-labels { display: none; } }`;

function FomoChart() {
  const greens: C[] = [
    { cx: 32,  wt: 106, bt: 110, bb: 126, wb: 130, bull: true },
    { cx: 64,  wt: 90,  bt: 94,  bb: 110, wb: 114, bull: true },
    { cx: 96,  wt: 74,  bt: 78,  bb: 94,  wb: 98,  bull: true },
    { cx: 128, wt: 58,  bt: 62,  bb: 78,  wb: 82,  bull: true },
    { cx: 160, wt: 42,  bt: 46,  bb: 62,  wb: 66,  bull: true },
  ];
  const reds: C[] = [
    { cx: 192, wt: 50,  bt: 56,  bb: 76,  wb: 80,  bull: false },
    { cx: 224, wt: 68,  bt: 74,  bb: 96,  wb: 100, bull: false },
    { cx: 256, wt: 86,  bt: 92,  bb: 114, wb: 118, bull: false },
    { cx: 288, wt: 104, bt: 110, bb: 128, wb: 132, bull: false },
  ];
  return (
    <svg viewBox="0 0 320 140" width="100%" fill="none">
      <style>{HIDE_DETAIL_MOBILE}</style>
      {greens.map((c, i) => <MC key={i} {...c} />)}
      {/* Mobile : marker discret au point de FOMO */}
      <circle cx={160} cy={42} r="6" fill="#09090b" stroke="#f87171" strokeWidth="2" />
      <text x={160} y={46} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="700">!</text>
      <g className="chart-detail-labels">
        <rect x={112} y={22} width={96} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={160} y={33} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="700">TU ACHÈTES ICI</text>
        <line x1={160} y1={37} x2={160} y2={42} stroke="#f87171" strokeWidth="1" />
      </g>
      {reds.map((c, i) => <MC key={i} {...c} />)}
      <g className="chart-detail-labels">
        <rect x={264} y={121} width={46} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={287} y={132} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="700">−5%</text>
      </g>
    </svg>
  );
}

function VengeanceChart() {
  const t1: C[] = [
    { cx: 28, wt: 46, bt: 51, bb: 70,  wb: 74,  bull: false },
    { cx: 58, wt: 58, bt: 63, bb: 84,  wb: 88,  bull: false },
    { cx: 88, wt: 72, bt: 77, bb: 98,  wb: 102, bull: false },
  ];
  const t2: C[] = [
    { cx: 170, wt: 36,  bt: 42,  bb: 78,  wb: 84,  bull: false },
    { cx: 206, wt: 62,  bt: 68,  bb: 106, wb: 112, bull: false },
    { cx: 242, wt: 88,  bt: 94,  bb: 128, wb: 134, bull: false },
  ];
  return (
    <svg viewBox="0 0 320 140" width="100%" fill="none">
      <style>{HIDE_DETAIL_MOBILE}</style>
      {t1.map((c, i) => <MC key={i} {...c} />)}
      <g className="chart-detail-labels">
        <rect x={97} y={72} width={34} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={114} y={83} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="700">−1R</text>
        <line x1={136} y1={79} x2={152} y2={79} stroke="#71717a" strokeWidth="1.2" />
        <path d="M148 75 L155 79 L148 83" stroke="#71717a" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      </g>
      {t2.map((c, i) => <MC key={i} {...c} />)}
      <g className="chart-detail-labels">
        <rect x={252} y={97} width={34} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={269} y={108} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="700">−3R</text>
        <rect x={78} y={122} width={164} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={160} y={133} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="700">Total : −4R en 2 trades</text>
      </g>
    </svg>
  );
}

function AncrageChart() {
  const candles: C[] = [
    { cx: 32,  wt: 50,  bt: 55,  bb: 72,  wb: 76,  bull: true  },
    { cx: 68,  wt: 63,  bt: 68,  bb: 87,  wb: 91,  bull: false },
    { cx: 102, wt: 78,  bt: 83,  bb: 102, wb: 106, bull: false },
    { cx: 136, wt: 94,  bt: 99,  bb: 118, wb: 122, bull: false },
    { cx: 170, wt: 108, bt: 113, bb: 130, wb: 134, bull: false },
  ];
  return (
    <svg viewBox="0 0 320 142" width="100%" fill="none">
      <style>{HIDE_DETAIL_MOBILE}</style>
      <line x1={10} y1={90}  x2={310} y2={90}  stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
      <line x1={10} y1={116} x2={310} y2={116} stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      {candles.map((c, i) => <MC key={i} {...c} />)}
      <g className="chart-detail-labels">
        <rect x={8}   y={35}  width={48}  height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={32}  y={46}  textAnchor="middle" fontSize="8.5" fill="#71717a" fontWeight="700">ENTRÉE</text>
        <line x1={32} y1={50} x2={32} y2={55} stroke="#71717a" strokeWidth="1" />
        <rect x={220} y={81}  width={56}  height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={248} y={92}  textAnchor="middle" fontSize="8" fill="#f87171">SL initial ✓</text>
        <rect x={82}  y={102} width={118} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={141} y={113} textAnchor="middle" fontSize="8.5" fill="#60a5fa" fontWeight="700">Tu déplaces le SL ↓</text>
        <rect x={148} y={127} width={160} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={228} y={138} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="700">−5R au lieu de −1R</text>
      </g>
    </svg>
  );
}

function OverconfidenceChart() {
  const wins: C[] = [
    { cx: 28,  wt: 82, bt: 86, bb: 100, wb: 104, bull: true },
    { cx: 58,  wt: 76, bt: 80, bb: 94,  wb: 98,  bull: true },
    { cx: 88,  wt: 70, bt: 74, bb: 88,  wb: 92,  bull: true },
    { cx: 118, wt: 64, bt: 68, bb: 82,  wb: 86,  bull: true },
  ];
  return (
    <svg viewBox="0 0 320 140" width="100%" fill="none">
      <style>{HIDE_DETAIL_MOBILE}</style>
      {wins.map((c, i) => (
        <g key={i}>
          <MC {...c} />
          <g className="chart-detail-labels">
            <rect x={c.cx - 14} y={c.wt - 17} width={28} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
            <text x={c.cx} y={c.wt - 6} textAnchor="middle" fontSize="8.5" fill="#34d399" fontWeight="700">+1R</text>
          </g>
        </g>
      ))}
      <line x1={136} y1={80} x2={154} y2={80} stroke="#71717a" strokeWidth="1.2" />
      <path d="M150 76 L157 80 L150 84" stroke="#71717a" strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      <MC cx={210} wt={24} bt={30} bb={120} wb={126} bull={false} />
      <g className="chart-detail-labels">
        <rect x={186} y={10} width={48} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={210} y={21} textAnchor="middle" fontSize="9" fill="#f87171" fontWeight="700">−5R</text>
        <line x1={210} y1={24} x2={210} y2={30} stroke="#f87171" strokeWidth="1" />
        <rect x={228} y={60} width={88} height={26} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={272} y={72} textAnchor="middle" fontSize="8" fill="#71717a">Tu effaces</text>
        <text x={272} y={83} textAnchor="middle" fontSize="8" fill="#71717a">3 semaines de gains</text>
      </g>
    </svg>
  );
}

// ── Bullet legend mobile-only sous chaque chart ──────────────────────────────
function MobileBullets({ items }: { items: { color: string; text: string }[] }) {
  return (
    <ul className="sm:hidden mt-2 space-y-1 text-[12px] leading-snug">
      {items.map((b, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className={`shrink-0 font-bold ${b.color}`}>●</span>
          <span className="text-zinc-300">{b.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function BiasDiagram() {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center py-3 border-b border-zinc-800/60">
        LES 4 BIAIS PSYCHOLOGIQUES — SCÉNARIOS TYPIQUES
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="p-4 sm:p-3 border-b sm:border-r border-zinc-800">
          <p className="text-[13px] sm:text-[10px] font-bold text-red-400 uppercase tracking-wide mb-2">FOMO — Tu achètes au sommet</p>
          <FomoChart />
          <MobileBullets items={[
            { color: "text-red-400", text: "Tu entres en panique au point haut (marqué !)" },
            { color: "text-red-400", text: "Le prix retourne immédiatement → −5%" },
          ]} />
          <p className="hidden sm:block text-[9px] text-zinc-500 mt-1.5 leading-snug">Le marché monte fort, tu rentres en panique au sommet, le prix retourne immédiatement</p>
        </div>
        <div className="p-4 sm:p-3 border-b border-zinc-800">
          <p className="text-[13px] sm:text-[10px] font-bold text-red-400 uppercase tracking-wide mb-2">VENGEANCE — Tu doubles après une perte</p>
          <VengeanceChart />
          <MobileBullets items={[
            { color: "text-red-400", text: "1er trade perdu : −1R" },
            { color: "text-red-400", text: "Tu rouvres immédiatement plus gros : −3R" },
            { color: "text-red-400", text: "Total : −4R en 2 trades, sous le coup de l'émotion" },
          ]} />
          <p className="hidden sm:block text-[9px] text-zinc-500 mt-1.5 leading-snug">Tu perds, tu rouvres immédiatement plus gros pour récupérer, tu perds plus</p>
        </div>
        <div className="p-4 sm:p-3 border-b sm:border-b-0 sm:border-r border-zinc-800">
          <p className="text-[13px] sm:text-[10px] font-bold text-blue-400 uppercase tracking-wide mb-2">ANCRAGE — Tu refuses de fermer un trade perdant</p>
          <AncrageChart />
          <MobileBullets items={[
            { color: "text-blue-400", text: "Le prix descend, tu déplaces le SL au lieu de couper" },
            { color: "text-red-400", text: "Au final : −5R au lieu du −1R initialement prévu" },
          ]} />
          <p className="hidden sm:block text-[9px] text-zinc-500 mt-1.5 leading-snug">Tu refuses d'admettre la perte, tu déplaces le SL, la perte explose</p>
        </div>
        <div className="p-4 sm:p-3">
          <p className="text-[13px] sm:text-[10px] font-bold text-red-400 uppercase tracking-wide mb-2">OVERCONFIDENCE — Tu doubles la mise après plusieurs gains</p>
          <OverconfidenceChart />
          <MobileBullets items={[
            { color: "text-emerald-400", text: "4 gains d'affilée à +1R chacun" },
            { color: "text-red-400", text: "Tu doubles la mise → un seul trade perdu = −5R" },
            { color: "text-zinc-300", text: "Tu effaces des semaines de progression" },
          ]} />
          <p className="hidden sm:block text-[9px] text-zinc-500 mt-1.5 leading-snug">5 gains d'affilée → tu te crois invincible → tu doubles la mise → un seul trade efface tout</p>
        </div>
      </div>
    </div>
  );
}
