"use client";

import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { ORBBearishBreakDiagram, ORBBreakoutRetestDiagram, ORBH1TrendDiagram } from "@/app/components/charts/ORBDiagrams";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

// Opening Range Breakout, leçon 2. NASDAQ : niveaux du texte d'origine décalés de +7 000 points.

export default function ContentFr() {
  return (
    <StrategyLesson
      n={2}
      duration="16 min"
      title="Identifier un breakout et filtrer les faux signaux"
      lead="Une fois l'Opening Range tracé, le prix finit par dépasser son plus haut ou passer sous son plus bas. Toutes les sorties ne donnent pas une continuation : certaines échouent en quelques minutes. Cette leçon fixe les conditions d'un breakout exploitable."
      quote="Une mèche au-delà du range n'est pas un breakout : on attend une clôture M5, dans le sens de la structure H1, puis le retest."
      prereqs={[
        { label: "Faux breakout", href: "/formations/intermediaire/lecon6", ref: "Trading Intermédiaire 6" },
        { label: "Changement de rôle et retest", href: "/formations/intermediaire/lecon3", ref: "Trading Intermédiaire 3" },
        { label: "Analyse multi-unités de temps", href: "/formations/intermediaire/lecon7", ref: "Trading Intermédiaire 7" },
      ]}
    >
      <Block title="Le breakout haussier : une clôture, pas une mèche">
        <P>
          L&apos;Opening Range va de 27 080 à 27 150. Après 9 h 45, le prix monte vers 27 150, le dépasse brièvement jusqu&apos;à 27 155, puis revient dans le range : pour notre méthode, cette mèche n&apos;est pas un breakout confirmé.
        </P>
        <P>
          Nous attendons une clôture M5 au-dessus du niveau. Quand une bougie clôture à 27 165, nous avons une première confirmation de sortie haussière.
        </P>
      </Block>

      <Block title="Le breakout baissier" chart={<ORBBearishBreakDiagram />}>
        <P>
          Le principe est inversé : le prix doit clôturer sous le plus bas de l&apos;Opening Range. Avec un support à 27 080, une bougie M5 qui clôture à 27 065 donne une première confirmation de sortie baissière. Il reste à vérifier le contexte général.
        </P>
      </Block>

      <Block title="Le filtre de tendance H1" chart={<ORBH1TrendDiagram />}>
        <P>
          Nous utilisons le H1 pour lire la structure principale. Si elle est haussière, nous privilégions les breakouts haussiers ; si elle est baissière, les breakouts baissiers.
        </P>
        <P>
          C&apos;est un filtre propre à notre version de la stratégie. Il fera manquer certains retournements, mais il garde une méthode cohérente d&apos;une séance à l&apos;autre. Le H1 sert aussi à repérer la prochaine résistance (ou le prochain support), qui limitera l&apos;objectif dans la leçon suivante.
        </P>
      </Block>

      <Block title="Le filtre de volatilité">
        <P>
          Nous comparons la largeur de l&apos;Opening Range à la volatilité récente. Un range trop large rend le risque important face à l&apos;objectif disponible ; un range trop étroit produit beaucoup de faux breakouts. Nous n&apos;imposons pas de seuil arbitraire sans backtest : pour chaque setup, nous vérifions que la distance du stop reste cohérente avec l&apos;ATR et les conditions du marché.
        </P>
      </Block>

      <Block title="Le retest du breakout" chart={<ORBBreakoutRetestDiagram />}>
        <P>
          Après une clôture au-dessus de 27 150, le prix revient souvent tester cette ancienne résistance. Si elle se comporte maintenant comme un support et qu&apos;une nouvelle réaction haussière apparaît, l&apos;entrée devient plus précise.
        </P>
        <P>
          Notre version privilégie l&apos;entrée sur retest confirmé. Elle prend moins de trades, car certains breakouts ne reviennent jamais tester le range.
        </P>
        <Example>
          <ul className="space-y-1">
            <li>- Range : 27 080 – 27 150</li>
            <li>- Clôture du breakout : 27 165</li>
            <li>- Retour sur 27 150, creux local à 27 145</li>
            <li>- Le prix casse un sommet M5 à 27 170</li>
          </ul>
          <p>Nous avons un setup de continuation à étudier.</p>
        </Example>
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Acheter la première mèche", text: "= un dépassement sans clôture peut revenir aussitôt dans le range." },
          { name: "Trader contre la structure H1", text: "= notre version privilégie le sens de l'UT supérieure." },
          { name: "Courir après le prix sans retest", text: "= notre version exige le retour sur la borne cassée." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "Un breakout se confirme par une clôture M5 au-delà du range.",
          "On privilégie les breakouts dans le sens de la structure H1.",
          "Le retest de la borne cassée donne une entrée plus précise.",
          "Une sortie du range ne suffit pas si le risque reste incohérent avec la volatilité.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Pourquoi attendre une clôture au-delà du range ?",
            options: ["Pour ne pas prendre chaque mèche pour un breakout confirmé.", "Pour garantir que le prix ne reviendra jamais dans le range.", "Pour éliminer tous les trades perdants."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. La clôture apporte une confirmation supplémentaire.",
              "Faux. Un breakout confirmé peut quand même échouer.",
              "Faux. Aucune règle n'élimine toutes les pertes.",
            ],
          },
          {
            question: "La structure H1 est haussière et le prix clôture sous le plus bas de l'Opening Range. Que fait notre version ?",
            options: ["Elle vend aussitôt.", "Elle ne retient pas ce breakout, contraire à la structure H1.", "Elle achète, le prix est bas."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le filtre H1 privilégie les breakouts dans le sens de la structure.",
              "Correct. Le filtre de tendance écarte ce breakout baissier.",
              "Faux. Acheter sous le range, sans setup, ne correspond à aucune règle.",
            ],
          },
          {
            question: "Après la clôture à 27 165, qu'attend la stratégie avant d'entrer ?",
            options: ["Rien, elle entre tout de suite.", "Un retour sur 27 150 qui tient, puis une reprise haussière.", "Une clôture sous 27 080."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Notre version exige un retest.",
              "Correct. L'ancienne résistance doit jouer le rôle de support, puis le prix doit repartir.",
              "Faux. Une clôture sous 27 080 invaliderait le scénario haussier.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
