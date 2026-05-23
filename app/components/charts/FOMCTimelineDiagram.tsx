function Candle({
  cx, wickTop, bodyTop, bodyBot, wickBot, bull,
}: {
  cx: number; wickTop: number; bodyTop: number; bodyBot: number; wickBot: number; bull: boolean;
}) {
  const hw = 10;
  return (
    <g>
      <line
        x1={cx} y1={wickTop} x2={cx} y2={wickBot}
        stroke={bull ? "#059669" : "#b91c1c"} strokeWidth="1.5" strokeLinecap="round"
      />
      <rect
        x={cx - hw} y={bodyTop} width={hw * 2} height={Math.max(bodyBot - bodyTop, 3)}
        fill={bull ? "#10b981" : "#ef4444"}
        stroke={bull ? "#059669" : "#b91c1c"} strokeWidth="0.8" rx="1.5"
      />
    </g>
  );
}

export function FOMCTimelineDiagram({ locale = "fr" }: { locale?: "fr" | "es" } = {}) {
  const t = locale === "es"
    ? {
        volatiliteErratique: "Volatilidad errática",
        tradeIci: "Tradea aquí ✓",
        decisionFed: "Decisión Fed",
        discoursPowell: "Discurso Powell",
        legendDecision: "Decisión (20h00)",
        legendPowell: "Powell — crítico (20h30)",
        legendTrader: "Tradear aquí (21h00+)",
        mobileTitle: "Anatomía de un FOMC (Decisión Fed)",
        phase1Title: "20h00 — Decisión Fed",
        phase1Tag: "Fase 1",
        phase1Desc: "Publicación del comunicado. Falso spike alcista frecuentemente observado primero.",
        phase1Pips: "+150 pips inicial (trampa frecuente)",
        phase2Title: "20h30 — Discurso Powell",
        phase2Tag: "Fase 2",
        phase2DescA: "Conferencia de prensa. ",
        phase2DescB: "Volatilidad errática",
        phase2DescC: " — el tono real se revela.",
        phase2Pips: "Reversión violenta: −350 pips",
        phase3Title: "21h00+ — Tradea aquí ✓",
        phase3Tag: "Fase 3",
        phase3DescA: "Dirección confirmada. Tendencia instalada — momento en que se puede ",
        phase3DescB: "por fin entrar",
        phase3DescC: ".",
        warning: "⚠ NUNCA tradees entre 20h00 y 21h00",
      }
    : {
        volatiliteErratique: "Volatilité erratique",
        tradeIci: "Trade ici ✓",
        decisionFed: "Décision Fed",
        discoursPowell: "Discours Powell",
        legendDecision: "Décision (20h00)",
        legendPowell: "Powell — critique (20h30)",
        legendTrader: "Trader ici (21h00+)",
        mobileTitle: "Anatomie d'un FOMC (Décision Fed)",
        phase1Title: "20h00 — Décision Fed",
        phase1Tag: "Phase 1",
        phase1Desc: "Publication du communiqué. Faux spike haussier souvent observé en premier.",
        phase1Pips: "+150 pips initial (piège fréquent)",
        phase2Title: "20h30 — Discours Powell",
        phase2Tag: "Phase 2",
        phase2DescA: "Conférence de presse. ",
        phase2DescB: "Volatilité erratique",
        phase2DescC: " — le ton réel se révèle.",
        phase2Pips: "Retournement violent : −350 pips",
        phase3Title: "21h00+ — Trade ici ✓",
        phase3Tag: "Phase 3",
        phase3DescA: "Direction confirmée. Tendance installée — moment où on peut ",
        phase3DescB: "enfin entrer",
        phase3DescC: ".",
        warning: "⚠ Ne JAMAIS trader entre 20h00 et 21h00",
      };
  return (
    <div className="w-full">
      <svg
        width="100%"
        viewBox="0 0 800 400"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden sm:block"
      >
        {/* Background */}
        <rect width="800" height="400" fill="#18181b" rx="8" />

        {/* Zone rouge — 20h00 → 21h00 (x=200 → x=635) */}
        <rect x={200} y={50} width={435} height={280} fill="#ef4444" fillOpacity="0.12" />

        {/* Zone verte — 21h00+ (x=635 → x=720) */}
        <rect x={635} y={50} width={85} height={280} fill="#10b981" fillOpacity="0.12" />

        {/* Axe temps */}
        <line x1={50} y1={330} x2={785} y2={330} stroke="#3f3f46" strokeWidth="1" />

        {/* Marqueur vertical 20h00 — bleu */}
        <line x1={200} y1={50} x2={200} y2={330} stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.65" />
        {/* Marqueur vertical 20h30 (Discours Powell) — ambre */}
        <line x1={500} y1={50} x2={500} y2={330} stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.65" />
        {/* Marqueur vertical 21h00+ — emerald */}
        <line x1={635} y1={50} x2={635} y2={330} stroke="#34d399" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.45" />

        {/* ═══════════════════════════════════════
            GRILLE 27px — 24 bougies
            centre à centre = 27px partout
        ════════════════════════════════════════ */}

        {/* Pos 00 — x=83 — Filler bear (avant B1) */}
        <Candle cx={83} wickTop={185} bodyTop={190} bodyBot={215} wickBot={220} bull={false} />

        {/* Pos 01 — x=110 — Calme bull (narratif B1) */}
        <Candle cx={110} wickTop={175} bodyTop={178} bodyBot={198} wickBot={203} bull={true}  />
        {/* Pos 02 — x=137 — Calme bear (narratif B2) */}
        <Candle cx={137} wickTop={173} bodyTop={176} bodyBot={196} wickBot={201} bull={false} />
        {/* Pos 03 — x=164 — Filler bear pré-event */}
        <Candle cx={164} wickTop={172} bodyTop={177} bodyBot={202} wickBot={207} bull={false} />
        {/* Pos 04 — x=191 — Filler bull pré-event */}
        <Candle cx={191} wickTop={167} bodyTop={170} bodyBot={200} wickBot={205} bull={true}  />

        {/* Pos 05 — x=218 — NARRATIF B3 : faux spike haussier */}
        <Candle cx={218} wickTop={85} bodyTop={108} bodyBot={193} wickBot={207} bull={true} />

        {/* Pos 06 — x=245 — Filler bear (off spike) */}
        <Candle cx={245} wickTop={106} bodyTop={112} bodyBot={147} wickBot={155} bull={false} />
        {/* Pos 07 — x=272 — Filler bull */}
        <Candle cx={272} wickTop={124} bodyTop={130} bodyBot={155} wickBot={162} bull={true}  />
        {/* Pos 08 — x=299 — Filler bear */}
        <Candle cx={299} wickTop={128} bodyTop={135} bodyBot={170} wickBot={178} bull={false} />
        {/* Pos 09 — x=326 — Filler bull */}
        <Candle cx={326} wickTop={142} bodyTop={148} bodyBot={178} wickBot={185} bull={true}  />
        {/* Pos 10 — x=353 — Filler bear */}
        <Candle cx={353} wickTop={148} bodyTop={155} bodyBot={185} wickBot={192} bull={false} />
        {/* Pos 11 — x=380 — Filler bull */}
        <Candle cx={380} wickTop={152} bodyTop={158} bodyBot={193} wickBot={200} bull={true}  />
        {/* Pos 12 — x=407 — Filler bear */}
        <Candle cx={407} wickTop={156} bodyTop={163} bodyBot={203} wickBot={210} bull={false} />
        {/* Pos 13 — x=434 — Filler bear */}
        <Candle cx={434} wickTop={163} bodyTop={170} bodyBot={205} wickBot={213} bull={false} />
        {/* Pos 14 — x=461 — Filler bear (prépare la chute) */}
        <Candle cx={461} wickTop={170} bodyTop={178} bodyBot={208} wickBot={216} bull={false} />

        {/* Pos 15 — x=488 — NARRATIF B4 : début retournement */}
        <Candle cx={488} wickTop={110} bodyTop={115} bodyBot={160} wickBot={170} bull={false} />
        {/* Pos 16 — x=515 — NARRATIF B5 : retournement fort */}
        <Candle cx={515} wickTop={138} bodyTop={145} bodyBot={215} wickBot={228} bull={false} />
        {/* Pos 17 — x=542 — NARRATIF B6 : chute ÉNORME */}
        <Candle cx={542} wickTop={188} bodyTop={196} bodyBot={286} wickBot={299} bull={false} />

        {/* Pos 18 — x=569 — Filler bear (continuation B6) */}
        <Candle cx={569} wickTop={245} bodyTop={250} bodyBot={300} wickBot={306} bull={false} />
        {/* Pos 19 — x=596 — Filler bear */}
        <Candle cx={596} wickTop={255} bodyTop={260} bodyBot={305} wickBot={311} bull={false} />
        {/* Pos 20 — x=623 — Filler bear */}
        <Candle cx={623} wickTop={262} bodyTop={267} bodyBot={312} wickBot={317} bull={false} />

        {/* Pos 21 — x=650 — NARRATIF B7 : direction confirmée */}
        <Candle cx={650} wickTop={250} bodyTop={258} bodyBot={318} wickBot={328} bull={false} />
        {/* Pos 22 — x=677 — NARRATIF B8 : continuation */}
        <Candle cx={677} wickTop={270} bodyTop={275} bodyBot={325} wickBot={330} bull={false} />
        {/* Pos 23 — x=704 — NARRATIF B9 : tendance installée */}
        <Candle cx={704} wickTop={287} bodyTop={290} bodyBot={325} wickBot={330} bull={false} />

        {/* ── Zone labels ── */}
        <rect x={290} y={90} width={164} height={16} rx="3" fill="#09090b" fillOpacity="0.88" />
        <rect x={290} y={90} width={164} height={16} rx="3" fill="#ef444410" stroke="#ef444428" strokeWidth="0.6" />
        <text x={372} y={102} fontSize="10" fill="#ef4444" textAnchor="middle" fontStyle="italic">{t.volatiliteErratique}</text>

        <rect x={637} y={68} width={80} height={22} rx="4" fill="#09090b" fillOpacity="0.90" />
        <rect x={637} y={68} width={80} height={22} rx="4" fill="#10b98112" stroke="#10b98135" strokeWidth="0.8" />
        <text x={677} y={83} fontSize="12" fill="#34d399" textAnchor="middle" fontWeight="700">{t.tradeIci}</text>

        {/* ── Marqueurs sur l'axe ── */}
        <circle cx={200} cy={330} r="3.5" fill="#60a5fa" />
        <circle cx={500} cy={330} r="3.5" fill="#fbbf24" />
        <circle cx={635} cy={330} r="3.5" fill="#34d399" />

        {/* Labels horaires */}
        <rect x={152} y={341} width={96} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={200} y={352} fontSize="11" fill="#60a5fa" textAnchor="middle" fontWeight="600">20h00</text>

        <rect x={452} y={341} width={96} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={500} y={352} fontSize="11" fill="#fbbf24" textAnchor="middle" fontWeight="600">20h30</text>

        <rect x={587} y={341} width={96} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={635} y={352} fontSize="11" fill="#34d399" textAnchor="middle" fontWeight="600">21h00+</text>

        {/* Labels événements (haut) */}
        <rect x={130} y={24} width={140} height={16} rx="2" fill="#09090b" fillOpacity="0.88" />
        <text x={200} y={36} fontSize="11.5" fill="#60a5fa" textAnchor="middle" fontWeight="600">{t.decisionFed}</text>

        <rect x={396} y={24} width={208} height={16} rx="2" fill="#09090b" fillOpacity="0.88" />
        <text x={500} y={36} fontSize="11.5" fill="#fbbf24" textAnchor="middle" fontWeight="600">{t.discoursPowell}</text>

        {/* ── Légende ── */}
        <g transform="translate(50,368)">
          <circle cx="6" cy="6" r="4" fill="#60a5fa20" stroke="#60a5fa60" strokeWidth="1" />
          <text x="14" y="10" fontSize="9.5" fill="#71717a">{t.legendDecision}</text>

          <circle cx="148" cy="6" r="4" fill="#fbbf2420" stroke="#fbbf2460" strokeWidth="1" />
          <text x="156" y="10" fontSize="9.5" fill="#71717a">{t.legendPowell}</text>

          <circle cx="340" cy="6" r="4" fill="#10b98120" stroke="#10b98160" strokeWidth="1" />
          <text x="348" y="10" fontSize="9.5" fill="#71717a">{t.legendTrader}</text>
        </g>

        {/* ── Annotations chiffrées — couche du dessus (après tous les candles) ── */}
        <rect x="235" y="155" width="70" height="22" rx="3" fill="#09090b" fillOpacity="0.95" />
        <text x="240" y="172" textAnchor="start" fontSize="16" fill="#34d399" fontWeight="700">+150 pips</text>

        <rect x="560" y="218" width="70" height="22" rx="3" fill="#09090b" fillOpacity="0.95" />
        <text x="565" y="235" textAnchor="start" fontSize="16" fill="#f87171" fontWeight="700">-350 pips</text>
      </svg>

      {/* ── MOBILE : 3 phases FOMC empilées ────────────────────────── */}
      <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
        <p className="text-[14px] font-bold text-white text-center leading-snug">
          {t.mobileTitle}
        </p>

        {/* Phase 1 — 20h00 Décision Fed */}
        <div className="rounded-xl border-2 border-blue-400 bg-blue-500/8 p-3">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-[15px] font-bold text-blue-400">{t.phase1Title}</span>
            <span className="text-[11px] text-zinc-500 italic">{t.phase1Tag}</span>
          </div>
          <p className="text-[13px] text-zinc-300 leading-snug">
            {t.phase1Desc}
          </p>
          <p className="text-[13px] text-emerald-400 font-bold mt-1.5">{t.phase1Pips}</p>
        </div>

        {/* Phase 2 — 20h30 Discours Powell */}
        <div className="rounded-xl border-2 border-amber-400 bg-amber-400/8 p-3">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-[15px] font-bold text-amber-400">{t.phase2Title}</span>
            <span className="text-[11px] text-zinc-500 italic">{t.phase2Tag}</span>
          </div>
          <p className="text-[13px] text-zinc-300 leading-snug">
            {t.phase2DescA}<span className="font-bold text-red-400">{t.phase2DescB}</span>{t.phase2DescC}
          </p>
          <p className="text-[13px] text-red-400 font-bold mt-1.5">{t.phase2Pips}</p>
        </div>

        {/* Phase 3 — 21h00+ Trade ici */}
        <div className="rounded-xl border-2 border-emerald-400 bg-emerald-500/8 p-3">
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-[15px] font-bold text-emerald-400">{t.phase3Title}</span>
            <span className="text-[11px] text-zinc-500 italic">{t.phase3Tag}</span>
          </div>
          <p className="text-[13px] text-zinc-300 leading-snug">
            {t.phase3DescA}<span className="font-bold text-emerald-400">{t.phase3DescB}</span>{t.phase3DescC}
          </p>
        </div>

        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-2.5 mt-2">
          <p className="text-[13px] text-red-400 font-bold text-center">
            {t.warning}
          </p>
        </div>
      </div>
    </div>
  );
}
