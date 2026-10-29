import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { Charts, Items, L, Mistakes, Note, P, Plan, Retail, Revision, Section } from "@/app/components/lessons/LessonBlocks";
import { BullFlagDiagram, DoubleTopDiagram, DoubleTopPlanDiagram, TrianglesDiagram } from "@/app/components/charts/ChartPatternDiagrams";

// Trading Intermédiaire 10 — Les figures chartistes. Leçon en français seulement (site FR) : toutes les
// locales affichent ce contenu. NASDAQ : niveaux du texte d'origine décalés de +7 000 points. Double sommet
// et épaule-tête-épaule déjà expliqués dans la stratégie Reversal (leçons 1 et 2) : court rappel et liens.
// Plan du double sommet corrigé (R/R 1:1,87 du texte d'origine) : entrée au retest de la ligne de cou.

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon10"
      title="Les figures chartistes : continuation et retournement"
      subtitle="Certains enchaînements de mouvements forment des structures reconnaissables : drapeaux, triangles, doubles sommets. Elles signalent une consolidation, une tentative de continuation ou un retournement possible, à condition de les replacer dans leur contexte."
      duration="20 min"
      lessonNumber={10}
      prev={{ href: "/formations/intermediaire/lecon9", label: "Leçon 9 : Fibonacci" }}
      next={{ href: "/formations/intermediaire/lecon11", label: "Leçon 11 : L'ATR" }}
    >

      <Section title="Lire une figure dans son contexte">
        <Note label="Dans cette leçon">
          reconnaître les principales figures de continuation et de retournement, savoir ce qui les confirme, où se trouve leur invalidation et comment en tirer un objectif.
        </Note>
        <P>
          Sur un graphique, tu observes des tendances, des impulsions et des corrections. Certains enchaînements reviennent souvent et forment des structures reconnaissables : les figures chartistes. Elles montrent un marché qui consolide, qui tente de poursuivre sa tendance ou qui donne des signes de retournement.
        </P>
        <P last>
          Une figure ne vaut que dans son contexte : la tendance qui la précède, les niveaux autour d&apos;elle et la confirmation qui la valide.
        </P>
      </Section>

      <Section title="1. Les figures de continuation">
        <P>
          Une figure de continuation apparaît en général après un mouvement directionnel : le marché consolide avant une reprise possible.
        </P>
        <Items
          items={[
            { label: "Le drapeau haussier", detail: "Une forte impulsion haussière (le mât), puis une correction organisée, souvent entre deux lignes parallèles légèrement descendantes. Une clôture au-dessus du haut du drapeau confirme la tentative de continuation ; l'invalidation se place sous un creux de la correction." },
            { label: "Le drapeau baissier", detail: "Le même schéma inversé : une forte impulsion baissière, puis un rebond organisé, souvent légèrement ascendant. Une clôture sous le bas du drapeau peut relancer la baisse." },
            { label: "Le fanion", detail: "Après une impulsion, les amplitudes se contractent dans une petite zone convergente, comme un triangle compact. On surveille la sortie dans le sens de la tendance précédente, sans l'anticiper." },
          ]}
        />
        <div className="h-4" />
        <Note label="Exemple sur le NASDAQ" last>
          le prix monte de 27 000 à 27 200 points, puis corrige dans un petit canal descendant entre 27 180 et 27 120. Une clôture au-dessus du haut du canal signale une tentative de continuation. Sous 27 120, le dernier creux de la correction, le drapeau est invalidé.
        </Note>
      </Section>

      <Charts>
        <BullFlagDiagram />
      </Charts>

      <Section title="2. Les triangles">
        <Items
          items={[
            { label: "Triangle ascendant", detail: "Une résistance à peu près horizontale et des creux ascendants (higher lows) : la pression acheteuse augmente contre la résistance." },
            { label: "Triangle descendant", detail: "Un support à peu près horizontal et des sommets descendants (lower highs) : la pression vendeuse augmente. Une sortie par le bas peut prolonger la baisse, mais certaines figures se résolvent dans l'autre sens." },
            { label: "Triangle symétrique", detail: "Des sommets descendants et des creux ascendants : le prix se contracte. La sortie du triangle indique le scénario retenu." },
          ]}
        />
        <div className="h-4" />
        <Note label="Exemple sur EUR/USD" last>
          les sommets restent proches de 1.0900 tandis que les creux montent : 1.0840, puis 1.0860, puis 1.0880. La résistance est testée plusieurs fois. Une clôture au-dessus de 1.0900 peut constituer le signal de breakout.
        </Note>
      </Section>

      <Charts>
        <TrianglesDiagram />
      </Charts>

      <Section title="3. Les figures de retournement : rappel">
        <P>
          Le double sommet et l&apos;épaule-tête-épaule sont détaillés dans la stratégie Reversal : <L href="/strategies/reversal/lecon1">double top et double bottom</L>, <L href="/strategies/reversal/lecon2">épaule-tête-épaule</L>. L&apos;essentiel à garder en tête :
        </P>
        <Items
          items={[
            { label: "Double sommet (double top)", detail: "Le prix teste deux fois la même résistance, avec un repli entre les deux. Le creux de ce repli forme la ligne de cou : la figure se confirme quand le prix clôture dessous, pas au deuxième contact avec la résistance." },
            { label: "Double creux (double bottom)", detail: "La figure inverse : deux tests d'un support, puis une clôture au-dessus du sommet intermédiaire." },
            { label: "Épaule-tête-épaule (ETE)", detail: "Trois sommets, la tête plus haute que les deux épaules ; la ligne de cou relie les creux intermédiaires. La clôture sous la ligne de cou confirme la tentative de retournement. La version inversée fonctionne dans l'autre sens." },
          ]}
        />
        <div className="h-4" />
        <Note label="Exemple sur l'or" last>
          premier sommet à 3 950 $, creux intermédiaire à 3 920 $, deuxième sommet à 3 948 $. Une clôture sous 3 920 $ peut signaler un retournement baissier.
        </Note>
      </Section>

      <Section title="4. Calculer l'objectif d'une figure">
        <P>
          Certaines figures donnent un objectif théorique à partir de leur hauteur. Pour le double sommet de l&apos;or : sommets proches de 3 950 $, ligne de cou à 3 920 $, soit une hauteur de 30 $. Une projection classique reporte ces 30 $ sous la ligne de cou : objectif théorique 3 890 $.
        </P>
        <P last>
          Avant de le retenir, vérifie les supports entre le prix et l&apos;objectif. Ici, un support se trouve à 3 888 $, juste sous la projection : l&apos;objectif à 3 890 $ reste avant lui. S&apos;il y avait un support plus haut, c&apos;est lui qui limiterait l&apos;objectif. Dans la <L href="/strategies/reversal/lecon1">stratégie Reversal</L>, le take profit se place un peu avant la projection, faute de niveau plus proche : les deux approches suivent la même idée, viser un prix que le marché peut atteindre avant de réagir.
        </P>
      </Section>

      <Charts>
        <DoubleTopDiagram />
      </Charts>

      <Section title="5. Exemple complet : un double sommet sur XAU/USD">
        <P>
          L&apos;or progresse depuis plusieurs séances. Il atteint 3 950 $, corrige jusqu&apos;à 3 920 $, puis remonte à 3 948 $ sans dépasser son premier sommet. Le prix recule ensuite, fait un petit rebond jusqu&apos;à 3 930 $, et une bougie H1 clôture sous la ligne de cou, à 3 918 $.
        </P>
        <P>
          Vendre au marché à 3 918 $, avec un stop à 3 933 $ au-dessus du sommet local 3 930 $ et un objectif à 3 890 $, donne 15 $ de risque pour 28 $ de gain : un R/R de 1:1,87, sous le minimum de 1:2. Ce trade-là n&apos;est pas pris.
        </P>
        <P>
          Après un breakout de la ligne de cou, le prix revient souvent la tester par en dessous. Tu places donc un Sell Limit sur la ligne de cou, à 3 920 $. Le prix remonte jusqu&apos;à 3 923 $, ton ordre est exécuté, et la bougie clôture sous 3 920 $ : l&apos;ancienne ligne de cou joue maintenant le rôle de résistance.
        </P>
        <Plan
          rows={[
            ["Direction", "vente"],
            ["Entrée", "Sell Limit à 3 920 $, sur le retest de la ligne de cou"],
            ["Stop Loss", "3 933 $, au-dessus du sommet local 3 930 $ formé pendant le breakout"],
            ["Take Profit", "3 890 $, projection de la figure, avant le support 3 888 $"],
            ["Risque", "13 $, gain potentiel 30 $ : R/R 1:2,31"],
          ]}
        />
        <P last>
          Le stop n&apos;est pas au-dessus du sommet principal à 3 950 $ : il se place au-dessus de la dernière structure qui invaliderait la vente, le sommet local à 3 930 $. Ce placement n&apos;a de sens que si ce sommet local existe réellement sur le graphique. Si le prix ne revient jamais sur la ligne de cou, l&apos;ordre n&apos;est pas exécuté et tu n&apos;as pas de trade.
        </P>
      </Section>

      <Charts>
        <DoubleTopPlanDiagram />
      </Charts>

      <Retail>
        Au lot minimum (0,01 lot, soit 1 once), ce stop de 13 $ représente environ 12 € de risque : avec la règle des 2 %, ce trade demande au moins 600 € de capital. Sur un compte de 1 000 €, 2 % font 20 € : 0,01 lot (12 €) reste dans la limite, 0,02 lot (24 €) la dépasserait. Gain visé au lot minimum : environ 28 €.
      </Retail>

      <Mistakes
        items={[
          { label: "Chercher des figures partout", detail: "Une ressemblance visuelle ne suffit pas : il faut une tendance avant la figure et des niveaux nets." },
          { label: "Anticiper le breakout", detail: "Une figure non confirmée peut évoluer dans l'autre direction. Attends la clôture au-delà de la ligne de cou ou de la borne." },
          { label: "Ignorer la tendance précédente", detail: "Une figure n'a pas la même portée dans un marché haussier, baissier ou en range." },
          { label: "Placer un stop arbitrairement", detail: "L'invalidation doit correspondre à une structure visible, comme le sommet local du retest." },
          { label: "Oublier les supports et résistances intermédiaires", detail: "Un objectif projeté n'a de valeur que si aucun niveau ne se trouve sur le chemin." },
        ]}
      >
        Tu sais maintenant reconnaître les figures principales et construire un plan à partir de leur breakout ou de leur retest. Dans la prochaine leçon, l&apos;ATR : mesurer l&apos;amplitude habituelle des mouvements pour juger la distance d&apos;un stop.
      </Mistakes>

      <Revision />

      <LessonKeyPoints
        points={[
          "Les figures de continuation (drapeaux, fanions, souvent les triangles) marquent une consolidation après une impulsion.",
          "Les figures de retournement (double sommet, double creux, épaule-tête-épaule) se confirment par une clôture au-delà de la ligne de cou.",
          "L'objectif théorique reporte la hauteur de la figure depuis la ligne de cou, à vérifier face aux supports et résistances.",
          "Si le R/R est trop faible au breakout, le retest de la ligne de cou peut offrir une meilleure entrée.",
          "Une figure chartiste est un scénario à vérifier, pas une prédiction.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Un drapeau haussier apparaît en général après :",
            options: ["Une forte impulsion haussière.", "Une absence totale de mouvement.", "La perte de tous les supports."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le drapeau est une consolidation après une impulsion, le mât.",
              "Faux. L'impulsion fait partie de la figure.",
              "Faux. La perte des supports ne définit pas un drapeau haussier.",
            ],
          },
          {
            question: "Qu'est-ce qui confirme un double sommet ?",
            options: ["Le premier contact avec la résistance.", "Le deuxième contact, sans autre condition.", "Une clôture sous la ligne de cou."],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Un seul sommet ne forme pas la figure.",
              "Faux. Le deuxième sommet ne confirme pas à lui seul le retournement.",
              "Correct. La clôture sous la ligne de cou complète la figure.",
            ],
          },
          {
            question: "Dans un triangle ascendant, tu observes :",
            options: ["Des sommets descendants et un support horizontal.", "Une résistance horizontale et des creux ascendants.", "Trois sommets identiques sans creux."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. C'est la description d'un triangle descendant.",
              "Correct. Les creux montent vers une résistance qui reste à peu près horizontale.",
              "Faux. Cette description ne correspond pas à un triangle ascendant.",
            ],
          },
          {
            question: "Double sommet : sommets à 3 950 $, ligne de cou à 3 920 $. Quel est l'objectif théorique ?",
            options: ["3 905 $", "3 890 $", "3 860 $"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. 3 905 $ ne reporte que la moitié de la hauteur.",
              "Correct. La hauteur de 30 $ se reporte sous la ligne de cou : 3 920 − 30 = 3 890 $.",
              "Faux. 3 860 $ reporte deux fois la hauteur.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
