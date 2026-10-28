"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ORBRangeDiagram } from "@/app/components/charts/ORBDiagrams";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

// Opening Range Breakout, leçon 1. NASDAQ : niveaux du texte d'origine décalés de +7 000 points. L'exercice
// du texte d'origine est devenu une question du quiz (étape Exercice retirée du site).

export default function ContentFr() {
  return (
    <StrategyLesson
      n={1}
      duration="14 min"
      title="Identifier et tracer l'Opening Range"
      lead="À l'ouverture de la séance américaine, l'activité et les mouvements du prix augmentent nettement. Les premières minutes montrent comment le marché réagit aux informations accumulées pendant la nuit : la stratégie ORB commence par tracer ce range d'ouverture."
      quote="Une fois la fenêtre d'ouverture terminée, ses bornes sont fixées pour la séance : on ne les déplace plus."
      prereqs={[
        { label: "Les types d'ordres (Buy Stop, Sell Stop, Limit)", href: "/formations/debutant/lecon11", ref: "Trading Débutant 11" },
        { label: "Faux breakout", href: "/formations/intermediaire/lecon6", ref: "Trading Intermédiaire 6" },
        { label: "L'ATR et la volatilité", href: "/formations/intermediaire/lecon11", ref: "Trading Intermédiaire 11 et 12" },
      ]}
    >
      <Block title="Comprendre l'Opening Range">
        <P>
          La stratégie Opening Range Breakout (ORB) repère le range formé juste après l&apos;ouverture, puis étudie les possibilités de continuation quand le prix en sort. Nous l&apos;appliquons au NASDAQ, très suivi par les traders intraday.
        </P>
        <P>
          L&apos;Opening Range est la zone comprise entre le plus haut et le plus bas atteints pendant une période définie après l&apos;ouverture. Nous retenons les 15 premières minutes de la séance américaine au comptant, qui commence à 9 h 30 heure de New York, soit 15 h 30 à Paris (14 h 30 certaines semaines de mars et d&apos;octobre, quand les changements d&apos;heure européen et américain ne tombent pas le même jour). Nous analysons donc la période de 9 h 30 à 9 h 45 à New York.
        </P>
        <P>
          Les fenêtres de 5, 15 ou 30 minutes donnent des setups différents. La fenêtre de 15 minutes est un paramètre à tester, pas une durée meilleure que les autres.
        </P>
        <Points
          title="À 9 h 45 (New York), tu traces deux lignes"
          items={[
            "Le plus haut du range : la borne à dépasser pour un achat",
            "Le plus bas du range : la borne à casser pour une vente",
          ]}
        />
      </Block>

      <Block title="Exemple sur le NASDAQ" chart={<ORBRangeDiagram />}>
        <Example>
          <p>Pendant les 15 premières minutes, le NASDAQ évolue entre un plus haut à 27 150 points et un plus bas à 27 080 points. L&apos;Opening Range mesure donc 70 points : résistance à 27 150, support à 27 080.</p>
          <p>Ensuite, trois cas : le prix dépasse la résistance, casse le support, ou reste à l&apos;intérieur du range. La stratégie ne prend pas position dans tous les cas : elle attend une sortie confirmée du range.</p>
        </Example>
      </Block>

      <Block title="La largeur du range compte">
        <P>
          Un range très étroit est franchi par de simples fluctuations ; un range très large impose un stop trop éloigné. Regarde donc l&apos;amplitude du range avant de chercher une entrée. L&apos;<Link href="/formations/intermediaire/lecon11" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">ATR</Link>{" "}aide à la comparer à la volatilité habituelle du NASDAQ, sans qu&apos;aucun seuil universel convienne à toutes les périodes.
        </P>
      </Block>

      <Block title="Quand ne pas préparer de trade">
        <Points
          items={[
            "Conditions d'exécution anormales, spread très élargi ou volatilité exceptionnelle (news majeure à l'ouverture) : tu peux décider de ne pas appliquer la méthode",
            "Pas de nouveau range à chaque bougie : une fois la fenêtre de 15 minutes terminée, les bornes sont fixées pour la séance",
          ]}
        />
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Tracer le range trop tôt", text: "= la première bougie M5 ne représente pas toute la fenêtre. Attends 9 h 45 à New York." },
          { name: "Déplacer les bornes", text: "= un range redessiné en cours de séance ne teste plus la même stratégie." },
          { name: "Oublier l'heure de Paris", text: "= 15 h 30 la plupart du temps, 14 h 30 certaines semaines de changement d'heure." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "L'Opening Range est le plus haut et le plus bas d'une fenêtre précise après l'ouverture.",
          "Notre version utilise les 15 premières minutes de la séance américaine : 9 h 30 – 9 h 45 à New York.",
          "Une fois le range fixé, on surveille ses deux bornes sans les déplacer.",
          "La largeur du range se compare à la volatilité habituelle avant de chercher une entrée.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "À quel moment les bornes du range de 15 minutes sont-elles définitivement fixées ?",
            options: ["À 9 h 30, heure de New York.", "À 9 h 45, heure de New York.", "À la clôture de la journée."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. La première bougie ne représente pas toute la fenêtre.",
              "Correct. On attend la fin des 15 premières minutes.",
              "Faux. Le range est défini bien avant la clôture.",
            ],
          },
          {
            question: "Entre 9 h 30 et 9 h 45 (New York), le NASDAQ fait un plus haut à 27 220 et un plus bas à 27 140. Quelle est la largeur de l'Opening Range ?",
            options: ["60 points", "80 points", "140 points"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. 27 220 − 27 140 ne fait pas 60.",
              "Correct. 27 220 − 27 140 = 80 points.",
              "Faux. La largeur est l'écart entre le plus haut et le plus bas de la fenêtre.",
            ],
          },
          {
            question: "Un jour sans changement d'heure décalé, à quelle heure de Paris commence la fenêtre de l'Opening Range ?",
            options: ["9 h 30", "14 h 30", "15 h 30"],
            correctIndex: 2,
            answerExplanations: [
              "Faux. 9 h 30 est l'heure de New York.",
              "Faux. 14 h 30 ne vaut que certaines semaines de mars et d'octobre.",
              "Correct. 9 h 30 à New York correspond à 15 h 30 à Paris la plupart de l'année.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
