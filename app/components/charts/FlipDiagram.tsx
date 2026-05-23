export default function FlipDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const L = locale === "es"
    ? {
        header: "Flip de polaridad — el mercado tiene memoria de los precios",
        resistance: "Resistencia",
        support: "Support",
        cassure: "Ruptura",
        retest: "Retest",
        title1: "Resistencia rota → Support",
        title2: "Support roto → Resistencia",
        mobTitle: "Flip de polaridad — la memoria de los precios",
        mobResToSup: "Resistencia rota → Support",
        mobResToSupDesc: "El precio rompe una resistencia y luego vuelve a testearla por abajo → se convierte en support.",
        mobSupToRes: "Support roto → Resistencia",
        mobSupToResDesc: "El precio rompe un support y luego sube a testearlo por arriba → se convierte en resistencia.",
        mobFooter: "Un nivel roto invierte su polaridad — siempre.",
      }
    : {
        header: "Flip de polarité — le marché a la mémoire des prix",
        resistance: "Résistance",
        support: "Support",
        cassure: "Cassure",
        retest: "Retest",
        title1: "Résistance cassée → Support",
        title2: "Support cassé → Résistance",
        mobTitle: "Flip de polarité — la mémoire des prix",
        mobResToSup: "Résistance cassée → Support",
        mobResToSupDesc: "Le prix casse une résistance puis revient la tester par le bas → elle devient support.",
        mobSupToRes: "Support cassé → Résistance",
        mobSupToResDesc: "Le prix casse un support puis remonte le tester par le haut → il devient résistance.",
        mobFooter: "Un niveau cassé inverse sa polarité — toujours.",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 300"
      className="hidden sm:block w-full h-auto"
    >
      {/* Header */}
      <text x="300" y="20" fill="#a1a1aa" fontSize="10" textAnchor="middle">
        {L.header}
      </text>

      {/* Séparateur vertical */}
      <line x1="300" y1="35" x2="300" y2="270" stroke="#3f3f46" strokeWidth="1" />

      {/* ════════════ PANNEAU GAUCHE — Bullish flip (Résistance → Support) ════════════ */}

      {/* Ligne pivot — moitié red (résistance) puis moitié emerald (support) */}
      <line x1="10" y1="150" x2="145" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="145" y1="150" x2="280" y2="150" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Path du prix */}
      <path
        d="M15,210 L40,150 L60,200 L90,150 L110,205 L130,150 L145,110 L160,95 L185,145 L210,110 L240,85 L275,60"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie de cassure — corps vert entre y=140 et y=110 */}
      <rect x="139" y="110" width="12" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Touches résistance */}
      <circle cx="40" cy="150" r="4" fill="#ef4444" />
      <circle cx="90" cy="150" r="4" fill="#ef4444" />

      {/* Retest support */}
      <circle cx="185" cy="145" r="5" fill="#10b981" />

      {/* Labels avec halos opaques */}
      <rect x="16" y="129" width="78" height="14" fill="#09090b" rx="3" />
      <text x="20" y="140" fill="#ef4444" fontSize="10" fontWeight="600">{L.resistance}</text>
      <rect x="236" y="154" width="57" height="14" fill="#09090b" rx="3" />
      <text x="240" y="165" fill="#10b981" fontSize="10" fontWeight="600">{L.support}</text>

      {/* Pastille Cassure */}
      <rect x="105" y="88" width="50" height="14" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="130" y="98" fill="#d4d4d8" fontSize="8" textAnchor="middle">{L.cassure}</text>

      {/* Pastille Retest avec petite flèche */}
      <rect x="178" y="128" width="44" height="14" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="200" y="138" fill="#d4d4d8" fontSize="8" textAnchor="middle">{L.retest}</text>
      <line x1="192" y1="142" x2="188" y2="145" stroke="#10b981" strokeWidth="0.8" />

      {/* Titre panneau bas */}
      <text x="145" y="285" fill="#d4d4d8" fontSize="11" fontWeight="600" textAnchor="middle">
        {L.title1}
      </text>

      {/* ════════════ PANNEAU DROIT — Bearish flip (Support → Résistance) ════════════ */}

      {/* Ligne pivot — moitié emerald (support) puis moitié red (résistance) */}
      <line x1="320" y1="150" x2="455" y2="150" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="455" y1="150" x2="590" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Path du prix */}
      <path
        d="M325,90 L350,150 L370,100 L400,150 L420,95 L440,150 L455,190 L470,205 L495,155 L520,190 L550,215 L585,240"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie de cassure — corps rouge entre y=160 et y=190 */}
      <rect x="449" y="160" width="12" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Touches support */}
      <circle cx="350" cy="150" r="4" fill="#10b981" />
      <circle cx="400" cy="150" r="4" fill="#10b981" />

      {/* Retest résistance */}
      <circle cx="495" cy="155" r="5" fill="#ef4444" />

      {/* Labels avec halos opaques */}
      <rect x="326" y="154" width="57" height="14" fill="#09090b" rx="3" />
      <text x="330" y="165" fill="#10b981" fontSize="10" fontWeight="600">{L.support}</text>
      <rect x="511" y="129" width="78" height="14" fill="#09090b" rx="3" />
      <text x="585" y="140" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="end">{L.resistance}</text>

      {/* Pastille Cassure */}
      <rect x="415" y="203" width="50" height="14" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="440" y="213" fill="#d4d4d8" fontSize="8" textAnchor="middle">{L.cassure}</text>

      {/* Pastille Retest avec petite flèche */}
      <rect x="488" y="163" width="44" height="14" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="510" y="173" fill="#d4d4d8" fontSize="8" textAnchor="middle">{L.retest}</text>
      <line x1="500" y1="163" x2="497" y2="159" stroke="#ef4444" strokeWidth="0.8" />

      {/* Titre panneau bas */}
      <text x="455" y="285" fill="#d4d4d8" fontSize="11" fontWeight="600" textAnchor="middle">
        {L.title2}
      </text>
    </svg>

    {/* MOBILE : flip de polarité ──────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.mobResToSup}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobResToSupDesc}</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{L.mobSupToRes}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobSupToResDesc}</p>
      </div>
      <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
}
