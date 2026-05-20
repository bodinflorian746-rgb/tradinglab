"use client";

import { useState } from "react";

type Choice = null | "sell" | "wait" | "buy";

type CD = {
  cx: number;
  wickTop: number;
  bodyTop: number;
  bodyBot: number;
  wickBot: number;
  bull: boolean;
};

function MiniCandle({ cx, wickTop, bodyTop, bodyBot, wickBot, bull }: CD) {
  const hw = 9;
  return (
    <g>
      <line x1={cx} y1={wickTop} x2={cx} y2={wickBot}
        stroke={bull ? "#059669" : "#dc2626"} strokeWidth="1.5" strokeLinecap="round" />
      <rect x={cx - hw} y={bodyTop} width={hw * 2}
        height={Math.max(bodyBot - bodyTop, 3)}
        fill={bull ? "#10b981" : "#ef4444"}
        stroke={bull ? "#059669" : "#dc2626"}
        strokeWidth="0.8" rx="1.5" />
    </g>
  );
}

const CONTEXT: CD[] = [
  { cx: 32,  wickTop: 52, bodyTop: 60, bodyBot: 96,  wickBot: 106, bull: true  },
  { cx: 60,  wickTop: 50, bodyTop: 58, bodyBot: 102, wickBot: 112, bull: false },
  { cx: 88,  wickTop: 60, bodyTop: 68, bodyBot: 118, wickBot: 152, bull: true  },
  { cx: 116, wickTop: 48, bodyTop: 56, bodyBot: 94,  wickBot: 104, bull: true  },
  { cx: 144, wickTop: 56, bodyTop: 64, bodyBot: 112, wickBot: 122, bull: false },
  { cx: 172, wickTop: 70, bodyTop: 78, bodyBot: 136, wickBot: 158, bull: true  },
  { cx: 200, wickTop: 68, bodyTop: 76, bodyBot: 114, wickBot: 124, bull: false },
];

const CURRENT: CD = { cx: 228, wickTop: 76, bodyTop: 84, bodyBot: 152, wickBot: 196, bull: false };

const REVEALED: Record<"sell" | "wait" | "buy", CD[]> = {
  sell: [
    { cx: 256, wickTop: 74, bodyTop: 82,  bodyBot: 144, wickBot: 158, bull: true  },
    { cx: 284, wickTop: 52, bodyTop: 60,  bodyBot: 106, wickBot: 118, bull: true  },
    { cx: 312, wickTop: 36, bodyTop: 44,  bodyBot: 88,  wickBot: 98,  bull: true  },
  ],
  wait: [
    { cx: 256, wickTop: 78, bodyTop: 86,  bodyBot: 142, wickBot: 160, bull: true  },
    { cx: 284, wickTop: 56, bodyTop: 64,  bodyBot: 108, wickBot: 120, bull: true  },
    { cx: 312, wickTop: 38, bodyTop: 46,  bodyBot: 92,  wickBot: 102, bull: true  },
  ],
  buy: [
    { cx: 256, wickTop: 150, bodyTop: 154, bodyBot: 182, wickBot: 196, bull: false },
    { cx: 284, wickTop: 162, bodyTop: 170, bodyBot: 196, wickBot: 208, bull: false },
    { cx: 312, wickTop: 168, bodyTop: 176, bodyBot: 200, wickBot: 212, bull: false },
  ],
};

const CONFIGS = {
  sell: {
    heading: "Stop hunt — tu t'es fait piéger",
    body: "La mèche était une chasse de liquidité. Les institutions cherchaient les stops des acheteurs sous le support pour entrer long. Le prix est immédiatement remonté. Vendre sur la mèche, c'est exactement ce que les institutions veulent que tu fasses.",
    color: "border-red-500/20 bg-red-500/5 text-red-400",
    badgeColor: "#ef4444",
    badgeText: "STOP HUNT — piégé ✗",
    badgeHw: 68,
    badgeCx: 284,
    badgeCy: 18,
  },
  wait: {
    heading: "Patience — bonne décision",
    body: "Tu as attendu la clôture de bougie. La bougie a clôturé au-dessus du support — la mèche était un stop hunt. En patientant, tu as évité le piège et tu peux maintenant chercher une entrée longue avec confirmation.",
    color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
    badgeColor: "#10b981",
    badgeText: "Bonne décision ✓",
    badgeHw: 56,
    badgeCx: 284,
    badgeCy: 18,
  },
  buy: {
    heading: "Trop tôt — vraie cassure",
    body: "Tu as acheté sans confirmation. Cette fois, le support a vraiment cédé — ton SL a été touché. Acheter sur une mèche sans signal de retournement est aussi risqué que vendre la cassure. Attends toujours la clôture et un signal.",
    color: "border-amber-400/20 bg-amber-400/5 text-amber-400",
    badgeColor: "#ef4444",
    badgeText: "SL touché — vraie cassure ✗",
    badgeHw: 78,
    badgeCx: 284,
    badgeCy: 18,
  },
} as const;

export function StopHuntInteractive({ className = "" }: { className?: string }) {
  const [choice, setChoice] = useState<Choice>(null);
  const cfg = choice ? CONFIGS[choice] : null;

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <style>{`
        @keyframes sh-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes sh-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sh-bad {
          0%        { opacity: 0; transform: translateX(0) translateY(4px); }
          15%       { opacity: 1; transform: translateX(-4px) translateY(0); }
          30%       { opacity: 1; transform: translateX(4px); }
          45%       { opacity: 1; transform: translateX(-3px); }
          60%       { opacity: 1; transform: translateX(3px); }
          75%, 100% { opacity: 1; transform: translateX(0); }
        }
        .sh-pulse { animation: sh-pulse 1.5s ease-in-out infinite; }
        .sh-fade  { animation: sh-fade 0.4s ease both; }
        .sh-bad   { animation: sh-bad 0.5s ease both; }
        @media (max-width: 640px) { .chart-detail-labels { display: none; } }
      `}</style>

      <svg
        width="100%"
        viewBox="0 0 580 230"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Support zone */}
        <rect x={10} y={148} width={475} height={14}
          fill="#3f3f4630" stroke="#71717a40" strokeWidth="0.8"
          strokeDasharray="4 3" rx="1" />

        {/* Support label — masqué sur mobile (le contexte de la question explique deja) */}
        <g className="chart-detail-labels">
          <rect x={12} y={150} width={54} height={11} rx="2"
            fill="#09090b" fillOpacity="0.85" />
          <text x={39} y={158} fontSize="7.5" fill="#71717a"
            textAnchor="middle" fontWeight="600">Support clé</text>
        </g>

        {/* Context candles */}
        {CONTEXT.map((c, i) => <MiniCandle key={i} {...c} />)}

        {/* Current ambiguous candle */}
        <MiniCandle {...CURRENT} />

        {/* Pulsing "?" when no choice */}
        {!choice && (
          <g className="sh-pulse">
            <circle cx={256} cy={100} r={12}
              fill="#60a5fa10" stroke="#60a5fa50" strokeWidth="1.2" />
            <text x={256} y={105} fontSize="11" fill="#60a5fa"
              textAnchor="middle" fontWeight="700">?</text>
          </g>
        )}

        {/* Revealed candles */}
        {choice && (
          <g className="sh-fade">
            {REVEALED[choice].map((c, i) => <MiniCandle key={i} {...c} />)}
          </g>
        )}

        {/* Result badge — masqué sur mobile (la carte explication ci-dessous le reprend) */}
        {choice && cfg && (
          <g className={`chart-detail-labels ${choice !== "wait" ? "sh-bad" : "sh-fade"}`}>
            <rect
              x={cfg.badgeCx - cfg.badgeHw} y={cfg.badgeCy - 10}
              width={cfg.badgeHw * 2} height={16} rx="3"
              fill="#09090b" fillOpacity="0.85"
            />
            <rect
              x={cfg.badgeCx - cfg.badgeHw} y={cfg.badgeCy - 10}
              width={cfg.badgeHw * 2} height={16} rx="3"
              fill={`${cfg.badgeColor}20`} stroke={`${cfg.badgeColor}50`} strokeWidth="0.8"
            />
            <text
              x={cfg.badgeCx} y={cfg.badgeCy + 2}
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
            Le support vient d'être percé par une longue mèche — que fais-tu ?
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setChoice("sell")}
              className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              Vendre maintenant (le support est cassé)
            </button>
            <button
              onClick={() => setChoice("wait")}
              className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              Attendre la clôture de bougie
            </button>
            <button
              onClick={() => setChoice("buy")}
              className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              Acheter (c'est sûrement un fakeout)
            </button>
          </div>
        </div>
      )}

      {/* Explanation + retry */}
      {choice && cfg && (
        <div className={`mx-4 mb-4 mt-1 border rounded-xl px-4 py-3 sh-fade ${cfg.color}`}>
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
