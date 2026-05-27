import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { SupplyDemandDiagram } from "@/app/components/charts/SupplyDemandDiagram";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon3"
      title="Supply & Demand"
      subtitle="Les zones SD ne sont pas des lignes magiques, ce sont les cicatrices laissées par les institutions quand elles ont passé de gros ordres. Le prix y retourne pour exécuter le reste."
      duration="20 min"
      lessonNumber={3}
      prev={{ href: "/formations/intermediaire/lecon2", label: "Leçon 2 : Zones clés" }}
      next={{ href: "/formations/intermediaire/lecon4", label: "Leçon 4 : Tendances" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">Reconnaître une zone SD sans hésiter</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Zone de Demand (achat)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le prix descend lentement → entre dans une zone → BOOM, une ou deux grosses bougies haussières explosent vers le haut. <strong className="text-white">Cette zone = Demand.</strong> Les institutions ont acheté massivement là. Quand le prix y revient, leurs ordres restants se déclenchent.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Zone de Supply (vente)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le prix monte lentement → entre dans une zone → BOOM, grosse bougie baissière explose vers le bas. <strong className="text-white">Cette zone = Supply.</strong> Les institutions ont vendu massivement là. Au retour du prix, leurs ordres résiduels s'exécutent.
            </p>
          </div>
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-3 py-2">
          <p className="text-xs text-zinc-400"><span className="text-white font-medium">Signe clé :</span> le départ de la zone est toujours IMPULSIF, fort, rapide, peu de mèches. Si le départ est lent, ce n'est pas une zone SD valide.</p>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <SupplyDemandDiagram />
      </div>

      {/* ── Schéma visuel ── */}
      <div className="border border-zinc-800 rounded-2xl p-5">
        <div className="flex justify-around items-start pt-4 mt-2 border-t border-zinc-800/50">
          <Candle type="bullish" label="Signal Demand" caption="Rejet haussier dans la zone" />
          <Candle type="bearish" label="Signal Supply" caption="Rejet baissier dans la zone" />
        </div>
      </div>

      {/* ── Comment identifier ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Comment tracer une zone SD valide</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Une zone SD se trace sur les bougies de consolidation juste avant le départ impulsif, pas sur le départ lui-même. La zone = l'endroit où les ordres ont été passés. Le départ = la preuve qu'ils ont été exécutés.
        </p>
        <div className="space-y-2">
          {[
            { n: "1", t: "Identifie le départ impulsif", d: "Une ou plusieurs grosses bougies dans la même direction, peu de mèches. C'est le signal qu'une institution a agi." },
            { n: "2", t: "Remonte juste avant ce départ", d: "Tu trouves souvent 1 à 3 bougies de consolidation (petites bougies). C'est là que la zone commence." },
            { n: "3", t: "Trace ton rectangle sur cette consolidation", d: "Du bas au haut de la dernière bougie avant le départ. C'est ta zone SD." },
            { n: "4", t: "Vérifie que la zone est encore fraîche", d: "Si le prix est déjà retourné dans la zone plusieurs fois, elle est moins puissante. Une zone non-retestée = zone forte." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-emerald-400 shrink-0 mt-0.5 w-4">{item.n}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.t}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SD vs S/R ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">SD vs S/R : la différence en pratique</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Les deux semblent similaires mais leur logique est différente. En pratique, ils se complètent, une zone SD qui coïncide avec un S/R est une confluence puissante.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Support & Résistance</p>
            <p className="text-xs text-zinc-500 leading-relaxed">Basé sur les réactions répétées. Le prix a rebondi plusieurs fois → zone importante. Plus on le touche, plus il peut céder.</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Supply & Demand</p>
            <p className="text-xs text-zinc-500 leading-relaxed">Basé sur l'origine du mouvement. Une seule réaction impulsive suffit. Plus la zone est fraîche (non-retestée), plus elle est puissante.</p>
          </div>
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Identifier une zone SD rapidement</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Cherche les gros mouvements impulsifs sur le graphique", d: "Les grandes bougies sans hésitation. Ce sont les traces laissées par les institutions." },
            { n: "2", t: "Remonte juste avant chaque départ", d: "Quelques petites bougies de consolidation = ta zone SD. Trace le rectangle." },
            { n: "3", t: "Le prix est-il déjà revenu dans cette zone ?", d: "Si non → zone fraîche, forte. Si oui plusieurs fois → zone affaiblie, moins fiable." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.n}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.t}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ce que tu dois faire ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">Ce que tu dois faire</p>
        <h2 className="text-lg font-semibold text-white mb-4">La logique du trader sur les zones SD</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Le prix revient dans une zone de Demand</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu attends un signal de rejet dans la zone (pin bar, engulfing haussier). Si la tendance Daily est haussière → achat. SL sous la zone entière.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Le prix remonte dans une zone de Supply</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu attends un rejet dans la zone (mèche haute, engulfing baissier). Si la tendance Daily est baissière → vente. SL au-dessus de la zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Zone déjà testée plusieurs fois</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu ignores ou tu réduis ta confiance. Une zone touchée 3+ fois perd sa puissance, les ordres institutionnels sont épuisés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Entrer dans la zone avant le signal de confirmation</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Tu vois le prix descendre vers ta zone de Demand. Tu te précipites à acheter "parce que la zone est là". Mais le prix continue à baisser et traverse ta zone. Le problème : une zone SD indique où REGARDER, pas où entrer sans signal. Attends toujours une bougie de rejet dans la zone avant d'entrer.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Zone Demand + signal haussier → tu achètes (SL sous la zone)</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Zone Supply + signal baissier → tu vends (SL au-dessus de la zone)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Zone touchée 3× ou sans signal → tu ignores</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Demand = le prix quitte une zone avec un départ haussier impulsif → les institutions ont acheté.",
          "Supply = le prix quitte une zone avec un départ baissier impulsif → les institutions ont vendu.",
          "Zone fraîche (non-retestée) = zone forte. Zone testée 3× = zone affaiblie.",
          "On trace la zone sur la consolidation avant le départ, pas sur le départ lui-même.",
          "La zone SD indique où regarder, le signal de bougie indique quand entrer.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, ouvre EUR/USD en H4 et identifie des zones SD valides."
        steps={[
          "Repère le dernier grand mouvement haussier (plusieurs bougies vertes consécutives). Remonte juste avant, c'est là que ta zone de Demand se trouve. Trace un rectangle.",
          "Fais de même pour le dernier grand mouvement baissier. Trace ta zone de Supply.",
          "Vérifie si le prix est revenu tester l'une de ces zones depuis. Comment a-t-il réagi ?",
          "Cherche une zone SD qui coïncide avec un niveau de S/R historique, c'est une confluence forte. Note le prix exact.",
        ]}
      />

      <LessonQuiz
        question="Tu traces une zone de Demand sur EUR/USD H4. Le prix y descend. Que fais-tu ?"
        options={[
          "Tu achètes immédiatement dès que le prix entre dans la zone",
          "Tu attends un signal de rejet dans la zone (pin bar ou engulfing haussier), puis tu entres",
          "Tu ignores la zone, le prix descend, c'est un signe de faiblesse",
          "Tu places un ordre limite au bas de la zone sans attendre de signal",
        ]}
        correctIndex={1}
        explanation="La zone te dit où regarder, le signal de bougie te dit quand entrer. Attendre un rejet (pin bar, engulfing haussier) dans la zone de Demand confirme que les acheteurs institutionnels sont actifs. Sans signal, tu anticipes sans preuve."
        answerExplanations={[
          "Trop hâtif. Le prix peut traverser la zone et continuer à baisser. Entrer sans signal de confirmation, c'est prendre le risque d'entrer sur une zone qui ne tient pas. La zone est une zone d'attention, pas un déclencheur d'achat automatique.",
          "Correct. C'est la méthode en deux temps : la zone définit le niveau d'intérêt, le signal de bougie confirme que les acheteurs réagissent. Pin bar = rejet des prix bas. Engulfing haussier = les acheteurs prennent le contrôle. Tu entres avec SL sous la zone.",
          "Faux. Le prix qui descend vers une zone de Demand, c'est exactement le scénario attendu. C'est le retracement qui crée l'opportunité d'achat. Le prix doit descendre dans la zone pour que le setup soit valide.",
          "Risqué. Un ordre limite au bas de la zone peut fonctionner, mais tu entres sans confirmation. Le prix peut traverser le bas de la zone et continuer. Attendre le signal de bougie te donne un avantage supplémentaire.",
        ]}
      />

    </LessonPage>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale === "es") return <ContentEs />;
  return <ContentFr />;
}
