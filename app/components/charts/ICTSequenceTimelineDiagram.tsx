// Diagramme : séquence ICT complète (Leçon 5 ICT)
// Timeline horizontale en 7 étapes avec un tracé de prix continu illustrant chaque étape.

interface ICTSequenceTimelineDiagramProps {
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

// Tracé de prix continu : approche, equal highs, sweep, displacement, FVG, retour, chute finale
// Continuité : open de chaque bougie = close de la précédente.
const CANDLES: CandleSpec[] = [
  // HTF bearish — approche en montée
  { cx:  55, wickTop: 175, bodyY: 180, bodyH: 22, wickBottom: 208, type: "bull" }, // close 202 ? non: bull, open=bodyY+bodyH=202, close=bodyY=180
  // Equal highs au niveau y=150 — 2 sommets identiques
  { cx:  95, wickTop: 145, bodyY: 150, bodyH: 30, wickBottom: 185, type: "bull" }, // open 180 close 150
  { cx: 135, wickTop: 148, bodyY: 152, bodyH: 28, wickBottom: 185, type: "bear" }, // open 152 close 180 (recul)
  { cx: 175, wickTop: 148, bodyY: 152, bodyH: 28, wickBottom: 185, type: "bull" }, // open 180 close 152 (2e EH)
  // Sweep — mèche au-dessus de y=150, corps referme sous
  { cx: 215, wickTop: 128, bodyY: 152, bodyH: 22, wickBottom: 182, type: "bear" }, // open 152 close 174
  // Displacement bearish — grandes bougies rouges
  { cx: 255, wickTop: 172, bodyY: 174, bodyH: 40, wickBottom: 220, type: "bear" }, // open 174 close 214
  { cx: 295, wickTop: 212, bodyY: 214, bodyH: 35, wickBottom: 255, type: "bear" }, // open 214 close 249
  // FVG (bande symbolique autour de y=200-220) — bougie qui rebondit
  { cx: 335, wickTop: 245, bodyY: 248, bodyH: 28, wickBottom: 280, type: "bear" }, // open 249 close 277 (légère continuation)
  // Retour haussier vers le FVG
  { cx: 380, wickTop: 248, bodyY: 252, bodyH: 28, wickBottom: 285, type: "bull" }, // open 280 close 252
  { cx: 420, wickTop: 215, bodyY: 220, bodyH: 32, wickBottom: 255, type: "bull" }, // open 252 close 220
  // Entrée dans la bande FVG (y=200-220)
  { cx: 460, wickTop: 195, bodyY: 200, bodyH: 22, wickBottom: 225, type: "bull" }, // open 220 close 198 (dans le FVG)
  // Chute finale — bougies baissières
  { cx: 500, wickTop: 196, bodyY: 200, bodyH: 35, wickBottom: 240, type: "bear" }, // open 200 close 235
  { cx: 540, wickTop: 232, bodyY: 235, bodyH: 28, wickBottom: 268, type: "bear" }, // open 235 close 263
  { cx: 580, wickTop: 260, bodyY: 263, bodyH: 18, wickBottom: 285, type: "bear" }, // open 263 close 281
  { cx: 620, wickTop: 278, bodyY: 281, bodyH: 10, wickBottom: 294, type: "bear" }, // open 281 close 291
];

const BODY_W = 10;

const STEPS = [
  { x:  55, label: "HTF bearish" },
  { x: 115, label: "Equal highs" },
  { x: 215, label: "Sweep" },
  { x: 275, label: "Displacement" },
  { x: 360, label: "FVG" },
  { x: 460, label: "Retour FVG" },
  { x: 580, label: "Chute finale" },
];

export function ICTSequenceTimelineDiagram({ className = "" }: ICTSequenceTimelineDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        {/* Timeline horizontale */}
        <line x1="40" y1="58" x2="660" y2="58" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />

        {/* Étapes — petits cercles + étiquettes alternées (haut/bas) */}
        {STEPS.map(({ x, label }, i) => {
          const labelAbove = i % 2 === 0;
          const labelY = labelAbove ? 30 : 86;
          const lineY1 = labelAbove ? 44 : 58;
          const lineY2 = labelAbove ? 58 : 72;
          return (
            <g key={i}>
              <circle cx={x} cy="58" r="4" fill="#f59e0b" stroke="#09090b" strokeWidth="1.2" />
              <line x1={x} y1={lineY1} x2={x} y2={lineY2} stroke="#52525b" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
              <rect x={x - 44} y={labelY - 10} width="88" height="14" rx="3" fill="#09090b" />
              <text x={x} y={labelY} fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">{label}</text>
            </g>
          );
        })}

        {/* Ligne de résistance Equal Highs y=150 */}
        <line x1="40" y1="150" x2="660" y2="150" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.6" />

        {/* Bande FVG y=200-220 */}
        <rect x="290" y="200" width="370" height="20" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.55" />

        {/* Bougies */}
        {CANDLES.map(({ cx, wickTop, bodyY, bodyH, wickBottom, type }, i) => {
          const bodyFill = type === "bull" ? "#10b981" : "#ef4444";
          const wickStroke = type === "bull" ? "#059669" : "#b91c1c";
          return (
            <g key={i}>
              <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke={wickStroke} strokeWidth="1.2" strokeLinecap="round" />
              <rect x={cx - BODY_W / 2} y={bodyY} width={BODY_W} height={bodyH} fill={bodyFill} stroke={wickStroke} strokeWidth="0.8" rx="1" />
            </g>
          );
        })}

        {/* Annotation */}
        <rect x="170" y="296" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="296" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="310" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le setup se construit étape par étape
        </text>
      </svg>

      {/* MOBILE : 7 étapes ICT ──────────────────────────── */}
      <div className="sm:hidden p-4 space-y-2">
        <p className="text-[14px] font-bold text-white text-center">Séquence ICT complète — 7 étapes</p>
        {[
          { n: 1, t: "Liquidité HTF identifiée", c: "amber" },
          { n: 2, t: "Sweep de la liquidité", c: "amber" },
          { n: 3, t: "Réintégration / CHoCH", c: "red" },
          { n: 4, t: "Displacement bearish", c: "red" },
          { n: 5, t: "FVG créé", c: "blue" },
          { n: 6, t: "Retour dans le FVG (mitigation)", c: "blue" },
          { n: 7, t: "Rejet + reprise = exécution", c: "emerald" },
        ].map((s) => (
          <div key={s.n} className="flex items-center gap-2.5 text-[13px]">
            <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-${s.c}-500/20 border border-${s.c}-400 text-${s.c}-400`}>{s.n}</span>
            <span className="text-zinc-300">{s.t}</span>
          </div>
        ))}
        <p className="text-[12px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
          Chaque étape construit la suivante.
        </p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">7 étapes — de la liquidité HTF à l&apos;exécution</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Chaque étape construit la suivante</span>
        </div>
      </div>
    </div>
  );
}
