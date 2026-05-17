export default function ZoneVsLineDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Niveau = zone, pas ligne
      </text>

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — Ligne précise (KO) ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ Ligne trop précise</text>

      {/* Ligne fine pointillée */}
      <line x1="50" y1="200" x2="380" y2="200" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 2" />

      {/* Path prix avec mèches qui dépassent légèrement la ligne (3 touches) */}
      {/* Bougie 1 : mèche dépasse vers le haut */}
      <line x1="110" y1="180" x2="110" y2="240" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="103" y="205" width="14" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Bougie 2 : mèche dépasse */}
      <line x1="180" y1="175" x2="180" y2="235" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="173" y="205" width="14" height="25" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Bougie 3 : mèche dépasse */}
      <line x1="250" y1="170" x2="250" y2="245" stroke="#059669" strokeWidth="1.5" />
      <rect x="243" y="210" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Annotations "mèche dépasse" — décalées verticalement pour éviter chevauchement */}
      <text x="110" y="120" fill="#ef4444" fontSize="8" textAnchor="middle">↑ dépasse</text>
      <text x="180" y="110" fill="#ef4444" fontSize="8" textAnchor="middle">↑ dépasse</text>
      <text x="250" y="125" fill="#ef4444" fontSize="8" textAnchor="middle">↑ dépasse</text>

      <text x="200" y="335" fill="#a1a1aa" fontSize="8" textAnchor="middle">Mèches répétées font croire à</text>
      <text x="200" y="350" fill="#a1a1aa" fontSize="8" textAnchor="middle">une cassure qui n&apos;existe pas</text>

      {/* ═══ PANEL DROIT — Zone épaisse (OK) ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="600" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">✓ Zone bien dessinée</text>

      {/* Zone : rectangle emerald translucide entre y=190 et y=210 */}
      <rect x="450" y="190" width="330" height="20" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />

      {/* Path prix avec mèches qui restent DANS la zone */}
      <line x1="510" y1="195" x2="510" y2="240" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="503" y="208" width="14" height="25" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="580" y1="192" x2="580" y2="235" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="573" y="208" width="14" height="22" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="650" y1="198" x2="650" y2="245" stroke="#059669" strokeWidth="1.5" />
      <rect x="643" y="208" width="14" height="32" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <text x="600" y="335" fill="#a1a1aa" fontSize="8" textAnchor="middle">La zone absorbe les wicks</text>
      <text x="600" y="350" fill="#a1a1aa" fontSize="8" textAnchor="middle">naturels du marché</text>

      {/* Labels de niveau avec halos opaques placés en fin de svg */}
      <rect x="51" y="184" width="80" height="14" fill="#09090b" rx="3" />
      <text x="55" y="195" fill="#a1a1aa" fontSize="9" fontWeight="600">Ligne 1.1750</text>
      <rect x="451" y="174" width="122" height="14" fill="#09090b" rx="3" />
      <text x="455" y="185" fill="#10b981" fontSize="9" fontWeight="600">Zone 1.1740-1.1760</text>

      {/* Labels "absorbé" replacés APRÈS le halo Zone pour rester au-dessus */}
      <text x="510" y="160" fill="#10b981" fontSize="8" textAnchor="middle">absorbé</text>
      <text x="580" y="160" fill="#10b981" fontSize="8" textAnchor="middle">absorbé</text>
      <text x="650" y="160" fill="#10b981" fontSize="8" textAnchor="middle">absorbé</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Un niveau institutionnel est une zone de 15-20 pips, pas une ligne précise
      </text>
    </svg>
  );
}
