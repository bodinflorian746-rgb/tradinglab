interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const SIZE_CLASSES = {
  sm: {
    square: "h-8 w-8",
    svg: "h-5 w-5",
    text: "text-base",
  },
  md: {
    square: "h-10 w-10",
    svg: "h-6 w-6",
    text: "text-lg",
  },
  lg: {
    square: "h-12 w-12",
    svg: "h-7 w-7",
    text: "text-xl",
  },
} as const;

export default function Logo({ size = "md", showTagline = true }: LogoProps) {
  const s = SIZE_CLASSES[size];
  return (
    <div className="flex items-center gap-3">
      {/* Carré emerald avec 3 bougies trading blanches */}
      <div
        className={`flex items-center justify-center rounded-lg bg-emerald-500 ${s.square}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" className={s.svg} fill="none">
          {/* Bougie 1 — courte, à gauche */}
          <line x1="8" y1="6" x2="8" y2="26" stroke="white" strokeWidth="1.5" />
          <rect x="6" y="14" width="4" height="10" fill="white" />
          {/* Bougie 2 — moyenne, au centre */}
          <line x1="16" y1="4" x2="16" y2="28" stroke="white" strokeWidth="1.5" />
          <rect x="14" y="10" width="4" height="12" fill="white" />
          {/* Bougie 3 — haute, à droite */}
          <line x1="24" y1="2" x2="24" y2="30" stroke="white" strokeWidth="1.5" />
          <rect x="22" y="6" width="4" height="16" fill="white" />
        </svg>
      </div>

      {/* Texte logo */}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className={`font-bold text-white ${s.text}`}>TradeScale</span>
          <span className={`font-bold text-emerald-500 ${s.text}`}>X</span>
        </div>
        {showTagline && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 leading-tight mt-0.5">
            TRADE. LEARN. SCALE.
          </span>
        )}
      </div>
    </div>
  );
}
