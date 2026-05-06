export const CorrelationMatrixDiagram = () => {
  const assets = ["EUR/USD", "GBP/USD", "USD/CHF", "XAU/USD", "DXY", "Nasdaq", "BTC/USD"];

  const matrix = [
    [+1.00, +0.85, -0.95, +0.40, -0.90, +0.50, +0.30],
    [+0.85, +1.00, -0.80, +0.35, -0.85, +0.45, +0.25],
    [-0.95, -0.80, +1.00, -0.40, +0.85, -0.45, -0.30],
    [+0.40, +0.35, -0.40, +1.00, -0.80, +0.30, +0.45],
    [-0.90, -0.85, +0.85, -0.80, +1.00, -0.60, -0.50],
    [+0.50, +0.45, -0.45, +0.30, -0.60, +1.00, +0.75],
    [+0.30, +0.25, -0.30, +0.45, -0.50, +0.75, +1.00],
  ];

  const colX = [235, 305, 375, 445, 515, 585, 655];
  const rowY = [134, 174, 214, 254, 294, 334, 374];

  const getCellStyle = (v: number, isDiag: boolean): { fill: string; fillOpacity: string } => {
    if (isDiag) return { fill: "#27272a", fillOpacity: "1" };
    if (v >= 0.70) return { fill: "#10b981", fillOpacity: "1" };
    if (v >= 0.40) return { fill: "#10b981", fillOpacity: "0.4" };
    if (v <= -0.70) return { fill: "#ef4444", fillOpacity: "1" };
    if (v <= -0.40) return { fill: "#ef4444", fillOpacity: "0.4" };
    return { fill: "#3f3f46", fillOpacity: "1" };
  };

  const isStrong = (v: number) => v >= 0.70 || v <= -0.70;
  const fmt = (v: number) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 800 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1 — Fond global */}
      <rect width="800" height="500" fill="#18181b" rx="8" />
      <rect width="800" height="500" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        Matrice des corrélations majeures
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        Qui bouge avec qui ? Qui bouge contre qui ?
      </text>

      {/* Layer 3 — Labels colonnes */}
      {assets.map((asset, col) => (
        <text key={`col-${col}`} x={colX[col]} y={95} fill="#60a5fa" fontSize="10" fontWeight="700" textAnchor="middle">
          {asset}
        </text>
      ))}

      {/* Layer 4 — Labels lignes */}
      {assets.map((asset, row) => (
        <text key={`row-${row}`} x={190} y={rowY[row]} fill="#60a5fa" fontSize="10" fontWeight="700" textAnchor="end">
          {asset}
        </text>
      ))}

      {/* Layer 5 — Cellules de la matrice (49 cellules) */}
      {matrix.map((rowData, row) =>
        rowData.map((v, col) => {
          const isDiag = col === row;
          const cellX = 200 + col * 70;
          const cellY = 110 + row * 40;
          const { fill, fillOpacity } = getCellStyle(v, isDiag);
          return (
            <g key={`cell-${row}-${col}`}>
              <rect
                x={cellX}
                y={cellY}
                width={70}
                height={40}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke="#27272a"
                strokeWidth="0.5"
              />
              {!isDiag && (
                <text
                  x={cellX + 35}
                  y={cellY + 25}
                  fill={isStrong(v) ? "white" : "#d4d4d8"}
                  fontSize="11"
                  fontWeight={isStrong(v) ? "700" : "400"}
                  textAnchor="middle"
                >
                  {fmt(v)}
                </text>
              )}
            </g>
          );
        })
      )}

      {/* Layer 6 — Légende */}
      <text x="400" y="415" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        LECTURE DE LA MATRICE
      </text>

      <rect x="170" y="433" width="14" height="14" rx="2" fill="#10b981" />
      <text x="195" y="444" fill="#d4d4d8" fontSize="11">Bougent ensemble</text>

      <rect x="350" y="433" width="14" height="14" rx="2" fill="#ef4444" />
      <text x="375" y="444" fill="#d4d4d8" fontSize="11">Bougent en sens inverse</text>

      <rect x="560" y="433" width="14" height="14" rx="2" fill="#3f3f46" />
      <text x="585" y="444" fill="#d4d4d8" fontSize="11">Pas de lien clair</text>

      {/* Layer 7 — Pied de page */}
      <text x="400" y="480" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        La diversification réelle commence quand les risques ne tombent pas ensemble.
      </text>
    </svg>
  );
};
