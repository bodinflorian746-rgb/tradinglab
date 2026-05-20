import { LESSONS, type LessonContent } from "@/lib/lessons";
import { LessonPage } from "@/app/components/LessonPage";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { SpreadDiagram } from "@/app/components/charts/SpreadDiagram";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";
import { BiasDiagram } from "@/app/components/charts/BiasDiagram";

interface Props {
  slug: string;
}

// ── Diagramme : Long vs Short ─────────────────────────────────────────────────
function LongShortDiagram() {
  const longPoints = "20,140 50,120 80,105 110,88 140,70 170,55 200,38";
  const shortPoints = "20,38 50,55 80,70 110,88 140,105 170,120 200,140";

  return (
    <>
      {/* ── DESKTOP (inchangé) ───────────────────────────────────────── */}
      <div className="hidden sm:grid mt-5 grid-cols-2 gap-3">
        {/* Long */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs font-bold text-emerald-400 mb-3 text-center">LONG — Buy ↑</p>
          <svg viewBox="0 0 220 160" className="w-full" aria-label="Trade Long">
            <line x1="15" y1="150" x2="210" y2="150" stroke="#3f3f46" strokeWidth="1" />
            <line x1="15" y1="10" x2="15" y2="150" stroke="#3f3f46" strokeWidth="1" />
            <polyline points={longPoints} fill="none" stroke="#059669" strokeWidth="2" strokeLinejoin="round" />
            <polygon points={`20,70 ${longPoints.split(" ").slice(4).join(" ")} 200,70`} fill="#059669" fillOpacity="0.08" />
            <circle cx="20" cy="140" r="4" fill="#34d399" />
            <line x1="20" y1="140" x2="200" y2="140" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" />
            <text x="24" y="138" fontSize="9" fill="#34d399" fontFamily="monospace">Entrée : 78 000 $</text>
            <circle cx="200" cy="38" r="4" fill="#34d399" />
            <text x="110" y="30" fontSize="9" fill="#34d399" fontFamily="monospace">Sortie : 81 000 $</text>
            <line x1="205" y1="38" x2="205" y2="140" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="208" y="94" fontSize="10" fill="#34d399" fontFamily="sans-serif" fontWeight="700">+3 000 $ de hausse</text>
            <path d="M105 80 L105 50 L100 56 M105 50 L110 56" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <p className="text-[10px] text-emerald-400/70 text-center mt-1">Prix monte → mouvement favorable</p>
        </div>

        {/* Short */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-xs font-bold text-red-400 mb-3 text-center">SHORT — Sell ↓</p>
          <svg viewBox="0 0 220 160" className="w-full" aria-label="Trade Short">
            <line x1="15" y1="150" x2="210" y2="150" stroke="#3f3f46" strokeWidth="1" />
            <line x1="15" y1="10" x2="15" y2="150" stroke="#3f3f46" strokeWidth="1" />
            <polyline points={shortPoints} fill="none" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" />
            <polygon points={`20,88 ${shortPoints.split(" ").slice(3).join(" ")} 200,88`} fill="#dc2626" fillOpacity="0.08" />
            <circle cx="20" cy="38" r="4" fill="#f87171" />
            <line x1="20" y1="38" x2="200" y2="38" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" />
            <text x="24" y="34" fontSize="9" fill="#f87171" fontFamily="monospace">Entrée : 78 000 $</text>
            <circle cx="200" cy="140" r="4" fill="#f87171" />
            <text x="100" y="155" fontSize="9" fill="#f87171" fontFamily="monospace">Sortie : 75 000 $</text>
            <line x1="205" y1="38" x2="205" y2="140" stroke="#f87171" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="208" y="94" fontSize="10" fill="#f87171" fontFamily="sans-serif" fontWeight="700">−3 000 $ de baisse</text>
            <path d="M105 70 L105 100 L100 94 M105 100 L110 94" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <p className="text-[10px] text-red-400/70 text-center mt-1">Prix baisse → mouvement favorable</p>
        </div>
      </div>

      {/* ── MOBILE (variante dédiée — pas de texte dans le SVG) ─────── */}
      <div className="sm:hidden mt-5 space-y-3">
        {/* LONG */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
          <p className="text-[13px] font-bold text-emerald-400 mb-3">LONG — Achat (Buy) ↑</p>
          <svg viewBox="0 0 200 80" className="w-full mb-3" fill="none" aria-label="Prix monte">
            <polyline points="10,70 40,58 80,46 120,34 160,22 190,10" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="70" r="5" fill="#10b981" />
            <circle cx="190" cy="10" r="5.5" fill="#10b981" />
          </svg>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Entrée</p>
              <p className="text-[15px] font-bold text-white font-mono">78 000 $</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2">
              <p className="text-[10px] text-emerald-400 uppercase tracking-wide">Sortie</p>
              <p className="text-[15px] font-bold text-emerald-400 font-mono">81 000 $</p>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-emerald-400">+3 000 $ — prix monte ✔</p>
        </div>

        {/* SHORT */}
        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
          <p className="text-[13px] font-bold text-red-400 mb-3">SHORT — Vente (Sell) ↓</p>
          <svg viewBox="0 0 200 80" className="w-full mb-3" fill="none" aria-label="Prix baisse">
            <polyline points="10,10 40,22 80,34 120,46 160,58 190,70" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="10" r="5" fill="#ef4444" />
            <circle cx="190" cy="70" r="5.5" fill="#ef4444" />
          </svg>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Entrée</p>
              <p className="text-[15px] font-bold text-white font-mono">78 000 $</p>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
              <p className="text-[10px] text-red-400 uppercase tracking-wide">Sortie</p>
              <p className="text-[15px] font-bold text-red-400 font-mono">75 000 $</p>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-red-400">−3 000 $ — prix baisse, profit pour toi ✔</p>
        </div>
      </div>
    </>
  );
}

// ── Diagramme : Take Profit ───────────────────────────────────────────────────
function TakeProfitDiagram() {
  return (
    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        Bitcoin — l'évolution du prix, avec et sans Take Profit
      </p>

      {/* ── DESKTOP (inchangé) ───────────────────────────────────────── */}
      <div className="hidden sm:grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-[10px] font-bold text-emerald-400 text-center mb-2">AVEC Take Profit</p>
          <svg viewBox="0 0 130 145" className="w-full" fill="none">
            <line x1="8" y1="35" x2="122" y2="35" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
            <text x="8" y="28" fontSize="8" fill="#10b981">TP — 84 000 $</text>
            <line x1="8" y1="108" x2="122" y2="108" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" />
            <text x="8" y="119" fontSize="8" fill="#a1a1aa">Entrée — 78 000 $</text>
            <polyline points="12,108 40,88 70,65 95,44 112,35" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="108" r="3.5" fill="#10b981" />
            <circle cx="112" cy="35" r="4" fill="#10b981" />
            <text x="65" y="143" fontSize="10" fill="#10b981" textAnchor="middle" fontWeight="700">+6 000 $ ✔</text>
          </svg>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-[10px] font-bold text-red-400 text-center mb-2">SANS Take Profit</p>
          <svg viewBox="0 0 130 145" className="w-full" fill="none">
            <line x1="8" y1="35" x2="122" y2="35" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <text x="8" y="28" fontSize="8" fill="#52525b">84 000 $ ignoré</text>
            <line x1="8" y1="108" x2="122" y2="108" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" />
            <text x="8" y="119" fontSize="8" fill="#a1a1aa">Entrée — 78 000 $</text>
            <polyline points="12,108 35,82 62,40 90,78 112,125" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="108" r="3.5" fill="#ef4444" />
            <circle cx="62" cy="40" r="3" fill="#f87171" opacity="0.85" />
            <text x="64" y="36" fontSize="7" fill="#f87171">+6 000 $</text>
            <circle cx="112" cy="125" r="4" fill="#ef4444" />
            <text x="65" y="143" fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="700">−3 000 $ ✖</text>
          </svg>
        </div>
      </div>

      {/* ── MOBILE (variante dédiée — pas de texte dans le SVG) ─────── */}
      <div className="sm:hidden space-y-3">
        {/* AVEC TP */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
          <p className="text-[13px] font-bold text-emerald-400 mb-3">AVEC Take Profit ✔</p>
          <svg viewBox="0 0 200 80" className="w-full mb-3" fill="none" aria-label="Prix atteint TP">
            <line x1="0" y1="8" x2="200" y2="8" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
            <line x1="0" y1="70" x2="200" y2="70" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
            <polyline points="10,70 50,52 100,32 150,18 190,8" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="70" r="5" fill="#10b981" />
            <circle cx="190" cy="8" r="6" fill="#10b981" />
          </svg>
          <div className="space-y-1.5 mb-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-zinc-400">Entrée</span>
              <span className="font-mono font-bold text-white">78 000 $</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-emerald-400">TP atteint</span>
              <span className="font-mono font-bold text-emerald-400">84 000 $</span>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-emerald-400 pt-2 border-t border-emerald-500/20">+6 000 $ sécurisé</p>
        </div>

        {/* SANS TP */}
        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
          <p className="text-[13px] font-bold text-red-400 mb-3">SANS Take Profit ✖</p>
          <svg viewBox="0 0 200 80" className="w-full mb-3" fill="none" aria-label="Prix monte puis chute">
            <line x1="0" y1="8" x2="200" y2="8" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <line x1="0" y1="40" x2="200" y2="40" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
            <polyline points="10,40 50,22 90,8 140,40 190,72" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="40" r="5" fill="#ef4444" />
            <circle cx="90" cy="8" r="4" fill="#fbbf24" opacity="0.85" />
            <circle cx="190" cy="72" r="6" fill="#ef4444" />
          </svg>
          <div className="space-y-1.5 mb-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-zinc-400">Entrée</span>
              <span className="font-mono font-bold text-white">78 000 $</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-amber-400">+6 000 $ ignoré</span>
              <span className="font-mono font-bold text-amber-400">84 000 $</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-red-400">Sortie au pire</span>
              <span className="font-mono font-bold text-red-400">75 000 $</span>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-red-400 pt-2 border-t border-red-500/20">−3 000 $ — gain effacé</p>
        </div>
      </div>
    </div>
  );
}

// ── Diagramme : Break Even ────────────────────────────────────────────────────
function BreakEvenDiagram() {
  return (
    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        Bitcoin — Comment activer le Break Even
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <span className="text-xs font-bold text-zinc-500 w-4 shrink-0">1</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">Entrée à 78 000 $ — SL initial à 75 000 $</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Distance entrée → SL : 3 000 $ — c'est ton risque (1R)</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1 text-center shrink-0">
            <p className="text-[9px] text-red-400 font-mono">−3 000 $</p>
            <p className="text-[8px] text-red-500/60">si stoppé</p>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-600">↓ le prix monte à 81 000 $ (+1R)</p>
        <div className="flex items-center gap-3 bg-amber-400/5 border border-amber-400/20 rounded-xl px-4 py-3">
          <span className="text-xs font-bold text-amber-400 w-4 shrink-0">2</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">Tu déplaces le SL de 75 000 $ → 78 000 $</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">SL = prix d'entrée = Break Even activé</p>
          </div>
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg px-2 py-1 text-center shrink-0">
            <p className="text-[9px] text-amber-400 font-bold">BE ✔</p>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-600">↓ deux scénarios possibles</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[10px] font-bold text-emerald-400">Prix continue ↑</p>
            <p className="text-[9px] text-zinc-400 mt-1">TP atteint à 84 000 $</p>
            <p className="text-xs font-bold text-emerald-400 mt-1">+6 000 $</p>
          </div>
          <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[10px] font-bold text-zinc-300">Prix redescend ↓</p>
            <p className="text-[9px] text-zinc-400 mt-1">BE déclenché à 78 000 $</p>
            <p className="text-xs font-bold text-zinc-400 mt-1">0 $ — sortie à l'entrée</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Diagramme : Grille de risque retail (barres superposées idéal + max) ──────
function RiskDiagram() {
  const tiers = [
    {
      capital: "300 €",
      idealPct: "3%",
      maxPct: "5%",
      idealBar: "22.5%",
      maxBar: "37.5%",
      euros: "9 € → 15 €",
      colorSolid: "#fbbf24",
      colorFade: "rgba(251,191,36,0.28)",
      textOnBar: "#18181b",
      labelColor: "#fbbf24",
      full: false,
    },
    {
      capital: "500 €",
      idealPct: "2-3%",
      maxPct: "5%",
      idealBar: "31.25%",
      maxBar: "62.5%",
      euros: "12 € → 25 €",
      colorSolid: "#fbbf24",
      colorFade: "rgba(251,191,36,0.28)",
      textOnBar: "#18181b",
      labelColor: "#fbbf24",
      full: false,
    },
    {
      capital: "1 000 €",
      idealPct: "2-3%",
      maxPct: "3%",
      idealBar: "62.5%",
      maxBar: "75%",
      euros: "25 € → 30 €",
      colorSolid: "#60a5fa",
      colorFade: "rgba(96,165,250,0.28)",
      textOnBar: "#0f172a",
      labelColor: "#60a5fa",
      full: false,
    },
    {
      capital: "2 000 €",
      idealPct: "2%",
      maxPct: null,
      idealBar: "100%",
      maxBar: "100%",
      euros: "40 €",
      colorSolid: "#10b981",
      colorFade: null,
      textOnBar: "#0f172a",
      labelColor: "#10b981",
      full: true,
    },
  ];

  return (
    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-1 text-center">
        Grille de risque — idéal et plafond par capital
      </p>
      <p className="text-[10px] text-zinc-500 text-center mb-4">
        Zone pleine = idéal · Zone transparente = max acceptable
      </p>
      {/* ── DESKTOP (inchangé : grille 3 colonnes serrée) ───────────── */}
      <div className="hidden sm:block space-y-2.5">
        {tiers.map((tier, i) => (
          <div key={i} className="grid grid-cols-[64px_1fr_100px] items-center gap-2">
            <div className="text-right">
              <span className="text-sm font-medium text-zinc-300">{tier.capital}</span>
            </div>
            <div className="relative h-8 bg-zinc-900 rounded overflow-hidden border border-zinc-800">
              {!tier.full && (
                <div
                  className="absolute inset-y-0 left-0 rounded"
                  style={{ width: tier.maxBar, backgroundColor: tier.colorFade ?? undefined }}
                />
              )}
              <div
                className="absolute inset-y-0 left-0 rounded flex items-center overflow-hidden"
                style={{ width: tier.idealBar, backgroundColor: tier.colorSolid }}
              >
                <span className="font-bold text-xs pl-2 whitespace-nowrap" style={{ color: tier.textOnBar }}>
                  {tier.idealPct}
                </span>
              </div>
              {!tier.full && (
                <div
                  className="absolute inset-y-0 flex items-center pl-2"
                  style={{ left: tier.idealBar }}
                >
                  <span className="text-xs whitespace-nowrap font-medium" style={{ color: tier.labelColor }}>
                    max {tier.maxPct}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right leading-tight">
              <span className="text-sm text-zinc-400 whitespace-nowrap">{tier.euros}</span>
              <span className="text-[10px] text-zinc-600 block">/ trade</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── MOBILE (chaque tier = carte verticale lisible) ──────────── */}
      <div className="sm:hidden space-y-3">
        {tiers.map((tier, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
            {/* Header carte : capital + euros */}
            <div className="flex items-baseline justify-between mb-2.5">
              <span className="text-[15px] font-bold text-white">{tier.capital}</span>
              <span className="text-[13px] text-zinc-400 font-mono">{tier.euros}<span className="text-[11px] text-zinc-600"> / trade</span></span>
            </div>
            {/* Barre superposée pleine largeur */}
            <div className="relative h-7 bg-zinc-950 rounded-md overflow-hidden border border-zinc-800">
              {!tier.full && (
                <div
                  className="absolute inset-y-0 left-0 rounded-md"
                  style={{ width: tier.maxBar, backgroundColor: tier.colorFade ?? undefined }}
                />
              )}
              <div
                className="absolute inset-y-0 left-0 rounded-md flex items-center"
                style={{ width: tier.idealBar, backgroundColor: tier.colorSolid }}
              >
                <span className="font-bold text-[12px] pl-2 whitespace-nowrap" style={{ color: tier.textOnBar }}>
                  {tier.idealPct}
                </span>
              </div>
            </div>
            {/* Légende sous la barre */}
            <div className="flex items-center gap-3 mt-2 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: tier.colorSolid }} />
                <span className="text-zinc-400">Idéal {tier.idealPct}</span>
              </span>
              {!tier.full && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: tier.colorFade ?? undefined }} />
                  <span className="text-zinc-400">Max {tier.maxPct}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-500 text-center mt-3 italic">
        Plus ton capital monte, plus tu protèges — c'est mathématique.
      </p>
    </div>
  );
}

// ── Diagramme : Biais psychologiques ─────────────────────────────────────────
function ErrorsDiagram() {
  return (
    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        Les 4 biais qui détruisent les comptes
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-xs font-bold text-red-400 mb-1">FOMO</p>
          <p className="text-[10px] text-zinc-400 leading-snug">Tu achètes en urgence — souvent au sommet, juste avant le retournement</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-xs font-bold text-red-400 mb-1">Vengeance</p>
          <p className="text-[10px] text-zinc-400 leading-snug">Tu perds → tu ré-ouvres immédiatement avec moins de lucidité</p>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
          <p className="text-xs font-bold text-blue-400 mb-1">Ancrage</p>
          <p className="text-[10px] text-zinc-400 leading-snug">Tu refuses de fermer le trade perdant — la perte s'aggrave</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
          <p className="text-xs font-bold text-amber-400 mb-1">Overconfidence</p>
          <p className="text-[10px] text-zinc-400 leading-snug">5 gains d'affilée → tu doubles la mise → le prochain efface tout</p>
        </div>
      </div>
    </div>
  );
}

// ── Rendu conditionnel des diagrammes ────────────────────────────────────────
function Diagram({ id }: { id: string }) {
  switch (id) {
    case "candle":      return <CandleAnatomyDiagram />;
    case "long-short":  return <LongShortDiagram />;
    case "spread":      return <SpreadDiagram />;
    case "takeprofit":  return <TakeProfitDiagram />;
    case "breakeven":   return <BreakEvenDiagram />;
    case "risk":        return <RiskDiagram />;
    case "errors":      return <ErrorsDiagram />;
    case "biaschart":   return <BiasDiagram />;
    default:            return null;
  }
}

// ── Rendu d'une section ───────────────────────────────────────────────────────
function SectionContent({ section }: { section: LessonContent["sections"][number] }) {
  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">{section.heading}</h2>
      <p className="text-zinc-300 leading-relaxed text-sm">{section.body}</p>

      {section.diagram && <Diagram id={section.diagram} />}

      {section.items && (
        <div className="space-y-2.5 mt-4">
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-emerald-400 shrink-0 mt-0.5"
              >
                <path
                  d="M2 7l3.5 3.5 6.5-6.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      )}

      {section.note && (
        <div className="mt-4 bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span>💰</span>
            <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
          </div>
          <p className="text-base text-zinc-300 leading-relaxed">{section.note}</p>
        </div>
      )}

      {section.table && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {section.table.headers.map((h, i) => (
                  <th
                    key={i}
                    className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wide pb-2.5 pr-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i} className="border-t border-zinc-800/80">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-2.5 pr-6 leading-snug ${
                        j === 0 ? "text-white font-medium text-sm" : "text-zinc-400 text-sm"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export function DebutantLessonView({ slug }: Props) {
  const level = LESSONS.find((l) => l.level === "debutant");
  if (!level) return null;

  const lessons = level.lessons;
  const idx = lessons.findIndex((l) => l.slug === slug);
  const lesson = lessons[idx];
  if (!lesson) return null;

  const prev =
    idx > 0
      ? { href: `/formations/debutant/${lessons[idx - 1].slug}`, label: `Leçon ${idx}` }
      : null;
  const next =
    idx < lessons.length - 1
      ? { href: `/formations/debutant/${lessons[idx + 1].slug}`, label: `Leçon ${idx + 2}` }
      : null;

  return (
    <LessonPage
      formationId="debutant"
      lessonId={lesson.slug}
      title={lesson.title}
      subtitle={lesson.introduction}
      duration={lesson.duration}
      lessonNumber={idx + 1}
      prev={prev}
      next={next}
    >
      {lesson.sections.map((section, i) => (
        <SectionContent key={i} section={section} />
      ))}

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">
          Révision
        </span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints points={lesson.keyPoints} />

      <LessonExercice
        description={lesson.exercise.title}
        steps={lesson.exercise.steps}
      />

      <LessonQuiz
        question={lesson.quiz.question}
        options={lesson.quiz.answers}
        correctIndex={lesson.quiz.correct}
        explanation={lesson.quiz.explanation}
        answerExplanations={lesson.quiz.answerExplanations}
      />
    </LessonPage>
  );
}
