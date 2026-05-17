export default function PinBarLocationDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Le niveau, pas la bougie
      </text>

      {/* Résistance forte */}
      <line x1="50" y1="100" x2="780" y2="100" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="52" y="86" width="156" height="12" rx="2" fill="#09090b" />
      <text x="55" y="95" fill="#ef4444" fontSize="9" fontWeight="600">Résistance forte — 4 650$</text>

      {/* Support fort */}
      <line x1="50" y1="300" x2="780" y2="300" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="52" y="311" width="140" height="12" rx="2" fill="#09090b" />
      <text x="55" y="320" fill="#10b981" fontSize="9" fontWeight="600">Support fort — 4 500$</text>

      {/* Zone middle */}
      <rect x="50" y="180" width="730" height="40" fill="#71717a10" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <text x="65" y="205" fill="#71717a" fontSize="8" fontStyle="italic">Range / middle</text>

      {/* Path prix oscillant entre les niveaux */}
      <path d="M70,290 L130,100 L200,200 L270,300 L340,200 L410,100 L480,200 L550,300 L620,200 L690,290" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.5" />

      {/* Pin bar 1 — au support */}
      <line x1="130" y1="290" x2="130" y2="345" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="122" y="290" width="16" height="12" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />
      <circle cx="130" cy="298" r="8" fill="#10b981" opacity="0.3" />
      <rect x="85" y="350" width="90" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="130" y="365" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">✓ Tradable</text>

      {/* Pin bar 2 — à la résistance */}
      <line x1="410" y1="100" x2="410" y2="55" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
      <rect x="402" y="98" width="16" height="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1" />
      <circle cx="410" cy="98" r="8" fill="#ef4444" opacity="0.3" />
      <rect x="365" y="33" width="90" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="410" y="48" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">✓ Tradable</text>

      {/* Pin bar 3 — au milieu du range */}
      <line x1="620" y1="200" x2="620" y2="240" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
      <rect x="612" y="200" width="16" height="10" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />
      <circle cx="620" cy="220" r="8" fill="#ef4444" opacity="0.3" />
      <rect x="575" y="245" width="90" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="620" y="260" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">✗ Hors niveau</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Pin bar = signal de confirmation à un niveau. Sans niveau, c&apos;est du bruit.
      </text>
    </svg>
  );
}
