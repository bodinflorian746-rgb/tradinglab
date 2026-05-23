export default function PinBarLocationDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "El nivel, no la vela",
        resistance: "Resistencia fuerte — 4 650$",
        support: "Soporte fuerte — 4 500$",
        rangeMid: "Rango / medio",
        tradable: "✓ Operable",
        outOfLevel: "✗ Fuera de nivel",
        footer: "Pin bar = señal de confirmación en un nivel. Sin nivel, es ruido.",
        mobileTitle: "El nivel, no la vela",
        mobileBullTitle: "✓ Pin bar EN EL SOPORTE",
        mobileBullDesc: "Bullish en el mínimo del rango (4 500 $) → operable",
        mobileBearTitle: "✓ Pin bar EN LA RESISTENCIA",
        mobileBearDesc: "Bearish en el máximo del rango (4 650 $) → operable",
        mobileInvalidTitle: "✗ Pin bar FUERA DE NIVEL",
        mobileInvalidDesc: "En medio del rango, sin nivel estructural → ignorar",
        mobileFooter: "Pin bar = confirmación en un nivel. Sin nivel, es ruido.",
      }
    : {
        title: "Le niveau, pas la bougie",
        resistance: "Résistance forte — 4 650$",
        support: "Support fort — 4 500$",
        rangeMid: "Range / middle",
        tradable: "✓ Tradable",
        outOfLevel: "✗ Hors niveau",
        footer: "Pin bar = signal de confirmation à un niveau. Sans niveau, c'est du bruit.",
        mobileTitle: "Le niveau, pas la bougie",
        mobileBullTitle: "✓ Pin bar AU SUPPORT",
        mobileBullDesc: "Bullish au plus bas du range (4 500 $) → tradable",
        mobileBearTitle: "✓ Pin bar À LA RÉSISTANCE",
        mobileBearDesc: "Bearish au plus haut du range (4 650 $) → tradable",
        mobileInvalidTitle: "✗ Pin bar HORS NIVEAU",
        mobileInvalidDesc: "Au milieu du range, sans niveau structurel → ignorer",
        mobileFooter: "Pin bar = confirmation à un niveau. Sans niveau, c'est du bruit.",
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

      {/* Résistance forte */}
      <line x1="50" y1="100" x2="780" y2="100" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="52" y="86" width="156" height="12" rx="2" fill="#09090b" />
      <text x="55" y="95" fill="#ef4444" fontSize="9" fontWeight="600">{t.resistance}</text>

      {/* Support fort */}
      <line x1="50" y1="300" x2="780" y2="300" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="52" y="311" width="140" height="12" rx="2" fill="#09090b" />
      <text x="55" y="320" fill="#10b981" fontSize="9" fontWeight="600">{t.support}</text>

      {/* Zone middle */}
      <rect x="50" y="180" width="730" height="40" fill="#71717a10" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <text x="65" y="205" fill="#71717a" fontSize="8" fontStyle="italic">{t.rangeMid}</text>

      {/* Path prix oscillant entre les niveaux */}
      <path d="M70,290 L130,100 L200,200 L270,300 L340,200 L410,100 L480,200 L550,300 L620,200 L690,290" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.5" />

      {/* Pin bar 1 — au support */}
      <line x1="130" y1="290" x2="130" y2="345" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="122" y="290" width="16" height="12" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />
      <circle cx="130" cy="298" r="8" fill="#10b981" opacity="0.3" />
      <rect x="85" y="350" width="90" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="130" y="365" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.tradable}</text>

      {/* Pin bar 2 — à la résistance */}
      <line x1="410" y1="100" x2="410" y2="55" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
      <rect x="402" y="98" width="16" height="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1" />
      <circle cx="410" cy="98" r="8" fill="#ef4444" opacity="0.3" />
      <rect x="365" y="33" width="90" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="410" y="48" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.tradable}</text>

      {/* Pin bar 3 — au milieu du range */}
      <line x1="620" y1="200" x2="620" y2="240" stroke="#71717a" strokeWidth="2" strokeLinecap="round" />
      <rect x="612" y="200" width="16" height="10" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />
      <circle cx="620" cy="220" r="8" fill="#ef4444" opacity="0.3" />
      <rect x="575" y="245" width="90" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="620" y="260" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{t.outOfLevel}</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* MOBILE : 3 emplacements de pin bar ──────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{t.mobileBullTitle}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.mobileBullDesc}</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{t.mobileBearTitle}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.mobileBearDesc}</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{t.mobileInvalidTitle}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.mobileInvalidDesc}</p>
      </div>
      <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        {t.mobileFooter}
      </p>
    </div>
    </div>
  );
}
