// Diagramme : le HTF sert à filtrer (Leçon 2 multi-timeframe)
// EUR/USD H4 — le biais baissier garde les shorts, écarte les longs.

interface HTFFilterDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function HTFFilterDiagram({ className = "", locale = "fr" }: HTFFilterDiagramProps) {
  const L = locale === "es"
    ? {
        resistance: "Resistencia HTF  1.1760",
        prixActuel: "Precio actual  1.1715",
        filtre: "FILTRO HTF",
        setupPriv: "Setup a privilegiar",
        sens: "en el sentido del bias",
        setupEviter: "Setup a evitar",
        contre: "contra el bias",
        note: "El HTF solo conserva los trades alineados",
        caption: "Bias Daily bajista — el precio bajo la resistencia HTF",
        mobTitle: "Filtro HTF — EUR/USD H4",
        mobAligne: "✓ Setup alineado con bias HTF",
        mobAligneDesc: "A privilegiar — probabilidad máxima.",
        mobContre: "✗ Setup contra el bias HTF",
        mobContreDesc: "A descartar — aunque sea visualmente tentador.",
        mobFooter: "El HTF filtra el 90% de las señales falsas LTF.",
        legendAligne: "Setup alineado con el bias HTF — a privilegiar",
        legendContre: "Setup contra el bias HTF — a descartar",
      }
    : {
        resistance: "Résistance HTF  1.1760",
        prixActuel: "Prix actuel  1.1715",
        filtre: "FILTRE HTF",
        setupPriv: "Setup à privilégier",
        sens: "dans le sens du biais",
        setupEviter: "Setup à éviter",
        contre: "contre le biais",
        note: "Le HTF ne garde que les trades alignés",
        caption: "Biais Daily baissier — le prix sous la résistance HTF",
        mobTitle: "Filtre HTF — EUR/USD H4",
        mobAligne: "✓ Setup aligné avec biais HTF",
        mobAligneDesc: "À privilégier — probabilité maximale.",
        mobContre: "✗ Setup contre le biais HTF",
        mobContreDesc: "À écarter — même si visuellement tentant.",
        mobFooter: "Le HTF filtre 90% des faux signaux LTF.",
        legendAligne: "Setup aligné avec le biais HTF — à privilégier",
        legendContre: "Setup contre le biais HTF — à écarter",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="20" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H4</text>

        <line x1="40" y1="92" x2="436" y2="92" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
        <rect x="40" y="78" width="124" height="13" rx="3" fill="#09090b" />
        <text x="102" y="88" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.resistance}</text>

        <path d="M44,132 L92,116 L140,176 L196,150 L250,214 L304,188 L358,240 L408,224"
          stroke="#ef4444" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

        <line x1="40" y1="224" x2="436" y2="224" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.7" />
        <circle cx="408" cy="224" r="5" fill="#60a5fa" />
        <rect x="312" y="231" width="88" height="13" rx="3" fill="#09090b" />
        <text x="356" y="241" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="middle">{L.prixActuel}</text>

        {/* Encart filtre */}
        <rect x="476" y="54" width="204" height="212" rx="10" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
        <text x="578" y="79" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="2">{L.filtre}</text>
        <line x1="496" y1="89" x2="660" y2="89" stroke="#3f3f46" strokeWidth="1" />

        <rect x="496" y="102" width="164" height="62" rx="6" fill="#10b98115" stroke="#10b981" strokeWidth="1" />
        <text x="510" y="123" fill="#10b981" fontSize="12" fontWeight="700">✓</text>
        <text x="526" y="123" fill="#a1a1aa" fontSize="9">{L.setupPriv}</text>
        <text x="578" y="145" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">SHORTS</text>
        <text x="578" y="158" fill="#71717a" fontSize="8" textAnchor="middle">{L.sens}</text>

        <rect x="496" y="176" width="164" height="62" rx="6" fill="#ef444415" stroke="#ef4444" strokeWidth="1" />
        <text x="510" y="197" fill="#ef4444" fontSize="12" fontWeight="700">✗</text>
        <text x="526" y="197" fill="#a1a1aa" fontSize="9">{L.setupEviter}</text>
        <text x="578" y="219" fill="#ef4444" fontSize="12" fontWeight="700" textAnchor="middle">LONGS AGRESSIFS</text>
        <text x="578" y="232" fill="#71717a" fontSize="8" textAnchor="middle">{L.contre}</text>

        <text x="578" y="256" fill="#71717a" fontSize="8" textAnchor="middle">{L.note}</text>

        <text x="250" y="292" fill="#a1a1aa" fontSize="10" textAnchor="middle">
          {L.caption}
        </text>
      </svg>

      {/* MOBILE : filtre HTF ────────────────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{L.mobAligne}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobAligneDesc}</p>
        </div>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">{L.mobContre}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobContreDesc}</p>
        </div>
        <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
          {L.mobFooter}
        </p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Setup aligné avec le biais HTF — à privilégier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Setup contre le biais HTF — à écarter</span>
        </div>
      </div>
    </div>
  );
}
