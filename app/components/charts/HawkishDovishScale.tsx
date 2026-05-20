export const HawkishDovishScale = () => {
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1 — Fond */}
      <rect width="800" height="400" fill="#18181b" rx="8" />
      <rect width="800" height="400" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre pédagogique */}
      <text x="400" y="45" fill="#a1a1aa" fontSize="14" fontStyle="italic" textAnchor="middle">
        Le ton d&apos;une banque centrale se lit sur un spectre — pas en binaire.
      </text>

      {/* Layer 3 — Échelle horizontale (5 segments × 128px = 640px) */}
      <rect x={80}  y={195} width={128} height={10} rx="5" fill="#60a5fa" />
      <rect x={208} y={195} width={128} height={10} fill="#60a5fa" fillOpacity="0.7" />
      <rect x={336} y={195} width={128} height={10} fill="#71717a" />
      <rect x={464} y={195} width={128} height={10} fill="#fbbf24" fillOpacity="0.7" />
      <rect x={592} y={195} width={128} height={10} rx="5" fill="#fbbf24" />

      {/* Layer 4 — Graduations verticales */}
      <line x1={80}  y1={210} x2={80}  y2={220} stroke="#3f3f46" strokeWidth="1" />
      <line x1={240} y1={210} x2={240} y2={220} stroke="#3f3f46" strokeWidth="1" />
      <line x1={400} y1={210} x2={400} y2={220} stroke="#3f3f46" strokeWidth="1" />
      <line x1={560} y1={210} x2={560} y2={220} stroke="#3f3f46" strokeWidth="1" />
      <line x1={720} y1={210} x2={720} y2={220} stroke="#3f3f46" strokeWidth="1" />

      {/* Layer 5 — Labels des graduations */}
      <text x={80}  y={240} fill="#a1a1aa" fontSize="11" textAnchor="middle">Très Dovish</text>
      <text x={240} y={240} fill="#a1a1aa" fontSize="12" textAnchor="middle">Dovish</text>
      <text x={400} y={240} fill="#a1a1aa" fontSize="12" textAnchor="middle">Neutre</text>
      <text x={560} y={240} fill="#a1a1aa" fontSize="12" textAnchor="middle">Hawkish</text>
      <text x={720} y={240} fill="#a1a1aa" fontSize="11" textAnchor="middle">Très Hawkish</text>

      {/* Layer 6 — Marqueurs banques centrales */}

      {/* BoJ — Très Dovish (x=95) */}
      <circle cx={95} cy={200} r={10} fill="#a1a1aa" stroke="#18181b" strokeWidth="2" />
      <line x1={95} y1={190} x2={95} y2={182} stroke="#a1a1aa" strokeWidth="1.5" />
      <rect x={77} y={160} width={36} height={22} rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x={95} y={176} fill="#a1a1aa" fontSize="14" fontWeight="700" textAnchor="middle">BoJ</text>

      {/* BCE — Dovish (x=240) */}
      <circle cx={240} cy={200} r={10} fill="#60a5fa" stroke="#18181b" strokeWidth="2" />
      <line x1={240} y1={190} x2={240} y2={182} stroke="#60a5fa" strokeWidth="1.5" />
      <rect x={222} y={160} width={36} height={22} rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x={240} y={176} fill="#60a5fa" fontSize="14" fontWeight="700" textAnchor="middle">BCE</text>

      {/* Fed — Hawkish (x=560) */}
      <circle cx={560} cy={200} r={10} fill="#fbbf24" stroke="#18181b" strokeWidth="2" />
      <line x1={560} y1={190} x2={560} y2={182} stroke="#fbbf24" strokeWidth="1.5" />
      <rect x={540} y={160} width={40} height={22} rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x={560} y={176} fill="#fbbf24" fontSize="14" fontWeight="700" textAnchor="middle">Fed</text>

      {/* Layer 7 — Zones explicatives */}

      {/* Zone DOVISH */}
      <rect x={80}  y={290} width={300} height={80} rx="4"
        fill="#09090b" fillOpacity="0.4"
        stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="1" />
      <text x={230} y={312} fill="#60a5fa" fontSize="13" fontWeight="700" textAnchor="middle">DOVISH</text>
      <text x={230} y={332} fill="#a1a1aa" fontSize="12" textAnchor="middle">Baisse les taux</text>
      <text x={230} y={348} fill="#a1a1aa" fontSize="12" textAnchor="middle">Soutient l&apos;économie</text>
      <text x={230} y={364} fill="#a1a1aa" fontSize="12" textAnchor="middle">Affaiblit la devise</text>

      {/* Zone HAWKISH */}
      <rect x={420} y={290} width={300} height={80} rx="4"
        fill="#09090b" fillOpacity="0.4"
        stroke="#fbbf24" strokeOpacity="0.3" strokeWidth="1" />
      <text x={570} y={312} fill="#fbbf24" fontSize="13" fontWeight="700" textAnchor="middle">HAWKISH</text>
      <text x={570} y={332} fill="#a1a1aa" fontSize="12" textAnchor="middle">Monte les taux</text>
      <text x={570} y={348} fill="#a1a1aa" fontSize="12" textAnchor="middle">Lutte contre l&apos;inflation</text>
      <text x={570} y={364} fill="#a1a1aa" fontSize="12" textAnchor="middle">Renforce la devise</text>
    </svg>

    {/* ── MOBILE : échelle Dovish/Hawkish empilée ────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[13px] text-zinc-400 italic text-center leading-snug">
        Le ton d'une banque centrale se lit sur un spectre — pas en binaire.
      </p>

      {/* Échelle visuelle horizontale simplifiée */}
      <div className="relative">
        <div className="flex h-3 rounded-full overflow-hidden">
          <div className="flex-1 bg-blue-500" />
          <div className="flex-1 bg-blue-500/70" />
          <div className="flex-1 bg-zinc-500" />
          <div className="flex-1 bg-amber-400/70" />
          <div className="flex-1 bg-amber-400" />
        </div>
        <div className="flex justify-between text-[11px] mt-1.5">
          <span className="text-blue-400 font-bold">← Dovish</span>
          <span className="text-zinc-400 font-semibold">Neutre</span>
          <span className="text-amber-400 font-bold">Hawkish →</span>
        </div>
      </div>

      {/* Positionnement actuel des 3 banques */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-wider text-center">Positionnement actuel</p>
        {[
          { name: "BoJ", pos: "Très Dovish", color: "#a1a1aa", desc: "Maintient les taux bas" },
          { name: "BCE", pos: "Dovish", color: "#60a5fa", desc: "Baisses de taux récentes" },
          { name: "Fed", pos: "Hawkish", color: "#fbbf24", desc: "Taux élevés contre l'inflation" },
        ].map((bank) => (
          <div key={bank.name} className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/40 p-2.5">
            <div className="shrink-0 w-14 h-12 rounded-lg flex items-center justify-center text-[18px] font-bold" style={{ background: `${bank.color}25`, color: bank.color }}>
              {bank.name}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold" style={{ color: bank.color }}>{bank.pos}</p>
              <p className="text-[12px] text-zinc-300 leading-snug">{bank.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2 zones définitions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="rounded-lg border border-blue-400/30 bg-blue-500/5 p-2.5">
          <p className="text-[13px] font-bold text-blue-400">DOVISH</p>
          <ul className="text-[12px] text-zinc-300 mt-1 space-y-0.5 leading-snug">
            <li>↓ Baisse les taux</li>
            <li>Soutient l'économie</li>
            <li>Affaiblit la devise</li>
          </ul>
        </div>
        <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-2.5">
          <p className="text-[13px] font-bold text-amber-400">HAWKISH</p>
          <ul className="text-[12px] text-zinc-300 mt-1 space-y-0.5 leading-snug">
            <li>↑ Monte les taux</li>
            <li>Lutte contre inflation</li>
            <li>Renforce la devise</li>
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
};
