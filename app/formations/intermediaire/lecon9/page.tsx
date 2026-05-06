import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { FibonacciDiagram } from "@/app/components/charts/FibonacciDiagram";

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon9"
      title="Fibonacci — retracements et confluences"
      subtitle="L'outil Fibonacci identifie les zones de retracement probabilistes dans un mouvement. Combiné à d'autres confluences, il affine considérablement la précision d'entrée."
      duration="20 min"
      lessonNumber={9}
      prev={{ href: "/formations/intermediaire/lecon8", label: "Leçon 8 — Plan de trade" }}
      next={null}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">Fibonacci en action sur EUR/USD</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Le mouvement impulsif (point de départ)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              EUR/USD monte de 1.0800 (swing low) à 1.0980 (swing high) en tendance haussière. Tu traces Fibonacci de 1.0800 à 1.0980. Les niveaux apparaissent sur le graphique : 23.6% = 1.0937, 38.2% = 1.0911, 50% = 1.0890, <strong className="text-white">61.8% = 1.0869.</strong>
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">Le retracement (zone d'entrée)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le prix recule depuis 1.0980. Il descend, descend... et s'arrête sur 1.0870. C'est le 61.8% de Fibonacci. Tu regardes — il y a aussi un support historique à ce niveau. <strong className="text-white">Confluence.</strong> Tu attends un signal de bougie avant d'entrer en achat.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Ce que tu ne dois PAS faire</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Entrer dès que le prix touche le 61.8% — sans signal. Le prix peut traverser vers le 78.6% ou en dessous. Fibonacci identifie la <strong className="text-white">zone d'attention</strong>, pas l'entrée automatique.
            </p>
          </div>
        </div>
      </section>

      {/* ── Les niveaux ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les niveaux de Fibonacci à connaître</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Les niveaux sont des ratios mathématiques appliqués à un mouvement de prix. Ils identifient les zones de rebond probabiliste lors d'un retracement.
        </p>
        <div className="space-y-2.5">
          {[
            { level: "23.6%", desc: "Retracement superficiel — tendance très forte, peu de correction. Rare.", color: "text-zinc-400" },
            { level: "38.2%", desc: "Retracement modéré — courant en tendance solide. Bon ratio risque/récompense.", color: "text-blue-400" },
            { level: "50%", desc: "Niveau psychologique fort — pas un Fibonacci pur, mais très respecté par les traders.", color: "text-blue-400" },
            { level: "61.8%", desc: "Le 'golden ratio' — zone de retracement la plus utilisée et la plus puissante. À surveiller en priorité.", color: "text-emerald-400" },
            { level: "78.6%", desc: "Retracement profond — utile pour les entrées agressives près du swing low. Risqué sans confluence.", color: "text-red-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-zinc-800/40 rounded-xl px-4 py-3">
              <span className={`text-sm font-bold shrink-0 w-12 ${item.color}`}>{item.level}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <FibonacciDiagram />
      </div>

      {/* ── Tracer correctement ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Comment tracer les Fibonacci correctement</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Les niveaux Fibonacci se tracent sur un mouvement impulsif complet — du swing low au swing high (tendance haussière), ou du swing high au swing low (tendance baissière).
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Identifie un mouvement impulsif clair : un swing low et un swing high nets sur le graphique." },
            { step: "2", text: "En tendance haussière : clique d'abord sur le swing low, puis sur le swing high. Les niveaux s'affichent entre les deux." },
            { step: "3", text: "Le prix retrace depuis le swing high → surveille les zones 38.2%, 50% et 61.8% en priorité." },
            { step: "4", text: "Cherche une confluence sur ces zones : S/R historique, zone SD, niveau psychologique (1.0850, 1.0900…). C'est là que tu prépares ton entrée." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Fibonacci + confluences ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Fibonacci + confluences = zones d'or</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Fibonacci seul n'est pas suffisant. Un niveau Fib qui coïncide avec d'autres confluences devient une zone d'intérêt majeure.
        </p>
        <div className="space-y-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Setup idéal — 3 confluences + signal</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              EUR/USD Daily haussier → 61.8% Fib à 1.0869 → ancien support historique à 1.0870 → zone de Demand non-retestée sur la même zone. Le prix arrive. Pin bar haussière. Tu entres en achat. SL sous la zone (1.0848), TP vers 1.0980.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">Limite de Fibonacci :</span> les niveaux ne sont pas des aimants magiques. Le prix peut traverser le 61.8% et continuer jusqu'au 78.6%. Utilise Fibonacci pour identifier des zones d'attention, pas pour placer des ordres sans signal.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Utiliser Fibonacci rapidement</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Y a-t-il un mouvement impulsif clair récent ?", d: "Si oui, trace Fibonacci dessus (swing low → swing high en haussier). Sinon → pas de Fibonacci utilisable." },
            { n: "2", t: "Y a-t-il une confluence sur le 61.8% ou le 50% ?", d: "S/R historique, zone SD, niveau psychologique au même niveau ? Si oui → zone d'or à surveiller." },
            { n: "3", t: "Attends le signal de bougie dans la zone", d: "Pin bar ou engulfing dans le sens de la tendance Daily sur la zone Fib = entrée. Sans signal = rien à faire." },
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
        <h2 className="text-lg font-semibold text-white mb-4">Face à un niveau Fibonacci</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Niveau Fib + confluence + signal de bougie</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu entres. C'est le setup complet. SL sous la zone Fib entière, TP vers le swing high précédent (ou la prochaine résistance).</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Niveau Fib seul (sans confluence)</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu surveilles mais tu n'entres pas encore. Fibonacci seul sans autre raison = probabilité insuffisante. Cherche une confluence avant de décider.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Entrée sur le toucher du niveau, sans signal</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu n'entres pas. Le prix peut traverser le 61.8% et continuer. Attends toujours un signal de bougie qui confirme que le prix réagit à la zone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Entrer sur chaque niveau Fibonacci automatiquement</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Le prix retrace. Il touche le 38.2% → tu achètes. Il continue à descendre. Tu achètes au 50%. Il continue. Tu achètes au 61.8%. Tu as maintenant 3 positions perdantes. Le problème : Fibonacci n'est pas une grille d'achats automatiques. C'est un outil pour identifier des zones. Si le 38.2% n'a pas de confluence et pas de signal → on ne touche pas. On attend le niveau le plus fort, avec confluence, avec signal.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>61.8% + confluence (S/R, SD) + signal de bougie → tu entres</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>Niveau Fib sans confluence → tu surveilles seulement</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Prix touche le Fib sans signal → tu n'entres pas</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Fibonacci identifie les zones de retracement probabilistes : 38.2%, 50%, 61.8% sont les plus utilisées.",
          "Trace Fibonacci sur un mouvement impulsif complet : swing low → swing high (tendance haussière).",
          "Le 61.8% (golden ratio) est le niveau le plus respecté — mais jamais infaillible.",
          "Fibonacci seul n'est pas un signal — attends une confluence (S/R, SD zone) ET un signal de bougie.",
          "Les 'zones d'or' = intersection de plusieurs confluences incluant un niveau Fib clé.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, trace et analyse des retracements de Fibonacci sur EUR/USD."
        steps={[
          "Ouvre EUR/USD en H4. Utilise l'outil Fibonacci Retracement dans les outils de tracé de TradingView.",
          "Identifie le dernier grand mouvement haussier. Trace ton Fib du swing low au swing high.",
          "Le prix a-t-il retracé ? Sur quel niveau Fib s'est-il arrêté (38.2%, 50%, 61.8%) ? Y a-t-il eu un signal de bougie sur ce niveau ?",
          "Y a-t-il d'autres confluences sur ce niveau (S/R historique, zone SD, niveau psychologique) ? Si oui, note pourquoi c'était une zone d'or.",
        ]}
      />

      <LessonQuiz
        question="Tu traces Fibonacci sur un mouvement haussier EUR/USD (1.0800 → 1.0980). Le prix retrace jusqu'au 61.8% à 1.0869. Ce niveau coïncide avec un support historique respecté 2×. Que fais-tu ?"
        options={[
          "Tu entres immédiatement en achat — le golden ratio + support, c'est assez",
          "Tu attends un signal de bougie (pin bar ou engulfing haussier) sur la zone avant d'entrer",
          "Tu passes un ordre de vente — le retracement va probablement continuer jusqu'au 78.6%",
          "Tu ignores le 61.8% — le support a déjà été touché 2×, il est affaibli",
        ]}
        correctIndex={1}
        explanation="Tu as 2 confluences solides : 61.8% Fib + support historique. C'est une zone d'or à surveiller. Mais le signal de bougie manque encore. Attends qu'une pin bar ou un engulfing haussier confirme que le prix réagit à la zone — puis tu entres avec SL sous 1.0848 et TP vers 1.0980."
        answerExplanations={[
          "Trop hâtif. Tu as 2 confluences solides, mais sans signal de bougie, tu entres sur un prix qui peut continuer à baisser vers 1.0840 ou moins. La confluence te dit 'regarde ici' — pas 'entre maintenant'.",
          "Correct. Le 61.8% + support est une zone d'or. Mais la confirmation reste nécessaire. Une pin bar haussière ou un engulfing sur cette zone te dit que les acheteurs réagissent. Tu entres alors avec SL sous la zone (1.0848) et TP vers le swing high (1.0980).",
          "Faux. En tendance haussière Daily, le retracement vers le 61.8% est une opportunité d'achat — pas de vente. Shorter ici, c'est trader contre la tendance de fond et contre 2 confluences haussières.",
          "Partiellement. Un support touché 2× est moins fort qu'un support vierge, mais il reste valide — surtout combiné au 61.8% Fib. La coïncidence des deux niveaux renforce la zone, elle ne l'annule pas.",
        ]}
      />

    </LessonPage>
  );
}
