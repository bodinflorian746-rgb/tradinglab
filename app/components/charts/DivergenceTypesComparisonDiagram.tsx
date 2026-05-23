export default function DivergenceTypesComparisonDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const isEs = locale === "es";
  const L = {
    title:           isEs ? "Los 4 tipos de divergencia RSI" : "Les 4 types de divergence RSI",
    classicBear:     isEs ? "Clásica bajista" : "Classique baissière",
    classicBull:     isEs ? "Clásica alcista" : "Classique haussière",
    hiddenBear:      isEs ? "Oculta bajista" : "Cachée baissière",
    hiddenBull:      isEs ? "Oculta alcista" : "Cachée haussière",
    price:           isEs ? "Precio" : "Prix",
    rsi:             "RSI",
    mobRegBear:      isEs ? "Regular BAJISTA" : "Régulière BAISSIÈRE",
    mobRegBull:      isEs ? "Regular ALCISTA" : "Régulière HAUSSIÈRE",
    mobHidBear:      isEs ? "Oculta BAJISTA" : "Cachée BAISSIÈRE",
    mobHidBull:      isEs ? "Oculta ALCISTA" : "Cachée HAUSSIÈRE",
    mobRegBearDesc:  isEs ? "Precio: HH · RSI: LH → reversal bajista" : "Prix : HH · RSI : LH → retournement baissier",
    mobRegBullDesc:  isEs ? "Precio: LL · RSI: HL → reversal alcista" : "Prix : LL · RSI : HL → retournement haussier",
    mobHidBearDesc:  isEs ? "Precio: LH · RSI: HH → continuación bajista (en tendencia ↓)" : "Prix : LH · RSI : HH → continuation baissière (dans tendance ↓)",
    mobHidBullDesc:  isEs ? "Precio: HL · RSI: LL → continuación alcista (en tendencia ↑)" : "Prix : HL · RSI : LL → continuation haussière (dans tendance ↑)",
  };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {L.title}
      </text>

      <line x1="400" y1="40" x2="400" y2="480" stroke="#3f3f46" strokeWidth="1" />
      <line x1="20" y1="260" x2="780" y2="260" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ HAUT GAUCHE — Classique baissière : prix HH + RSI LH ═══ */}
      <rect x="80" y="50" width="240" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{L.classicBear}</text>

      <text x="35" y="95" fill="#a1a1aa" fontSize="9">{L.price}</text>
      <path d="M40,150 L100,120 L160,140 L240,90 L320,140" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="100" cy="120" r="3.5" fill="#10b981" />
      <circle cx="240" cy="90" r="3.5" fill="#10b981" />
      <line x1="100" y1="120" x2="240" y2="90" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" />

      <text x="35" y="195" fill="#a1a1aa" fontSize="9">{L.rsi}</text>
      <line x1="40" y1="205" x2="380" y2="205" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="40" y1="240" x2="380" y2="240" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <rect x="40" y="195" width="14" height="10" rx="2" fill="#09090b" />
      <text x="42" y="203" fill="#71717a" fontSize="7">70</text>
      <rect x="40" y="240" width="14" height="10" rx="2" fill="#09090b" />
      <text x="42" y="248" fill="#71717a" fontSize="7">30</text>
      <path d="M40,225 L100,205 L160,220 L240,215 L320,235" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="100" cy="205" r="3.5" fill="#ef4444" />
      <circle cx="240" cy="215" r="3.5" fill="#ef4444" />
      <line x1="100" y1="205" x2="240" y2="215" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* ═══ HAUT DROIT — Classique haussière : prix LL + RSI HL ═══ */}
      <rect x="480" y="50" width="240" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="600" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.classicBull}</text>

      <text x="435" y="95" fill="#a1a1aa" fontSize="9">{L.price}</text>
      <path d="M440,110 L500,140 L560,120 L640,160 L720,130" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="500" cy="140" r="3.5" fill="#ef4444" />
      <circle cx="640" cy="160" r="3.5" fill="#ef4444" />
      <line x1="500" y1="140" x2="640" y2="160" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" />

      <text x="435" y="195" fill="#a1a1aa" fontSize="9">{L.rsi}</text>
      <line x1="440" y1="205" x2="780" y2="205" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="440" y1="240" x2="780" y2="240" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <rect x="440" y="195" width="14" height="10" rx="2" fill="#09090b" />
      <text x="442" y="203" fill="#71717a" fontSize="7">70</text>
      <rect x="440" y="240" width="14" height="10" rx="2" fill="#09090b" />
      <text x="442" y="248" fill="#71717a" fontSize="7">30</text>
      <path d="M440,225 L500,245 L560,225 L640,235 L720,210" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="500" cy="245" r="3.5" fill="#10b981" />
      <circle cx="640" cy="235" r="3.5" fill="#10b981" />
      <line x1="500" y1="245" x2="640" y2="235" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* ═══ BAS GAUCHE — Cachée baissière : prix LH + RSI HH ═══ */}
      <rect x="80" y="275" width="240" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="290" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{L.hiddenBear}</text>

      <text x="35" y="320" fill="#a1a1aa" fontSize="9">{L.price}</text>
      <path d="M40,360 L100,330 L160,350 L240,345 L320,380" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="100" cy="330" r="3.5" fill="#10b981" />
      <circle cx="240" cy="345" r="3.5" fill="#10b981" />
      <line x1="100" y1="330" x2="240" y2="345" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" />

      <text x="35" y="410" fill="#a1a1aa" fontSize="9">{L.rsi}</text>
      <line x1="40" y1="420" x2="380" y2="420" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="40" y1="455" x2="380" y2="455" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <rect x="40" y="410" width="14" height="10" rx="2" fill="#09090b" />
      <text x="42" y="418" fill="#71717a" fontSize="7">70</text>
      <rect x="40" y="455" width="14" height="10" rx="2" fill="#09090b" />
      <text x="42" y="463" fill="#71717a" fontSize="7">30</text>
      <path d="M40,445 L100,425 L160,440 L240,415 L320,455" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="100" cy="425" r="3.5" fill="#ef4444" />
      <circle cx="240" cy="415" r="3.5" fill="#ef4444" />
      <line x1="100" y1="425" x2="240" y2="415" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* ═══ BAS DROIT — Cachée haussière : prix HL + RSI LL ═══ */}
      <rect x="480" y="275" width="240" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="600" y="290" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.hiddenBull}</text>

      <text x="435" y="320" fill="#a1a1aa" fontSize="9">{L.price}</text>
      <path d="M440,380 L500,350 L560,375 L640,345 L720,310" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="500" cy="350" r="3.5" fill="#ef4444" />
      <circle cx="640" cy="345" r="3.5" fill="#ef4444" />
      <line x1="500" y1="350" x2="640" y2="345" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" />

      <text x="435" y="410" fill="#a1a1aa" fontSize="9">{L.rsi}</text>
      <line x1="440" y1="420" x2="780" y2="420" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="440" y1="455" x2="780" y2="455" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <rect x="440" y="410" width="14" height="10" rx="2" fill="#09090b" />
      <text x="442" y="418" fill="#71717a" fontSize="7">70</text>
      <rect x="440" y="455" width="14" height="10" rx="2" fill="#09090b" />
      <text x="442" y="463" fill="#71717a" fontSize="7">30</text>
      <path d="M440,440 L500,440 L560,430 L640,455 L720,425" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="500" cy="440" r="3.5" fill="#10b981" />
      <circle cx="640" cy="455" r="3.5" fill="#10b981" />
      <line x1="500" y1="440" x2="640" y2="455" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" />
    </svg>

    {/* MOBILE : 4 types divergence RSI ──────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.title}</p>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{L.mobRegBear}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobRegBearDesc}</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.mobRegBull}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobRegBullDesc}</p>
      </div>
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
        <p className="text-[13px] font-bold text-amber-400">{L.mobHidBear}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobHidBearDesc}</p>
      </div>
      <div className="rounded-lg border border-blue-400/40 bg-blue-500/8 p-3">
        <p className="text-[13px] font-bold text-blue-400">{L.mobHidBull}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobHidBullDesc}</p>
      </div>
    </div>
    </div>
  );
}
