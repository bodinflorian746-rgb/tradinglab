export default function BOSFakeoutDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Faux BOS — la mèche perce, la clôture invalide
      </text>

      <rect x="560" y="40" width="220" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="670" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        Pattern invalidé — couper
      </text>

      <line x1="50" y1="150" x2="780" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x="55" y="143" fill="#ef4444" fontSize="10" fontWeight="600">HH 4 720$</text>

      {/* Path prix continu : montée → mèche perce → clôture sous → continuation baissière nette */}
      <path
        d="M70,310 L120,260 L160,225 L210,200 L260,185 L290,125 L300,170 L340,210 L390,260 L440,300 L490,335 L550,365 L620,380 L700,385"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougies vertes avant la cassure */}
      <line x1="180" y1="200" x2="180" y2="260" stroke="#059669" strokeWidth="1.5" />
      <rect x="173" y="210" width="14" height="45" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="230" y1="175" x2="230" y2="225" stroke="#059669" strokeWidth="1.5" />
      <rect x="223" y="185" width="14" height="35" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Bougie fakeout : mèche perce le niveau, petit corps rouge sous */}
      <line x1="290" y1="120" x2="290" y2="180" stroke="#b91c1c" strokeWidth="2" />
      <rect x="282" y="160" width="16" height="18" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />

      {/* Annotations mèche perce + clôture sous */}
      <line x1="296" y1="125" x2="380" y2="100" stroke="#f87171" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="380" y="92" width="160" height="18" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="460" y="104" fill="#d4d4d8" fontSize="9" textAnchor="middle">Mèche perce → 4 745$</text>

      <line x1="298" y1="170" x2="380" y2="195" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="380" y="190" width="160" height="18" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="460" y="202" fill="#d4d4d8" fontSize="9" textAnchor="middle">Clôture sous → 4 695$</text>

      {/* Bougies rouges de continuation baissière — bien marquées et descendantes */}
      <line x1="340" y1="195" x2="340" y2="245" stroke="#b91c1c" strokeWidth="2" />
      <rect x="332" y="205" width="16" height="35" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />

      <line x1="390" y1="245" x2="390" y2="295" stroke="#b91c1c" strokeWidth="2" />
      <rect x="382" y="255" width="16" height="35" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />

      <line x1="440" y1="285" x2="440" y2="335" stroke="#b91c1c" strokeWidth="2" />
      <rect x="432" y="295" width="16" height="35" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />

      <line x1="490" y1="320" x2="490" y2="365" stroke="#b91c1c" strokeWidth="2" />
      <rect x="482" y="330" width="16" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />

      <line x1="550" y1="350" x2="550" y2="385" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="543" y="358" width="14" height="22" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Annotation retour sous niveau — déplacée à gauche avec halo opaque */}
      <rect x="110" y="345" width="180" height="18" rx="4" fill="#09090b" />
      <rect x="110" y="345" width="180" height="18" rx="4" fill="#ef444433" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="357" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Retour franc sous le niveau</text>

      <text x="400" y="397" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Mèche à 4 745$, clôture à 4 695$ → BOS invalide, continuation baissière confirme
      </text>
    </svg>

    {/* MOBILE : faux BOS ─────────────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-red-400 text-center">Faux BOS — mèche perce, clôture invalide</p>
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/5 p-3">
        <p className="text-[13px] font-bold text-amber-400">Étape 1 — Mèche qui perce le HH (4 720 $)</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Le prix dépasse momentanément le sommet jusqu'à 4 745 $.</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">Étape 2 — Clôture sous le niveau (4 695 $)</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">La bougie clôture en dessous → BOS invalide.</p>
      </div>
      <div className="rounded-lg border-2 border-red-500/60 bg-red-500/10 p-3">
        <p className="text-[13px] font-bold text-red-400">Étape 3 — Continuation baissière confirme</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Retour franc sous le niveau → continuation baissière confirme le faux signal.</p>
      </div>
      <p className="text-[13px] text-amber-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        Toujours attendre la <span className="font-bold">clôture</span> pour valider un BOS.
      </p>
    </div>
    </div>
  );
}
