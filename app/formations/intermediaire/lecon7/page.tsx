import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { MultiTimeframeDiagram } from "@/app/components/charts/MultiTimeframeDiagram";

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon7"
      title="Analyse Multi-Timeframe"
      subtitle="Le marché raconte la même histoire à différentes échelles. Apprendre à lire ces niveaux dans le bon ordre est l'une des compétences les plus puissantes du trader."
      duration="22 min"
      lessonNumber={7}
      prev={{ href: "/formations/intermediaire/lecon6", label: "Leçon 6 — Fake Breakout" }}
      next={{ href: "/formations/intermediaire/lecon8", label: "Leçon 8 — Plan de trade" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">La même paire, deux histoires différentes</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">EUR/USD — Daily (biais)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Tu ouvres EUR/USD en Daily. Le graphique monte en escalier depuis 3 semaines. HH/HL clairs. <strong className="text-white">Biais haussier.</strong> Tu ne cherches que des achats pour la semaine.
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">EUR/USD — H4 (zone d'intérêt)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Tu passes en H4. Le prix recule vers 1.0850 — le dernier Higher Low. C'est une zone de support. <strong className="text-white">Tu marques la zone</strong> comme zone d'entrée potentielle en achat.
            </p>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-blue-400 mb-2">EUR/USD — M15 (déclencheur)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Tu passes en M15 quand le prix touche la zone. Une pin bar haussière se forme. <strong className="text-white">C'est le signal.</strong> Tu entres en achat dans le sens du Daily. Les 3 timeframes racontent la même histoire.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <MultiTimeframeDiagram />
      </div>

      {/* ── Pourquoi les timeframes se contredisent ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Pourquoi les timeframes semblent se contredire</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Le même marché peut afficher une tendance haussière en Daily et une tendance baissière en H1 simultanément. Ce n'est pas une erreur — c'est deux niveaux de lecture différents. Le Daily montre le contexte. Le H1 montre le mouvement en cours dans ce contexte.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Analogie : </span>
            Imagine regarder une carte de France (Daily) vs une carte de ta ville (H1). La France te donne la direction — la ville te donne les rues. Les deux sont justes, mais à des échelles différentes.
          </p>
        </div>
      </section>

      {/* ── Rôle de chaque timeframe ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Le rôle de chaque timeframe</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Chaque timeframe a une fonction précise. Tu ne l'utilises pas pour les mêmes raisons.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Timeframe", "Rôle", "Ce que tu y cherches"].map((h, i) => (
                  <th key={i} className="text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pb-2.5 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Weekly", "Contexte de fond", "Tendance long terme, zones majeures"],
                ["Daily", "Biais directionnel", "Tendance courante, zones clés importantes"],
                ["H4", "Zones d'intérêt", "Structures intermédiaires, SD zones"],
                ["H1", "Confirmation de setup", "Pattern de continuation, signal d'entrée"],
                ["M15 / M5", "Timing précis", "Entrée sur signal de bougie, timing final"],
              ].map((row, i) => (
                <tr key={i} className="border-t border-zinc-800/70">
                  {row.map((cell, j) => (
                    <td key={j} className={`py-2.5 pr-6 leading-snug text-sm ${j === 0 ? "text-amber-400 font-semibold" : j === 1 ? "text-white font-medium" : "text-zinc-400"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Méthode Top-Down ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">La méthode Top-Down en pratique</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La méthode top-down consiste à analyser du grand timeframe vers le petit — jamais l'inverse. Chaque niveau valide ou invalide ce que tu vois au niveau inférieur.
        </p>
        <div className="space-y-2">
          {[
            { tf: "Daily", action: "Identifie la tendance : haussière, baissière ou range ? Définis ton biais pour la semaine." },
            { tf: "H4", action: "Localise les zones clés : support, résistance, SD zones. Où le prix a-t-il historiquement réagi ?" },
            { tf: "H1", action: "Attends que le prix arrive sur une zone H4. Y a-t-il un setup dans le sens de la tendance Daily ?" },
            { tf: "M15", action: "Cherche le signal de déclenchement : rejet, engulfing, pin bar dans la zone H4." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-6">{item.tf}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.action}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Règle absolue :</span> si le Daily est haussier et que le H1 montre un signal de vente, tu n'entres pas en vente. Tu attends le prochain signal d'achat aligné.
          </p>
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Vérifier l'alignement des timeframes</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Daily — quelle est la tendance ?", d: "Haussier = cherche des achats. Baissier = cherche des ventes. Range = pas de trade directionnel." },
            { n: "2", t: "H4 — le prix est-il sur une zone clé ?", d: "Support en tendance haussière = potentiel achat. Résistance en tendance baissière = potentiel vente. Sinon → attends." },
            { n: "3", t: "M15 — y a-t-il un signal ?", d: "Pin bar, engulfing dans le sens du Daily sur la zone H4 = entrée. Si le signal va contre le Daily → ignore." },
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
        <h2 className="text-lg font-semibold text-white mb-4">Selon l'alignement des timeframes</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Daily + H4 + M15 alignés</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu entres. C'est le setup à haute probabilité. Biais Daily confirmé par zone H4, signal M15 dans le même sens.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">~</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Daily aligné, H4 pas encore sur zone</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu n'entres pas encore. Tu attends que le prix revienne sur une zone H4 dans le sens du Daily. La patience est une position.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Signal M15 contre le Daily</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu ignores. Le petit timeframe qui va contre le grand est un retracement — pas un retournement. Ne jamais trader contre le biais Daily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Entrer sur un signal M15 sans vérifier le Daily</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Tu regardes EUR/USD en M15. Tu vois un beau engulfing baissier. Tu vends. Sauf que le Daily est haussier et le prix est sur un support H4. Tu viens d'entrer exactement à contre-courant. Le prix repart à la hausse et tu perds. La règle : avant tout signal, toujours regarder le Daily d'abord. Toujours.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily + H4 + M15 alignés → tu entres</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">~</span>Daily clair, H4 pas encore sur zone → tu attends</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Signal M15 contre le Daily → tu ignores</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Toujours analyser du grand timeframe vers le petit — le Daily définit le biais, le M15 affine l'entrée.",
          "Un signal sur le petit timeframe qui contredit le grand timeframe est à ignorer.",
          "Weekly/Daily = contexte et tendance. H4 = zones. H1/M15 = timing et signal.",
          "Les 3 timeframes doivent raconter la même histoire pour qu'un setup soit à haute probabilité.",
          "Plus tu descends dans les timeframes, plus tu gagnes en précision — mais le biais vient toujours du grand.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, réalise une analyse top-down complète sur EUR/USD."
        steps={[
          "Ouvre EUR/USD en Daily — quelle est la tendance ? Haussière, baissière ou range ? Note ton biais.",
          "Descends en H4 — identifie les 2 zones les plus importantes (support ou résistance selon la tendance). Note les prix exacts.",
          "Descends en H1 — est-ce que le prix est proche d'une de ces zones H4 ? Y a-t-il un signal naissant dans le sens du Daily ?",
          "Descends en M15 — si le signal H1 est présent, est-ce que le M15 confirme ? Note si les 3 timeframes s'alignent ou se contredisent.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD est clairement haussier en Daily. Tu passes en H1 et tu vois un engulfing baissier net sur une résistance H1. Que fais-tu ?"
        options={[
          "Tu prends le Short en H1 — le signal est propre et récent",
          "Tu ignores le signal H1 — il va contre la tendance Daily, tu attends un signal d'achat aligné",
          "Tu attends que le Daily retourne à la baisse pour confirmer avant d'entrer",
          "Tu prends le Short mais avec une position deux fois plus petite pour limiter le risque",
        ]}
        correctIndex={1}
        explanation="En analyse multi-timeframe, le grand timeframe prime toujours. Si le Daily est haussier, tu cherches des achats — pas des ventes. Le signal H1 baissier est probablement un retracement dans la tendance Daily haussière — exactement là où tu pourrais chercher un Long."
        answerExplanations={[
          "Faux. Trader un signal H1 contre une tendance Daily forte est statistiquement défavorable. Tu vas à contre-courant de la direction dominante — même si le signal technique semble propre.",
          "Correct. La règle top-down est claire : le Daily définit le biais. Si Daily = haussier, tu ne cherches que des achats. Le signal H1 baissier signifie que le prix est en retracement. C'est justement là où tu cherches un achat — pas une vente.",
          "Partiellement valide mais trop conservateur. Attendre que le Daily retourne est une approche très lente. En pratique, un signal H1 baissier dans une tendance Daily haussière est un retracement temporaire, pas un signal de retournement.",
          "Faux. Réduire la taille ne change pas le problème fondamental : tu trades contre la tendance dominante. La taille de position gère le risque — elle ne compense pas une mauvaise direction.",
        ]}
      />

    </LessonPage>
  );
}
