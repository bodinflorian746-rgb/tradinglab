// Diagramme : contexte d'un PD Array (Leçon 2 ICT)
// EUR/USD H1 — sweep d'une résistance, impulsion baissière qui crée un FVG,
// puis retour du prix dans le FVG et rejet.

interface PDArrayContextDiagramProps {
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
  { cx:  70, wickTop: 190, bodyY: 195, bodyH: 30, wickBottom: 230, type: "bull" },
  { cx: 115, wickTop: 155, bodyY: 160, bodyH: 38, wickBottom: 202, type: "bull" },
  { cx: 160, wickTop:  72, bodyY:  78, bodyH: 52, wickBottom: 138, type: "bull" },
  // Au contact de la résistance
  { cx: 205, wickTop:  60, bodyY:  68, bodyH: 30, wickBottom: 102, type: "bull" },
  // SWEEP — mèche qui dépasse, corps qui referme sous la ligne
  { cx: 250, wickTop:  42, bodyY:  62, bodyH: 24, wickBottom:  92, type: "bear" },
  // IMPULSE BEARISH — grand corps qui crée le FVG
  { cx: 295, wickTop:  82, bodyY:  86, bodyH: 90, wickBottom: 182, type: "bear" },
  // Continuation
  { cx: 340, wickTop: 172, bodyY: 176, bodyH: 36, wickBottom: 220, type: "bear" },
  { cx: 385, wickTop: 215, bodyY: 218, bodyH: 24, wickBottom: 248, type: "bear" },
  // Retour haussier vers le FVG
  { cx: 430, wickTop: 198, bodyY: 200, bodyH: 42, wickBottom: 248, type: "bull" },
  { cx: 475, wickTop: 158, bodyY: 162, bodyH: 38, wickBottom: 205, type: "bull" },
  // Entrée dans la zone FVG
  { cx: 520, wickTop: 105, bodyY: 110, bodyH: 50, wickBottom: 165, type: "bull" },
  // Rejet — bear depuis le FVG
  { cx: 565, wickTop: 102, bodyY: 108, bodyH: 60, wickBottom: 175, type: "bear" },
];

const BODY_W = 12;

export function PDArrayContextDiagram({ className = "", locale = "fr" }: PDArrayContextDiagramProps) {
  const t = locale === "es"
    ? {
        equalHighs: "Equal highs / resistencia 1.1780",
        sweep: "Sweep 1.1792",
        fvg: "FVG 1.1758-1.1770",
        annotation: "El precio regresa a la zona creada por el impulso",
        mobileTitle: "PD Array — contexto FVG · EUR/USD H1",
        b1Title: "FVG bearish creado por el impulso",
        b1Body: "Un impulso bajista fuerte deja un gap (Fair Value Gap) por llenar.",
        b2Title: "Retorno + rechazo = PD Array activo",
        b2Body: "El precio regresa a la zona y luego rechazo bajista = PD Array operativo para short.",
        leg1: "FVG creado por el impulso bajista",
        leg2: "Retorno a la zona y luego rechazo = PD Array activo",
      }
    : {
        equalHighs: "Equal highs / résistance 1.1780",
        sweep: "Sweep 1.1792",
        fvg: "FVG 1.1758-1.1770",
        annotation: "Le prix revient dans la zone créée par l'impulsion",
        mobileTitle: "PD Array — contexte FVG · EUR/USD H1",
        b1Title: "FVG bearish créé par l'impulsion",
        b1Body: "Une impulsion baissière forte laisse un gap (Fair Value Gap) à combler.",
        b2Title: "Retour + rejet = PD Array actif",
        b2Body: "Prix revient dans la zone puis rejet bearish = PD Array opérationnel pour short.",
        leg1: "FVG créé par l'impulsion baissière",
        leg2: "Retour dans la zone puis rejet = PD Array actif",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Ligne résistance / equal highs */}
        <line x1="40" y1="60" x2="620" y2="60" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="430" y="48" width="190" height="13" rx="3" fill="#09090b" />
        <text x="525" y="58" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">{t.equalHighs}</text>

        {/* Bande FVG — y=85 à y=115 */}
        <rect x="40" y="85" width="600" height="30" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

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

        {/* Label Sweep */}
        <line x1="252" y1="44" x2="278" y2="40" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.7" />
        <rect x="278" y="30" width="86" height="14" rx="3" fill="#09090b" />
        <text x="321" y="40" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">{t.sweep}</text>

        {/* Label FVG (dans la bande à droite) */}
        <rect x="492" y="92" width="128" height="14" rx="3" fill="#09090b" />
        <text x="556" y="102" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">{t.fvg}</text>

        {/* Annotation */}
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {t.annotation}
        </text>
      </svg>

      {/* MOBILE : PD Array contexte ─────────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        <div className="rounded-lg border border-blue-400/40 bg-blue-500/8 p-3">
          <p className="text-[13px] font-bold text-blue-400">{t.b1Title}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.b1Body}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{t.b2Title}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.b2Body}</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{t.leg1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{t.leg2}</span>
        </div>
      </div>
    </div>
  );
}
