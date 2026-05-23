import { LessonPage } from "@/app/components/LessonPage";
import RRComparisonDiagram from "@/app/components/charts/RRComparisonDiagram";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // locale lue pour conformité au pattern de routage, mais le contenu de cette
  // leçon est en français uniquement pour ce sprint (pas de _content-es prévu).
  await params;
  return (
    <LessonPage
      formationId="debutant"
      lessonId="lecon10"
      title="Risk management : pourquoi 90% des traders perdent"
      subtitle="Le problème du retail n&apos;est généralement pas l&apos;entrée. Il vient de ce qui se passe AUTOUR du trade : risque trop élevé, mauvais RR, levier excessif, revenge trading. Deux traders avec le même setup : l&apos;un finit rentable, l&apos;autre détruit son compte. La différence ne vient pas de la stratégie. Elle vient du risk management."
      duration="13 min"
      lessonNumber={10}
      prev={{ href: "/formations/debutant/lecon9", label: "Leçon 9" }}
      next={null}
    >
      {/* ── Section 1 — Le plus grand mensonge du retail ─────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Le plus grand mensonge du retail</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Le retail pense souvent : «&nbsp;Si je trouve la bonne stratégie, je deviendrai rentable.&nbsp;» C&apos;est faux. Une bonne stratégie avec un mauvais risk management finit presque toujours par mourir. Aucune stratégie ne gagne 100% du temps. Même une excellente stratégie prend des pertes, subit des drawdowns, traverse des périodes compliquées, enchaîne parfois plusieurs stops d&apos;affilée.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Le problème du retail, c&apos;est qu&apos;il construit son trading comme si les pertes ne devaient jamais arriver. Donc dès qu&apos;elles arrivent, il augmente le risque, force des setups, déplace le stop, supprime le SL, veut récupérer immédiatement. Et c&apos;est là que le compte commence réellement à mourir.
        </p>
      </section>

      {/* ── Section 2 — Comment un compte meurt vraiment ─────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Comment un compte meurt vraiment</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Un compte ne meurt généralement pas à cause d&apos;un seul trade. Il meurt à cause d&apos;une accumulation de mauvaises décisions, d&apos;un risque trop élevé, et d&apos;une incapacité à gérer émotionnellement les pertes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {/* Scénario A — Risque 1% */}
          <div className="rounded-xl border border-emerald-500/30 bg-zinc-900 p-4">
            <p className="text-sm font-bold text-emerald-400 mb-3">Scénario A — Risque 1%</p>
            <ul className="space-y-1.5 text-[13px] text-zinc-300">
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Compte</span><span className="font-mono">500&nbsp;€</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Risque par trade</span><span className="font-mono">5&nbsp;€</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">5 pertes consécutives</span><span className="font-mono">−25&nbsp;€</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Compte restant</span><span className="font-mono">475&nbsp;€</span></li>
            </ul>
            <p className="text-[13px] text-emerald-400 leading-snug mt-3 pt-3 border-t border-emerald-500/20">
              Le trader est encore totalement vivant. Il peut continuer à trader normalement.
            </p>
          </div>

          {/* Scénario B — Risque 10% */}
          <div className="rounded-xl border border-red-500/30 bg-zinc-900 p-4">
            <p className="text-sm font-bold text-red-400 mb-3">Scénario B — Risque 10%</p>
            <ul className="space-y-1.5 text-[13px] text-zinc-300">
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Compte</span><span className="font-mono">500&nbsp;€</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Risque par trade</span><span className="font-mono">50&nbsp;€</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">5 pertes consécutives</span><span className="font-mono">−250&nbsp;€</span></li>
              <li className="flex justify-between gap-3"><span className="text-zinc-500">Compte restant</span><span className="font-mono">250&nbsp;€</span></li>
            </ul>
            <p className="text-[13px] text-red-400 leading-snug mt-3 pt-3 border-t border-red-500/20">
              Le compte est détruit psychologiquement. Pour revenir à 500&nbsp;€, il faut désormais faire +100%.
            </p>
          </div>
        </div>

      </section>

      {/* ── Section 3 — Le piège psychologique du retail ─────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Le piège psychologique du retail</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Le retail veut souvent récupérer rapidement. Et c&apos;est précisément ce qui accélère la destruction du compte.
        </p>

        <h3 className="text-base font-semibold text-white mt-5 mb-3">Le cycle classique du compte qui meurt</h3>

        <ol className="space-y-2">
          {[
            "Une perte normale arrive (ça fait partie du jeu)",
            "Frustration → augmentation du lot pour « rattraper »",
            "Nouvelle perte, plus grosse → suppression du SL pour « laisser respirer »",
            "Le marché continue contre lui → revenge trading",
            "Compte brûlé en quelques heures",
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-300">{step}</span>
            </li>
          ))}
        </ol>

        <p className="text-zinc-300 leading-relaxed text-sm mt-5">
          Le problème devient alors psychologique. Le trader ne trade plus pour exécuter un setup. Il trade pour récupérer, soulager une frustration, effacer une perte, se «&nbsp;venger&nbsp;» du marché. Et dans cet état, la qualité des décisions s&apos;effondre.
        </p>
      </section>

      {/* ── Section 4 — Pourquoi le RR change tout ───────────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Pourquoi le RR change tout</h2>

        <h3 className="text-base font-semibold text-white mb-3">Imagine deux situations</h3>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Situation 1 : tu risques 20€ pour en gagner 10€.<br />
          Situation 2 : tu risques 20€ pour en gagner 40€.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Laquelle est la plus intelligente ?
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Évidemment la situation 2. Tu gagnes 4 fois plus pour exactement le même risque. Et pourtant, 90% des retails passent leur temps à prendre des trades de type Situation 1 sans s&apos;en rendre compte. Soit parce qu&apos;ils placent leur Take Profit trop tôt «&nbsp;pour sécuriser&nbsp;», soit parce qu&apos;ils acceptent des trades médiocres où le potentiel de gain est minuscule par rapport au risque.
        </p>

        <h3 className="text-base font-semibold text-white mt-6 mb-3">Le RR, c&apos;est quoi exactement ?</h3>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Le RR (risk/reward) est le rapport entre ce que tu RISQUES et ce que tu peux GAGNER sur un trade.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Si tu risques 20€ et que tu vises 40€ → ton RR est de 1:2.<br />
          Si tu risques 20€ et que tu vises 60€ → ton RR est de 1:3.<br />
          Si tu risques 20€ et que tu vises 10€ → ton RR est de 1:0,5 (catastrophique).
        </p>

        <div className="mt-5">
          <RRComparisonDiagram />
        </div>
        <p className="text-[13px] text-zinc-400 italic leading-relaxed mt-3 text-center">
          À risque égal (20€ dans les deux cas), le bon RR te fait gagner 4x plus. Et sur 10 trades avec un winrate moyen de 50%, l&apos;un te ruine, l&apos;autre te rend rentable.
        </p>

        <h3 className="text-base font-semibold text-white mt-6 mb-3">Ce que ça veut vraiment dire</h3>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Tu n&apos;as PAS besoin d&apos;avoir raison souvent pour gagner en bourse. Tu as besoin que tes trades gagnants rapportent beaucoup plus que ce que tes trades perdants te coûtent.
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800">
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Trader</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Winrate</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">RR</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Risque/trade</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Sur 10 trades</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Trader A</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">70%</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">1:0,7</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">5€</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">+9,50€</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Trader B</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">45%</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">1:3</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">5€</td>
                <td className="py-2.5 px-3 leading-snug text-emerald-400 text-sm font-semibold">+40€</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm mt-5">
          Le trader A a tort 30% du temps. Le trader B a tort 55% du temps. Et pourtant, le trader B finit 4x plus rentable. Pourquoi ? Parce que chaque fois qu&apos;il a raison, il encaisse 15€. Le trader A n&apos;encaisse que 3,50€.
        </p>

        <div className="mt-5 rounded-xl border border-emerald-500/40 bg-zinc-900 px-5 py-4">
          <p className="text-[15px] text-emerald-400 leading-relaxed font-medium italic">
            Le marché ne récompense pas «&nbsp;celui qui gagne souvent&nbsp;». Il récompense «&nbsp;celui qui perd peu quand il a tort, et gagne suffisamment quand il a raison&nbsp;».
          </p>
        </div>
      </section>

      {/* ── Section 5 — Survivre est plus important que gagner vite ──────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Survivre est plus important que gagner vite</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Le retail veut souvent doubler rapidement le compte, accélérer, utiliser beaucoup de levier, augmenter agressivement le lot. Le problème : le marché récompense rarement l&apos;agressivité durablement.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Les traders qui survivent longtemps ont généralement un risque faible, une exposition contrôlée, une croissance plus lente, une stabilité émotionnelle supérieure.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mt-3">
          Le vrai objectif n&apos;est pas de faire +300% rapidement. Le vrai objectif est de rester vivant suffisamment longtemps, accumuler de l&apos;expérience, protéger le capital, éviter la destruction émotionnelle. Parce qu&apos;un trader sans capital ne peut plus exécuter aucun setup.
        </p>
      </section>

      {/* ── Section 6 — Exemple concret XAU/USD ──────────────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Exemple concret XAU/USD — deux RR, deux résultats</h2>

        <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span>💰</span>
            <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
          </div>
          <p className="text-base text-zinc-300 leading-relaxed">
            Deux traders prennent XAU/USD au même moment, sur le même setup d&apos;entrée. Même capital de 500€, même risque de 1% (5€). La seule différence : où ils placent leur Take Profit. Donc leur RR. Voilà l&apos;impact réel sur 10 trades.
          </p>
        </div>

        <h3 className="text-base font-semibold text-white mt-5 mb-3">Même setup, deux RR — résultat après 10 trades</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-800">
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Critère</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Trader RR 1:1</th>
                <th className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wide py-2 px-3">Trader RR 1:3</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Capital départ</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">500€</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">500€</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Risque par trade</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">5€ (1%)</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">5€ (1%)</td>
              </tr>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Entrée XAU/USD</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4&nbsp;320</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4&nbsp;320</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">SL</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4&nbsp;300 (20 pts)</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4&nbsp;300 (20 pts)</td>
              </tr>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">TP</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4&nbsp;340 (20 pts, RR 1:1)</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4&nbsp;380 (60 pts, RR 1:3)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Winrate sur 10 trades</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">60%</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">40%</td>
              </tr>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Trades gagnés</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">6 × +5€ = +30€</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4 × +15€ = +60€</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Trades perdus</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">4 × -5€ = -20€</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">6 × -5€ = -30€</td>
              </tr>
              <tr className="bg-zinc-900/40">
                <td className="py-2.5 px-3 leading-snug text-white font-medium text-sm">Résultat net</td>
                <td className="py-2.5 px-3 leading-snug text-zinc-400 text-sm">+10€</td>
                <td className="py-2.5 px-3 leading-snug text-emerald-400 text-sm font-semibold">+30€</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm mt-5">
          Le trader RR 1:1 gagne plus souvent (60% des trades). Mais il finit la série à +10€. Le trader RR 1:3 perd plus souvent (60% des trades), mais il finit à +30€. Soit 3x plus rentable, avec moins de trades gagnants. C&apos;est ça, la puissance du RR : tu peux te tromper plus de la moitié du temps et être quand même beaucoup plus rentable que celui qui a raison plus souvent.
        </p>
      </section>

      {/* ── Section 7 — Ce que le retail devrait faire ───────────────────── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Ce que le retail devrait faire</h2>
        <p className="text-zinc-300 leading-relaxed text-sm">
          Règles simples à appliquer dès aujourd&apos;hui :
        </p>

        <div className="space-y-2.5 mt-4">
          {[
            "Risque par trade : 0,5% à 1% du capital (ou selon ta grille de capital — voir leçon 8)",
            "Maximum 2-3 trades par jour",
            "Stop journalier : 2% à 3% du capital",
            "RR minimum acceptable : 1:2",
            "Arrêt immédiat après une perte qui te fait perdre ta lucidité émotionnelle",
            "Jamais de revenge trading",
            "Jamais déplacer un SL pour « espérer »",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-emerald-400 shrink-0 mt-0.5"
              >
                <path
                  d="M2 7l3.5 3.5 6.5-6.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm mt-5 italic">
          Le but n&apos;est pas de gagner énormément aujourd&apos;hui. Le but est de pouvoir encore trader dans 6 mois.
        </p>
      </section>

      {/* ── Section 8 — À retenir ────────────────────────────────────────── */}
      <section className="bg-zinc-900/50 border border-emerald-500/40 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-emerald-400">
            <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 className="text-lg font-semibold text-emerald-400">À retenir</h2>
        </div>

        <p className="text-zinc-300 leading-relaxed text-sm">
          Le trader rentable n&apos;a pas une meilleure stratégie que les autres. Il a une meilleure hiérarchie mentale :
        </p>

        <ol className="space-y-2 mt-4">
          {[
            "Survivre d'abord.",
            "Protéger le capital ensuite.",
            "Performer en dernier.",
          ].map((step, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-zinc-900 border border-emerald-500/20 rounded-xl px-4 py-2.5"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                {i + 1}
              </span>
              <span className="text-sm text-zinc-300">{step}</span>
            </li>
          ))}
        </ol>

        <p className="text-zinc-300 leading-relaxed text-sm mt-4">
          Le retail inverse cette hiérarchie. Il veut performer vite, sans protéger, sans survivre. Et c&apos;est précisément pour ça qu&apos;il perd.
        </p>
      </section>
    </LessonPage>
  );
}
