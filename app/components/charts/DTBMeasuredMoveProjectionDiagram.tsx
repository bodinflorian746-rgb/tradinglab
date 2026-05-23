export default function DTBMeasuredMoveProjectionDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Calcular el TP por proyección measured move",
        resistanceLabel: "Resistencia — 1.1880",
        necklineLabel: "Neckline — 1.1800",
        tpLabel: "TP measured move — 1.1720",
        top1: "Cumbre 1",
        top2: "Cumbre 2",
        heightLabel: "Altura 80 pips",
        projLabel: "Proyección 80 pips",
        tpBadge: "TP",
        necklineBadge: "Neckline",
        footer: "Altura del patrón proyectada desde la neckline = nivel TP objetivo",
        mobileTitle: "Calcular el TP por measured move",
        step1a: "Medir la ",
        step1b: "altura del patrón",
        step1c: " (de la cumbre a la neckline).",
        step2a: "Proyectar esa misma distancia ",
        step2b: "desde la ruptura de neckline",
        step2c: ".",
        step3a: "El nivel obtenido = ",
        step3b: "TP objetivo",
        step3c: ".",
      }
    : {
        title: "Calculer le TP par projection measured move",
        resistanceLabel: "Résistance — 1.1880",
        necklineLabel: "Neckline — 1.1800",
        tpLabel: "TP measured move — 1.1720",
        top1: "Sommet 1",
        top2: "Sommet 2",
        heightLabel: "Hauteur 80 pips",
        projLabel: "Projection 80 pips",
        tpBadge: "TP",
        necklineBadge: "Neckline",
        footer: "Hauteur du pattern projetée depuis la neckline = niveau TP cible",
        mobileTitle: "Calculer le TP par measured move",
        step1a: "Mesurer la ",
        step1b: "hauteur du pattern",
        step1c: " (du sommet à la neckline).",
        step2a: "Projeter cette même distance ",
        step2b: "depuis la cassure de neckline",
        step2c: ".",
        step3a: "Le niveau obtenu = ",
        step3b: "TP cible",
        step3c: ".",
      };

  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      {/* Niveau résistance (sommets) */}
      <line x1="50" y1="100" x2="750" y2="100" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <rect x="52" y="85" width="120" height="12" rx="2" fill="#09090b" />
      <text x="55" y="94" fill="#ef4444" fontSize="9" fontWeight="600">{t.resistanceLabel}</text>

      {/* Neckline */}
      <line x1="50" y1="180" x2="750" y2="180" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="5 3" />
      <rect x="52" y="186" width="118" height="12" rx="2" fill="#09090b" />
      <text x="55" y="195" fill="#a1a1aa" fontSize="9" fontWeight="600">{t.necklineLabel}</text>

      {/* TP measured move */}
      <line x1="50" y1="260" x2="750" y2="260" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="52" y="266" width="160" height="12" rx="2" fill="#09090b" />
      <text x="55" y="275" fill="#ef4444" fontSize="9" fontWeight="600">{t.tpLabel}</text>

      {/* Path Double Top + cassure */}
      <path d="M80,260 L140,180 L200,100 L260,180 L320,100 L380,200 L440,260" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Sommets */}
      <circle cx="200" cy="100" r="4" fill="#ef4444" />
      <rect x="170" y="78" width="60" height="14" rx="3" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="200" y="88" fill="#d4d4d8" fontSize="9" textAnchor="middle">{t.top1}</text>

      <circle cx="320" cy="100" r="4" fill="#ef4444" />
      <rect x="290" y="78" width="60" height="14" rx="3" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="320" y="88" fill="#d4d4d8" fontSize="9" textAnchor="middle">{t.top2}</text>

      {/* Bougie de cassure */}
      <line x1="420" y1="180" x2="420" y2="240" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="414" y="195" width="12" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Flèche bidirectionnelle hauteur 80 pips */}
      <line x1="500" y1="100" x2="500" y2="180" stroke="#60a5fa" strokeWidth="1.2" />
      <path d="M495,108 L500,100 L505,108" stroke="#60a5fa" strokeWidth="1.2" fill="none" />
      <path d="M495,172 L500,180 L505,172" stroke="#60a5fa" strokeWidth="1.2" fill="none" />
      <rect x="515" y="130" width="80" height="20" rx="4" fill="#27272a" stroke="#60a5fa" strokeWidth="0.8" />
      <text x="555" y="144" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="middle">{t.heightLabel}</text>

      {/* Flèche projection 80 pips vers TP */}
      <line x1="580" y1="180" x2="580" y2="260" stroke="#10b981" strokeWidth="1.2" />
      <path d="M575,188 L580,180 L585,188" stroke="#10b981" strokeWidth="1.2" fill="none" />
      <path d="M575,252 L580,260 L585,252" stroke="#10b981" strokeWidth="1.2" fill="none" />
      <rect x="595" y="210" width="100" height="20" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="645" y="224" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.projLabel}</text>

      {/* TP pastille */}
      <rect x="660" y="248" width="40" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="680" y="262" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{t.tpBadge}</text>

      {/* Pastille Neckline */}
      <rect x="600" y="170" width="80" height="18" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="640" y="183" fill="#a1a1aa" fontSize="9" textAnchor="middle">{t.necklineBadge}</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* MOBILE : projection measured move ──────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
      <ul className="space-y-2 text-[13px]">
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[11px] font-bold text-blue-400 mt-0.5">1</span>
          <span className="text-zinc-300">{t.step1a}<span className="font-bold">{t.step1b}</span>{t.step1c}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[11px] font-bold text-blue-400 mt-0.5">2</span>
          <span className="text-zinc-300">{t.step2a}<span className="font-bold">{t.step2b}</span>{t.step2c}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[11px] font-bold text-emerald-400 mt-0.5">3</span>
          <span className="text-zinc-300">{t.step3a}<span className="font-bold text-emerald-400">{t.step3b}</span>{t.step3c}</span>
        </li>
      </ul>
    </div>
    </div>
  );
}
