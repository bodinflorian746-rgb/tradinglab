"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { WARangeDiagram } from "@/app/components/charts/WyckoffStrategyDiagrams";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

// Wyckoff appliqué, leçon 1. Un seul exemple sur l'or (H1 puis M15) suivi d'une leçon à l'autre ; la vente
// sur le NASDAQ (niveaux du texte d'origine décalés de +7 000 points) arrive en leçon 2.

export default function ContentFr() {
  return (
    <StrategyLesson
      n={1}
      duration="16 min"
      title="Identifier une accumulation ou une distribution exploitable"
      lead="La leçon Wyckoff t'a appris à reconnaître accumulation, distribution, Markup et Markdown. Cette stratégie en fait une méthode : chercher un range identifiable, puis attendre que le marché montre un changement de structure, sans supposer que chaque consolidation prépare un retournement."
      quote="On ne cherche pas à acheter le point le plus bas : on attend des indices de transition assez clairs."
      prereqs={[
        { label: "La méthode Wyckoff : accumulation et distribution", href: "/formations/avance/lecon13", ref: "Trading Avancé 13" },
        { label: "Zones clés : support et résistance prouvés", href: "/formations/intermediaire/lecon2", ref: "Trading Intermédiaire 2" },
        { label: "Faux breakout", href: "/formations/intermediaire/lecon6", ref: "Trading Intermédiaire 6" },
      ]}
    >
      <Block title="Commencer par le contexte">
        <P>
          Nous travaillons en H1 pour le contexte et en M15 pour l&apos;entrée. Pour chercher une accumulation, il faut d&apos;abord une baisse préalable, puis un range qui se forme. Pour une distribution, l&apos;inverse : une hausse préalable, puis une consolidation.
        </P>
        <P>
          Ce contexte est décisif. Un range au milieu d&apos;une tendance haussière peut n&apos;être qu&apos;une consolidation de continuation : on ne l&apos;appelle pas distribution pour autant.
        </P>
      </Block>

      <Block title="Tracer le range" chart={<WARangeDiagram />}>
        <Example>
          <p>L&apos;or baisse jusqu&apos;à 3 880 $, puis rebondit à 3 960 $. Il revient vers 3 890 $, avant de remonter à 3 940 $.</p>
          <p>Deux grandes zones apparaissent : un support entre 3 880 et 3 900 $, une résistance entre 3 940 et 3 960 $. Ces bornes, chacune touchée deux fois, forment notre zone de travail. Nous attendons que le marché donne plus d&apos;informations.</p>
        </Example>
        <P>
          Dans le vocabulaire Wyckoff, le creux à 3 880 $ peut être un Selling Climax, le rebond à 3 960 $ un Automatic Rally, le retour vers 3 890 $ un Secondary Test (<Link href="/formations/avance/lecon13" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Avancé 13</Link>).
        </P>
      </Block>

      <Block title="Les événements à surveiller">
        <Points
          title="Pour une accumulation"
          items={[
            "Un éventuel Selling Climax, un Automatic Rally et un Secondary Test, qui dessinent le range",
            "Un Spring potentiel sous le support",
            "Un Sign of Strength (SOS)",
            "Un Last Point of Support (LPS)",
          ]}
        />
        <P>
          Ces événements n&apos;apparaissent pas forcément dans un ordre parfait ; certains manquent ou restent difficiles à identifier.
        </P>
      </Block>

      <Block title="Les deux setups de la stratégie">
        <Points
          items={[
            <><span className="text-white font-medium">Accumulation haussière</span>{" "}: un range après une baisse, un test de la borne basse, un signe de force, puis une correction confirmée</>,
            <><span className="text-white font-medium">Distribution baissière</span>{" "}: un range après une hausse, un test de la borne haute, un signe de faiblesse, puis un rebond confirmé</>,
          ]}
        />
      </Block>

      <Block title="Quand ne pas retenir le range">
        <Points
          items={[
            "La structure précédente est trop confuse : l'interprétation sera fragile",
            "Les bornes du range changent sans cesse : la zone de travail manque de cohérence",
            "Le marché casse le support sans réintégration ni force haussière : ce n'est pas un Spring, on attend",
          ]}
        />
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Appeler accumulation n'importe quel range", text: "= sans baisse préalable, ce n'est qu'une consolidation." },
          { name: "Tracer des bornes sans touches", text: "= un support ou une résistance se prouve par plusieurs réactions du prix." },
          { name: "Anticiper le Spring", text: "= un passage sous le support n'en est un qu'après la réintégration." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "On cherche un range identifiable après une tendance.",
          "On distingue un scénario d'accumulation d'un scénario de distribution par la tendance qui précède.",
          "Chaque fausse sortie n'est pas un signal.",
          "La structure du prix reste prioritaire sur les étiquettes Wyckoff.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Pourquoi analyser la tendance qui précède le range ?",
            options: [
              "Parce que toutes les consolidations sont des accumulations.",
              "Parce que le contexte aide à distinguer une transition possible d'une simple consolidation.",
              "Parce que la tendance précédente garantit le mouvement suivant.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Un range apparaît dans des contextes très différents.",
              "Correct. La tendance précédente donne son cadre à l'analyse Wyckoff.",
              "Faux. Aucun contexte ne garantit la direction suivante.",
            ],
          },
          {
            question: "L'or casse le support de 3 880 $ et accélère à la baisse, sans revenir dans le range. Que fais-tu ?",
            options: ["J'achète, c'est un Spring.", "Je n'achète pas : sans réintégration, ce n'est pas un Spring.", "J'élargis le range pour inclure le nouveau creux."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Un Spring se définit par la réintégration du range.",
              "Correct. Tant que le prix ne revient pas dans le range, le scénario d'accumulation n'est pas confirmé.",
              "Faux. Déplacer les bornes fait perdre sa cohérence à la zone de travail.",
            ],
          },
          {
            question: "Quel setup recherche la stratégie à l'achat ?",
            options: ["Acheter le creux le plus bas du range.", "Un range après une baisse, un test de la borne basse, un signe de force, puis une correction confirmée.", "Acheter dès que le prix touche la résistance."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. La stratégie n'essaie pas de capter le point bas.",
              "Correct. C'est la séquence d'accumulation que la stratégie attend.",
              "Faux. La résistance n'est pas une zone d'achat.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
