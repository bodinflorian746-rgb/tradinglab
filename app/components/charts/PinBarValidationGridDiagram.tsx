export default function PinBarValidationGridDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Reconocer una pin bar válida en 5 segundos",
        cell1: "✓ Válida — Pin bar de rechazo claro",
        wickLabel: "Mecha :",
        bodyLabel: "Cuerpo :",
        ratioLabel: "Ratio :",
        cell2: "✗ Mecha = Cuerpo",
        cell3: "✗ Cuerpo aplasta la mecha",
        cell4: "✗ Mecha despreciable",
        footer: "Ratio mecha / cuerpo ≥ 2:1 = pin bar válida",
        mobileTitle: "Reconocer una pin bar válida",
        mobileCases: [
          { v: true, label: "Rechazo claro", wick: 140, body: 30, ratio: "4,7:1" },
          { v: false, label: "Mecha = Cuerpo", wick: 60, body: 60, ratio: "1:1" },
          { v: false, label: "Cuerpo aplasta la mecha", wick: 30, body: 120, ratio: "1:4" },
          { v: false, label: "Mecha despreciable", wick: 10, body: 60, ratio: "0,2:1" },
        ],
        mobileMecheLabel: "Mecha",
        mobileCorpsLabel: "Cuerpo",
        mobileRatioLabel: "Ratio",
        mobileFooter: "Ratio mecha / cuerpo ≥ 2:1 = pin bar válida",
      }
    : {
        title: "Reconnaître une pin bar valide en 5 secondes",
        cell1: "✓ Valide — Pin bar de rejet net",
        wickLabel: "Mèche :",
        bodyLabel: "Corps :",
        ratioLabel: "Ratio :",
        cell2: "✗ Mèche = Corps",
        cell3: "✗ Corps écrase la mèche",
        cell4: "✗ Mèche négligeable",
        footer: "Ratio mèche / corps ≥ 2:1 = pin bar valide",
        mobileTitle: "Reconnaître une pin bar valide",
        mobileCases: [
          { v: true, label: "Rejet net", wick: 140, body: 30, ratio: "4,7:1" },
          { v: false, label: "Mèche = Corps", wick: 60, body: 60, ratio: "1:1" },
          { v: false, label: "Corps écrase la mèche", wick: 30, body: 120, ratio: "1:4" },
          { v: false, label: "Mèche négligeable", wick: 10, body: 60, ratio: "0,2:1" },
        ],
        mobileMecheLabel: "Mèche",
        mobileCorpsLabel: "Corps",
        mobileRatioLabel: "Ratio",
        mobileFooter: "Ratio mèche / corps ≥ 2:1 = pin bar valide",
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

      {/* Pin bar : mèche basse longue 140px + petit corps 30px */}
      <line x1="210" y1="110" x2="210" y2="280" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="195" y="110" width="30" height="30" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="290" y="200" fill="#d4d4d8" fontSize="9">{t.wickLabel} 140 px</text>
      <text x="290" y="220" fill="#d4d4d8" fontSize="9">{t.bodyLabel} 30 px</text>
      <text x="290" y="240" fill="#10b981" fontSize="10" fontWeight="600">{t.ratioLabel} 4,7:1</text>

      {/* ═══════ CELLULE 2 — Mèche = Corps (haut droite) ═══════ */}
      <rect x="450" y="70" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="85" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell2}
      </text>

      <line x1="600" y1="160" x2="600" y2="280" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="585" y="160" width="30" height="60" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="680" y="200" fill="#d4d4d8" fontSize="9">{t.wickLabel} 60 px</text>
      <text x="680" y="220" fill="#d4d4d8" fontSize="9">{t.bodyLabel} 60 px</text>
      <text x="680" y="240" fill="#ef4444" fontSize="10" fontWeight="600">{t.ratioLabel} 1:1</text>

      {/* ═══════ CELLULE 3 — Corps écrase la mèche (bas gauche) ═══════ */}
      <rect x="60" y="310" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="210" y="325" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell3}
      </text>

      <line x1="210" y1="320" x2="210" y2="470" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="195" y="320" width="30" height="120" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="290" y="400" fill="#d4d4d8" fontSize="9">{t.wickLabel} 30 px</text>
      <text x="290" y="420" fill="#d4d4d8" fontSize="9">{t.bodyLabel} 120 px</text>
      <text x="290" y="440" fill="#ef4444" fontSize="10" fontWeight="600">{t.ratioLabel} 1:4</text>

      {/* ═══════ CELLULE 4 — Mèche négligeable (bas droite) ═══════ */}
      <rect x="450" y="310" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="325" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.cell4}
      </text>

      <line x1="600" y1="400" x2="600" y2="470" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="585" y="400" width="30" height="60" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="680" y="400" fill="#d4d4d8" fontSize="9">{t.wickLabel} 10 px</text>
      <text x="680" y="420" fill="#d4d4d8" fontSize="9">{t.bodyLabel} 60 px</text>
      <text x="680" y="440" fill="#ef4444" fontSize="10" fontWeight="600">{t.ratioLabel} 0,2:1</text>

      <text x="400" y="490" fill="#a1a1aa" fontSize="10" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* MOBILE : 4 cas validés/invalidés ─────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
      {t.mobileCases.map((c, i) => (
        <div key={i} className={`rounded-lg border p-2.5 ${c.v ? "border-emerald-500/40 bg-emerald-500/8" : "border-red-500/40 bg-red-500/8"}`}>
          <p className={`text-[13px] font-bold ${c.v ? "text-emerald-400" : "text-red-400"}`}>
            {c.v ? "✓" : "✗"} {c.label}
          </p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">
            {t.mobileMecheLabel} {c.wick}px · {t.mobileCorpsLabel} {c.body}px · <span className="font-bold font-mono">{t.mobileRatioLabel} {c.ratio}</span>
          </p>
        </div>
      ))}
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800">
        {t.mobileFooter}
      </p>
    </div>
    </div>
  );
}
