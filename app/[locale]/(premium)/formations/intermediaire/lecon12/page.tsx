import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { Charts, Items, L, Mistakes, Note, P, Plan, Retail, Revision, Section } from "@/app/components/lessons/LessonBlocks";
import { ContractionExpansionDiagram, NewsSpikeDiagram, VolatilityRegimesDiagram, VolatilityRRDiagram } from "@/app/components/charts/VolatilityDiagrams";

// Trading Intermédiaire 12 — La volatilité. Leçon en français seulement (site FR) : toutes les locales
// affichent ce contenu. NASDAQ : niveaux du texte d'origine décalés de +7 000 points. Exemple de news
// corrigé : 1.0880 → 1.0830 font 50 pips entre le plus haut et le plus bas (80 pips parcourus au total).

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon12"
      title="La volatilité : les changements de rythme du marché"
      subtitle="Certains jours, l'EUR/USD avance lentement dans un range étroit ; d'autres, une news le fait bouger de dizaines de pips en quelques minutes. Comprendre la volatilité aide à choisir ses setups, à placer ses stops et à savoir quand ne rien faire."
      duration="18 min"
      lessonNumber={12}
      prev={{ href: "/formations/intermediaire/lecon11", label: "Leçon 11 : L'ATR" }}
      next={null}
    >

      <Section title="Qu'est-ce que la volatilité ?">
        <Note label="Dans cette leçon">
          aller au-delà de la lecture de l&apos;ATR : comprendre pourquoi le marché accélère ou ralentit, reconnaître ses environnements et adapter tes stops, tes objectifs et tes setups.
        </Note>
        <P>
          La volatilité désigne l&apos;importance des variations du prix sur une période donnée. Un marché très volatil fait des mouvements amples ; un marché peu volatil évolue avec des variations limitées.
        </P>
        <Items
          items={[
            { label: "Volatilité historique (ou réalisée)", detail: "Les fluctuations déjà observées sur le graphique. C'est celle qui nous intéresse en Forex et en CFD, et celle que mesure l'ATR (leçon 11)." },
            { label: "Volatilité implicite", detail: "Déduite du prix des options : l'estimation, par le marché des options, de la volatilité à venir." },
          ]}
        />
      </Section>

      <Section title="Pourquoi la volatilité change">
        <Items
          items={[
            { label: "Les sessions", detail: "L'EUR/USD ne se comporte pas de la même façon pendant la session asiatique, à l'ouverture européenne ou pendant le chevauchement Europe / États-Unis : l'activité varie selon l'heure (Avancé 4, Killzones)." },
            { label: "Les news économiques", detail: "Inflation, décisions des banques centrales, chiffres de l'emploi : une publication différente des attentes peut provoquer des ajustements rapides sur l'EUR/USD, l'or et les indices, dans un sens qui dépend du contexte." },
            { label: "La liquidité", detail: "Quand peu d'ordres sont disponibles aux meilleurs prix, une transaction importante déplace davantage le prix, et le spread peut s'élargir." },
            { label: "Les événements imprévus", detail: "Une nouvelle géopolitique, une intervention monétaire ou une information inattendue change brutalement les conditions de marché." },
          ]}
        />
      </Section>

      <Section title="Les quatre environnements à reconnaître">
        <Items
          items={[
            { label: "Tendance, volatilité modérée", detail: "Le prix progresse ou baisse de façon structurée ; les corrections restent lisibles et les niveaux plus faciles à exploiter." },
            { label: "Tendance, forte volatilité", detail: "Grandes bougies, corrections brutales : les opportunités peuvent être nombreuses, mais chaque erreur d'exécution coûte plus cher." },
            { label: "Range, faible volatilité", detail: "Le prix oscille entre des bornes proches ; les impulsions sont limitées et les breakouts manquent souvent de suivi." },
            { label: "Marché agité sans direction", detail: "De grands mouvements dans les deux sens, sans tendance stable : un environnement difficile pour une stratégie de continuation." },
          ]}
        />
        <div className="h-4" />
        <P last>Une forte volatilité ne crée pas à elle seule une bonne opportunité.</P>
      </Section>

      <Charts>
        <VolatilityRegimesDiagram />
      </Charts>

      <Section title="Contraction et expansion">
        <P>
          Une contraction apparaît quand l&apos;amplitude des bougies diminue : le marché forme un range étroit, un triangle ou une consolidation. Une expansion apparaît quand les mouvements deviennent nettement plus amples, après un breakout, une news ou un changement de dynamique. Une contraction peut précéder une expansion, sans en indiquer ni le moment ni la direction.
        </P>
        <Note label="Exemple sur le NASDAQ" last>
          le prix évolue entre 27 100 et 27 140 points pendant une longue période : un range de 40 points. Après l&apos;ouverture américaine, il franchit 27 140 et forme des bougies plus amples. Le marché semble passer de la contraction à l&apos;expansion : tu surveilles si le breakout se confirme ou si le prix réintègre vite le range.
        </Note>
      </Section>

      <Charts>
        <ContractionExpansionDiagram />
      </Charts>

      <Section title="Exemple : une news sur EUR/USD">
        <P>
          L&apos;EUR/USD cote 1.0850 avant une publication américaine importante, avec un spread habituel faible. À la publication, le prix monte vite à 1.0880, puis redescend à 1.0830 avant de se stabiliser : 50 pips entre le plus haut et le plus bas, et 80 pips parcourus en quelques minutes (30 à la hausse, puis 50 à la baisse).
        </P>
        <P>
          Avec un stop de 10 pips, le premier aller-retour suffit à le toucher. L&apos;élargissement du spread et le glissement peuvent en plus modifier le prix réel d&apos;exécution. Le problème ne vient pas forcément de la direction de ton analyse : ce sont les conditions de volatilité qui ont changé.
        </P>
        <Note label="Adapter ton approche" last>
          ton plan peut prévoir de ne pas ouvrir de nouvelle position avant une news majeure, puis d&apos;attendre que le prix forme une nouvelle structure exploitable. Ce n&apos;est pas une règle universelle, mais un filtre qui t&apos;évite les conditions qui ne conviennent pas à ta stratégie.
        </Note>
      </Section>

      <Charts>
        <NewsSpikeDiagram />
      </Charts>

      <Section title="Volatilité et ratio risque/rendement">
        <P>
          Deux journées sur l&apos;or, même support à 3 900 $, même résistance à 3 940 $, même entrée à 3 912 $ après une réaction sur le support.
        </P>
        <Plan
          title="Journée A : ATR M15 de 5 $"
          rows={[
            ["Stop techniquement cohérent", "3 902 $, sous le creux de la réaction (10 $)"],
            ["Objectif technique", "3 937 $, avant la résistance (25 $)"],
            ["R/R", "1:2,5 : le trade respecte le plan"],
          ]}
        />
        <Plan
          title="Journée B : ATR M15 de 15 $"
          rows={[
            ["Stop techniquement cohérent", "3 882 $, sous le creux de la réaction, bien plus profond (30 $)"],
            ["Objectif technique", "3 937 $, la même résistance (25 $)"],
            ["R/R", "environ 1:0,83 : sous le minimum de 1:2, le trade est refusé"],
          ]}
        />
        <P last>
          La journée B est plus volatile, mais l&apos;objectif disponible ne bouge pas : seul le stop s&apos;élargit. Une volatilité élevée n&apos;améliore donc pas automatiquement les opportunités.
        </P>
      </Section>

      <Charts>
        <VolatilityRRDiagram />
      </Charts>

      <Retail>
        Journée A : au lot minimum (0,01 lot, soit 1 once), ce stop de 10 $ représente environ 9,20 € de risque, pour environ 23 € de gain visé. Avec la règle des 2 %, il faut au moins 460 € de capital. Journée B : le même lot minimum risquerait environ 27,60 € pour 23 € de gain, un trade que la règle du R/R refuse de toute façon.
      </Retail>

      <Section title="Adapter ta stratégie aux conditions">
        <P>
          Une stratégie de breakout souffre dans un marché qui réintègre sans cesse ses ranges. Une stratégie de rebond sur support est mise en difficulté par une tendance puissante qui traverse les niveaux sans correction. Tu dois connaître les conditions dans lesquelles ta méthode est censée fonctionner.
        </P>
        <Items
          items={[
            { label: "Une structure haussière identifiable", detail: "Pour une stratégie de continuation à l'achat, c'est le point de départ." },
            { label: "Une volatilité suffisante", detail: "Le marché doit pouvoir atteindre l'objectif dans un délai raisonnable." },
            { label: "Des corrections avec une invalidation claire", detail: "Elles donnent un stop placé sous une structure, pas au hasard." },
            { label: "Un objectif cohérent avec le stop", detail: "Au moins deux fois le risque, avant la prochaine résistance." },
          ]}
        />
        <div className="h-4" />
        <P last>
          Si ces conditions disparaissent, tu n&apos;es pas obligé de prendre position. Pour les news, la stratégie <L href="/strategies/macro-trading">Macro Trading</L>{" "}détaille un filtre complet avant chaque publication.
        </P>
      </Section>

      <Mistakes
        items={[
          { label: "Chercher un marché qui bouge beaucoup", detail: "Cherche plutôt un marché dont le comportement correspond à ta méthode." },
          { label: "Garder les mêmes stops quel que soit le régime", detail: "Un stop pensé pour un marché calme est touché par le bruit d'un marché agité." },
          { label: "Trader une news sans plan", detail: "Spread élargi, glissement, allers-retours : la publication change les conditions d'exécution." },
          { label: "Prendre une contraction pour une prédiction", detail: "Elle précède parfois une expansion, sans en donner la direction." },
        ]}
      >
        Avec l&apos;ATR et la lecture des régimes de marché, tu as deux outils complémentaires pour adapter ton trading aux conditions réelles. Le niveau Avancé commence par la liquidité, puis va jusqu&apos;à Wyckoff et aux notions ICT/SMC complémentaires.
      </Mistakes>

      <Revision />

      <LessonKeyPoints
        points={[
          "La volatilité mesure l'importance des fluctuations ; elle varie selon les sessions, la liquidité et les news.",
          "Quatre environnements : tendance calme, tendance agitée, range calme, marché agité sans direction.",
          "Une contraction peut précéder une expansion, sans en prédire la direction.",
          "Une volatilité plus forte élargit le stop sans rapprocher l'objectif : le R/R peut devenir insuffisant.",
          "Une stratégie s'utilise dans l'environnement pour lequel elle a été pensée.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Un marché très volatil est-il forcément plus facile à trader ?",
            options: ["Oui, car les gains sont garantis.", "Non, car les risques d'exécution et l'ampleur des pertes augmentent aussi.", "Oui, car les spreads disparaissent."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. La volatilité ne garantit aucun résultat.",
              "Correct. Des mouvements plus amples augmentent aussi les risques.",
              "Faux. Les spreads peuvent au contraire s'élargir.",
            ],
          },
          {
            question: "Qu'est-ce qu'une contraction de volatilité ?",
            options: ["Une diminution de l'amplitude des mouvements.", "Une hausse garantie du marché.", "Une augmentation automatique du nombre de traders."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Les fluctuations deviennent moins amples.",
              "Faux. La contraction ne donne pas de direction.",
              "Faux. Elle ne mesure pas le nombre de participants.",
            ],
          },
          {
            question: "Pourquoi une stratégie peut-elle devenir moins adaptée quand la volatilité change ?",
            options: ["Parce que les supports n'existent plus.", "Parce que les graphiques cessent de fonctionner.", "Parce que les amplitudes, les stops et le comportement du prix changent."],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Les niveaux existent toujours, mais les réactions peuvent être différentes.",
              "Faux. Les graphiques représentent toujours les prix.",
              "Correct. Le changement de régime modifie les conditions auxquelles la stratégie est exposée.",
            ],
          },
          {
            question: "Journée B sur l'or : stop cohérent de 30 $, objectif disponible de 25 $. Que fais-tu ?",
            options: ["Tu prends le trade, la volatilité est forte.", "Tu refuses le trade : le R/R est d'environ 1:0,83.", "Tu rapproches le stop à 12 $ pour obtenir 1:2."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Une forte volatilité ne compense pas un R/R insuffisant.",
              "Correct. Sous le minimum de 1:2, le trade ne respecte pas le plan.",
              "Faux. Un stop à 12 $ serait au-dessus de l'invalidation technique : il serait touché par le bruit du marché.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
