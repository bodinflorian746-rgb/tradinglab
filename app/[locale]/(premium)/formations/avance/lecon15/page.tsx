import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { Charts, Items, L, Mistakes, Note, P, Plan, Retail, Revision, Section } from "@/app/components/lessons/LessonBlocks";
import { ICTCombinedDiagram, InducementDiagram, JudasSwingDiagram, OpeningGapDiagram, SMTDiagram, TurtleSoupDiagram } from "@/app/components/charts/ICTLiquidityDiagrams";

// Trading Avancé 15 — ICT/SMC, liquidité et timing (seconde moitié de la leçon ICT/SMC fournie par le PO).
// Leçon en français seulement (site FR) : toutes les locales affichent ce contenu. NASDAQ : niveaux du
// texte d'origine décalés de +7 000 points. Judas swing et turtle soup sont proches de notions déjà vues
// (sweep du range asiatique, chasse aux stops) : rappel court et renvois.

export default function Page() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon15"
      title="ICT/SMC : liquidité et timing"
      subtitle="Un petit support qui attire les ordres avant la vraie zone, deux actifs liés qui ne confirment pas le même sommet, un premier mouvement de session qui s'inverse : ces notions précisent où se trouve la liquidité et quand le marché va la chercher."
      duration="24 min"
      lessonNumber={15}
      prev={{ href: "/formations/avance/lecon14", label: "Leçon 14 : ICT/SMC, les zones complémentaires" }}
      next={null}
    >

      <Section title="La liquidité, le moment et l'ouverture">
        <Note label="Dans cette leçon">
          l&apos;inducement, la divergence SMT, le Judas swing, le turtle soup, les gaps d&apos;ouverture (NWOG et NDOG), puis un exemple qui combine plusieurs notions dans un plan de trade complet.
        </Note>
        <P last>
          Ces notions s&apos;appuient sur la <L href="/formations/avance/lecon1">liquidité</L>, les <L href="/formations/avance/lecon4">killzones</L>{" "}et la <L href="/formations/avance/lecon6">chasse aux stops</L>, et sur les zones vues dans la <L href="/formations/avance/lecon14">leçon 14</L>. Ce sont des conventions de lecture : le graphique ne prouve jamais qu&apos;un mouvement a été organisé volontairement.
        </P>
      </Section>

      <Section title="1. L'inducement">
        <P>
          L&apos;inducement désigne un niveau qui attire les ordres des traders avant que le prix ne rejoigne une zone plus importante. C&apos;est souvent un petit support, une petite résistance ou un sommet local bien visible.
        </P>
        <Note label="Exemple sur l'or">
          en tendance haussière, un support majeur se trouve entre 3 890 et 3 900 $, et un support intermédiaire à 3 910 $. Beaucoup de traders achètent à 3 910 $, avec leur stop juste en dessous. Le prix passe sous 3 910 $, déclenche ces stops, puis poursuit jusqu&apos;au support majeur, où il réagit. Dans une lecture ICT/SMC, le support intermédiaire a servi d&apos;inducement.
        </Note>
        <P last>
          L&apos;utilité pratique : hiérarchiser tes niveaux. Distingue les petits niveaux intermédiaires, la liquidité visible juste au-delà, et la vraie zone que tu veux surveiller. Tous les petits creux ne sont pas des pièges, mais acheter le premier support venu, quand une zone plus solide se trouve juste en dessous, expose ton stop.
        </P>
      </Section>

      <Charts>
        <InducementDiagram />
      </Charts>

      <Section title="2. La divergence SMT">
        <P>
          SMT signifie en général Smart Money Technique. Une divergence SMT apparaît quand deux actifs habituellement corrélés ne confirment pas le même nouveau sommet ou le même nouveau creux.
        </P>
        <Note label="EUR/USD et GBP/USD">
          l&apos;EUR/USD dépasse son sommet précédent ; au même moment, le GBP/USD reste sous le sien. Les deux structures ne se confirment pas : le mouvement montre peut-être une faiblesse. La divergence attire l&apos;attention, elle ne prouve pas un retournement.
        </Note>
        <Note label="NASDAQ et S&P 500">
          le NASDAQ inscrit un nouveau plus haut, le S&amp;P 500 ne dépasse pas son sommet correspondant. C&apos;est une information de contexte, à condition que les deux indices aient bien une relation solide sur la période étudiée.
        </Note>
        <Items
          items={[
            { label: "Des périodes cohérentes", detail: "Compare des sommets ou des creux formés au même moment, sur la même unité de temps." },
            { label: "Des actifs liés", detail: "Choisis des actifs dont les mouvements ont habituellement une relation nette (Macro Intermédiaire 5, corrélations)." },
            { label: "Jamais seule", detail: "Une divergence SMT n'est pas un déclencheur d'entrée : elle peut durer sans retournement." },
          ]}
        />
      </Section>

      <Charts>
        <SMTDiagram />
      </Charts>

      <Section title="3. Le Judas swing">
        <P>
          Le Judas swing est un faux mouvement initial, suivi parfois d&apos;un déplacement plus important dans le sens opposé. Il s&apos;étudie surtout autour de l&apos;ouverture des sessions. Tu en connais déjà le mécanisme : le sweep du range asiatique suivi d&apos;une réintégration (<L href="/strategies/ict/lecon3">ICT, leçon 3</L>), la phase de manipulation de la stratégie SMC.
        </P>
        <Note label="Exemple sur GBP/USD" last>
          au début de la session de Londres, le prix dépasse brièvement le sommet formé pendant la session asiatique, puis réintègre le range et commence une baisse plus large. Ce comportement n&apos;apparaît pas tous les jours : le premier mouvement d&apos;une session n&apos;est pas forcément inversé.
        </Note>
      </Section>

      <Charts>
        <JudasSwingDiagram />
      </Charts>

      <Section title="4. Le turtle soup">
        <P>
          Le turtle soup est une approche de fausse sortie d&apos;un plus haut ou d&apos;un plus bas de référence. Le terme vient d&apos;une stratégie de contre-breakout popularisée par Linda Bradford Raschke et Larry Connors, reprise ensuite dans les enseignements ICT. C&apos;est le même phénomène que la <L href="/formations/avance/lecon6">chasse aux stops</L>{" "}et le <L href="/formations/intermediaire/lecon6">faux breakout</L>, appliqué à un niveau de référence (plus haut de la veille, de la semaine). La version d&apos;origine part d&apos;un plus haut ou d&apos;un plus bas de 20 jours et entre dès la réintégration, sur ordre stop. Dans notre version, adaptée au trading intraday, on attend une clôture de retour sous le niveau, puis une confirmation.
        </P>
        <Note label="Exemple sur EUR/USD" last>
          le plus haut de la veille est à 1.0900. Le prix monte à 1.0910, puis clôture de nouveau sous 1.0900. Cette réintégration attire l&apos;attention : le trader attend une confirmation baissière, avec une invalidation au-dessus du sommet de la mèche. Le point clé est de distinguer une simple mèche d&apos;un vrai setup.
        </Note>
      </Section>

      <Charts>
        <TurtleSoupDiagram />
      </Charts>

      <Section title="5. Les gaps d'ouverture : NWOG et NDOG">
        <P>
          Un gap d&apos;ouverture est l&apos;écart entre le dernier prix d&apos;une période et le premier prix de la suivante.
        </P>
        <Items
          items={[
            { label: "NWOG (New Week Opening Gap)", detail: "La zone entre la clôture de référence de la semaine précédente et l'ouverture de la nouvelle semaine." },
            { label: "NDOG (New Day Opening Gap)", detail: "L'écart entre une clôture journalière de référence et l'ouverture du jour suivant, selon la convention horaire utilisée." },
          ]}
        />
        <div className="h-4" />
        <Note label="Exemple sur le NASDAQ">
          la séance de référence clôture à 27 000 points, la suivante ouvre à 27 050 points : la zone 27 000 – 27 050 est un gap d&apos;ouverture. Certains traders surveillent ses limites et son milieu, 27 025, comme repères.
        </Note>
        <P last>
          Les horaires de cotation changent tout : sur le Forex et certains CFD, les gaps dépendent des heures de fermeture et de réouverture de ton fournisseur. Et un gap n&apos;est pas forcément comblé.
        </P>
      </Section>

      <Charts>
        <OpeningGapDiagram />
      </Charts>

      <Section title="6. Exemple combiné sur EUR/USD">
        <P>
          L&apos;EUR/USD évolue dans un range H1 entre 1.0800 et 1.0900. Le prix dépasse brièvement 1.0900 et atteint 1.0910 ; sur la même période, le GBP/USD ne dépasse pas son sommet précédent : divergence SMT potentielle. L&apos;EUR/USD réintègre son range, casse une structure locale haussière et laisse un FVG baissier entre 1.0880 et 1.0890, dont le CE est à 1.0885.
        </P>
        <P>
          Le prix revient dans ce FVG, puis une confirmation baissière apparaît en M15.
        </P>
        <Plan
          rows={[
            ["Entrée à la vente", "1.0883, après la confirmation dans le FVG"],
            ["Stop Loss", "1.0913, au-dessus du sommet de la fausse sortie (1.0910)"],
            ["Take Profit", "1.0823, avant le bas du range 1.0800"],
            ["Risque", "30 pips, gain potentiel 60 pips : R/R 1:2"],
          ]}
        />
        <P last>
          La divergence SMT et le retour dans le FVG nourrissent l&apos;analyse ; l&apos;invalidation repose sur le sommet de la fausse sortie ; l&apos;objectif reste avant le support du bas du range. Ce scénario montre comment combiner les notions, il ne prouve pas leur rentabilité.
        </P>
      </Section>

      <Charts>
        <ICTCombinedDiagram />
      </Charts>

      <Retail>
        Sur un compte de 300 €, la règle des 2 % autorise 6 € de risque. Sur EUR/USD, un lot standard vaut environ 9,20 € par pip : 6 € ÷ 30 pips = 0,20 € par pip, soit 0,02 lot (environ 5,50 € de risque, 11 € de gain visé). Au lot minimum (0,01 lot), le risque est d&apos;environ 2,80 €.
      </Retail>

      <Mistakes
        items={[
          { label: "Voir de l'inducement partout", detail: "Un petit support n'est pas automatiquement un piège : il faut une zone plus solide juste derrière." },
          { label: "Trader chaque divergence SMT", detail: "Une divergence peut durer longtemps sans retournement." },
          { label: "Supposer que la session va s'inverser", detail: "Le Judas swing décrit une possibilité, pas une règle quotidienne." },
          { label: "Vendre chaque mèche au-dessus d'un plus haut", detail: "Le turtle soup demande une réintégration en clôture et une confirmation." },
          { label: "Croire que chaque gap doit être comblé", detail: "Aucun retour au gap n'est garanti." },
        ]}
      >
        Tu connais maintenant les notions ICT/SMC complémentaires de ton parcours. L&apos;objectif reste le même : mieux lire la liquidité et le timing, sans transformer chaque mouvement en scénario institutionnel supposé, et toujours avec une confirmation et un risque maîtrisé.
      </Mistakes>

      <Revision />

      <LessonKeyPoints
        points={[
          "L'inducement aide à distinguer un niveau intermédiaire de la vraie zone à surveiller.",
          "La divergence SMT compare les structures de deux actifs liés ; elle donne un contexte, pas un signal.",
          "Le Judas swing et le turtle soup sont des fausses sorties, à confirmer par une réintégration et une structure.",
          "NWOG et NDOG marquent les gaps d'ouverture ; leur comblement n'est jamais garanti.",
          "Combiner les notions sert à construire un plan précis, pas à multiplier les raisons d'entrer.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Une divergence SMT apparaît quand :",
            options: ["Deux actifs affichent exactement le même prix.", "Deux actifs habituellement corrélés ne confirment pas des sommets ou des creux correspondants.", "Un FVG apparaît sous le prix."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Les actifs n'ont pas besoin d'avoir le même prix.",
              "Correct. La divergence porte sur leurs structures comparées.",
              "Faux. C'est une autre notion.",
            ],
          },
          {
            question: "Un Judas swing veut-il dire que le premier mouvement de Londres sera toujours inversé ?",
            options: ["Oui.", "Non.", "Seulement quand le spread est nul."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Ce modèle n'apparaît pas tous les jours.",
              "Correct. Il décrit un setup possible, pas une loi du marché.",
              "Faux. Le spread ne définit pas le Judas swing.",
            ],
          },
          {
            question: "Support intermédiaire à 3 910 $, support majeur entre 3 890 et 3 900 $. Le prix passe sous 3 910 $. Que fais-tu ?",
            options: ["J'achète tout de suite à 3 910 $.", "J'attends de voir si le prix réagit sur le support majeur, avec une confirmation.", "Je vends, la tendance est forcément cassée."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le support intermédiaire vient de céder : acheter là expose au mouvement vers la zone majeure.",
              "Correct. Le support intermédiaire a peut-être servi d'inducement ; la zone à surveiller est la suivante.",
              "Faux. La tendance haussière n'est pas cassée tant que la structure tient.",
            ],
          },
          {
            question: "Plus haut de la veille à 1.0900 ; le prix monte à 1.0910 puis clôture à 1.0895. De quoi peut-il s'agir ?",
            options: ["D'un turtle soup potentiel, à confirmer.", "D'un breakout confirmé.", "D'un gap d'ouverture."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. La fausse sortie suivie d'une clôture sous le niveau est la base du turtle soup.",
              "Faux. La clôture est revenue sous 1.0900 : le breakout n'a pas tenu.",
              "Faux. Un gap d'ouverture est un écart entre deux séances.",
            ],
          },
          {
            question: "Vente à 1.0883, stop à 1.0913, objectif à 1.0823 : quel est le R/R ?",
            options: ["1:1", "1:2", "1:3"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le gain visé est plus grand que le risque.",
              "Correct. 30 pips de risque pour 60 pips de gain.",
              "Faux. Il faudrait viser 90 pips.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
