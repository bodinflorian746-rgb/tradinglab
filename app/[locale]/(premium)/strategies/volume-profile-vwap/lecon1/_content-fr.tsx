"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { VSVProfileZoneDiagram, VSVStructureDiagram } from "@/app/components/charts/VolumeVWAPStrategyDiagrams";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

export default function ContentFr() {
  return (
    <StrategyLesson
      n={1}
      duration="18 min"
      title="Construire son plan avec le Volume Profile"
      lead="La première étape de la stratégie : lire la direction du marché, repérer où les échanges se sont concentrés et définir à l'avance la zone où une réaction mérite d'être attendue."
      quote="L'objectif n'est pas d'ouvrir immédiatement une position, mais de construire un plan avant que le prix arrive sur une zone importante."
      prereqs={[
        { label: "Volume Profile : POC, Value Area, HVN, LVN", href: "/formations/avance/lecon10", ref: "Trading Avancé 10" },
        { label: "VWAP de séance et VWAP ancré", href: "/formations/avance/lecon11", ref: "Trading Avancé 11" },
        { label: "Order Flow : footprint, delta et CVD", href: "/formations/avance/lecon12", ref: "Trading Avancé 12" },
      ]}
    >
      <Block title="Trois questions avant d'ouvrir une position">
        <P>
          Tu as déjà appris à identifier les supports et résistances, à analyser une tendance et à{" "}
          <Link href="/formations/avance/lecon10" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">utiliser le Volume Profile</Link>{" "}
          pour repérer les zones où l&apos;activité du marché s&apos;est concentrée. Cette stratégie transforme ces connaissances en une méthode.
        </P>
        <P>
          Elle combine trois dimensions de l&apos;analyse : où les échanges se concentrent (Volume Profile), à quel prix moyen ils se réalisent (VWAP) et comment acheteurs et vendeurs interviennent (Order Flow). Pour les élèves qui tradent chez RaiseFX, la méthode pratique repose sur le Volume Profile, le VWAP et la structure du prix ; l&apos;Order Flow reste une confirmation supplémentaire, réservée à ceux qui disposent de données futures adaptées.
        </P>
        <Points
          title="La première étape répond à trois questions"
          items={[
            "Dans quelle direction le marché évolue-t-il ?",
            "Quelles sont les zones de prix les plus intéressantes ?",
            "À quel endroit faut-il attendre une réaction ?",
          ]}
        />
      </Block>

      <Block title="Commencer par la structure du marché" chart={<VSVStructureDiagram />}>
        <P>
          Avant d&apos;afficher le Volume Profile, ouvre ton graphique en H1 et identifie la direction générale à partir des sommets et des creux. En tendance haussière, tu recherches principalement des achats ; en tendance baissière, principalement des ventes. Si la structure n&apos;est pas assez claire, ne force pas ton analyse : cette stratégie privilégie les corrections au sein d&apos;une tendance identifiable.
        </P>
        <Example>
          <p>EUR/USD H1. Premier creux à 1.0800. Premier sommet à 1.0860, un niveau qui a rejeté le prix à deux reprises. Deuxième creux à 1.0830. Breakout de 1.0860, puis deuxième sommet à 1.0910.</p>
          <p>Les sommets et les creux sont ascendants : l&apos;hypothèse principale est haussière. Le prix commence maintenant à corriger : on cherche une zone intéressante pour acheter pendant cette correction.</p>
        </Example>
        <Points
          title="Points actionnables"
          items={[
            "La structure H1 donne le sens : achats en tendance haussière, ventes en tendance baissière",
            "Une structure confuse ne se force pas : on passe à un autre marché",
            "On attend une correction dans la tendance, pas une entrée en plein mouvement",
          ]}
        />
      </Block>

      <Block title="Placer le Volume Profile et définir la zone d'intérêt" chart={<VSVProfileZoneDiagram />}>
        <P>
          Place un Fixed Range Volume Profile sur la dernière consolidation, ou sur la structure pertinente que tu analyses. Le but : repérer les niveaux où le marché a enregistré le plus et le moins de volume. Les valeurs de l&apos;exemple sont fictives et servent à comprendre la méthode.
        </P>
        <Example>
          <p>Le profil, tracé du creux 1.0830 jusqu&apos;au sommet 1.0910, affiche :</p>
          <ul className="space-y-1">
            <li>- VAH : 1.0890</li>
            <li>- POC : 1.0860, qui est aussi la HVN principale</li>
            <li>- VAL : 1.0845</li>
            <li>- LVN supérieure : 1.0895 – 1.0905</li>
          </ul>
          <p>Le POC se situe à 1.0860, exactement sur l&apos;ancienne résistance qui a rejeté le prix deux fois avant d&apos;être cassée : elle peut maintenant servir de support. Cette convergence attire ton attention, et le Volume Profile vient compléter l&apos;analyse technique.</p>
        </Example>
        <P>
          Tu définis une zone d&apos;intérêt entre 1.0855 et 1.0865. Elle réunit deux informations : un support visible dans la structure du prix (l&apos;ancienne résistance cassée) et une forte concentration historique de volume autour du POC. Tu ne places pas d&apos;achat pour autant : tu attends que le prix revienne dans cette zone. Identifier une zone ne signifie pas que tu dois prendre un trade.
        </P>
        <Points
          title="Points actionnables"
          items={[
            "Le profil se trace sur une structure choisie avant de regarder le résultat",
            "On retient un POC qui coïncide avec un support ou une résistance prouvés",
            "La zone d'intérêt se prépare à l'avance ; l'entrée attend le retour du prix",
          ]}
        />
      </Block>

      <Block title="Définir les objectifs potentiels">
        <P>
          Le Volume Profile aide aussi à analyser les zones que le prix pourrait rencontrer après l&apos;entrée. Dans l&apos;exemple, une LVN apparaît entre 1.0895 et 1.0905 : peu de volume y a été échangé sur la période sélectionnée, et le prix pourrait la traverser rapidement si une impulsion suffisamment forte se développe. Juste au-dessus, le dernier sommet à 1.0910 forme la résistance H1 : c&apos;est là que l&apos;on étudie un objectif, en visant juste avant.
        </P>
        <Example title="Le plan d'analyse">
          <ul className="space-y-1">
            <li>- Direction recherchée : achat</li>
            <li>- Zone d&apos;intérêt : 1.0855 – 1.0865</li>
            <li>- Confluence : support (ancienne résistance) et POC</li>
            <li>- Zone de passage potentielle : LVN 1.0895 – 1.0905</li>
            <li>- Résistance à surveiller : 1.0910</li>
          </ul>
        </Example>
        <P>
          Tu disposes d&apos;un plan d&apos;analyse, pas encore d&apos;un signal. Reste à vérifier si les conditions sont réellement favorables à une entrée : c&apos;est le rôle du VWAP, dans la leçon suivante.
        </P>
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Choisir une zone uniquement pour son POC", text: "= une forte concentration de volume n'est pas automatiquement un support. Cherche une convergence avec la structure." },
          { name: "Choisir arbitrairement la période du profil", text: "= le Fixed Range Volume Profile dépend de la période étudiée. Choisis une structure cohérente avant de consulter le résultat." },
          { name: "Prendre une LVN pour une cible certaine", text: "= une LVN décrit une faible concentration de volume passée. Elle ne révèle pas la liquidité actuelle et le prix peut aussi y ralentir." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "La stratégie commence par la tendance, puis utilise le Volume Profile pour sélectionner les zones d'intérêt.",
          "On recherche une convergence entre une zone technique prouvée et une concentration de volume.",
          "Le POC situe l'activité importante ; les HVN et LVN aident à étudier les zones de réaction et les déplacements potentiels.",
          "À ce stade, pas encore de signal d'entrée : une zone de trading à surveiller.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Quelle est la première étape de cette stratégie ?",
            options: [
              "Acheter immédiatement lorsque le prix touche le POC.",
              "Identifier la structure et la direction du marché.",
              "Chercher la bougie qui présente le volume le plus important.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le POC n'est pas un signal automatique.",
              "Correct. L'analyse de la tendance détermine dans quel sens rechercher les opportunités.",
              "Faux. Une seule bougie ne suffit pas à définir la structure du marché.",
            ],
          },
          {
            question: "Pourquoi rechercher un POC proche d'un support technique ?",
            options: [
              "Parce que la convergence apporte une information supplémentaire sur cette zone.",
              "Parce que le prix ne pourra plus passer sous ce niveau.",
              "Parce que le POC permet de connaître les ordres futurs.",
            ],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le support décrit les réactions précédentes du prix, le POC la concentration historique des échanges.",
              "Faux. Aucun niveau technique n'est infranchissable.",
              "Faux. Le Volume Profile décrit des volumes passés et ne révèle pas les ordres futurs.",
            ],
          },
          {
            question: "Une LVN située entre ton entrée potentielle et une résistance peut servir à :",
            options: [
              "Calculer automatiquement ton levier.",
              "Garantir que ton trade sera gagnant.",
              "Identifier une zone de faible volume historique à intégrer dans ton scénario.",
            ],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Le Volume Profile ne calcule pas ton levier.",
              "Faux. Une LVN ne garantit aucun résultat.",
              "Correct. Elle renseigne sur la distribution passée des volumes.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
