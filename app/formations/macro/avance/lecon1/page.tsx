"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { FOMCTimelineDiagram } from "@/app/components/charts/FOMCTimelineDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                          href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                           href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "Les rendements obligataires US", href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",            href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function FOMCLecon() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon1"));
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
          <Link href="/formations/macro/avance" className="hover:text-zinc-400 transition-colors">Avancé</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avancé
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">22 min</span>
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
            FOMC — l&apos;événement qui peut changer la direction du marché
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Tu peux avoir un setup parfait, entrer au bon niveau… et te faire sortir en moins d&apos;une minute. Le FOMC crée des mouvements qui piègent les traders trop rapides. Si tu ne comprends pas son timing, tu trades le bruit.
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
              const isCurrent = lesson.id === "lecon1";
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
            <span className="ml-auto text-xs text-zinc-600">1 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-5">

          {/* Bloc 1 : Qu'est-ce que le FOMC ? */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Qu&apos;est-ce que le FOMC ?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le FOMC est le comité de la Fed qui décide des taux d&apos;intérêt et de la politique monétaire américaine.
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Le FOMC détermine le coût de l&apos;argent, donc la direction des flux sur les marchés.
              </p>
            </div>
          </section>

          {/* Bloc 2 : Pourquoi le marché y réagit autant */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi le marché y réagit autant</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Une décision de taux impacte directement :
            </p>
            <ul className="space-y-1.5 mb-4 ml-1">
              {["le dollar", "les indices", "la crypto"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Taux élevés → pression sur les marchés. Taux bas → soutien aux marchés.
            </p>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
              <p className="text-sm text-white font-semibold leading-relaxed">
                Le marché ne réagit pas à la décision. Il réagit à ce que Powell laisse entendre.
              </p>
            </div>
          </section>

          {/* Bloc 3 : Le timing exact */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le timing exact d&apos;un FOMC</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un FOMC se lit en trois phases :
            </p>
            <div className="space-y-2 mb-6">
              {[
                { time: "20h00", label: "Décision Fed", color: "text-blue-400" },
                { time: "20h30", label: "Discours Powell", color: "text-amber-400" },
                { time: "21h00+", label: "Direction réelle", color: "text-emerald-400" },
              ].map((item) => (
                <div key={item.time} className="flex items-center gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className={`text-xs font-bold shrink-0 w-14 ${item.color}`}>{item.time}</span>
                  <span className="text-sm text-zinc-300">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Visuel SVG */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <FOMCTimelineDiagram />
            </div>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-4 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Exemple concret</p>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                À 20h00, EUR/USD peut faire +100 à +150 pips en 3 minutes — parfois plus. Tu vois le breakout, tu entres. À 20h30, Powell parle. Le marché inverse. Entre 20h30 et 21h30, EUR/USD peut perdre 200 à 400 pips.
              </p>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Matrice hawkish surprise — en 3 minutes</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { asset: "EUR/USD", move: "-100 à -150 pips", note: "dollar plus fort" },
                  { asset: "XAU/USD", move: "-30 à -60$", note: "or pénalisé par les taux" },
                  { asset: "Nasdaq", move: "-1.5 à -2.5%", note: "tech sous pression" },
                  { asset: "BTC/USD", move: "-800 à -2000$", note: "risk-off massif" },
                ].map((item) => (
                  <div key={item.asset} className="bg-zinc-900/60 rounded-lg px-3 py-2">
                    <p className="text-xs font-bold text-zinc-300">{item.asset}</p>
                    <p className="text-xs text-red-400 font-semibold">{item.move}</p>
                    <p className="text-[10px] text-zinc-500">{item.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 italic">
                Sur un FOMC dovish surprise, c&apos;est l&apos;inverse : EUR/USD +100/+150, XAU/USD +30/+60$, Nasdaq +2/+3%, BTC/USD +1000/+3000$.
              </p>
            </div>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">FOMC vraiment surprise — amplitudes extrêmes</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[
                  { asset: "EUR/USD", move: "200 à 400 pips" },
                  { asset: "XAU/USD", move: "80 à 150$" },
                  { asset: "Nasdaq", move: "3 à 5%" },
                  { asset: "BTC/USD", move: "3000 à 6000$" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between bg-zinc-900/40 rounded-lg px-3 py-1.5">
                    <span className="text-xs font-semibold text-zinc-300">{item.asset}</span>
                    <span className="text-xs text-zinc-400">{item.move}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 italic">
                À ce niveau d&apos;amplitude, ce n&apos;est plus du trading. C&apos;est de la gestion de panique.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              La première impulsion est instable et peut s&apos;inverser violemment. C&apos;est rarement la vraie direction.
            </p>
          </section>

          {/* Bloc 4 : ERREUR CLASSIQUE */}
          <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
            <p className="text-sm font-semibold text-white mb-3">Tu te précipites sur la première bougie</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Tu vois la bougie partir à la hausse. Tu te dis : &quot;je dois entrer maintenant&quot;. Tu achètes. 30 secondes plus tard, le marché ralentit. Puis il inverse. Ton stop est touché.
            </p>
            <div className="bg-zinc-900/40 border border-red-500/15 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 italic leading-relaxed">
                La première impulsion sert souvent à prendre la liquidité, pas à donner une direction.
              </p>
            </div>
          </section>

          {/* Bloc 5 : Comment trader un FOMC */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Comment trader un FOMC</h2>
            <div className="space-y-2 mb-4">
              {[
                "Tu observes DXY + EUR/USD entre 19h45 et 21h00",
                "Tu attends une clôture M5 ou M15 confirmée après 21h00",
                "Tu cherches une confluence avec un niveau technique fort",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                  <span className="text-emerald-500 font-bold text-base shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-3">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Actifs à surveiller pendant un FOMC</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", role: "baromètre du dollar" },
                  { asset: "XAU/USD", role: "sensibilité maximale aux taux réels" },
                  { asset: "Nasdaq", role: "impact direct des taux sur la tech" },
                  { asset: "BTC/USD", role: "indicateur de risk-on / risk-off" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-zinc-300 shrink-0 w-20">{item.asset}</span>
                    <span className="text-zinc-600">—</span>
                    <span className="text-zinc-400">{item.role}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-3 italic">La règle pro : surveille la cohérence entre ces 4 actifs pour valider ton biais.</p>
            </div>
            <div className="space-y-2 mb-5">
              {[
                "Tu n'entres jamais entre 20h00 et 20h30",
                "Tu ne trades pas la première bougie de breakout",
                "Tu ne trades pas en aveugle si tu n'as pas écouté Powell",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                  <span className="text-red-500 font-bold text-base shrink-0 mt-0.5">✗</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-white font-semibold leading-relaxed">
                Tu ne trades pas la news. Tu trades la réaction.
              </p>
            </div>
          </section>

          {/* Bloc 6 : Confluence avec analyse technique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Confluence avec analyse technique</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              FOMC + setup technique = setup premium.
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Exemple</p>
              <div className="space-y-1.5">
                {[
                  "Prix dans une zone Order Block H1",
                  "DXY casse une résistance Daily",
                  "Powell hawkish à 20h45",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <span className="text-zinc-600 shrink-0">—</span>
                    {item}
                  </div>
                ))}
                <div className="mt-3 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">→</span>
                  <p className="text-sm text-emerald-400 font-medium">Confluence triple, R/R réaliste 1:3 ou plus.</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              Avec un FOMC qui produit 300+ pips de mouvement directionnel, un setup confirmé peut viser un R/R 1:5, voire 1:10.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                Le même phénomène se produit simultanément sur XAU/USD, le Nasdaq et BTC/USD — les niveaux techniques sont balayés sur tous les actifs liés au dollar en même temps. C&apos;est ce qui rend le FOMC si dangereux : tu peux te faire stop out sur 4 actifs en même seconde.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sans confluence technique, tu trades juste la news. Avec, tu trades la news + la structure.
            </p>
          </section>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "Le FOMC décide des taux et de la politique monétaire américaine.",
              "Le discours de Powell est déterminant — c'est lui qui donne la vraie direction.",
              "20h00–21h00 = zone instable ; la vraie direction apparaît après 21h.",
              "La première impulsion est instable et sert souvent de piège à liquidité.",
              "Le FOMC impacte simultanément EUR/USD, XAU/USD, Nasdaq et BTC/USD — surveille la cohérence entre eux.",
            ]}
          />

          <LessonExercice
            description="Sur TradingView, analyse un FOMC récent."
            steps={[
              "Ouvre EUR/USD en M5.",
              "Trouve un FOMC récent via un calendrier économique (Investing.com, Forex Factory).",
              "Observe le mouvement à 20h00 — dans quelle direction ? Quelle amplitude ?",
              "Observe la réaction à 20h30 (début discours Powell) — y a-t-il eu inversion ?",
              "Identifie la direction confirmée après 21h00.",
              "Question : si tu avais été devant ton écran ce jour-là, à quelle heure exacte serais-tu entré ? Avec quelle confluence ? Note-le.",
            ]}
          />

          <LessonQuiz
            question="À 20h00, EUR/USD casse une résistance pendant un FOMC. Que fais-tu ?"
            options={[
              "Tu achètes immédiatement — c'est un breakout clair",
              "Tu attends la fin du discours et une clôture M5 confirmée après 21h00",
              "Tu vends directement en pariant sur un retournement",
              "Tu entres dans les deux sens avec deux ordres opposés",
            ]}
            correctIndex={1}
            explanation="La première impulsion d'un FOMC est instable et sert souvent à prendre la liquidité avant que Powell parle. Attendre une clôture confirmée après 21h00 évite ce piège et te permet d'entrer dans la vraie direction avec une confluence technique. Ce principe vaut pour tous les actifs touchés par le FOMC : le même piège se produit sur XAU/USD, le Nasdaq et BTC/USD en même temps."
            answerExplanations={[
              "Faux. Cette impulsion à 20h00 est très souvent un piège — le marché chasse la liquidité des stops avant de s'inverser à 20h30 quand Powell parle. Acheter immédiatement, c'est entrer dans la zone la plus instable du FOMC.",
              "Correct. La vraie direction se confirme après 21h00. En attendant une clôture M5 avec une confluence technique (OB, résistance cassée), tu évites le bruit et tu entres avec une probabilité bien supérieure.",
              "Trop agressif et sans logique. Il n'y a aucun signal de retournement confirmé à ce stade — tu ne sais pas si la résistance va tenir ou céder. Vendre aveuglément dans un breakout, c'est parier, pas trader.",
              "Faux. Entrer dans les deux sens est une erreur — tu paies le spread des deux côtés et tu n'as aucun biais directionnel. La méthode correcte est d'attendre la confirmation, pas de se couvrir en aveugle.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon1"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (NFP) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Retour au module
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                NFP — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
