"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ORBPlanDiagram } from "@/app/components/charts/ORBDiagrams";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

// Opening Range Breakout, leçon 3. NASDAQ : niveaux du texte d'origine décalés de +7 000 points (résistance
// H1 27 250, objectif 27 236 juste avant). Taille de position calculée au lot près (NASDAQ : 1 lot ≈ 1 $ par
// point, soit environ 0,92 €, lot minimum 0,1).

export default function ContentFr() {
  return (
    <StrategyLesson
      n={3}
      duration="16 min"
      title="Construire le trade : entrée, stop et objectif"
      lead="Un breakout confirmé ne suffit pas pour ouvrir une position. Il faut connaître l'entrée, l'invalidation, l'objectif et le risque en euros avant de cliquer : cette leçon transforme le setup ORB en plan de trading."
      quote="Le stop suit l'invalidation du retest, l'objectif s'arrête avant la résistance H1, et la taille découle du risque accepté."
      prereqs={[
        { label: "Plan de trade", href: "/formations/intermediaire/lecon8", ref: "Trading Intermédiaire 8" },
        { label: "Gestion du risque : le money management", href: "/formations/debutant/lecon8", ref: "Trading Débutant 8" },
        { label: "Les types d'ordres", href: "/formations/debutant/lecon11", ref: "Trading Débutant 11" },
      ]}
    >
      <Block title="Reprendre l'exemple du NASDAQ">
        <P>
          L&apos;Opening Range va de 27 080 à 27 150. Le marché clôture au-dessus de 27 150, revient tester cette ancienne résistance, forme un creux local à 27 145, puis repart et dépasse 27 170.
        </P>
        <Points
          items={[
            <>Entrée : 27 172, sur la reprise haussière après le retest (la première mèche au-dessus du range n&apos;est pas achetée)</>,
            <>Stop Loss : 27 140, juste sous le creux du retest (27 145) : 32 points de risque</>,
            <>Objectif : une résistance H1 se trouve à 27 250 ; l&apos;objectif est placé avant, à 27 236</>,
          ]}
        />
        <P>
          Vérifie que ce stop reste cohérent avec la volatilité du moment (ATR) et les conditions d&apos;exécution : un stop de 32 points est-il plus large que le bruit habituel des bougies M5 ?
        </P>
      </Block>

      <Block title="Le plan complet" chart={<ORBPlanDiagram />}>
        <Example title="Plan ORB sur le NASDAQ">
          <ul className="space-y-1">
            <li>- Actif : NASDAQ CFD, achat</li>
            <li>- Opening Range : 27 080 – 27 150</li>
            <li>- Entrée : 27 172</li>
            <li>- Stop Loss : 27 140</li>
            <li>- Take Profit : 27 236, avant la résistance H1 27 250</li>
            <li>- Risque 32 points, gain potentiel 64 points : R/R 1:2, avant frais</li>
          </ul>
        </Example>
      </Block>

      <Block title="Calculer la taille de position">
        <P>
          Capital de 2 000 €, risque de 1 % : ton budget de perte est de 20 €. Avec un stop de 32 points, ton exposition cible est de 20 ÷ 32 = 0,625 € par point.
        </P>
        <P>
          Selon le broker, le lot minimum sur un indice peut être de 0,1 ou de 0,01, et la valeur du point change aussi. Vérifie toujours les spécifications du contrat chez ton broker (sur MT5 : clic droit sur le symbole, puis Spécification).
        </P>
        <Example title="Au lot près">
          <ul className="space-y-1">
            <li>- Sur un CFD NASDAQ courant, 1 lot vaut environ 1 $ par point, soit environ 0,92 €</li>
            <li>- Taille : 0,625 ÷ 0,92 ≈ 0,68 lot, arrondie à 0,6 lot (le pas est de 0,1) : environ 17,70 € de risque</li>
            <li>- Gain visé : environ 35 € si l&apos;objectif est atteint</li>
            <li>- Petit compte de 300 € à 1 % (3 €) : le lot minimum (0,1 lot) risque environ 2,90 €, le trade reste faisable</li>
          </ul>
        </Example>
        <P>
          Vérifie toujours la valeur du point et la taille minimale de ton contrat chez ton broker. Si aucun volume disponible ne respecte le risque fixé, tu renonces au trade (<Link href="/formations/debutant/lecon8" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Débutant 8</Link>).
        </P>
      </Block>

      <Block title="Gérer les scénarios">
        <Points
          items={[
            "Le prix atteint 27 140 : l'hypothèse de continuation est invalidée, la perte est de 1R",
            "Le prix atteint 27 236 : l'objectif est atteint, le gain est de 2R",
            "Le prix réintègre vite l'Opening Range : tu vérifies si le setup reste valide selon ton plan, sans improviser",
            "Tu ne déplaces pas ton stop parce que le prix revient un moment contre toi",
          ]}
        />
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Viser au-delà de la résistance H1", text: "= un objectif placé derrière 27 250 demande au prix de franchir un niveau qui a déjà rejeté les acheteurs." },
          { name: "Calculer le risque en points seulement", text: "= c'est la taille de position qui transforme 32 points en euros." },
          { name: "Arrondir la taille vers le haut", text: "= 0,7 lot dépasserait le budget de 20 € ; on arrondit vers le bas." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "On entre après le breakout et le retest confirmé, pas sur la première mèche.",
          "Le stop correspond à l'invalidation technique du retest.",
          "L'objectif s'arrête avant la résistance H1 et offre au moins deux fois le risque.",
          "La taille de position découle de la distance du stop et du risque en euros, arrondie vers le bas.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Entrée 27 172, stop 27 140, objectif 27 236 : quel est le R/R ?",
            options: ["1:1", "1:2", "1:3"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le gain potentiel n'est pas égal au risque.",
              "Correct. 32 points de risque pour 64 points de gain.",
              "Faux. L'objectif n'est pas trois fois plus loin que le stop.",
            ],
          },
          {
            question: "Pourquoi l'objectif est-il à 27 236 et non à 27 260 ?",
            options: ["Parce qu'une résistance H1 se trouve à 27 250.", "Pour obtenir un R/R plus faible.", "Parce que 27 260 est hors de l'Opening Range."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. L'objectif se place avant la prochaine résistance.",
              "Faux. On ne cherche pas à réduire le R/R.",
              "Faux. L'objectif se trouve de toute façon au-dessus de l'Opening Range.",
            ],
          },
          {
            question: "Budget de 20 €, stop de 32 points, 1 lot ≈ 0,92 € par point : quelle taille retiens-tu ?",
            options: ["0,6 lot", "0,7 lot", "1 lot"],
            correctIndex: 0,
            answerExplanations: [
              "Correct. 20 ÷ 32 ÷ 0,92 ≈ 0,68 : on arrondit vers le bas, à 0,6 lot.",
              "Faux. 0,7 lot risquerait environ 20,60 €, au-dessus du budget.",
              "Faux. 1 lot risquerait environ 29 €.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
