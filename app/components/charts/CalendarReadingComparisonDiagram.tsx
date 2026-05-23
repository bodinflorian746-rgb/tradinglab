export const CalendarReadingComparisonDiagram = ({ locale = "fr" }: { locale?: "fr" | "es" } = {}) => {
  const t = locale === "es"
    ? {
        title: "Leer un calendario — principiante vs pro",
        subtitle: "El mismo evento, leído de 2 formas radicalmente distintas",
        lectureDebutant: "LECTURA PRINCIPIANTE",
        lecturePro: "LECTURA PRO",
        jeVoisNews: "Veo una news importante.",
        jeSaisRisque: "→ Solo sé que hay un riesgo.",
        consensus: "Consenso :",
        precedent: "Anterior :",
        reviseA: "Revisado a :",
        jeLisContexte: "Leo el contexto completo.",
        revisionChange: "→ Sé que la revisión cambia todo.",
        passerAlerte: "Pasar de la alerta",
        auScenario: "al escenario completo",
        revisionForte: "REVISIÓN FUERTE",
        footer: "El calendario no te da una alerta. Te da un mapa.",
        mobileFleche: "↓ Pasar de la alerta al escenario completo ↓",
      }
    : {
        title: "Lire un calendrier — débutant vs pro",
        subtitle: "Le même événement, lu de 2 façons radicalement différentes",
        lectureDebutant: "LECTURE DÉBUTANT",
        lecturePro: "LECTURE PRO",
        jeVoisNews: "Je vois une news importante.",
        jeSaisRisque: "→ Je sais juste qu'il y a un risque.",
        consensus: "Consensus :",
        precedent: "Précédent :",
        reviseA: "Révisé à :",
        jeLisContexte: "Je lis le contexte complet.",
        revisionChange: "→ Je sais que la révision change tout.",
        passerAlerte: "Passer de l'alerte",
        auScenario: "au scénario complet",
        revisionForte: "RÉVISION FORTE",
        footer: "Le calendrier ne te donne pas une alerte. Il te donne une carte.",
        mobileFleche: "↓ Passer de l'alerte au scénario complet ↓",
      };
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 0 — Defs */}
      <defs>
        <marker id="arrow-comparison" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <polygon points="0 0, 12 6, 0 12" fill="#fbbf24" />
        </marker>
      </defs>

      {/* Layer 1 — Fond global */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        {t.title}
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        {t.subtitle}
      </text>

      {/* Layer 3 — Colonne gauche (Lecture débutant) */}
      <rect x="30" y="80" width="320" height="300" rx="8" fill="#09090b" fillOpacity="0.4" stroke="#f87171" strokeWidth="1.5" strokeOpacity="0.5" />
      <text x="190" y="105" fill="#f87171" fontSize="13" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">{t.lectureDebutant}</text>

      {/* Mockup ligne calendrier simplifié */}
      <rect x="50" y="130" width="280" height="80" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
      <text x="65" y="160" fill="#a1a1aa" fontSize="13" fontWeight="600">14:30</text>
      <text x="130" y="160" fill="#60a5fa" fontSize="12" fontWeight="700">USD</text>
      <text x="65" y="185" fill="#ef4444" fontSize="14" fontWeight="700">★★★</text>
      <text x="130" y="185" fill="white" fontSize="13" fontWeight="700">NFP</text>

      {/* Annotation sous le mockup */}
      <text x="190" y="255" fill="#d4d4d8" fontSize="12" textAnchor="middle">{t.jeVoisNews}</text>

      {/* Verdict bas de colonne */}
      <text x="190" y="345" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">{t.jeSaisRisque}</text>

      {/* Layer 4 — Colonne droite (Lecture pro) — contenus de base */}
      <rect x="450" y="80" width="320" height="300" rx="8" fill="#09090b" fillOpacity="0.4" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.5" />
      <text x="610" y="105" fill="#60a5fa" fontSize="13" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">{t.lecturePro}</text>

      {/* Mockup ligne calendrier enrichi */}
      <rect x="470" y="130" width="280" height="160" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />

      {/* Première ligne — mêmes éléments que débutant */}
      <text x="485" y="160" fill="#a1a1aa" fontSize="13" fontWeight="600">14:30</text>
      <text x="550" y="160" fill="#60a5fa" fontSize="12" fontWeight="700">USD</text>
      <text x="485" y="185" fill="#ef4444" fontSize="14" fontWeight="700">★★★</text>
      <text x="550" y="185" fill="white" fontSize="13" fontWeight="700">NFP</text>

      {/* Séparateur horizontal */}
      <line x1="485" y1="200" x2="735" y2="200" stroke="#3f3f46" strokeWidth="1" strokeOpacity="0.5" />

      {/* Données enrichies */}
      <text x="485" y="220" fill="#a1a1aa" fontSize="11">{t.consensus}</text>
      <text x="560" y="220" fill="#60a5fa" fontSize="12" fontWeight="700">200k</text>

      <text x="485" y="240" fill="#a1a1aa" fontSize="11">{t.precedent}</text>
      <text x="560" y="240" fill="#60a5fa" fontSize="12" fontWeight="700">250k</text>

      <text x="485" y="260" fill="#fbbf24" fontSize="11" fontWeight="700">{t.reviseA}</text>
      <text x="560" y="260" fill="#fbbf24" fontSize="12" fontWeight="700">170k</text>
      <text x="600" y="260" fill="#fbbf24" fontSize="13">⚠</text>

      {/* Annotation sous le mockup */}
      <text x="610" y="315" fill="#d4d4d8" fontSize="12" textAnchor="middle">{t.jeLisContexte}</text>

      {/* Verdict bas de colonne */}
      <text x="610" y="345" fill="#34d399" fontSize="11" fontStyle="italic" textAnchor="middle">{t.revisionChange}</text>

      {/* Layer 5 — Flèche centrale + labels */}
      <line x1="370" y1="230" x2="425" y2="230" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrow-comparison)" />
      <text x="400" y="210" fill="#fbbf24" fontSize="11" fontWeight="700" textAnchor="middle">{t.passerAlerte}</text>
      <text x="400" y="255" fill="#fbbf24" fontSize="11" fontWeight="700" textAnchor="middle">{t.auScenario}</text>

      {/* Layer 6 — Pastille "RÉVISION FORTE" (par-dessus le contenu droit) */}
      <rect x="620" y="248" width="110" height="18" rx="3" fill="#09090b" fillOpacity="0.95" />
      <text x="675" y="261" fill="#fbbf24" fontSize="9" fontWeight="700" textAnchor="middle">{t.revisionForte}</text>

      {/* Layer 7 — Pied de page */}
      <text x="400" y="420" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* ── MOBILE : 2 lectures comparées empilées ────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        {t.title}
      </p>

      {/* Lecture débutant */}
      <div className="rounded-xl border-2 border-red-500/50 bg-red-500/5 p-3">
        <p className="text-[12px] font-bold text-red-400 uppercase tracking-wider text-center">{t.lectureDebutant}</p>

        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-2.5 mt-2.5">
          <div className="flex items-center gap-3 text-[13px]">
            <span className="text-zinc-300 font-bold font-mono">14:30</span>
            <span className="text-blue-400 font-bold">USD</span>
            <span className="text-red-400 font-bold">★★★</span>
            <span className="text-white font-bold">NFP</span>
          </div>
        </div>

        <p className="text-[13px] text-zinc-300 text-center mt-2.5 leading-snug">
          {t.jeVoisNews}
        </p>
        <p className="text-[12px] text-zinc-400 italic text-center mt-1">
          {t.jeSaisRisque}
        </p>
      </div>

      {/* Flèche transition */}
      <p className="text-center text-amber-400 font-bold text-[13px] leading-snug">
        {t.mobileFleche}
      </p>

      {/* Lecture pro */}
      <div className="rounded-xl border-2 border-blue-400/50 bg-blue-500/5 p-3">
        <p className="text-[12px] font-bold text-blue-400 uppercase tracking-wider text-center">{t.lecturePro}</p>

        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-2.5 mt-2.5 space-y-2">
          <div className="flex items-center gap-3 text-[13px] pb-2 border-b border-zinc-700/60">
            <span className="text-zinc-300 font-bold font-mono">14:30</span>
            <span className="text-blue-400 font-bold">USD</span>
            <span className="text-red-400 font-bold">★★★</span>
            <span className="text-white font-bold">NFP</span>
          </div>
          <div className="space-y-1 text-[13px]">
            <div className="flex justify-between"><span className="text-zinc-400">{t.consensus}</span><span className="text-blue-400 font-bold font-mono">200k</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">{t.precedent}</span><span className="text-blue-400 font-bold font-mono">250k</span></div>
            <div className="flex justify-between"><span className="text-amber-400 font-bold">{t.reviseA}</span><span className="text-amber-400 font-bold font-mono">170k ⚠</span></div>
          </div>
        </div>

        <p className="text-[13px] text-zinc-300 text-center mt-2.5 leading-snug">
          {t.jeLisContexte}
        </p>
        <p className="text-[12px] text-emerald-400 italic text-center mt-1 font-semibold">
          {t.revisionChange}
        </p>
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug pt-2 border-t border-zinc-800">
        {t.footer}
      </p>
    </div>
    </div>
  );
};
