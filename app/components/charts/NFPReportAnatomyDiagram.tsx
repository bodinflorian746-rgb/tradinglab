export const NFPReportAnatomyDiagram = () => {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 800 550"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrow-nfp" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#71717a" />
        </marker>
      </defs>

      {/* Layer 1 — Fond global */}
      <rect width="800" height="550" fill="#18181b" rx="8" />
      <rect width="800" height="550" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="30" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        Anatomie d&apos;un rapport NFP
      </text>
      <text x="400" y="50" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        Ce que voit le retail vs ce que lit le pro
      </text>

      {/* Layer 4 — Niveau 1 — Headline NFP */}
      <rect x="200" y="80" width="400" height="60" rx="8" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="400" y="105" fill="#fbbf24" fontSize="14" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
        HEADLINE NFP
      </text>
      <text x="400" y="125" fill="#d4d4d8" fontSize="11" fontStyle="italic" textAnchor="middle">
        Le chiffre médiatisé que tout le monde regarde
      </text>

      {/* Flèche Niveau 1 → Niveau 2 */}
      <line x1="400" y1="140" x2="400" y2="170" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-nfp)" />

      {/* Layer 5 — Niveau 2 — 4 cartes sous-données */}

      {/* Carte 1 — NFP (blue-400) */}
      <rect x="35" y="180" width="170" height="110" rx="6" fill="#27272a" stroke="#60a5fa" strokeWidth="1.5" />
      <text x="120" y="210" fill="#60a5fa" fontSize="14" fontWeight="800" textAnchor="middle">NFP</text>
      <text x="120" y="232" fill="#d4d4d8" fontSize="10" textAnchor="middle">Créations d&apos;emplois</text>
      <text x="120" y="246" fill="#a1a1aa" fontSize="9" textAnchor="middle">(hors agriculture)</text>
      <text x="120" y="272" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Le chiffre headline</text>

      {/* Carte 2 — Unemployment Rate (zinc) */}
      <rect x="225" y="180" width="170" height="110" rx="6" fill="#27272a" stroke="#71717a" strokeWidth="1.5" />
      <text x="310" y="210" fill="#d4d4d8" fontSize="13" fontWeight="800" textAnchor="middle">UNEMPLOYMENT</text>
      <text x="310" y="232" fill="#d4d4d8" fontSize="10" textAnchor="middle">Taux de chômage</text>
      <text x="310" y="265" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Signal de</text>
      <text x="310" y="278" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">ralentissement</text>

      {/* Carte 3 — AHE (emerald-400) */}
      <rect x="415" y="180" width="170" height="110" rx="6" fill="#27272a" stroke="#34d399" strokeWidth="1.5" />
      <text x="500" y="210" fill="#34d399" fontSize="14" fontWeight="800" textAnchor="middle">AHE</text>
      <text x="500" y="232" fill="#d4d4d8" fontSize="10" textAnchor="middle">Salaires horaires</text>
      <text x="500" y="246" fill="#a1a1aa" fontSize="9" textAnchor="middle">(moyens)</text>
      <text x="500" y="272" fill="#fbbf24" fontSize="9" fontWeight="700" textAnchor="middle">★ Inflation future</text>

      {/* Carte 4 — Participation Rate (zinc) */}
      <rect x="605" y="180" width="170" height="110" rx="6" fill="#27272a" stroke="#71717a" strokeWidth="1.5" />
      <text x="690" y="210" fill="#d4d4d8" fontSize="13" fontWeight="800" textAnchor="middle">PARTICIPATION</text>
      <text x="690" y="232" fill="#d4d4d8" fontSize="10" textAnchor="middle">Taux de participation</text>
      <text x="690" y="265" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Qualité du marché</text>
      <text x="690" y="278" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">du travail</text>

      {/* Flèche Niveau 2 → Niveau 3 */}
      <line x1="400" y1="290" x2="400" y2="320" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-nfp)" />

      {/* Layer 6 — Niveau 3 — Révisions */}
      <rect x="100" y="330" width="600" height="50" rx="6" fill="#27272a" stroke="#f87171" strokeWidth="2" />
      <text x="400" y="355" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
        ⚠ RÉVISIONS DU MOIS PRÉCÉDENT
      </text>
      <text x="400" y="372" fill="#d4d4d8" fontSize="10" fontStyle="italic" textAnchor="middle">
        Peut annuler la surprise du chiffre actuel — souvent ignorée
      </text>

      {/* Flèche Niveau 3 → Niveau 4 */}
      <line x1="400" y1="380" x2="400" y2="410" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-nfp)" />

      {/* Layer 7 — Niveau 4 — Réaction multi-actifs */}
      <text x="400" y="410" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        RÉACTION MULTI-ACTIFS (DXY FORT)
      </text>

      {/* Carte EUR/USD */}
      <rect x="35" y="420" width="170" height="60" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1" />
      <text x="120" y="445" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle">EUR/USD</text>
      <text x="120" y="465" fill="#d4d4d8" fontSize="10" textAnchor="middle">↓ Dollar plus fort</text>

      {/* Carte XAU/USD */}
      <rect x="225" y="420" width="170" height="60" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1" />
      <text x="310" y="445" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle">XAU/USD</text>
      <text x="310" y="465" fill="#d4d4d8" fontSize="10" textAnchor="middle">↓ Or pénalisé</text>

      {/* Carte Nasdaq */}
      <rect x="415" y="420" width="170" height="60" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1" />
      <text x="500" y="445" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle">NASDAQ</text>
      <text x="500" y="465" fill="#d4d4d8" fontSize="10" textAnchor="middle">↓ Tech sous pression</text>

      {/* Carte BTC/USD */}
      <rect x="605" y="420" width="170" height="60" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1" />
      <text x="690" y="445" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle">BTC/USD</text>
      <text x="690" y="465" fill="#d4d4d8" fontSize="10" textAnchor="middle">↓ Risk-off</text>

      {/* Layer 8 — Pied de page */}
      <text x="400" y="520" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        Le retail trade le headline. Le pro lit les 4 sous-données + les révisions.
      </text>
    </svg>
  );
};
