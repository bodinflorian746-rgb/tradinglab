"use client";

import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { WAFailedSpringDiagram, WAGoldPlanDiagram, WANasdaqPlanDiagram, WARefusedDiagram } from "@/app/components/charts/WyckoffStrategyDiagrams";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

// Wyckoff appliqué, leçon 3. Plan sur l'or corrigé : l'objectif du texte d'origine (3 962 $) dépassait le
// haut du range (3 960 $) ; il se place avant la résistance du range (3 940 $), et l'entrée se prend sur la
// confirmation M15 du LPS (3 914 $) pour garder un R/R de 1:2. L'entrée plus tardive (3 922 $) devient
// l'exemple du plan refusé (1:0,8). NASDAQ : niveaux du texte d'origine décalés de +7 000 points.

export default function ContentFr() {
  return (
    <StrategyLesson
      n={3}
      duration="22 min"
      title="Construire les trades : entrée, stop et objectif"
      lead="Un setup Wyckoff intéressant ne suffit pas : il faut le traduire en niveaux précis. Deux exemples fictifs, un achat sur l'or et une vente sur le NASDAQ, puis deux cas où l'on ne trade pas."
      quote="Il ne faut pas inventer un objectif plus éloigné pour améliorer le ratio affiché : l'objectif s'arrête avant la résistance."
      prereqs={[
        { label: "Plan de trade", href: "/formations/intermediaire/lecon8", ref: "Trading Intermédiaire 8" },
        { label: "Gestion du risque : le money management", href: "/formations/debutant/lecon8", ref: "Trading Débutant 8" },
        { label: "La méthode Wyckoff", href: "/formations/avance/lecon13", ref: "Trading Avancé 13" },
      ]}
    >
      <Block title="Accumulation sur XAU/USD" chart={<WAGoldPlanDiagram />}>
        <P>
          L&apos;or a baissé, puis formé un range entre 3 880 et 3 960 $, avec un support entre 3 880 et 3 900 $ et une résistance entre 3 940 et 3 960 $. Il a fait un Spring potentiel à 3 865 $, puis un signe de force au-dessus de 3 925 $. La correction forme un LPS vers 3 905 $ ; en M15, le prix casse un sommet local à 3 912 $.
        </P>
        <Example title="Plan d'achat">
          <ul className="space-y-1">
            <li>- Entrée : 3 914 $, après la clôture M15 au-dessus de 3 912 $</li>
            <li>- Stop Loss : 3 902 $, sous le creux du LPS (3 905 $)</li>
            <li>- Take Profit : 3 938 $, avant la résistance du range qui commence à 3 940 $</li>
            <li>- Risque 12 $ par once, gain potentiel 24 $ : R/R 1:2</li>
          </ul>
        </Example>
        <P>
          Le stop se trouve sous le niveau qui remet en cause la reprise haussière : si le LPS cède, le scénario tombe. L&apos;objectif reste sous la résistance du range : le prix y a déjà été rejeté deux fois, et rien ne dit qu&apos;il la franchira cette fois. Le sommet du signe de force, à 3 933 $, n&apos;a été atteint qu&apos;une fois : ce n&apos;est pas une résistance prouvée, il ne limite donc pas l&apos;objectif. Il peut freiner la hausse : surveille la réaction du prix à son passage.
        </P>
      </Block>

      <Block title="Le même LPS, une entrée trop tardive" chart={<WARefusedDiagram />}>
        <P>
          Si tu attends que le prix casse le sommet suivant, à 3 920 $, l&apos;entrée se fait à 3 922 $. Le stop nécessaire reste sous le LPS, à 3 902 $ (20 $), mais la résistance du range n&apos;est plus qu&apos;à 18 $ : objectif 3 938 $ (16 $), R/R 1:0,8.
        </P>
        <P>
          Notre méthode exige au moins 1:2 : ce trade ne respecte pas le plan. N&apos;invente pas un objectif au-delà de la résistance pour améliorer le ratio affiché : tu renonces, ou tu attends un nouveau setup.
        </P>
      </Block>

      <Block title="Distribution sur le NASDAQ" chart={<WANasdaqPlanDiagram />}>
        <P>
          Après une hausse, le NASDAQ forme un range entre 27 100 et 27 300 points. Le prix fait un UTAD potentiel à 27 340, revient sous la résistance, puis casse un support local à 27 180 (SOW). Il rebondit et forme un LPSY vers 27 230 ; en M15, une reprise baissière se confirme.
        </P>
        <Example title="Plan de vente">
          <ul className="space-y-1">
            <li>- Entrée : 27 205</li>
            <li>- Stop Loss : 27 245, au-dessus du sommet du LPSY (27 230)</li>
            <li>- Take Profit : 27 125, au-dessus du support du range (27 100)</li>
            <li>- Risque 40 points, gain potentiel 80 points : R/R 1:2</li>
          </ul>
        </Example>
        <P>
          L&apos;objectif s&apos;arrête au-dessus du support du range, pour tenir compte d&apos;une éventuelle réaction avant lui. Le creux du SOW, vers 27 140, n&apos;a été touché qu&apos;une fois : ce n&apos;est pas un support prouvé, il ne limite donc pas l&apos;objectif, mais le prix peut y marquer une pause.
        </P>
      </Block>

      <Block title="Calculer le risque">
        <Example title="Vente NASDAQ, compte de 3 000 € à 1 %">
          <ul className="space-y-1">
            <li>- Budget de risque : 30 €</li>
            <li>- Exposition cible : 30 ÷ 40 = 0,75 € par point</li>
            <li>- Sur un CFD NASDAQ courant, 1 lot ≈ 1 $ par point, soit environ 0,92 € : 0,75 ÷ 0,92 ≈ 0,82, arrondi à 0,8 lot (environ 29,40 € de risque)</li>
            <li>- Petit compte de 300 € à 2 % (6 €) : le lot minimum (0,1 lot) risque environ 3,70 €, le trade reste faisable</li>
          </ul>
        </Example>
        <Example title="Achat sur l'or, même compte">
          <ul className="space-y-1">
            <li>- Au lot minimum (0,01 lot, soit 1 once), le stop de 12 $ représente environ 11 € de risque</li>
            <li>- Avec 30 € de budget : 0,02 lot (environ 22 €) ; 0,03 lot (environ 33 €) dépasserait</li>
            <li>- Avec la règle des 2 %, ce trade demande au moins 550 € de capital</li>
          </ul>
        </Example>
        <P>
          La taille exacte dépend des spécifications du contrat de ton broker. Si la taille minimale dépasse ton budget de risque, ne force pas l&apos;entrée.
        </P>
      </Block>

      <Block title="Quand le Spring échoue" chart={<WAFailedSpringDiagram />}>
        <P>
          L&apos;or descend sous le support à 3 880 $. Tu anticipes un Spring, mais le marché ne réintègre pas le range : il accélère vers le bas. Ce n&apos;est pas un Spring confirmé selon notre lecture : tu n&apos;achètes pas.
        </P>
        <P>
          C&apos;est un point central : un setup Wyckoff n&apos;existe pas parce qu&apos;on lui donne un nom. Il doit être confirmé par le comportement du prix.
        </P>
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Viser au-delà du range", text: "= la résistance du range a déjà rejeté le prix : l'objectif s'arrête avant." },
          { name: "Entrer trop tard sur le LPS", text: "= chaque sommet cassé rapproche l'entrée de la résistance et fait chuter le R/R." },
          { name: "Acheter un Spring qui ne réintègre pas", text: "= un passage sous le support sans retour est une baisse, pas un Spring." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "Un trade Wyckoff demande une structure identifiable, une confirmation, une invalidation et un objectif cohérent.",
          "Le stop se place là où le scénario échoue : sous le LPS, au-dessus du LPSY.",
          "L'objectif s'arrête avant la borne opposée du range ; si le R/R tombe sous 1:2, on renonce.",
          "La taille de position respecte le budget de risque, arrondie vers le bas.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Où places-tu le stop d'un achat après un LPS confirmé ?",
            options: ["À un niveau choisi au hasard.", "Sous l'invalidation technique du LPS.", "Toujours à 10 pips de l'entrée."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le risque doit être lié à la structure.",
              "Correct. Le stop se place sous le niveau qui remet en cause le scénario.",
              "Faux. Une distance fixe ne convient pas à tous les actifs.",
            ],
          },
          {
            question: "Tu risques 40 points pour en viser 80. Quel est ton R/R ?",
            options: ["1:1", "1:3", "1:2"],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Le gain potentiel est plus grand que le risque.",
              "Faux. Le gain n'est pas trois fois plus grand que le risque.",
              "Correct. Tu vises deux fois le risque initial.",
            ],
          },
          {
            question: "Entrée à 3 922 $, stop à 3 902 $, résistance du range à 3 940 $ : que fais-tu ?",
            options: ["Je vise 3 962 $ pour obtenir 1:2.", "Je renonce : l'objectif possible (3 938 $) donne un R/R de 1:0,8.", "Je rapproche le stop à 3 915 $."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Viser au-delà de la résistance invente un objectif pour améliorer le ratio.",
              "Correct. Sous 1:2, le trade ne respecte pas le plan.",
              "Faux. Un stop au-dessus du LPS ne correspond plus à l'invalidation.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
