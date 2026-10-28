"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ORBFakeBreakoutDiagram, ORBNoRetestDiagram } from "@/app/components/charts/ORBDiagrams";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

// Opening Range Breakout, leçon 4. NASDAQ : niveaux du texte d'origine décalés de +7 000 points. R/R minimum
// de 1:2 et risque de 1 à 2 % : règles du site.

export default function ContentFr() {
  return (
    <StrategyLesson
      n={4}
      duration="18 min"
      title="Appliquer, contrôler et évaluer la stratégie ORB"
      lead="Une stratégie n'est exploitable que si ses règles sont assez précises pour être répétées et testées. Cette leçon fixe le protocole complet, montre deux séances où l'on ne trade pas, et explique comment évaluer la méthode sur des dizaines de séances."
      quote="Un breakout spectaculaire n'est pas un trade conforme : on suit les règles écrites avant la séance, pas le mouvement du moment."
      prereqs={[
        { label: "Backtesting : valider sa stratégie", href: "/formations/avance/lecon9", ref: "Trading Avancé 9" },
        { label: "Journaling", href: "/formations/avance/lecon8", ref: "Trading Avancé 8" },
        { label: "Faux breakout", href: "/formations/intermediaire/lecon6", ref: "Trading Intermédiaire 6" },
      ]}
    >
      <Block title="Les règles de notre version ORB">
        <Points
          items={[
            "Actif principal : NASDAQ",
            "Référence : ouverture américaine à 9 h 30 heure de New York (15 h 30 à Paris, 14 h 30 certaines semaines)",
            "Opening Range : les 15 premières minutes",
            "Analyse principale : H1 ; confirmation et entrée : M5",
            "Direction : de préférence dans le sens de la structure H1",
            "Signal : clôture M5 au-delà du range, puis retest et reprise dans le sens du breakout",
            "Stop Loss : sous le creux du retest pour un achat, au-dessus de son sommet pour une vente",
            "Objectif : avant la prochaine résistance (ou le prochain support) H1, avec un R/R d'au moins 1:2",
            "Risque : 1 à 2 % du compte par trade, taille calculée au lot près",
          ]}
        />
        <P>
          Ces paramètres définissent une version précise de la stratégie à tester ; ils ne démontrent pas sa rentabilité.
        </P>
      </Block>

      <Block title="Quand ne pas trader">
        <Points
          items={[
            "Le breakout n'est pas confirmé par une clôture M5",
            "Le prix réintègre immédiatement le range et invalide le scénario",
            "Le retest ne se produit pas : notre version exige ce retour",
            "Le stop nécessaire est disproportionné face à l'objectif disponible (R/R sous 1:2)",
            "Une news ou des conditions d'exécution rendent le plan inadapté : tu réévalues la séance",
          ]}
        />
      </Block>

      <Block title="Exemple d'un trade refusé" chart={<ORBNoRetestDiagram />}>
        <Example>
          <p>Opening Range : 27 080 – 27 150. Le prix casse 27 150 et atteint très vite 27 260, sans jamais revenir tester le range.</p>
          <p>Tu pourrais être tenté d&apos;acheter pour ne pas manquer le mouvement. Notre méthode exige un retest confirmé : le trade n&apos;est pas pris. Ce choix respecte la stratégie, même si le marché poursuit sa hausse.</p>
        </Example>
      </Block>

      <Block title="Exemple d'un faux breakout" chart={<ORBFakeBreakoutDiagram />}>
        <Example>
          <p>Le prix dépasse 27 150 et clôture à 27 160. Il revient sur 27 150, mais ne tient pas la zone : une nouvelle bougie clôture à 27 120, de retour dans le range.</p>
          <p>Le setup d&apos;achat n&apos;est pas confirmé : nous abandonnons le scénario. Nous ne le transformons pas automatiquement en vente : trader les faux breakouts est une autre stratégie, avec ses propres règles.</p>
        </Example>
      </Block>

      <Block title="Backtester la méthode">
        <P>
          Pour évaluer la stratégie, analyse par exemple 100 séances historiques (<Link href="/formations/avance/lecon9" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Avancé 9</Link>). Pour chaque séance, note :
        </P>
        <Points
          items={[
            "Le contexte H1",
            "Le haut et le bas de l'Opening Range",
            "La présence ou non d'un breakout, puis d'un retest",
            "Le signal de confirmation",
            "L'entrée, le stop et l'objectif",
            "Le résultat en multiples du risque (R)",
            "Les frais estimés et les conditions d'exécution",
          ]}
        />
        <P>
          Les séances sans trade s&apos;enregistrent aussi : elles montrent la fréquence réelle des opportunités. Le but est de savoir si les règles produisent une espérance positive sur les données étudiées.
        </P>
      </Block>

      <Block title="Lire les résultats">
        <Example title="Un test fictif de 100 trades">
          <ul className="space-y-1">
            <li>- 45 gagnants à +2R : +90R</li>
            <li>- 55 perdants à −1R : −55R</li>
            <li>- Total : +35R avant frais, soit une espérance de +0,35R par trade</li>
          </ul>
        </Example>
        <P>
          Une stratégie peut donc être positive avec moins de 50 % de trades gagnants. Ces chiffres sont entièrement fictifs : ils ne disent rien de la performance réelle de notre version ORB, qui dépendra du marché, des paramètres, des coûts et de la qualité du test.
        </P>
        <P>
          Avant toute utilisation réelle, teste cette version sur des données historiques puis en compte de démonstration, en tenant compte des frais et des conditions de ton broker.
        </P>
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Entrer sans retest", text: "= la peur de rater le mouvement fait sortir de la méthode testée." },
          { name: "Transformer un faux breakout en vente", text: "= c'est une autre stratégie, qui demande ses propres règles et son propre test." },
          { name: "Oublier les séances sans trade", text: "= sans elles, le backtest surestime la fréquence des opportunités." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "La stratégie ORB repose sur un range fixé au début de la séance.",
          "Notre version utilise une fenêtre de 15 minutes, une confirmation M5 et un retest.",
          "Les règles de risque se fixent avant l'entrée : stop sous l'invalidation, objectif avant le niveau H1, R/R d'au moins 1:2.",
          "Le backtest étudie les résultats sur un ensemble de séances, y compris celles sans trade.",
          "Un breakout spectaculaire n'est pas forcément un trade conforme à la stratégie.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Le prix casse le range mais ne revient jamais faire le retest exigé. Que fais-tu ?",
            options: ["Tu entres malgré tout.", "Tu ne prends pas le trade.", "Tu doubles le risque."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Ce n'est pas la version étudiée.",
              "Correct. Le retest fait partie des conditions.",
              "Faux. Augmenter le risque ne remplace pas un setup absent.",
            ],
          },
          {
            question: "Pourquoi enregistrer les séances sans trade ?",
            options: ["Pour mesurer la fréquence réelle des opportunités.", "Pour les compter comme des positions gagnantes.", "Parce que chaque séance doit produire une entrée."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Elles montrent à quelle fréquence la méthode s'applique vraiment.",
              "Faux. Une absence de position n'est pas un trade gagnant.",
              "Faux. Une stratégie peut légitimement ne donner aucun signal.",
            ],
          },
          {
            question: "Sur 100 trades fictifs, 45 gagnent +2R et 55 perdent −1R. Quel est le résultat avant frais ?",
            options: ["−10R", "+35R", "+90R"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Les gains (+90R) dépassent les pertes (−55R).",
              "Correct. 45 × 2R − 55 × 1R = +35R, soit +0,35R par trade.",
              "Faux. +90R ne compte que les gagnants.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
