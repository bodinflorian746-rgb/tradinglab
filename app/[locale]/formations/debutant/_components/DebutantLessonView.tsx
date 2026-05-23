import { LESSONS, type LessonContent } from "@/lib/lessons";
import { LESSONS_ES } from "@/lib/lessons-es";
import { LessonPage } from "@/app/components/LessonPage";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { SpreadDiagram } from "@/app/components/charts/SpreadDiagram";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";
import { BiasDiagram } from "@/app/components/charts/BiasDiagram";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

interface Props {
  slug: string;
  locale?: string;
}

// ── i18n des libellés visibles dans les diagrammes inline ────────────────────
type DiagLabels = {
  longShort: {
    longTitle:     string;
    shortTitle:    string;
    entry:         string;
    exit:          string;
    bullishCaption: string;
    bearishCaption: string;
    longRise:      string;
    shortDrop:     string;
    longBuyMobile: string;
    shortSellMobile: string;
    profitForYou:  string;
    long3kRise:    string;
    short3kDrop:   string;
  };
  takeProfit: {
    headerCaption: string;
    withTP:        string;
    withoutTP:     string;
    tpLabel:       string;
    entryLabel:    string;
    ignored84k:    string;
    plus6k:        string;
    minus3k:       string;
    profitCheck:   string;
    failureMark:   string;
    secured:       string;
    erased:        string;
    entry:         string;
    tpReached:     string;
    ignoredAt:     string;
    worstExit:     string;
  };
  breakEven: {
    headerCaption: string;
    step1Title:    string;
    step1Hint:     string;
    step1Tag:      string;
    arrow1:        string;
    step2Title:    string;
    step2Hint:     string;
    step2Tag:      string;
    arrow2:        string;
    continueTitle: string;
    continueHint:  string;
    continueGain:  string;
    fallbackTitle: string;
    fallbackHint:  string;
    fallbackGain:  string;
  };
  risk: {
    headerTitle:    string;
    headerSubtitle: string;
    perTrade:       string;
    legendIdeal:    string;
    legendMax:      string;
    maxPrefix:      string;
    footer:         string;
  };
  errors: {
    title:          string;
    fomo:           string;
    fomoBody:       string;
    vengeance:      string;
    vengeanceBody:  string;
    anchor:         string;
    anchorBody:     string;
    overconfidence: string;
    overconfBody:   string;
  };
  // Pour le bloc note (encadré "Réalité du retail" dans SectionContent)
  retailReality:   string;
  // Pour la séparation Révision
  reviewLabel:     string;
  // Pour les prev/next button label
  lessonPrefix:    string;
};

const FR_DIAG_LABELS: DiagLabels = {
  longShort: {
    longTitle:        "LONG — Buy ↑",
    shortTitle:       "SHORT — Sell ↓",
    entry:            "Entrée : 78 000 $",
    exit:             "Sortie : 81 000 $",
    bullishCaption:   "Prix monte → mouvement favorable",
    bearishCaption:   "Prix baisse → mouvement favorable",
    longRise:         "+3 000 $ de hausse",
    shortDrop:        "−3 000 $ de baisse",
    longBuyMobile:    "LONG — Achat (Buy) ↑",
    shortSellMobile:  "SHORT — Vente (Sell) ↓",
    profitForYou:     "profit pour toi",
    long3kRise:       "+3 000 $ — prix monte ✔",
    short3kDrop:      "−3 000 $ — prix baisse, profit pour toi ✔",
  },
  takeProfit: {
    headerCaption: "Bitcoin — l'évolution du prix, avec et sans Take Profit",
    withTP:        "AVEC Take Profit",
    withoutTP:     "SANS Take Profit",
    tpLabel:       "TP — 84 000 $",
    entryLabel:    "Entrée — 78 000 $",
    ignored84k:    "84 000 $ ignoré",
    plus6k:        "+6 000 $",
    minus3k:       "−3 000 $",
    profitCheck:   "+6 000 $ ✔",
    failureMark:   "−3 000 $ ✖",
    secured:       "+6 000 $ sécurisé",
    erased:        "−3 000 $ — gain effacé",
    entry:         "Entrée",
    tpReached:     "TP atteint",
    ignoredAt:     "+6 000 $ ignoré",
    worstExit:     "Sortie au pire",
  },
  breakEven: {
    headerCaption: "Bitcoin — Comment activer le Break Even",
    step1Title:    "Entrée à 78 000 $ — SL initial à 75 000 $",
    step1Hint:     "Distance entrée → SL : 3 000 $ — c'est ton risque (1R)",
    step1Tag:      "−3 000 $",
    arrow1:        "↓ le prix monte à 81 000 $ (+1R)",
    step2Title:    "Tu déplaces le SL de 75 000 $ → 78 000 $",
    step2Hint:     "SL = prix d'entrée = Break Even activé",
    step2Tag:      "BE ✔",
    arrow2:        "↓ deux scénarios possibles",
    continueTitle: "Prix continue ↑",
    continueHint:  "TP atteint à 84 000 $",
    continueGain:  "+6 000 $",
    fallbackTitle: "Prix redescend ↓",
    fallbackHint:  "BE déclenché à 78 000 $",
    fallbackGain:  "0 $ — sortie à l'entrée",
  },
  risk: {
    headerTitle:    "Grille de risque — idéal et plafond par capital",
    headerSubtitle: "Zone pleine = idéal · Zone transparente = max acceptable",
    perTrade:       "/ trade",
    legendIdeal:    "Idéal",
    legendMax:      "Max",
    maxPrefix:      "max",
    footer:         "Plus ton capital monte, plus tu protèges — c'est mathématique.",
  },
  errors: {
    title:          "Les 4 biais qui détruisent les comptes",
    fomo:           "FOMO",
    fomoBody:       "Tu achètes en urgence — souvent au sommet, juste avant le retournement",
    vengeance:      "Vengeance",
    vengeanceBody:  "Tu perds → tu ré-ouvres immédiatement avec moins de lucidité",
    anchor:         "Ancrage",
    anchorBody:     "Tu refuses de fermer le trade perdant — la perte s'aggrave",
    overconfidence: "Overconfidence",
    overconfBody:   "5 gains d'affilée → tu doubles la mise → le prochain efface tout",
  },
  retailReality: "Réalité du retail",
  reviewLabel:   "Révision",
  lessonPrefix:  "Leçon",
};

const ES_DIAG_LABELS: DiagLabels = {
  longShort: {
    longTitle:        "LONG — Buy ↑",
    shortTitle:       "SHORT — Sell ↓",
    entry:            "Entrada: 78 000 $",
    exit:             "Salida: 81 000 $",
    bullishCaption:   "Precio sube → movimiento favorable",
    bearishCaption:   "Precio baja → movimiento favorable",
    longRise:         "+3 000 $ de subida",
    shortDrop:        "−3 000 $ de bajada",
    longBuyMobile:    "LONG — Compra (Buy) ↑",
    shortSellMobile:  "SHORT — Venta (Sell) ↓",
    profitForYou:     "profit para ti",
    long3kRise:       "+3 000 $ — precio sube ✔",
    short3kDrop:      "−3 000 $ — precio baja, profit para ti ✔",
  },
  takeProfit: {
    headerCaption: "Bitcoin — la evolución del precio, con y sin Take Profit",
    withTP:        "CON Take Profit",
    withoutTP:     "SIN Take Profit",
    tpLabel:       "TP — 84 000 $",
    entryLabel:    "Entrada — 78 000 $",
    ignored84k:    "84 000 $ ignorado",
    plus6k:        "+6 000 $",
    minus3k:       "−3 000 $",
    profitCheck:   "+6 000 $ ✔",
    failureMark:   "−3 000 $ ✖",
    secured:       "+6 000 $ asegurado",
    erased:        "−3 000 $ — ganancia borrada",
    entry:         "Entrada",
    tpReached:     "TP alcanzado",
    ignoredAt:     "+6 000 $ ignorado",
    worstExit:     "Salida en el peor momento",
  },
  breakEven: {
    headerCaption: "Bitcoin — Cómo activar el Break Even",
    step1Title:    "Entrada a 78 000 $ — SL inicial a 75 000 $",
    step1Hint:     "Distancia entrada → SL: 3 000 $ — es tu riesgo (1R)",
    step1Tag:      "−3 000 $",
    arrow1:        "↓ el precio sube a 81 000 $ (+1R)",
    step2Title:    "Mueves el SL de 75 000 $ → 78 000 $",
    step2Hint:     "SL = precio de entrada = Break Even activado",
    step2Tag:      "BE ✔",
    arrow2:        "↓ dos escenarios posibles",
    continueTitle: "Precio sigue ↑",
    continueHint:  "TP alcanzado a 84 000 $",
    continueGain:  "+6 000 $",
    fallbackTitle: "Precio vuelve a bajar ↓",
    fallbackHint:  "BE activado a 78 000 $",
    fallbackGain:  "0 $ — salida en la entrada",
  },
  risk: {
    headerTitle:    "Grilla de riesgo — ideal y tope por capital",
    headerSubtitle: "Zona llena = ideal · Zona transparente = máximo aceptable",
    perTrade:       "/ trade",
    legendIdeal:    "Ideal",
    legendMax:      "Máx",
    maxPrefix:      "máx",
    footer:         "Cuanto más sube tu capital, más proteges — es matemático.",
  },
  errors: {
    title:          "Los 4 sesgos que destruyen las cuentas",
    fomo:           "FOMO",
    fomoBody:       "Compras con urgencia — a menudo en el techo, justo antes del reversal",
    vengeance:      "Revenge trading",
    vengeanceBody:  "Pierdes → re-abres inmediatamente con menos lucidez",
    anchor:         "Anclaje",
    anchorBody:     "Te niegas a cerrar el trade perdedor — la pérdida se agrava",
    overconfidence: "Overconfidence",
    overconfBody:   "5 ganancias seguidas → duplicas la apuesta → la próxima borra todo",
  },
  retailReality: "Realidad del retail",
  reviewLabel:   "Repaso",
  lessonPrefix:  "Lección",
};

function getDiagLabels(locale: Locale): DiagLabels {
  return locale === "es" ? ES_DIAG_LABELS : FR_DIAG_LABELS;
}

// ── Diagramme : Long vs Short ─────────────────────────────────────────────────
function LongShortDiagram({ t }: { t: DiagLabels["longShort"] }) {
  const longPoints = "20,140 50,120 80,105 110,88 140,70 170,55 200,38";
  const shortPoints = "20,38 50,55 80,70 110,88 140,105 170,120 200,140";

  return (
    <>
      {/* ── DESKTOP (inchangé) ───────────────────────────────────────── */}
      <div className="hidden sm:grid mt-5 grid-cols-2 gap-3">
        {/* Long */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs font-bold text-emerald-400 mb-3 text-center">{t.longTitle}</p>
          <svg viewBox="0 0 220 160" className="w-full" aria-label="Trade Long">
            <line x1="15" y1="150" x2="210" y2="150" stroke="#3f3f46" strokeWidth="1" />
            <line x1="15" y1="10" x2="15" y2="150" stroke="#3f3f46" strokeWidth="1" />
            <polyline points={longPoints} fill="none" stroke="#059669" strokeWidth="2" strokeLinejoin="round" />
            <polygon points={`20,70 ${longPoints.split(" ").slice(4).join(" ")} 200,70`} fill="#059669" fillOpacity="0.08" />
            <circle cx="20" cy="140" r="4" fill="#34d399" />
            <line x1="20" y1="140" x2="200" y2="140" stroke="#34d399" strokeWidth="1" strokeDasharray="4,3" />
            <text x="24" y="138" fontSize="9" fill="#34d399" fontFamily="monospace">{t.entry}</text>
            <circle cx="200" cy="38" r="4" fill="#34d399" />
            <text x="110" y="30" fontSize="9" fill="#34d399" fontFamily="monospace">{t.exit}</text>
            <line x1="205" y1="38" x2="205" y2="140" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="208" y="94" fontSize="10" fill="#34d399" fontFamily="sans-serif" fontWeight="700">{t.longRise}</text>
            <path d="M105 80 L105 50 L100 56 M105 50 L110 56" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <p className="text-[10px] text-emerald-400/70 text-center mt-1">{t.bullishCaption}</p>
        </div>

        {/* Short */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-xs font-bold text-red-400 mb-3 text-center">{t.shortTitle}</p>
          <svg viewBox="0 0 220 160" className="w-full" aria-label="Trade Short">
            <line x1="15" y1="150" x2="210" y2="150" stroke="#3f3f46" strokeWidth="1" />
            <line x1="15" y1="10" x2="15" y2="150" stroke="#3f3f46" strokeWidth="1" />
            <polyline points={shortPoints} fill="none" stroke="#dc2626" strokeWidth="2" strokeLinejoin="round" />
            <polygon points={`20,88 ${shortPoints.split(" ").slice(3).join(" ")} 200,88`} fill="#dc2626" fillOpacity="0.08" />
            <circle cx="20" cy="38" r="4" fill="#f87171" />
            <line x1="20" y1="38" x2="200" y2="38" stroke="#f87171" strokeWidth="1" strokeDasharray="4,3" />
            <text x="24" y="34" fontSize="9" fill="#f87171" fontFamily="monospace">{t.entry}</text>
            <circle cx="200" cy="140" r="4" fill="#f87171" />
            <text x="100" y="155" fontSize="9" fill="#f87171" fontFamily="monospace">{t.exit.replace("81 000", "75 000")}</text>
            <line x1="205" y1="38" x2="205" y2="140" stroke="#f87171" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="208" y="94" fontSize="10" fill="#f87171" fontFamily="sans-serif" fontWeight="700">{t.shortDrop}</text>
            <path d="M105 70 L105 100 L100 94 M105 100 L110 94" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <p className="text-[10px] text-red-400/70 text-center mt-1">{t.bearishCaption}</p>
        </div>
      </div>

      {/* ── MOBILE ──────────────────────────────────────────────────── */}
      <div className="sm:hidden mt-5 space-y-3">
        {/* LONG */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
          <p className="text-[13px] font-bold text-emerald-400 mb-3">{t.longBuyMobile}</p>
          <svg viewBox="0 0 200 80" className="w-full mb-3" fill="none" aria-label="Prix monte">
            <polyline points="10,70 40,58 80,46 120,34 160,22 190,10" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="70" r="5" fill="#10b981" />
            <circle cx="190" cy="10" r="5.5" fill="#10b981" />
          </svg>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{t.entry.split(":")[0]}</p>
              <p className="text-[15px] font-bold text-white font-mono">78 000 $</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2">
              <p className="text-[10px] text-emerald-400 uppercase tracking-wide">{t.exit.split(":")[0]}</p>
              <p className="text-[15px] font-bold text-emerald-400 font-mono">81 000 $</p>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-emerald-400">{t.long3kRise}</p>
        </div>

        {/* SHORT */}
        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
          <p className="text-[13px] font-bold text-red-400 mb-3">{t.shortSellMobile}</p>
          <svg viewBox="0 0 200 80" className="w-full mb-3" fill="none" aria-label="Prix baisse">
            <polyline points="10,10 40,22 80,34 120,46 160,58 190,70" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="10" r="5" fill="#ef4444" />
            <circle cx="190" cy="70" r="5.5" fill="#ef4444" />
          </svg>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{t.entry.split(":")[0]}</p>
              <p className="text-[15px] font-bold text-white font-mono">78 000 $</p>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
              <p className="text-[10px] text-red-400 uppercase tracking-wide">{t.exit.split(":")[0]}</p>
              <p className="text-[15px] font-bold text-red-400 font-mono">75 000 $</p>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-red-400">{t.short3kDrop}</p>
        </div>
      </div>
    </>
  );
}

// ── Diagramme : Take Profit ───────────────────────────────────────────────────
function TakeProfitDiagram({ t }: { t: DiagLabels["takeProfit"] }) {
  return (
    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        {t.headerCaption}
      </p>

      {/* ── DESKTOP ───────────────────────────────────────── */}
      <div className="hidden sm:grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-[10px] font-bold text-emerald-400 text-center mb-2">{t.withTP}</p>
          <svg viewBox="0 0 130 145" className="w-full" fill="none">
            <line x1="8" y1="35" x2="122" y2="35" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
            <text x="8" y="28" fontSize="8" fill="#10b981">{t.tpLabel}</text>
            <line x1="8" y1="108" x2="122" y2="108" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" />
            <text x="8" y="119" fontSize="8" fill="#a1a1aa">{t.entryLabel}</text>
            <polyline points="12,108 40,88 70,65 95,44 112,35" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="108" r="3.5" fill="#10b981" />
            <circle cx="112" cy="35" r="4" fill="#10b981" />
            <text x="65" y="143" fontSize="10" fill="#10b981" textAnchor="middle" fontWeight="700">{t.profitCheck}</text>
          </svg>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-[10px] font-bold text-red-400 text-center mb-2">{t.withoutTP}</p>
          <svg viewBox="0 0 130 145" className="w-full" fill="none">
            <line x1="8" y1="35" x2="122" y2="35" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
            <text x="8" y="28" fontSize="8" fill="#52525b">{t.ignored84k}</text>
            <line x1="8" y1="108" x2="122" y2="108" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" />
            <text x="8" y="119" fontSize="8" fill="#a1a1aa">{t.entryLabel}</text>
            <polyline points="12,108 35,82 62,40 90,78 112,125" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="12" cy="108" r="3.5" fill="#ef4444" />
            <circle cx="62" cy="40" r="3" fill="#f87171" opacity="0.85" />
            <text x="64" y="36" fontSize="7" fill="#f87171">{t.plus6k}</text>
            <circle cx="112" cy="125" r="4" fill="#ef4444" />
            <text x="65" y="143" fontSize="10" fill="#ef4444" textAnchor="middle" fontWeight="700">{t.failureMark}</text>
          </svg>
        </div>
      </div>

      {/* ── MOBILE ───────────────────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {/* AVEC TP */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
          <p className="text-[13px] font-bold text-emerald-400 mb-3">{t.withTP} ✔</p>
          <svg viewBox="0 0 200 80" className="w-full mb-3" fill="none" aria-label="Prix atteint TP">
            <line x1="0" y1="8" x2="200" y2="8" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
            <line x1="0" y1="70" x2="200" y2="70" stroke="#52525b" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
            <polyline points="10,70 50,52 100,32 150,18 190,8" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            <circle cx="10" cy="70" r="5" fill="#10b981" />
            <circle cx="190" cy="8" r="6" fill="#10b981" />
          </svg>
          <div className="space-y-1.5 mb-2">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-zinc-400">{t.entry}</span>
              <span className="font-mono font-bold text-white">78 000 $</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-emerald-400">{t.tpReached}</span>
              <span className="font-mono font-bold text-emerald-400">84 000 $</span>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-emerald-400 pt-2 border-t border-emerald-500/20">{t.secured}</p>
        </div>

        {/* SANS TP */}
        <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
          <p className="text-[13px] font-bold text-red-400 mb-3">{t.withoutTP} ✖</p>
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
              <span className="text-zinc-400">{t.entry}</span>
              <span className="font-mono font-bold text-white">78 000 $</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-amber-400">{t.ignoredAt}</span>
              <span className="font-mono font-bold text-amber-400">84 000 $</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-red-400">{t.worstExit}</span>
              <span className="font-mono font-bold text-red-400">75 000 $</span>
            </div>
          </div>
          <p className="text-center text-[14px] font-bold text-red-400 pt-2 border-t border-red-500/20">{t.erased}</p>
        </div>
      </div>
    </div>
  );
}

// ── Diagramme : Break Even ────────────────────────────────────────────────────
function BreakEvenDiagram({ t }: { t: DiagLabels["breakEven"] }) {
  return (
    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        {t.headerCaption}
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <span className="text-xs font-bold text-zinc-500 w-4 shrink-0">1</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">{t.step1Title}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{t.step1Hint}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-1 text-center shrink-0">
            <p className="text-[9px] text-red-400 font-mono">{t.step1Tag}</p>
            <p className="text-[8px] text-red-500/60">si stoppé</p>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-600">{t.arrow1}</p>
        <div className="flex items-center gap-3 bg-amber-400/5 border border-amber-400/20 rounded-xl px-4 py-3">
          <span className="text-xs font-bold text-amber-400 w-4 shrink-0">2</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">{t.step2Title}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{t.step2Hint}</p>
          </div>
          <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg px-2 py-1 text-center shrink-0">
            <p className="text-[9px] text-amber-400 font-bold">{t.step2Tag}</p>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-600">{t.arrow2}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[10px] font-bold text-emerald-400">{t.continueTitle}</p>
            <p className="text-[9px] text-zinc-400 mt-1">{t.continueHint}</p>
            <p className="text-xs font-bold text-emerald-400 mt-1">{t.continueGain}</p>
          </div>
          <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl px-3 py-2.5 text-center">
            <p className="text-[10px] font-bold text-zinc-300">{t.fallbackTitle}</p>
            <p className="text-[9px] text-zinc-400 mt-1">{t.fallbackHint}</p>
            <p className="text-xs font-bold text-zinc-400 mt-1">{t.fallbackGain}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Diagramme : Grille de risque retail ──────────────────────────────────────
function RiskDiagram({ t }: { t: DiagLabels["risk"] }) {
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
        {t.headerTitle}
      </p>
      <p className="text-[10px] text-zinc-500 text-center mb-4">
        {t.headerSubtitle}
      </p>
      {/* ── DESKTOP ───────────────────────────────────────── */}
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
                    {t.maxPrefix} {tier.maxPct}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right leading-tight">
              <span className="text-sm text-zinc-400 whitespace-nowrap">{tier.euros}</span>
              <span className="text-[10px] text-zinc-600 block">{t.perTrade}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── MOBILE ──────────────────────────────────────── */}
      <div className="sm:hidden space-y-3">
        {tiers.map((tier, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
            <div className="flex items-baseline justify-between mb-2.5">
              <span className="text-[15px] font-bold text-white">{tier.capital}</span>
              <span className="text-[13px] text-zinc-400 font-mono">{tier.euros}<span className="text-[11px] text-zinc-600"> {t.perTrade}</span></span>
            </div>
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
            <div className="flex items-center gap-3 mt-2 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: tier.colorSolid }} />
                <span className="text-zinc-400">{t.legendIdeal} {tier.idealPct}</span>
              </span>
              {!tier.full && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: tier.colorFade ?? undefined }} />
                  <span className="text-zinc-400">{t.legendMax} {tier.maxPct}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-zinc-500 text-center mt-3 italic">
        {t.footer}
      </p>
    </div>
  );
}

// ── Diagramme : Biais psychologiques ─────────────────────────────────────────
function ErrorsDiagram({ t }: { t: DiagLabels["errors"] }) {
  return (
    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        {t.title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-xs font-bold text-red-400 mb-1">{t.fomo}</p>
          <p className="text-[10px] text-zinc-400 leading-snug">{t.fomoBody}</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-xs font-bold text-red-400 mb-1">{t.vengeance}</p>
          <p className="text-[10px] text-zinc-400 leading-snug">{t.vengeanceBody}</p>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
          <p className="text-xs font-bold text-blue-400 mb-1">{t.anchor}</p>
          <p className="text-[10px] text-zinc-400 leading-snug">{t.anchorBody}</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
          <p className="text-xs font-bold text-amber-400 mb-1">{t.overconfidence}</p>
          <p className="text-[10px] text-zinc-400 leading-snug">{t.overconfBody}</p>
        </div>
      </div>
    </div>
  );
}

// ── Rendu conditionnel des diagrammes ────────────────────────────────────────
function Diagram({ id, labels }: { id: string; labels: DiagLabels }) {
  switch (id) {
    case "candle":      return <CandleAnatomyDiagram />;
    case "long-short":  return <LongShortDiagram t={labels.longShort} />;
    case "spread":      return <SpreadDiagram />;
    case "takeprofit":  return <TakeProfitDiagram t={labels.takeProfit} />;
    case "breakeven":   return <BreakEvenDiagram t={labels.breakEven} />;
    case "risk":        return <RiskDiagram t={labels.risk} />;
    case "errors":      return <ErrorsDiagram t={labels.errors} />;
    case "biaschart":   return <BiasDiagram />;
    default:            return null;
  }
}

// ── Rendu d'une section ───────────────────────────────────────────────────────
function SectionContent({
  section,
  labels,
}: {
  section: LessonContent["sections"][number];
  labels: DiagLabels;
}) {
  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">{section.heading}</h2>
      <p className="text-zinc-300 leading-relaxed text-sm">{section.body}</p>

      {section.diagram && <Diagram id={section.diagram} labels={labels} />}

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
            <span className="text-sm font-bold text-amber-400 tracking-wide">{labels.retailReality}</span>
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
export async function DebutantLessonView({ slug, locale: rawLocale }: Props) {
  const locale: Locale = rawLocale && hasLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  // Source FR (canonique) + override ES si disponible.
  const sourceArr = locale === "es" ? LESSONS_ES : LESSONS;
  const level = sourceArr.find((l) => l.level === "debutant") ?? LESSONS.find((l) => l.level === "debutant");
  if (!level) return null;

  const lessons = level.lessons;
  const idx = lessons.findIndex((l) => l.slug === slug);
  const lesson = lessons[idx];
  if (!lesson) return null;

  const labels = getDiagLabels(locale);
  // Réutilise les libellés du namespace `common` pour la séparation Révision +
  // le préfixe "Leçon/Lección" (déjà localisé via dico).
  const common = await getDictionary(locale, "common");
  const reviewLabel = labels.reviewLabel;
  const prevLabel = (n: number) => common.lessons.lessonNumber.replace("{n}", String(n));

  const prev =
    idx > 0
      ? { href: `/formations/debutant/${lessons[idx - 1].slug}`, label: prevLabel(idx) }
      : null;
  const next =
    idx < lessons.length - 1
      ? { href: `/formations/debutant/${lessons[idx + 1].slug}`, label: prevLabel(idx + 2) }
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
        <SectionContent key={i} section={section} labels={labels} />
      ))}

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">
          {reviewLabel}
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
