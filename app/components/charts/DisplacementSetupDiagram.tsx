// Diagramme : displacement crée le FVG, puis retour dans le FVG (Leçon 4 ICT)
// EUR/USD H1 — sweep à 1.1792, displacement bearish vers 1.1748 qui crée un FVG (1.1768-1.1780),
// puis retour du prix dans le FVG (corps dans la bande), puis reprise bearish.

interface DisplacementSetupDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

type CandleSpec = {
  cx: number;
  wickTop: number;
  bodyY: number;
  bodyH: number;
  wickBottom: number;
  type: "bull" | "bear";
};

const CANDLES: CandleSpec[] = [
  // Approche bloquée sous la résistance y=55
  { cx:  60, wickTop:  85, bodyY:  88, bodyH: 18, wickBottom: 115, type: "bull" },
  { cx:  95, wickTop:  72, bodyY:  78, bodyH: 12, wickBottom:  98, type: "bull" },
  { cx: 130, wickTop:  64, bodyY:  68, bodyH: 14, wickBottom:  92, type: "bear" },
  // SWEEP — mèche au-dessus de la résistance
  { cx: 165, wickTop:  36, bodyY:  58, bodyH: 14, wickBottom:  92, type: "bear" },
  // DISPLACEMENT bearish — crée le FVG (bande y=78 à y=110)
  { cx: 200, wickTop:  70, bodyY:  72, bodyH: 60, wickBottom: 138, type: "bear" }, // grosse impulsion
  { cx: 235, wickTop: 130, bodyY: 132, bodyH: 50, wickBottom: 188, type: "bear" },
  { cx: 270, wickTop: 184, bodyY: 188, bodyH: 38, wickBottom: 232, type: "bear" },
  { cx: 305, wickTop: 228, bodyY: 232, bodyH: 22, wickBottom: 258, type: "bear" }, // bas de la chute
  // Retour haussier vers le FVG
  { cx: 340, wickTop: 215, bodyY: 220, bodyH: 35, wickBottom: 260, type: "bull" },
  { cx: 375, wickTop: 175, bodyY: 180, bodyH: 40, wickBottom: 225, type: "bull" },
  { cx: 410, wickTop: 135, bodyY: 138, bodyH: 42, wickBottom: 185, type: "bull" },
  // Entrée dans le FVG — corps dans la bande (78-110)
  { cx: 445, wickTop:  98, bodyY: 100, bodyH: 38, wickBottom: 142, type: "bull" },
  { cx: 480, wickTop:  78, bodyY:  82, bodyH: 22, wickBottom: 108, type: "bull" }, // corps DANS la bande (82-104)
  // REJET — reprise bearish
  { cx: 515, wickTop:  80, bodyY:  84, bodyH: 60, wickBottom: 150, type: "bear" }, // open 84 close 144
  { cx: 550, wickTop: 142, bodyY: 144, bodyH: 50, wickBottom: 200, type: "bear" }, // open 144 close 194
  { cx: 585, wickTop: 192, bodyY: 194, bodyH: 32, wickBottom: 232, type: "bear" }, // open 194 close 226
  { cx: 620, wickTop: 224, bodyY: 226, bodyH: 22, wickBottom: 252, type: "bear" },
];

const BODY_W = 12;

export function DisplacementSetupDiagram({ className = "", locale = "fr" }: DisplacementSetupDiagramProps) {
  const isEs = locale === "es";
  const L = {
    annot:        isEs ? "El displacement crea la zona de ejecución" : "Le déplacement crée la zone d'exécution",
    mobTitle:     isEs ? "Displacement setup · EUR/USD H1" : "Displacement setup · EUR/USD H1",
    mob1A:        isEs ? "Displacement bearish franco crea el" : "Displacement bearish franc crée le",
    mob1B:        isEs ? "en la caída." : "dans la chute.",
    mob2:         isEs ? "Regreso del precio al FVG = mitigation." : "Retour du prix dans le FVG = mitigation.",
    mob3Bold:     isEs ? "Rechazo + reanudación bearish" : "Rejet + reprise bearish",
    mob3End:      isEs ? "= zona de ejecución short." : "= zone d'exécution short.",
    legend1:      isEs ? "El displacement crea el FVG en la caída" : "Displacement crée le FVG dans la chute",
    legend2:      isEs ? "Regreso al FVG y luego reanudación bearish = zona de ejecución" : "Retour dans le FVG puis reprise bearish = zone d'exécution",
  };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Ligne de résistance y=55 */}
        <line x1="40" y1="55" x2="660" y2="55" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />

        {/* Bande FVG — y=78 à y=110 (entre résistance 1.1780 et 1.1768) */}
        <rect x="190" y="78" width="460" height="32" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.75" />

        {/* Bougies */}
        {CANDLES.map(({ cx, wickTop, bodyY, bodyH, wickBottom, type }, i) => {
          const bodyFill = type === "bull" ? "#10b981" : "#ef4444";
          const wickStroke = type === "bull" ? "#059669" : "#b91c1c";
          return (
            <g key={i}>
              <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke={wickStroke} strokeWidth="1.4" strokeLinecap="round" />
              <rect x={cx - BODY_W / 2} y={bodyY} width={BODY_W} height={bodyH} fill={bodyFill} stroke={wickStroke} strokeWidth="1" rx="1" />
            </g>
          );
        })}

        {/* Label "1.1780" (résistance) à gauche */}
        <rect x="6" y="48" width="50" height="13" rx="3" fill="#09090b" />
        <text x="31" y="58" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">1.1780</text>

        {/* Label "1.1768" (bord bas FVG) à gauche */}
        <rect x="6" y="104" width="50" height="13" rx="3" fill="#09090b" />
        <text x="31" y="114" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">1.1768</text>

        {/* Label Sweep 1.1792 */}
        <line x1="167" y1="38" x2="200" y2="28" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="200" y="18" width="62" height="14" rx="3" fill="#09090b" />
        <text x="231" y="28" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">1.1792</text>

        {/* Label "1.1748" en bas, à hauteur du creux du displacement */}
        <rect x="315" y="262" width="56" height="13" rx="3" fill="#09090b" />
        <text x="343" y="272" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">1.1748</text>

        {/* Annotation */}
        <rect x="170" y="288" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="288" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="302" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {L.annot}
        </text>
      </svg>

      {/* MOBILE : displacement setup ─────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>

        {/* Mini-SVG : setup displacement — sweep, gap (FVG), retour sur la zone, entry */}
        <svg viewBox="0 0 280 110" className="w-full h-auto" aria-label="Displacement setup" fill="none">
          {/* Zone FVG (blue) */}
          <rect x="100" y="40" width="50" height="16" fill="#60a5fa18" stroke="#60a5fa55" strokeWidth="0.9" strokeDasharray="3 2" />
          <rect x="105" y="22" width="40" height="13" rx="2" fill="#60a5fa18" stroke="#60a5fa55" strokeWidth="0.7" />
          <text x="125" y="31" fontSize="9" fill="#60a5fa" textAnchor="middle" fontWeight="700">FVG</text>
          {/* Trajectoire : sweep → impulsion création FVG → retour sur FVG → continuation */}
          <path d="M15,80 L40,90 L60,75 L80,55 L100,42 L130,45 L165,62 L195,52 L225,38 L260,18" stroke="#71717a" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
          {/* Sweep point */}
          <circle cx="40" cy="90" r="3" fill="#f59e0b" />
          <text x="40" y="105" fontSize="8" fill="#f59e0b" textAnchor="middle">sweep</text>
          {/* Entry au retour sur FVG */}
          <circle cx="140" cy="48" r="3.5" fill="#10b981" />
          <rect x="118" y="60" width="44" height="11" rx="2" fill="#09090b" />
          <text x="140" y="68" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">Entry ✓</text>
          {/* Target */}
          <circle cx="260" cy="18" r="3" fill="#10b981" />
        </svg>

        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">1</span>
            <span className="text-zinc-300">{L.mob1A} <span className="font-bold text-blue-400">FVG</span> {L.mob1B}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[11px] font-bold text-blue-400 mt-0.5">2</span>
            <span className="text-zinc-300">{L.mob2}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[11px] font-bold text-emerald-400 mt-0.5">3</span>
            <span className="text-zinc-300"><span className="font-bold text-emerald-400">{L.mob3Bold}</span> {L.mob3End}</span>
          </li>
        </ul>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legend1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{L.legend2}</span>
        </div>
      </div>
    </div>
  );
}
