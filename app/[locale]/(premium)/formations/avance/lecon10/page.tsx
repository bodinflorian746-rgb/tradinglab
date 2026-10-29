import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LVNTargetDiagram, ValueAreaExitDiagram, VolumeProfileDiagram, VolumeProfileTradeDiagram } from "@/app/components/charts/VolumeProfileDiagrams";

// Trading Avancé 10 — Volume Profile. Leçon en français seulement (site FR) : toutes les locales
// affichent ce contenu.

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

function Items({ items }: { items: { label: string; detail: string }[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((r) => (
        <div key={r.label} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
          <div>
            <p className="text-sm font-medium text-white">{r.label}</p>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{r.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon10"
      title="Volume Profile, où se concentrent les échanges"
      subtitle="Quand tu traces un support, une question se pose : ce niveau a-t-il vraiment concentré beaucoup d'échanges ? Le Volume Profile répartit les volumes par niveau de prix, et non plus dans le temps, pour te montrer où le marché a travaillé et où il est passé vite."
      duration="22 min"
      lessonNumber={10}
      prev={{ href: "/formations/avance/lecon9", label: "Leçon 9 : Backtesting" }}
      next={{ href: "/formations/avance/lecon11", label: "Leçon 11 : VWAP" }}
    >

      <Section title="Comprendre le Volume Profile">
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Dans cette leçon :</span>{" "}lire un Volume Profile (POC, Value Area, HVN, LVN), le relier aux supports et résistances, construire un plan avec une entrée, un stop loss et un take profit, et savoir quand cet outil apporte vraiment quelque chose à ton analyse.
          </p>
        </div>
        <P>
          Sous les bougies, les volumes classiques sont des barres verticales : chacune donne l&apos;activité d&apos;une période (une minute, une heure, une journée). Le Volume Profile fonctionne autrement : il affiche un histogramme horizontal qui donne le volume échangé à chaque zone de prix sur la période choisie.
        </P>
        <P>
          Plus une barre horizontale est longue, plus le volume échangé à ce niveau a été important. Une barre courte signale une zone où relativement peu de volume a été observé.
        </P>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Exemple :</span>{" "}l&apos;EUR/USD évolue entre 1.0800 et 1.0900. Le profil montre une forte concentration de volume autour de 1.0850, une concentration secondaire autour de 1.0820 et une zone de faible volume entre 1.0870 et 1.0885. Le marché n&apos;a donc pas réparti son activité uniformément : certaines zones ont concentré plus d&apos;échanges que d&apos;autres, et ce sont elles que tu peux choisir de surveiller.
          </p>
        </div>
      </Section>

      <div className="space-y-4">
        <VolumeProfileDiagram />
      </div>

      <Section title="Les quatre notions essentielles">
        <Items
          items={[
            { label: "POC (Point of Control)", detail: "Le niveau de prix qui a enregistré le plus de volume sur la période analysée. Dans l'exemple, 1.0850. Si tu avais déjà repéré un support ou une résistance vers 1.0850, c'est un élément de contexte en plus. Le POC n'est pas pour autant un support ou une résistance : c'est d'abord une concentration d'activité passée." },
            { label: "Value Area (VAH et VAL)", detail: "La zone qui regroupe en général environ 70 % du volume, entre la VAH (Value Area High, limite haute) et la VAL (Value Area Low, limite basse). Dans l'exemple : VAH 1.0865, POC 1.0850, VAL 1.0835. Le marché a concentré une grande partie de son activité entre 1.0835 et 1.0865." },
            { label: "HVN (High Volume Nodes)", detail: "Les fortes concentrations de volume, les renflements de l'histogramme. En consolidation, ce sont souvent des niveaux autour desquels le prix a longtemps évolué. Une HVN qui coïncide avec un support important mérite d'être étudiée, sans promettre de réaction." },
            { label: "LVN (Low Volume Nodes)", detail: "Les zones de faible volume, les creux de l'histogramme : le prix les a souvent traversées vite. Quand il y revient, il peut parfois les traverser rapidement pour rejoindre une zone de volume élevé, ce qui aide à réfléchir à un objectif." },
          ]}
        />
        <p className="text-zinc-300 leading-relaxed text-sm mt-4">
          Quand le prix sort de la Value Area, observe s&apos;il parvient à rester à l&apos;extérieur ou s&apos;il réintègre vite la zone de valeur : ce n&apos;est pas la même histoire.
        </p>
      </Section>

      <div className="space-y-4">
        <ValueAreaExitDiagram />
      </div>

      <Section title="Le Volume Profile avec les supports et résistances">
        <P>
          Tu sais déjà repérer les niveaux techniques grâce à la structure des prix. Le Volume Profile ne remplace pas cette méthode : il la complète.
        </P>
        <P>
          Sur l&apos;EUR/USD en H1, tu repères un support à 1.0850 parce que le prix y a réagi plusieurs fois. Tu ajoutes un Volume Profile sur la consolidation précédente : le POC apparaît lui aussi près de 1.0850. Tu as maintenant deux observations : la structure montre que cette zone a déjà provoqué des réactions, et le profil montre qu&apos;elle a concentré beaucoup d&apos;activité. Cette convergence rend le niveau plus intéressant à surveiller.
        </P>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">La structure reste prioritaire :</span>{" "}si le prix casse le support et commence à construire une structure baissière, tu n&apos;achètes pas parce que le POC se trouve là. Le Volume Profile apporte un contexte, pas une décision.
          </p>
        </div>
      </Section>

      <Section title="Exemple pratique : un trade sur EUR/USD">
        <P>
          Un scénario complet avec des notions déjà vues : tendance, support, confirmation et ratio risque/rendement. Unité de temps principale H1, entrée en M15.
        </P>
        <P>
          Le prix évolue en tendance haussière, avec des sommets et des creux de plus en plus hauts. Après une impulsion, il corrige. Tu repères une ancienne résistance devenue support vers 1.0850, et un Fixed Range Volume Profile sur la consolidation précédente place le POC à 1.0852 : le support technique et le POC se trouvent presque au même endroit.
        </P>
        <P>
          Tu attends que le prix revienne dans cette zone. En M15, il réagit puis casse un sommet local : c&apos;est ta confirmation de reprise haussière.
        </P>
        <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-white mb-2">Le plan</p>
          <ul className="space-y-1 text-sm text-zinc-300">
            <li>- Entrée à l&apos;achat : 1.0855</li>
            <li>- Stop loss : 1.0835, sous le creux technique qui confirme le support</li>
            <li>- Take profit : 1.0895, juste avant l&apos;ancienne résistance H1 à 1.0900</li>
            <li>- Risque 20 pips, gain potentiel 40 pips : R/R 1:2</li>
          </ul>
        </div>
        <P>
          Pourquoi 1.0835 ? Ce niveau est sous le creux technique qui sert à confirmer le support : si le prix passe sous cette structure, l&apos;hypothèse de reprise haussière perd sa validité. Pourquoi 1.0895 ? L&apos;ancienne résistance repérée en H1 est à 1.0900 : l&apos;objectif se place juste avant elle, car le prix peut réagir un peu avant d&apos;atteindre le niveau.
        </P>
        <P last>
          Si le prix atteint l&apos;objectif, le gain théorique est de 2R avant les frais ; s&apos;il touche le stop, la perte théorique est de 1R, hors glissement éventuel et frais. Le Volume Profile n&apos;a pas décidé du trade à ta place : il t&apos;a aidé à repérer une zone, que tu as ensuite validée par l&apos;analyse technique.
        </P>
      </Section>

      <div className="space-y-4">
        <VolumeProfileTradeDiagram />
      </div>

      <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
        <div className="flex items-center gap-2 mb-2">
          <span>💰</span>
          <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
        </div>
        <p className="text-base text-zinc-300 leading-relaxed">
          Ce trade se prend au lot minimum avec la règle des 2 % (Débutant leçon 8). Au lot minimum (0,01 lot), chaque pip vaut environ 0,092 € : ce stop de 20 pips représente environ 1,84 € de risque, sous les 6 € autorisés sur un compte de 300 €. Tu peux gagner environ 3,68 €.
        </p>
      </div>

      <Section title="Les LVN pour analyser un objectif">
        <P>
          Sur le NASDAQ, une résistance se trouve à 27 100 points. Le prix la franchit et confirme une structure haussière. Le profil montre une zone de faible volume entre 27 120 et 27 180 points, puis une HVN autour de 27 200 points.
        </P>
        <P>
          Le marché a donc peu échangé entre 27 120 et 27 180 : cette LVN peut devenir une zone à surveiller pour une continuation. L&apos;HVN vers 27 200 peut servir de repère pour étudier une zone d&apos;objectif, à condition qu&apos;elle corresponde aussi à la structure du graphique.
        </P>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Attention :</span>{" "}une LVN ne veut pas dire qu&apos;il n&apos;y a aucun ordre dans cette zone aujourd&apos;hui. Elle décrit seulement la répartition passée des volumes utilisée par le profil.
          </p>
        </div>
      </Section>

      <div className="space-y-4">
        <LVNTargetDiagram />
      </div>

      <Section title="Quel Volume Profile utiliser sur TradingView ?">
        <Items
          items={[
            { label: "Fixed Range Volume Profile", detail: "Tu choisis toi-même la période analysée. C'est celui que nous privilégions ici, pour une consolidation ou une impulsion bien délimitée." },
            { label: "Session Volume Profile", detail: "Le profil de chaque séance : utile pour étudier les zones de valeur d'une journée et leur évolution les jours suivants." },
            { label: "Visible Range Volume Profile", detail: "Le profil de la partie visible du graphique : il change quand tu zoomes ou que tu déplaces le graphique." },
          ]}
        />
        <p className="text-zinc-300 leading-relaxed text-sm mt-4 mb-4">
          La disponibilité exacte de ces outils dépend de ta plateforme et de ton abonnement.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Forex et CFD :</span>{" "}sur le Forex spot, il n&apos;existe pas de volume consolidé unique qui regroupe toutes les transactions mondiales. Les indicateurs utilisent des volumes de ticks ou les données d&apos;un fournisseur : un profil construit sur ces données décrit l&apos;activité de cette source, pas forcément celle de tout le marché. Les volumes de TradingView ne sont pas non plus forcément ceux du flux de cotation de ton broker RaiseFX. Utilise donc le Volume Profile comme une confirmation complémentaire, jamais comme la seule raison d&apos;ouvrir une position.
          </p>
        </div>
      </Section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les erreurs à éviter</h2>
        <div className="space-y-2.5">
          {[
            { label: "Acheter dès que le prix touche le POC", detail: "Le POC est une zone d'activité passée. Attends un setup technique cohérent." },
            { label: "Prendre une LVN pour un objectif garanti", detail: "Une LVN peut être traversée vite, mais le marché peut aussi y ralentir ou s'y retourner." },
            { label: "Changer sans cesse la période du profil", detail: "Si la zone analysée change tout le temps, tes niveaux changent aussi et ton plan perd sa cohérence." },
            { label: "Ignorer la tendance générale", detail: "Un support associé à un POC ne suffit pas à justifier un achat dans une structure fortement baissière." },
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
          Tu sais maintenant lire les éléments principaux d&apos;un Volume Profile et les intégrer à ton analyse technique. Dans la prochaine leçon, le VWAP : le prix moyen pondéré par les volumes, pour étudier les retours du prix dans une tendance.
        </p>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Le Volume Profile montre la répartition des volumes selon les niveaux de prix.",
          "Le POC est le niveau qui a concentré le plus de volume ; la Value Area regroupe environ 70 % du volume, entre la VAH et la VAL.",
          "Les HVN sont les fortes concentrations de volume, les LVN les zones de faible activité passée.",
          "En Forex et CFD, le Volume Profile complète les supports, résistances, tendances et confirmations : il ne les remplace pas.",
          "Le but n'est pas de trouver plus de signaux, mais de mieux choisir tes zones de trading.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Que représente le POC ?",
            options: [
              "Le prix auquel les traders doivent obligatoirement acheter.",
              "Le niveau de prix qui a concentré le plus de volume sur la période analysée.",
              "La limite haute de la Value Area.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le POC n'est pas un signal d'achat automatique.",
              "Correct. Le Point of Control est le niveau où le profil a enregistré le plus de volume.",
              "Faux. La limite haute de la Value Area s'appelle la VAH.",
            ],
          },
          {
            question: "Tu repères un support sur EUR/USD et le POC se trouve au même niveau. Que fais-tu ?",
            options: [
              "Tu achètes tout de suite, sans confirmation.",
              "Tu supprimes le support pour ne garder que le POC.",
              "Tu surveilles la zone et attends une confirmation technique avant d'envisager une entrée.",
            ],
            correctIndex: 2,
            answerExplanations: [
              "Faux. Une convergence de deux outils ne garantit pas un rebond.",
              "Faux. Le Volume Profile complète la structure des prix, il ne la remplace pas.",
              "Correct. Tu combines une zone d'activité passée avec une confirmation technique.",
            ],
          },
          {
            question: "Que représente une LVN ?",
            options: [
              "Une zone où le volume passé a été relativement faible.",
              "Une zone où aucun ordre n'existe aujourd'hui.",
              "Une résistance forcément infranchissable.",
            ],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Une LVN est une zone de faible concentration de volume dans le profil.",
              "Faux. Les volumes passés ne montrent pas directement la liquidité disponible aujourd'hui.",
              "Faux. Une LVN n'impose aucun comportement au prix.",
            ],
          },
          {
            question: "Tu achètes EUR/USD à 1.0855, avec un stop à 1.0835 et un objectif à 1.0895. Quel est ton R/R théorique ?",
            options: ["1:1", "1:2", "1:4"],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Le gain potentiel est supérieur au risque.",
              "Correct. Tu risques 20 pips pour en viser 40.",
              "Faux. Le gain potentiel n'est pas quatre fois plus grand que le risque.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
