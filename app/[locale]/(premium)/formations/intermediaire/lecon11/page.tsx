import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { Charts, Items, L, Mistakes, Note, P, Plan, Retail, Revision, Section } from "@/app/components/lessons/LessonBlocks";
import { ATRDailyTargetDiagram, ATRGoldPlanDiagram, ATRReadingDiagram, ATRStopDiagram } from "@/app/components/charts/ATRDiagrams";

// Trading Intermédiaire 11 — L'ATR (Average True Range). Leçon en français seulement (site FR) : toutes
// les locales affichent ce contenu. NASDAQ : niveaux du texte d'origine décalés de +7 000 points. Chaque
// valeur d'ATR citée est recalculée depuis les bougies affichées (LessonChart, sous-panneau « atr »).

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon11"
      title="L'ATR : mesurer l'amplitude des mouvements"
      subtitle="Pourquoi un stop de 15 points suffit-il certains jours sur le NASDAQ et paraît-il ridicule d'autres jours ? Parce que l'amplitude des mouvements change sans cesse. L'ATR la mesure, pour adapter ton analyse au comportement réel de l'actif."
      duration="18 min"
      lessonNumber={11}
      prev={{ href: "/formations/intermediaire/lecon10", label: "Leçon 10 : Les figures chartistes" }}
      next={{ href: "/formations/intermediaire/lecon12", label: "Leçon 12 : La volatilité" }}
    >

      <Section title="Comprendre l'ATR">
        <Note label="Dans cette leçon">
          calculer et lire l&apos;ATR, l&apos;utiliser pour juger la distance d&apos;un stop et le réalisme d&apos;un objectif, et adapter ta taille de position quand la volatilité change.
        </Note>
        <P>
          L&apos;ATR, ou Average True Range, est un indicateur de volatilité. Il répond à une question simple : quelle distance le prix parcourt-il habituellement sur une période donnée ? Il ne dit rien de la direction : il mesure seulement la taille des variations récentes.
        </P>
        <P>
          Il repose sur le True Range. Pour chaque bougie, le True Range est la plus grande de ces trois distances :
        </P>
        <Items
          items={[
            { label: "Plus haut − plus bas", detail: "L'amplitude de la bougie elle-même." },
            { label: "|Plus haut − clôture précédente|", detail: "Utile quand le prix ouvre au-dessus de la clôture précédente (gap haussier)." },
            { label: "|Plus bas − clôture précédente|", detail: "Utile quand le prix ouvre sous la clôture précédente (gap baissier)." },
          ]}
        />
        <P last>
          L&apos;ATR est ensuite une moyenne lissée de ces True Ranges, le plus souvent sur 14 périodes. Un ATR 14 en H1 mesure l&apos;amplitude moyenne récente des bougies horaires ; en Daily, celle des journées.
        </P>
      </Section>

      <Section title="Lire l'ATR">
        <P>
          Sur le NASDAQ en M15, l&apos;ATR 14 affiche 35 points : l&apos;amplitude moyenne récente d&apos;une bougie de 15 minutes est d&apos;environ 35 points. S&apos;il passe progressivement de 35 à 55 points, la volatilité mesurée augmente ; s&apos;il retombe de 35 à 18 points, les mouvements deviennent moins amples.
        </P>
        <P last>
          L&apos;ATR s&apos;exprime dans l&apos;unité de prix de l&apos;instrument : sur EUR/USD, 0.0008 correspond à 8 pips ; sur l&apos;or, 12.0 correspond à 12 $ par once ; sur le NASDAQ, 35.0 correspond à 35 points d&apos;indice.
        </P>
      </Section>

      <Charts>
        <ATRReadingDiagram />
      </Charts>

      <Section title="Juger la distance de ton stop">
        <P>
          Tu veux acheter le NASDAQ à 27 150 points. Ton analyse repère un creux significatif à 27 090 points : un stop juste en dessous, à 27 085, donne une distance de 65 points. L&apos;ATR M15 affiche 35 points : ton stop se trouve à un peu moins de deux fois l&apos;amplitude moyenne récente d&apos;une bougie M15.
        </P>
        <P>
          Cela ne le met pas à l&apos;abri de toutes les variations, mais c&apos;est un repère utile. À l&apos;inverse, un stop à 5 points de l&apos;entrée, quand l&apos;ATR M15 vaut 35 points, serait touché par une simple fluctuation ordinaire.
        </P>
        <Note label="Le principe" last>
          le stop correspond d&apos;abord à une invalidation technique, ici sous le creux. L&apos;ATR sert ensuite à vérifier que sa distance est cohérente avec les mouvements habituels.
        </Note>
      </Section>

      <Charts>
        <ATRStopDiagram />
      </Charts>

      <Section title="Exemple pratique sur l'or">
        <P>
          En tendance haussière, l&apos;or revient sur un support à 3 900 $, réagit, puis confirme une reprise haussière en M15. L&apos;ATR 14 en M15 affiche 8 $. Au-dessus, le dernier sommet forme une résistance à 3 948 $.
        </P>
        <Plan
          rows={[
            ["Entrée à l'achat", "3 912 $"],
            ["Stop Loss", "3 896 $, sous le support"],
            ["Take Profit", "3 944 $, avant la résistance 3 948 $"],
            ["Risque", "16 $ par once, gain potentiel 32 $ : R/R 1:2"],
          ]}
        />
        <P last>
          Le stop est sous le support, et sa distance vaut deux fois l&apos;ATR M15 observé au moment de l&apos;analyse. Ce multiplicateur de 2 n&apos;est pas une règle : c&apos;est une comparaison. Si l&apos;ATR augmente fortement avant l&apos;entrée, réévalue le plan au lieu de garder une distance pensée pour d&apos;autres conditions.
        </P>
      </Section>

      <Charts>
        <ATRGoldPlanDiagram />
      </Charts>

      <Retail>
        Au lot minimum (0,01 lot, soit 1 once), ce stop de 16 $ représente environ 14,70 € de risque : avec la règle des 2 %, ce trade demande environ 740 € de capital. Sur un compte de 2 000 € à 1 % (20 €), 0,01 lot reste dans la limite et 0,02 lot (29,40 €) la dépasserait. Gain visé au lot minimum : environ 29 €.
      </Retail>

      <Section title="Juger un objectif">
        <P>
          L&apos;ATR aide aussi à juger si un objectif est ambitieux. Sur EUR/USD, l&apos;ATR journalier vaut 0.0070, soit 70 pips. Depuis le début de la journée, le marché a déjà parcouru 65 pips, et tu envisages un achat avec un objectif 80 pips plus haut.
        </P>
        <P last>
          Ce mouvement reste possible, mais il demanderait une journée bien plus large que d&apos;habitude. Vérifie le contexte, les niveaux techniques et les news à venir. L&apos;ATR n&apos;est pas une limite : lors d&apos;une séance exceptionnelle, un actif peut parcourir plusieurs fois son ATR.
        </P>
      </Section>

      <Charts>
        <ATRDailyTargetDiagram />
      </Charts>

      <Section title="Adapter ta taille de position">
        <P>
          Avec un capital de 2 000 € et un risque de 1 % par trade (<L href="/formations/debutant/lecon8">Débutant 8</L>), ton budget de risque est de 20 €. Sur EUR/USD, un lot standard vaut environ 9,20 € par pip.
        </P>
        <Plan
          title="Même risque, deux distances de stop"
          rows={[
            ["Stop de 20 pips", "20 € ÷ 20 = 1 € par pip, soit 0,10 lot (environ 18,40 € de risque)"],
            ["Stop de 40 pips", "20 € ÷ 40 = 0,50 € par pip, soit 0,05 lot (environ 18,40 € de risque)"],
          ]}
        />
        <P last>
          Le risque en euros reste le même : quand la volatilité impose un stop deux fois plus large, la taille de position est divisée par deux. Ce n&apos;est pas le nombre de pips qui fixe ta perte maximale, c&apos;est la distance du stop multipliée par la taille. La valeur exacte du pip dépend du contrat et de la devise de ton compte.
        </P>
      </Section>

      <Mistakes
        items={[
          { label: "Prendre l'ATR pour un indicateur de direction", detail: "L'ATR augmente pendant une hausse comme pendant une baisse." },
          { label: "Placer automatiquement le stop à 1 ATR", detail: "Un multiplicateur ne remplace pas l'invalidation technique." },
          { label: "Comparer des ATR d'unités de temps différentes", detail: "Un ATR H1 et un ATR Daily ne mesurent pas les mêmes périodes." },
          { label: "Croire que l'ATR donne le mouvement maximal", detail: "C'est une moyenne des variations récentes : il peut être largement dépassé." },
          { label: "Oublier de recalculer la taille", detail: "Un stop plus large avec le même volume augmente le risque en euros." },
        ]}
      >
        Tu sais maintenant lire l&apos;ATR et l&apos;utiliser pour juger tes stops, tes objectifs et ta taille de position. Dans la prochaine leçon, la volatilité elle-même : ses causes, ses régimes et les moments où le marché change de rythme.
      </Mistakes>

      <Revision />

      <LessonKeyPoints
        points={[
          "L'ATR mesure l'amplitude moyenne des variations récentes, sans indiquer de direction.",
          "Il s'exprime dans l'unité de prix de l'actif : pips, dollars ou points.",
          "Le stop suit l'invalidation technique ; l'ATR vérifie que sa distance est cohérente.",
          "L'ATR aide à juger un objectif, sans être une limite au mouvement.",
          "Quand le stop s'élargit, la taille de position diminue pour garder le même risque en euros.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Que mesure principalement l'ATR ?",
            options: ["La direction future du prix.", "L'amplitude moyenne récente des variations de prix.", "Le nombre exact d'acheteurs présents."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. L'ATR ne prévoit pas le sens du mouvement.",
              "Correct. Il mesure la volatilité à partir des amplitudes récentes.",
              "Faux. L'ATR ne mesure pas les participants.",
            ],
          },
          {
            question: "L'ATR du NASDAQ en M15 passe de 20 à 45 points. Que peux-tu en conclure ?",
            options: ["La volatilité mesurée augmente.", "Le NASDAQ va forcément monter.", "Le marché ne peut plus baisser."],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Les amplitudes récentes ont augmenté.",
              "Faux. L'ATR ne donne aucune direction.",
              "Faux. La volatilité accompagne les mouvements dans les deux sens.",
            ],
          },
          {
            question: "Tu risques 20 € avec un stop de 20 pips. Ton stop passe à 40 pips : que fais-tu pour garder le même risque ?",
            options: ["Tu doubles la taille de position.", "Tu ne changes rien.", "Tu divises par deux la valeur exposée par pip."],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Le risque serait multiplié par quatre.",
              "Faux. À taille inchangée, le risque doublerait.",
              "Correct. Un stop deux fois plus large demande une exposition deux fois plus petite.",
            ],
          },
          {
            question: "Sur l'or, ton stop est à 16 $ de l'entrée et l'ATR M15 vaut 8 $. Que représente cette distance ?",
            options: ["La moitié de l'ATR.", "Deux fois l'ATR M15.", "Une distance sans rapport avec l'ATR."],
            correctIndex: 1,
            answerExplanations: [
              "Faux. 16 $ est plus grand que l'ATR, pas plus petit.",
              "Correct. 16 ÷ 8 = 2 : le stop laisse deux amplitudes moyennes de bougie M15.",
              "Faux. Comparer la distance du stop à l'ATR est justement l'usage décrit dans la leçon.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
