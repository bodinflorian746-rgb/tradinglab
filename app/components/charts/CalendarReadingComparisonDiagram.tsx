export const CalendarReadingComparisonDiagram = () => {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 0 — Defs */}
      <defs>
        <marker id="arrow-comparison" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <polygon points="0 0, 12 6, 0 12" fill="#fbbf24" />
        </marker>
      </defs>

      {/* Layer 1 — Fond global */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        Lire un calendrier — débutant vs pro
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        Le même événement, lu de 2 façons radicalement différentes
      </text>

      {/* Layer 3 — Colonne gauche (Lecture débutant) */}
      <rect x="30" y="80" width="320" height="300" rx="8" fill="#09090b" fillOpacity="0.4" stroke="#f87171" strokeWidth="1.5" strokeOpacity="0.5" />
      <text x="190" y="105" fill="#f87171" fontSize="13" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">LECTURE DÉBUTANT</text>

      {/* Mockup ligne calendrier simplifié */}
      <rect x="50" y="130" width="280" height="80" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
      <text x="65" y="160" fill="#a1a1aa" fontSize="13" fontWeight="600">14:30</text>
      <text x="130" y="160" fill="#60a5fa" fontSize="12" fontWeight="700">USD</text>
      <text x="65" y="185" fill="#ef4444" fontSize="14" fontWeight="700">★★★</text>
      <text x="130" y="185" fill="white" fontSize="13" fontWeight="700">NFP</text>

      {/* Annotation sous le mockup */}
      <text x="190" y="255" fill="#d4d4d8" fontSize="12" textAnchor="middle">Je vois une news importante.</text>

      {/* Verdict bas de colonne */}
      <text x="190" y="345" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">→ Je sais juste qu&apos;il y a un risque.</text>

      {/* Layer 4 — Colonne droite (Lecture pro) — contenus de base */}
      <rect x="450" y="80" width="320" height="300" rx="8" fill="#09090b" fillOpacity="0.4" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.5" />
      <text x="610" y="105" fill="#60a5fa" fontSize="13" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">LECTURE PRO</text>

      {/* Mockup ligne calendrier enrichi */}
      <rect x="470" y="130" width="280" height="160" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />

      {/* Première ligne — mêmes éléments que débutant */}
      <text x="485" y="160" fill="#a1a1aa" fontSize="13" fontWeight="600">14:30</text>
      <text x="550" y="160" fill="#60a5fa" fontSize="12" fontWeight="700">USD</text>
      <text x="485" y="185" fill="#ef4444" fontSize="14" fontWeight="700">★★★</text>
      <text x="550" y="185" fill="white" fontSize="13" fontWeight="700">NFP</text>

      {/* Séparateur horizontal */}
      <line x1="485" y1="200" x2="735" y2="200" stroke="#3f3f46" strokeWidth="1" strokeOpacity="0.5" />

      {/* Données enrichies */}
      <text x="485" y="220" fill="#a1a1aa" fontSize="11">Consensus :</text>
      <text x="560" y="220" fill="#60a5fa" fontSize="12" fontWeight="700">200k</text>

      <text x="485" y="240" fill="#a1a1aa" fontSize="11">Précédent :</text>
      <text x="560" y="240" fill="#60a5fa" fontSize="12" fontWeight="700">250k</text>

      <text x="485" y="260" fill="#fbbf24" fontSize="11" fontWeight="700">Révisé à :</text>
      <text x="560" y="260" fill="#fbbf24" fontSize="12" fontWeight="700">170k</text>
      <text x="600" y="260" fill="#fbbf24" fontSize="13">⚠</text>

      {/* Annotation sous le mockup */}
      <text x="610" y="315" fill="#d4d4d8" fontSize="12" textAnchor="middle">Je lis le contexte complet.</text>

      {/* Verdict bas de colonne */}
      <text x="610" y="345" fill="#34d399" fontSize="11" fontStyle="italic" textAnchor="middle">→ Je sais que la révision change tout.</text>

      {/* Layer 5 — Flèche centrale + labels */}
      <line x1="370" y1="230" x2="425" y2="230" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrow-comparison)" />
      <text x="400" y="210" fill="#fbbf24" fontSize="11" fontWeight="700" textAnchor="middle">Passer de l&apos;alerte</text>
      <text x="400" y="255" fill="#fbbf24" fontSize="11" fontWeight="700" textAnchor="middle">au scénario complet</text>

      {/* Layer 6 — Pastille "RÉVISION FORTE" (par-dessus le contenu droit) */}
      <rect x="620" y="248" width="110" height="18" rx="3" fill="#09090b" fillOpacity="0.95" />
      <text x="675" y="261" fill="#fbbf24" fontSize="9" fontWeight="700" textAnchor="middle">RÉVISION FORTE</text>

      {/* Layer 7 — Pied de page */}
      <text x="400" y="420" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        Le calendrier ne te donne pas une alerte. Il te donne une carte.
      </text>
    </svg>
  );
};
