export default function InternalVsExternalStructureZoomDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Structure externe Daily ↔ Structure interne H4
      </text>

      {/* ═══ PANEL PRINCIPAL — Daily ═══ */}
      <rect x="20" y="45" width="80" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="60" y="59" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">DAILY</text>

      {/* Niveaux swing */}
      <line x1="20" y1="100" x2="500" y2="100" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <rect x="22" y="85" width="110" height="12" rx="2" fill="#09090b" />
      <text x="25" y="94" fill="#10b981" fontSize="9" fontWeight="600">Swing high 4 720$</text>

      <line x1="20" y1="320" x2="500" y2="320" stroke="#71717a" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <rect x="22" y="329" width="108" height="12" rx="2" fill="#09090b" />
      <text x="25" y="338" fill="#71717a" fontSize="9" fontWeight="600">Swing low 4 460$</text>

      {/* Path Daily : impulse haussière */}
      <path d="M40,320 L100,280 L160,240 L220,210 L280,170 L340,140 L400,110 L460,100" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="40" cy="320" r="5" fill="#10b981" />
      <circle cx="460" cy="100" r="5" fill="#10b981" />

      {/* Cadre pointillé sur portion centrale (zone zoomée) */}
      <rect x="200" y="155" width="180" height="100" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" />

      {/* Flèche connectrice */}
      <line x1="380" y1="200" x2="520" y2="200" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M512,196 L520,200 L512,204" stroke="#60a5fa" strokeWidth="1" fill="none" />

      {/* ═══ ENCART ZOOM — H4 ═══ */}
      <rect x="520" y="80" width="270" height="240" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="1" rx="4" />
      <rect x="528" y="90" width="60" height="18" rx="4" fill="#27272a" stroke="#60a5fa" strokeWidth="0.8" />
      <text x="558" y="103" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="middle">Zoom H4</text>

      {/* Niveaux H4 */}
      <line x1="540" y1="140" x2="775" y2="140" stroke="#10b981" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
      <rect x="720" y="127" width="58" height="11" rx="2" fill="#09090b" />
      <text x="775" y="135" fill="#10b981" fontSize="8" textAnchor="end">HH 4 640$</text>

      <line x1="540" y1="280" x2="775" y2="280" stroke="#71717a" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
      <rect x="720" y="287" width="58" height="11" rx="2" fill="#09090b" />
      <text x="775" y="295" fill="#71717a" fontSize="8" textAnchor="end">HL 4 540$</text>

      {/* Path H4 : micro-pivots */}
      <path d="M540,280 L580,210 L620,250 L660,180 L700,220 L740,150 L770,140" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

      <circle cx="580" cy="210" r="3" fill="#10b981" />
      <rect x="583" y="218" width="16" height="9" rx="2" fill="#09090b" />
      <text x="585" y="225" fill="#10b981" fontSize="7">HH</text>
      <circle cx="620" cy="250" r="3" fill="#10b981" />
      <rect x="623" y="258" width="46" height="9" rx="2" fill="#09090b" />
      <text x="625" y="265" fill="#10b981" fontSize="7">HL 4 560$</text>
      <circle cx="660" cy="180" r="3" fill="#10b981" />
      <rect x="663" y="165" width="50" height="9" rx="2" fill="#09090b" />
      <text x="665" y="172" fill="#10b981" fontSize="7">HH 4 580$</text>
      <circle cx="740" cy="150" r="4" fill="#10b981" />
      <rect x="743" y="135" width="50" height="9" rx="2" fill="#09090b" />
      <text x="745" y="142" fill="#10b981" fontSize="7">HH 4 640$</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Structure externe Daily dicte le biais. Structure interne H4 sert au timing fin.
      </text>
    </svg>
  );
}
