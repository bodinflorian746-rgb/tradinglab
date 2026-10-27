"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { VSVAbsorptionDiagram, VSVConfirmationDiagram } from "@/app/components/charts/VolumeVWAPStrategyDiagrams";
import { Block, Example, P, Points, StrategyLesson } from "../_shell";

export default function ContentFr() {
  return (
    <StrategyLesson
      n={3}
      duration="20 min"
      title="Confirmer son entrée avec la structure du prix et l'Order Flow"
      lead="La zone est identifiée et filtrée par le VWAP. Reste la question essentielle : à quel moment envisager le trade ? Deux méthodes de confirmation, qui n'offrent pas le même niveau d'information mais poursuivent le même objectif."
      quote="Nous ne prenons pas de position uniquement parce que plusieurs indicateurs se trouvent au même niveau : nous attendons une réaction cohérente avec notre scénario."
      prereqs={[
        { label: "Order Flow : Bid, Ask, footprint, delta, CVD, absorption", href: "/formations/avance/lecon12", ref: "Trading Avancé 12" },
        { label: "Volume Profile", href: "/formations/avance/lecon10", ref: "Trading Avancé 10" },
        { label: "VWAP", href: "/formations/avance/lecon11", ref: "Trading Avancé 11" },
        { label: "La zone et le filtre VWAP", href: "/strategies/volume-profile-vwap/lecon2", ref: "Leçon 2 de cette stratégie" },
      ]}
    >
      <Block title="La confirmation par la structure du prix" chart={<VSVConfirmationDiagram />}>
        <P>
          La première méthode repose sur la structure du prix : elle s&apos;applique sur les graphiques Forex et CFD. Reprenons le scénario EUR/USD : tendance H1 haussière, zone d&apos;intérêt autour de 1.0860 (support, POC, VWAP proche). Le prix revient vers 1.0860 ; rien ne dit encore que la correction est terminée. On passe en M15.
        </P>
        <Example>
          <p><span className="text-white font-semibold">Première observation, une réaction haussière.</span> Le prix atteint 1.0860, descend jusqu&apos;à 1.0845, puis rebondit. C&apos;est une première information, mais une simple bougie haussière ne suffit pas à confirmer la fin de la correction.</p>
          <p><span className="text-white font-semibold">Deuxième observation, un sommet local à franchir.</span> Après son rebond, le prix forme un sommet local à 1.0870, corrige légèrement sans casser son dernier creux, puis une bougie M15 clôture au-dessus de 1.0870. Cette cassure du sommet local peut confirmer la reprise haussière à court terme.</p>
          <p><span className="text-white font-semibold">Troisième observation, l&apos;invalidation.</span> Le dernier creux significatif est à 1.0845. Si le marché passe sous ce niveau, l&apos;hypothèse de reprise haussière perd sa validité.</p>
        </Example>
        <Points
          title="Tu disposes de trois éléments"
          items={[
            "Une zone d'intérêt identifiée à l'avance",
            "Une confirmation haussière sur M15",
            "Un niveau d'invalidation technique : de quoi construire un plan d'entrée cohérent",
          ]}
        />
      </Block>

      <Block title="La confirmation avec l'Order Flow" chart={<VSVAbsorptionDiagram />}>
        <P>
          La seconde méthode utilise les données d&apos;Order Flow des marchés futures : elle s&apos;adresse aux traders qui disposent des données et des outils nécessaires. L&apos;Order Flow montre les transactions exécutées au Bid et à l&apos;Ask, et les déséquilibres entre achats et ventes agressifs. Sur un contrat future correspondant à l&apos;actif analysé, on peut rechercher une absorption acheteuse.
        </P>
        <Example title="Exemple d'absorption acheteuse">
          <p>Le prix revient sur une zone de support importante. De nombreuses ventes agressives sont exécutées, mais le prix ne parvient pas à poursuivre sa baisse : des acheteurs passifs absorbent peut-être une partie importante des ventes. Si une reprise haussière apparaît ensuite dans la structure du prix, cette observation renforce l&apos;analyse.</p>
        </Example>
        <P>
          Il faut distinguer les deux marchés : un contrat future EUR/USD et une paire EUR/USD négociée en CFD ne sont pas le même instrument. Leurs prix sont proches, mais leurs données de transaction et leurs conditions d&apos;exécution diffèrent. L&apos;Order Flow des futures n&apos;est donc pas une représentation directe de toutes les transactions Forex ou CFD.
        </P>
      </Block>

      <Block title="Le delta et le CVD, des informations complémentaires">
        <P>
          Le{" "}
          <Link href="/formations/avance/lecon12" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">delta</Link>{" "}
          mesure le déséquilibre entre les volumes classés comme achats agressifs et ventes agressives ; le CVD cumule ces déséquilibres dans le temps. Un prix qui forme un nouveau creux pendant que le CVD n&apos;en forme pas présente une divergence intéressante, comme sur le graphique ci-dessus. Elle ne suffit pas à elle seule : dans cette stratégie, elle reste secondaire par rapport à la structure du prix.
        </P>
      </Block>

      <Block title="Construire une règle de confirmation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <p className="text-white font-semibold text-sm mb-2">Méthode Forex et CFD</p>
            <ol className="space-y-1 text-sm text-zinc-300 list-decimal pl-5">
              <li>La structure H1 est haussière.</li>
              <li>Le prix revient sur un support identifié avec le Volume Profile.</li>
              <li>Le VWAP se situe à proximité de cette zone.</li>
              <li>Une confirmation haussière apparaît en M15, avec un niveau d&apos;invalidation identifiable.</li>
            </ol>
            <p className="text-sm text-zinc-400 mt-2">Pour une vente, la logique est inversée.</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-950/60 rounded-xl p-4">
            <p className="text-white font-semibold text-sm mb-2">Avec des données futures, en complément</p>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>- Une absorption cohérente avec le scénario</li>
              <li>- Des déséquilibres de volume pertinents</li>
              <li>- Un delta et un CVD compatibles avec la réaction observée</li>
            </ul>
            <p className="text-sm text-zinc-400 mt-2">Ces observations ne remplacent pas la confirmation technique.</p>
          </div>
        </div>
      </Block>

      <Block title="Quand ne pas entrer ?">
        <Points
          items={[
            <><span className="text-white font-semibold">Absence de confirmation :</span> le prix atteint la zone mais ne montre aucune reprise de structure. Tu attends.</>,
            <><span className="text-white font-semibold">Invalidation du niveau :</span> le marché casse le support et construit une structure baissière. Tu abandonnes le scénario d&apos;achat.</>,
            <><span className="text-white font-semibold">Objectif trop proche :</span> la résistance suivante est trop près de l&apos;entrée pour offrir le R/R minimum de 1:2. Tu ne prends pas le trade.</>,
            <><span className="text-white font-semibold">Volatilité exceptionnelle :</span> une news importante provoque des mouvements rapides, un spread plus large ou une exécution difficile. Tu réévalues le scénario plutôt que de supposer que les niveaux habituels seront respectés.</>,
          ]}
        />
        <P>
          Tu sais maintenant confirmer une entrée en associant le Volume Profile, le VWAP et la structure du prix, et comment l&apos;Order Flow peut enrichir cette lecture avec des données adaptées. La dernière leçon réunit toutes les étapes pour construire, exécuter et gérer un trade complet.
        </P>
      </Block>

      <LessonKeyPoints
        points={[
          "La confirmation fait passer d'une zone d'intérêt à un setup potentiellement exploitable.",
          "Sur Forex et CFD, la confirmation repose principalement sur la structure du prix.",
          "Footprint, delta et CVD apportent des informations supplémentaires aux traders qui disposent de données futures adaptées.",
          "Plusieurs indicateurs au même niveau ne suffisent pas : on attend une réaction cohérente, puis on vérifie que le risque et l'objectif rendent le trade acceptable.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Pourquoi attendre une cassure de structure sur M15 après le retour du prix sur un support ?",
            options: [
              "Pour obtenir une confirmation supplémentaire de reprise dans le sens du scénario.",
              "Parce que tous les breakouts entraînent des tendances durables.",
              "Parce que le Volume Profile ne fonctionne plus lorsque le prix touche un support.",
            ],
            correctIndex: 0,
            answerExplanations: [
              "Correct. La confirmation permet d'observer une évolution concrète de la structure.",
              "Faux. Un breakout peut échouer ou être rapidement réintégré.",
              "Faux. Le Volume Profile conserve son rôle d'analyse de l'activité passée.",
            ],
          },
          {
            question: "Quel phénomène peut suggérer une absorption acheteuse ?",
            options: [
              "Une hausse du prix sans aucune transaction.",
              "De nombreuses ventes agressives accompagnées d'une baisse limitée du prix.",
              "Un spread qui devient obligatoirement nul.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. L'évolution du prix ne permet pas de conclure à une absence de transactions.",
              "Correct. Une liquidité acheteuse passive peut limiter l'impact des ventes agressives.",
              "Faux. L'absorption n'implique pas la disparition du spread.",
            ],
          },
          {
            question: "Un élève qui trade uniquement des CFD chez RaiseFX doit-il posséder un footprint futures pour appliquer la méthode principale ?",
            options: [
              "Oui, sans exception.",
              "Oui, parce que son compte CFD contient toutes les transactions de la bourse.",
              "Non : il peut utiliser la structure du prix comme confirmation et réserver l'Order Flow à une analyse spécialisée.",
            ],
            correctIndex: 2,
            answerExplanations: [
              "Faux. La méthode pratique repose sur la structure du prix et les zones identifiées.",
              "Faux. Les données CFD ne correspondent pas nécessairement à celles d'une bourse futures centralisée.",
              "Correct. La confirmation technique est accessible sans prétendre disposer de données futures détaillées.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
