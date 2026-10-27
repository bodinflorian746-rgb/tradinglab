"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { VSVOutcomesDiagram, VSVProfileZoneDiagram, VSVRefusedPlanDiagram, VSVRetainedPlanDiagram, VSVVwapZoneDiagram } from "@/app/components/charts/VolumeVWAPStrategyDiagrams";
import { Block, Example, P, Points, StrategyLesson } from "../_shell";

export default function ContentFr() {
  return (
    <StrategyLesson
      n={4}
      duration="24 min"
      title="Exécuter et gérer un trade complet"
      lead="Toute la méthode sur un même scénario EUR/USD, de l'analyse initiale à la clôture : pourquoi entrer, quand rester à l'écart, où placer le stop et comment calculer le risque."
      quote="Une stratégie ne consiste pas à trouver une raison d'entrer sur le marché. Elle consiste à attendre que toutes les conditions définies soient réunies."
      prereqs={[
        { label: "Volume Profile, VWAP, Order Flow", href: "/formations/avance/lecon10", ref: "Trading Avancé 10 à 12" },
        { label: "Règle de 1 à 2 % de risque par trade", href: "/formations/debutant/lecon8", ref: "Trading Débutant 8" },
        { label: "Zone, filtre et confirmation", href: "/strategies/volume-profile-vwap/lecon3", ref: "Leçons 1 à 3 de cette stratégie" },
      ]}
    >
      <Block title="Étapes 1 et 2 : la tendance et la zone" chart={<VSVProfileZoneDiagram />}>
        <P>
          La méthode réunit trois éléments : le Volume Profile identifie les zones d&apos;intérêt, le VWAP filtre les opportunités, la structure du prix (éventuellement complétée par l&apos;Order Flow) confirme l&apos;entrée. Tous les niveaux utilisés sont fictifs et servent à illustrer la méthode.
        </P>
        <Example>
          <p><span className="text-white font-semibold">Étape 1, la tendance.</span> EUR/USD H1 : creux à 1.0800 puis 1.0830, sommets à 1.0860 puis 1.0910. La structure principale est haussière : on cherche un achat pendant une correction. Le prix évolue autour de 1.0890 et revient vers l&apos;ancienne résistance 1.0860, cassée puis devenue support.</p>
          <p><span className="text-white font-semibold">Étape 2, la zone.</span> Le Fixed Range Volume Profile de la consolidation donne un POC à 1.0860, une VAL à 1.0845 et une VAH à 1.0890 ; la résistance H1 (dernier sommet) est à 1.0910. Zone d&apos;intérêt : 1.0855 – 1.0865. Aucune position tant que le prix n&apos;y revient pas.</p>
        </Example>
      </Block>

      <Block title="Étapes 3 et 4 : le VWAP et la réaction du prix" chart={<VSVVwapZoneDiagram />}>
        <Example>
          <p><span className="text-white font-semibold">Étape 3, le VWAP.</span> En M15, le VWAP de séance se trouve vers 1.0862 quand le marché rejoint le support. Tendance H1 haussière, support technique, POC et VWAP de séance convergent : les conditions pour surveiller une entrée sont réunies.</p>
          <p><span className="text-white font-semibold">Étape 4, la réaction.</span> Le prix atteint 1.0860, forme un creux à 1.0845, rebondit et établit un sommet local à 1.0870. Après une légère correction, une bougie M15 clôture au-dessus de 1.0870 : confirmation haussière à court terme. Le scénario devient exploitable si le R/R est suffisant.</p>
        </Example>
      </Block>

      <Block title="Étape 5 : construire le plan d'entrée" chart={<VSVRefusedPlanDiagram />}>
        <P>
          On retient une entrée à 1.0872, après la confirmation. Le stop-loss est à 1.0842, sous le creux d&apos;invalidation (1.0845). L&apos;objectif est juste avant la résistance de 1.0910, à 1.0906, car le prix peut réagir avant ce niveau.
        </P>
        <Example title="Paramètres du trade">
          <ul className="space-y-1">
            <li>- Actif : EUR/USD, achat</li>
            <li>- Entrée : 1.0872 · Stop-loss : 1.0842 · Take-profit : 1.0906</li>
            <li>- Risque : 1.0872 - 1.0842 = 30 pips</li>
            <li>- Gain potentiel : 1.0906 - 1.0872 = 34 pips</li>
            <li>- R/R : 34 / 30 ≈ 1:1,1</li>
          </ul>
        </Example>
        <P>
          L&apos;objectif ne représente qu&apos;environ 1,1 fois le risque. La règle du site impose un R/R minimum de 1:2 : on ne prend pas la position telle qu&apos;elle est construite. C&apos;est une partie essentielle de la stratégie : une bonne zone et une confirmation correcte ne suffisent pas si le plan de risque n&apos;est pas cohérent.
        </P>
      </Block>

      <Block title="Étape 6 : chercher un meilleur setup" chart={<VSVRetainedPlanDiagram />}>
        <P>
          On ne déplace pas artificiellement le stop pour améliorer le ratio, et on ne place pas un objectif irréaliste pour afficher 1:2. On attend une opportunité qui offre une meilleure relation entre l&apos;entrée, l&apos;invalidation et la résistance suivante.
        </P>
        <Example>
          <p>Le prix revient une seconde fois dans la zone. En M15, il forme un creux à 1.0848, au-dessus du creux d&apos;invalidation, puis un sommet local à 1.0856 ; une bougie clôture au-dessus de 1.0856. Une entrée devient possible à 1.0858, plus près du support.</p>
          <p>Le creux d&apos;invalidation reste 1.0845 : le stop reste à 1.0842. La résistance à surveiller reste 1.0910 : l&apos;objectif reste à 1.0906.</p>
          <ul className="space-y-1">
            <li>- Entrée : 1.0858 · Stop-loss : 1.0842 · Take-profit : 1.0906</li>
            <li>- Risque : 1.0858 - 1.0842 = 16 pips</li>
            <li>- Gain potentiel : 1.0906 - 1.0858 = 48 pips</li>
            <li>- R/R : 48 / 16 = 1:3, avant frais</li>
          </ul>
        </Example>
        <P>
          Cette entrée n&apos;est acceptable que parce qu&apos;une confirmation technique s&apos;est réellement produite au niveau annoncé. Il ne s&apos;agit pas de choisir après coup un prix plus avantageux : le plan est défini avant l&apos;exécution.
        </P>
      </Block>

      <Block title="Étape 7 : calculer la taille de position">
        <Example title="Calcul retail">
          <ul className="space-y-1">
            <li>- Compte de 2 000 €, risque de 1 % (dans la règle de 1 à 2 % vue en <Link href="/formations/debutant/lecon8" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">leçon Débutant 8</Link>) : 2 000 × 1 % = 20 € de perte maximale</li>
            <li>- Stop de 16 pips : 20 ÷ 16 = 1,25 € par pip</li>
            <li>- Sur EUR/USD, un lot standard vaut environ 10 $ par pip, soit environ 9,20 €</li>
            <li>- Taille : 1,25 ÷ 9,20 ≈ 0,13 lot, soit un risque réel d&apos;environ 19 €</li>
            <li>- Petit compte de 300 € à 2 % (6 €) : environ 0,04 lot, le trade reste faisable au lot minimum</li>
          </ul>
        </Example>
        <P>
          La valeur exacte du pip dépend du contrat proposé par ton broker et de la devise de ton compte. Le spread, les commissions et un éventuel glissement peuvent aussi écarter le risque réel du calcul théorique.
        </P>
      </Block>

      <Block title="Étape 8 : gérer la position" chart={<VSVOutcomesDiagram />}>
        <P>Le trade est ouvert dans ce scénario pédagogique. Deux résultats principaux sont possibles.</P>
        <Example title="Scénario A : le stop-loss est touché">
          <p>Le prix revient sous la zone et atteint 1.0842 : la position est clôturée. La perte théorique est de 1R, soit environ 19 €, hors frais ou glissement. Même perdant, le trade a pu respecter toutes les règles : une perte ne signifie pas que l&apos;analyse était mauvaise.</p>
        </Example>
        <Example title="Scénario B : l'objectif est atteint">
          <p>Le marché poursuit sa progression jusqu&apos;à 1.0906 : la position est clôturée avec un gain théorique de 3R, soit environ 57 € avant frais. Le résultat est cohérent avec le ratio défini à l&apos;avance, mais un seul trade ne démontre pas que la stratégie est rentable : il faut analyser un échantillon suffisamment important.</p>
        </Example>
      </Block>

      <Block title="Les règles de la stratégie">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <p className="text-white font-semibold text-sm mb-2">Pour un achat</p>
            <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5">
              <li>Tendance : la structure principale est haussière.</li>
              <li>Volume Profile : le prix revient sur un support prouvé, en confluence avec une zone de volume.</li>
              <li>VWAP : il se trouve près de la zone ou apporte un contexte cohérent avec la tendance.</li>
              <li>Confirmation : réaction haussière et reprise de structure sur l&apos;unité de temps d&apos;entrée.</li>
              <li>Risque : stop sur une invalidation technique, objectif avant la résistance suivante, R/R d&apos;au moins 1:2.</li>
            </ol>
          </div>
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <p className="text-white font-semibold text-sm mb-2">Pour une vente, la logique est inversée</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Structure principale baissière</li>
              <li>- Retour vers une résistance prouvée, en confluence avec une zone de volume</li>
              <li>- VWAP cohérent avec la zone</li>
              <li>- Confirmation baissière sur l&apos;unité de temps d&apos;entrée</li>
              <li>- Stop au-dessus de l&apos;invalidation, objectif avant le support suivant</li>
              <li>- R/R minimum de 1:2</li>
            </ul>
          </div>
        </div>
        <P>
          Confirmation Order Flow facultative : pour les traders qui disposent de données futures adaptées, une absorption ou un delta et un CVD cohérents peuvent constituer une information supplémentaire. Elle ne remplace pas les cinq conditions principales.
        </P>
      </Block>

      <Block title="La checklist avant chaque trade">
        <Points
          items={[
            "La tendance principale est clairement identifiée",
            "La zone de support ou de résistance est définie et prouvée",
            "Le Volume Profile apporte une information pertinente",
            "Le VWAP est cohérent avec le scénario",
            "Une confirmation apparaît sur l'unité de temps d'entrée",
            "Le niveau d'invalidation est identifié",
            "L'objectif est placé avant la prochaine zone technique",
            "Le R/R atteint au moins 1:2",
            "La taille de position correspond au risque accepté",
            "Les conditions de marché permettent une exécution raisonnable",
          ]}
        />
        <P>
          Si une condition essentielle manque, tu ne forces pas l&apos;entrée. Prochaine étape : appliquer la méthode sur des graphiques historiques, enregistrer le résultat de chaque setup et vérifier son espérance sur un échantillon représentatif. Cette validation est indispensable avant toute utilisation en conditions réelles.
        </P>
      </Block>

      <LessonKeyPoints
        points={[
          "Chaque outil a sa fonction : le Volume Profile situe les zones d'activité, le VWAP donne le prix moyen pondéré, la structure définit la tendance et confirme l'entrée.",
          "L'Order Flow complète l'analyse pour les traders qui disposent de données futures adaptées.",
          "La gestion du risque décide si un setup mérite d'être exécuté : un R/R sous 1:2 se refuse, même dans une bonne zone.",
          "La stratégie consiste à attendre que toutes les conditions soient réunies, pas à trouver une raison d'entrer.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Tu identifies un support, un POC et un VWAP au même niveau, mais aucune confirmation haussière n'apparaît. Que fais-tu ?",
            options: [
              "Tu achètes immédiatement.",
              "Tu attends une confirmation avant d'envisager l'entrée.",
              "Tu augmentes le levier pour compenser l'incertitude.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Une zone de confluence ne suffit pas.",
              "Correct. La confirmation fait partie des conditions de la méthode.",
              "Faux. Le levier n'améliore pas la qualité d'un setup.",
            ],
          },
          {
            question: "Ton trade a un stop de 30 pips et un objectif de 34 pips. La règle impose un R/R minimum de 1:2. Que fais-tu ?",
            options: [
              "Tu refuses ce setup tel quel.",
              "Tu prends le trade parce que le Volume Profile est favorable.",
              "Tu déplaces le stop sans justification technique.",
            ],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le ratio est inférieur au minimum défini dans le plan.",
              "Faux. La confluence ne remplace pas la gestion du risque.",
              "Faux. Le stop doit correspondre à une invalidation technique cohérente.",
            ],
          },
          {
            question: "Tu risques 20 € sur un trade avec un R/R de 1:3. Quel est le gain théorique si l'objectif est atteint ?",
            options: ["20 €.", "40 €.", "60 €."],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Ce montant correspond au risque initial.",
              "Faux. Ce serait un gain de 2R.",
              "Correct. Trois fois 20 € font 60 €, avant frais.",
            ],
          },
          {
            question: "Quel rôle joue l'Order Flow dans cette stratégie pour un trader qui utilise principalement des CFD ?",
            options: [
              "Il est absolument indispensable.",
              "Il constitue une confirmation facultative lorsqu'on dispose de données futures adaptées.",
              "Il remplace le stop-loss.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. La méthode principale s'applique avec la structure du prix, le Volume Profile et le VWAP.",
              "Correct. L'Order Flow peut enrichir l'analyse lorsqu'on dispose des données appropriées.",
              "Faux. Aucun indicateur ne remplace la gestion du risque.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
