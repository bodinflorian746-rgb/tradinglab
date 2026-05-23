export default function MultiTFConflictDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const L = locale === "es"
    ? {
        warning: "⚠ Conflicto multi-TF — Sin trade",
        haussier: "↑ Alcista",
        baissier: "↓ Bajista",
        footer: "Daily ↑ vs H4 ↓ vs M15 ↑: mientras los 3 timeframes no se alineen, sin entrada",
        mobWarning: "⚠ Conflicto multi-TF — Sin trade",
        mobAlcistaSpan: "↑ Alcista",
        mobBajistaSpan: "↓ Bajista",
        mobFooterPre: "Mientras los 3 timeframes no se alineen, ",
        mobFooterBold: "sin entrada",
        mobFooterPost: ".",
      }
    : {
        warning: "⚠ Conflit multi-TF — Pas de trade",
        haussier: "↑ Haussier",
        baissier: "↓ Baissier",
        footer: "Daily ↑ vs H4 ↓ vs M15 ↑ : tant que les 3 timeframes ne s'alignent pas, pas d'entrée",
        mobWarning: "⚠ Conflit multi-TF — Pas de trade",
        mobAlcistaSpan: "↑ Haussier",
        mobBajistaSpan: "↓ Baissier",
        mobFooterPre: "Tant que les 3 timeframes ne s'alignent pas, ",
        mobFooterBold: "pas d'entrée",
        mobFooterPost: ".",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className="hidden sm:block w-full h-auto"
    >
      {/* Badge central top */}
      <rect x="310" y="10" width="280" height="28" rx="14" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1.2" />
      <text x="450" y="29" fill="#f59e0b" fontSize="12" fontWeight="700" textAnchor="middle">
        {L.warning}
      </text>

      {/* Séparateurs verticaux */}
      <line x1="300" y1="50" x2="300" y2="380" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="50" x2="605" y2="380" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Daily HAUSSIER ═══ */}
      <text x="145" y="70" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">Daily</text>

      {/* Mini-chart prix HH/HL ascendant */}
      <path d="M20,340 L60,260 L90,290 L130,200 L170,230 L210,140 L250,170 L280,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Cercles HL (creux) et HH (sommets) */}
      <circle cx="90" cy="290" r="4" fill="#10b981" />
      <circle cx="170" cy="230" r="4" fill="#10b981" />
      <circle cx="250" cy="170" r="4" fill="#10b981" />
      <circle cx="130" cy="200" r="4" fill="#10b981" />
      <circle cx="210" cy="140" r="4" fill="#10b981" />

      {/* Flèche directionnelle haussière GROSSE */}
      <line x1="145" y1="350" x2="145" y2="80" stroke="#10b981" strokeWidth="4" opacity="0.5" />
      <path d="M135 90 L145 70 L155 90" stroke="#10b981" strokeWidth="4" fill="none" strokeLinejoin="round" />

      <rect x="55" y="350" width="180" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="145" y="365" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">{L.haussier}</text>

      {/* ═══ PANEL 2 — H4 BAISSIER ═══ */}
      <text x="450" y="70" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">H4</text>

      {/* Mini-chart prix LL/LH descendant */}
      <path d="M325,80 L365,160 L395,130 L435,220 L475,190 L515,280 L555,250 L585,340" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Cercles LL (creux) et LH (sommets) */}
      <circle cx="435" cy="220" r="4" fill="#ef4444" />
      <circle cx="515" cy="280" r="4" fill="#ef4444" />
      <circle cx="585" cy="340" r="4" fill="#ef4444" />
      <circle cx="395" cy="130" r="4" fill="#ef4444" />
      <circle cx="475" cy="190" r="4" fill="#ef4444" />

      {/* Flèche directionnelle baissière GROSSE */}
      <line x1="450" y1="80" x2="450" y2="350" stroke="#ef4444" strokeWidth="4" opacity="0.5" />
      <path d="M440 340 L450 360 L460 340" stroke="#ef4444" strokeWidth="4" fill="none" strokeLinejoin="round" />

      <rect x="360" y="350" width="180" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="450" y="365" fill="#ef4444" fontSize="11" fontWeight="700" textAnchor="middle">{L.baissier}</text>

      {/* ═══ PANEL 3 — M15 HAUSSIER ═══ */}
      <text x="755" y="70" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">M15</text>

      {/* Mini-chart prix remontée */}
      <path d="M630,320 L680,290 L720,240 L770,210 L820,170 L880,130" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="680" cy="290" r="4" fill="#10b981" />
      <circle cx="770" cy="210" r="4" fill="#10b981" />

      {/* Flèche directionnelle haussière GROSSE */}
      <line x1="755" y1="350" x2="755" y2="100" stroke="#10b981" strokeWidth="4" opacity="0.5" />
      <path d="M745 110 L755 90 L765 110" stroke="#10b981" strokeWidth="4" fill="none" strokeLinejoin="round" />

      <rect x="665" y="350" width="180" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="755" y="365" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">{L.haussier}</text>

      <text x="450" y="395" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : conflit multi-TF ─────────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="rounded-xl border-2 border-amber-400 bg-amber-400/10 p-3 text-center">
        <p className="text-[14px] font-bold text-amber-400">{L.mobWarning}</p>
      </div>
      <div className="space-y-2">
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-2.5 flex justify-between items-center">
          <span className="text-[14px] font-bold text-zinc-200">Daily</span>
          <span className="text-[14px] font-bold text-emerald-400">{L.mobAlcistaSpan}</span>
        </div>
        <div className="rounded-lg border border-red-500/40 bg-red-500/5 p-2.5 flex justify-between items-center">
          <span className="text-[14px] font-bold text-zinc-200">H4</span>
          <span className="text-[14px] font-bold text-red-400">{L.mobBajistaSpan}</span>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-2.5 flex justify-between items-center">
          <span className="text-[14px] font-bold text-zinc-200">M15</span>
          <span className="text-[14px] font-bold text-emerald-400">{L.mobAlcistaSpan}</span>
        </div>
      </div>
      <p className="text-[13px] text-zinc-300 leading-snug text-center pt-2 border-t border-zinc-800">
        {L.mobFooterPre}<span className="font-bold text-amber-400">{L.mobFooterBold}</span>{L.mobFooterPost}
      </p>
    </div>
    </div>
  );
}
