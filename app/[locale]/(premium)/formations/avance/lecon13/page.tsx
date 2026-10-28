import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { Charts, Items, L, Mistakes, Note, P, Revision, Section } from "@/app/components/lessons/LessonBlocks";
import { WyckoffAccumulationDiagram, WyckoffCycleDiagram, WyckoffDistributionDiagram, WyckoffNasdaqDiagram } from "@/app/components/charts/WyckoffDiagrams";

// Trading Avancé 13 — La méthode Wyckoff. Leçon en français seulement (site FR) : toutes les locales
// affichent ce contenu. NASDAQ : niveaux du texte d'origine décalés de +7 000 points. Prérequis de la
// stratégie « Wyckoff appliqué ».

export default function Page() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon13"
      title="La méthode Wyckoff : accumulation et distribution"
      subtitle="Pourquoi un marché reste-t-il des jours en consolidation avant une tendance importante ? Pourquoi un passage sous un support est-il parfois suivi d'une forte hausse ? La méthode Wyckoff propose un cadre pour lire ces comportements à travers le prix, le volume, l'offre et la demande."
      duration="26 min"
      lessonNumber={13}
      prev={{ href: "/formations/avance/lecon12", label: "Leçon 12 : Order Flow" }}
      next={{ href: "/formations/avance/lecon14", label: "Leçon 14 : ICT/SMC, les zones complémentaires" }}
    >

      <Section title="Lire les cycles du marché">
        <Note label="Dans cette leçon">
          les trois lois de Wyckoff, les quatre étapes d&apos;un cycle, les phases et les événements d&apos;une accumulation et d&apos;une distribution, et leur lien avec les supports, résistances et sweeps que tu connais déjà.
        </Note>
        <P last>
          Développée à partir des travaux de Richard D. Wyckoff, la méthode étudie les relations entre le prix, le volume, l&apos;offre et la demande. Son but : comprendre les phases de consolidation, d&apos;accumulation et de distribution qui précèdent souvent les tendances. Tu vas apprendre à reconnaître ses événements principaux et à les relier à la structure de marché.
        </P>
      </Section>

      <Section title="1. Les trois lois de Wyckoff">
        <Items
          items={[
            { label: "L'offre et la demande", detail: "Quand la demande dépasse l'offre disponible aux prix proposés, le marché peut monter ; quand la pression vendeuse domine, il peut reculer. Wyckoff observe ce rapport à travers le déplacement du prix et les volumes." },
            { label: "La cause et l'effet", detail: "Une consolidation peut précéder un mouvement directionnel : la consolidation construit une « cause », le mouvement suivant en est l'« effet ». Certaines approches projettent la taille de l'effet avec des graphiques Point & Figure, mais ces projections restent des estimations." },
            { label: "L'effort et le résultat", detail: "L'effort se lit souvent dans le volume, le résultat dans le déplacement du prix. Un volume en forte hausse avec un prix qui avance peu peut signaler une opposition importante au mouvement." },
          ]}
        />
        <div className="h-4" />
        <Note label="Forex et CFD" last>
          les volumes disponibles sont souvent partiels (volumes de ticks, données d&apos;un fournisseur) : ce n&apos;est pas un volume mondial consolidé (<L href="/formations/avance/lecon10">Avancé 10</L>).
        </Note>
      </Section>

      <Section title="2. Les quatre étapes d'un cycle">
        <Items
          items={[
            { label: "Accumulation", detail: "Après une tendance baissière, le marché évolue dans un range. On cherche à savoir si la pression vendeuse diminue et si une phase haussière se prépare." },
            { label: "Markup", detail: "Le prix quitte la zone d'accumulation et développe une tendance haussière, avec des sommets et des creux en général ascendants." },
            { label: "Distribution", detail: "Après une tendance haussière, le marché consolide. On cherche une éventuelle transition entre la domination des acheteurs et celle des vendeurs." },
            { label: "Markdown", detail: "Le prix quitte la zone de distribution et développe une tendance baissière, avec des sommets et des creux descendants." },
          ]}
        />
        <div className="h-4" />
        <P last>
          Ces quatre étapes forment un modèle de lecture, pas un cycle que chaque marché doit respecter. La stratégie SMC parle d&apos;accumulation, de manipulation et d&apos;expansion (<L href="/strategies/smc/lecon1">SMC, leçon 1</L>) : l&apos;idée est voisine, le vocabulaire et les événements de Wyckoff sont plus détaillés.
        </P>
      </Section>

      <Charts>
        <WyckoffCycleDiagram />
      </Charts>

      <Section title="3. Les phases d'une accumulation">
        <P>
          Le modèle d&apos;accumulation se découpe traditionnellement en cinq phases, de A à E.
        </P>
        <Items
          items={[
            { label: "Phase A : arrêt de la tendance baissière", detail: "PS (Preliminary Support) : premiers signes d'une demande qui freine la baisse. SC (Selling Climax) : ventes intenses, souvent avec une forte amplitude et un volume en hausse. AR (Automatic Rally) : rebond quand la pression vendeuse retombe. ST (Secondary Test) : retour vers la zone basse pour tester à nouveau l'équilibre. Le SC et l'AR délimitent souvent le range." },
            { label: "Phase B : construction du range", detail: "Le prix oscille entre support et résistance, avec plusieurs tests. Cette phase peut durer longtemps : on observe si les mouvements se stabilisent." },
            { label: "Phase C : test de l'offre", detail: "Le Spring : le prix passe brièvement sous le support du range, puis le réintègre. Cette fausse sortie teste l'offre disponible sous la zone. Un Spring n'est pas obligatoire : certaines accumulations s'en passent." },
            { label: "Phase D : signes de force", detail: "SOS (Sign of Strength) : mouvement haussier net, souvent vers ou au-delà de la résistance du range. LPS (Last Point of Support) : correction qui trouve un support après le SOS, et montre si une structure haussière se construit." },
            { label: "Phase E : sortie du range", detail: "Le prix quitte durablement la consolidation et développe une tendance haussière : c'est le Markup." },
          ]}
        />
      </Section>

      <Charts>
        <WyckoffAccumulationDiagram />
      </Charts>

      <Section title="4. Les phases d'une distribution">
        <P>
          La distribution est le modèle opposé.
        </P>
        <Items
          items={[
            { label: "Phase A", detail: "PSY (offre préliminaire) : premiers signes d'une offre importante. BC (Buying Climax) : achats intenses en fin de hausse. AR (Automatic Reaction) : réaction baissière après le sommet. ST (Secondary Test) : retour vers la zone haute." },
            { label: "Phase B", detail: "Le prix construit un range de distribution potentiel ; la structure reste souvent hésitante." },
            { label: "Phase C", detail: "L'UTAD (Upthrust After Distribution) : le prix dépasse brièvement la résistance, puis revient dans le range. Cette fausse sortie peut révéler que le marché ne parvient pas à tenir des prix plus élevés. Un UTAD n'est pas indispensable à une distribution." },
            { label: "Phase D", detail: "SOW (Sign of Weakness) : baisse qui révèle une pression vendeuse importante. LPSY (dernier point d'offre) : rebond faible après le SOW." },
            { label: "Phase E", detail: "Le marché sort du range par le bas et une tendance baissière peut se développer : c'est le Markdown." },
          ]}
        />
      </Section>

      <Charts>
        <WyckoffDistributionDiagram />
      </Charts>

      <Section title="5. Reconnaître Wyckoff sans inventer des phases">
        <P>
          C&apos;est le piège principal. Une consolidation ne prouve pas une accumulation ; un faux breakout au-dessus d&apos;une résistance ne prouve pas une distribution. Il faut lire toute la séquence :
        </P>
        <Items
          items={[
            { label: "Quelle tendance précédait le range ?", detail: "Une accumulation suit une baisse, une distribution suit une hausse." },
            { label: "Quelles sont ses limites ?", detail: "Un support et une résistance prouvés par plusieurs touches." },
            { label: "Comment le prix réagit-il aux extrémités ?", detail: "Rejets nets, ou bornes qui cèdent ?" },
            { label: "Une sortie est-elle suivie d'une réintégration ?", detail: "C'est ce qui distingue un Spring ou un UTAD d'un vrai breakout." },
            { label: "Une nouvelle structure directionnelle apparaît-elle ?", detail: "SOS et LPS, ou SOW et LPSY, la rendent visible." },
          ]}
        />
        <div className="h-4" />
        <P last>
          Les volumes enrichissent cette lecture quand ils sont disponibles et représentatifs. Ne cherche pas à coller une lettre du modèle sur chaque bougie.
        </P>
      </Section>

      <Section title="6. Exemple pratique : une accumulation sur le NASDAQ">
        <P>
          Le NASDAQ chute de 27 300 à 27 000 points, puis commence à consolider. Tu observes un creux à 26 980, un rebond vers 27 180, un retour vers 27 020, puis plusieurs mouvements dans le range.
        </P>
        <P>
          Le prix descend ensuite brièvement à 26 960, sous le bas du range, avant de réintégrer 27 000 : la séquence ressemble à un Spring potentiel. Tu attends une confirmation. Le NASDAQ monte et dépasse un sommet local à 27 100, puis corrige vers 27 070 sans revenir sous le bas du range.
        </P>
        <P last>
          Cette correction peut se lire comme un test de support dans une structure qui s&apos;améliore : l&apos;analyse devient compatible avec une transition vers une phase haussière. L&apos;accumulation ne se confirme pourtant qu&apos;après coup, quand le mouvement suivant se développe.
        </P>
      </Section>

      <Charts>
        <WyckoffNasdaqDiagram />
      </Charts>

      <Section title="7. Wyckoff et les notions déjà étudiées">
        <Items
          items={[
            { label: "Spring", detail: <>Il ressemble à un faux breakout sous un support (<L href="/formations/intermediaire/lecon6">Intermédiaire 6</L>), appelé sweep de liquidité dans le vocabulaire SMC (<L href="/formations/avance/lecon1">Avancé 1</L>).</> },
            { label: "UTAD", detail: "Il ressemble à un faux breakout au-dessus d'une résistance." },
            { label: "SOS", detail: "Il s'accompagne souvent d'une cassure de structure haussière (BOS)." },
            { label: "LPS", detail: <>Il correspond souvent à un retour sur une ancienne résistance devenue support (<L href="/formations/intermediaire/lecon3">Intermédiaire 3</L>).</> },
          ]}
        />
        <div className="h-4" />
        <P last>
          Ces correspondances relient les méthodes sans multiplier les concepts. Les lectures Wyckoff et ICT/SMC ne sont pas pour autant interchangeables : elles n&apos;interprètent pas toujours le même mouvement de la même façon.
        </P>
      </Section>

      <Mistakes
        items={[
          { label: "Voir une accumulation dans chaque range", detail: "Sans baisse préalable ni réaction nette aux bornes, ce n'est qu'une consolidation." },
          { label: "Acheter le Spring sans confirmation", detail: "Un passage sous le support peut aussi être le début d'une vraie baisse." },
          { label: "Forcer une lettre sur chaque bougie", detail: "Certains événements manquent ou sont difficiles à identifier : c'est normal." },
          { label: "Se fier aveuglément au volume", detail: "En Forex et en CFD, le volume affiché ne représente qu'une partie du marché." },
        ]}
      >
        Tu comprends maintenant la logique des cycles Wyckoff et les principaux événements d&apos;accumulation et de distribution. La stratégie <L href="/strategies/wyckoff-applique">Wyckoff appliqué</L>{" "}transforme ces notions en méthode : choisir un setup, attendre une confirmation et construire un trade complet.
      </Mistakes>

      <Revision />

      <LessonKeyPoints
        points={[
          "Wyckoff analyse la relation entre offre, demande, volumes et déplacements du prix.",
          "L'accumulation est une transition possible après une baisse, la distribution une transition possible après une hausse.",
          "Les événements principaux : SC, AR, ST, Spring, SOS, LPS côté accumulation ; BC, UTAD, SOW, LPSY côté distribution.",
          "Les phases A à E servent à organiser l'analyse, pas à prédire.",
          "L'important est de reconnaître les changements progressifs de structure, pas de mémoriser un schéma parfait.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Quel est le rôle principal d'un Spring ?",
            options: ["Un passage bref sous le support du range, suivi d'une réintégration.", "Garantir une tendance haussière.", "Mesurer le spread."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le Spring teste l'offre sous la borne basse, puis le prix revient dans le range.",
              "Faux. Un Spring potentiel peut échouer.",
              "Faux. Le spread n'a rien à voir avec le Spring.",
            ],
          },
          {
            question: "Quel événement correspond en général à un signe de force haussière ?",
            options: ["LPSY", "SOS", "BC"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le LPSY appartient à la distribution.",
              "Correct. SOS signifie Sign of Strength.",
              "Faux. Le Buying Climax apparaît dans les modèles de distribution.",
            ],
          },
          {
            question: "Une accumulation doit-elle obligatoirement comporter un Spring ?",
            options: ["Oui.", "Oui, mais seulement sur le Forex.", "Non."],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Certaines accumulations n'en comportent pas.",
              "Faux. Le marché étudié ne change pas cette règle.",
              "Correct. Le Spring est un événement possible, pas obligatoire.",
            ],
          },
          {
            question: "Que représente un LPS ?",
            options: ["Un retour vers un support après un signe de force.", "Une baisse garantie.", "Un ordre automatique."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le Last Point of Support apparaît après un SOS.",
              "Faux. Ce n'est pas une prédiction de baisse.",
              "Faux. C'est une notion de structure, pas un ordre.",
            ],
          },
          {
            question: "Le prix dépasse brièvement la résistance d'un range après une hausse, puis revient à l'intérieur. De quel événement peut-il s'agir ?",
            options: ["Un Spring.", "Un UTAD.", "Un SOS."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le Spring passe sous le support, pas au-dessus de la résistance.",
              "Correct. L'Upthrust After Distribution est une fausse sortie par le haut, en distribution.",
              "Faux. Un SOS est une poussée haussière qui tient, pas un retour dans le range.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
