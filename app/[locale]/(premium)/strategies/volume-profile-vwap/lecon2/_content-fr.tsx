"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { VSVGoldSellDiagram, VSVVwapZoneDiagram } from "@/app/components/charts/VolumeVWAPStrategyDiagrams";
import { Block, Example, P, Points, StrategyLesson } from "../_shell";

export default function ContentFr() {
  return (
    <StrategyLesson
      n={2}
      duration="16 min"
      title="Filtrer les opportunités avec le VWAP"
      lead="Une zone intéressante n'est pas une bonne opportunité à chaque instant. Le VWAP sert de filtre : il vérifie que le retour du prix vers la zone reste cohérent avec le scénario."
      quote="Le VWAP constitue un filtre, et non le déclencheur direct de notre position."
      prereqs={[
        { label: "VWAP de séance, VWAP ancré, remise à zéro", href: "/formations/avance/lecon11", ref: "Trading Avancé 11" },
        { label: "Volume Profile : POC et zones de volume", href: "/formations/avance/lecon10", ref: "Trading Avancé 10" },
        { label: "Le plan d'analyse EUR/USD", href: "/strategies/volume-profile-vwap/lecon1", ref: "Leçon 1 de cette stratégie" },
      ]}
    >
      <Block title="Reprendre l'analyse EUR/USD" chart={<VSVVwapZoneDiagram />}>
        <P>
          Dans la leçon 1, tu as identifié une zone d&apos;achat potentielle sur EUR/USD : structure haussière et POC sur un support. Mais le marché peut évoluer dans une direction différente, accélérer pendant une news économique ou traverser le support sans réaction. Le{" "}
          <Link href="/formations/avance/lecon11" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">VWAP</Link>{" "}
          sert de filtre complémentaire : la position du prix par rapport à son prix moyen pondéré est-elle cohérente avec le scénario ?
        </P>
        <Example>
          <p>Le scénario de départ : tendance H1 haussière, support 1.0855 – 1.0865, POC 1.0860, résistance supérieure 1.0910.</p>
          <p>Tu descends en M15 et ajoutes un VWAP de séance. Quand le prix revient vers le support, le VWAP se situe à 1.0862. Trois observations concordent : une structure H1 haussière, un support qui coïncide avec le POC, et un VWAP dans cette même zone.</p>
          <p>La zone devient intéressante à surveiller. Il manque encore une confirmation de reprise haussière.</p>
        </Example>
      </Block>

      <Block title="Le rôle du VWAP dans la stratégie">
        <P>
          Le VWAP sert à contextualiser le retour du prix vers la zone d&apos;intérêt. En tendance haussière, on cherche une correction vers une zone technique, puis une reprise ; en tendance baissière, l&apos;inverse. Le VWAP ne justifie jamais à lui seul l&apos;ouverture d&apos;un trade.
        </P>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <Points
              title="Pour un achat"
              items={[
                "La structure principale reste haussière",
                "Le prix corrige vers un support identifié",
                "Le VWAP se situe à proximité de la zone",
                "Le prix montre ensuite une réaction haussière",
              ]}
            />
          </div>
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <Points
              title="Pour une vente"
              items={[
                "La structure principale reste baissière",
                "Le prix rebondit vers une résistance identifiée",
                "Le VWAP se situe à proximité de la résistance",
                "Le prix montre ensuite une réaction baissière",
              ]}
            />
          </div>
        </div>
      </Block>

      <Block title="Quand abandonner une opportunité ?">
        <P>
          Le prix revient sur le support 1.0860, mais la structure M15 devient fortement baissière : il casse plusieurs creux successifs et ne parvient pas à récupérer le support. Même si le POC et le VWAP sont proches, les conditions du scénario ne sont plus réunies : on ne cherche pas à acheter.
        </P>
        <P>
          Autre situation : le prix a déjà fortement progressé et se trouve très loin de la zone d&apos;intérêt. Inutile de courir après le marché. Une stratégie structurée consiste aussi à reconnaître les situations où il vaut mieux ne pas entrer.
        </P>
        <Points
          title="Points actionnables"
          items={[
            "Structure M15 qui casse ses creux sous le support = scénario d'achat abandonné",
            "Prix déjà loin de la zone = pas de poursuite du mouvement",
            "Le VWAP et le POC ne compensent jamais une structure défavorable",
          ]}
        />
      </Block>

      <Block title="Exemple pratique sur l'or : une vente" chart={<VSVGoldSellDiagram />}>
        <P>
          Le même filtre s&apos;applique dans un scénario baissier. L&apos;or présente une tendance baissière sur H1, avec une résistance à 3 900 $. Le Volume Profile montre une concentration importante de volume autour de 3 898 $.
        </P>
        <Example>
          <p>Après une impulsion baissière, le prix rebondit vers cette résistance. Au même moment, le VWAP de séance se situe autour de 3 899 $. La zone de confluence va de 3 898 $ à 3 900 $ : tu la surveilles pour rechercher une vente.</p>
          <p>Tant que le prix ne confirme pas une reprise baissière, tu restes à l&apos;écart. Tu attends notamment une incapacité à franchir la résistance, suivie d&apos;une cassure d&apos;un creux local : cette confirmation est étudiée dans la leçon suivante.</p>
        </Example>
      </Block>

      <Block title="Les particularités du VWAP sur Forex et CFD">
        <P>
          Le VWAP utilise les données de prix et de volume disponibles sur le graphique. Sur le Forex au comptant et sur certains CFD, les volumes peuvent être partiels ou fondés sur les variations de cotation : les valeurs affichées ne représentent pas l&apos;intégralité des transactions du marché mondial.
        </P>
        <P>
          L&apos;indicateur garde son intérêt, à condition de l&apos;utiliser comme un élément complémentaire. Dans cette stratégie, la structure du prix et les niveaux techniques conservent la priorité. Pour conclure : tu disposes maintenant d&apos;une méthode pour sélectionner les zones les plus intéressantes ; la leçon suivante attend une confirmation avant d&apos;entrer, sur les graphiques Forex et CFD comme avec des données futures.
        </P>
      </Block>

      <LessonKeyPoints
        points={[
          "Le VWAP filtre les zones identifiées avec le Volume Profile.",
          "On recherche une convergence entre la structure du prix, une zone technique, une concentration de volume et le VWAP.",
          "Le VWAP n'est pas le déclencheur de l'entrée : il améliore la sélection des setups à surveiller.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Quel est le rôle principal du VWAP dans cette stratégie ?",
            options: [
              "Remplacer l'analyse des supports et résistances.",
              "Fournir un filtre complémentaire pour analyser le positionnement du prix.",
              "Garantir une entrée gagnante.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le VWAP complète l'analyse technique.",
              "Correct. Il apporte une référence de prix moyen pondéré pour contextualiser la correction.",
              "Faux. Aucune convergence ne garantit le résultat d'un trade.",
            ],
          },
          {
            question: "Tu identifies un support et un POC proches du VWAP, mais la structure devient fortement baissière. Que fais-tu ?",
            options: [
              "Tu attends ou abandonnes le scénario d'achat.",
              "Tu achètes immédiatement.",
              "Tu doubles la taille de ta position.",
            ],
            correctIndex: 0,
            answerExplanations: [
              "Correct. La structure ne confirme plus l'hypothèse d'une reprise haussière.",
              "Faux. La présence des indicateurs ne suffit pas.",
              "Faux. Augmenter le risque ne corrige pas un setup invalidé.",
            ],
          },
          {
            question: "Dans un scénario baissier, quel setup recherches-tu ?",
            options: [
              "Un achat loin de toute zone technique.",
              "Une vente simplement parce que le prix se trouve sous le VWAP.",
              "Un retour vers une résistance, une confluence avec le VWAP, puis une confirmation baissière.",
            ],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Ce setup ne respecte pas la stratégie.",
              "Faux. La position du prix par rapport au VWAP n'est pas un signal suffisant.",
              "Correct. Tu réunis une tendance, une zone et une réaction du prix.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
