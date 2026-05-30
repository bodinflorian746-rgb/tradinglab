export default function InternalVsExternalStructureZoomDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const isEs = locale === "es";
  const L = {
    title:      isEs ? "Estructura externa Daily ↔ Estructura interna H4" : "Structure externe Daily ↔ Structure interne H4",
    daily:      "DAILY",
    swingHigh:  isEs ? "Swing high 4 720$" : "Swing high 4 720$",
    swingLow:   isEs ? "Swing low 4 460$" : "Swing low 4 460$",
    zoomH4:     isEs ? "Zoom H4" : "Zoom H4",
    footer:     isEs ? "La estructura externa Daily dicta el sesgo. La estructura interna H4 sirve al timing fino." : "Structure externe Daily dicte le biais. Structure interne H4 sert au timing fin.",
    mobTitle:   isEs ? "Estructura externa Daily ↔ interna H4" : "Structure externe Daily ↔ interne H4",
    extTitle:   isEs ? "Estructura externa — Daily" : "Structure externe — Daily",
    extDescA:   isEs ? "Dicta el" : "Dicte le",
    extDescBold:isEs ? "sesgo direccional" : "biais directionnel",
    extDescB:   isEs ? "mayor. Tendencia HH/HL o LH/LL en Daily." : "majeur. Tendance HH/HL ou LH/LL sur Daily.",
    intTitle:   isEs ? "Estructura interna — H4" : "Structure interne — H4",
    intDescA:   isEs ? "Sirve para el" : "Sert au",
    intDescBold:isEs ? "timing fino de entrada" : "timing fin d'entrée",
    intDescB:   isEs ? ". Mini-estructuras dentro de la gran tendencia Daily." : ". Mini-structures dans la grande tendance Daily.",
    mobFooter:  isEs ? "Daily = sesgo · H4 = timing." : "Daily = biais · H4 = timing.",
  };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {L.title}
      </text>

      {/* ═══ PANEL PRINCIPAL — Daily ═══ */}
      <rect x="20" y="45" width="80" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="60" y="59" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">DAILY</text>

      {/* Niveaux swing */}
      <line x1="20" y1="100" x2="500" y2="100" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <rect x="22" y="85" width="110" height="12" rx="2" fill="#09090b" />
      <text x="25" y="94" fill="#10b981" fontSize="9" fontWeight="600">Swing high 4 720$</text>

      <line x1="20" y1="320" x2="500" y2="320" stroke="#71717a" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <rect x="22" y="329" width="108" height="12" rx="2" fill="#09090b" />
      <text x="25" y="338" fill="#71717a" fontSize="9" fontWeight="600">Swing low 4 460$</text>

      {/* Path Daily : impulse haussière */}
      <path d="M40,320 L100,280 L160,240 L220,210 L280,170 L340,140 L400,110 L460,100" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="40" cy="320" r="5" fill="#10b981" />
      <circle cx="460" cy="100" r="5" fill="#10b981" />

      {/* Cadre pointillé sur portion centrale (zone zoomée) */}
      <rect x="200" y="155" width="180" height="100" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 3" />

      {/* Flèche connectrice */}
      <line x1="380" y1="200" x2="520" y2="200" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M512,196 L520,200 L512,204" stroke="#60a5fa" strokeWidth="1" fill="none" />

      {/* ═══ ENCART ZOOM — H4 ═══ */}
      <rect x="520" y="80" width="270" height="240" fill="#0a0a0a" stroke="#3f3f46" strokeWidth="1" rx="4" />
      <rect x="528" y="90" width="60" height="18" rx="4" fill="#27272a" stroke="#60a5fa" strokeWidth="0.8" />
      <text x="558" y="103" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="middle">{L.zoomH4}</text>

      {/* Niveaux H4 */}
      <line x1="540" y1="140" x2="775" y2="140" stroke="#10b981" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
      <rect x="720" y="127" width="58" height="11" rx="2" fill="#09090b" />
      <text x="775" y="135" fill="#10b981" fontSize="8" textAnchor="end">HH 4 640$</text>

      <line x1="540" y1="280" x2="775" y2="280" stroke="#71717a" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
      <rect x="720" y="287" width="58" height="11" rx="2" fill="#09090b" />
      <text x="775" y="295" fill="#71717a" fontSize="8" textAnchor="end">HL 4 540$</text>

      {/* Path H4 : micro-pivots */}
      <path d="M540,280 L580,210 L620,250 L660,180 L700,220 L740,150 L770,140" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

      <circle cx="580" cy="210" r="3" fill="#10b981" />
      <rect x="583" y="218" width="16" height="9" rx="2" fill="#09090b" />
      <text x="585" y="225" fill="#10b981" fontSize="7">HH</text>
      <circle cx="620" cy="250" r="3" fill="#10b981" />
      <rect x="623" y="258" width="46" height="9" rx="2" fill="#09090b" />
      <text x="625" y="265" fill="#10b981" fontSize="7">HL 4 560$</text>
      <circle cx="660" cy="180" r="3" fill="#10b981" />
      <rect x="663" y="165" width="50" height="9" rx="2" fill="#09090b" />
      <text x="665" y="172" fill="#10b981" fontSize="7">HH 4 580$</text>
      <circle cx="740" cy="150" r="4" fill="#10b981" />
      <rect x="743" y="135" width="50" height="9" rx="2" fill="#09090b" />
      <text x="745" y="142" fill="#10b981" fontSize="7">HH 4 640$</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : structure externe vs interne ───────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>

      {/* Mini-SVG : 2 panels — External (macro HH/HL) vs Internal (zoom sur le pullback) */}
      <svg viewBox="0 0 280 110" className="w-full h-auto" aria-label="Structure externe vs interne" fill="none">
        <line x1="138" y1="10" x2="138" y2="100" stroke="#3f3f46" strokeWidth="0.8" />
        <path d="M15,90 L35,75 L50,82 L75,55 L90,62 L115,35" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="75" cy="55" r="2.5" fill="#10b981" />
        <circle cx="115" cy="35" r="3" fill="#10b981" />
        <rect x="35" y="6" width="74" height="12" rx="2" fill="#10b98115" stroke="#10b98155" strokeWidth="0.7" />
        <text x="72" y="14" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">EXTERNAL ↗</text>
        <path d="M158,42 L172,52 L185,46 L200,58 L215,52 L230,64 L245,58 L262,70" stroke="#71717a" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="172" cy="52" r="2" fill="#71717a" />
        <circle cx="200" cy="58" r="2" fill="#71717a" />
        <circle cx="230" cy="64" r="2" fill="#71717a" />
        <rect x="170" y="6" width="60" height="12" rx="2" fill="#71717a18" stroke="#52525b" strokeWidth="0.7" />
        <text x="200" y="14" fontSize="9" fill="#a1a1aa" textAnchor="middle" fontWeight="700">INTERNAL</text>
        <text x="200" y="92" fontSize="8" fill="#71717a" textAnchor="middle" fontStyle="italic">zoom du pullback</text>
      </svg>

      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.extTitle}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.extDescA} <span className="font-bold">{L.extDescBold}</span> {L.extDescB}</p>
      </div>
      <div className="rounded-lg border border-blue-400/40 bg-blue-500/8 p-3">
        <p className="text-[13px] font-bold text-blue-400">{L.intTitle}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.intDescA} <span className="font-bold">{L.intDescBold}</span>{L.intDescB}</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
}
