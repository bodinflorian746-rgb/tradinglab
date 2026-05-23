export const NFPReportAnatomyDiagram = ({ locale = "fr" }: { locale?: "fr" | "es" } = {}) => {
  const t = locale === "es"
    ? {
        title: "Anatomía de un reporte NFP",
        subtitle: "Lo que ve el retail vs lo que lee el pro",
        headline: "HEADLINE NFP",
        headlineDesc: "La cifra mediatizada que todo el mundo mira",
        nfpCreations: "Creaciones de empleos",
        nfpHorsAgri: "(no agrícolas)",
        nfpHeadlineLabel: "La cifra headline",
        unemployment: "Tasa de desempleo",
        signalRalent: "Señal de",
        signalRalentLine2: "desaceleración",
        ahe: "Salarios horarios",
        aheMoyen: "(promedio)",
        aheInflation: "★ Inflación futura",
        participationTitle: "Tasa de participación",
        qualiteMarche: "Calidad del mercado",
        duTravail: "del trabajo",
        revisions: "⚠ REVISIONES DEL MES ANTERIOR",
        revisionsDesc: "Puede anular la sorpresa de la cifra actual — a menudo ignorada",
        reactionMultiActifs: "REACCIÓN MULTI-ACTIVOS (DXY FUERTE)",
        eurUsdReact: "↓ Dólar más fuerte",
        xauReact: "↓ Oro penalizado",
        nasdaqReact: "↓ Tech bajo presión",
        btcReact: "↓ Risk-off",
        footer: "El retail tradea el headline. El pro lee los 4 sub-datos + las revisiones.",
        mobileTitle: "Anatomía de un reporte NFP",
        niveau1: "Nivel 1 · HEADLINE NFP",
        niveau1Desc: "La cifra mediatizada que todo el mundo mira",
        niveau2: "Nivel 2 · 4 sub-datos detallados",
        nfpMobile: "Creaciones de empleos (no agri)",
        unemployMobile: "Tasa de desempleo",
        aheMobile: "Salarios horarios (inflación futura)",
        particMobile: "Calidad del mercado del trabajo",
        niveau3: "⚠ Nivel 3 · REVISIONES del mes anterior",
        niveau3Desc: "Puede anular la sorpresa de la cifra actual — a menudo ignorada",
        niveau4: "Nivel 4 · Reacción multi-activos (DXY fuerte)",
        footerMobile: "El retail tradea el headline. El pro lee los 4 sub-datos + las revisiones.",
      }
    : {
        title: "Anatomie d'un rapport NFP",
        subtitle: "Ce que voit le retail vs ce que lit le pro",
        headline: "HEADLINE NFP",
        headlineDesc: "Le chiffre médiatisé que tout le monde regarde",
        nfpCreations: "Créations d'emplois",
        nfpHorsAgri: "(hors agriculture)",
        nfpHeadlineLabel: "Le chiffre headline",
        unemployment: "Taux de chômage",
        signalRalent: "Signal de",
        signalRalentLine2: "ralentissement",
        ahe: "Salaires horaires",
        aheMoyen: "(moyens)",
        aheInflation: "★ Inflation future",
        participationTitle: "Taux de participation",
        qualiteMarche: "Qualité du marché",
        duTravail: "du travail",
        revisions: "⚠ RÉVISIONS DU MOIS PRÉCÉDENT",
        revisionsDesc: "Peut annuler la surprise du chiffre actuel — souvent ignorée",
        reactionMultiActifs: "RÉACTION MULTI-ACTIFS (DXY FORT)",
        eurUsdReact: "↓ Dollar plus fort",
        xauReact: "↓ Or pénalisé",
        nasdaqReact: "↓ Tech sous pression",
        btcReact: "↓ Risk-off",
        footer: "Le retail trade le headline. Le pro lit les 4 sous-données + les révisions.",
        mobileTitle: "Anatomie d'un rapport NFP",
        niveau1: "Niveau 1 · HEADLINE NFP",
        niveau1Desc: "Le chiffre médiatisé que tout le monde regarde",
        niveau2: "Niveau 2 · 4 sous-données détaillées",
        nfpMobile: "Créations d'emplois (hors agri)",
        unemployMobile: "Taux de chômage",
        aheMobile: "Salaires horaires (inflation future)",
        particMobile: "Qualité du marché du travail",
        niveau3: "⚠ Niveau 3 · RÉVISIONS du mois précédent",
        niveau3Desc: "Peut annuler la surprise du chiffre actuel — souvent ignorée",
        niveau4: "Niveau 4 · Réaction multi-actifs (DXY fort)",
        footerMobile: "Le retail trade le headline. Le pro lit les 4 sous-données + les révisions.",
      };
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 550"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrow-nfp" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill="#71717a" />
        </marker>
      </defs>

      {/* Layer 1 — Fond global */}
      <rect width="800" height="550" fill="#18181b" rx="8" />
      <rect width="800" height="550" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="30" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        {t.title}
      </text>
      <text x="400" y="50" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        {t.subtitle}
      </text>

      {/* Layer 4 — Niveau 1 — Headline NFP */}
      <rect x="200" y="80" width="400" height="60" rx="8" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="400" y="105" fill="#fbbf24" fontSize="14" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
        {t.headline}
      </text>
      <text x="400" y="125" fill="#d4d4d8" fontSize="11" fontStyle="italic" textAnchor="middle">
        {t.headlineDesc}
      </text>

      {/* Flèche Niveau 1 → Niveau 2 */}
      <line x1="400" y1="140" x2="400" y2="170" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-nfp)" />

      {/* Layer 5 — Niveau 2 — 4 cartes sous-données */}

      {/* Carte 1 — NFP (blue-400) */}
      <rect x="35" y="180" width="170" height="110" rx="6" fill="#27272a" stroke="#60a5fa" strokeWidth="1.5" />
      <text x="120" y="210" fill="#60a5fa" fontSize="14" fontWeight="800" textAnchor="middle">NFP</text>
      <text x="120" y="232" fill="#d4d4d8" fontSize="10" textAnchor="middle">{t.nfpCreations}</text>
      <text x="120" y="246" fill="#a1a1aa" fontSize="9" textAnchor="middle">{t.nfpHorsAgri}</text>
      <text x="120" y="272" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{t.nfpHeadlineLabel}</text>

      {/* Carte 2 — Unemployment Rate (zinc) */}
      <rect x="225" y="180" width="170" height="110" rx="6" fill="#27272a" stroke="#71717a" strokeWidth="1.5" />
      <text x="310" y="210" fill="#d4d4d8" fontSize="13" fontWeight="800" textAnchor="middle">UNEMPLOYMENT</text>
      <text x="310" y="232" fill="#d4d4d8" fontSize="10" textAnchor="middle">{t.unemployment}</text>
      <text x="310" y="265" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{t.signalRalent}</text>
      <text x="310" y="278" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{t.signalRalentLine2}</text>

      {/* Carte 3 — AHE (emerald-400) */}
      <rect x="415" y="180" width="170" height="110" rx="6" fill="#27272a" stroke="#34d399" strokeWidth="1.5" />
      <text x="500" y="210" fill="#34d399" fontSize="14" fontWeight="800" textAnchor="middle">AHE</text>
      <text x="500" y="232" fill="#d4d4d8" fontSize="10" textAnchor="middle">{t.ahe}</text>
      <text x="500" y="246" fill="#a1a1aa" fontSize="9" textAnchor="middle">{t.aheMoyen}</text>
      <text x="500" y="272" fill="#fbbf24" fontSize="9" fontWeight="700" textAnchor="middle">{t.aheInflation}</text>

      {/* Carte 4 — Participation Rate (zinc) */}
      <rect x="605" y="180" width="170" height="110" rx="6" fill="#27272a" stroke="#71717a" strokeWidth="1.5" />
      <text x="690" y="210" fill="#d4d4d8" fontSize="13" fontWeight="800" textAnchor="middle">PARTICIPATION</text>
      <text x="690" y="232" fill="#d4d4d8" fontSize="10" textAnchor="middle">{t.participationTitle}</text>
      <text x="690" y="265" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{t.qualiteMarche}</text>
      <text x="690" y="278" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{t.duTravail}</text>

      {/* Flèche Niveau 2 → Niveau 3 */}
      <line x1="400" y1="290" x2="400" y2="320" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-nfp)" />

      {/* Layer 6 — Niveau 3 — Révisions */}
      <rect x="100" y="330" width="600" height="50" rx="6" fill="#27272a" stroke="#f87171" strokeWidth="2" />
      <text x="400" y="355" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
        {t.revisions}
      </text>
      <text x="400" y="372" fill="#d4d4d8" fontSize="10" fontStyle="italic" textAnchor="middle">
        {t.revisionsDesc}
      </text>

      {/* Flèche Niveau 3 → Niveau 4 */}
      <line x1="400" y1="380" x2="400" y2="410" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-nfp)" />

      {/* Layer 7 — Niveau 4 — Réaction multi-actifs */}
      <text x="400" y="410" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        {t.reactionMultiActifs}
      </text>

      {/* Carte EUR/USD */}
      <rect x="35" y="420" width="170" height="60" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1" />
      <text x="120" y="445" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle">EUR/USD</text>
      <text x="120" y="465" fill="#d4d4d8" fontSize="10" textAnchor="middle">{t.eurUsdReact}</text>

      {/* Carte XAU/USD */}
      <rect x="225" y="420" width="170" height="60" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1" />
      <text x="310" y="445" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle">XAU/USD</text>
      <text x="310" y="465" fill="#d4d4d8" fontSize="10" textAnchor="middle">{t.xauReact}</text>

      {/* Carte Nasdaq */}
      <rect x="415" y="420" width="170" height="60" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1" />
      <text x="500" y="445" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle">NASDAQ</text>
      <text x="500" y="465" fill="#d4d4d8" fontSize="10" textAnchor="middle">{t.nasdaqReact}</text>

      {/* Carte BTC/USD */}
      <rect x="605" y="420" width="170" height="60" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1" />
      <text x="690" y="445" fill="#f87171" fontSize="13" fontWeight="800" textAnchor="middle">BTC/USD</text>
      <text x="690" y="465" fill="#d4d4d8" fontSize="10" textAnchor="middle">{t.btcReact}</text>

      {/* Layer 8 — Pied de page */}
      <text x="400" y="520" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* ── MOBILE : anatomie NFP en 4 niveaux ─────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        {t.mobileTitle}
      </p>
      <p className="text-[12px] text-zinc-400 italic text-center -mt-1">
        {t.subtitle}
      </p>

      {/* Niveau 1 — Headline */}
      <div className="rounded-xl border-2 border-amber-400 bg-amber-400/8 p-3">
        <p className="text-[14px] font-bold text-amber-400 uppercase tracking-wider">{t.niveau1}</p>
        <p className="text-[13px] text-zinc-300 mt-1 leading-snug italic">
          {t.niveau1Desc}
        </p>
      </div>
      <p className="text-center text-zinc-600 text-[14px]">↓</p>

      {/* Niveau 2 — 4 sous-données en 2 colonnes */}
      <p className="text-[12px] text-zinc-500 uppercase tracking-wider font-bold text-center -mb-1">
        {t.niveau2}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-blue-400/40 bg-blue-500/5 p-2.5">
          <p className="text-[13px] font-bold text-blue-400">NFP</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{t.nfpMobile}</p>
        </div>
        <div className="rounded-lg border border-zinc-600 bg-zinc-800/40 p-2.5">
          <p className="text-[13px] font-bold text-zinc-200">UNEMPLOY.</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{t.unemployMobile}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-2.5">
          <p className="text-[13px] font-bold text-emerald-400">AHE ★</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{t.aheMobile}</p>
        </div>
        <div className="rounded-lg border border-zinc-600 bg-zinc-800/40 p-2.5">
          <p className="text-[13px] font-bold text-zinc-200">PARTICIP.</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{t.particMobile}</p>
        </div>
      </div>
      <p className="text-center text-zinc-600 text-[14px]">↓</p>

      {/* Niveau 3 — Révisions */}
      <div className="rounded-xl border-2 border-red-500/50 bg-red-500/5 p-3">
        <p className="text-[14px] font-bold text-red-400">{t.niveau3}</p>
        <p className="text-[13px] text-zinc-300 mt-1 leading-snug italic">
          {t.niveau3Desc}
        </p>
      </div>
      <p className="text-center text-zinc-600 text-[14px]">↓</p>

      {/* Niveau 4 — Réaction multi-actifs */}
      <p className="text-[12px] font-bold text-amber-400 uppercase tracking-wider text-center">
        {t.niveau4}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: "EUR/USD", desc: t.eurUsdReact },
          { name: "XAU/USD", desc: t.xauReact },
          { name: "NASDAQ", desc: t.nasdaqReact },
          { name: "BTC/USD", desc: t.btcReact },
        ].map((a) => (
          <div key={a.name} className="rounded-lg border border-red-500/30 bg-red-500/5 p-2 text-center">
            <p className="text-[13px] font-bold text-red-400">{a.name}</p>
            <p className="text-[11px] text-zinc-300 leading-tight mt-0.5">{a.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug pt-2 border-t border-zinc-800">
        {t.footerMobile}
      </p>
    </div>
    </div>
  );
};
