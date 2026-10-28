"use client";

import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { WAConfirmationDiagram, WADistributionDiagram, WASpringSequenceDiagram } from "@/app/components/charts/WyckoffStrategyDiagrams";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

// Wyckoff appliqué, leçon 2. Or : même range qu'en leçon 1. NASDAQ : niveaux du texte d'origine décalés de
// +7 000 points. Confirmation M15 : sommet local du LPS à 3 912 $ (et non 3 920 $), pour que le plan de la
// leçon 3 garde un R/R de 1:2 avec un objectif avant la résistance du range.

export default function ContentFr() {
  return (
    <StrategyLesson
      n={2}
      duration="18 min"
      title="Confirmer une accumulation ou une distribution"
      lead="Identifier un range ne suffit pas. Une accumulation possible peut échouer et déboucher sur une nouvelle baisse ; une distribution possible peut se transformer en continuation haussière. La stratégie attend donc un changement de comportement du marché."
      quote="Le Spring n'est pas le signal : on attend le signe de force, puis le retour qui tient, puis la confirmation M15."
      prereqs={[
        { label: "Spring, SOS, LPS, UTAD, SOW, LPSY", href: "/formations/avance/lecon13", ref: "Trading Avancé 13" },
        { label: "Structure de marché : BOS et CHoCH", href: "/formations/intermediaire/lecon1", ref: "Trading Intermédiaire 1" },
        { label: "Entrées de précision", href: "/formations/avance/lecon7", ref: "Trading Avancé 7" },
      ]}
    >
      <Block title="Accumulation : Spring, SOS et LPS" chart={<WASpringSequenceDiagram />}>
        <Example>
          <p>L&apos;or évolue entre 3 880 et 3 960 $ après une baisse. Le prix passe brièvement sous le support, jusqu&apos;à 3 865 $, puis réintègre vite le range : cela ressemble à un Spring potentiel, mais ce n&apos;est pas encore notre signal.</p>
          <p>Nous attendons un signe de force. Le prix monte et dépasse un sommet local à 3 925 $ : si le contexte confirme l&apos;amélioration de la structure, c&apos;est un SOS.</p>
          <p>Nous attendons ensuite une correction. Le prix revient vers 3 905 $ sans repasser sous le Spring, forme un higher low, puis repart : ce retour peut être un LPS.</p>
        </Example>
        <P>
          C&apos;est cette séquence que la stratégie recherche.
        </P>
      </Block>

      <Block title="Pourquoi privilégier le LPS ?">
        <P>
          Acheter pendant le Spring est plus anticipatif : le marché peut continuer à baisser ou ne pas réintégrer durablement le range. Attendre le SOS puis le LPS donne plus d&apos;informations sur la structure. En contrepartie, le prix d&apos;entrée est moins avantageux : nous préférons une confirmation plus avancée à la capture du point bas exact.
        </P>
      </Block>

      <Block title="Distribution : UTAD, SOW et LPSY" chart={<WADistributionDiagram />}>
        <Example>
          <p>Le NASDAQ évolue dans un range après une hausse, avec une résistance à 27 300 points et un support à 27 100 points. Le prix dépasse brièvement 27 300 jusqu&apos;à 27 340, puis réintègre le range : UTAD potentiel.</p>
          <p>Le marché baisse ensuite et casse un support local à 27 180 : signe de faiblesse (SOW). Puis il rebondit vers 27 230 sans retrouver ses sommets précédents : ce rebond peut constituer un LPSY.</p>
          <p>Nous pouvons alors chercher une confirmation de reprise baissière.</p>
        </Example>
      </Block>

      <Block title="Les conditions de confirmation">
        <Points
          title="Pour un achat"
          items={[
            "Une accumulation potentielle",
            "Un Spring ou un autre test du support",
            "Un signe de force (SOS)",
            "Un retour sur une zone de support (LPS)",
            "Une reprise haussière confirmée en M15",
          ]}
        />
        <Points
          title="Pour une vente"
          items={[
            "Une distribution potentielle",
            "Un UTAD ou un autre test de la résistance",
            "Un signe de faiblesse (SOW)",
            "Un rebond vers une résistance (LPSY)",
            "Une reprise baissière confirmée en M15",
          ]}
        />
        <P>
          Le Spring et l&apos;UTAD ne sont pas obligatoires dans tous les modèles Wyckoff ; notre version les privilégie pour rendre la reconnaissance des setups plus précise.
        </P>
      </Block>

      <Block title="La confirmation en M15" chart={<WAConfirmationDiagram />}>
        <P>
          Après le LPS, en M15, l&apos;or forme un creux à 3 905 $, puis un sommet local à 3 912 $. Une bougie M15 clôture au-dessus de ce sommet : c&apos;est le déclencheur du scénario d&apos;achat. Il reste à fixer l&apos;invalidation et à vérifier le ratio risque/rendement, dans la leçon suivante.
        </P>
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Acheter le Spring", text: "= sans signe de force, le passage sous le support peut être le début d'une vraie baisse." },
          { name: "Voir un SOS dans chaque rebond", text: "= le signe de force doit casser un sommet local et améliorer la structure." },
          { name: "Entrer sans confirmation M15", text: "= le LPS n'est qu'une zone tant que le prix n'a pas repris." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "On privilégie les setups Wyckoff qui montrent un changement progressif de structure.",
          "À l'achat : Spring, puis signe de force, puis LPS.",
          "À la vente : UTAD, puis signe de faiblesse, puis LPSY.",
          "La confirmation M15 (clôture au-delà d'un sommet ou d'un creux local) précise l'entrée.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Pourquoi la stratégie privilégie-t-elle un LPS après un SOS ?",
            options: ["Pour voir la structure reprendre avant d'envisager l'entrée.", "Parce que chaque LPS est gagnant.", "Parce que le prix ne peut plus baisser après un SOS."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le LPS montre un retour sur support après un signe de force.",
              "Faux. Le setup peut échouer.",
              "Faux. Un SOS ne garantit pas la poursuite de la hausse.",
            ],
          },
          {
            question: "Que recherches-tu après un SOW dans une distribution ?",
            options: ["Un achat automatique.", "Un rebond faible qui peut former un LPSY, puis une confirmation baissière.", "Un nouveau sommet forcément plus haut que le précédent."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le SOW est un signe de faiblesse.",
              "Correct. Le LPSY est la zone où surveiller la reprise baissière.",
              "Faux. Un nouveau sommet plus haut n'est pas une condition du LPSY.",
            ],
          },
          {
            question: "Quel est le déclencheur d'achat dans notre exemple sur l'or ?",
            options: ["Le passage sous 3 880 $.", "La clôture M15 au-dessus du sommet local 3 912 $, après le LPS.", "Le contact avec la résistance à 3 940 $."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le Spring n'est pas le signal.",
              "Correct. La clôture au-dessus du sommet local confirme la reprise après le LPS.",
              "Faux. La résistance du range est l'endroit où l'objectif s'arrête, pas un déclencheur d'achat.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
