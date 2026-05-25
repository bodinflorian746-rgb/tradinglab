interface FVGDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

type CandleData = {
  cx: number;
  wickTop: number;
  bodyTop: number;
  bodyBot: number;
  wickBot: number;
  bull: boolean;
};

function MiniCandle({ cx, wickTop, bodyTop, bodyBot, wickBot, bull }: CandleData) {
  const halfW = 8;
  return (
    <g>
      <line x1={cx} y1={wickTop} x2={cx} y2={wickBot}
        stroke={bull ? "#059669" : "#dc2626"} strokeWidth="1.5" strokeLinecap="round" />
      <rect x={cx - halfW} y={bodyTop} width={halfW * 2}
        height={Math.max(bodyBot - bodyTop, 3)}
        fill={bull ? "#10b981" : "#ef4444"}
        stroke={bull ? "#059669" : "#dc2626"}
        strokeWidth="0.8" rx="1.5" />
    </g>
  );
}

export function FVGDiagram({ className = "", locale = "fr" }: FVGDiagramProps) {
  const t = locale === "es"
    ? {
        fvgBullish: "FVG alcista",
        fvgBearish: "FVG bajista",
        b1High: "B1 alto",
        b3Low: "B3 bajo",
        b1Low: "B1 bajo",
        b3High: "B3 alto",
        retourDown: "retorno ↓",
        retourUp: "retorno ↑",
        mobileBullTitle: "FVG alcista (izquierda)",
        mobileBullBodyPart1: "3 velas alcistas seguidas → se forma un ",
        mobileBullBodyBold1: "gap",
        mobileBullBodyPart2: " entre el alto de B1 y el bajo de B3. El precio regresa a llenar este gap (",
        mobileBullBodyBold2: "retorno ↓",
        mobileBullBodyPart3: ") antes de seguir.",
        mobileBearTitle: "FVG bajista (derecha)",
        mobileBearBodyPart1: "3 velas bajistas seguidas → un ",
        mobileBearBodyBold1: "gap",
        mobileBearBodyPart2: " entre el bajo de B1 y el alto de B3. El precio sube a mitigar el gap (",
        mobileBearBodyBold2: "retorno ↑",
        mobileBearBodyPart3: ") y luego retoma la baja.",
        leg1: "FVG = Fair Value Gap (zona de desequilibrio)",
        leg2: "Vela alcista",
        leg3: "Vela bajista",
      }
    : {
        fvgBullish: "FVG haussier",
        fvgBearish: "FVG baissier",
        b1High: "B1 haut",
        b3Low: "B3 bas",
        b1Low: "B1 bas",
        b3High: "B3 haut",
        retourDown: "retour ↓",
        retourUp: "retour ↑",
        mobileBullTitle: "FVG haussier (gauche)",
        mobileBullBodyPart1: "3 bougies haussières d’affilée → un ",
        mobileBullBodyBold1: "gap",
        mobileBullBodyPart2: " se forme entre le haut de B1 et le bas de B3. Le prix revient combler ce gap (",
        mobileBullBodyBold2: "retour ↓",
        mobileBullBodyPart3: ") avant de repartir.",
        mobileBearTitle: "FVG baissier (droite)",
        mobileBearBodyPart1: "3 bougies baissières d’affilée → un ",
        mobileBearBodyBold1: "gap",
        mobileBearBodyPart2: " entre le bas de B1 et le haut de B3. Le prix remonte mitiger le gap (",
        mobileBearBodyBold2: "retour ↑",
        mobileBearBodyPart3: ") puis reprend la baisse.",
        leg1: "FVG = Fair Value Gap (zone de déséquilibre)",
        leg2: "Bougie haussière",
        leg3: "Bougie baissière",
      };

  // ── BULLISH FVG (left, x=4–130) ──────────────────────────────
  // B1: small candle before impulse. Its HIGH (wickTop) = y=88
  // B3: bullish continuation. Its LOW (wickBot) = y=70
  // FVG zone: y=70 to y=88 (B3 low is above B1 high → gap exists)
  const b1: CandleData = { cx: 28,  wickTop: 88,  bodyTop: 92,  bodyBot: 104, wickBot: 108, bull: false };
  const b2: CandleData = { cx: 54,  wickTop: 50,  bodyTop: 54,  bodyBot: 102, wickBot: 106, bull: true  };
  const b3: CandleData = { cx: 80,  wickTop: 40,  bodyTop: 44,  bodyBot: 64,  wickBot: 70,  bull: true  };
  // B4: mitigation — bearish candle whose wick tape la FVG partiellement (mèche
  // descend à y=79, soit ~50% de la zone, puis rejet net). FVG reste active.
  const b4: CandleData = { cx: 112, wickTop: 38,  bodyTop: 42,  bodyBot: 76,  wickBot: 79,  bull: false };

  // FVG rect: spans between B1.wickTop and B3.wickBot
  const fvgBullTop = b3.wickBot;  // y=70 (upper boundary on screen, higher price)
  const fvgBullBot = b1.wickTop;  // y=88 (lower boundary on screen, lower price)

  // ── BEARISH FVG (right, x=138–264) ───────────────────────────
  // B1r: small candle before bearish impulse. Its LOW (wickBot) = y=62
  // B3r: bearish continuation. Its HIGH (wickTop) = y=80
  // FVG zone: y=62 to y=80 (B1r low is above B3r high → gap)
  const b1r: CandleData = { cx: 158, wickTop: 44,  bodyTop: 48,  bodyBot: 58,  wickBot: 62,  bull: true  };
  const b2r: CandleData = { cx: 184, wickTop: 46,  bodyTop: 50,  bodyBot: 98,  wickBot: 102, bull: false };
  const b3r: CandleData = { cx: 210, wickTop: 80,  bodyTop: 84,  bodyBot: 104, wickBot: 110, bull: false };
  // B4r: mitigation — bullish candle qui tape la FVG partiellement (body reste
  // sous le milieu de la zone, mèche atteint mi-FVG, puis rejet). FVG reste active.
  const b4r: CandleData = { cx: 248, wickTop: 68,  bodyTop: 70,  bodyBot: 80,  wickBot: 86,  bull: true  };

  const fvgBearTop = b1r.wickBot; // y=62
  const fvgBearBot = b3r.wickTop; // y=80

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`@media (max-width: 640px) { .chart-detail-labels { display: none; } }`}</style>

        {/* Panel divider */}
        <line x1="134" y1="8" x2="134" y2="144" stroke="#27272a" strokeWidth="1" />

        {/* ── BULLISH FVG ── */}

        {/* FVG zone rect */}
        <rect x="18" y={fvgBullTop} width="102" height={fvgBullBot - fvgBullTop}
          fill="#60a5fa18" stroke="#60a5fa50" strokeWidth="1" rx="1" />

        {/* Candles */}
        <MiniCandle {...b1} />
        <MiniCandle {...b2} />
        <MiniCandle {...b3} />
        <MiniCandle {...b4} />

        {/* Badges textuels FVG haussier — masqués sur mobile */}
        <g className="chart-detail-labels">
          <rect x="6" y="7" width="72" height="14" rx="3"
            fill="#60a5fa18" stroke="#60a5fa50" strokeWidth="0.8" />
          <text x="42" y="17" fontSize="7.5" fill="#60a5fa" textAnchor="middle" fontWeight="700">{t.fvgBullish}</text>

          <line x1="92" y1={fvgBullTop} x2="92" y2={fvgBullBot}
            stroke="#60a5fa" strokeWidth="0.8" opacity="0.5" strokeDasharray="2 2" />

          <rect x="82" y={fvgBullBot - 8} width="22" height="14" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="93" y={fvgBullBot + 3} fontSize="6" fill="#60a5fa" textAnchor="middle">{t.b1High}</text>

          <rect x="82" y={fvgBullTop - 8} width="22" height="14" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="93" y={fvgBullTop + 3} fontSize="6" fill="#60a5fa" textAnchor="middle">{t.b3Low}</text>

          <rect x="100" y="23" width="30" height="14" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="115" y="34" fontSize="6.5" fill="#71717a" textAnchor="middle">{t.retourDown}</text>
        </g>

        {/* ── BEARISH FVG ── */}

        {/* FVG zone rect */}
        <rect x="146" y={fvgBearTop} width="102" height={fvgBearBot - fvgBearTop}
          fill="#60a5fa18" stroke="#60a5fa50" strokeWidth="1" rx="1" />

        {/* Candles */}
        <MiniCandle {...b1r} />
        <MiniCandle {...b2r} />
        <MiniCandle {...b3r} />
        <MiniCandle {...b4r} />

        {/* Badges textuels FVG baissier — masqués sur mobile */}
        <g className="chart-detail-labels">
          <rect x="140" y="7" width="72" height="14" rx="3"
            fill="#60a5fa18" stroke="#60a5fa50" strokeWidth="0.8" />
          <text x="176" y="17" fontSize="7.5" fill="#60a5fa" textAnchor="middle" fontWeight="700">{t.fvgBearish}</text>

          <line x1="220" y1={fvgBearTop} x2="220" y2={fvgBearBot}
            stroke="#60a5fa" strokeWidth="0.8" opacity="0.5" strokeDasharray="2 2" />

          <rect x="222" y={fvgBearTop - 8} width="24" height="14" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="234" y={fvgBearTop + 3} fontSize="6" fill="#60a5fa" textAnchor="middle">{t.b1Low}</text>

          <rect x="222" y={fvgBearBot - 8} width="24" height="14" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="234" y={fvgBearBot + 3} fontSize="6" fill="#60a5fa" textAnchor="middle">{t.b3High}</text>

          <rect x="234" y="41" width="30" height="14" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="249" y="52" fontSize="6.5" fill="#71717a" textAnchor="middle">{t.retourUp}</text>
        </g>
      </svg>

      {/* Mobile : 2 cartes empilées avec le mécanisme FVG */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2.5">
        <div className="rounded-lg border border-blue-400/25 bg-blue-500/5 p-2.5 space-y-1.5">
          <p className="text-[13px] font-bold text-blue-400">{t.mobileBullTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug">
            {t.mobileBullBodyPart1}<span className="font-bold text-blue-400">{t.mobileBullBodyBold1}</span>{t.mobileBullBodyPart2}<span className="font-semibold">{t.mobileBullBodyBold2}</span>{t.mobileBullBodyPart3}
          </p>
        </div>
        <div className="rounded-lg border border-blue-400/25 bg-blue-500/5 p-2.5 space-y-1.5">
          <p className="text-[13px] font-bold text-blue-400">{t.mobileBearTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug">
            {t.mobileBearBodyPart1}<span className="font-bold text-blue-400">{t.mobileBearBodyBold1}</span>{t.mobileBearBodyPart2}<span className="font-semibold">{t.mobileBearBodyBold2}</span>{t.mobileBearBodyPart3}
          </p>
        </div>
      </div>

      {/* Desktop legend (inchangée) */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm" style={{ background: "#60a5fa", opacity: 0.6 }} />
          <span className="text-[10px] text-zinc-500">{t.leg1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{t.leg2}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">{t.leg3}</span>
        </div>
      </div>
    </div>
  );
}
