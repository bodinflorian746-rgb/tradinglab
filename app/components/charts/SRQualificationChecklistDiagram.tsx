export default function SRQualificationChecklistDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const L = locale === "es"
    ? {
        title: "Calificar un nivel S/R en 4 criterios",
        c1: "Toques múltiples (≥3)",
        c1d1: "El nivel ha sido testeado",
        c1d2: "al menos 3 veces",
        c2: "Horizontalidad respetada",
        c2d1: "Toques a la misma altura,",
        c2d2: "tolerancia <10 pips",
        c3: "Frescura (tocado recientemente)",
        c3d1: "Último toque en las",
        c3d2: "30 últimas velas",
        c4: "Confluencia (Fibo/MM/estructura)",
        c4d1: "Varias referencias cruzadas",
        c4d2: "en la misma zona",
        footer: "4/4 = nivel operacional",
        mobTitle: "4 criterios para calificar un S/R",
        mob: [
          { t: "Toques múltiples (≥3)", d: "El nivel ha sido testeado al menos 3 veces" },
          { t: "Horizontalidad respetada", d: "Toques a la misma altura, tolerancia < 10 pips" },
          { t: "Frescura (tocado recientemente)", d: "Último toque en las 30 últimas velas" },
          { t: "Confluencia (Fibo / MM / estructura)", d: "Varias referencias cruzadas en la misma zona" },
        ],
        mobFooter: "4/4 = nivel operacional",
      }
    : {
        title: "Qualifier un niveau S/R en 4 critères",
        c1: "Touches multiples (≥3)",
        c1d1: "Le niveau a été testé",
        c1d2: "au moins 3 fois",
        c2: "Horizontalité respectée",
        c2d1: "Touches à la même altitude,",
        c2d2: "tolérance <10 pips",
        c3: "Fraîcheur (touché récemment)",
        c3d1: "Dernière touche dans les",
        c3d2: "30 dernières bougies",
        c4: "Confluence (Fibo/MM/structure)",
        c4d1: "Plusieurs références croisées",
        c4d2: "à la même zone",
        footer: "4/4 = niveau opérationnel",
        mobTitle: "4 critères pour qualifier un S/R",
        mob: [
          { t: "Touches multiples (≥3)", d: "Le niveau a été testé au moins 3 fois" },
          { t: "Horizontalité respectée", d: "Touches à la même altitude, tolérance < 10 pips" },
          { t: "Fraîcheur (touché récemment)", d: "Dernière touche dans les 30 dernières bougies" },
          { t: "Confluence (Fibo / MM / structure)", d: "Plusieurs références croisées à la même zone" },
        ],
        mobFooter: "4/4 = niveau opérationnel",
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

      {/* ═══ Cellule 1 — Touches multiples ═══ */}
      <circle cx="80" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">{L.c1}</text>
      <text x="135" y="103" fill="#a1a1aa" fontSize="9">{L.c1d1}</text>
      <text x="135" y="116" fill="#a1a1aa" fontSize="9">{L.c1d2}</text>
      {/* Mini niveau avec 3 cercles */}
      <line x1="295" y1="115" x2="380" y2="115" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 2" />
      <circle cx="310" cy="115" r="3" fill="#10b981" />
      <circle cx="340" cy="115" r="3" fill="#10b981" />
      <circle cx="370" cy="115" r="3" fill="#10b981" />

      {/* ═══ Cellule 2 — Horizontalité ═══ */}
      <circle cx="460" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">{L.c2}</text>
      <text x="515" y="103" fill="#a1a1aa" fontSize="9">{L.c2d1}</text>
      <text x="515" y="116" fill="#a1a1aa" fontSize="9">{L.c2d2}</text>
      {/* Ligne pointillée parfaitement plate */}
      <line x1="680" y1="115" x2="775" y2="115" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="775" y="105" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="end">═════</text>

      {/* ═══ Cellule 3 — Fraîcheur ═══ */}
      <circle cx="80" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">{L.c3}</text>
      <text x="135" y="223" fill="#a1a1aa" fontSize="9">{L.c3d1}</text>
      <text x="135" y="236" fill="#a1a1aa" fontSize="9">{L.c3d2}</text>
      {/* Icône horloge */}
      <circle cx="340" cy="225" r="20" fill="none" stroke="#10b981" strokeWidth="1.5" />
      <line x1="340" y1="225" x2="340" y2="210" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="340" y1="225" x2="352" y2="232" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />

      {/* ═══ Cellule 4 — Confluence ═══ */}
      <circle cx="460" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">{L.c4}</text>
      <text x="515" y="223" fill="#a1a1aa" fontSize="9">{L.c4d1}</text>
      <text x="515" y="236" fill="#a1a1aa" fontSize="9">{L.c4d2}</text>
      {/* Icône intersection de lignes */}
      <line x1="700" y1="200" x2="780" y2="250" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="700" y1="250" x2="780" y2="200" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="700" y1="225" x2="780" y2="225" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="740" cy="225" r="3" fill="#10b981" />

      <rect x="280" y="280" width="240" height="18" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="400" y="293" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.footer}</text>
    </svg>

    {/* MOBILE : 4 critères qualification S/R ─────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
      {L.mob.map((c, i) => (
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
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
}
