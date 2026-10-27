import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { AbsorptionDivergenceDiagram, DeltaCVDDiagram, FootprintDiagram, OrderBookDiagram } from "@/app/components/charts/OrderFlowDiagrams";

// Trading Avancé 12 — Order Flow, Footprint, Delta et CVD. Leçon en français seulement (site FR) :
// toutes les locales affichent ce contenu. NASDAQ : niveaux du texte d'origine décalés de +7 000 points.

const box = "bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}

function P({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return <p className={`text-zinc-300 leading-relaxed text-sm${last ? "" : " mb-4"}`}>{children}</p>;
}

export default function Page() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon12"
      title="Order Flow, footprint, delta et CVD"
      subtitle="Une bougie montre le résultat des échanges, pas la façon dont ils se sont déroulés. L'Order Flow étudie les transactions exécutées, leur volume et le rapport entre acheteurs et vendeurs agressifs, surtout sur les marchés futures."
      duration="24 min"
      lessonNumber={12}
      prev={{ href: "/formations/avance/lecon11", label: "Leçon 11 : VWAP" }}
      next={null}
    >

      <Section title="Comprendre l'activité derrière les prix">
        <P>
          Une bougie haussière montre que le prix a progressé entre l&apos;ouverture et la clôture, une bougie baissière l&apos;inverse. Mais elle ne dit pas comment les transactions se sont déroulées. Pour le voir, certains traders utilisent l&apos;Order Flow : l&apos;étude des transactions exécutées, de leur volume et des échanges entre acheteurs et vendeurs. Elle s&apos;appuie sur trois outils, le footprint, le delta et le CVD (Cumulative Volume Delta), surtout intéressants quand on dispose des données détaillées d&apos;un marché centralisé, comme les contrats futures.
        </P>
        <div className={box}>
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Pour ton parcours :</span>{" "}si tu trades surtout des CFD chez RaiseFX, tu n&apos;as pas forcément accès aux données complètes qu&apos;utilise un trader de futures. Cette leçon a donc un autre but que les précédentes : comprendre ce que ces outils mesurent, comment certains professionnels les lisent et pourquoi les données comptent. Tu n&apos;as pas besoin de maîtriser l&apos;Order Flow pour appliquer les stratégies techniques vues jusqu&apos;ici.
          </p>
        </div>
      </Section>

      <Section title="Ce qui fait bouger le prix">
        <P>
          Sur un marché doté d&apos;un carnet d&apos;ordres, certains participants proposent d&apos;acheter ou de vendre à un prix fixé ; d&apos;autres veulent être exécutés tout de suite.
        </P>
        <div className="space-y-3 mb-4">
          <div className="bg-zinc-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-white mb-1">Les ordres passifs</p>
            <p className="text-xs text-zinc-400 leading-relaxed">En général des ordres limites qui attendent dans le carnet. Un contrat future se négocie vers 27 000 points ; un trader place un achat limite à 26 995 : son ordre attend qu&apos;un vendeur accepte ce prix. Il fournit de la liquidité.</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-white mb-1">Les ordres agressifs</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Des ordres qui veulent être exécutés tout de suite contre la liquidité disponible. Un achat au marché prend les offres de vente présentes dans le carnet : il consomme de la liquidité.</p>
          </div>
        </div>
        <P last>
          Le prix évolue notamment quand les transactions et les modifications du carnet changent les meilleurs prix d&apos;achat et de vente disponibles.
        </P>
      </Section>

      <Section title="Le Bid et l'Ask">
        <P>
          Le Bid est le meilleur prix auquel un acheteur propose d&apos;acheter ; l&apos;Ask, le meilleur prix auquel un vendeur propose de vendre. Avec un meilleur Ask à 27 001 et un meilleur Bid à 27 000, le spread est de 1 point.
        </P>
        <P last>
          Un acheteur agressif est exécuté à l&apos;Ask, un vendeur agressif au Bid. C&apos;est ce classement qui permet de construire les indicateurs d&apos;Order Flow.
        </P>
      </Section>

      <div className="space-y-4">
        <OrderBookDiagram />
      </div>

      <Section title="Le footprint">
        <P>
          Le footprint détaille les échanges à chaque niveau de prix : à l&apos;intérieur de chaque bougie, il affiche les volumes exécutés au Bid et à l&apos;Ask. Exemple simplifié sur un contrat future lié au NASDAQ : en haut de la bougie, le volume des achats agressifs l&apos;emporte sur celui des ventes agressives ; en bas, c&apos;est l&apos;inverse. Le footprint montre ainsi les déséquilibres à l&apos;intérieur d&apos;une bougie.
        </P>
        <div className={box}>
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Les imbalances :</span>{" "}un déséquilibre important entre achats et ventes agressifs, repéré par une règle de comparaison. Certaines plateformes signalent un rapport de 3 pour 1, mais les méthodes et les seuils changent d&apos;un indicateur à l&apos;autre. Une concentration d&apos;achats agressifs peut accompagner une hausse, sans suffire à prévoir le mouvement suivant.
          </p>
        </div>
      </Section>

      <div className="space-y-4">
        <FootprintDiagram />
      </div>

      <Section title="L'absorption : quand le prix résiste aux ordres agressifs">
        <P>
          Le NASDAQ future arrive sur une résistance à 27 100 points. De nombreux achats agressifs sont exécutés, et pourtant le prix ne parvient presque pas à dépasser la résistance. Ces achats rencontrent une grande quantité d&apos;ordres de vente passifs, qui fournissent assez de liquidité pour freiner la progression : on parle d&apos;absorption vendeuse possible.
        </P>
        <P>
          L&apos;inverse existe : sur un support, de nombreuses ventes agressives peuvent s&apos;exécuter sans que le prix poursuive sa baisse, ce qui peut suggérer une absorption par des acheteurs passifs.
        </P>
        <div className={box}>
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">À comprendre :</span>{" "}un gros volume d&apos;achats agressifs ne signifie pas que le prix va monter. Ce qui compte aussi, c&apos;est la capacité de ces transactions à déplacer le prix. C&apos;est précisément ce qu&apos;étudient les traders d&apos;Order Flow.
          </p>
        </div>
      </Section>

      <Section title="Le delta : mesurer le déséquilibre des échanges agressifs">
        <P>
          Delta = volume exécuté à l&apos;Ask − volume exécuté au Bid. Pendant une bougie, un contrat future enregistre 1 500 contrats à l&apos;Ask et 1 000 au Bid : le delta vaut 1 500 − 1 000 = +500. Les transactions classées comme achats agressifs dépassent de 500 contrats celles classées comme ventes agressives. Avec 800 contrats à l&apos;Ask et 1 300 au Bid, le delta serait de −500.
        </P>
        <P last>
          Un delta positif indique une activité acheteuse agressive nette, un delta négatif une activité vendeuse agressive nette. Mais le prix ne suit pas toujours le delta : un delta de +1 000 contrats pour seulement 2 points de progression peut attirer l&apos;attention sur une absorption des achats agressifs par des vendeurs passifs. Le delta se lit donc toujours face au déplacement réel du prix.
        </P>
      </Section>

      <Section title="Le CVD : suivre les déséquilibres dans le temps">
        <P>
          Le CVD additionne les deltas successifs, au lieu de mesurer le déséquilibre d&apos;une seule bougie. Sur quatre bougies de delta +300, +200, −150 et +400, il passe de +300 à +500, puis +350, puis +750 contrats en partant de zéro : il montre comment évolue le déséquilibre cumulé des transactions agressives.
        </P>
        <P last>
          Son intérêt principal : voir si les mouvements du prix s&apos;accompagnent d&apos;une évolution cohérente de l&apos;activité agressive nette. Si le NASDAQ future fait un nouveau sommet alors que le CVD ne dépasse pas son sommet précédent, on parle de divergence potentielle. Elle montre un écart entre le prix et l&apos;activité agressive nette, sans prédire de baisse : le marché peut continuer à monter malgré elle. C&apos;est pourquoi les traders spécialisés regardent aussi la structure du prix et les autres informations de marché.
        </P>
      </Section>

      <div className="space-y-4">
        <DeltaCVDDiagram />
      </div>

      <Section title="Exemple concret : un sommet sur le NASDAQ future">
        <P>
          En H1, une résistance importante se trouve à 27 100 points, et le prix y arrive après plusieurs heures de progression.
        </P>
        <div className="space-y-2 mb-4">
          {[
            { step: "1", text: "Le prix. Le marché atteint 27 100, dépasse légèrement le niveau en mèche, puis ralentit. Sur un graphique classique, tu vois seulement une hésitation sur une résistance." },
            { step: "2", text: "Le footprint. Il montre un gros volume d'achats agressifs près de 27 100, et pourtant le prix ne progresse presque plus : une absorption vendeuse est possible." },
            { step: "3", text: "Le delta. La dernière poussée a un delta fortement positif : les achats agressifs ont été importants, mais leur effet sur le prix reste faible." },
            { step: "4", text: "Le CVD. Le prix a fait un nouveau sommet local, alors que le CVD est resté sous son sommet précédent : cette divergence est une information de plus." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <P last>
          Le trader dispose de plusieurs observations : une résistance technique, une progression qui ralentit, beaucoup d&apos;achats agressifs, une absorption vendeuse possible et une divergence entre le prix et le CVD. Elles justifient de surveiller la structure de plus près, pas de conclure à un retournement : il doit encore vérifier que le prix commence vraiment à construire une structure baissière. L&apos;Order Flow apporte ici une lecture détaillée de l&apos;activité près de la résistance.
        </P>
      </Section>

      <div className="space-y-4">
        <AbsorptionDivergenceDiagram />
      </div>

      <Section title="Pourquoi ces outils ne sont pas indispensables sur ton compte CFD">
        <P>
          Sur un marché futures centralisé, les transactions de la bourse sont enregistrées avec des informations détaillées, qui permettent de construire le footprint et le delta. Sur un CFD, les transactions faites chez ton broker ne correspondent pas forcément à celles d&apos;une bourse centralisée : il n&apos;existe pas automatiquement de carnet d&apos;ordres global ni de delta qui représente tous les participants du marché sous-jacent.
        </P>
        <P>
          Certains traders prennent les données des futures comme référence pour analyser les indices, l&apos;or ou certaines devises. Cela demande un accès aux bonnes données et une bonne compréhension des différences entre les instruments. Un CVD calculé sur un flux de données partiel ne révèle pas toute l&apos;activité d&apos;un marché.
        </P>
        <P last>
          Pour ton trading actuel, les bases restent prioritaires : tendance, structure de marché, supports et résistances, gestion du risque et discipline d&apos;exécution. L&apos;Order Flow est une spécialisation de plus, surtout utile si tu veux approfondir les marchés futures.
        </P>
      </Section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les erreurs à éviter</h2>
        <div className="space-y-2.5">
          {[
            { label: "Croire qu'un delta positif fait forcément monter le prix", detail: "Un delta positif mesure un excédent de volume acheteur agressif. Il ne garantit pas que le prix progresse." },
            { label: "Confondre volume agressif et nombre d'acheteurs", detail: "Chaque transaction a un acheteur et un vendeur. Le delta classe l'initiative agressive, il ne compte pas les participants." },
            { label: "Prendre une divergence CVD pour un signal suffisant", detail: "Une divergence peut durer plusieurs périodes sans provoquer de retournement." },
            { label: "Confondre données futures et données CFD", detail: "Les deux marchés peuvent avoir des prix proches sans disposer des mêmes données de transactions." },
            { label: "Ajouter trop d'outils à son graphique", detail: "Plus d'indicateurs ne rend pas l'analyse plus précise. Mieux vaut maîtriser quelques outils adaptés à ton marché." },
          ].map((r) => (
            <div key={r.label} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400 shrink-0 mt-0.5">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-zinc-300 leading-relaxed text-sm mt-4">
          Tu sais maintenant distinguer le footprint, le delta et le CVD, et ce que signifient l&apos;absorption et la divergence. Le but de cette leçon n&apos;est pas de changer ta méthode, mais d&apos;élargir ta compréhension des marchés et de te donner les bases si tu veux un jour approfondir les contrats futures.
        </p>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "L'Order Flow étudie les transactions et les échanges entre ordres passifs et agressifs.",
          "Le footprint détaille les volumes exécutés au Bid et à l'Ask à chaque niveau de prix.",
          "Le delta mesure le déséquilibre entre achats et ventes agressifs sur une période ; le CVD cumule ces deltas dans le temps.",
          "L'absorption et les divergences signalent des moments où le prix ne réagit pas comme le volume agressif le laisserait penser.",
          "Ces outils sont surtout pertinents sur les futures, avec des données détaillées et centralisées ; en Forex ou CFD, c'est une culture de marché utile, qui demande des données adaptées pour un usage pratique.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Quelle est la fonction principale de l'Order Flow ?",
            options: [
              "Prédire avec certitude la prochaine bougie.",
              "Étudier les ordres et les transactions à l'origine de l'activité du marché.",
              "Remplacer toutes les analyses de tendance.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. L'Order Flow permet d'observer l'activité, pas de prédire l'avenir avec certitude.",
              "Correct. Il étudie les transactions, les déséquilibres et les échanges entre liquidité passive et agressive.",
              "Faux. L'analyse de la structure reste complémentaire à l'Order Flow.",
            ],
          },
          {
            question: "Que peut suggérer un gros volume d'achats agressifs sans progression significative du prix ?",
            options: [
              "Une absorption vendeuse possible.",
              "Une hausse forcément imminente.",
              "L'absence totale de vendeurs.",
            ],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Des vendeurs passifs peuvent fournir assez de liquidité pour absorber les achats.",
              "Faux. Les achats agressifs peuvent rester insuffisants pour faire progresser le prix.",
              "Faux. Chaque achat exécuté a un vendeur en face.",
            ],
          },
          {
            question: "Quelle est la différence entre le delta et le CVD ?",
            options: [
              "Le delta mesure la volatilité, le CVD mesure le spread.",
              "Le CVD est le prix moyen pondéré par les volumes.",
              "Le delta mesure un déséquilibre sur une période, le CVD cumule les deltas successifs.",
            ],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Ni le delta ni le CVD ne correspondent à ces définitions.",
              "Faux. Le prix moyen pondéré par les volumes, c'est le VWAP.",
              "Correct. Le CVD suit l'évolution cumulée des déséquilibres agressifs.",
            ],
          },
          {
            question: "Pourquoi les données d'Order Flow des futures ne valent-elles pas directement pour un compte CFD ?",
            options: [
              "Parce que les CFD n'ont jamais de prix.",
              "Parce que les données détaillées d'une bourse centralisée ne correspondent pas forcément au flux d'un broker CFD.",
              "Parce que le NASDAQ ne peut pas s'analyser sur un graphique.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Les CFD ont des cotations, mais leurs volumes et leurs informations de transactions peuvent être différents.",
              "Correct. Un marché futures centralisé et un CFD n'offrent pas la même visibilité sur les transactions.",
              "Faux. Le NASDAQ s'analyse techniquement, que des données d'Order Flow détaillées soient disponibles ou non.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
