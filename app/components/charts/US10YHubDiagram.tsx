export const US10YHubDiagram = () => {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#f87171" />
        </marker>
        <marker id="arrow-emerald" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#34d399" />
        </marker>
      </defs>

      {/* Layer 1 — Fond global */}
      <rect width="800" height="600" fill="#18181b" rx="8" />
      <rect width="800" height="600" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        L&apos;écosystème US10Y
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        Le rendement qui dirige tous les autres marchés
      </text>

      {/* Layer 4 — Flèches (sous les cartes) */}
      {/* Hub → XAU/USD */}
      <line x1="340" y1="235" x2="240" y2="180" stroke="#f87171" strokeWidth="2" markerEnd="url(#arrow-red)" />
      {/* Hub → Nasdaq */}
      <line x1="460" y1="235" x2="560" y2="180" stroke="#f87171" strokeWidth="2" markerEnd="url(#arrow-red)" />
      {/* Hub → BTC/USD */}
      <line x1="340" y1="325" x2="240" y2="380" stroke="#f87171" strokeWidth="2" markerEnd="url(#arrow-red)" />
      {/* Hub → DXY */}
      <line x1="460" y1="325" x2="560" y2="380" stroke="#34d399" strokeWidth="2" markerEnd="url(#arrow-emerald)" />

      {/* Layer 5 — Hub central US10Y */}
      <circle cx="400" cy="280" r="85" fill="#27272a" stroke="#fbbf24" strokeWidth="3" />
      <text x="400" y="265" fill="#fbbf24" fontSize="24" fontWeight="800" textAnchor="middle">
        US10Y
      </text>
      <text x="400" y="288" fill="#d4d4d8" fontSize="11" textAnchor="middle">
        Rendement 10 ans US
      </text>
      <text x="400" y="308" fill="#a1a1aa" fontSize="10" fontStyle="italic" textAnchor="middle">
        Taux sans risque mondial
      </text>
      <text x="400" y="328" fill="#fbbf24" fontSize="9" textAnchor="middle">
        ↑ quand vendu
      </text>

      {/* Layer 6 — Cartes satellites */}

      {/* Carte 1 — XAU/USD */}
      <rect x="60" y="110" width="180" height="90" rx="8" fill="#27272a" stroke="#f87171" strokeWidth="2" />
      <text x="150" y="140" fill="#f87171" fontSize="16" fontWeight="800" textAnchor="middle">XAU/USD</text>
      <text x="150" y="158" fill="#d4d4d8" fontSize="10" fontStyle="italic" textAnchor="middle">Or</text>
      <text x="150" y="180" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">↓ pression baissière</text>
      <text x="150" y="195" fill="#a1a1aa" fontSize="9" textAnchor="middle">Corrélation : -0.80</text>

      {/* Carte 2 — Nasdaq */}
      <rect x="560" y="110" width="180" height="90" rx="8" fill="#27272a" stroke="#f87171" strokeWidth="2" />
      <text x="650" y="140" fill="#f87171" fontSize="16" fontWeight="800" textAnchor="middle">NASDAQ</text>
      <text x="650" y="158" fill="#d4d4d8" fontSize="10" fontStyle="italic" textAnchor="middle">Tech / Croissance</text>
      <text x="650" y="180" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">↓ valorisations</text>
      <text x="650" y="195" fill="#a1a1aa" fontSize="9" textAnchor="middle">Corrélation : -0.65</text>

      {/* Carte 3 — BTC/USD */}
      <rect x="60" y="360" width="180" height="90" rx="8" fill="#27272a" stroke="#f87171" strokeWidth="2" />
      <text x="150" y="390" fill="#f87171" fontSize="16" fontWeight="800" textAnchor="middle">BTC/USD</text>
      <text x="150" y="408" fill="#d4d4d8" fontSize="10" fontStyle="italic" textAnchor="middle">Actif risqué</text>
      <text x="150" y="430" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">↓ risk-off possible</text>
      <text x="150" y="445" fill="#a1a1aa" fontSize="9" textAnchor="middle">Corrélation : -0.45</text>

      {/* Carte 4 — DXY */}
      <rect x="560" y="360" width="180" height="90" rx="8" fill="#27272a" stroke="#34d399" strokeWidth="2" />
      <text x="650" y="390" fill="#34d399" fontSize="16" fontWeight="800" textAnchor="middle">DXY</text>
      <text x="650" y="408" fill="#d4d4d8" fontSize="10" fontStyle="italic" textAnchor="middle">Indice Dollar US</text>
      <text x="650" y="430" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">↑ rendement attractif</text>
      <text x="650" y="445" fill="#a1a1aa" fontSize="9" textAnchor="middle">Corrélation : +0.65</text>

      {/* Layer 7 — Légende centrale */}
      <text x="400" y="485" fill="#fbbf24" fontSize="12" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">
        Quand US10Y monte...
      </text>

      {/* Layer 8 — Échelle des seuils psychologiques */}
      <text x="400" y="510" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        SEUILS PSYCHOLOGIQUES US10Y
      </text>

      {/* Axe horizontal */}
      <line x1="120" y1="540" x2="680" y2="540" stroke="#3f3f46" strokeWidth="2" />

      {/* Marqueur 3.5% — emerald */}
      <circle cx="120" cy="540" r="6" fill="#34d399" />
      <text x="120" y="560" fill="#34d399" fontSize="11" fontWeight="700" textAnchor="middle">3.5%</text>

      {/* Marqueur 4.0% — zinc-300 */}
      <circle cx="307" cy="540" r="6" fill="#d4d4d8" />
      <text x="307" y="560" fill="#d4d4d8" fontSize="11" fontWeight="700" textAnchor="middle">4.0%</text>

      {/* Marqueur 4.5% — amber-400 */}
      <circle cx="493" cy="540" r="7" fill="#fbbf24" />
      <text x="493" y="560" fill="#fbbf24" fontSize="11" fontWeight="700" textAnchor="middle">4.5%</text>

      {/* Marqueur 5.0% — red-400 */}
      <circle cx="680" cy="540" r="8" fill="#f87171" />
      <text x="680" y="560" fill="#f87171" fontSize="11" fontWeight="700" textAnchor="middle">5.0%</text>

      {/* Layer 9 — Pied de page */}
      <text x="400" y="585" fill="#34d399" fontSize="11" fontWeight="700" fontStyle="italic" textAnchor="middle">
        L&apos;or, la tech et le Bitcoin réagissent souvent au même chiffre. Et ce chiffre, c&apos;est US10Y.
      </text>
    </svg>
  );
};
