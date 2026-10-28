"use client";

import Link from "next/link";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { Block, Example, Mistakes, P, Points, StrategyLesson } from "../_shell";

// Wyckoff appliqué, leçon 4 : règles finales, setups refusés, backtest. R/R minimum de 1:2 et risque de
// 1 à 2 % : règles du site.

export default function ContentFr() {
  return (
    <StrategyLesson
      n={4}
      duration="18 min"
      title="Les règles finales et le backtest de Wyckoff appliqué"
      lead="Wyckoff devient vite subjectif si chaque mouvement est réinterprété après coup. Pour l'éviter, cette leçon fixe des règles précises, qui permettent de sélectionner les setups avant de connaître leur résultat, puis de les tester."
      quote="Tu n'augmentes pas ton risque parce qu'un setup semble particulièrement convaincant."
      prereqs={[
        { label: "Backtesting : valider sa stratégie", href: "/formations/avance/lecon9", ref: "Trading Avancé 9" },
        { label: "Journaling", href: "/formations/avance/lecon8", ref: "Trading Avancé 8" },
        { label: "La méthode Wyckoff", href: "/formations/avance/lecon13", ref: "Trading Avancé 13" },
      ]}
    >
      <Block title="Les règles d'achat">
        <Points
          items={[
            <><span className="text-white font-medium">Contexte</span>{" "}: une baisse préalable, puis un range identifiable</>,
            <><span className="text-white font-medium">Structure</span>{" "}: un test de la borne basse, éventuellement un Spring suivi d&apos;une réintégration</>,
            <><span className="text-white font-medium">Force</span>{" "}: une progression compatible avec un SOS, qui casse un sommet local</>,
            <><span className="text-white font-medium">Zone de retour</span>{" "}: une correction vers un support, qui peut former un LPS</>,
            <><span className="text-white font-medium">Déclencheur</span>{" "}: une confirmation haussière en M15, par exemple une clôture au-dessus d&apos;un sommet local</>,
            <><span className="text-white font-medium">Risque</span>{" "}: stop sous l&apos;invalidation, objectif avant la résistance du range, R/R d&apos;au moins 1:2, 1 à 2 % du compte</>,
          ]}
        />
      </Block>

      <Block title="Les règles de vente">
        <Points
          items={[
            <><span className="text-white font-medium">Contexte</span>{" "}: une hausse préalable, puis un range identifiable</>,
            <><span className="text-white font-medium">Structure</span>{" "}: un test de la borne haute, éventuellement un UTAD suivi d&apos;une réintégration</>,
            <><span className="text-white font-medium">Faiblesse</span>{" "}: une baisse compatible avec un SOW, qui casse un support local</>,
            <><span className="text-white font-medium">Zone de retour</span>{" "}: un rebond vers une résistance, qui peut former un LPSY</>,
            <><span className="text-white font-medium">Déclencheur</span>{" "}: une confirmation baissière en M15</>,
            <><span className="text-white font-medium">Risque</span>{" "}: stop au-dessus de l&apos;invalidation, objectif avant le support du range, R/R d&apos;au moins 1:2, 1 à 2 % du compte</>,
          ]}
        />
      </Block>

      <Block title="Les setups à refuser">
        <Points
          items={[
            "Le range n'est pas clairement identifiable",
            "Les événements Wyckoff ne correspondent pas aux conditions définies",
            "La confirmation M15 est absente",
            "L'objectif technique est trop proche : R/R sous 1:2 avant la borne du range",
            "Le stop nécessaire entraîne un risque supérieur à celui prévu, même au lot minimum",
          ]}
        />
        <P>
          Tu n&apos;augmentes pas ton risque parce qu&apos;un setup semble particulièrement convaincant.
        </P>
      </Block>

      <Block title="Évaluer la stratégie sur TradingView">
        <P>
          Utilise les données historiques de tes actifs habituels sur une période déterminée. Avance progressivement dans le graphique sans regarder les bougies suivantes (<Link href="/formations/avance/lecon9" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">Avancé 9</Link>). À chaque setup potentiel, note :
        </P>
        <Example title="Le journal de test">
          <ul className="space-y-1">
            <li>- Actif : EUR/USD, or, NASDAQ</li>
            <li>- Unité de temps du contexte : H1</li>
            <li>- Type de setup : accumulation ou distribution</li>
            <li>- Événement principal : Spring, SOS, LPS, UTAD, SOW, LPSY</li>
            <li>- Confirmation M15 : oui ou non</li>
            <li>- Entrée, Stop Loss, Take Profit : niveaux exacts</li>
            <li>- R/R initial : valeur calculée</li>
            <li>- Résultat : gain ou perte en R</li>
          </ul>
        </Example>
        <P>
          Cette méthode permet de comparer les setups de façon cohérente.
        </P>
      </Block>

      <Block title="Pourquoi un seul bon trade ne suffit pas">
        <P>
          Tu repères une accumulation parfaite sur le NASDAQ, tu prends un trade fictif à 1:3 et l&apos;objectif est atteint. Le résultat est intéressant, mais une réussite isolée ne démontre rien. Il faut évaluer assez de setups, y compris ceux qui échouent.
        </P>
        <P>
          Pour limiter les biais : des règles définies à l&apos;avance, des frais intégrés, et une partie des données gardée de côté pour une vérification hors échantillon.
        </P>
        <Example title="Un échantillon fictif de 100 trades">
          <ul className="space-y-1">
            <li>- 40 gagnants à +2R : +80R</li>
            <li>- 60 perdants à −1R : −60R</li>
            <li>- Résultat brut : +20R, soit une espérance de +0,20R par trade avant frais</li>
          </ul>
        </Example>
        <P>
          Ce résultat théorique ne prouve pas que la stratégie atteint réellement ces performances : seul un test rigoureux, sur des données adaptées, permet d&apos;en évaluer le comportement.
        </P>
      </Block>

      <Block title="La checklist avant chaque trade">
        <Points
          items={[
            "La tendance précédente est identifiable",
            "Le range a des bornes cohérentes, prouvées par plusieurs touches",
            "Le comportement du prix correspond au scénario Wyckoff recherché",
            "Un signe de force ou de faiblesse apparaît",
            "Un LPS ou un LPSY est identifiable",
            "Une confirmation technique apparaît en M15",
            "L'invalidation est claire",
            "L'objectif reste avant la borne opposée du range",
            "Le R/R atteint au moins 1:2",
            "La taille de position respecte le risque maximal",
          ]}
        />
      </Block>

      <Mistakes
        title="Les erreurs à éviter"
        items={[
          { name: "Réinterpréter le graphique après coup", text: "= les étiquettes Wyckoff se posent avant le résultat, avec les règles écrites." },
          { name: "Juger la méthode sur un trade", text: "= une réussite isolée ne démontre aucune rentabilité." },
          { name: "Oublier les frais", text: "= une espérance de +0,20R peut fondre avec les coûts réels." },
        ]}
      />

      <LessonKeyPoints
        points={[
          "La stratégie repose sur une transition identifiable entre consolidation et tendance.",
          "À l'achat : un signe de force suivi d'un LPS confirmé ; à la vente : un signe de faiblesse suivi d'un LPSY confirmé.",
          "Chaque position a une entrée, une invalidation et un objectif avant la borne du range.",
          "Les setups s'enregistrent et se testent avant toute conclusion sur leur rentabilité.",
          "Le but n'est pas de prédire chaque accumulation, mais de reconnaître le moment où le marché confirme une direction.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Pourquoi attendre un LPS après un SOS ?",
            options: ["Pour entrer après un signe de force et une correction structurée.", "Parce qu'un LPS garantit une hausse.", "Parce que le marché ne peut plus revenir dans le range."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. La stratégie préfère une confirmation à l'anticipation du point bas.",
              "Faux. Un LPS potentiel peut échouer.",
              "Faux. Le marché peut réintégrer le range.",
            ],
          },
          {
            question: "Que signifie un SOW ?",
            options: ["Un signal automatique d'achat.", "Un signe de faiblesse dans la structure Wyckoff.", "Une hausse garantie des volumes."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le SOW n'est pas une instruction d'achat.",
              "Correct. SOW signifie Sign of Weakness.",
              "Faux. Le SOW se lit dans le prix et le contexte, pas dans une hausse garantie du volume.",
            ],
          },
          {
            question: "Pourquoi tester la stratégie sur de nombreux setups ?",
            options: ["Pour garantir les mêmes résultats à l'avenir.", "Pour supprimer définitivement les trades perdants.", "Pour évaluer sa performance et les conditions où elle fonctionne ou échoue."],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Les performances passées ne garantissent pas les résultats futurs.",
              "Faux. Les pertes restent possibles.",
              "Correct. Un échantillon permet d'étudier la robustesse du système.",
            ],
          },
        ]}
      />
    </StrategyLesson>
  );
}
