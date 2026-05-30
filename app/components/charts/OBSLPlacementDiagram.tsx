export default function OBSLPlacementDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "3 colocaciones de SL — solo una correcta",
        p1Title: "✗ SL en la zona",
        p1SL: "SL 1.1770",
        p1OB: "Order Block 1.1745-1.1780",
        p1Note: "Las mechas disparan el SL",
        p1Sub: "Stop hunt clásico",
        p2Title: "⚠ SL en el límite",
        p2SL: "SL 1.1745",
        p2OB: "Order Block 1.1745-1.1780",
        p2Note: "Tolerancia 0 para mechas",
        p2Sub: "Riesgo de stop hunt",
        p3Title: "✓ SL con margen",
        p3SL: "SL 1.1738 (margen 7 pips)",
        p3OB: "Order Block 1.1745-1.1780",
        p3Note: "Absorbe las mechas secundarias",
        p3Sub: "Colocación operativa",
        caption: "Margen de 5-10 pips más allá de la mecha extrema absorbe las mechas de retest",
        mobileTitle: "3 colocaciones de SL — solo una correcta",
        m1Title: "✗ SL pegado al cuerpo del OB",
        m1Body: "Demasiado ajustado, disparado por la mínima mecha de retest.",
        m2Title: "✓ SL con margen 5-10 pips más allá de la mecha",
        m2Body: "Buen margen — absorbe las mechas de retest sin ser demasiado amplio.",
        m3Title: "✗ SL demasiado amplio (50+ pips)",
        m3Body: "Innecesariamente grande → R/R degradado, tamaño de posición muy pequeño.",
        mobileFooter: "Margen 5-10 pips más allá de la mecha extrema.",
      }
    : {
        title: "3 placements de SL — un seul correct",
        p1Title: "✗ SL dans la zone",
        p1SL: "SL 1.1770",
        p1OB: "Order Block 1.1745-1.1780",
        p1Note: "Wicks déclenchent le SL",
        p1Sub: "Stop hunt classique",
        p2Title: "⚠ SL à la limite",
        p2SL: "SL 1.1745",
        p2OB: "Order Block 1.1745-1.1780",
        p2Note: "Tolérance 0 pour wicks",
        p2Sub: "Risque de stop hunt",
        p3Title: "✓ SL avec marge",
        p3SL: "SL 1.1738 (marge 7 pips)",
        p3OB: "Order Block 1.1745-1.1780",
        p3Note: "Absorbe les wicks secondaires",
        p3Sub: "Placement opérationnel",
        caption: "Marge de 5-10 pips au-delà de la mèche extrême absorbe les wicks de retest",
        mobileTitle: "3 placements de SL — un seul correct",
        m1Title: "✗ SL collé au corps de l'OB",
        m1Body: "Trop serré, déclenché par le moindre wick de retest.",
        m2Title: "✓ SL marge 5-10 pips au-delà de la mèche",
        m2Body: "Bonne marge — absorbe les wicks de retest sans être trop large.",
        m3Title: "✗ SL trop large (50+ pips)",
        m3Body: "Inutilement grand → R/R dégradé, taille de position trop petite.",
        mobileFooter: "Marge 5-10 pips au-delà de la mèche extrême.",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className="hidden sm:block w-full h-auto"
    >
      {/* Titre avec halo */}
      <rect x="290" y="5" width="320" height="18" rx="3" fill="#09090b" />
      <text x="450" y="18" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      <line x1="300" y1="40" x2="300" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — SL DANS LA ZONE (KO) ═══ */}
      <rect x="20" y="50" width="270" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="155" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{t.p1Title}</text>

      {/* Order Block emerald translucide */}
      <rect x="30" y="200" width="230" height="40" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />

      {/* Niveau SL DANS l'OB */}
      <line x1="20" y1="220" x2="290" y2="220" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Label SL avec halo */}
      <rect x="18" y="214" width="64" height="14" rx="3" fill="#09090b" />
      <text x="22" y="225" fill="#ef4444" fontSize="9" fontWeight="600">{t.p1SL}</text>

      {/* Label OB avec halo */}
      <rect x="75" y="186" width="140" height="14" rx="3" fill="#09090b" />
      <text x="145" y="197" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.p1OB}</text>

      {/* Path prix : descente → retraverse OB → mèche basse TRAVERSE le SL → rebond */}
      <path
        d="M40,120 L80,180 L120,210 L150,230 L180,200 L220,170"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie au point critique avec mèche qui traverse le SL */}
      <line x1="150" y1="195" x2="150" y2="245" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="143" y="205" width="14" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Pastille en bas avec halo */}
      <rect x="50" y="320" width="210" height="20" rx="4" fill="#09090b" />
      <rect x="50" y="320" width="210" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="155" y="334" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{t.p1Note}</text>
      <text x="155" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">{t.p1Sub}</text>

      {/* ═══ PANEL 2 — SL À LA LIMITE (Borderline) ═══ */}
      <rect x="320" y="50" width="270" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="455" y="65" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">{t.p2Title}</text>

      <rect x="335" y="200" width="230" height="40" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />

      {/* SL sur la limite basse exacte de l'OB */}
      <line x1="320" y1="240" x2="590" y2="240" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Label SL avec halo amber */}
      <rect x="323" y="234" width="64" height="14" rx="3" fill="#09090b" />
      <text x="327" y="245" fill="#f59e0b" fontSize="9" fontWeight="600">{t.p2SL}</text>

      {/* Label OB avec halo */}
      <rect x="380" y="186" width="140" height="14" rx="3" fill="#09090b" />
      <text x="450" y="197" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.p2OB}</text>

      {/* Path prix : descente → touche limite basse → SL frôlé → rebond */}
      <path
        d="M345,120 L385,180 L425,210 L455,238 L485,220 L525,180"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie au contact de la limite basse */}
      <line x1="455" y1="218" x2="455" y2="245" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="448" y="225" width="14" height="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <rect x="350" y="320" width="210" height="20" rx="4" fill="#09090b" />
      <rect x="350" y="320" width="210" height="20" rx="4" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="455" y="334" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">{t.p2Note}</text>
      <text x="455" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">{t.p2Sub}</text>

      {/* ═══ PANEL 3 — SL AVEC MARGE (OK) ═══ */}
      <rect x="625" y="50" width="270" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="760" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{t.p3Title}</text>

      <rect x="640" y="200" width="230" height="40" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />

      {/* SL au-dessous de l'OB avec marge */}
      <line x1="625" y1="260" x2="895" y2="260" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Label SL avec halo emerald */}
      <rect x="628" y="254" width="150" height="14" rx="3" fill="#09090b" />
      <text x="632" y="265" fill="#10b981" fontSize="9" fontWeight="600">{t.p3SL}</text>

      {/* Label OB avec halo */}
      <rect x="685" y="186" width="140" height="14" rx="3" fill="#09090b" />
      <text x="755" y="197" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.p3OB}</text>

      {/* Path prix : descente → rebondit sur limite basse SANS atteindre SL */}
      <path
        d="M650,120 L690,180 L730,210 L760,235 L790,215 L830,170"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie qui touche la limite basse mais reste au-dessus du SL */}
      <line x1="760" y1="215" x2="760" y2="245" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="753" y="222" width="14" height="18" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <rect x="655" y="320" width="210" height="20" rx="4" fill="#09090b" />
      <rect x="655" y="320" width="210" height="20" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="760" y="334" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.p3Note}</text>
      <text x="760" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">{t.p3Sub}</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.caption}
      </text>
    </svg>

    {/* MOBILE : 3 placements SL OB ──────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>

      {/* Mini-SVG : placement SL — zone OB + entry au milieu + SL sous le low de la zone */}
      <svg viewBox="0 0 280 130" className="w-full h-auto" aria-label="Placement SL sur OB" fill="none">
        {/* Zone OB */}
        <rect x="40" y="55" width="200" height="24" fill="#10b98115" stroke="#10b98155" strokeWidth="1" strokeDasharray="3 2" />
        <text x="140" y="48" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">Zone OB</text>
        {/* Bougie d'origine (à gauche, qui définit le low du SL) */}
        <line x1="55" y1="48" x2="55" y2="92" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
        <rect x="50" y="58" width="10" height="22" fill="#ef4444" stroke="#dc2626" strokeWidth="0.7" rx="1" />
        {/* Entry point au milieu de la zone */}
        <circle cx="140" cy="67" r="4" fill="#10b981" />
        <rect x="118" y="72" width="36" height="11" rx="2" fill="#09090b" />
        <text x="136" y="80" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">Entry</text>
        {/* SL ligne — sous le low de la bougie d'origine (donc sous le 92) */}
        <line x1="10" y1="105" x2="270" y2="105" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="3 2" />
        <rect x="120" y="109" width="40" height="12" rx="2" fill="#ef444418" stroke="#ef4444" strokeWidth="0.7" />
        <text x="140" y="118" fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="700">SL</text>
        {/* Annotation buffer */}
        <text x="36" y="100" fontSize="8" fill="#f87171" textAnchor="end">low + buffer</text>
        <line x1="40" y1="98" x2="55" y2="92" stroke="#f87171" strokeWidth="0.8" />
      </svg>

      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{t.m1Title}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.m1Body}</p>
      </div>
      <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{t.m2Title}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.m2Body}</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{t.m3Title}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.m3Body}</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        {t.mobileFooter}
      </p>
    </div>
    </div>
  );
}
