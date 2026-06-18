// Jauge radiale SVG (pure, server-renderable) pour le score global.

export function ScoreGauge({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const size = 168;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const offset = circ * (1 - pct);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.45))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white tabular-nums leading-none">{value}</span>
        <span className="text-xs text-zinc-500 mt-1">/ {max}</span>
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}
