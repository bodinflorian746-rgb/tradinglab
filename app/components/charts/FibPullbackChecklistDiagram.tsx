export default function FibPullbackChecklistDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const labels = locale === "es"
    ? {
        title: "Validar un pullback Fibo en 4 criterios",
        impulsionTitle: "Impulsión clara",
        impulsionDesc1: "Movimiento franco, displacement",
        impulsionDesc2: "superior al promedio",
        retracementTitle: "Retracement 30-60%",
        retracementDesc1: "Zona OTE Fibonacci",
        retracementDesc2: "61.8% a 78.6%",
        rejectTitle: "Señal de rechazo",
        rejectDesc1: "Pin bar, engulfing,",
        rejectDesc2: "reacción inmediata",
        biasTitle: "Bias TF superior alineado",
        biasDesc1: "Daily o H4 en el sentido",
        biasDesc2: "de la impulsión",
        footer: "4/4 = setup a privilegiar",
        mobTitle: "Validar un pullback Fibo",
        mob: [
          { t: "Impulsión clara", d: "Movimiento franco, displacement > promedio" },
          { t: "Retracement 30-60%", d: "Zona OTE Fibonacci 61.8% a 78.6%" },
          { t: "Señal de rechazo", d: "Pin bar, engulfing, reacción inmediata" },
          { t: "Bias TF superior alineado", d: "Daily o H4 en el sentido de la impulsión" },
        ],
        mobFooter: "4/4 = setup a privilegiar",
      }
    : {
        title: "Valider un pullback Fibo en 4 critères",
        impulsionTitle: "Impulsion claire",
        impulsionDesc1: "Mouvement franc, displacement",
        impulsionDesc2: "supérieur à la moyenne",
        retracementTitle: "Retracement 30-60%",
        retracementDesc1: "Zone OTE Fibonacci",
        retracementDesc2: "61.8% à 78.6%",
        rejectTitle: "Signal de rejet",
        rejectDesc1: "Pin bar, engulfing,",
        rejectDesc2: "réaction immédiate",
        biasTitle: "Biais TF supérieur aligné",
        biasDesc1: "Daily ou H4 dans le sens",
        biasDesc2: "de l'impulsion",
        footer: "4/4 = setup à privilégier",
        mobTitle: "Valider un pullback Fibo",
        mob: [
          { t: "Impulsion claire", d: "Mouvement franc, displacement > moyenne" },
          { t: "Retracement 30-60%", d: "Zone OTE Fibonacci 61.8% à 78.6%" },
          { t: "Signal de rejet", d: "Pin bar, engulfing, réaction immédiate" },
          { t: "Biais TF supérieur aligné", d: "Daily ou H4 dans le sens de l'impulsion" },
        ],
        mobFooter: "4/4 = setup à privilégier",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 300"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {labels.title}
      </text>

      <line x1="400" y1="40" x2="400" y2="270" stroke="#3f3f46" strokeWidth="1" />
      <line x1="20" y1="160" x2="780" y2="160" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ Cellule 1 — Impulsion claire ═══ */}
      <circle cx="80" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">{labels.impulsionTitle}</text>
      <text x="135" y="103" fill="#a1a1aa" fontSize="9">{labels.impulsionDesc1}</text>
      <text x="135" y="116" fill="#a1a1aa" fontSize="9">{labels.impulsionDesc2}</text>
      {/* Mini icône path montant */}
      <path d="M300,130 L320,115 L340,95 L360,80 L380,65" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

      {/* ═══ Cellule 2 — Retracement 30-60% ═══ */}
      <circle cx="460" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">{labels.retracementTitle}</text>
      <text x="515" y="103" fill="#a1a1aa" fontSize="9">{labels.retracementDesc1}</text>
      <text x="515" y="116" fill="#a1a1aa" fontSize="9">{labels.retracementDesc2}</text>
      {/* Mini Fibonacci avec OTE */}
      <line x1="700" y1="70" x2="775" y2="70" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="2 2" />
      <line x1="700" y1="100" x2="775" y2="100" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="2 2" />
      <rect x="700" y="110" width="75" height="20" fill="#60a5fa15" stroke="#60a5fa40" strokeWidth="0.6" />
      <text x="737" y="124" fill="#60a5fa" fontSize="8" textAnchor="middle">OTE</text>
      <line x1="700" y1="135" x2="775" y2="135" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="2 2" />

      {/* ═══ Cellule 3 — Signal de rejet ═══ */}
      <circle cx="80" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">{labels.rejectTitle}</text>
      <text x="135" y="223" fill="#a1a1aa" fontSize="9">{labels.rejectDesc1}</text>
      <text x="135" y="236" fill="#a1a1aa" fontSize="9">{labels.rejectDesc2}</text>
      {/* Mini pin bar */}
      <line x1="335" y1="180" x2="335" y2="240" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="328" y="180" width="14" height="12" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />

      {/* ═══ Cellule 4 — Biais TF supérieur ═══ */}
      <circle cx="460" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">{labels.biasTitle}</text>
      <text x="515" y="223" fill="#a1a1aa" fontSize="9">{labels.biasDesc1}</text>
      <text x="515" y="236" fill="#a1a1aa" fontSize="9">{labels.biasDesc2}</text>
      {/* Flèche directionnelle */}
      <line x1="720" y1="235" x2="770" y2="195" stroke="#10b981" strokeWidth="2" />
      <path d="M762,194 L770,195 L765,202" stroke="#10b981" strokeWidth="2" fill="none" />

      <rect x="280" y="280" width="240" height="18" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="400" y="293" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{labels.footer}</text>
    </svg>

    {/* MOBILE : 4 critères pullback Fibo ─────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{labels.mobTitle}</p>
      {labels.mob.map((c, i) => (
        <div key={i} className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5">
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[14px] font-bold text-emerald-400">✓</span>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-emerald-400">{c.t}</p>
              <p className="text-[12px] text-zinc-300 leading-snug">{c.d}</p>
            </div>
          </div>
        </div>
      ))}
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800">
        {labels.mobFooter}
      </p>
    </div>
    </div>
  );
}
