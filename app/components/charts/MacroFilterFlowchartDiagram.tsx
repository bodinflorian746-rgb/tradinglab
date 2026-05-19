// Diagramme : flowchart du filtre macro pré-trade (Leçon 4 Macro Trading)
// Organigramme vertical de 3 décisions menant à "Exécution possible" ou à "Pas de trade".

interface MacroFilterFlowchartDiagramProps {
  className?: string;
}

export function MacroFilterFlowchartDiagram({ className = "" }: MacroFilterFlowchartDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        {/* Question 1 — News majeure imminente ? */}
        <rect x="240" y="22" width="220" height="34" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
        <text x="350" y="43" fill="#e4e4e7" fontSize="11" fontWeight="700" textAnchor="middle">News majeure imminente ?</text>

        {/* Flèche Oui (droite, vers Pas de trade) */}
        <path d="M 460 39 L 540 39" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 532 35 L 540 39 L 532 43" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="500" y="32" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Oui</text>

        {/* Flèche Non (vers le bas) */}
        <line x1="350" y1="56" x2="350" y2="84" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 346 76 L 350 84 L 354 76" fill="none" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="362" y="74" fill="#10b981" fontSize="9" fontWeight="700">Non</text>

        {/* Sortie "Pas de trade" 1 (à droite de Q1) */}
        <rect x="540" y="22" width="130" height="34" rx="6" fill="#ef444418" stroke="#ef4444" strokeWidth="1.4" />
        <text x="605" y="43" fill="#ef4444" fontSize="11" fontWeight="800" textAnchor="middle">Pas de trade</text>

        {/* Question 2 — Régime macro aligné ? */}
        <rect x="240" y="88" width="220" height="34" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
        <text x="350" y="109" fill="#e4e4e7" fontSize="11" fontWeight="700" textAnchor="middle">Régime macro aligné ?</text>

        {/* Flèche Non (droite, vers Prudence) */}
        <path d="M 460 105 L 540 105" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 532 101 L 540 105 L 532 109" fill="none" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="500" y="98" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Non</text>

        {/* Flèche Oui (vers le bas) */}
        <line x1="350" y1="122" x2="350" y2="150" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 346 142 L 350 150 L 354 142" fill="none" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="362" y="140" fill="#10b981" fontSize="9" fontWeight="700">Oui</text>

        {/* Sortie "Prudence" (à droite de Q2) */}
        <rect x="540" y="88" width="130" height="34" rx="6" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="1.4" />
        <text x="605" y="109" fill="#f59e0b" fontSize="11" fontWeight="800" textAnchor="middle">Prudence</text>

        {/* Question 3 — Setup technique valide ? */}
        <rect x="240" y="154" width="220" height="34" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
        <text x="350" y="175" fill="#e4e4e7" fontSize="11" fontWeight="700" textAnchor="middle">Setup technique valide ?</text>

        {/* Flèche Non (droite, vers Pas de trade) */}
        <path d="M 460 171 L 540 171" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 532 167 L 540 171 L 532 175" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="500" y="164" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Non</text>

        {/* Flèche Oui (vers le bas, vers Exécution) */}
        <line x1="350" y1="188" x2="350" y2="216" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 346 208 L 350 216 L 354 208" fill="none" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="362" y="206" fill="#10b981" fontSize="9" fontWeight="700">Oui</text>

        {/* Sortie "Pas de trade" 2 (à droite de Q3) */}
        <rect x="540" y="154" width="130" height="34" rx="6" fill="#ef444418" stroke="#ef4444" strokeWidth="1.4" />
        <text x="605" y="175" fill="#ef4444" fontSize="11" fontWeight="800" textAnchor="middle">Pas de trade</text>

        {/* Sortie finale "Exécution possible" */}
        <rect x="270" y="220" width="160" height="40" rx="8" fill="#10b98118" stroke="#10b981" strokeWidth="1.6" />
        <text x="350" y="245" fill="#10b981" fontSize="12" fontWeight="800" textAnchor="middle">Exécution possible</text>

        {/* Annotation amber */}
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le setup doit passer tous les filtres
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Chaque filtre franchi rapproche de l&apos;exécution</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Un seul filtre rouge = pas de trade</span>
        </div>
      </div>
    </div>
  );
}
