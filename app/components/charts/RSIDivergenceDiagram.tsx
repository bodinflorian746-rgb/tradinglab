interface PastilleProps {
  x: number;
  y: number;
  label: string;
  color: string;
  textColor?: string;
}

function Pastille({ x, y, label, color, textColor }: PastilleProps) {
  const width = label.length * 6.2 + 12;
  const height = 18;
  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx="3"
        fill="#09090b"
        fillOpacity="0.85"
        stroke={color}
        strokeWidth="1"
      />
      <text
        x={x}
        y={y + 4}
        fontSize="11"
        fontWeight="500"
        fill={textColor ?? color}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}

function SignalPastille({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  const width = label.length * 7.4 + 22;
  const height = 26;
  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx="4"
        fill="#09090b"
        fillOpacity="0.85"
        stroke={color}
        strokeWidth="1.5"
      />
      <text
        x={x}
        y={y + 5}
        fontSize="12"
        fontWeight="700"
        fill="#fafafa"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        {label}
      </text>
    </g>
  );
}

export default function RSIDivergenceDiagram({ locale = "fr" }: { locale?: "fr" | "es" } = {}) {
  const isEs = locale === "es";
  const L = {
    titleBear:     isEs ? "Divergencia bajista — precio HH + RSI LH" : "Divergence baissière — prix HH + RSI LH",
    titleBull:     isEs ? "Divergencia alcista — precio LL + RSI HL" : "Divergence haussière — prix LL + RSI HL",
    price:         isEs ? "Precio" : "Prix",
    rsi:           "RSI",
    peak1:         isEs ? "Pico 1" : "Sommet 1",
    peak2HH:       isEs ? "Pico 2 (HH)" : "Sommet 2 (HH)",
    rsiPeak1:      isEs ? "RSI Pico 1" : "RSI Sommet 1",
    rsiPeak2LH:    isEs ? "RSI Pico 2 (LH)" : "RSI Sommet 2 (LH)",
    bottom1:       isEs ? "Mínimo 1" : "Creux 1",
    bottom2LL:     isEs ? "Mínimo 2 (LL)" : "Creux 2 (LL)",
    rsiBottom1:    isEs ? "RSI Mínimo 1" : "RSI Creux 1",
    rsiBottom2HL:  isEs ? "RSI Mínimo 2 (HL)" : "RSI Creux 2 (HL)",
    signalBear:    isEs ? "DIVERGENCIA BAJISTA" : "DIVERGENCE BAISSIÈRE",
    signalBull:    isEs ? "DIVERGENCIA ALCISTA" : "DIVERGENCE HAUSSIÈRE",
    mobTitle:      isEs ? "Divergencia RSI / Precio" : "Divergence RSI / Prix",
    mobBear:       isEs ? "Divergencia BAJISTA" : "Divergence BAISSIÈRE",
    mobBull:       isEs ? "Divergencia ALCISTA" : "Divergence HAUSSIÈRE",
    mobBearPre:    isEs ? "El precio hace un nuevo" : "Prix fait un nouveau",
    mobBearMid:    isEs ? ", pero el RSI hace un" : ", mais le RSI fait un",
    mobBearEnd:    isEs ? "(más bajo). El movimiento alcista se agota." : "(plus bas). Le mouvement haussier s'essouffle.",
    mobBullPre:    isEs ? "El precio hace un nuevo" : "Prix fait un nouveau",
    mobBullMid:    isEs ? ", pero el RSI hace un" : ", mais le RSI fait un",
    mobBullEnd:    isEs ? "(más alto). El movimiento bajista se agota." : "(plus haut). Le mouvement baissier s'essouffle.",
    mobFooter:     isEs ? "Señal de reversal potencial — esperar confirmación del precio." : "Signal de retournement potentiel — attendre confirmation prix.",
  };
  const priceBearPts: [number, number][] = [
    [40, 215],
    [75, 185],
    [130, 130],
    [200, 175],
    [290, 95],
    [370, 145],
  ];

  const rsiBearPts: [number, number][] = [
    [40, 350],
    [75, 320],
    [130, 275],
    [200, 335],
    [290, 305],
    [370, 345],
  ];

  const priceBullPts: [number, number][] = [
    [445, 95],
    [475, 130],
    [530, 175],
    [605, 130],
    [690, 215],
    [775, 165],
  ];

  const rsiBullPts: [number, number][] = [
    [445, 290],
    [475, 320],
    [530, 365],
    [605, 320],
    [690, 330],
    [775, 305],
  ];

  const buildPath = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  return (
    <div>
      <svg
        width="100%"
        viewBox="0 0 800 500"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden sm:block"
      >
        <text x="205" y="22" fontSize="13" fontWeight="600" fill="#d4d4d8" textAnchor="middle">
          {L.titleBear}
        </text>

        <text x="34" y="55" fontSize="11" fill="#a1a1aa">{L.price}</text>

        <path d={buildPath(priceBearPts)} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        <line x1={priceBearPts[2][0]} y1={priceBearPts[2][1]} x2={priceBearPts[4][0]} y2={priceBearPts[4][1]}
              stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />

        <circle cx={priceBearPts[2][0]} cy={priceBearPts[2][1]} r="3.5" fill="#10b981" />
        <circle cx={priceBearPts[4][0]} cy={priceBearPts[4][1]} r="3.5" fill="#10b981" />

        <Pastille x={130} y={113} label={L.peak1} color="#10b981" />
        <Pastille x={290} y={78} label={L.peak2HH} color="#10b981" />

        <line x1="30" y1="245" x2="385" y2="245" stroke="#27272a" strokeWidth="1" />

        <text x="34" y="263" fontSize="11" fill="#a1a1aa">{L.rsi}</text>

        <line x1="30" y1="290" x2="385" y2="290" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="30" y1="395" x2="385" y2="395" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        <text x="33" y="288" fontSize="10" fill="#71717a">70</text>
        <text x="33" y="406" fontSize="10" fill="#71717a">30</text>

        <path d={buildPath(rsiBearPts)} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        <line x1={rsiBearPts[2][0]} y1={rsiBearPts[2][1]} x2={rsiBearPts[4][0]} y2={rsiBearPts[4][1]}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />

        <circle cx={rsiBearPts[2][0]} cy={rsiBearPts[2][1]} r="3.5" fill="#ef4444" />
        <circle cx={rsiBearPts[4][0]} cy={rsiBearPts[4][1]} r="3.5" fill="#ef4444" />

        <Pastille x={130} y={258} label={L.rsiPeak1} color="#ef4444" />
        <Pastille x={290} y={288} label={L.rsiPeak2LH} color="#ef4444" />

        <SignalPastille x={205} y={445} label={L.signalBear} color="#ef4444" />

        <line x1="410" y1="20" x2="410" y2="480" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        <text x="605" y="22" fontSize="13" fontWeight="600" fill="#d4d4d8" textAnchor="middle">
          {L.titleBull}
        </text>

        <text x="439" y="55" fontSize="11" fill="#a1a1aa">{L.price}</text>

        <path d={buildPath(priceBullPts)} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        <line x1={priceBullPts[2][0]} y1={priceBullPts[2][1]} x2={priceBullPts[4][0]} y2={priceBullPts[4][1]}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />

        <circle cx={priceBullPts[2][0]} cy={priceBullPts[2][1]} r="3.5" fill="#ef4444" />
        <circle cx={priceBullPts[4][0]} cy={priceBullPts[4][1]} r="3.5" fill="#ef4444" />

        <Pastille x={530} y={195} label={L.bottom1} color="#ef4444" />
        <Pastille x={690} y={232} label={L.bottom2LL} color="#ef4444" />

        <line x1="430" y1="245" x2="785" y2="245" stroke="#27272a" strokeWidth="1" />

        <text x="439" y="263" fontSize="11" fill="#a1a1aa">{L.rsi}</text>

        <line x1="430" y1="290" x2="785" y2="290" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="430" y1="395" x2="785" y2="395" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        <text x="433" y="288" fontSize="10" fill="#71717a">70</text>
        <text x="433" y="406" fontSize="10" fill="#71717a">30</text>

        <path d={buildPath(rsiBullPts)} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        <line x1={rsiBullPts[2][0]} y1={rsiBullPts[2][1]} x2={rsiBullPts[4][0]} y2={rsiBullPts[4][1]}
              stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />

        <circle cx={rsiBullPts[2][0]} cy={rsiBullPts[2][1]} r="3.5" fill="#10b981" />
        <circle cx={rsiBullPts[4][0]} cy={rsiBullPts[4][1]} r="3.5" fill="#10b981" />

        <Pastille x={530} y={385} label={L.rsiBottom1} color="#10b981" />
        <Pastille x={690} y={350} label={L.rsiBottom2HL} color="#10b981" />

        <SignalPastille x={605} y={445} label={L.signalBull} color="#10b981" />
      </svg>

      {/* MOBILE : divergence RSI ────────────────────────────── */}
      <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">{L.mobBear}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobBearPre} <span className="font-bold">HH</span>{L.mobBearMid} <span className="font-bold">LH</span> {L.mobBearEnd}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{L.mobBull}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobBullPre} <span className="font-bold">LL</span>{L.mobBullMid} <span className="font-bold">HL</span> {L.mobBullEnd}</p>
        </div>
        <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
          {L.mobFooter}
        </p>
      </div>
    </div>
  );
}
