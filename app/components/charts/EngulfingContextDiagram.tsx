export default function EngulfingContextDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Engulfing — la confluencia lo cambia todo",
        validPanel: "✓ Setup VÁLIDO — Confluencia Fibo + Engulfing",
        invalidPanel: "✗ Setup INVÁLIDO — Fuera de nivel estructural",
        engulfFibo: "Engulfing EN Fibo 0.618",
        engulfImpulse: "Engulfing aislado en impulso",
        fibo: "Fibo 0.618",
        footer: "Un engulfing aislado fuera de contexto estructural sigue siendo una señal hipotética",
        mobileTitle: "La importancia del contexto",
        mobileValidTitle: "✓ Engulfing en Fibo 0.618",
        mobileValidDesc: "La vela envolvente aparece exactamente sobre un nivel Fibonacci → setup fuerte, confluencia visible.",
        mobileInvalidTitle: "✗ Engulfing aislado en pleno impulso",
        mobileInvalidDesc: "Envolvente en medio de una caída, sin nivel estructural → señal hipotética, a ignorar.",
        mobileFooter: "Un engulfing fuera de contexto estructural sigue siendo hipotético.",
      }
    : {
        title: "Engulfing — la confluence change tout",
        validPanel: "✓ Setup VALIDE — Confluence Fibo + Engulfing",
        invalidPanel: "✗ Setup INVALIDE — Hors niveau structurel",
        engulfFibo: "Engulfing AU Fibo 0.618",
        engulfImpulse: "Engulfing isolé en impulsion",
        fibo: "Fibo 0.618",
        footer: "Un engulfing isolé hors contexte structurel reste un signal hypothétique",
        mobileTitle: "L'importance du contexte",
        mobileValidTitle: "✓ Engulfing sur Fibo 0.618",
        mobileValidDesc: "La bougie englobante apparaît exactement sur un niveau Fibonacci → setup fort, confluence visible.",
        mobileInvalidTitle: "✗ Engulfing isolé en pleine impulsion",
        mobileInvalidDesc: "Englobante au milieu d'une chute, sans niveau structurel → signal hypothétique, à ignorer.",
        mobileFooter: "Un engulfing hors contexte structurel reste hypothétique.",
      };

  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="15" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      <line x1="400" y1="30" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — Setup VALIDE avec confluence Fibo ═══ */}
      <rect x="40" y="40" width="320" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="55" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.validPanel}
      </text>

      {/* Niveau Fibo 0.618 emerald épais */}
      <line x1="20" y1="200" x2="380" y2="200" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" />

      {/* Impulsion haussière initiale */}
      <path d="M20,320 L80,180" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />

      {/* Pullback retraçant jusqu'au niveau Fibo */}
      <path d="M80,180 L180,200" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />

      {/* Paire d'engulfing au contact du Fibo */}
      {/* Bougie A — rouge */}
      <line x1="200" y1="170" x2="200" y2="220" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="190" y="180" width="20" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />
      {/* Bougie B — verte qui englobe */}
      <line x1="230" y1="160" x2="230" y2="225" stroke="#059669" strokeWidth="2" />
      <rect x="218" y="170" width="24" height="45" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      {/* Pastille "Engulfing AU Fibo 0.618" */}
      <rect x="160" y="135" width="110" height="16" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="215" y="146" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.engulfFibo}</text>
      <line x1="215" y1="151" x2="215" y2="158" stroke="#10b981" strokeWidth="0.8" />

      {/* Rebond ascendant */}
      <path d="M245,170 L270,120 L310,90 L350,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* ═══ PANEL DROIT — Setup INVALIDE hors niveau ═══ */}
      <rect x="440" y="40" width="320" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.invalidPanel}
      </text>

      {/* Aucun niveau visible — impulsion continue */}
      <path d="M440,320 L540,240 L600,180 L660,120 L780,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Paire d'engulfing identique noyée dans l'impulsion */}
      {/* Bougie A — rouge */}
      <line x1="580" y1="170" x2="580" y2="220" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="570" y="180" width="20" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />
      {/* Bougie B — verte */}
      <line x1="610" y1="160" x2="610" y2="225" stroke="#059669" strokeWidth="2" />
      <rect x="598" y="170" width="24" height="45" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      {/* Pastille "Engulfing isolé en impulsion" */}
      <rect x="540" y="135" width="120" height="16" rx="4" fill="#27272a" stroke="#ef4444" strokeWidth="0.8" />
      <text x="600" y="146" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{t.engulfImpulse}</text>
      <line x1="600" y1="151" x2="600" y2="158" stroke="#ef4444" strokeWidth="0.8" />

      {/* Label "Fibo 0.618" avec halo placé en fin de svg pour rester au-dessus des paths */}
      <rect x="16" y="184" width="78" height="14" fill="#09090b" rx="3" />
      <text x="20" y="195" fill="#10b981" fontSize="10" fontWeight="600">{t.fibo}</text>

      <text x="400" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* MOBILE : engulfing avec vs sans contexte ──────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{t.mobileValidTitle}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">
          {t.mobileValidDesc}
        </p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{t.mobileInvalidTitle}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">
          {t.mobileInvalidDesc}
        </p>
      </div>
      <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        {t.mobileFooter}
      </p>
    </div>
    </div>
  );
}
