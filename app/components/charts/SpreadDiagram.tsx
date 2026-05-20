interface SpreadDiagramProps {
  className?: string;
}

export function SpreadDiagram({ className = '' }: SpreadDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 ${className}`}>
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center">
        EUR / USD — les deux prix affichés en permanence
      </p>

      {/* 3 cartes BID / SPREAD / ASK — empilées sur mobile pour lisibilité */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-blue-500/10 border border-blue-500/40 rounded-xl p-3 text-center flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-0">
          <p className="text-[12px] sm:text-[11px] font-bold text-blue-400 uppercase tracking-wider">BID</p>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white sm:mt-1">1,0800</p>
          <span className="text-[11px] font-semibold text-blue-400 sm:hidden">↑ Tu vends ici</span>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/40 rounded-xl p-3 text-center flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-0">
          <p className="text-[12px] sm:text-[11px] font-bold text-blue-400 uppercase tracking-wider">SPREAD</p>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white sm:mt-1">5 pts</p>
          <span className="text-[11px] text-zinc-400 sm:hidden">Ask − Bid</span>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-3 text-center flex sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-0">
          <p className="text-[12px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider">ASK</p>
          <p className="text-xl sm:text-2xl font-mono font-bold text-white sm:mt-1">1,0805</p>
          <span className="text-[11px] font-semibold text-emerald-400 sm:hidden">↓ Tu achètes ici</span>
        </div>
      </div>

      {/* Flèches indicatives — desktop seulement (sur mobile l'info est intégrée dans chaque carte) */}
      <div className="hidden sm:grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-semibold text-blue-400">↑ Tu vends ici</span>
          <span className="text-[9px] text-zinc-600">Short (Sell)</span>
        </div>
        <div />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-semibold text-emerald-400">↓ Tu achètes ici</span>
          <span className="text-[9px] text-zinc-600">Long (Buy)</span>
        </div>
      </div>

      {/* Note explicative */}
      <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-center">
        <p className="text-sm text-zinc-300">
          Spread de <span className="font-bold text-blue-400">5 points</span> = coût payé immédiatement à l&apos;ouverture de chaque trade
        </p>
      </div>
    </div>
  );
}
