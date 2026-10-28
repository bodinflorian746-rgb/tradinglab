import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { Charts, Items, L, Mistakes, Note, P, Revision, Section } from "@/app/components/lessons/LessonBlocks";
import { BPRDiagram, BreakerBlockDiagram, CEDiagram, IFVGDiagram, MitigationBlockDiagram, PremiumDiscountDiagram } from "@/app/components/charts/ICTZoneDiagrams";

// Trading Avancé 14 — ICT/SMC, les zones complémentaires (première moitié de la leçon ICT/SMC fournie par
// le PO ; la seconde, liquidité et timing, est l'Avancé 15). Leçon en français seulement (site FR) : toutes
// les locales affichent ce contenu. Order Blocks, FVG, mitigation et PD Arrays déjà expliqués ailleurs :
// renvois vers ces leçons. Premium et Discount n'étaient que nommés (PD Array) : expliqués ici.

export default function Page() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon14"
      title="ICT/SMC : les zones complémentaires"
      subtitle="Order Blocks et Fair Value Gaps changent parfois de rôle : une zone cassée peut devenir une résistance, un FVG traversé peut repousser le prix dans l'autre sens. Cette leçon approfondit ces zones et la façon de situer le prix dans un range."
      duration="24 min"
      lessonNumber={14}
      prev={{ href: "/formations/avance/lecon13", label: "Leçon 13 : Wyckoff" }}
      next={{ href: "/formations/avance/lecon15", label: "Leçon 15 : ICT/SMC, liquidité et timing" }}
    >

      <Section title="Aller plus loin que l'Order Block et le FVG">
        <Note label="Dans cette leçon">
          le Breaker Block et le Mitigation Block, l&apos;Inverse FVG, le Consequent Encroachment, le Balanced Price Range, puis les zones Premium et Discount d&apos;un range.
        </Note>
        <P>
          Tu as déjà étudié les notions principales : <L href="/formations/avance/lecon1">liquidité</L>, <L href="/formations/avance/lecon2">Fair Value Gap</L>, <L href="/formations/avance/lecon3">Order Blocks</L>, killzones, OTE, chasse aux stops. Cette leçon ne reprend pas leurs définitions : elle approfondit les zones qui complètent cette lecture.
        </P>
        <P last>
          Les termes ICT/SMC sont des conventions utilisées par différentes communautés de traders, et certaines définitions, comme celle du Mitigation Block, varient selon les auteurs et les indicateurs. Nous retenons une interprétation cohérente pour la formation, sans présenter ces modèles comme la preuve de l&apos;activité d&apos;institutions précises.
        </P>
      </Section>

      <Section title="1. Le Breaker Block">
        <P>
          Un Breaker Block est un Order Block invalidé par le prix, qui peut ensuite changer de rôle : l&apos;idée est proche d&apos;un ancien support devenu résistance.
        </P>
        <Note label="Exemple baissier sur EUR/USD">
          le marché est haussier et un Order Block haussier se trouve entre 1.0850 et 1.0860. Le prix monte au-dessus du sommet précédent et prend la liquidité qui s&apos;y trouvait, puis il redescend, traverse l&apos;Order Block sans rebondir et casse le dernier creux en clôture : cassure de structure baissière. La zone autrefois acheteuse est maintenant surveillée comme résistance. Si le prix remonte entre 1.0850 et 1.0860 et y montre une réaction baissière, on parle de Bearish Breaker.
        </Note>
        <Items
          items={[
            { label: "1. Un Order Block identifié", detail: "Une zone qui répondait aux critères d'un Order Block avant d'être cassée." },
            { label: "2. Une invalidation nette", detail: "Le prix traverse la zone et casse la structure en clôture." },
            { label: "3. Un retour suivi d'une confirmation", detail: "Le prix revient dans la zone et réagit dans le sens du nouveau scénario." },
          ]}
        />
        <div className="h-4" />
        <P last>
          Le prix ne revient pas toujours tester la zone après la cassure de structure : sans retour ni réaction, il n&apos;y a pas de trade.
        </P>
      </Section>

      <Charts>
        <BreakerBlockDiagram />
      </Charts>

      <Section title="2. Le Mitigation Block">
        <P>
          Le Mitigation Block est voisin du Breaker Block, mais son interprétation dépend de la convention retenue. Dans la nôtre, le Breaker s&apos;inscrit dans une séquence qui commence par une prise de liquidité ; le Mitigation Block vient d&apos;une structure qui échoue sans cette prise de liquidité.
        </P>
        <Note label="Exemple">
          l&apos;EUR/USD forme un sommet plus bas que le précédent (lower high), sans le dépasser. La dernière bougie haussière avant la chute marque l&apos;origine du mouvement. Le prix casse ensuite un creux structurel. Au retour, cette zone d&apos;origine peut être surveillée comme Mitigation Block.
        </Note>
        <P last>
          Ne confonds pas cette notion avec la mitigation d&apos;un Order Block, déjà vue dans la stratégie SMC (<L href="/strategies/smc/lecon5">leçon 5</L>). La différence entre Breaker et Mitigation Block ne se lit pas à la couleur d&apos;une bougie : elle demande de lire toute la séquence.
        </P>
      </Section>

      <Charts>
        <MitigationBlockDiagram />
      </Charts>

      <Section title="3. L'Inverse Fair Value Gap (IFVG)">
        <P>
          Un FVG est une zone de déséquilibre dans une structure de trois bougies (<L href="/formations/avance/lecon2">Avancé 2</L>). Un Inverse FVG est un FVG invalidé par le prix, puis surveillé dans le rôle opposé.
        </P>
        <Note label="Exemple">
          un FVG haussier se forme entre 1.0850 et 1.0860. Plus tard, le prix le traverse vers le bas et clôture en dessous. Lors d&apos;un rebond, la même zone est surveillée comme résistance : c&apos;est un IFVG baissier, sur le même principe qu&apos;un support qui change de rôle.
        </Note>
        <P last>
          Tous les FVG traversés ne deviennent pas des zones utiles : la structure du marché et la réaction du prix restent déterminantes.
        </P>
      </Section>

      <Charts>
        <IFVGDiagram />
      </Charts>

      <Section title="4. Le Consequent Encroachment (CE)">
        <P>
          Le Consequent Encroachment est le milieu d&apos;une zone de déséquilibre : pour un FVG, le niveau de 50 %.
        </P>
        <Note label="Exemple sur EUR/USD">
          un FVG haussier s&apos;étend de 1.0840 à 1.0860. Son CE vaut (1.0840 + 1.0860) ÷ 2 = 1.0850.
        </Note>
        <P last>
          Certains traders surveillent ce point comme zone de réaction possible. Il n&apos;est pas pour autant supérieur au reste du FVG : la confirmation dépend toujours de la structure et du comportement du prix.
        </P>
      </Section>

      <Charts>
        <CEDiagram />
      </Charts>

      <Section title="5. Le Balanced Price Range (BPR)">
        <P>
          Dans la terminologie ICT courante, le BPR est la zone de chevauchement entre deux Fair Value Gaps de sens opposés.
        </P>
        <Note label="Exemple">
          un FVG haussier occupe 1.0840 – 1.0860. Un FVG baissier apparaît ensuite entre 1.0850 et 1.0870. Les deux zones se chevauchent entre 1.0850 et 1.0860 : c&apos;est un BPR potentiel.
        </Note>
        <P last>
          Il précise une zone d&apos;intérêt à partir de deux déséquilibres opposés et se surveille lors d&apos;un retour du prix. Ce n&apos;est pas une zone d&apos;équilibre permanente : étudie-le avec les supports, les résistances et la structure.
        </P>
      </Section>

      <Charts>
        <BPRDiagram />
      </Charts>

      <Section title="6. Premium et Discount">
        <P>
          Pour analyser un range, tu peux le couper en deux. La moitié haute s&apos;appelle Premium, la moitié basse Discount ; le niveau de 50 % sert de référence. C&apos;est la base des PD Arrays de la stratégie ICT (<L href="/strategies/ict/lecon2">ICT, leçon 2</L>).
        </P>
        <Note label="Exemple">
          un range EUR/USD s&apos;étend de 1.0800 à 1.0900. Son milieu vaut (1.0800 + 1.0900) ÷ 2 = 1.0850 : la zone Discount va de 1.0800 à 1.0850, la zone Premium de 1.0850 à 1.0900.
        </Note>
        <P last>
          Dans certaines approches ICT, les acheteurs privilégient la zone Discount et les vendeurs la zone Premium, quand le contexte général va dans leur sens. Acheter dans la moitié basse d&apos;un range ne suffit pas à faire un bon trade : il faut un range bien défini, une tendance connue et un setup.
        </P>
      </Section>

      <Charts>
        <PremiumDiscountDiagram />
      </Charts>

      <Mistakes
        items={[
          { label: "Confondre Breaker et Mitigation Block", detail: "La différence tient à la séquence (prise de liquidité ou non) et à la convention retenue." },
          { label: "Prendre chaque FVG traversé pour un IFVG", detail: "Sans structure ni réaction au retour, la zone n'a pas de rôle." },
          { label: "Faire du CE un point d'entrée obligatoire", detail: "Le milieu d'un FVG reste un repère, pas un signal." },
          { label: "Acheter en Discount contre la tendance", detail: "Premium et Discount situent le prix ; ils ne donnent pas la direction." },
          { label: "Empiler les notions sur un seul trade", detail: "Plus de notions ne veut pas dire plus de chances de réussite." },
        ]}
      >
        Tu sais maintenant lire les changements de rôle des zones et situer le prix dans un range. Dans la prochaine leçon, la liquidité et le timing : inducement, divergence SMT, Judas swing, turtle soup et gaps d&apos;ouverture.
      </Mistakes>

      <Revision />

      <LessonKeyPoints
        points={[
          "Le Breaker Block est un Order Block invalidé, surveillé dans le rôle opposé après une prise de liquidité.",
          "Le Mitigation Block vient d'une structure qui échoue sans prise de liquidité, selon notre convention.",
          "Un IFVG est un FVG traversé, surveillé dans le rôle opposé.",
          "Le CE est le milieu d'un FVG ; le BPR est le chevauchement de deux FVG de sens opposés.",
          "Premium et Discount coupent un range en deux autour de son milieu, sans donner de direction.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Qu'est-ce qu'un Breaker Block ?",
            options: ["Un Order Block invalidé, qui peut changer de rôle.", "Un indicateur de volatilité.", "Une garantie de rebond."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. La zone invalidée peut ensuite être surveillée dans le rôle opposé.",
              "Faux. Il ne mesure pas la volatilité.",
              "Faux. Une zone technique ne garantit aucune réaction.",
            ],
          },
          {
            question: "Un FVG s'étend de 1.0840 à 1.0860. Où se situe son CE ?",
            options: ["1.0840", "1.0860", "1.0850"],
            correctIndex: 2,
            answerExplanations: [
              "Faux. C'est la limite basse du FVG.",
              "Faux. C'est la limite haute du FVG.",
              "Correct. Le CE est le milieu de la zone : (1.0840 + 1.0860) ÷ 2.",
            ],
          },
          {
            question: "Que représente un BPR ?",
            options: ["Le chevauchement de deux FVG de sens opposés.", "Le plus haut de la session asiatique.", "Un niveau de stop obligatoire."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le BPR est la zone commune à deux déséquilibres opposés.",
              "Faux. Le range asiatique est une autre notion.",
              "Faux. Le BPR ne fixe pas le stop.",
            ],
          },
          {
            question: "Range EUR/USD de 1.0800 à 1.0900 : le prix cote 1.0880. Où se trouve-t-il ?",
            options: ["En zone Discount.", "En zone Premium.", "Exactement au milieu du range."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. La zone Discount va de 1.0800 à 1.0850.",
              "Correct. 1.0880 est au-dessus du milieu (1.0850), dans la moitié haute.",
              "Faux. Le milieu du range est à 1.0850.",
            ],
          },
          {
            question: "Dans notre convention, qu'est-ce qui distingue un Breaker Block d'un Mitigation Block ?",
            options: ["La couleur de la dernière bougie.", "La prise de liquidité avant l'invalidation de la zone.", "L'unité de temps du graphique."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. La couleur d'une bougie ne suffit pas à les distinguer.",
              "Correct. Le Breaker suit une prise de liquidité ; le Mitigation Block vient d'une structure qui échoue sans elle.",
              "Faux. Les deux notions existent sur toutes les unités de temps.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
