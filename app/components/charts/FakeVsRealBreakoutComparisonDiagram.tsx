export default function FakeVsRealBreakoutComparisonDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const isEs = locale === "es";
  const L = {
    title:       isEs ? "Verdadero breakout vs Falso breakout" : "Vrai breakout vs Faux breakout",
    real:        isEs ? "✓ Verdadero breakout" : "✓ Vrai breakout",
    fake:        isEs ? "✗ Falso breakout" : "✗ Faux breakout",
    resistance:  isEs ? "Resistencia 4 650$" : "{L.resistance}",
    realClose:   isEs ? "Cierre 4 680$ + follow-through" : "Clôture 4 680$ + follow-through",
    wickLabel:   isEs ? "mecha 4 685$" : "mèche 4 685$",
    closeLabel:  isEs ? "cierre 4 620$" : "clôture 4 620$",
    fakeBottom:  isEs ? "Mecha + cierre debajo + reversal" : "Mèche + clôture sous + reversal",
    footer:      isEs ? "Criterio de distinción: cierre por encima del nivel + follow-through en 3-5 velas" : "Critère de distinction : clôture au-dessus du niveau + follow-through sur 3-5 bougies",
    realDesc:    isEs ? "Ruptura franca + cierre POR ENCIMA del nivel + 3-5 velas de continuación (follow-through)." : "Cassure franche + clôture AU-DESSUS du niveau + 3-5 bougies de continuation (follow-through).",
    fakeDescA:   isEs ? "La mecha rebasa pero" : "Mèche dépasse mais",
    fakeDescBold:isEs ? "cierre debajo" : "clôture sous",
    fakeDescB:   isEs ? "del nivel + reversal inmediato = trampa." : "le niveau + reversal immédiat = piège.",
    mobCriterion:isEs ? "Criterio: cierre + follow-through 3-5 velas." : "Critère : clôture + follow-through 3-5 bougies.",
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

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — VRAI breakout ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.real}</text>

      <line x1="50" y1="150" x2="380" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Bougies bullish d'approche */}
      <line x1="100" y1="220" x2="100" y2="280" stroke="#059669" strokeWidth="1.5" />
      <rect x="93" y="225" width="14" height="50" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="140" y1="190" x2="140" y2="240" stroke="#059669" strokeWidth="1.5" />
      <rect x="133" y="195" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Grosse bougie de cassure verte qui clôture au-dessus */}
      <line x1="180" y1="100" x2="180" y2="180" stroke="#059669" strokeWidth="2" />
      <rect x="172" y="110" width="16" height="60" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1.5" />

      {/* Continuation bullish */}
      <line x1="220" y1="80" x2="220" y2="130" stroke="#059669" strokeWidth="1.5" />
      <rect x="213" y="85" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="260" y1="60" x2="260" y2="110" stroke="#059669" strokeWidth="1.5" />
      <rect x="253" y="65" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="300" y1="50" x2="300" y2="90" stroke="#059669" strokeWidth="1.5" />
      <rect x="293" y="55" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Halo + label "{L.resistance}" déplacés après les bougies pour rester au-dessus */}
      <rect x="53" y="133" width="127" height="14" fill="#09090b" rx="3" />
      <text x="57" y="144" fill="#ef4444" fontSize="9" fontWeight="600">{L.resistance}</text>

      <rect x="80" y="310" width="240" height="20" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="200" y="324" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{L.realClose}</text>

      {/* ═══ PANEL DROIT — FAUX breakout ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{L.fake}</text>

      <line x1="450" y1="150" x2="780" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Bougies bullish d'approche */}
      <line x1="500" y1="220" x2="500" y2="280" stroke="#059669" strokeWidth="1.5" />
      <rect x="493" y="225" width="14" height="50" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="540" y1="190" x2="540" y2="240" stroke="#059669" strokeWidth="1.5" />
      <rect x="533" y="195" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Bougie fake : mèche dépasse, corps clôture sous */}
      <line x1="580" y1="110" x2="580" y2="200" stroke="#b91c1c" strokeWidth="2" />
      <rect x="572" y="170" width="16" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />

      {/* Labels avec halos */}
      <rect x="583" y="97" width="92" height="14" fill="#09090b" rx="3" />
      <text x="587" y="108" fill="#ef4444" fontSize="8" fontWeight="600">{L.wickLabel}</text>
      <rect x="593" y="184" width="106" height="14" fill="#09090b" rx="3" />
      <text x="597" y="195" fill="#ef4444" fontSize="8" fontWeight="600">{L.closeLabel}</text>

      {/* Continuation baissière */}
      <line x1="620" y1="210" x2="620" y2="270" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="613" y="215" width="14" height="50" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="660" y1="240" x2="660" y2="310" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="653" y="245" width="14" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="700" y1="280" x2="700" y2="350" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="693" y="285" width="14" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Halo + label "{L.resistance}" panel droit, déplacés après les bougies */}
      <rect x="453" y="133" width="127" height="14" fill="#09090b" rx="3" />
      <text x="457" y="144" fill="#ef4444" fontSize="9" fontWeight="600">{L.resistance}</text>

      <rect x="480" y="310" width="240" height="20" rx="4" fill="#27272a" stroke="#ef4444" strokeWidth="0.8" />
      <text x="600" y="324" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.fakeBottom}</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : vrai vs faux breakout ─────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.title}</p>
      {/* Mini-SVG : 2 panels — vrai breakout (cassure + cont. emerald) vs faux breakout (mèche + reversal rouge) */}
      <svg viewBox="0 0 280 130" className="w-full h-auto" aria-label="Vrai vs faux breakout" fill="none">
        {/* Séparateur central */}
        <line x1="138" y1="10" x2="138" y2="120" stroke="#3f3f46" strokeWidth="0.8" />
        {/* ─── Panel gauche : VRAI breakout ─── */}
        <rect x="12" y="6" width="60" height="13" rx="2" fill="#10b98118" stroke="#10b981" strokeWidth="0.6" />
        <text x="42" y="15" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">Vrai ✓</text>
        {/* Niveau résistance */}
        <line x1="14" y1="55" x2="128" y2="55" stroke="#ef4444" strokeWidth="0.9" strokeDasharray="3 2" />
        {/* Bougies d'approche bullish */}
        <line x1="22" y1="80" x2="22" y2="105" stroke="#059669" strokeWidth="0.8" />
        <rect x="19" y="82" width="6" height="20" fill="#10b981" rx="0.5" />
        <line x1="38" y1="68" x2="38" y2="95" stroke="#059669" strokeWidth="0.8" />
        <rect x="35" y="70" width="6" height="22" fill="#10b981" rx="0.5" />
        {/* GROSSE bougie de cassure — clôture au-dessus */}
        <line x1="56" y1="32" x2="56" y2="72" stroke="#059669" strokeWidth="1.2" />
        <rect x="52" y="35" width="8" height="30" fill="#10b981" stroke="#059669" strokeWidth="0.6" rx="1" />
        {/* Continuation bullish — follow-through */}
        <line x1="74" y1="22" x2="74" y2="42" stroke="#059669" strokeWidth="0.8" />
        <rect x="71" y="24" width="6" height="16" fill="#10b981" rx="0.5" />
        <line x1="90" y1="14" x2="90" y2="32" stroke="#059669" strokeWidth="0.8" />
        <rect x="87" y="16" width="6" height="14" fill="#10b981" rx="0.5" />
        <line x1="106" y1="10" x2="106" y2="26" stroke="#059669" strokeWidth="0.8" />
        <rect x="103" y="12" width="6" height="12" fill="#10b981" rx="0.5" />
        <text x="71" y="125" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">Clôture + follow-through</text>

        {/* ─── Panel droit : FAUX breakout ─── */}
        <rect x="172" y="6" width="80" height="13" rx="2" fill="#ef444418" stroke="#ef4444" strokeWidth="0.6" />
        <text x="212" y="15" fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="700">Faux ✗</text>
        {/* Niveau résistance */}
        <line x1="148" y1="55" x2="266" y2="55" stroke="#ef4444" strokeWidth="0.9" strokeDasharray="3 2" />
        {/* Bougies d'approche bullish */}
        <line x1="156" y1="80" x2="156" y2="105" stroke="#059669" strokeWidth="0.8" />
        <rect x="153" y="82" width="6" height="20" fill="#10b981" rx="0.5" />
        <line x1="172" y1="68" x2="172" y2="95" stroke="#059669" strokeWidth="0.8" />
        <rect x="169" y="70" width="6" height="22" fill="#10b981" rx="0.5" />
        {/* Bougie fake : mèche dépasse, corps clôture SOUS la résistance */}
        <line x1="190" y1="28" x2="190" y2="78" stroke="#b91c1c" strokeWidth="1.2" />
        <rect x="186" y="60" width="8" height="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.6" rx="1" />
        {/* Reversal bearish */}
        <line x1="208" y1="72" x2="208" y2="100" stroke="#b91c1c" strokeWidth="0.8" />
        <rect x="205" y="75" width="6" height="22" fill="#ef4444" rx="0.5" />
        <line x1="224" y1="90" x2="224" y2="112" stroke="#b91c1c" strokeWidth="0.8" />
        <rect x="221" y="92" width="6" height="18" fill="#ef4444" rx="0.5" />
        <line x1="240" y1="100" x2="240" y2="118" stroke="#b91c1c" strokeWidth="0.8" />
        <rect x="237" y="103" width="6" height="13" fill="#ef4444" rx="0.5" />
        <text x="207" y="125" fontSize="8" fill="#ef4444" textAnchor="middle" fontWeight="700">Mèche + rejet sous</text>
      </svg>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.real}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.realDesc}</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{L.fake}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.fakeDescA} <span className="font-bold">{L.fakeDescBold}</span> {L.fakeDescB}</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        {L.mobCriterion}
      </p>
    </div>
    </div>
  );
}
