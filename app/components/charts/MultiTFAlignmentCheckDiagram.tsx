export default function MultiTFAlignmentCheckDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const L = locale === "es"
    ? {
        title: "Alinear Daily → H4 → M15 en 4 criterios",
        c1: "Bias Daily alineado",
        c1d1: "Tendencia mayor HH/HL",
        c1d2: "o LH/LL confirmada",
        c2: "Nivel H4 confluente",
        c2d1: "S/R, Fibo, MM, OB",
        c2d2: "cruzados en la misma zona",
        c3: "Señal M15 confirmada",
        c3d1: "Pin bar, engulfing,",
        c3d2: "rechazo inmediato",
        c4: "News clean",
        c4d1: "Sin NFP, FOMC, CPI",
        c4d2: "en los próximos 30 minutos",
        footer: "4/4 = entrada precisa posible",
        mobTitle: "4 criterios de alineación multi-TF",
        mob: [
          { title: "Bias Daily alineado", desc: "Tendencia mayor HH/HL o LH/LL confirmada" },
          { title: "Nivel H4 confluente", desc: "S/R, Fibo, MM, OB cruzados en la misma zona" },
          { title: "Señal M15 confirmada", desc: "Pin bar, engulfing, rechazo inmediato" },
          { title: "News clean", desc: "Sin NFP, FOMC, CPI en los próximos 30 minutos" },
        ],
        mobFooter: "4/4 = entrada precisa posible",
      }
    : {
        title: "Aligner Daily → H4 → M15 en 4 critères",
        c1: "Biais Daily aligné",
        c1d1: "Tendance majeure HH/HL",
        c1d2: "ou LH/LL confirmée",
        c2: "Niveau H4 confluent",
        c2d1: "S/R, Fibo, MM, OB",
        c2d2: "croisés à la même zone",
        c3: "Signal M15 confirmé",
        c3d1: "Pin bar, engulfing,",
        c3d2: "rejet immédiat",
        c4: "News clean",
        c4d1: "Pas de NFP, FOMC, CPI",
        c4d2: "dans les 30 minutes",
        footer: "4/4 = entrée précise possible",
        mobTitle: "4 critères d'alignement multi-TF",
        mob: [
          { title: "Biais Daily aligné", desc: "Tendance majeure HH/HL ou LH/LL confirmée" },
          { title: "Niveau H4 confluent", desc: "S/R, Fibo, MM, OB croisés à la même zone" },
          { title: "Signal M15 confirmé", desc: "Pin bar, engulfing, rejet immédiat" },
          { title: "News clean", desc: "Pas de NFP, FOMC, CPI dans les 30 minutes" },
        ],
        mobFooter: "4/4 = entrée précise possible",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 300"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {L.title}
      </text>

      <line x1="400" y1="40" x2="400" y2="270" stroke="#3f3f46" strokeWidth="1" />
      <line x1="20" y1="160" x2="780" y2="160" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ Cellule 1 — Biais Daily aligné ═══ */}
      <circle cx="80" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">{L.c1}</text>
      <text x="135" y="103" fill="#a1a1aa" fontSize="9">{L.c1d1}</text>
      <text x="135" y="116" fill="#a1a1aa" fontSize="9">{L.c1d2}</text>
      {/* Icône calendrier */}
      <rect x="320" y="85" width="50" height="50" fill="#27272a" stroke="#10b981" strokeWidth="1" rx="3" />
      <line x1="320" y1="100" x2="370" y2="100" stroke="#10b981" strokeWidth="1" />
      <text x="345" y="123" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">D1</text>

      {/* ═══ Cellule 2 — Niveau H4 confluent ═══ */}
      <circle cx="460" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">{L.c2}</text>
      <text x="515" y="103" fill="#a1a1aa" fontSize="9">{L.c2d1}</text>
      <text x="515" y="116" fill="#a1a1aa" fontSize="9">{L.c2d2}</text>
      {/* Icône niveau horizontal */}
      <line x1="700" y1="95" x2="770" y2="95" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 2" />
      <line x1="700" y1="115" x2="770" y2="115" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3 2" />
      <line x1="700" y1="135" x2="770" y2="135" stroke="#a1a1aa" strokeWidth="1.2" strokeDasharray="3 2" />

      {/* ═══ Cellule 3 — Signal M15 confirmé ═══ */}
      <circle cx="80" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">{L.c3}</text>
      <text x="135" y="223" fill="#a1a1aa" fontSize="9">{L.c3d1}</text>
      <text x="135" y="236" fill="#a1a1aa" fontSize="9">{L.c3d2}</text>
      {/* Mini pin bar */}
      <line x1="340" y1="195" x2="340" y2="245" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="333" y="195" width="14" height="12" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />

      {/* ═══ Cellule 4 — News clean ═══ */}
      <circle cx="460" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">{L.c4}</text>
      <text x="515" y="223" fill="#a1a1aa" fontSize="9">{L.c4d1}</text>
      <text x="515" y="236" fill="#a1a1aa" fontSize="9">{L.c4d2}</text>
      {/* Icône calendrier avec X */}
      <rect x="700" y="200" width="50" height="50" fill="#27272a" stroke="#ef4444" strokeWidth="1" rx="3" />
      <line x1="700" y1="215" x2="750" y2="215" stroke="#ef4444" strokeWidth="1" />
      <line x1="708" y1="225" x2="742" y2="245" stroke="#ef4444" strokeWidth="2" />
      <line x1="742" y1="225" x2="708" y2="245" stroke="#ef4444" strokeWidth="2" />

      <rect x="280" y="280" width="240" height="18" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="400" y="293" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.footer}</text>
    </svg>

    {/* MOBILE : 4 critères d'alignement ─────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
      {L.mob.map((c, i) => (
        <div key={i} className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5">
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[14px] font-bold text-emerald-400">✓</span>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-emerald-400">{c.title}</p>
              <p className="text-[12px] text-zinc-300 leading-snug">{c.desc}</p>
            </div>
          </div>
        </div>
      ))}
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800">
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
}
