"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { InflationChainDiagram } from "@/app/components/charts/InflationChainDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "C'est quoi la macro",              href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Les 4 grandes banques centrales",  href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Les chiffres macro à surveiller",  href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Comprendre l'inflation",           href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "Le rôle du dollar dans le monde",  href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro et risk management",         href: null,                                disabled: true  },
];

export default function MacroDebutantLecon4() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon4"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/formations" className="hover:text-zinc-400 transition-colors">Formations</Link>
          <span>/</span>
          <Link href="/formations/macro" className="hover:text-zinc-400 transition-colors">Macro Trading</Link>
          <span>/</span>
          <Link href="/formations/macro/debutant" className="hover:text-zinc-400 transition-colors">Débutant</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 4</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Débutant
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">12 min</span>
            {done && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1 4.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Terminée
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-4">
            Comprendre l&apos;inflation — pourquoi tout part de là
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              2022. La baguette passe de 1€ à 1,30€. Et au même moment, la Fed monte ses taux 20 fois en 18 mois.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Ce n&apos;est pas un hasard.
            </p>
          </div>

          {/* Indicateur de structure */}
          <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
            {["Lecture", "À retenir", "Exercice", "Quiz"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span>{step}</span>
                {i < arr.length - 1 && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-800 shrink-0">
                    <path d="M3 2l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            ))}
          </div>

          {/* Pills des leçons */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {LESSONS.map((lesson) => {
              const isCurrent = lesson.id === "lecon4";
              const pill = (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">4 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — L'inflation, c'est concret */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">L&apos;inflation, c&apos;est concret (pas théorique)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              L&apos;inflation, c&apos;est simple :
            </p>
            <ul className="space-y-1.5 mb-4">
              {["les prix augmentent", "ton argent vaut moins"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm font-semibold text-zinc-200 mb-2">Exemple réel :</p>
              <ul className="space-y-1">
                <li className="text-sm text-zinc-300">une baguette à 1€</li>
                <li className="text-sm text-zinc-300">deux ans plus tard → 1,30€</li>
              </ul>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu n&apos;as rien fait. Mais ton pouvoir d&apos;achat a baissé. <span className="font-semibold text-zinc-200">C&apos;est ça l&apos;inflation.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Elle est mesurée en % par an :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "2%", rest: " → normal" },
                { bold: "5%+", rest: " → problématique" },
              ].map((item) => (
                <li key={item.bold} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Quand les prix montent, ton argent descend.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Pourquoi les banques centrales détestent ça */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi les banques centrales détestent ça</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Une inflation trop élevée, c&apos;est dangereux :
            </p>
            <ul className="space-y-1.5 mb-4">
              {["elle détruit l'épargne", "elle crée de l'instabilité", "elle peut mener à une crise"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Les banques centrales ont une mission : <span className="font-semibold text-zinc-200">maintenir l&apos;inflation autour de 2%</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Pourquoi ?</p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "trop bas", rest: " → économie lente" },
                { bold: "trop haut", rest: " → économie instable" },
              ].map((item) => (
                <li key={item.bold} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Donc dès que l&apos;inflation monte trop, elles doivent agir.
            </p>
          </section>

          {/* Bloc 3 — La chaîne qui contrôle le marché */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La chaîne qui contrôle le marché</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Voici le mécanisme le plus important de toute la macro :
            </p>
            <div className="space-y-2 mb-4">
              {[
                { n: "1", text: "Inflation monte" },
                { n: "2", text: "La banque centrale réagit" },
                { n: "3", text: "Elle monte les taux" },
                { n: "4", text: "La devise devient plus attractive" },
                { n: "5", text: "Les marchés réagissent" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-2.5">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed font-semibold text-zinc-200">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Résultat</span> :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "devise monte",
                "indices baissent souvent",
                "or baisse souvent",
                "crypto baisse souvent",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Inflation = point de départ. Tout le reste suit.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Exemple réel (2022-2023) */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Exemple réel (2022-2023)</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              C&apos;est exactement ce qui s&apos;est passé récemment.
            </p>
            <div className="space-y-3 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Phase 1 — L&apos;inflation explose</p>
                <p className="text-sm text-zinc-300">
                  l&apos;inflation US monte de 1.4% à <span className="font-semibold text-zinc-200">9.1%</span> (record sur 40 ans).
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Phase 2 — La Fed panique et agit</p>
                <p className="text-sm text-zinc-300">
                  elle monte ses taux de <span className="font-semibold text-zinc-200">0.25% à 5.5%</span> en moins de 18 mois — l&apos;un des cycles de hausse les plus violents de l&apos;histoire.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">Phase 3 — Le dollar explose</p>
                <p className="text-sm text-zinc-300">
                  le DXY (indice dollar) gagne <span className="font-semibold text-zinc-200">+20%</span> en 2022. EUR/USD passe de 1.20 à 0.95.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">Phase 4 — Tous les marchés se font massacrer</p>
                <ul className="space-y-1">
                  <li className="text-sm text-zinc-300">Nasdaq : <span className="font-semibold text-zinc-200">-33%</span> sur 2022</li>
                  <li className="text-sm text-zinc-300">Bitcoin : <span className="font-semibold text-zinc-200">-65%</span> sur l&apos;année</li>
                  <li className="text-sm text-zinc-300">Or : volatil avec des creux à <span className="font-semibold text-zinc-200">-15%</span></li>
                  <li className="text-sm text-zinc-300">Obligations : pire année depuis 100 ans</li>
                </ul>
              </div>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <InflationChainDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Une seule cause macro a fait bouger TOUT le marché.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Comment les traders la surveillent */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment les traders la surveillent</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu ne regardes pas l&apos;inflation directement tous les jours.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Mais tu surveilles :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { text: "les publications mensuelles (comme ", bold: "CPI", after: ")" },
                { text: "les discours des banques centrales", bold: null, after: null },
                { text: "les attentes du marché", bold: null, after: null },
                { text: "les indicateurs liés (comme le ", bold: "Core PCE", after: " — l'indicateur préféré de la Fed)" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>
                    {item.text}
                    {item.bold && <span className="font-semibold text-zinc-200">{item.bold}</span>}
                    {item.after}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm">
              Le but n&apos;est pas d&apos;être expert. Le but est de <span className="font-semibold text-zinc-200">comprendre la direction</span>.
            </p>
          </section>

          {/* Bloc 6 — Pourquoi c'est vital pour toi */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi c&apos;est vital pour toi</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si tu comprends l&apos;inflation :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "tu comprends pourquoi les banques centrales bougent",
                "tu comprends pourquoi le dollar monte ou baisse",
                "tu comprends pourquoi les marchés réagissent",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Tu trades sans suivre l&apos;inflation US ? C&apos;est comme conduire sur l&apos;autoroute sans regarder le compteur de vitesse. Tu vas peut-être survivre 10 minutes — mais pas longtemps.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si tu comprends l&apos;inflation, tu comprends le marché.
              </p>
            </div>
          </section>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "L'inflation = hausse des prix + baisse du pouvoir d'achat",
              "Les banques centrales la contrôlent via les taux",
              "La chaîne centrale : Inflation → Taux → Devise → Marchés",
              "Comprendre l'inflation = comprendre 80% de la macro",
            ]}
          />

          <LessonExercice
            description="Commence à intégrer l'inflation dans ton analyse."
            steps={[
              "Cherche le niveau actuel d'inflation US (approximation suffit, sur Investing.com).",
              "Note s'il est élevé ou faible (au-dessus ou en dessous de 2-3%).",
              "Regarde la tendance sur les 6 derniers mois (en hausse ou en baisse).",
              "Observe le comportement du dollar (DXY ou EUR/USD) sur la même période.",
              "Pose-toi la question : est-ce cohérent avec la chaîne de causalité ?",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : <span className="font-semibold text-zinc-400">créer le lien entre inflation et marché</span> dans ta tête.
          </p>

          <LessonQuiz
            question="L'inflation US sort à 5% (au lieu de 3% attendus). Sans même connaître la suite, quelle est la réaction la plus probable du dollar dans les heures qui suivent ?"
            options={[
              "Le dollar baisse — l'inflation est mauvaise pour la devise",
              "Le dollar monte — le marché anticipe que la Fed va monter ses taux pour combattre l'inflation",
              "Aucun mouvement — l'inflation ne touche que les consommateurs, pas les marchés",
              "Le dollar ne réagit que quand la Fed prend une vraie décision",
            ]}
            correctIndex={1}
            explanation="Le marché anticipe la chaîne de causalité avant même que la Fed n'agisse. Inflation surprise haute → anticipation de hausse de taux → demande accrue de dollars → dollar monte. C'est exactement ce qui s'est passé en 2022 quand l'inflation a explosé : le DXY a monté avant même les hausses de taux. L'option A confond cause à long terme et réaction immédiate. L'option C est fausse — l'inflation est LE driver macro principal. L'option D ignore le rôle des anticipations : le marché bouge sur les anticipations, pas sur les faits accomplis (cf leçon 3 sur consensus vs réel)."
            answerExplanations={[
              "Faux. L'inflation haute est perçue positivement pour la devise à court terme car elle signale que la banque centrale va monter ses taux — ce qui attire les capitaux. La confusion vient du long terme où une inflation non maîtrisée peut détruire la devise.",
              "Correct. Le marché anticipe la chaîne avant même que la Fed agisse : inflation surprise → hausse de taux probable → dollar attractif → dollar monte. C'est exactement ce qui s'est passé en 2022.",
              "Faux. L'inflation est le driver macro principal de tous les marchés. Une surprise inflationniste à +2% déclenche des mouvements immédiats sur le forex, les obligations, les actions et les matières premières.",
              "Faux. Le marché bouge sur les anticipations, pas sur les décisions officielles. Dès que le chiffre CPI sort, les traders réévaluent la probabilité de hausse de taux — et le dollar bouge immédiatement.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon4"); setDone(true); }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-zinc-950 font-semibold py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-emerald-500/10"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Marquer la leçon comme terminée
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-emerald-400">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Leçon terminée</p>
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Le rôle du dollar dans le monde) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 3 — Les chiffres macro à surveiller
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Le rôle du dollar dans le monde — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
