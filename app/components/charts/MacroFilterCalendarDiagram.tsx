// Diagramme : filtre macro via le calendrier (Leçon 4 Macro Trading)
// Gauche : checklist 3 lignes (setup OK / news imminente / filtre rouge).
// Droite : M15 XAU/USD avec volatilité post-news extrême (impulsion vers 4 705 puis chute 4 610).

interface MacroFilterCalendarDiagramProps {
  className?: string;
}

type CandleSpec = {
  cx: number;
  wickTop: number;
  bodyY: number;
  bodyH: number;
  wickBottom: number;
  type: "bull" | "bear";
};

// Niveaux successifs (y) : 200 → 180 → 160 → 130 → 100 → 75 → 100 → 145 → 195 → 235 → 255 → 270
// Bull si close < open en y ; bear si close > open en y. Espacement régulier.
const CANDLES: CandleSpec[] = [
  { cx: 300, wickTop: 176, bodyY: 180, bodyH: 20, wickBottom: 208, type: "bull" }, // open 200 close 180
  { cx: 330, wickTop: 156, bodyY: 160, bodyH: 20, wickBottom: 186, type: "bull" }, // open 180 close 160
  { cx: 360, wickTop: 126, bodyY: 130, bodyH: 30, wickBottom: 165, type: "bull" }, // open 160 close 130
  { cx: 390, wickTop:  96, bodyY: 100, bodyH: 30, wickBottom: 135, type: "bull" }, // open 130 close 100
  { cx: 420, wickTop:  68, bodyY:  75, bodyH: 25, wickBottom: 108, type: "bull" }, // open 100 close 75 (~4 705)
  { cx: 450, wickTop:  72, bodyY:  75, bodyH: 25, wickBottom: 108, type: "bear" }, // open 75 close 100
  { cx: 480, wickTop:  98, bodyY: 100, bodyH: 45, wickBottom: 152, type: "bear" }, // open 100 close 145
  { cx: 510, wickTop: 143, bodyY: 145, bodyH: 50, wickBottom: 200, type: "bear" }, // open 145 close 195
  { cx: 540, wickTop: 192, bodyY: 195, bodyH: 40, wickBottom: 242, type: "bear" }, // open 195 close 235
  { cx: 570, wickTop: 232, bodyY: 235, bodyH: 20, wickBottom: 260, type: "bear" }, // open 235 close 255
  { cx: 600, wickTop: 252, bodyY: 255, bodyH: 15, wickBottom: 275, type: "bear" }, // open 255 close 270 (~4 610)
];

const BODY_W = 14;

export function MacroFilterCalendarDiagram({ className = "" }: MacroFilterCalendarDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        {/* Checklist à gauche */}
        <rect x="20" y="40" width="240" height="200" rx="8" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
        <rect x="34" y="50" width="68" height="14" rx="3" fill="#09090b" />
        <text x="68" y="60" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Checklist</text>

        {/* Ligne 1 — Setup technique valide (coche verte) */}
        <circle cx="44" cy="92" r="9" fill="#10b98118" stroke="#10b981" strokeWidth="1.4" />
        <path d="M 39 92 L 43 96 L 50 88" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="60" y="96" fill="#e4e4e7" fontSize="10" fontWeight="600">Setup technique valide</text>

        {/* Ligne 2 — News majeure imminente (croix rouge) */}
        <circle cx="44" cy="132" r="9" fill="#ef444418" stroke="#ef4444" strokeWidth="1.4" />
        <path d="M 39 127 L 49 137 M 49 127 L 39 137" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
        <text x="60" y="136" fill="#e4e4e7" fontSize="10" fontWeight="600">News majeure imminente</text>

        {/* Ligne 3 — Filtre macro (pastille ROUGE) */}
        <text x="34" y="186" fill="#e4e4e7" fontSize="10" fontWeight="600">Filtre macro</text>
        <rect x="34" y="196" width="60" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1.4" />
        <text x="64" y="211" fill="#ef4444" fontSize="10" fontWeight="800" textAnchor="middle">ROUGE</text>

        {/* Badge graphique à droite */}
        <rect x="282" y="20" width="118" height="20" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="341" y="34" fill="#a1a1aa" fontSize="10" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Niveaux référence */}
        <rect x="420" y="60" width="62" height="13" rx="3" fill="#09090b" />
        <text x="451" y="70" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 705 $</text>

        <rect x="606" y="266" width="62" height="13" rx="3" fill="#09090b" />
        <text x="637" y="276" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 610 $</text>

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

        {/* Annotation amber */}
        <rect x="170" y="284" width="380" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="284" width="380" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="360" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Un bon setup peut devenir mauvais au mauvais moment
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Setup technique propre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">News imminente = filtre macro rouge, pas de trade</span>
        </div>
      </div>
    </div>
  );
}
