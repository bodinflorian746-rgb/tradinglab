interface PastilleProps {
  x: number;
  y: number;
  label: string;
  color: string;
  textColor?: string;
}

// Petite étiquette type "pill" centrée sur (x, y) — pattern visuel EdgeTrade.
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

// Pastille de signal — plus grande et plus visible que les pastilles de point.
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

export default function RSIDivergenceDiagram() {
  // ─── DIVERGENCE BAISSIÈRE (gauche) ─── x = 30 → 385
  // Prix : 2 sommets ascendants HH (emerald-500)
  const priceBearPts: [number, number][] = [
    [40, 215],   // début
    [75, 185],   // ascension
    [130, 130],  // Sommet 1
    [200, 175],  // pullback
    [290, 95],   // Sommet 2 (HH plus haut)
    [370, 145],  // continuation
  ];

  // RSI : 2 sommets descendants LH (red-500)
  const rsiBearPts: [number, number][] = [
    [40, 350],
    [75, 320],
    [130, 275],  // RSI Sommet 1 (plus haut)
    [200, 335],
    [290, 305],  // RSI Sommet 2 (LH plus bas)
    [370, 345],
  ];

  // ─── DIVERGENCE HAUSSIÈRE (droite) ─── x = 435 → 785
  // Prix : 2 creux descendants LL (red-500)
  const priceBullPts: [number, number][] = [
    [445, 95],
    [475, 130],
    [530, 175],  // Creux 1
    [605, 130],  // pullback
    [690, 215],  // Creux 2 (LL plus bas)
    [775, 165],  // continuation
  ];

  // RSI : 2 creux ascendants HL (emerald-500)
  const rsiBullPts: [number, number][] = [
    [445, 290],
    [475, 320],
    [530, 365],  // RSI Creux 1 (plus bas)
    [605, 320],
    [690, 330],  // RSI Creux 2 (HL plus haut)
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
      >
        {/* ════════════════════════════════════════════════════════════
            DIVERGENCE BAISSIÈRE (gauche)
            ════════════════════════════════════════════════════════════ */}

        <text x="205" y="22" fontSize="13" fontWeight="600" fill="#d4d4d8" textAnchor="middle">
          Divergence baissière — prix HH + RSI LH
        </text>

        {/* ── Panneau Prix (gauche, haut) ── */}
        <text x="34" y="55" fontSize="11" fill="#a1a1aa">Prix</text>

        {/* Tracé prix haussier */}
        <path d={buildPath(priceBearPts)} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Ligne de tendance prix (reliant les 2 sommets — ascendante) */}
        <line x1={priceBearPts[2][0]} y1={priceBearPts[2][1]} x2={priceBearPts[4][0]} y2={priceBearPts[4][1]}
              stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />

        {/* Points clés prix */}
        <circle cx={priceBearPts[2][0]} cy={priceBearPts[2][1]} r="3.5" fill="#10b981" />
        <circle cx={priceBearPts[4][0]} cy={priceBearPts[4][1]} r="3.5" fill="#10b981" />

        {/* Pastilles prix */}
        <Pastille x={130} y={113} label="Sommet 1" color="#10b981" />
        <Pastille x={290} y={78} label="Sommet 2 (HH)" color="#10b981" />

        {/* ── Séparateur prix/RSI ── */}
        <line x1="30" y1="245" x2="385" y2="245" stroke="#27272a" strokeWidth="1" />

        {/* ── Panneau RSI (gauche, bas) ── */}
        <text x="34" y="263" fontSize="11" fill="#a1a1aa">RSI</text>

        {/* Lignes guides 30 / 70 */}
        <line x1="30" y1="290" x2="385" y2="290" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="30" y1="395" x2="385" y2="395" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        <text x="33" y="288" fontSize="10" fill="#71717a">70</text>
        <text x="33" y="406" fontSize="10" fill="#71717a">30</text>

        {/* Tracé RSI (rouge — séquence de sommets descendants) */}
        <path d={buildPath(rsiBearPts)} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Ligne de tendance RSI (descendante — LH) */}
        <line x1={rsiBearPts[2][0]} y1={rsiBearPts[2][1]} x2={rsiBearPts[4][0]} y2={rsiBearPts[4][1]}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />

        {/* Points clés RSI */}
        <circle cx={rsiBearPts[2][0]} cy={rsiBearPts[2][1]} r="3.5" fill="#ef4444" />
        <circle cx={rsiBearPts[4][0]} cy={rsiBearPts[4][1]} r="3.5" fill="#ef4444" />

        {/* Pastilles RSI */}
        <Pastille x={130} y={258} label="RSI Sommet 1" color="#ef4444" />
        <Pastille x={290} y={288} label="RSI Sommet 2 (LH)" color="#ef4444" />

        {/* ── Pastille signal ── */}
        <SignalPastille x={205} y={445} label="DIVERGENCE BAISSIÈRE" color="#ef4444" />

        {/* ════════════════════════════════════════════════════════════
            Séparateur vertical entre les 2 schémas
            ════════════════════════════════════════════════════════════ */}
        <line x1="410" y1="20" x2="410" y2="480" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        {/* ════════════════════════════════════════════════════════════
            DIVERGENCE HAUSSIÈRE (droite)
            ════════════════════════════════════════════════════════════ */}

        <text x="605" y="22" fontSize="13" fontWeight="600" fill="#d4d4d8" textAnchor="middle">
          Divergence haussière — prix LL + RSI HL
        </text>

        {/* ── Panneau Prix (droite, haut) ── */}
        <text x="439" y="55" fontSize="11" fill="#a1a1aa">Prix</text>

        {/* Tracé prix baissier */}
        <path d={buildPath(priceBullPts)} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Ligne de tendance prix (descendante) */}
        <line x1={priceBullPts[2][0]} y1={priceBullPts[2][1]} x2={priceBullPts[4][0]} y2={priceBullPts[4][1]}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />

        {/* Points clés prix */}
        <circle cx={priceBullPts[2][0]} cy={priceBullPts[2][1]} r="3.5" fill="#ef4444" />
        <circle cx={priceBullPts[4][0]} cy={priceBullPts[4][1]} r="3.5" fill="#ef4444" />

        {/* Pastilles prix */}
        <Pastille x={530} y={195} label="Creux 1" color="#ef4444" />
        <Pastille x={690} y={232} label="Creux 2 (LL)" color="#ef4444" />

        {/* ── Séparateur prix/RSI ── */}
        <line x1="430" y1="245" x2="785" y2="245" stroke="#27272a" strokeWidth="1" />

        {/* ── Panneau RSI (droite, bas) ── */}
        <text x="439" y="263" fontSize="11" fill="#a1a1aa">RSI</text>

        {/* Lignes guides 30 / 70 */}
        <line x1="430" y1="290" x2="785" y2="290" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="430" y1="395" x2="785" y2="395" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" />
        <text x="433" y="288" fontSize="10" fill="#71717a">70</text>
        <text x="433" y="406" fontSize="10" fill="#71717a">30</text>

        {/* Tracé RSI (vert — séquence de creux ascendants) */}
        <path d={buildPath(rsiBullPts)} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Ligne de tendance RSI (ascendante — HL) */}
        <line x1={rsiBullPts[2][0]} y1={rsiBullPts[2][1]} x2={rsiBullPts[4][0]} y2={rsiBullPts[4][1]}
              stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" />

        {/* Points clés RSI */}
        <circle cx={rsiBullPts[2][0]} cy={rsiBullPts[2][1]} r="3.5" fill="#10b981" />
        <circle cx={rsiBullPts[4][0]} cy={rsiBullPts[4][1]} r="3.5" fill="#10b981" />

        {/* Pastilles RSI */}
        <Pastille x={530} y={385} label="RSI Creux 1" color="#10b981" />
        <Pastille x={690} y={350} label="RSI Creux 2 (HL)" color="#10b981" />

        {/* ── Pastille signal ── */}
        <SignalPastille x={605} y={445} label="DIVERGENCE HAUSSIÈRE" color="#10b981" />
      </svg>
    </div>
  );
}
