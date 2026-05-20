export const MacroDangerWindowsDiagram = () => {
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1 — Fond */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        Les fenêtres de danger macro — journée type
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        Identifie quand éviter, quand observer, quand trader
      </text>

      {/* Layer 3 — Zones colorées (avant axe et marqueurs) */}

      {/* Verte 8h–12h30 : x=60 → x=278.5 */}
      <rect x="60" y="175" width="218.5" height="50"
        fill="#10b981" fillOpacity="0.15" stroke="#34d399" strokeOpacity="0.4" strokeWidth="1" />

      {/* Rouge 12h30–14h (BoE) : x=278.5 → x=351 */}
      <rect x="278.5" y="175" width="72.5" height="50"
        fill="#ef4444" fillOpacity="0.20" stroke="#f87171" strokeOpacity="0.5" strokeWidth="1" />

      {/* Rouge 14h–15h30 (BCE+NFP) : x=351 → x=423.75 */}
      <rect x="351" y="175" width="72.75" height="50"
        fill="#ef4444" fillOpacity="0.20" stroke="#f87171" strokeOpacity="0.5" strokeWidth="1" />

      {/* Verte 16h–19h30 : x=449 → x=618 */}
      <rect x="449" y="175" width="169" height="50"
        fill="#10b981" fillOpacity="0.15" stroke="#34d399" strokeOpacity="0.4" strokeWidth="1" />

      {/* Rouge 19h30–21h (FOMC) : x=618 → x=690.5 */}
      <rect x="618" y="175" width="72.5" height="50"
        fill="#ef4444" fillOpacity="0.20" stroke="#f87171" strokeOpacity="0.5" strokeWidth="1" />

      {/* Verte 21h–22h : x=690.5 → x=740 */}
      <rect x="690.5" y="175" width="49.5" height="50"
        fill="#10b981" fillOpacity="0.15" stroke="#34d399" strokeOpacity="0.4" strokeWidth="1" />

      {/* Labels de session dans les zones vertes */}
      <text x="169" y="205" fill="#34d399" fontSize="9" fontStyle="italic" textAnchor="middle">Session EU</text>
      <text x="533" y="205" fill="#34d399" fontSize="9" fontStyle="italic" textAnchor="middle">Session US</text>

      {/* Layer 4 — Axe horizontal */}
      <line x1="60" y1="225" x2="740" y2="225" stroke="#3f3f46" strokeWidth="1.5" />

      {/* Layer 5 — Marqueurs d'actualités */}

      {/* BoE 13h — amber dashed, x=302.5 */}
      <line x1="302.5" y1="118" x2="302.5" y2="175" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* BCE 14h15 — amber dashed, x=363.1 */}
      <line x1="363.1" y1="97" x2="363.1" y2="175" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* NFP/CPI 14h30 — rouge solid, x=375.25 */}
      <line x1="375.25" y1="97" x2="375.25" y2="175" stroke="#ef4444" strokeWidth="2" />

      {/* FOMC 20h — rouge solid, x=643 */}
      <line x1="643" y1="97" x2="643" y2="175" stroke="#ef4444" strokeWidth="2" />

      {/* Layer 6 — Pastilles labels (au-dessus de tout) */}

      {/* BoE 13h */}
      <rect x="263" y="100" width="80" height="17" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="303" y="113" fill="#fbbf24" fontSize="10" fontWeight="700" textAnchor="middle">BoE 13h</text>

      {/* BCE 14h15 */}
      <rect x="320" y="79" width="86" height="17" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="363" y="92" fill="#fbbf24" fontSize="10" fontWeight="700" textAnchor="middle">BCE 14h15</text>

      {/* NFP/CPI 14h30 — label à droite de la ligne */}
      <rect x="380" y="155" width="66" height="17" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="413" y="168" fill="#f87171" fontSize="10" fontWeight="700" textAnchor="middle">NFP / CPI</text>

      {/* FOMC 20h */}
      <rect x="605" y="79" width="76" height="17" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="643" y="92" fill="#f87171" fontSize="10" fontWeight="700" textAnchor="middle">FOMC 20h</text>

      {/* Layer 7 — Graduations horaires (toutes les 2h, 8h→22h) */}

      <line x1="60" y1="225" x2="60" y2="233" stroke="#52525b" strokeWidth="1" />
      <text x="60" y="246" fill="#71717a" fontSize="10" textAnchor="middle">8h</text>

      <line x1="157" y1="225" x2="157" y2="233" stroke="#52525b" strokeWidth="1" />
      <text x="157" y="246" fill="#71717a" fontSize="10" textAnchor="middle">10h</text>

      <line x1="254" y1="225" x2="254" y2="233" stroke="#52525b" strokeWidth="1" />
      <text x="254" y="246" fill="#71717a" fontSize="10" textAnchor="middle">12h</text>

      <line x1="351" y1="225" x2="351" y2="233" stroke="#52525b" strokeWidth="1" />
      <text x="351" y="246" fill="#71717a" fontSize="10" textAnchor="middle">14h</text>

      <line x1="449" y1="225" x2="449" y2="233" stroke="#52525b" strokeWidth="1" />
      <text x="449" y="246" fill="#71717a" fontSize="10" textAnchor="middle">16h</text>

      <line x1="546" y1="225" x2="546" y2="233" stroke="#52525b" strokeWidth="1" />
      <text x="546" y="246" fill="#71717a" fontSize="10" textAnchor="middle">18h</text>

      <line x1="643" y1="225" x2="643" y2="233" stroke="#52525b" strokeWidth="1" />
      <text x="643" y="246" fill="#71717a" fontSize="10" textAnchor="middle">20h</text>

      <line x1="740" y1="225" x2="740" y2="233" stroke="#52525b" strokeWidth="1" />
      <text x="740" y="246" fill="#71717a" fontSize="10" textAnchor="middle">22h</text>

      {/* Layer 8 — Légende RÈGLE D'OR */}
      <line x1="60" y1="263" x2="740" y2="263" stroke="#27272a" strokeWidth="1" />

      <text x="400" y="282" fill="#fbbf24" fontSize="12" fontWeight="700" letterSpacing="0.08em" textAnchor="middle">
        RÈGLE D&apos;OR
      </text>

      {/* Colonne AVANT — x=180 */}
      <circle cx="180" cy="302" r="7" fill="#ef4444" />
      <text x="180" y="322" fill="#d4d4d8" fontSize="11" fontWeight="700" textAnchor="middle">30 MIN AVANT</text>
      <text x="180" y="338" fill="#a1a1aa" fontSize="10" textAnchor="middle">Évite d&apos;entrer</text>
      <text x="180" y="352" fill="#a1a1aa" fontSize="10" textAnchor="middle">en position</text>

      {/* Colonne PENDANT — x=400 */}
      <circle cx="400" cy="302" r="7" fill="#ef4444" />
      <text x="400" y="322" fill="#d4d4d8" fontSize="11" fontWeight="700" textAnchor="middle">PENDANT</text>
      <text x="400" y="338" fill="#a1a1aa" fontSize="10" textAnchor="middle">Ne trade pas</text>
      <text x="400" y="352" fill="#a1a1aa" fontSize="10" textAnchor="middle">Observe</text>

      {/* Colonne APRÈS — x=620 */}
      <circle cx="620" cy="302" r="7" fill="#fbbf24" />
      <text x="620" y="322" fill="#d4d4d8" fontSize="11" fontWeight="700" textAnchor="middle">1H APRÈS</text>
      <text x="620" y="338" fill="#a1a1aa" fontSize="10" textAnchor="middle">Attends</text>
      <text x="620" y="352" fill="#a1a1aa" fontSize="10" textAnchor="middle">confirmation</text>

      {/* Layer 9 — Pied de page */}
      <text x="400" y="430" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        Le risque dépend de l&apos;heure. Apprends à lire la journée comme une météo macro.
      </text>
    </svg>

    {/* ── MOBILE : fenêtres temporelles empilées ─────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        Fenêtres de danger macro — journée type
      </p>

      {/* Timeline verticale */}
      <div className="space-y-2">
        {[
          { range: "08h – 12h30", session: "Session EU", danger: false, label: "Zone calme", events: null },
          { range: "12h30 – 13h", session: null, danger: true, label: "⚠ BoE 13h", events: "Discours Banque d'Angleterre" },
          { range: "14h15", session: null, danger: true, label: "⚠ BCE 14h15", events: "Décision BCE" },
          { range: "14h30", session: null, danger: true, label: "🔴 NFP / CPI 14h30", events: "Plus grosse news US du jour" },
          { range: "16h – 19h30", session: "Session US", danger: false, label: "Zone calme", events: null },
          { range: "20h", session: null, danger: true, label: "🔴 FOMC 20h", events: "Décision Réserve fédérale" },
          { range: "21h – 22h", session: null, danger: false, label: "Fin de journée", events: null },
        ].map((w, i) => (
          <div
            key={i}
            className={`rounded-lg border p-2.5 ${
              w.danger ? "border-red-500/40 bg-red-500/8" : "border-emerald-500/30 bg-emerald-500/5"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className={`text-[13px] font-bold font-mono ${w.danger ? "text-red-400" : "text-emerald-400"}`}>{w.range}</span>
              <span className={`text-[12px] font-semibold ${w.danger ? "text-red-400" : "text-emerald-400"}`}>{w.session ?? w.label}</span>
            </div>
            {w.events && (
              <p className="text-[12px] text-zinc-300 leading-snug mt-1">{w.events}</p>
            )}
          </div>
        ))}
      </div>

      {/* Règle d'or */}
      <div className="rounded-xl border-2 border-amber-400 bg-amber-400/5 p-3 mt-3">
        <p className="text-[13px] font-bold text-amber-400 uppercase tracking-wider text-center mb-2.5">
          ⚡ Règle d'or
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-3 h-3 rounded-full bg-red-400 mt-1" />
            <div>
              <p className="text-[13px] font-bold text-white">30 min AVANT</p>
              <p className="text-[12px] text-zinc-300 leading-snug">Évite d'entrer en position</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-3 h-3 rounded-full bg-red-400 mt-1" />
            <div>
              <p className="text-[13px] font-bold text-white">PENDANT</p>
              <p className="text-[12px] text-zinc-300 leading-snug">Ne trade pas — observe seulement</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-3 h-3 rounded-full bg-amber-400 mt-1" />
            <div>
              <p className="text-[13px] font-bold text-white">1H APRÈS</p>
              <p className="text-[12px] text-zinc-300 leading-snug">Attends confirmation de direction</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug pt-2 border-t border-zinc-800">
        Le risque dépend de l'heure. Lis la journée comme une météo macro.
      </p>
    </div>
    </div>
  );
};
