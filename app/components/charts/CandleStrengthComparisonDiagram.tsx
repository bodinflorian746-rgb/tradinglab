export default function CandleStrengthComparisonDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Leer la fuerza de una vela en 5 segundos",
        conviction: "Convicción alta",
        rejet: "Rechazo claro",
        indecision: "Indecisión",
        bascule: "Cambio",
        bodyRef: "Referencia cuerpo medio",
        footer: "4 patrones clave a identificar visualmente",
        mobileTitle: "Leer la fuerza de una vela en 5 segundos",
        marubozuDesc: "Cuerpo largo lleno, sin mecha",
        marubozuVerdict: "Convicción alta ↑",
        pinDesc: "Cuerpo pequeño + mecha muy larga de un lado",
        pinVerdict: "Rechazo claro ↑",
        dojiDesc: "Cuerpo casi nulo, mechas en los 2 lados",
        dojiVerdict: "Indecisión ↔",
        engulfDesc: "Vela que envuelve por completo la anterior",
        engulfVerdict: "Cambio ↑",
        mobileFooter: "4 patrones clave a identificar visualmente",
      }
    : {
        title: "Lire la force d'une bougie en 5 secondes",
        conviction: "Conviction forte",
        rejet: "Rejet net",
        indecision: "Indécision",
        bascule: "Bascule",
        bodyRef: "Référence corps moyen",
        footer: "4 patterns clés à identifier visuellement",
        mobileTitle: "Lire la force d'une bougie en 5 secondes",
        marubozuDesc: "Long corps plein, sans mèche",
        marubozuVerdict: "Conviction forte ↑",
        pinDesc: "Petit corps + très longue mèche d'un côté",
        pinVerdict: "Rejet net ↑",
        dojiDesc: "Corps quasi nul, mèches des 2 côtés",
        dojiVerdict: "Indécision ↔",
        engulfDesc: "Bougie qui avale entièrement la précédente",
        engulfVerdict: "Bascule ↑",
        mobileFooter: "4 patterns clés à identifier visuellement",
      };

  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="25" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      {/* Référence corps moyen */}
      <line x1="20" y1="200" x2="780" y2="200" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />

      {/* ═══ Bougie 1 — Marubozu vert (x=100) ═══ */}
      <line x1="100" y1="138" x2="100" y2="272" stroke="#059669" strokeWidth="1.5" />
      <rect x="75" y="140" width="50" height="130" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />
      <rect x="40" y="305" width="120" height="20" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="100" y="319" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.conviction}</text>
      <text x="100" y="345" fill="#d4d4d8" fontSize="9" textAnchor="middle">Marubozu</text>
      <text x="100" y="362" fill="#10b981" fontSize="14" textAnchor="middle">↑</text>

      {/* ═══ Bougie 2 — Pin bar (x=300) ═══ */}
      <line x1="300" y1="150" x2="300" y2="160" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="285" y="160" width="30" height="30" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />
      <line x1="300" y1="190" x2="300" y2="290" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="240" y="305" width="120" height="20" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="300" y="319" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.rejet}</text>
      <text x="300" y="345" fill="#d4d4d8" fontSize="9" textAnchor="middle">Pin bar</text>
      <text x="300" y="362" fill="#10b981" fontSize="14" textAnchor="middle">↑</text>

      {/* ═══ Bougie 3 — Doji (x=500) ═══ */}
      <line x1="500" y1="140" x2="500" y2="199" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
      <rect x="485" y="199" width="30" height="2" fill="#a1a1aa" stroke="#71717a" strokeWidth="1.5" />
      <line x1="500" y1="201" x2="500" y2="260" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
      <rect x="440" y="305" width="120" height="20" rx="4" fill="#27272a" stroke="#71717a" strokeWidth="0.8" />
      <text x="500" y="319" fill="#a1a1aa" fontSize="9" fontWeight="600" textAnchor="middle">{t.indecision}</text>
      <text x="500" y="345" fill="#d4d4d8" fontSize="9" textAnchor="middle">Doji</text>
      <text x="500" y="362" fill="#71717a" fontSize="14" textAnchor="middle">↔</text>

      {/* ═══ Bougie 4 — Engulfing (paire à x=650 et x=720) ═══ */}
      {/* Bougie A — rouge */}
      <line x1="650" y1="160" x2="650" y2="210" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="637" y="170" width="25" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />
      {/* Bougie B — verte qui englobe */}
      <line x1="720" y1="150" x2="720" y2="220" stroke="#059669" strokeWidth="2" />
      <rect x="707" y="160" width="25" height="50" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />
      <rect x="625" y="305" width="120" height="20" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="685" y="319" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.bascule}</text>
      <text x="685" y="345" fill="#d4d4d8" fontSize="9" textAnchor="middle">Engulfing</text>
      <text x="685" y="362" fill="#10b981" fontSize="14" textAnchor="middle">↑</text>

      {/* Halo + label Référence corps moyen — déplacé après tous les paths pour rester au-dessus */}
      <rect x="42" y="184" width="180" height="14" fill="#09090b" rx="3" />
      <text x="48" y="195" fill="#71717a" fontSize="8" fontStyle="italic">{t.bodyRef}</text>

      <text x="400" y="390" fill="#71717a" fontSize="9" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* MOBILE : 4 patterns en cartes ─────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
      {[
        { name: "Marubozu", icon: "█", desc: t.marubozuDesc, verdict: t.marubozuVerdict, color: "#10b981" },
        { name: "Pin bar", icon: "│█│", desc: t.pinDesc, verdict: t.pinVerdict, color: "#10b981" },
        { name: "Doji", icon: "+", desc: t.dojiDesc, verdict: t.dojiVerdict, color: "#a1a1aa" },
        { name: "Engulfing", icon: "▮▮", desc: t.engulfDesc, verdict: t.engulfVerdict, color: "#10b981" },
      ].map((p) => (
        <div key={p.name} className="rounded-lg border p-2.5" style={{ borderColor: `${p.color}55`, background: `${p.color}10` }}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[14px] font-bold" style={{ color: p.color }}>{p.name}</span>
            <span className="text-[13px] font-bold" style={{ color: p.color }}>{p.verdict}</span>
          </div>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{p.desc}</p>
        </div>
      ))}
      <p className="text-[12px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800">
        {t.mobileFooter}
      </p>
    </div>
    </div>
  );
}
