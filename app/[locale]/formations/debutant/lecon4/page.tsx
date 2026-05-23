import { LessonTemplate } from "@/app/components/LessonTemplate";
import { SpreadDiagram } from "@/app/components/charts/SpreadDiagram";
import { SpreadVariationDiagram } from "@/app/components/charts/SpreadVariationDiagram";
import ContentEs from "./_content-es";

// ── Schéma : gain et perte avec le spread ────────────────────────────────────
function SpreadImpactDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-wide">Mouvement suffisant ✓</p>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Achat (Ask)</span>
            <span className="text-white">1,0805</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Vente (Bid)</span>
            <span className="text-white">1,0870</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Gain net</span>
            <span className="text-emerald-400 font-bold">+65 pts ✓</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
        <p className="text-[10px] font-bold text-red-400 mb-2 uppercase tracking-wide">Mouvement trop faible ✗</p>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Achat (Ask)</span>
            <span className="text-white">1,0805</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Vente (Bid)</span>
            <span className="text-white">1,0806</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Résultat</span>
            <span className="text-red-400 font-bold">−4 pts ✗</span>
          </div>
        </div>
        <p className="text-[9px] text-zinc-600 mt-1.5">Le spread efface le gain</p>
      </div>
    </div>
  );
}

function ContentFr() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon4"
      lessonNumber={4}
      duration="8 min"
      prev={{ href: "/formations/debutant/lecon3", label: "Leçon 3 — Bougies" }}
      next={{ href: "/formations/debutant/lecon5", label: "Leçon 5 — Stop Loss" }}
      title="Spread, Bid et Ask"
      hook="Tu analyses le marché parfaitement. Tu entres au bon moment. Et pourtant, tu es déjà dans le rouge dès la première seconde — sans que le prix ait bougé. Ce n'est pas une erreur. C'est le spread. Et tout trader le paie, sur chaque trade, sans exception."
      sections={[
        {
          title: "Bid et Ask — deux prix en permanence",
          content: "Sur n'importe quel marché, deux prix sont toujours affichés simultanément. Ce n'est pas un bug — c'est le fonctionnement normal. Le Bid, c'est le prix auquel tu peux vendre. L'Ask, c'est le prix auquel tu peux acheter. L'Ask est toujours légèrement plus élevé que le Bid.",
          visual: <SpreadDiagram />,
          items: [
            "BID = prix de vente (toujours le moins élevé des deux)",
            "ASK = prix d'achat (toujours le plus élevé des deux)",
            "SPREAD = Ask − Bid = le coût payé à chaque ouverture de trade",
            "Exemple : EUR/USD Bid = 1,0800, Ask = 1,0805 → spread de 5 points",
          ],
        },
        {
          title: "Exemple concret — l'impact du spread sur tes trades",
          content: "Tu achètes EUR/USD à l'Ask (1,0805). Pour être rentable, le prix Bid doit dépasser 1,0805 — c'est-à-dire que le marché doit bouger d'au moins 5 points dans ta direction avant que tu commences à gagner.",
          visual: <SpreadImpactDiagram />,
          items: [
            "Le spread est payé à l'ENTRÉE du trade — pas à la sortie",
            "Tu commences chaque trade dans le rouge du montant du spread",
            "Pour EUR/USD avec 5 points de spread : le marché doit bouger +5 points avant l'équilibre",
            "Sur de petits objectifs, le spread peut représenter 50% du gain visé",
          ],
        },
        {
          title: "Le spread varie selon les conditions",
          content: "Le spread n'est pas fixe. Il dépend de la liquidité du marché — combien d'acheteurs et vendeurs sont actifs en ce moment. Plus il y a d'activité, plus le spread est serré et moins tu paies.",
          visual: <SpreadVariationDiagram />,
          items: [
            "EUR/USD aux heures de pointe (9h–17h) : 1–2 points — coût minimal",
            "EUR/USD la nuit (22h–6h) : 4–8 points — coût plus élevé",
            "Cryptos le week-end : très variable — peut être très coûteux",
            "Paires exotiques (USD/TRY...) : 20–100 points — dangereux pour les petits objectifs",
          ],
        },
      ]}
      errors={[
        "Trader des actifs à spread élevé (paires exotiques, crypto le week-end) sans vérifier le coût d'entrée",
        "Vouloir gagner 3 points sur un trade avec 5 points de spread — impossible d'être rentable",
        "Trader la nuit ou aux heures creuses sans savoir que le spread s'élargit significativement",
        "Choisir un broker uniquement sur la publicité sans comparer les spreads — 1 point de différence × 100 trades = impact réel",
      ]}
      fatalError="Trader un actif à fort spread avec un objectif de gain inférieur au spread. Si ton spread est de 20 points et que tu vises un gain de 15 points, tu es en perte avant même que le marché bouge d'un seul point. Calcule toujours le spread avant de définir ton objectif."
      keyPoints={[
        "Bid = prix de vente. Ask = prix d'achat. L'Ask est toujours plus élevé.",
        "Spread = Ask − Bid = coût payé à l'entrée de chaque trade",
        "Tu commences chaque trade dans le rouge du montant du spread",
        "Le spread est plus faible aux heures de forte activité (9h–17h heure de Paris)",
        "Ton objectif de gain doit toujours dépasser le spread — sinon le trade est perdant d'avance",
      ]}
      exerciseTitle="Observer le spread en conditions réelles"
      exercise={[
        "Sur TradingView.com, ouvre EUR/USD. Dans les paramètres du graphique, active l'affichage du Bid et de l'Ask.",
        "Note la différence entre Bid et Ask un jour de semaine à 10h — c'est le spread à ce moment.",
        "Reviens voir ce spread à 23h ou un dimanche — est-il plus large ou plus serré ? Pourquoi ?",
        "Ouvre une paire exotique comme USD/MXN et compare son spread à celui d'EUR/USD.",
      ]}
      quiz={{
        question: "EUR/USD : Bid = 1,0800, Ask = 1,0805. Tu ouvres un achat (Long). À quel prix s'exécute ton trade, et de combien es-tu dans le rouge immédiatement ?",
        answers: [
          "À 1,0800 — tu commences à l'équilibre, spread nul",
          "À 1,0802 — tu es 2 points dans le rouge",
          "À 1,0805 — tu es 5 points dans le rouge immédiatement",
          "Le prix d'exécution dépend de la taille de ta position",
        ],
        correctIndex: 2,
        explanation: "Un achat s'exécute toujours à l'Ask = 1,0805. Le spread = Ask − Bid = 1,0805 − 1,0800 = 5 points. Si tu fermes immédiatement, tu vends au Bid = 1,0800 et perds 5 points. C'est le coût d'entrée payé sur chaque trade.",
        answerExplanations: [
          "Faux. Le Bid (1,0800) est le prix auquel tu VENDS — pas celui auquel tu achètes. À l'achat, l'ordre s'exécute à l'Ask (1,0805). Tu démarres avec 5 points de déficit, pas à l'équilibre.",
          "Faux. Il n'existe pas de prix intermédiaire entre Bid et Ask pour un ordre au marché. Tu achètes à l'Ask (1,0805) ou tu vends au Bid (1,0800). Ici : 1,0805, soit 5 points dans le rouge.",
          "Correct. L'achat s'exécute à l'Ask = 1,0805. Spread = 5 points. Fermeture immédiate au Bid = 1,0800 → perte de 5 points. Ce coût est payé à l'ouverture de chaque trade, sans exception.",
          "Faux. Le prix d'exécution est toujours l'Ask pour un achat, quelle que soit la taille de position. La taille affecte le montant en euros perdu par point — pas le niveau de prix d'exécution.",
        ],
      }}
    />
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale === "es") return <ContentEs />;
  return <ContentFr />;
}
