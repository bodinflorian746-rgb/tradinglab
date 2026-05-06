import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { Candle } from "@/app/components/charts/Candle";
import { SupportResistance } from "@/app/components/charts/SupportResistance";

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon2"
      title="Zones clés — Support & Résistance"
      subtitle="Les zones clés sont les niveaux où le prix s'est déjà arrêté. Ce sont les seuls endroits où tu dois trader — tout le reste est du bruit."
      duration="22 min"
      lessonNumber={2}
      prev={{ href: "/formations/intermediaire/lecon1", label: "Leçon 1 — Structure" }}
      next={{ href: "/formations/intermediaire/lecon3", label: "Leçon 3 — Supply & Demand" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">Identifier les zones en un coup d'œil</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Zone de support</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Tu vois le prix descendre, atteindre un niveau, rebondir vers le haut. Descendre encore, atteindre le même niveau, rebondir à nouveau. <strong className="text-white">Ce niveau répété = zone de support.</strong> Les acheteurs défendent ce plancher.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Zone de résistance</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le prix monte, atteint un niveau, est repoussé vers le bas. Monte encore, atteint le même niveau, rejeté à nouveau. <strong className="text-white">Ce plafond répété = zone de résistance.</strong> Les vendeurs défendent ce sommet.
            </p>
          </div>
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-3 py-2">
          <p className="text-xs text-zinc-400"><span className="text-white font-medium">Clé :</span> ce sont des <span className="text-white font-medium">zones</span> (rectangles), pas des lignes. Le prix ne respecte jamais un niveau à la bougie près.</p>
        </div>
      </section>

      {/* ── Schéma visuel ── */}
      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <SupportResistance supportPrice="1.0800" resistancePrice="1.0950" />
        <div className="flex justify-around items-start pt-1 border-t border-zinc-800/50">
          <Candle type="pin-bull" label="Rejet support" caption="Pin bar haussière" />
          <div className="flex flex-col items-center justify-center gap-1 mt-8">
            <p className="text-[10px] text-zinc-600 font-mono text-center leading-relaxed">Signal<br/>→ entrée<br/>+ SL sous zone</p>
          </div>
          <Candle type="pin-bear" label="Rejet résistance" caption="Pin bar baissière" />
        </div>
      </div>

      {/* ── Support & Résistance ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Polarité — quand le rôle s'inverse</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Quand un support est cassé avec conviction, il devient une résistance. Quand une résistance est cassée, elle devient un support. C'est l'une des dynamiques les plus fiables du marché.
        </p>
        <div className="space-y-2.5">
          <div className="bg-zinc-800/50 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-white mb-1">Scénario réel — EUR/USD</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              EUR/USD rebondit 3× sur 1.0800 (support). Puis le prix casse 1.0800 avec une grosse bougie baissière. Il remonte ensuite tester 1.0800 → cette zone était un support, elle devient maintenant une résistance. Tu peux y vendre avec un SL au-dessus.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Sens opposé</p>
            <p className="text-xs text-zinc-400">Résistance cassée → devient support. Le prix casse 1.0950, pullback sur 1.0950 → zone d'achat. Les anciens vendeurs sont piégés, les acheteurs reprennent la main.</p>
          </div>
        </div>
      </section>

      {/* ── Order Blocks ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Order Blocks — où les institutions ont agi</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un Order Block (OB) est la dernière bougie de direction opposée avant un mouvement impulsif. C'est là qu'une institution a passé un gros ordre. Le prix y revient souvent pour compléter l'exécution.
        </p>
        <div className="space-y-2.5 mb-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-emerald-400 mb-1">Bullish OB</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tu vois une bougie rouge, puis une explosion haussière. La bougie rouge = l'OB bullish. Quand le prix revient dans cette zone rouge, cherche un achat.
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-red-400 mb-1">Bearish OB</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tu vois une bougie verte, puis une explosion baissière. La bougie verte = l'OB bearish. Quand le prix remonte dans cette zone verte, cherche une vente.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Trouver les zones importantes rapidement</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Cherche les creux alignés sur le graphique", d: "Plusieurs creux au même niveau = zone de support. Trace un rectangle qui les englobe." },
            { n: "2", t: "Cherche les sommets alignés", d: "Plusieurs sommets au même niveau = zone de résistance. Trace un rectangle horizontal." },
            { n: "3", t: "Note si une zone a changé de rôle", d: "Un support cassé + pullback sur ce niveau = vente. Une résistance cassée + pullback = achat." },
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
        <h2 className="text-lg font-semibold text-white mb-4">La logique du trader sur les zones</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Le prix arrive sur un support</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu attends un signal de rejet (pin bar, engulfing haussier). Si le signal est là + la tendance est haussière → achat avec SL sous la zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Le prix arrive sur une résistance</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu attends un rejet (mèche haute, engulfing baissier). Si le signal est là + la tendance est baissière → vente avec SL au-dessus de la zone.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Prix au milieu entre deux zones</p>
              <p className="text-xs text-zinc-400 mt-0.5">Rien à faire. Tu n'entres jamais au milieu du range. Tu attends que le prix arrive sur une zone clé.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Tracer une ligne au lieu d'une zone</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Tu traces une ligne exacte à 1.0800 et tu places ton SL à 1.0798. Le prix descend à 1.0796, déclenche ton SL, puis repart à la hausse. Le problème : le prix n'est jamais exact. Il faut tracer une zone de 10-20 pips d'épaisseur et mettre le SL sous la zone entière — pas sous la ligne.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Prix sur support + signal de rejet → tu achètes</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Prix sur résistance + signal de rejet → tu vends</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Prix entre deux zones → tu ne fais rien</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Support = zone où les acheteurs ont repoussé la baisse plusieurs fois.",
          "Résistance = zone où les vendeurs ont repoussé la hausse plusieurs fois.",
          "Polarité : support cassé → résistance. Résistance cassée → support.",
          "Order Block = dernière bougie opposée avant un mouvement impulsif — zone institutionnelle.",
          "Jamais de trade au milieu — attends toujours qu'un prix arrive sur une zone clé.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, ouvre EUR/USD en H4 et trace tes zones."
        steps={[
          "Identifie 2 zones de support : trace des rectangles horizontaux sur les creux alignés. Donne-leur de l'épaisseur (10-20 pips minimum).",
          "Identifie 2 zones de résistance : fais de même sur les sommets alignés.",
          "Vérifie la polarité : y a-t-il un niveau qui a changé de rôle récemment ? Support devenu résistance ?",
          "Identifie un Order Block récent : la dernière bougie de direction opposée avant le dernier grand mouvement. Note le niveau exact.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD rebondissait sur 1.0800 depuis 3 semaines. Le prix vient de casser 1.0800 à la baisse avec une grosse bougie baissière. Maintenant il remonte vers 1.0800. Que fais-tu ?"
        options={[
          "Tu achètes — 1.0800 est un support historique fort",
          "Tu vends sur 1.0800 — l'ancien support devient une résistance par polarité",
          "Tu ne fais rien — le niveau est trop connu, il ne fonctionnera pas",
          "Tu attends que le prix repasse au-dessus de 1.0800 pour confirmer",
        ]}
        correctIndex={1}
        explanation="C'est la polarité en action. 1.0800 était un support. Il a été cassé avec conviction. Maintenant que le prix revient tester ce niveau, il se comporte comme une résistance. Tu vends sur le pullback avec SL au-dessus de 1.0800."
        answerExplanations={[
          "Faux. 1.0800 était un support, mais il a été cassé. Une fois cassé, un support ne joue plus son rôle d'acheteur — il se retourne en résistance. Acheter ici, c'est ignorer la polarité.",
          "Correct. La polarité est l'un des comportements les plus fiables du marché. 1.0800 cassé → devient résistance. Le pullback sur ce niveau est une opportunité de vente avec un SL logique au-dessus.",
          "Faux. Les niveaux très connus fonctionnent souvent mieux, pas moins bien — c'est là que se concentrent les ordres. La popularité d'un niveau n'est pas une raison de l'ignorer.",
          "Faux. Attendre que le prix repasse au-dessus pour confirmer, c'est rater l'entrée. Le signal de vente, c'est le retour sur 1.0800 avec un rejet — pas la cassure à la hausse.",
        ]}
      />

    </LessonPage>
  );
}
