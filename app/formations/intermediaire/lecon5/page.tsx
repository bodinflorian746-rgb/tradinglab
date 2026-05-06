import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { ConfluenceDiagram } from "@/app/components/charts/ConfluenceDiagram";

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon5"
      title="Confluences et probabilité"
      subtitle="Un seul signal, c'est un pari. Trois signaux alignés sur le même niveau, c'est un trade construit. La différence, c'est ta probabilité de succès."
      duration="20 min"
      lessonNumber={5}
      prev={{ href: "/formations/intermediaire/lecon4", label: "Leçon 4 — Tendances" }}
      next={{ href: "/formations/intermediaire/lecon6", label: "Leçon 6 — Fake Breakout" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">Quand les confluences s'alignent</h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          Tu ouvres EUR/USD en H4. Tu vois : le prix est sur un support historique → ET c'est aussi le dernier Higher Low en tendance haussière → ET un niveau de Fibonacci 61.8% pointe vers la même zone. Trois raisons indépendantes au même endroit. <strong className="text-white">C'est ça, une confluence.</strong>
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Règle fondamentale :</span> n'entre jamais sur une seule raison. Chaque confluence supplémentaire indépendante augmente la probabilité — et réduit le risque d'une entrée dans le mauvais sens.
          </p>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <ConfluenceDiagram />
      </div>

      {/* ── Les confluences ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les confluences à combiner</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Chaque catégorie apporte un type d'information différent. C'est leur combinaison qui crée la valeur — pas leur nombre seul.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Tendance (structure de marché)", detail: "La direction dominante — haussière ou baissière. C'est la base. Vérifier en Daily en premier.", color: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400" },
            { label: "Zone S/R ou SD", detail: "Un niveau où le prix a déjà réagi. Un ancien support, une résistance, ou une zone de Demand/Supply.", color: "bg-blue-500/5 border-blue-500/15 text-blue-400" },
            { label: "Niveau Fibonacci", detail: "38.2%, 50% ou 61.8% du dernier mouvement impulsif. Souvent coïncide avec un S/R — c'est la puissance.", color: "bg-blue-500/5 border-blue-500/15 text-blue-400" },
            { label: "Niveau psychologique", detail: "1.1000, 45 000$, 2 000$... Les traders placent naturellement stops et ordres sur les niveaux ronds.", color: "bg-amber-400/5 border-amber-400/15 text-amber-400" },
            { label: "Signal de bougie (déclencheur)", detail: "Pin bar, engulfing, rejet. C'est la gâchette — pas la raison d'entrer. La raison, c'est les confluences au-dessus.", color: "bg-zinc-800/50 border-zinc-700/50 text-zinc-300" },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl px-4 py-3 border ${item.color}`}>
              <p className="text-sm font-semibold mb-1">{item.label}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Scénario réel ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Scénario complet — 4 confluences alignées</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Voici comment construire un trade à haute probabilité, étape par étape.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Daily haussier (HH/HL) — ton biais : achats uniquement." },
            { step: "2", text: "H4 : le prix recule vers le dernier Higher Low à 1.0850." },
            { step: "3", text: "1.0850 coïncide avec un support historique respecté 2× dans le passé." },
            { step: "4", text: "Fibonacci 61.8% du dernier mouvement impulsif = 1.0848." },
            { step: "✓", text: "M15 : une pin bar haussière se forme dans la zone. Signal validé. Tu entres en achat." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-5 ${item.step === "✓" ? "text-emerald-400" : "text-emerald-400/60"}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Résultat :</span> 4 confluences indépendantes sur le même niveau. Entrée à 1.0851, SL à 1.0835, TP à 1.0950. R/R = 1:6.
          </p>
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Compter ses confluences avant d'entrer</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Quelle est la tendance ?", d: "Daily haussier → achats. Baissier → ventes. Pas de tendance → pas de trade." },
            { n: "2", t: "Y a-t-il un niveau de structure sur ma zone ?", d: "S/R, Higher Low, zone SD ? Si oui, première confluence validée." },
            { n: "3", t: "Y a-t-il une deuxième confluence indépendante ?", d: "Fibonacci ? Niveau psychologique ? Si oui, le trade est qualifié. Si non, on attend." },
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
        <h2 className="text-lg font-semibold text-white mb-4">La règle des confluences</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">3+ confluences alignées + signal de bougie</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu entres. C'est un trade à haute probabilité. SL logique sous/au-dessus de la zone. TP vers la prochaine zone de structure.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">2 confluences + signal de bougie</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu peux entrer avec une taille réduite. Le trade est possible mais moins solide. Assure-toi que la tendance est alignée.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">1 seule confluence</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu ne trades pas. Un seul signal = un pari. Attends que d'autres confluences s'ajoutent ou passe à la prochaine opportunité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Compter des confluences redondantes comme des confluences indépendantes</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Tu vois : RSI en survente + MACD croisé + Stochastique bas. Tu penses "3 confluences". Mais ces 3 indicateurs utilisent les mêmes données de prix — ils disent tous la même chose de 3 façons différentes. 3 indicateurs = 1 seule confluence. Les vraies confluences sont indépendantes : tendance, S/R, Fibonacci, niveau psychologique.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>3+ confluences + signal → tu entres (taille normale)</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>2 confluences + signal → taille réduite, tu cherches encore</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>1 seule confluence → tu ne trades pas</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Confluence = une raison indépendante qui soutient ton trade. Minimum 2-3 avant d'entrer.",
          "Les 5 principales : tendance, S/R, SD zone, Fibonacci, niveau psychologique.",
          "Le signal de bougie est le déclencheur — pas la raison principale d'entrer.",
          "Les indicateurs (RSI, MACD) ne sont pas des confluences indépendantes entre eux.",
          "Qualité prime sur quantité : 3 confluences solides valent mieux que 6 médiocres.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, construis un setup complet avec 3 confluences minimum sur EUR/USD."
        steps={[
          "Analyse EUR/USD en Daily — quelle est la tendance ? Note ton biais (achat ou vente uniquement).",
          "Descends en H4 — identifie le prochain niveau de structure clé (HL en haussier, LH en baissier).",
          "Vérifie : y a-t-il un S/R historique ou une zone SD qui coïncide avec ce niveau ? Note la confluence.",
          "Trace Fibonacci sur le dernier mouvement impulsif — un niveau Fib coïncide-t-il avec ta zone ? Si oui, 3 confluences alignées. Note l'entrée, le SL et le TP avec le R/R.",
        ]}
      />

      <LessonQuiz
        question="Tu vois EUR/USD Daily haussier. Le prix retrace sur 1.0850. C'est aussi un support historique respecté 2×. Pas d'autre confluence. Que fais-tu ?"
        options={[
          "Tu achètes immédiatement — 2 confluences (tendance + support) suffisent amplement",
          "Tu attends un signal de bougie de rejet sur 1.0850 avant d'entrer",
          "Tu cherches une 3ème confluence (Fibonacci, niveau psychologique) puis un signal de bougie",
          "Tu n'entres pas — 2 confluences, c'est trop peu pour un trade",
        ]}
        correctIndex={2}
        explanation="2 confluences sont un début, mais pas encore suffisant pour entrer avec confiance. Tu cherches une 3ème confluence (Fibonacci 61.8% ? Niveau psychologique 1.0850 ?) puis tu attends un signal de bougie sur la zone. C'est le processus complet."
        answerExplanations={[
          "Trop hâtif. 2 confluences sans signal de confirmation, c'est entrer trop tôt. Le prix peut continuer à baisser dans la zone. Attends au minimum un signal de bougie sur le niveau.",
          "Mieux, mais incomplet. Attendre le signal est une bonne pratique, mais chercher une 3ème confluence avant renforce encore le trade. La combinaison des deux est la méthode optimale.",
          "Correct. Tu as 2 confluences solides. Cherche si un niveau Fibonacci (61.8% du mouvement) ou un niveau psychologique coïncide avec 1.0850 — si oui, tu as 3 confluences. Ensuite tu attends le signal de bougie. C'est le processus complet.",
          "Pas tout à fait. 2 confluences peuvent justifier un trade avec une taille réduite. 3 confluences + signal = taille normale. Ce n'est pas l'absence de trade qui est recommandée, mais l'ajout d'une 3ème confirmation.",
        ]}
      />

    </LessonPage>
  );
}
