import { LessonTemplate } from "@/app/components/LessonTemplate";
import { CandleAnatomyDiagram } from "@/app/components/charts/CandleAnatomyDiagram";
import ContentEs from "./_content-es";

// ── Schéma : exemple bougie verte vs rouge ───────────────────────────────────
function CandleExampleDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
        <p className="text-xs font-bold text-emerald-400 mb-2">Bougie verte</p>
        <svg viewBox="0 0 60 100" className="w-10 mx-auto mb-2" aria-label="Bougie verte">
          <line x1="30" y1="5"  x2="30" y2="18" stroke="#4b5563" strokeWidth="2" />
          <rect x="18" y="18" width="24" height="52" rx="2" fill="#059669" fillOpacity="0.9" />
          <line x1="30" y1="70" x2="30" y2="92" stroke="#4b5563" strokeWidth="2" />
        </svg>
        <p className="text-[10px] text-emerald-400/80 leading-snug">Close &gt; Open<br />Acheteurs ont gagné</p>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center">
        <p className="text-xs font-bold text-red-400 mb-2">Bougie rouge</p>
        <svg viewBox="0 0 60 100" className="w-10 mx-auto mb-2" aria-label="Bougie rouge">
          <line x1="30" y1="5"  x2="30" y2="18" stroke="#4b5563" strokeWidth="2" />
          <rect x="18" y="18" width="24" height="52" rx="2" fill="#dc2626" fillOpacity="0.8" />
          <line x1="30" y1="70" x2="30" y2="92" stroke="#4b5563" strokeWidth="2" />
        </svg>
        <p className="text-[10px] text-red-400/80 leading-snug">Open &gt; Close<br />Vendeurs ont gagné</p>
      </div>
    </div>
  );
}

function ContentFr() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon3"
      lessonNumber={3}
      duration="10 min"
      prev={{ href: "/formations/debutant/lecon2", label: "Leçon 2 — Long et Short" }}
      next={{ href: "/formations/debutant/lecon4", label: "Leçon 4 — Spread" }}
      title="Lire un graphique en bougies"
      hook="Un graphique en bougies, c'est une image du combat entre acheteurs et vendeurs. Chaque bougie te dit qui a gagné, avec quelle force, et s'il y a eu de la résistance. Apprendre à les lire, c'est voir ce que la plupart des gens ignorent."
      sections={[
        {
          title: "Anatomie d'une bougie — 4 informations en une image",
          content: "Chaque bougie affiche exactement 4 données. Ensemble, elles résument tout ce qui s'est passé pendant une période — 1 minute, 1 heure ou 1 jour.",
          visual: <CandleAnatomyDiagram />,
          items: [
            "Open (O) — le prix au moment où la période commence",
            "Close (C) — le prix au moment où la période se termine",
            "High (H) — le prix le plus haut atteint pendant la période",
            "Low (L) — le prix le plus bas atteint pendant la période",
          ],
        },
        {
          title: "Exemple concret — une bougie verte, une bougie rouge",
          content: "Bougie verte : Bitcoin ouvre à 78 000 $, monte à 79 000 $, descend à 77 500 $, clôture à 78 600 $. Le prix termine plus haut qu'à l'ouverture : Close (78 600) > Open (78 000). Les acheteurs gagnent donc la bataille. Bougie rouge : Bitcoin ouvre à 78 600 $, monte à 78 900 $, chute à 77 000 $, clôture à 77 400 $. Le prix termine plus bas qu'à l'ouverture : Close (77 400) < Open (78 600). Les vendeurs gagnent donc la bataille.",
          visual: <CandleExampleDiagram />,
          items: [
            "Corps vert = close > open — les acheteurs ont dominé la période",
            "Corps rouge = close < open — les vendeurs ont dominé la période",
            "Mèche haute = tentative de hausse repoussée par les vendeurs",
            "Mèche basse = tentative de baisse repoussée par les acheteurs",
          ],
        },
        {
          title: "Patterns de bougies à connaître",
          content: "Ces configurations reviennent souvent. Elles donnent des informations — mais leur valeur dépend entièrement de l'endroit où elles apparaissent sur le graphique.",
          items: [
            "Marteau : petit corps en haut, longue mèche basse → les vendeurs ont essayé de faire baisser, les acheteurs ont résisté fort",
            "Étoile filante : petit corps en bas, longue mèche haute → les acheteurs ont essayé de faire monter, les vendeurs ont rejeté",
            "Doji : corps quasi nul, mèches des deux côtés → indécision totale entre acheteurs et vendeurs",
            "Engulfing haussier : grande bougie verte qui avale la rouge précédente → les acheteurs prennent le contrôle",
          ],
        },
      ]}
      errors={[
        "Entrer sur un trade parce qu'une bougie 'ressemble' à un marteau — sans vérifier si elle est sur un niveau important",
        "Confondre la couleur avec un signal d'achat ou de vente : une bougie rouge ne veut pas dire 'vendre maintenant'",
        "Analyser une seule bougie isolée : c'est toujours la séquence de bougies qui raconte l'histoire",
        "Ignorer les mèches : une bougie verte avec une très longue mèche haute n'est pas un signal haussier fort",
      ]}
      fatalError="Entrer sur un trade uniquement parce qu'un pattern de bougie te semble intéressant, sans regarder la tendance globale et sans que la bougie soit sur un niveau clé. Un marteau au milieu du graphique ne signifie rien. Un marteau sur un support majeur, dans une tendance haussière — là, il devient pertinent."
      keyPoints={[
        "Chaque bougie = 4 données : Open, High, Low, Close",
        "Corps vert = acheteurs gagnants. Corps rouge = vendeurs gagnants.",
        "Les mèches = tentatives échouées — elles montrent la résistance du camp adverse",
        "Doji = indécision. Marteau = rejet des prix bas. Engulfing = prise de contrôle franche.",
        "Un pattern de bougie seul ne signifie rien — le contexte lui donne de la valeur",
      ]}
      exerciseTitle="Lire des bougies sur un graphique réel"
      exercise={[
        "Sur TradingView.com, ouvre EUR/USD en timeframe Daily",
        "Trouve une bougie verte avec une longue mèche haute — qu'est-il arrivé dans les jours suivants ?",
        "Trouve un Doji — le marché a-t-il choisi une direction claire dans les bougies suivantes ?",
        "Identifie un Engulfing (une grande bougie qui avale la précédente) — quel a été l'impact sur la suite ?",
      ]}
      quiz={{
        question: "Tu vois une bougie rouge avec une très longue mèche basse. Qu'est-ce que cela indique le plus précisément ?",
        answers: [
          "Le marché est fortement baissier et va continuer à baisser",
          "Les vendeurs ont dominé la période, mais les acheteurs ont défendu les prix bas avec force",
          "La clôture de la bougie a eu lieu au niveau le plus bas de la période",
          "C'est un signal d'achat immédiat — entre maintenant",
        ],
        correctIndex: 1,
        explanation: "Corps rouge = les vendeurs ont gagné la période (close < open). Longue mèche basse = le prix a chuté très bas, mais les acheteurs ont repoussé cette baisse avant la clôture. C'est un signal de résistance acheteuse — pas une domination vendeurs totale.",
        answerExplanations: [
          "Faux. La longue mèche basse prouve le contraire d'une domination vendeurs totale. Les acheteurs ont réagi fort depuis les plus bas — c'est de la résistance, pas une confirmation de tendance baissière.",
          "Correct. Corps rouge = vendeurs gagnants sur la période. Longue mèche basse = les acheteurs ont repoussé les prix depuis les plus bas avec force. Il y a eu un combat visible — pas une domination écrasante.",
          "Faux. La longue mèche basse prouve que le prix est descendu très bas PUIS est remonté avant de clôturer. La clôture est donc au-dessus du plus bas — sinon la mèche serait nulle.",
          "Faux. Aucune bougie seule n'est un signal d'achat suffisant. Pour que cette bougie soit actionnelle, il faudrait qu'elle soit sur un support important, dans un contexte de tendance favorable.",
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
