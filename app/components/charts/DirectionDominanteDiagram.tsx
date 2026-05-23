// Diagramme : lire la direction dominante (Leçon 2 multi-timeframe)
// XAU/USD H4 — impulsions baissières fortes vs corrections haussières faibles.

interface DirectionDominanteDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function DirectionDominanteDiagram({ className = "", locale = "fr" }: DirectionDominanteDiagramProps) {
  const L = locale === "es"
    ? {
        rejets: "Rechazos repetidos",
        annotation: "El mercado corrige lentamente, pero cae violentamente",
        mobTitle: "Dirección dominante — XAU/USD H4",
        mobImpulsions: "Impulsiones bajistas",
        mobImpulsionsDesc: "Rápidas y fuertes → dirección real del mercado.",
        mobCorrections: "Correcciones alcistas",
        mobCorrectionsDesc: "Lentas y débiles → simples retracements.",
        mobFooter: "Velocidad + amplitud = dirección dominante.",
        legendImpulsions: "Impulsiones bajistas: rápidas y fuertes",
        legendCorrections: "Correcciones alcistas: lentas y débiles",
      }
    : {
        rejets: "Rejets répétés",
        annotation: "Le marché corrige lentement, mais chute violemment",
        mobTitle: "Direction dominante — XAU/USD H4",
        mobImpulsions: "Impulsions baissières",
        mobImpulsionsDesc: "Rapides et fortes → direction réelle du marché.",
        mobCorrections: "Corrections haussières",
        mobCorrectionsDesc: "Lentes et faibles → simples retracements.",
        mobFooter: "Vitesse + amplitude = direction dominante.",
        legendImpulsions: "Impulsions baissières : rapides et fortes",
        legendCorrections: "Corrections haussières : lentes et faibles",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="20" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · H4</text>

        <line x1="40" y1="88" x2="620" y2="88" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
        <rect x="40" y="74" width="64" height="13" rx="3" fill="#09090b" />
        <text x="72" y="84" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">4 680 $</text>

        {/* Impulsions baissières — rapides et raides */}
        <path d="M58,98 L122,212" stroke="#ef4444" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M214,104 L292,238" stroke="#ef4444" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M392,112 L470,262" stroke="#ef4444" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {/* Corrections haussières — lentes et faibles */}
        <path d="M122,212 L214,104" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M292,238 L392,112" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M470,262 L560,126" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        <circle cx="214" cy="104" r="4" fill="#ef4444" />
        <circle cx="392" cy="112" r="4" fill="#ef4444" />
        <circle cx="560" cy="126" r="4" fill="#ef4444" />
        <rect x="566" y="119" width="92" height="13" rx="3" fill="#09090b" />
        <text x="612" y="129" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.rejets}</text>

        <rect x="210" y="278" width="280" height="22" rx="11" fill="#09090b" />
        <rect x="210" y="278" width="280" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="292" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {L.annotation}
        </text>
      </svg>

      {/* MOBILE : direction dominante ─────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">{L.mobImpulsions}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobImpulsionsDesc}</p>
        </div>
        <div className="rounded-lg border border-zinc-600 bg-zinc-800/40 p-3">
          <p className="text-[13px] font-bold text-zinc-300">{L.mobCorrections}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobCorrectionsDesc}</p>
        </div>
        <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
          {L.mobFooter}
        </p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legendImpulsions}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">{L.legendCorrections}</span>
        </div>
      </div>
    </div>
  );
}
