export default function MMHierarchyStackDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="450" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Lire les 3 MM en combinaison
      </text>

      <line x1="305" y1="40" x2="305" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Golden cross ═══ */}
      <rect x="35" y="50" width="220" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="145" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">Golden cross — biais long</text>

      {/* MM200 zinc-400 — courbe basse plate */}
      <path d="M20,290 L70,285 L120,280 L170,275 L220,268 L260,262" stroke="#a1a1aa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* MM50 emerald — courbe intermédiaire ascendante */}
      <path d="M20,240 L70,225 L120,210 L170,195 L220,180 L260,168" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* MM20 blue-400 — courbe haute ascendante rapide */}
      <path d="M20,180 L70,155 L120,135 L170,115 L220,98 L260,82" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

      {/* Labels à droite, alignés sur la fin de chaque courbe, espacés verticalement */}
      <rect x="265" y="74" width="34" height="14" rx="3" fill="#09090b" />
      <text x="282" y="84" fill="#60a5fa" fontSize="9" fontWeight="700" textAnchor="middle">MM20</text>
      <rect x="265" y="160" width="34" height="14" rx="3" fill="#09090b" />
      <text x="282" y="170" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">MM50</text>
      <rect x="265" y="254" width="36" height="14" rx="3" fill="#09090b" />
      <text x="283" y="264" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">MM200</text>

      <text x="145" y="345" fill="#71717a" fontSize="8" textAnchor="middle">MM20 &gt; MM50 &gt; MM200 ascendantes</text>

      {/* ═══ PANEL 2 — Death cross ═══ */}
      <rect x="335" y="50" width="220" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="445" y="65" fill="#ef4444" fontSize="11" fontWeight="700" textAnchor="middle">Death cross — biais short</text>

      {/* MM200 zinc-400 — courbe haute plate */}
      <path d="M320,110 L370,115 L420,120 L470,128 L520,135 L560,140" stroke="#a1a1aa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* MM50 red — courbe intermédiaire descendante */}
      <path d="M320,160 L370,175 L420,195 L470,215 L520,235 L560,250" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* MM20 blue-400 — courbe basse descendante rapide */}
      <path d="M320,210 L370,235 L420,260 L470,285 L520,305 L560,322" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

      <rect x="565" y="132" width="36" height="14" rx="3" fill="#09090b" />
      <text x="583" y="142" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">MM200</text>
      <rect x="565" y="242" width="34" height="14" rx="3" fill="#09090b" />
      <text x="582" y="252" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">MM50</text>
      <rect x="565" y="314" width="34" height="14" rx="3" fill="#09090b" />
      <text x="582" y="324" fill="#60a5fa" fontSize="9" fontWeight="700" textAnchor="middle">MM20</text>

      <text x="445" y="345" fill="#71717a" fontSize="8" textAnchor="middle">MM20 &lt; MM50 &lt; MM200 descendantes</text>

      {/* ═══ PANEL 3 — Range ═══ */}
      <rect x="635" y="50" width="220" height="22" rx="11" fill="#27272a" stroke="#71717a" strokeWidth="1" />
      <text x="745" y="65" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">Range — pas de biais</text>

      {/* 3 MM enchevêtrées autour de y=200 */}
      <path d="M620,205 L670,195 L720,210 L770,200 L815,205 L855,198" stroke="#a1a1aa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M620,195 L670,210 L720,190 L770,210 L815,195 L855,205" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M620,215 L670,200 L720,205 L770,185 L815,210 L855,200" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

      {/* Légende latérale empilée à droite */}
      <rect x="860" y="170" width="36" height="14" rx="3" fill="#09090b" />
      <text x="878" y="180" fill="#60a5fa" fontSize="9" fontWeight="700" textAnchor="middle">MM20</text>
      <rect x="860" y="195" width="36" height="14" rx="3" fill="#09090b" />
      <text x="878" y="205" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">MM50</text>
      <rect x="860" y="220" width="38" height="14" rx="3" fill="#09090b" />
      <text x="879" y="230" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">MM200</text>

      <text x="745" y="345" fill="#71717a" fontSize="8" textAnchor="middle">MM enchevêtrées, pente quasi nulle</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        L&apos;ordre relatif des 3 MM signale le biais directionnel
      </text>
    </svg>
  );
}
