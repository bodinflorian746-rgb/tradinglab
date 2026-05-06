import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { MarketStructureDiagram } from "@/app/components/charts/MarketStructureDiagram";
import { BOSDiagram } from "@/app/components/charts/BOSDiagram";
import { CHoCHDiagram } from "@/app/components/charts/CHoCHDiagram";

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon1"
      title="Structure de marché — BOS & CHoCH"
      subtitle="Avant d'identifier une entrée, tu dois savoir dans quelle direction le marché évolue. La structure, c'est ta boussole. Sans elle, tu trades à l'aveugle."
      duration="20 min"
      lessonNumber={1}
      prev={null}
      next={{ href: "/formations/intermediaire/lecon2", label: "Leçon 2 — Zones clés" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">Lire la structure en regardant le graphique</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-1">Tendance haussière</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le prix monte → fait un sommet → recule un peu → repart plus haut que le sommet précédent → fait un creux plus haut que le creux précédent. C'est <strong className="text-white">HH (Higher High) + HL (Higher Low)</strong>.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-1">Tendance baissière</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le prix descend → fait un creux → remonte un peu → repart plus bas → fait un sommet plus bas. C'est <strong className="text-white">LH (Lower High) + LL (Lower Low)</strong>.
            </p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-zinc-300 mb-1">Range (consolidation)</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Le prix oscille entre deux niveaux horizontaux. Pas de nouveaux sommets ni creux significatifs. Aucun camp ne domine.
            </p>
          </div>
        </div>
      </section>

      {/* ── Schéma visuel ── */}
      <div className="border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <MarketStructureDiagram trend="bullish" />
          <MarketStructureDiagram trend="bearish" />
        </div>
      </div>

      {/* ── BOS ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Break of Structure (BOS) — la tendance confirme</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un BOS, c'est quand le prix casse le dernier sommet (en haussier) ou le dernier creux (en baissier). Il confirme que la tendance continue. C'est une information — pas un signal d'entrée.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">BOS haussier</p>
            <p className="text-xs text-zinc-400">EUR/USD en tendance haussière. Le prix casse au-dessus du dernier HH à 1.0950 → BOS confirmé. Tu continues à chercher des achats sur les retracements.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-red-400 mb-1">BOS baissier</p>
            <p className="text-xs text-zinc-400">BTC en tendance baissière. Le prix casse sous le dernier LL à 42 000$ → BOS confirmé. Tu continues à chercher des ventes sur les rebonds.</p>
          </div>
        </div>
        <div className="mt-4">
          <BOSDiagram trend="bullish" />
        </div>
      </section>

      {/* ── CHoCH ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Change of Character (CHoCH) — la tendance craque</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Le CHoCH est la première fissure dans la structure. En tendance haussière, c'est quand le prix casse en dessous du dernier Higher Low. Ce n'est pas encore un retournement confirmé — c'est une alerte.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Scénario réel</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Tu observes EUR/USD en H4 haussier. Le prix forme HH à 1.0950, recule, puis casse son dernier HL à 1.0880. C'est un CHoCH baissier. Tu passes en mode observation — tu n'achètes plus. Tu attends un BOS baissier pour confirmer le retournement.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">CHoCH → BOS opposé = retournement confirmé.</span> Un CHoCH seul = simple alerte. Attends toujours la confirmation.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <CHoCHDiagram trend="bullish" />
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Lire la structure rapidement</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Zoom arrière sur le Daily ou H4", d: "Ne commence jamais par le M15 — tu perdrais le contexte global." },
            { n: "2", t: "Trace les 3 derniers sommets et creux significatifs", d: "Ignore les petites fluctuations — seuls les swings importants comptent." },
            { n: "3", t: "La direction des sommets/creux = ta tendance", d: "Sommets et creux qui montent → haussier. Qui descendent → baissier. Stagnants → range, pas de trade." },
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
        <h2 className="text-lg font-semibold text-white mb-4">La logique du trader</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Tendance haussière</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu cherches uniquement des achats. Tu attends un retracement sur le dernier Higher Low pour entrer.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Tendance baissière</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu cherches uniquement des ventes. Tu attends un rebond sur le dernier Lower High pour entrer.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Range / Pas de structure claire</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu ne fais rien. Pas de trade sans tendance définie. Attends que la structure se clarifie.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Entrer sur le BOS au lieu d'attendre le retour sur structure</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Tu vois le prix casser un nouveau High → tu achètes immédiatement. Mais c'est souvent le moment où le marché retrace. Le bon timing, c'est d'attendre que le prix revienne sur le dernier HL — pas d'acheter le breakout. Entrer sur le BOS = payer cher avec un mauvais ratio R/R.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>HH + HL → tendance haussière → tu achètes sur les HL</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>LH + LL → tendance baissière → tu vends sur les LH</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Pas de structure claire → range → tu ne fais rien</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "HH + HL = tendance haussière. LH + LL = tendance baissière. Stagnant = range.",
          "BOS = le prix casse un sommet/creux précédent → la tendance continue.",
          "CHoCH = premier signal de retournement → alerte, pas encore un trade.",
          "CHoCH + BOS opposé = retournement confirmé.",
          "En range, tu ne trades pas — tu attends une structure claire.",
        ]}
      />

      <LessonExercice
        description="Ouvre EUR/USD en H4 sur TradingView. Analyse la structure maintenant."
        steps={[
          "Zoom arrière pour voir les 3 derniers mois. Trace les 4 derniers sommets et creux significatifs.",
          "Classe chaque sommet : HH ou LH ? Chaque creux : HL ou LL ? Note la séquence.",
          "Identifie le dernier BOS : à quel niveau le prix a-t-il cassé ? Dans quel sens ?",
          "Y a-t-il un CHoCH récent ? La structure a-t-elle changé de caractère ces 2 dernières semaines ?",
        ]}
      />

      <LessonQuiz
        question="Tu regardes EUR/USD en H4. Le prix est en tendance haussière (HH/HL). Il vient de casser en dessous du dernier Higher Low à 1.0820. Qu'est-ce que ça signifie ?"
        options={[
          "La tendance haussière est confirmée — c'est un bon moment d'acheter maintenant",
          "C'est un CHoCH — la structure haussière est fragilisée, tu passes en observation",
          "La tendance baissière est officielle — tu entres en short immédiatement",
          "C'est une information neutre — aucune action à prendre",
        ]}
        correctIndex={1}
        explanation="Casser le dernier Higher Low en tendance haussière est la définition du CHoCH. La structure haussière est compromise. Tu ne cherches plus d'achats — tu observes si un BOS baissier confirme le retournement."
        answerExplanations={[
          "Faux. Casser le dernier HL est l'inverse d'un signal d'achat. C'est la première rupture de la structure haussière — tu ne dois pas acheter maintenant.",
          "Correct. CHoCH = Change of Character. La structure haussière est fragilisée. Tu passes en mode observation et attends un BOS baissier pour confirmer le retournement avant d'entrer en short.",
          "Faux. Un CHoCH seul ne confirme pas un retournement. Il faut un BOS baissier (cassure du dernier LL) pour officialiser la nouvelle tendance. Entrer en short immédiatement, c'est anticiper sans confirmation.",
          "Faux. Un CHoCH est une information très importante — c'est le premier signal que le contexte change. L'ignorer, c'est rater un avertissement majeur du marché.",
        ]}
      />

    </LessonPage>
  );
}
