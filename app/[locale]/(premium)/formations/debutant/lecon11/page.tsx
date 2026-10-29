import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { Charts, Items, L, Mistakes, Note, P, Plan, Retail, Revision, Section } from "@/app/components/lessons/LessonBlocks";
import { BuyLimitPlanDiagram, MarketOrderDiagram, PendingOrdersDiagram, StopLossTakeProfitDiagram } from "@/app/components/charts/OrderTypesDiagrams";

// Trading Débutant 11 — Les types d'ordres. Leçon en français seulement (site FR) : toutes les locales
// affichent ce contenu. NASDAQ : niveaux du texte d'origine décalés de +7 000 points (plage réaliste du site).

export default function Page() {
  return (
    <LessonPage
      formationId="debutant"
      lessonId="lecon11"
      title="Les types d'ordres : entrer et sortir du marché"
      subtitle="Tu as repéré une tendance, tracé ton support et défini ton scénario. Reste à exécuter : acheter tout de suite, attendre un prix précis, ou entrer seulement si le marché franchit un niveau. Chaque type d'ordre répond à une situation différente."
      duration="14 min"
      lessonNumber={11}
      prev={{ href: "/formations/debutant/lecon10", label: "Leçon 10 : Gestion du risque" }}
      next={null}
    >

      <Section title="Pourquoi le choix de l'ordre compte">
        <Note label="Dans cette leçon">
          comprendre les ordres au marché, Limit, Stop et Stop Limit, revoir le rôle du Stop Loss et du Take Profit, et choisir l&apos;ordre qui correspond à ton plan de trading.
        </Note>
        <P>
          Sur une plateforme comme MetaTrader 5, plusieurs types d&apos;ordres sont disponibles. Certains entrent immédiatement, d&apos;autres attendent que le marché atteigne un prix précis, d&apos;autres encore servent à protéger ton capital ou à clôturer une position.
        </P>
        <P last>
          Un mauvais choix d&apos;ordre peut te faire entrer au mauvais prix, déclencher une position que tu ne voulais pas, ou t&apos;exposer à un risque plus élevé que prévu. Avant de cliquer, tu dois donc savoir lequel correspond à ton scénario.
        </P>
      </Section>

      <Section title="1. L'ordre au marché">
        <P>
          Un ordre au marché demande une exécution immédiate, aux meilleurs prix disponibles. Imaginons que l&apos;EUR/USD affiche un Bid à 1.0850 et un Ask à 1.0852. Si tu achètes au marché, ton ordre est exécuté à partir de l&apos;Ask ; si tu vends au marché, à partir du Bid. Tu retrouves ici le spread vu dans la <L href="/formations/debutant/lecon4">leçon 4</L>.
        </P>
        <P>
          Le prix exact peut différer de celui affiché au moment du clic, surtout quand le marché bouge vite : c&apos;est le glissement (slippage).
        </P>
        <Items
          items={[
            { label: "Quand l'utiliser", detail: "Quand ton scénario vient d'être confirmé et que tu veux entrer tout de suite. Par exemple, tu attendais la clôture au-dessus d'un sommet local sur EUR/USD : elle apparaît, tu achètes au marché." },
            { label: "Avantage", detail: "La rapidité : tu es dans le marché immédiatement." },
            { label: "Inconvénient", detail: "Tu ne contrôles pas parfaitement le prix final, qui dépend de la liquidité disponible à cet instant." },
          ]}
        />
      </Section>

      <Charts>
        <MarketOrderDiagram />
      </Charts>

      <Section title="2. Les ordres Limit">
        <P>
          Un ordre Limit demande une exécution à un prix déterminé ou plus avantageux. Il sert surtout quand tu veux profiter d&apos;un retour du prix vers une zone.
        </P>
        <Items
          items={[
            { label: "Buy Limit, sous le prix actuel", detail: "L'or cote 3 920 $ et tu as repéré un support à 3 900 $. Tu veux acheter seulement si le prix revient vers ce support : tu places un Buy Limit à 3 900 $. S'il est atteint, la position s'ouvre à 3 900 $ ou à un prix plus avantageux." },
            { label: "Sell Limit, au-dessus du prix actuel", detail: "Le NASDAQ cote 27 100 points et une résistance se trouve à 27 200 points. Tu veux vendre seulement si le prix remonte vers elle : tu places un Sell Limit à 27 200 points." },
          ]}
        />
        <Note label="Attention" last>
          un ordre Limit peut ne jamais être exécuté : le prix peut ne pas atteindre ton niveau, ou la liquidité peut manquer. Et un ordre exécuté ne veut pas dire que la zone va tenir.
        </Note>
      </Section>

      <Section title="3. Les ordres Stop">
        <P>
          Un ordre Stop d&apos;entrée déclenche une opération quand le marché franchit un niveau fixé à l&apos;avance. L&apos;ordre Limit cherche un retour vers un prix plus avantageux ; l&apos;ordre Stop, lui, te fait participer à un mouvement après un franchissement.
        </P>
        <Items
          items={[
            { label: "Buy Stop, au-dessus du prix actuel", detail: "Le NASDAQ évolue à 27 100 points et une résistance se trouve à 27 180 points. Tu veux acheter si le prix la dépasse : tu places un Buy Stop à 27 185 points. Quand le prix l'atteint, l'ordre est exécuté aux conditions disponibles." },
            { label: "Sell Stop, sous le prix actuel", detail: "L'EUR/USD cote 1.0850 et un support se trouve à 1.0820. Tu veux vendre si le marché casse ce support : tu places un Sell Stop à 1.0818." },
          ]}
        />
        <P>
          Un ordre Stop peut se déclencher sur un mouvement très bref, suivi d&apos;un retournement immédiat : c&apos;est le faux breakout (<L href="/formations/intermediaire/lecon6">Intermédiaire 6</L>). Il ne remplace donc pas l&apos;analyse du contexte.
        </P>
        <Note label="À savoir" last>
          si ta stratégie exige une clôture de bougie au-delà d&apos;un niveau, un ordre Stop posé à l&apos;avance ne respecte pas cette condition : il se déclenche dès que le prix touche le niveau, avant la clôture.
        </Note>
      </Section>

      <Charts>
        <PendingOrdersDiagram />
      </Charts>

      <Section title="4. Les ordres Stop Limit">
        <P>
          Un ordre Stop Limit combine un prix de déclenchement et une limite de prix. Quand le prix de déclenchement est atteint, un ordre Limit est placé avec les paramètres que tu as choisis. Sur MetaTrader 5, les ordres Buy Stop Limit et Sell Stop Limit sont disponibles selon le symbole et le broker.
        </P>
        <P last>
          Tu évites ainsi d&apos;être exécuté au-delà d&apos;une limite fixée. La contrepartie est importante : l&apos;ordre peut ne pas être exécuté du tout. Si le marché franchit le niveau très vite, il peut le dépasser sans jamais revenir dans ta limite.
        </P>
      </Section>

      <Section title="5. Stop Loss et Take Profit : les ordres de sortie">
        <P>
          Les ordres d&apos;entrée ouvrent une position ; le <L href="/formations/debutant/lecon5">Stop Loss</L>{" "}et le <L href="/formations/debutant/lecon6">Take Profit</L>{" "}la clôturent. Le Stop Loss coupe la position si le prix atteint un niveau défavorable fixé à l&apos;avance ; le Take Profit la clôture sur un objectif.
        </P>
        <Plan
          title="Exemple sur EUR/USD"
          rows={[
            ["Achat", "1.0850, après une réaction sur un support"],
            ["Stop Loss", "1.0830, sous le creux qui forme le support"],
            ["Take Profit", "1.0890, juste avant la résistance 1.0895"],
            ["Risque", "20 pips, gain potentiel 40 pips : R/R 1:2"],
          ]}
        />
        <P last>
          Tu connais ton scénario avant de prendre position. Un gap ou un glissement peut cependant clôturer le Stop Loss à un prix moins favorable que le niveau prévu.
        </P>
      </Section>

      <Charts>
        <StopLossTakeProfitDiagram />
      </Charts>

      <Section title="6. Exemple complet : un Buy Limit sur EUR/USD">
        <P>
          En H1, l&apos;EUR/USD est en tendance haussière. Le prix évolue à 1.0870, mais un support intéressant se trouve à 1.0850 : tu préfères attendre une correction plutôt qu&apos;acheter au marché.
        </P>
        <Plan
          rows={[
            ["Type d'ordre", "Buy Limit"],
            ["Entrée", "1.0850, sur le support"],
            ["Stop Loss", "1.0825, sous le dernier creux H1 (1.0830)"],
            ["Take Profit", "1.0900, avant la résistance H1 1.0905"],
            ["Risque", "25 pips, gain potentiel 50 pips : R/R 1:2"],
          ]}
        />
        <P>
          L&apos;ordre ne sera exécuté que si le prix revient à 1.0850. Si le marché monte directement sans revenir, tu n&apos;as aucune position : ce n&apos;est pas une erreur, ton plan exigeait un retour vers le support.
        </P>
        <P last>
          Si le contexte change avant l&apos;exécution, par exemple après une cassure de structure baissière en H1, réévalue l&apos;ordre en attente au lieu de le laisser actif sans contrôle.
        </P>
      </Section>

      <Charts>
        <BuyLimitPlanDiagram />
      </Charts>

      <Retail>
        Sur un compte de 300 €, la règle des 2 % (<L href="/formations/debutant/lecon8">leçon 8</L>) autorise 6 € de risque. Sur EUR/USD, un lot standard vaut environ 9,20 € par pip : 6 € ÷ 25 pips = 0,24 € par pip, soit 0,02 lot (environ 4,60 € de risque, 9,20 € de gain visé). Au lot minimum (0,01 lot), le risque est d&apos;environ 2,30 €, moins de 1 % du compte.
      </Retail>

      <Mistakes
        items={[
          { label: "Confondre Buy Limit et Buy Stop", detail: "Le Buy Limit cherche une entrée sous le prix actuel ; le Buy Stop déclenche une entrée au-dessus." },
          { label: "Oublier le spread", detail: "Le Bid et l'Ask peuvent créer un écart entre le niveau vu sur le graphique et le déclenchement réel." },
          { label: "Placer un ordre sans invalidation", detail: "Chaque position doit avoir un Stop Loss placé sous (ou au-dessus) d'un niveau qui invalide le scénario." },
          { label: "Laisser des ordres en attente après un changement de scénario", detail: "Un ordre devenu inutile peut ouvrir une position que tu ne veux plus." },
          { label: "Croire qu'un Stop Loss garantit un prix exact", detail: "En cas de gap ou de forte volatilité, le glissement reste possible." },
        ]}
      >
        Avant chaque position, vérifie le type d&apos;ordre, le sens, le volume, le prix d&apos;entrée, le Stop Loss et le Take Profit. Tu sais maintenant distinguer les principaux ordres et choisir celui qui respecte ton plan.
      </Mistakes>

      <Revision />

      <LessonKeyPoints
        points={[
          "Market : entrée immédiate, aux prix disponibles.",
          "Limit : exécution à un prix fixé ou plus favorable, souvent sur un retour vers une zone.",
          "Stop : entrée déclenchée quand le prix franchit un niveau.",
          "Stop Limit : un déclenchement et une limite de prix, sans certitude d'exécution.",
          "Stop Loss et Take Profit clôturent la position : l'un limite la perte, l'autre encaisse l'objectif.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "L'or cote 3 920 $ et un support se trouve à 3 900 $. Tu veux acheter sur ce support. Quel ordre convient ?",
            options: ["Buy Stop", "Buy Limit", "Sell Limit"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Un Buy Stop déclenche un achat au-dessus du prix actuel.",
              "Correct. Le Buy Limit achète à un prix inférieur au prix actuel, ici sur le support à 3 900 $.",
              "Faux. Un Sell Limit ouvre une position vendeuse.",
            ],
          },
          {
            question: "Tu veux acheter le NASDAQ seulement s'il dépasse une résistance à 27 200 points. Quel ordre peux-tu utiliser ?",
            options: ["Buy Stop", "Sell Stop", "Buy Limit"],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le Buy Stop déclenche l'achat quand le prix atteint le niveau fixé, au-dessus du prix actuel.",
              "Faux. Le Sell Stop déclenche une vente.",
              "Faux. Le Buy Limit attend un prix plus bas : ce n'est pas la logique d'un breakout haussier.",
            ],
          },
          {
            question: "Quel risque présente un ordre au marché ?",
            options: [
              "Il ne peut jamais être exécuté.",
              "Il garantit le prix affiché au moment du clic.",
              "Le prix d'exécution peut différer du prix observé.",
            ],
            correctIndex: 2,
            answerExplanations: [
              "Faux. L'ordre au marché cherche justement une exécution immédiate.",
              "Faux. Le prix exact dépend des conditions d'exécution.",
              "Correct. La volatilité et la liquidité peuvent entraîner du glissement.",
            ],
          },
          {
            question: "Tu achètes EUR/USD à 1.0850, stop à 1.0830, objectif à 1.0890. Quel est ton R/R ?",
            options: ["1:1", "1:2", "1:3"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le gain potentiel n'est pas égal au risque.",
              "Correct. Tu risques 20 pips pour en viser 40.",
              "Faux. Le gain potentiel n'est pas trois fois plus grand que le risque.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
