import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { GraphFakeBreakout } from "@/app/components/charts/GraphFakeBreakout";

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon6"
      title="Fake Breakout — ne pas se faire piéger"
      subtitle="Le prix casse un niveau, tu entres dans le sens de la cassure — et le prix revient immédiatement dans l'autre sens. Ce piège arrive plusieurs fois par semaine. Voici comment le reconnaître et même le trader."
      duration="18 min"
      lessonNumber={6}
      prev={{ href: "/formations/intermediaire/lecon5", label: "Leçon 5 — Confluences" }}
      next={{ href: "/formations/intermediaire/lecon7", label: "Leçon 7 — Multi-Timeframe" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">À quoi ressemble un fake breakout</h2>
        <div className="space-y-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Fake breakout haussier (piège à acheteurs)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Tu regardes EUR/USD. Le prix s'approche d'une résistance à 1.0950. Il perce au-dessus → 1.0960, 1.0965. Tu vois des acheteurs entrer. Puis le prix revient violemment sous 1.0950. La bougie H1 a une longue mèche haute et clôture <strong className="text-white">sous la résistance</strong>. Les acheteurs sont piégés.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Fake breakout baissier (piège à vendeurs)</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le prix perce sous un support à 1.0850 → descend à 1.0840. Les vendeurs entrent. Le prix remonte violemment et clôture <strong className="text-white">au-dessus du support</strong>. Longue mèche basse visible. Les vendeurs sont piégés.
            </p>
          </div>
        </div>
      </section>

      {/* ── Schéma visuel ── */}
      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <GraphFakeBreakout />
        <div className="flex justify-center pt-1 border-t border-zinc-800/50">
          <Candle
            type="pin-bear"
            label="La bougie piège"
            caption="Mèche haute + clôture sous la résistance"
          />
        </div>
      </div>

      {/* ── Pourquoi ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Pourquoi les fake breakouts arrivent</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Les niveaux évidents concentrent naturellement des ordres. Au-dessus d'une résistance → des stops d'acheteurs short + des ordres d'entrée d'acheteurs cassuristes. Le marché va chercher cette liquidité, déclenche tous ces ordres, puis repart dans l'autre sens.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Ce qui se passe</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Le prix monte, déclenche les ordres d'achat au-dessus de la résistance. Ces achats font monter légèrement. Mais il n'y a pas assez de momentum pour continuer. Le prix revient en dessous — et les acheteurs qui ont suivi la cassure sont maintenant en perte.
            </p>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400">
              <span className="text-white font-medium">Règle clé :</span> plus un niveau est évident et connu de tous, plus le risque de fake breakout est élevé. Méfie-toi des cassures "trop belles".
            </p>
          </div>
        </div>
      </section>

      {/* ── Comment reconnaître ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Comment reconnaître un fake breakout</h2>
        <div className="space-y-2.5">
          {[
            { label: "La bougie clôture de l'autre côté du niveau", detail: "Signal principal. Le prix perce le niveau mais la clôture reste de l'autre côté → fake breakout. Attends toujours la clôture — jamais l'intrabar." },
            { label: "Longue mèche dans la direction de la cassure", detail: "Une mèche haute au-dessus d'une résistance avec clôture dessous = rejet fort. C'est le signe visuel numéro 1 du fake breakout." },
            { label: "Le retour est rapide et agressif", detail: "Après un fake, le retournement est violent. Le prix ne tergiverse pas — il revient avec momentum. C'est lui-même un signal." },
            { label: "La tendance de fond contredit la cassure", detail: "Cassure haussière dans une forte tendance baissière = suspect. Le marché cherche des stops, pas une vraie direction." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <path d="M7 2v5M7 10v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trader le fake breakout ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Trader le fake breakout — le setup en sens inverse</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Une fois identifié, tu peux trader le fake breakout dans le sens du retournement. C'est l'un des setups les plus puissants : tu entres exactement après que les stops ont été ramassés.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "EUR/USD résistance à 1.0950. Le prix monte à 1.0962 puis revient.", color: "text-zinc-400" },
            { step: "2", text: "La bougie H1 clôture SOUS 1.0950. Mèche haute visible. Fake breakout confirmé.", color: "text-amber-400" },
            { step: "3", text: "Tu entres en short à la clôture de cette bougie. SL au-dessus du pic (1.0965).", color: "text-emerald-400" },
            { step: "4", text: "TP vers le prochain support (1.0880). R/R = 1:3. Les acheteurs piégés alimentent la baisse.", color: "text-emerald-400" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-4 ${item.color}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Vérifier si une cassure est vraie ou fausse</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Attends la clôture de la bougie", d: "Règle absolue. Ne jamais juger une cassure sur un prix intrabar. La clôture est le seul juge." },
            { n: "2", t: "La clôture est-elle de l'autre côté du niveau ?", d: "Oui = potentiellement vraie cassure. Non (mèche longue + clôture de l'autre côté) = fake breakout." },
            { n: "3", t: "Le retournement est-il violent ?", d: "Retour rapide et agressif sous le niveau = confirmation du fake. Tu peux entrer dans le sens inverse." },
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
        <h2 className="text-lg font-semibold text-white mb-4">Face à une cassure de niveau</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Vraie cassure (clôture franche au-delà)</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu peux suivre la cassure avec un SL de l'autre côté du niveau. Mais attends idéalement un pullback sur le niveau cassé avant d'entrer.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">!</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Fake breakout (mèche + clôture de l'autre côté)</p>
              <p className="text-xs text-zinc-400 mt-0.5">Ne suis pas la cassure. Tu peux entrer en sens inverse avec SL au-delà du pic, TP vers le prochain niveau.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Incertitude (bougie encore ouverte)</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu ne fais rien. Jamais de décision sur une bougie non clôturée. Attends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Entrer sur la cassure avant la clôture de bougie</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Le prix perce la résistance à 1.0950 → grimpe à 1.0962 en intrabar. Tu achètes immédiatement "pour ne pas rater le mouvement". La bougie clôture à 1.0945 — en dessous de la résistance. Tu es en short involontairement. La règle est simple : clôture de bougie d'abord, décision ensuite.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Clôture franche AU-DESSUS du niveau → vraie cassure → tu peux suivre</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Mèche + clôture EN-DESSOUS → fake breakout → tu vends en sens inverse</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Bougie encore ouverte → tu attends toujours la clôture</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Fake breakout = le prix perce un niveau mais la bougie clôture de l'autre côté.",
          "Signal visuel : mèche longue au-delà du niveau + clôture qui reste de l'autre côté.",
          "Règle absolue : attendre la clôture de bougie avant de juger une cassure.",
          "Le fake breakout se trade dans le sens inverse : entrée au retournement, SL au-delà du pic.",
          "Plus un niveau est évident, plus le risque de fake breakout est élevé.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, ouvre EUR/USD en H1 et chasse les fake breakouts récents."
        steps={[
          "Identifie les 3 niveaux de support et résistance les plus visibles des 4 dernières semaines.",
          "Pour chaque niveau, examine les bougies qui l'ont approché : y a-t-il des mèches qui percent le niveau avec une clôture de l'autre côté ?",
          "Pour chaque fake breakout trouvé, note : le prix est-il reparti dans la direction opposée ? Dans combien de bougies ?",
          "Identifie le meilleur fake breakout que tu aurais pu trader. Note l'entrée, le SL et le TP théoriques.",
        ]}
      />

      <LessonQuiz
        question="Sur EUR/USD H1, le prix monte et perce la résistance à 1.0950 pendant la bougie en cours. La bougie n'est pas encore clôturée et affiche +18 pips au-dessus du niveau. Que fais-tu ?"
        options={[
          "Tu achètes immédiatement — la cassure est en cours et tu veux être dans le mouvement",
          "Tu attends la clôture de cette bougie H1 avant de prendre une décision",
          "Tu vends — le prix a monté trop vite, c'est forcément un fake",
          "Tu places un ordre d'achat juste au-dessus de 1.0950 pour la prochaine bougie",
        ]}
        correctIndex={1}
        explanation="La règle est absolue : attends la clôture de la bougie. Le prix peut être à +18 pips au-dessus en intrabar et clôturer sous la résistance — c'est exactement la définition d'un fake breakout. Décider avant la clôture, c'est trader sur un prix provisoire."
        answerExplanations={[
          "Faux. La cassure n'est pas encore confirmée. Le prix peut revenir sous 1.0950 avant la clôture. Entrer maintenant, c'est réagir à un prix temporaire. Si la bougie clôture sous 1.0950, tu es dans le mauvais sens.",
          "Correct. La clôture de bougie est le seul moment où tu peux juger une cassure. Si elle clôture au-dessus de 1.0950 → potentiellement vraie cassure. Si elle clôture en dessous → fake breakout. Tu attends.",
          "Faux. +18 pips sur une résistance peut être le début d'une vraie cassure — pas nécessairement un fake. Tu ne peux pas conclure 'faux breakout' sans la clôture de la bougie.",
          "Risqué. Placer un ordre limite juste au-dessus de 1.0950 pour la prochaine bougie, c'est anticiper une continuation sans confirmation. Attends la clôture d'abord.",
        ]}
      />

    </LessonPage>
  );
}
