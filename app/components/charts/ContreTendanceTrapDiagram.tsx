// Diagramme : le piège de la contre-tendance (Leçon 2 multi-timeframe)
// Split screen — un breakout M15 propre qui va contre la tendance de fond Daily.

interface ContreTendanceTrapDiagramProps {
  className?: string;
}

export function ContreTendanceTrapDiagram({ className = "" }: ContreTendanceTrapDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        {/* Panneau gauche — DAILY */}
        <rect x="20" y="20" width="74" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="57" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">DAILY</text>
        <path d="M40,90 L78,72 L120,138 L165,108 L208,178 L252,142 L296,218 L322,250"
          stroke="#ef4444" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="78" cy="72" r="3.5" fill="#ef4444" />
        <circle cx="165" cy="108" r="3.5" fill="#ef4444" />
        <circle cx="252" cy="142" r="3.5" fill="#ef4444" />
        <text x="150" y="60" fill="#71717a" fontSize="9" fontWeight="600" textAnchor="middle">Structure LH / LL</text>
        <text x="300" y="282" fill="#ef4444" fontSize="24" opacity="0.4" textAnchor="middle">↘</text>
        <text x="172" y="302" fill="#a1a1aa" fontSize="10" textAnchor="middle">Tendance de fond baissière</text>

        {/* Séparateur */}
        <line x1="350" y1="52" x2="350" y2="270" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />

        {/* Panneau droit — M15 */}
        <rect x="372" y="20" width="64" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="404" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">M15</text>
        <line x1="378" y1="98" x2="676" y2="98" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
        <rect x="378" y="84" width="120" height="13" rx="3" fill="#09090b" />
        <text x="438" y="94" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Résistance H4  1.1760</text>
        <path d="M388,242 L442,214 L494,178 L548,122" stroke="#10b981" strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M548,122 L592,176 L634,218 L665,250" stroke="#ef4444" strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="548" cy="122" r="4.5" fill="#60a5fa" />
        <rect x="500" y="103" width="96" height="13" rx="3" fill="#09090b" />
        <text x="548" y="113" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="middle">Breakout  1.1752</text>
        <circle cx="665" cy="250" r="4" fill="#ef4444" />
        <rect x="584" y="232" width="78" height="13" rx="3" fill="#09090b" />
        <text x="623" y="242" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Rejet  1.1685</text>

        <text x="350" y="312" fill="#a1a1aa" fontSize="10" textAnchor="middle">
          Un breakout M15 qui monte contre la baisse du Daily finit en piège
        </text>
      </svg>

      {/* MOBILE : piège contre-tendance ────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">Piège contre-tendance</p>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">Daily ↘ — Structure LH/LL</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Tendance HTF baissière + prix rejeté sous résistance.</p>
        </div>
        <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
          <p className="text-[13px] font-bold text-amber-400">M15 ↗ — Breakout local tentant</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Cassure visuelle haussière sur petit timeframe.</p>
        </div>
        <p className="text-[13px] text-amber-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
          ⚠ Acheter ici = trader contre le HTF → piège.
        </p>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Breakout local M15 — visuellement tentant</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Tendance HTF baissière + rejet sous résistance</span>
        </div>
      </div>
    </div>
  );
}
