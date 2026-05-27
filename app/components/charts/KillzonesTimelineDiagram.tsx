// Diagramme : timeline horizontale des Killzones (Leçon 3 ICT)
// Timeline découpée en 3 segments (Asia / London / NY) au-dessus d'un mini-tracé de prix
// qui montre range calme sous Asia, sweep + impulsion sous London, seconde accélération sous NY.

interface KillzonesTimelineDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

const BODY_W = 8;

type MiniCandle = {
  cx: number;
  wickTop: number;
  bodyY: number;
  bodyH: number;
  wickBottom: number;
  type: "bull" | "bear";
};

// Mini-tracé de prix aligné sous la timeline. Bougies serrées dans Asia, expansion sous London,
// nouvelle expansion sous NY.
const MINI_CANDLES: MiniCandle[] = [
  // Phase Asia (x=70 à x=240) — range étroit autour de y=200
  { cx:  80, wickTop: 192, bodyY: 196, bodyH: 10, wickBottom: 212, type: "bull" },
  { cx: 105, wickTop: 196, bodyY: 200, bodyH:  8, wickBottom: 215, type: "bear" },
  { cx: 130, wickTop: 192, bodyY: 198, bodyH: 10, wickBottom: 214, type: "bull" },
  { cx: 155, wickTop: 195, bodyY: 200, bodyH:  8, wickBottom: 213, type: "bear" },
  { cx: 180, wickTop: 194, bodyY: 198, bodyH:  9, wickBottom: 212, type: "bull" },
  { cx: 205, wickTop: 196, bodyY: 200, bodyH:  7, wickBottom: 213, type: "bear" },
  { cx: 230, wickTop: 194, bodyY: 198, bodyH: 10, wickBottom: 215, type: "bull" },

  // Phase London (x=260 à x=440) — sweep sous le range puis impulsion haussière
  { cx: 260, wickTop: 215, bodyY: 220, bodyH: 10, wickBottom: 245, type: "bear" }, // sweep sous le range
  { cx: 290, wickTop: 218, bodyY: 195, bodyH: 30, wickBottom: 230, type: "bull" }, // grosse impulsion
  { cx: 320, wickTop: 170, bodyY: 175, bodyH: 25, wickBottom: 205, type: "bull" },
  { cx: 350, wickTop: 148, bodyY: 152, bodyH: 25, wickBottom: 180, type: "bull" },
  { cx: 380, wickTop: 130, bodyY: 134, bodyH: 20, wickBottom: 158, type: "bull" },
  { cx: 410, wickTop: 128, bodyY: 132, bodyH: 12, wickBottom: 150, type: "bear" }, // pause
  { cx: 440, wickTop: 130, bodyY: 134, bodyH: 14, wickBottom: 152, type: "bull" },

  // Phase NY (x=470 à x=620) — seconde accélération
  { cx: 470, wickTop: 110, bodyY: 114, bodyH: 24, wickBottom: 140, type: "bull" },
  { cx: 500, wickTop:  88, bodyY:  92, bodyH: 26, wickBottom: 122, type: "bull" },
  { cx: 530, wickTop:  70, bodyY:  72, bodyH: 22, wickBottom:  98, type: "bull" },
  { cx: 560, wickTop:  60, bodyY:  64, bodyH: 14, wickBottom:  82, type: "bull" },
  { cx: 590, wickTop:  56, bodyY:  60, bodyH: 12, wickBottom:  78, type: "bull" },
  { cx: 615, wickTop:  52, bodyY:  56, bodyH: 10, wickBottom:  72, type: "bull" },
];

export function KillzonesTimelineDiagram({ className = "", locale = "fr" }: KillzonesTimelineDiagramProps) {
  const t = locale === "es"
    ? {
        asia: "Asia Session",
        london: "London Open",
        newYork: "New York Open",
        annotation: "La volatilidad se concentra en ciertas ventanas horarias",
        mobileTitle: "Killzones — timeline 24h",
        asiaTitle: "Asia (00h–07h)",
        asiaBody: "Baja volatilidad, range estrecho. Acumulación.",
        londonTitle: "London (08h–10h)",
        londonBody: "Expansión + impulsos francos. Killzone mayor.",
        nyTitle: "New York (14h30 o 15h30 París)",
        nyBody: "2da ventana — pico de actividad institucional US.",
        leg1: "Asia Session = baja volatilidad, range estrecho",
        leg2: "London & New York = expansión, impulsos francos",
      }
    : {
        asia: "Asia Session",
        london: "London Open",
        newYork: "New York Open",
        annotation: "La volatilité se concentre dans certaines fenêtres horaires",
        mobileTitle: "Killzones — timeline 24h",
        asiaTitle: "Asia (00h–07h)",
        asiaBody: "Faible volatilité, range étroit. Accumulation.",
        londonTitle: "London (08h–10h)",
        londonBody: "Expansion + impulsions franches. Killzone majeure.",
        nyTitle: "New York (14h30 ou 15h30 Paris)",
        nyBody: "2e fenêtre — pic d'activité institutionnelle US.",
        leg1: "Asia Session = faible volatilité, range étroit",
        leg2: "London & New York = expansion, impulsions franches",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        {/* Timeline horizontale en haut */}
        {/* Asia — segment fin, calme */}
        <line x1="70" y1="42" x2="240" y2="42" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
        <rect x="98" y="20" width="114" height="14" rx="3" fill="#09090b" />
        <text x="155" y="30" fill="#a1a1aa" fontSize="10" fontWeight="700" textAnchor="middle">{t.asia}</text>

        {/* London — segment épais, accent */}
        <line x1="260" y1="42" x2="440" y2="42" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <rect x="288" y="20" width="124" height="14" rx="3" fill="#09090b" />
        <text x="350" y="30" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">{t.london}</text>

        {/* NY — segment épais, accent */}
        <line x1="460" y1="42" x2="620" y2="42" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <rect x="486" y="20" width="124" height="14" rx="3" fill="#09090b" />
        <text x="548" y="30" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">{t.newYork}</text>

        {/* Séparateurs verticaux entre les phases */}
        <line x1="245" y1="50" x2="245" y2="270" stroke="#27272a" strokeWidth="1" strokeDasharray="2 3" />
        <line x1="455" y1="50" x2="455" y2="270" stroke="#27272a" strokeWidth="1" strokeDasharray="2 3" />

        {/* Mini-tracé de prix */}
        {MINI_CANDLES.map(({ cx, wickTop, bodyY, bodyH, wickBottom, type }, i) => {
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
        <rect x="160" y="284" width="380" height="22" rx="11" fill="#09090b" />
        <rect x="160" y="284" width="380" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {t.annotation}
        </text>
      </svg>

      {/* MOBILE : killzones timeline ──────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        <div className="rounded-lg border border-zinc-600 bg-zinc-800/40 p-3">
          <p className="text-[13px] font-bold text-zinc-300">{t.asiaTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.asiaBody}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{t.londonTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.londonBody}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{t.nyTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.nyBody}</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-600" />
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
