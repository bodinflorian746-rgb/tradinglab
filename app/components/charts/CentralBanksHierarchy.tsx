interface CentralBanksHierarchyProps {
  locale?: "fr" | "es";
}

export const CentralBanksHierarchy = ({ locale = "fr" }: CentralBanksHierarchyProps = {}) => {
  const isEs = locale === "es";
  const L = {
    subtitle:    isEs ? "El mercado es influenciado por varios bancos — pero uno domina." : "Le marché est influencé par plusieurs banques — mais une domine.",
    fedFull:     isEs ? "Reserva federal" : "Réserve fédérale",
    bceFull:     isEs ? "Banco central europeo" : "Banque centrale européenne",
    boeFull:     "Bank of England",
    bojFull:     isEs ? "Banco de Japón" : "Banque du Japon",
    boss:        isEs ? "El jefe del juego" : "Le boss du jeu",
    bossPlus:    isEs ? "★ El jefe del juego" : "★ Le boss du jeu",
    influence:   isEs ? "↓ influencia ↓" : "↓ influence ↓",
    footer:      isEs ? "Todos los activos mayores dependen del dólar: forex, oro, crypto, índices US." : "Tous les actifs majeurs dépendent du dollar : forex, or, crypto, indices US.",
    mobFooter:   isEs ? "Todos los activos mayores (forex, oro, crypto, índices US) dependen del dólar." : "Tous les actifs majeurs (forex, or, crypto, indices US) dépendent du dollar.",
  };
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrowhead-cb" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#3f3f46" />
        </marker>
      </defs>

      {/* Layer 1 — Fond */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre pédagogique */}
      <text x="400" y="40" fill="#a1a1aa" fontSize="14" fontStyle="italic" textAnchor="middle">
        {L.subtitle}
      </text>

      {/* Layer 3 — Box FED (dominante, en haut centré) */}
      <rect x="300" y="80" width="200" height="110" rx="8" fill="#10b981" stroke="#34d399" strokeWidth="2" />
      <text x="400" y="122" fill="white" fontSize="28" fontWeight="800" textAnchor="middle">FED</text>
      <text x="400" y="145" fill="#09090b" fontSize="11" fontWeight="600" textAnchor="middle">{L.fedFull}</text>
      <text x="400" y="175" fill="#09090b" fontSize="20" fontWeight="800" textAnchor="middle">USD</text>

      {/* Layer 4 — 3 boxes secondaires */}

      {/* Box BCE */}
      <rect x="100" y="290" width="160" height="90" rx="6" fill="#27272a" stroke="#60a5fa" strokeWidth="2" />
      <text x="180" y="320" fill="#60a5fa" fontSize="20" fontWeight="700" textAnchor="middle">BCE</text>
      <text x="180" y="340" fill="#a1a1aa" fontSize="9" textAnchor="middle">{L.bceFull}</text>
      <text x="180" y="365" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">EUR</text>

      {/* Box BoE */}
      <rect x="320" y="290" width="160" height="90" rx="6" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="400" y="320" fill="#fbbf24" fontSize="20" fontWeight="700" textAnchor="middle">BoE</text>
      <text x="400" y="340" fill="#a1a1aa" fontSize="9" textAnchor="middle">Bank of England</text>
      <text x="400" y="365" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">GBP</text>

      {/* Box BoJ */}
      <rect x="540" y="290" width="160" height="90" rx="6" fill="#27272a" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="4 4" />
      <text x="620" y="320" fill="#a1a1aa" fontSize="20" fontWeight="700" textAnchor="middle">BoJ</text>
      <text x="620" y="340" fill="#71717a" fontSize="9" textAnchor="middle">{L.bojFull}</text>
      <text x="620" y="365" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">JPY</text>

      {/* Layer 5 — Flèches d'influence (FED → BCE, BoE, BoJ) */}
      <path
        d="M 350 195 Q 280 240 185 285"
        stroke="#3f3f46"
        strokeWidth="2"
        markerEnd="url(#arrowhead-cb)"
      />
      <line
        x1="400" y1="195" x2="400" y2="285"
        stroke="#3f3f46"
        strokeWidth="2"
        markerEnd="url(#arrowhead-cb)"
      />
      <path
        d="M 450 195 Q 520 240 615 285"
        stroke="#3f3f46"
        strokeWidth="2"
        markerEnd="url(#arrowhead-cb)"
      />

      {/* Layer 6 — Annotations */}

      {/* Sous-titre FED */}
      <text x="400" y="212" fill="#34d399" fontSize="11" fontStyle="italic" fontWeight="600" textAnchor="middle">
        {L.boss}
      </text>

      {/* Pied de page */}
      <text x="400" y="425" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* ── MOBILE : hiérarchie des banques centrales ─────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[13px] text-zinc-400 italic text-center leading-snug">
        {L.subtitle}
      </p>

      {/* FED — boss du jeu */}
      <div className="rounded-xl border-2 border-emerald-400 bg-emerald-500 p-4 text-center">
        <p className="text-[28px] font-bold text-white leading-none">FED</p>
        <p className="text-[12px] text-zinc-900 font-semibold mt-1">{L.fedFull}</p>
        <p className="text-[20px] font-bold text-zinc-900 mt-1.5">USD</p>
        <p className="text-[13px] text-zinc-900/80 italic font-semibold mt-1">{L.bossPlus}</p>
      </div>

      {/* Flèche descendante */}
      <p className="text-center text-zinc-600 text-[18px]">{L.influence}</p>

      {/* 3 banques secondaires */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border-2 border-blue-400 bg-zinc-800 p-2.5 text-center">
          <p className="text-[18px] font-bold text-blue-400 leading-none">BCE</p>
          <p className="text-[10px] text-zinc-400 mt-1.5 leading-tight">{L.bceFull}</p>
          <p className="text-[14px] font-bold text-white mt-1.5">EUR</p>
        </div>
        <div className="rounded-lg border-2 border-amber-400 bg-zinc-800 p-2.5 text-center">
          <p className="text-[18px] font-bold text-amber-400 leading-none">BoE</p>
          <p className="text-[10px] text-zinc-400 mt-1.5 leading-tight">{L.boeFull}</p>
          <p className="text-[14px] font-bold text-white mt-1.5">GBP</p>
        </div>
        <div className="rounded-lg border-2 border-dashed border-zinc-500 bg-zinc-800 p-2.5 text-center">
          <p className="text-[18px] font-bold text-zinc-400 leading-none">BoJ</p>
          <p className="text-[10px] text-zinc-500 mt-1.5 leading-tight">{L.bojFull}</p>
          <p className="text-[14px] font-bold text-white mt-1.5">JPY</p>
        </div>
      </div>

      <p className="text-[12px] text-zinc-400 italic text-center leading-snug pt-2 border-t border-zinc-800">
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
};
