export const WeeklyBiasCalendarDiagram = () => {
  const days = [
    {
      label: "DIM", x: 20, cx: 70,
      headerFill: "#10b981", bodyStroke: "#10b981", labelFill: "#09090b", circleFill: "#10b981",
      title1: "Construire", title2: "le biais",
      lines: ["Calendrier", "+ DXY", "+ corrélations"],
      duration: "(20 min)", durationFill: "#34d399",
    },
    {
      label: "LUN", x: 130, cx: 180,
      headerFill: "#34d399", bodyStroke: "#34d399", labelFill: "#09090b", circleFill: "#34d399",
      title1: "Exécuter", title2: "le biais",
      lines: ["Setups selon", "biais construit", ""],
      duration: "(jour propre)", durationFill: "#34d399",
    },
    {
      label: "MAR", x: 240, cx: 290,
      headerFill: "#3f3f46", bodyStroke: "#71717a", labelFill: "#d4d4d8", circleFill: "#71717a",
      title1: "Suivre", title2: "le plan",
      lines: ["Discipline", "Pas de", "réaction"],
      duration: "(jour neutre)", durationFill: "#a1a1aa",
    },
    {
      label: "MER", x: 350, cx: 400,
      headerFill: "#fbbf24", bodyStroke: "#fbbf24", labelFill: "#09090b", circleFill: "#fbbf24",
      title1: "CPI", title2: "14h30",
      lines: ["Prudence", "avant", "+ recalibrage"],
      duration: "(jour à risque)", durationFill: "#fbbf24",
    },
    {
      label: "JEU", x: 460, cx: 510,
      headerFill: "#60a5fa", bodyStroke: "#60a5fa", labelFill: "#09090b", circleFill: "#60a5fa",
      title1: "Recalibrer", title2: "selon CPI",
      lines: ["Ajuster", "le biais", "selon réaction"],
      duration: "(jour ajustement)", durationFill: "#60a5fa",
    },
    {
      label: "VEN", x: 570, cx: 620,
      headerFill: "#fbbf24", bodyStroke: "#fbbf24", labelFill: "#09090b", circleFill: "#fbbf24",
      title1: "NFP", title2: "14h30",
      lines: ["Pas de trade", "avant la", "réaction"],
      duration: "(jour à risque)", durationFill: "#fbbf24",
    },
    {
      label: "SAM", x: 680, cx: 730,
      headerFill: "#3f3f46", bodyStroke: "#71717a", labelFill: "#d4d4d8", circleFill: "#71717a",
      title1: "Review", title2: "semaine",
      lines: ["Bilan", "Ce qui a", "marché ou non"],
      duration: "(jour pause)", durationFill: "#a1a1aa",
    },
  ];

  const arrowGaps = [
    { x1: 125, x2: 128 },
    { x1: 235, x2: 238 },
    { x1: 345, x2: 348 },
    { x1: 455, x2: 458 },
    { x1: 565, x2: 568 },
    { x1: 675, x2: 678 },
  ];

  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrow-week" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="#71717a" />
        </marker>
      </defs>

      {/* Layer 1 — Fond global */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        La semaine d&apos;un trader macro préparé
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        Plan → exécution → recalibrage
      </text>

      {/* Layer 3 — 7 cartes */}
      {days.map((day) => (
        <g key={day.label}>
          {/* Corps de la carte (fond + bordure couleur) */}
          <rect x={day.x} y={110} width={100} height={210} rx={6}
            fill="#27272a" stroke={day.bodyStroke} strokeWidth={1.5} />
          {/* Header coloré (overlay, rounded top) */}
          <rect x={day.x} y={110} width={100} height={26} rx={6} fill={day.headerFill} />
          {/* Label jour */}
          <text x={day.cx} y={124} fill={day.labelFill} fontSize="11" fontWeight="700"
            textAnchor="middle" letterSpacing="0.05em">
            {day.label}
          </text>
          {/* Pictogramme */}
          <circle cx={day.cx} cy={160} r={14} fill={day.circleFill} />
          {/* Titre ligne 1 */}
          <text x={day.cx} y={200} fill="white" fontSize="11" fontWeight="700" textAnchor="middle">
            {day.title1}
          </text>
          {/* Titre ligne 2 */}
          <text x={day.cx} y={215} fill="white" fontSize="11" fontWeight="700" textAnchor="middle">
            {day.title2}
          </text>
          {/* Sous-texte ligne 1 */}
          {day.lines[0] && (
            <text x={day.cx} y={240} fill="#d4d4d8" fontSize="9" textAnchor="middle">
              {day.lines[0]}
            </text>
          )}
          {/* Sous-texte ligne 2 */}
          {day.lines[1] && (
            <text x={day.cx} y={253} fill="#d4d4d8" fontSize="9" textAnchor="middle">
              {day.lines[1]}
            </text>
          )}
          {/* Sous-texte ligne 3 */}
          {day.lines[2] && (
            <text x={day.cx} y={266} fill="#d4d4d8" fontSize="9" textAnchor="middle">
              {day.lines[2]}
            </text>
          )}
          {/* Durée / type de journée */}
          <text x={day.cx} y={295} fill={day.durationFill} fontSize="10"
            fontStyle="italic" textAnchor="middle">
            {day.duration}
          </text>
        </g>
      ))}

      {/* Layer 4 — Flèches entre cartes */}
      {arrowGaps.map((arrow, i) => (
        <line
          key={`arrow-${i}`}
          x1={arrow.x1} y1={215}
          x2={arrow.x2} y2={215}
          stroke="#71717a"
          strokeWidth="2"
          markerEnd="url(#arrow-week)"
        />
      ))}

      {/* Layer 5 — Légende */}
      <text x="400" y="345" fill="#fbbf24" fontSize="11" fontWeight="700"
        letterSpacing="0.05em" textAnchor="middle">
        LECTURE DU CALENDRIER
      </text>

      <rect x="80" y="368" width="12" height="12" rx="2" fill="#10b981" />
      <text x="100" y="378" fill="#d4d4d8" fontSize="10">Construction</text>

      <rect x="240" y="368" width="12" height="12" rx="2" fill="#34d399" />
      <text x="260" y="378" fill="#d4d4d8" fontSize="10">Exécution</text>

      <rect x="400" y="368" width="12" height="12" rx="2" fill="#fbbf24" />
      <text x="420" y="378" fill="#d4d4d8" fontSize="10">Jour à risque (news)</text>

      <rect x="600" y="368" width="12" height="12" rx="2" fill="#60a5fa" />
      <text x="620" y="378" fill="#d4d4d8" fontSize="10">Recalibrage</text>

      {/* Layer 6 — Pied de page */}
      <text x="400" y="420" fill="#34d399" fontSize="12" fontWeight="700"
        fontStyle="italic" textAnchor="middle">
        Le retail découvre la semaine. Le pro l&apos;exécute.
      </text>
    </svg>

    {/* ── MOBILE : 7 jours empilés ───────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-2">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        La semaine d'un trader macro préparé
      </p>
      <p className="text-[12px] text-zinc-400 italic text-center -mt-1 mb-2">
        Plan → exécution → recalibrage
      </p>

      {days.map((day) => (
        <div
          key={day.label}
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: day.bodyStroke }}
        >
          <div className="flex items-stretch">
            {/* Jour pastille colorée */}
            <div className="shrink-0 w-14 flex items-center justify-center font-bold text-[14px] tracking-wider" style={{ background: day.headerFill, color: day.labelFill }}>
              {day.label}
            </div>
            <div className="flex-1 p-2.5 bg-zinc-900">
              <p className="text-[14px] font-bold text-white">{day.title1} {day.title2 && `${day.title2}`}</p>
              <p className="text-[12px] text-zinc-400 leading-snug mt-0.5">{day.lines.filter(Boolean).join(" · ")}</p>
              <p className="text-[11px] italic mt-0.5" style={{ color: day.durationFill }}>{day.duration}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Légende lecture */}
      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-zinc-800 mt-3">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-[12px] text-zinc-300">Construction</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-400" /><span className="text-[12px] text-zinc-300">Exécution</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400" /><span className="text-[12px] text-zinc-300">Jour à risque</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-400" /><span className="text-[12px] text-zinc-300">Recalibrage</span></div>
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug pt-2 border-t border-zinc-800">
        Le retail découvre la semaine. Le pro l'exécute.
      </p>
    </div>
    </div>
  );
};
