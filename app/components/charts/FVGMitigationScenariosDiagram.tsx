// Diagramme pédagogique : 3 cas de retour dans un FVG haussier
//   A. Rebond immédiat (FVG fresh, prix effleure le haut, repart)
//   B. Mitigation profonde + réaction (prix descend au bas du FVG, mais
//      mèche de rejet + reprise haussière)
//   C. Invalidation réelle (prix traverse le FVG, close en dessous, continue)
//
// Pédagogie : "FVG rempli ≠ FVG mort". La vraie invalidation = cassure
// structurelle propre + absence de réaction.
//
// Mobile-first : 3 cards stackées sur mobile, en ligne sur sm+. Labels HTML
// au-dessus de chaque SVG (jamais de texte minuscule dans les SVG).

interface FVGMitigationScenariosDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

interface ScenarioConfig {
  id:          "rebond" | "deep" | "invalidation";
  badge:       string;
  badgeClass:  string;
  title:       string;
  description: string;
  verdict:     string;
  verdictColor: "emerald" | "amber" | "red";
}

const SCENARIOS_FR: ScenarioConfig[] = [
  {
    id:           "rebond",
    badge:        "A",
    badgeClass:   "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
    title:        "Rebond immédiat",
    description:  "Le prix effleure le haut du FVG. Réaction nette, momentum fort.",
    verdict:      "FVG fresh — setup A+",
    verdictColor: "emerald",
  },
  {
    id:           "deep",
    badge:        "B",
    badgeClass:   "bg-amber-500/15 border-amber-500/40 text-amber-400",
    title:        "Mitigation profonde + réaction",
    description:  "Le prix remplit la zone en grande partie, puis rejette nettement.",
    verdict:      "FVG mitigé mais valide",
    verdictColor: "amber",
  },
  {
    id:           "invalidation",
    badge:        "C",
    badgeClass:   "bg-red-500/15 border-red-500/40 text-red-400",
    title:        "Invalidation réelle",
    description:  "Le prix traverse, close au-delà, structure cassée. Pas de réaction.",
    verdict:      "FVG invalidé — pas de trade",
    verdictColor: "red",
  },
];

const SCENARIOS_ES: ScenarioConfig[] = [
  {
    id:           "rebond",
    badge:        "A",
    badgeClass:   "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
    title:        "Rebote inmediato",
    description:  "El precio roza la parte alta del FVG. Reacción nítida, momentum fuerte.",
    verdict:      "FVG fresh — setup A+",
    verdictColor: "emerald",
  },
  {
    id:           "deep",
    badge:        "B",
    badgeClass:   "bg-amber-500/15 border-amber-500/40 text-amber-400",
    title:        "Mitigation profunda + reacción",
    description:  "El precio rellena la zona en gran parte, luego rechaza claramente.",
    verdict:      "FVG mitigado pero válido",
    verdictColor: "amber",
  },
  {
    id:           "invalidation",
    badge:        "C",
    badgeClass:   "bg-red-500/15 border-red-500/40 text-red-400",
    title:        "Invalidación real",
    description:  "El precio atraviesa, cierra más allá, estructura rota. Sin reacción.",
    verdict:      "FVG invalidado — no operar",
    verdictColor: "red",
  },
];

// ─── SVG par scénario ────────────────────────────────────────────────────────
//
// viewBox 200×130 (chaque mini-chart). Convention couleur :
//   - candles vertes : #10b981  · candles rouges : #ef4444
//   - FVG (zone amber/40 fill) : entre y=58 (top) et y=86 (bottom)
//   - prix : représenté par bougies + mèches simplifiées

function ScenarioSvg({ id }: { id: ScenarioConfig["id"] }) {
  const W = 200;
  const H = 130;
  const fvgTop    = 58;
  const fvgBottom = 86;

  // Bougies de l'impulsion initiale (laisse le FVG) — communes aux 3 cas
  const impulseCandles = (
    <>
      {/* candle 1 (base) */}
      <line x1="14" y1="98" x2="14" y2="108" stroke="#10b981" strokeWidth="1" />
      <rect x="11" y="98" width="6" height="6" fill="#10b981" rx="0.5" />
      {/* candle 2 (small green) */}
      <line x1="26" y1="92" x2="26" y2="100" stroke="#10b981" strokeWidth="1" />
      <rect x="23" y="92" width="6" height="6" fill="#10b981" rx="0.5" />
      {/* candle 3 (impulse — gros corps qui crée le FVG) */}
      <line x1="38" y1="46" x2="38" y2="94" stroke="#10b981" strokeWidth="1" />
      <rect x="35" y="46" width="6" height="40" fill="#10b981" rx="0.5" />
      {/* candle 4 (suite de l'impulsion, au-dessus du FVG) */}
      <line x1="50" y1="36" x2="50" y2="48" stroke="#10b981" strokeWidth="1" />
      <rect x="47" y="36" width="6" height="10" fill="#10b981" rx="0.5" />
      {/* candle 5 (consolidation, au-dessus du FVG) */}
      <line x1="62" y1="34" x2="62" y2="42" stroke="#10b981" strokeWidth="1" />
      <rect x="59" y="36" width="6" height="6" fill="#10b981" rx="0.5" />
    </>
  );

  // Zone FVG (bandeau ambre semi-transparent)
  const fvgZone = (
    <>
      <rect x="0" y={fvgTop} width={W} height={fvgBottom - fvgTop} fill="rgba(245,158,11,0.14)" />
      <line x1="0" y1={fvgTop}    x2={W} y2={fvgTop}    stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="0" y1={fvgBottom} x2={W} y2={fvgBottom} stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" />
    </>
  );

  // Pullback + résolution propre à chaque scénario
  let pullback: React.ReactNode = null;

  if (id === "rebond") {
    // Prix descend vers fvgTop, l'effleure (1 mèche), puis remonte fort
    pullback = (
      <>
        {/* descend doucement */}
        <line x1="78"  y1="38" x2="78"  y2="50" stroke="#ef4444" strokeWidth="1" />
        <rect x="75"  y="42" width="6" height="8" fill="#ef4444" rx="0.5" />
        <line x1="90"  y1="46" x2="90"  y2="58" stroke="#ef4444" strokeWidth="1" />
        <rect x="87"  y="50" width="6" height="8" fill="#ef4444" rx="0.5" />
        {/* candle qui touche le haut du FVG avec petite mèche */}
        <line x1="102" y1="54" x2="102" y2="66" stroke="#ef4444" strokeWidth="1" />
        <rect x="99"  y="54" width="6" height="8" fill="#ef4444" rx="0.5" />
        {/* rebond fort */}
        <line x1="114" y1="34" x2="114" y2="58" stroke="#10b981" strokeWidth="1" />
        <rect x="111" y="34" width="6" height="24" fill="#10b981" rx="0.5" />
        <line x1="126" y1="22" x2="126" y2="36" stroke="#10b981" strokeWidth="1" />
        <rect x="123" y="22" width="6" height="12" fill="#10b981" rx="0.5" />
        <line x1="138" y1="14" x2="138" y2="26" stroke="#10b981" strokeWidth="1" />
        <rect x="135" y="14" width="6" height="10" fill="#10b981" rx="0.5" />
      </>
    );
  } else if (id === "deep") {
    // Prix descend profondément dans le FVG (mèche au bottom), mais rejet
    pullback = (
      <>
        <line x1="78"  y1="38" x2="78"  y2="50" stroke="#ef4444" strokeWidth="1" />
        <rect x="75"  y="42" width="6" height="8" fill="#ef4444" rx="0.5" />
        <line x1="90"  y1="46" x2="90"  y2="62" stroke="#ef4444" strokeWidth="1" />
        <rect x="87"  y="52" width="6" height="10" fill="#ef4444" rx="0.5" />
        {/* candle de pierce : longue mèche vers le bas du FVG */}
        <line x1="102" y1="58" x2="102" y2="85" stroke="#ef4444" strokeWidth="1" />
        <rect x="99"  y="62" width="6" height="10" fill="#ef4444" rx="0.5" />
        {/* candle de rejet : mèche profonde dans le FVG, close en haut */}
        <line x1="114" y1="60" x2="114" y2="84" stroke="#10b981" strokeWidth="1" />
        <rect x="111" y="60" width="6" height="10" fill="#10b981" rx="0.5" />
        {/* reprise */}
        <line x1="126" y1="44" x2="126" y2="62" stroke="#10b981" strokeWidth="1" />
        <rect x="123" y="44" width="6" height="16" fill="#10b981" rx="0.5" />
        <line x1="138" y1="30" x2="138" y2="46" stroke="#10b981" strokeWidth="1" />
        <rect x="135" y="30" width="6" height="14" fill="#10b981" rx="0.5" />
      </>
    );
  } else {
    // Invalidation : traverse FVG complet, close au-delà, continue
    pullback = (
      <>
        <line x1="78"  y1="38" x2="78"  y2="52" stroke="#ef4444" strokeWidth="1" />
        <rect x="75"  y="42" width="6" height="10" fill="#ef4444" rx="0.5" />
        <line x1="90"  y1="50" x2="90"  y2="68" stroke="#ef4444" strokeWidth="1" />
        <rect x="87"  y="54" width="6" height="14" fill="#ef4444" rx="0.5" />
        {/* candle qui pierce le FVG avec gros corps rouge */}
        <line x1="102" y1="58" x2="102" y2="92" stroke="#ef4444" strokeWidth="1" />
        <rect x="99"  y="58" width="6" height="32" fill="#ef4444" rx="0.5" />
        {/* close net en-dessous du FVG */}
        <line x1="114" y1="88" x2="114" y2="106" stroke="#ef4444" strokeWidth="1" />
        <rect x="111" y="90" width="6" height="14" fill="#ef4444" rx="0.5" />
        {/* continuation baissière */}
        <line x1="126" y1="100" x2="126" y2="116" stroke="#ef4444" strokeWidth="1" />
        <rect x="123" y="104" width="6" height="12" fill="#ef4444" rx="0.5" />
        <line x1="138" y1="112" x2="138" y2="124" stroke="#ef4444" strokeWidth="1" />
        <rect x="135" y="116" width="6" height="8" fill="#ef4444" rx="0.5" />
      </>
    );
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="block">
      {/* Gridline médiane discrète */}
      <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#27272a" strokeWidth="0.4" strokeDasharray="2 4" />
      {fvgZone}
      {impulseCandles}
      {pullback}
    </svg>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────

export function FVGMitigationScenariosDiagram({ className = "", locale = "fr" }: FVGMitigationScenariosDiagramProps) {
  const SCENARIOS = locale === "es" ? SCENARIOS_ES : SCENARIOS_FR;
  const t = locale === "es"
    ? {
        title: "FVG alcista — 3 retornos posibles en la zona",
        legZone: "Zona FVG",
        legBull: "Vela alcista",
        legBear: "Vela bajista",
      }
    : {
        title: "FVG haussier — 3 retours possibles dans la zone",
        legZone: "Zone FVG",
        legBull: "Bougie haussière",
        legBear: "Bougie baissière",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/60">
        <p className="text-[14px] font-bold text-white text-center">
          {t.title}
        </p>
      </div>

      {/* 3 cards stackées mobile / row sm+ */}
      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SCENARIOS.map((s) => (
          <div key={s.id} className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 overflow-hidden">

            {/* Label header */}
            <div className="px-3 py-2 border-b border-zinc-800/60 flex items-center gap-2">
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[11px] font-black ${s.badgeClass}`}>
                {s.badge}
              </span>
              <p className="text-[12px] font-bold text-white">{s.title}</p>
            </div>

            {/* SVG */}
            <div className="px-2 py-2 bg-zinc-950">
              <ScenarioSvg id={s.id} />
            </div>

            {/* Description + verdict */}
            <div className="px-3 py-2.5 border-t border-zinc-800/60">
              <p className="text-[11px] text-zinc-400 leading-snug mb-1.5">
                {s.description}
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-wide ${
                s.verdictColor === "emerald" ? "text-emerald-400"
              : s.verdictColor === "amber"   ? "text-amber-400"
              :                                 "text-red-400"
              }`}>
                {s.verdict}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Légende des couleurs */}
      <div className="px-4 py-2.5 border-t border-zinc-800/60 flex flex-wrap gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-sm bg-amber-400/40 border border-amber-500/60" />
          <span className="text-[10px] text-zinc-500 font-medium">{t.legZone}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500 font-medium">{t.legBull}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500 font-medium">{t.legBear}</span>
        </div>
      </div>
    </div>
  );
}
