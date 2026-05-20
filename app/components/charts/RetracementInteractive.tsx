"use client";

import { useState } from "react";

type Choice = null | "fomo" | "patience" | "reverse";

const PATHS = {
  // Base: uptrend to HH, then retracement to decision point
  trend:      "M10,128 L45,100 L75,76 L100,56 L118,44",
  retracement:"M118,44 L138,60 L154,74 L166,84",

  // Revealed continuations
  patience_ext: "M166,84 L188,64 L216,44 L245,24 L258,18",
  fomo_drop:    "M166,84 L178,94 L192,108 L204,118",
  reverse_ext:  "M166,84 L188,64 L216,44 L245,24 L258,18",
} as const;

const CONFIGS = {
  fomo: {
    heading: "FOMO — entrée trop tôt",
    body: "Tu es entré pendant le retracement, pas au HL. Le prix a continué sa correction et touché ton Stop Loss. Les entrées en milieu de retracement manquent de précision — attends toujours la zone de structure.",
    color: "border-red-500/20 bg-red-500/5 text-red-400",
    badgeColor: "#ef4444",
    badgeText: "SL touché ✗",
    badgeCx: 204,
    badgeCy: 118,
  },
  patience: {
    heading: "Patience — entrée au HL",
    body: "Tu as attendu que le prix revienne sur le Higher Low structurel. Le retracement s'est arrêté là. Pin bar haussière validée. Le prix a continué dans le sens de la tendance. Trade gagnant.",
    color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    badgeColor: "#10b981",
    badgeText: "Trade gagnant ✓",
    badgeCx: 210,
    badgeCy: 24,
  },
  reverse: {
    heading: "Contre-tendance — vente dans une hausse",
    body: "Tu as vendu dans une tendance haussière. Le retracement était une correction normale — pas un retournement. Le prix a repris sa montée et touché ton Stop Loss. Ne jamais shorter sans rupture de structure claire.",
    color: "border-red-500/20 bg-red-500/5 text-red-400",
    badgeColor: "#ef4444",
    badgeText: "SL touché ✗",
    badgeCx: 210,
    badgeCy: 24,
  },
};

export function RetracementInteractive({ className = "" }: { className?: string }) {
  const [choice, setChoice] = useState<Choice>(null);

  const cfg = choice ? CONFIGS[choice] : null;

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <style>{`
        @keyframes ri-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes ri-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }
        .ri-pulse { animation: ri-pulse 1.5s ease-in-out infinite; }
        .ri-shake { animation: ri-shake 0.45s ease; }
        .ri-fade  { animation: ri-fade 0.4s ease; }
        @keyframes ri-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          .ri-pulse { animation: ri-pulse 1.5s ease-in-out infinite; }
          @media (max-width: 640px) { .chart-detail-labels { display: none; } }
        `}</style>
        <defs>
          <marker id="ri-arr-em" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4 Z" fill="#10b981" />
          </marker>
        </defs>

        {/* Always-visible: base trend + retracement */}
        <path d={PATHS.trend} stroke="#71717a" strokeWidth="1.8" strokeLinejoin="round" />
        <path d={PATHS.retracement} stroke="#71717a" strokeWidth="1.6" strokeLinejoin="round" strokeDasharray="5 3" />

        {/* HH dot — toujours visible */}
        <circle cx="118" cy="44" r="3" fill="#71717a" opacity="0.7" />

        {/* Labels HH/HL — masqués sur mobile */}
        <g className="chart-detail-labels">
          <rect x="146" y="79" width="26" height="14" rx="3" fill="#09090b" />
          <text x="152" y="90" fontSize="7" fill="#71717a" fontWeight="600" opacity="0.7">HL</text>

          <rect x="114" y="30" width="26" height="14" rx="3" fill="#09090b" />
          <text x="120" y="41" fontSize="7" fill="#71717a" fontWeight="600" opacity="0.8">HH</text>
        </g>

        {/* Decision point "?" — pulsing when no choice made */}
        {!choice && (
          <g className="ri-pulse">
            <circle cx="166" cy="84" r="10" fill="#60a5fa12" stroke="#60a5fa50" strokeWidth="1.2" />
            <text x="166" y="88" fontSize="10" fill="#60a5fa" textAnchor="middle" fontWeight="700">?</text>
          </g>
        )}

        {/* Entry dot on choice */}
        {choice && (
          <circle cx="166" cy="84" r="4"
            fill={choice === "patience" ? "#10b981" : "#ef444488"}
            opacity="0.9"
            className="ri-fade"
          />
        )}

        {/* Patience — continued rise */}
        {choice === "patience" && (
          <g className="ri-fade">
            <path d={PATHS.patience_ext} stroke="#10b981" strokeWidth="2.2" strokeLinejoin="round" />
            {/* Pin bar at HL */}
            <line x1="166" y1="76" x2="166" y2="92" stroke="#10b981" strokeWidth="1.5" />
            <rect x="163" y="80" width="6" height="6" rx="1" fill="#10b981" opacity="0.8" />
          </g>
        )}

        {/* FOMO — continues down, SL hit */}
        {choice === "fomo" && (
          <g className="ri-fade">
            <path d={PATHS.fomo_drop} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
          </g>
        )}

        {/* Reverse — price rises, SL hit */}
        {choice === "reverse" && (
          <g className="ri-fade">
            <path d={PATHS.reverse_ext} stroke="#71717a" strokeWidth="1.8" strokeLinejoin="round" />
          </g>
        )}

        {/* Result badge */}
        {choice && cfg && (
          <g className={choice !== "patience" ? "ri-shake ri-fade" : "ri-fade"}>
            <rect
              x={cfg.badgeCx - 38} y={cfg.badgeCy - 10}
              width="76" height="14" rx="3"
              fill={`${cfg.badgeColor}20`} stroke={`${cfg.badgeColor}50`} strokeWidth="0.8"
            />
            <text
              x={cfg.badgeCx} y={cfg.badgeCy + 1}
              fontSize="7.5" fill={cfg.badgeColor} textAnchor="middle" fontWeight="700"
            >
              {cfg.badgeText}
            </text>
          </g>
        )}
      </svg>

      {/* Buttons */}
      {!choice && (
        <div className="px-4 pb-4 pt-2">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2.5 text-center">
            Le prix retrace sur le HL — que fais-tu ?
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setChoice("fomo")}
              className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              Entrer maintenant
            </button>
            <button
              onClick={() => setChoice("patience")}
              className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              Attendre le HL
            </button>
            <button
              onClick={() => setChoice("reverse")}
              className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              Vendre ici
            </button>
          </div>
        </div>
      )}

      {/* Explanation + retry */}
      {choice && cfg && (
        <div className={`mx-4 mb-4 mt-1 border rounded-xl px-4 py-3 ${cfg.color}`}>
          <p className="text-xs font-semibold mb-1">{cfg.heading}</p>
          <p className="text-xs text-zinc-400 leading-relaxed">{cfg.body}</p>
          <button
            onClick={() => setChoice(null)}
            className="mt-2.5 text-[10px] font-semibold text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none underline underline-offset-2"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
