import { LessonTemplate } from "@/app/components/LessonTemplate";
import { StopLossChartDiagram } from "@/app/components/charts/StopLossChartDiagram";
import { StopLossBasicsDiagram } from "@/app/components/charts/StopLossBasicsDiagram";
import { WithWithoutSLDiagram } from "@/app/components/charts/WithWithoutSLDiagram";
import ContentEs from "./_content-es";
import ContentEn from "./_content-en";

function ContentFr() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon5"
      lessonNumber={5}
      duration="10 min"
      prev={{ href: "/formations/debutant/lecon4", label: "Leçon 4 : Spread" }}
      next={{ href: "/formations/debutant/lecon6", label: "Leçon 6 : Take Profit" }}
      title="Le Stop Loss"
      hook="Sans Stop Loss, un seul trade peut ruiner des mois de travail en quelques minutes. Pas parce que tu analyses mal, parce que le marché peut aller beaucoup plus loin que tu ne l'imagines, et rien ne t'arrête. Le Stop Loss est la règle la plus importante du trading."
      sections={[
        {
          title: "Qu'est-ce qu'un Stop Loss ?",
          content: "Un Stop Loss (SL), c'est un ordre automatique qui ferme ton trade si le prix va trop loin dans la mauvaise direction. Tu le définis avant d'entrer dans le trade. Quand le prix l'atteint, ta position se ferme seule, que tu sois devant l'écran ou non.",
          visual: <StopLossBasicsDiagram />,
          items: [
            "Trade Long (achat) : ton SL se place EN DESSOUS de ton prix d'entrée",
            "Trade Short (vente) : ton SL se place AU DESSUS de ton prix d'entrée",
            "Quand le prix atteint le SL, le trade se ferme automatiquement",
            "Ta perte reste plafonnée et connue à l'avance, son montant exact en argent dépend de la taille de ta position",
          ],
        },
        {
          title: "Variation de prix et taille de position",
          content: "La variation de prix entre l'entrée et le Stop Loss est identique pour tous les traders sur ce trade. Dans cet exemple, le marché évolue de 1 500 $ entre 78 000 $ et 76 500 $. En revanche, le gain ou la perte en argent dépend de la taille de la position utilisée (le lot). Sur exactement le même mouvement de prix, un trader positionné avec 1 lot perdra 10× plus qu'un trader positionné avec 0,1 lot, et 100× plus qu'un trader positionné avec 0,01 lot. Deux traders peuvent donc prendre exactement le même trade, avec le même SL et le même TP, tout en gagnant ou perdant des montants totalement différents. Le calcul précis de la taille de position sera détaillé dans la Leçon 8 (Money Management).",
          items: [
            "La variation de prix jusqu'au SL est identique pour tous les traders sur le trade",
            "Le gain ou la perte en argent dépend de la taille de ta position, ton lot",
            "Même trade, même SL, même TP : avec des lots différents, les montants gagnés ou perdus sont totalement différents",
          ],
        },
        {
          title: "Exemple concret : avec et sans Stop Loss",
          content: "Cas 1, avec Stop Loss : Entrée Bitcoin à 78 000 $, Stop Loss à 76 500 $. Pendant la nuit, le marché chute brutalement et le Stop Loss ferme automatiquement la position à proximité de 76 500 $. La variation de prix négative est limitée à environ 1 500 $ : un risque défini à l'avance et contrôlé. Cas 2, sans Stop Loss : même entrée à 78 000 $, mais sans protection. La nuit, le marché s'effondre jusqu'à 70 000 $ : la variation de prix négative atteint 8 000 $, un risque non plafonné. Dans les deux cas, le montant réellement perdu en argent dépend de la taille de la position. Le Stop Loss ne garantit pas un trade gagnant, il garantit surtout qu'une mauvaise position ne se transforme pas en catastrophe.",
          visual: <WithWithoutSLDiagram />,
          items: [
            "Avec SL : la perte est limitée et connue à l'avance dès l'entrée",
            "Sans SL : la perte peut être illimitée, le marché n'attend pas que tu sois prêt",
            "Les traders sans SL pensent 'le prix va revenir', parfois oui, parfois non. Le 'non' détruit le compte.",
          ],
        },
        {
          title: "Où placer son Stop Loss ?",
          content: "Un bon SL ne se place pas au hasard. Il se place à un endroit logique sur le graphique, là où ton analyse serait clairement fausse si le prix l'atteignait.",
          visual: <StopLossChartDiagram />,
          items: [
            "Long : SL juste en dessous du dernier swing low significatif (le support)",
            "Short : SL juste au-dessus du dernier swing high significatif (la résistance)",
            "Exemple : tu achètes au rebond d'un support à 78 000 $. Le dernier swing low est à 77 200 $. Ton SL va à 77 000 $.",
            "Règle : si le prix atteint mon SL, mon analyse était fausse. La perte est normale.",
          ],
        },
      ]}
      errors={[
        "Ne pas mettre de SL 'pour laisser une chance au trade', c'est la cause n°1 de comptes détruits chez les débutants",
        "SL trop serré : 100 $ de SL sur Bitcoin qui fluctue normalement de plus de 1 000 $ par heure, tu seras sorti sans raison",
        "SL placé au hasard ('1 500 $ parce que ça me semble bien'), le SL doit correspondre à un niveau logique sur le graphique",
        "Oublier de placer le SL au moment d'entrer en pensant 'je le mets juste après', et ne jamais le mettre",
      ]}
      fatalError="Déplacer le Stop Loss dans le mauvais sens pour éviter d'être stoppé. Ton trade perd, tu es à −500 $. Tu éloignes le SL pour 'lui laisser une chance'. Le trade continue à perdre. Tu éloignes encore. Au final, tu perds 5 ou 10 fois plus que prévu. Cette erreur, commise sous l'émotion, est responsable de la destruction de milliers de comptes de traders débutants."
      keyPoints={[
        "Stop Loss = ordre automatique qui limite ta perte à un montant défini à l'avance",
        "Long : SL en dessous de l'entrée. Short : SL au-dessus de l'entrée.",
        "Sans SL, ta perte est potentiellement illimitée, c'est un risque inacceptable",
        "Place le SL à un endroit logique sur le graphique, pas au hasard",
        "Ne déplace JAMAIS le SL dans le sens de la perte, c'est l'erreur fatale",
      ]}
      exerciseTitle="Identifier des placements de Stop Loss logiques"
      exercise={[
        "Sur TradingView, ouvre Bitcoin (BTC/USD) en H1",
        "Repère le dernier mouvement haussier. Identifie le dernier swing low avant cette hausse.",
        "Si tu achetais au prix actuel, ton SL irait juste en dessous de ce swing low. Note le prix exact.",
        "Calcule la différence en euros entre ce SL et le prix actuel. C'est le risque maximum de ce trade.",
      ]}
      quiz={{
        question: "Une position acheteuse sur BTC/USD est ouverte à 78 000 $. Le dernier swing low significatif se situe à 77 000 $. Quel placement de Stop Loss respecte le mieux la logique technique ?",
        answers: [
          "77 900 $",
          "77 500 $",
          "76 900 $",
          "78 200 $",
        ],
        correctIndex: 2,
        explanation: "Le Stop Loss doit être placé au-delà du niveau technique qui invalide le scénario. Le dernier swing low important se situe à 77 000 $. Un Stop Loss à 76 900 $ laisse une petite marge sous ce niveau tout en gardant un risque cohérent. La variation entre l'entrée (78 000 $) et le SL (76 900 $) représente une variation de prix de 1 100 $. La perte réellement subie en argent dépend ensuite de la taille de la position utilisée.",
        answerExplanations: [
          "Incorrect. Le Stop Loss est placé trop proche de l'entrée. Une fluctuation normale de Bitcoin peut facilement toucher ce niveau sans invalider le scénario.",
          "Incorrect. Le Stop Loss reste au-dessus du dernier swing low significatif. Le marché pourrait balayer ce niveau avant de repartir.",
          "Correct. Le Stop Loss se situe juste sous le dernier swing low important à 77 000 $. Le niveau invalide réellement le scénario si le prix est cassé.",
          "Incorrect. Le Stop Loss est placé au-dessus du prix d'entrée. Le trade serait clôturé immédiatement ou presque.",
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
  if (locale === "en") return <ContentEn />;
  return <ContentFr />;
}
