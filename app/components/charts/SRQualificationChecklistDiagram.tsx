export default function SRQualificationChecklistDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 300"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Qualifier un niveau S/R en 4 critères
      </text>

      <line x1="400" y1="40" x2="400" y2="270" stroke="#3f3f46" strokeWidth="1" />
      <line x1="20" y1="160" x2="780" y2="160" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ Cellule 1 — Touches multiples ═══ */}
      <circle cx="80" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">Touches multiples (≥3)</text>
      <text x="135" y="103" fill="#a1a1aa" fontSize="9">Le niveau a été testé</text>
      <text x="135" y="116" fill="#a1a1aa" fontSize="9">au moins 3 fois</text>
      {/* Mini niveau avec 3 cercles */}
      <line x1="295" y1="115" x2="380" y2="115" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 2" />
      <circle cx="310" cy="115" r="3" fill="#10b981" />
      <circle cx="340" cy="115" r="3" fill="#10b981" />
      <circle cx="370" cy="115" r="3" fill="#10b981" />

      {/* ═══ Cellule 2 — Horizontalité ═══ */}
      <circle cx="460" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">Horizontalité respectée</text>
      <text x="515" y="103" fill="#a1a1aa" fontSize="9">Touches à la même altitude,</text>
      <text x="515" y="116" fill="#a1a1aa" fontSize="9">tolérance &lt;10 pips</text>
      {/* Ligne pointillée parfaitement plate */}
      <line x1="680" y1="115" x2="775" y2="115" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="775" y="105" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="end">═════</text>

      {/* ═══ Cellule 3 — Fraîcheur ═══ */}
      <circle cx="80" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">Fraîcheur (touché récemment)</text>
      <text x="135" y="223" fill="#a1a1aa" fontSize="9">Dernière touche dans les</text>
      <text x="135" y="236" fill="#a1a1aa" fontSize="9">30 dernières bougies</text>
      {/* Icône horloge */}
      <circle cx="340" cy="225" r="20" fill="none" stroke="#10b981" strokeWidth="1.5" />
      <line x1="340" y1="225" x2="340" y2="210" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="340" y1="225" x2="352" y2="232" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />

      {/* ═══ Cellule 4 — Confluence ═══ */}
      <circle cx="460" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">Confluence (Fibo/MM/structure)</text>
      <text x="515" y="223" fill="#a1a1aa" fontSize="9">Plusieurs références croisées</text>
      <text x="515" y="236" fill="#a1a1aa" fontSize="9">à la même zone</text>
      {/* Icône intersection de lignes */}
      <line x1="700" y1="200" x2="780" y2="250" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="700" y1="250" x2="780" y2="200" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="700" y1="225" x2="780" y2="225" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="740" cy="225" r="3" fill="#10b981" />

      <rect x="280" y="280" width="240" height="18" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="400" y="293" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">4/4 = niveau opérationnel</text>
    </svg>

    {/* MOBILE : 4 critères qualification S/R ─────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">4 critères pour qualifier un S/R</p>
      {[
        { t: "Touches multiples (≥3)", d: "Le niveau a été testé au moins 3 fois" },
        { t: "Horizontalité respectée", d: "Touches à la même altitude, tolérance < 10 pips" },
        { t: "Fraîcheur (touché récemment)", d: "Dernière touche dans les 30 dernières bougies" },
        { t: "Confluence (Fibo / MM / structure)", d: "Plusieurs références croisées à la même zone" },
      ].map((c, i) => (
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
        4/4 = niveau opérationnel
      </p>
    </div>
    </div>
  );
}
