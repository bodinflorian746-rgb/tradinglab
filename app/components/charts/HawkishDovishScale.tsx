export const HawkishDovishScale = () => {
  return (
    <svg
      className="w-full h-auto"
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
  );
};
