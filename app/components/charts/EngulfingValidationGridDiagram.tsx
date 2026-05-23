export default function EngulfingValidationGridDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Engulfing válido vs inválido",
        cell1: "✓ Válido — Envuelve por completo",
        cell1Sub: "Verde > Roja (×2)",
        cell2: "✗ Solo envuelve 60%",
        cell2Sub: "Verde < Roja (60%)",
        cell3: "✗ Amplitud demasiado baja",
        cell3Sub: "Amplitud minúscula",
        cell4: "✗ Fuera de nivel estructural",
        rangeLabel: "Rango lateral",
        cell4Sub: "Par engulfing en medio de un rango",
        footer: "Cuerpo envolvente + amplitud suficiente + contexto de nivel",
        mobileTitle: "Reconocer un engulfing válido",
        mobileCases: [
          { v: true, label: "Cuerpo envolvente claro", desc: "Vela verde envuelve por completo la roja anterior + amplitud suficiente" },
          { v: false, label: "Vela B no cubre la A", desc: "Cuerpo demasiado corto → no es un verdadero engulfing" },
          { v: false, label: "Amplitud minúscula", desc: "Envolvente pero solo 20 px → señal débil" },
          { v: false, label: "Par engulfing en un rango", desc: "Sin nivel estructural → señal inútil" },
        ],
        mobileFooter: "Cuerpo envolvente + amplitud + contexto de nivel",
      }
    : {
        title: "Engulfing valide vs invalide",
        cell1: "✓ Valide — Englobe complètement",
        cell1Sub: "Verte > Rouge (×2)",
        cell2: "✗ N'englobe que 60%",
        cell2Sub: "Verte < Rouge (60%)",
        cell3: "✗ Amplitude trop faible",
        cell3Sub: "Amplitude minuscule",
        cell4: "✗ Hors niveau structurel",
        rangeLabel: "Range latéral",
        cell4Sub: "Paire engulfing au milieu d'un range",
        footer: "Corps englobant + amplitude suffisante + contexte de niveau",
        mobileTitle: "Reconnaître un engulfing valide",
        mobileCases: [
          { v: true, label: "Corps englobant net", desc: "Bougie verte avale entièrement la rouge précédente + amplitude suffisante" },
          { v: false, label: "Bougie B ne couvre pas la A", desc: "Corps trop court → pas un vrai engulfing" },
          { v: false, label: "Amplitude minuscule", desc: "Englobante mais 20 px seulement → signal faible" },
          { v: false, label: "Paire engulfing dans un range", desc: "Sans niveau structurel → signal inutile" },
        ],
        mobileFooter: "Corps englobant + amplitude + contexte de niveau",
      };

  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="30" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      {/* Séparateurs grille */}
      <line x1="410" y1="70" x2="410" y2="460" stroke="#3f3f46" strokeWidth="1" />
      <line x1="30" y1="290" x2="770" y2="290" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══════ CELLULE 1 — VALIDE (haut gauche) ═══════ */}
      <rect x="60" y="70" width="300" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="210" y="85" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell1}
      </text>

      {/* Bougie A — rouge petite */}
      <line x1="180" y1="160" x2="180" y2="220" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
      <rect x="165" y="170" width="30" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />

      {/* Bougie B — verte qui englobe (corps 2x rouge) */}
      <line x1="240" y1="140" x2="240" y2="240" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="225" y="150" width="30" height="80" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      {/* Flèche entre les 2 bougies */}
      <line x1="200" y1="195" x2="220" y2="195" stroke="#10b981" strokeWidth="1.2" />
      <path d="M214 191 L220 195 L214 199" stroke="#10b981" strokeWidth="1.2" fill="none" />

      <text x="210" y="265" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell1Sub}
      </text>

      {/* ═══════ CELLULE 2 — N'englobe que 60% (haut droite) ═══════ */}
      <rect x="450" y="70" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="85" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell2}
      </text>

      {/* Bougie A — rouge */}
      <line x1="570" y1="160" x2="570" y2="220" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
      <rect x="555" y="170" width="30" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />

      {/* Bougie B — verte trop petite (24 px = 60% du corps rouge) */}
      <line x1="630" y1="170" x2="630" y2="210" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="615" y="175" width="30" height="30" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="600" y="265" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell2Sub}
      </text>

      {/* ═══════ CELLULE 3 — Amplitude trop faible (bas gauche) ═══════ */}
      <rect x="60" y="310" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="210" y="325" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell3}
      </text>

      {/* Bougie A — rouge minuscule */}
      <line x1="180" y1="390" x2="180" y2="410" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
      <rect x="165" y="395" width="30" height="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1" />

      {/* Bougie B — verte petite englobante */}
      <line x1="240" y1="385" x2="240" y2="415" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="225" y="390" width="30" height="20" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />

      {/* Flèche verticale "20 px" */}
      <line x1="285" y1="390" x2="285" y2="410" stroke="#a1a1aa" strokeWidth="1" />
      <path d="M281 394 L285 390 L289 394" stroke="#a1a1aa" strokeWidth="1" fill="none" />
      <path d="M281 406 L285 410 L289 406" stroke="#a1a1aa" strokeWidth="1" fill="none" />
      <text x="295" y="404" fill="#a1a1aa" fontSize="9">20 px</text>

      <text x="210" y="440" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell3Sub}
      </text>

      {/* ═══════ CELLULE 4 — Range latéral hors niveau (bas droite) ═══════ */}
      <rect x="450" y="310" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="325" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell4}
      </text>

      {/* Bornes du range */}
      <line x1="460" y1="370" x2="740" y2="370" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="460" y1="410" x2="740" y2="410" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <text x="600" y="355" fill="#a1a1aa" fontSize="9" textAnchor="middle">{t.rangeLabel}</text>

      {/* Mini-zigzag 6 bougies dans le range */}
      <line x1="495" y1="385" x2="495" y2="405" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="490" y="390" width="10" height="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="525" y1="380" x2="525" y2="400" stroke="#059669" strokeWidth="1.5" />
      <rect x="520" y="385" width="10" height="12" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Bougies 3 + 4 = paire engulfing au centre */}
      <line x1="585" y1="385" x2="585" y2="405" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="580" y="390" width="10" height="13" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="615" y1="378" x2="615" y2="408" stroke="#059669" strokeWidth="2" />
      <rect x="608" y="385" width="14" height="20" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />

      <line x1="650" y1="385" x2="650" y2="402" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="645" y="390" width="10" height="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="680" y1="380" x2="680" y2="400" stroke="#059669" strokeWidth="1.5" />
      <rect x="675" y="385" width="10" height="13" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <text x="600" y="450" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.cell4Sub}
      </text>

      <text x="400" y="490" fill="#a1a1aa" fontSize="10" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* MOBILE : 4 cas validés/invalidés engulfing ──────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
      {t.mobileCases.map((c, i) => (
        <div key={i} className={`rounded-lg border p-2.5 ${c.v ? "border-emerald-500/40 bg-emerald-500/8" : "border-red-500/40 bg-red-500/8"}`}>
          <p className={`text-[13px] font-bold ${c.v ? "text-emerald-400" : "text-red-400"}`}>
            {c.v ? "✓" : "✗"} {c.label}
          </p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{c.desc}</p>
        </div>
      ))}
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        {t.mobileFooter}
      </p>
    </div>
    </div>
  );
}
