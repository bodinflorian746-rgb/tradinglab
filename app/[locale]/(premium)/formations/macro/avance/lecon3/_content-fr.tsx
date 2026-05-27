"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { US10YHubDiagram } from "@/app/components/charts/US10YHubDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                        href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                         href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "Les rendements obligataires US", href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",          href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon3"));
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
          <span className="text-zinc-500">Leçon 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Avancé
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">16 min</span>
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
            Les rendements obligataires US, le marché qui dirige tous les autres
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le retail regarde l&apos;or, le Nasdaq ou le Bitcoin.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Les pros regardent d&apos;abord les rendements US.
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
              const isCurrent = lesson.id === "lecon3";
              const pill = (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  isCurrent
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : lesson.disabled
                    ? "border-zinc-800/50 text-zinc-700"
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : lesson.disabled ? "bg-zinc-700" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">3 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — C'est quoi un rendement obligataire */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">C&apos;est quoi un rendement obligataire</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un rendement obligataire, c&apos;est le taux qu&apos;un gouvernement paie pour emprunter.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Aux États-Unis, ces obligations s&apos;appellent les <span className="font-semibold text-zinc-200">US Treasuries</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Les trois maturités principales :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "US2Y", suf: " : rendement à 2 ans" },
                { bold: "US10Y", suf: " : rendement à 10 ans" },
                { bold: "US30Y", suf: " : rendement à 30 ans" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.suf}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le plus important pour les marchés : <span className="font-semibold text-zinc-200">US10Y</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Pourquoi ?</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Parce que le 10 ans US sert de référence mondiale. C&apos;est le <span className="font-semibold text-zinc-200">&apos;taux sans risque&apos;</span> que les institutions utilisent pour comparer tous les autres actifs.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si le taux sans risque devient attractif, les actifs risqués doivent se justifier.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Prix et rendement : le piège de base */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Prix et rendement : le piège de base</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une obligation fonctionne à <span className="font-semibold text-zinc-200">l&apos;inverse</span> de ce que beaucoup imaginent.
            </p>
            <div className="space-y-1.5 mb-4">
              {[
                { pre: "Quand le prix de l'obligation ", bold: "monte", mid: ", son rendement ", bold2: "baisse", suf: "." },
                { pre: "Quand le prix de l'obligation ", bold: "baisse", mid: ", son rendement ", bold2: "monte", suf: "." },
              ].map((item, i) => (
                <p key={i} className="text-zinc-300 leading-relaxed text-sm">
                  {item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span>{item.mid}<span className="font-semibold text-zinc-200">{item.bold2}</span>{item.suf}
                </p>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              C&apos;est crucial.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              Si les investisseurs vendent les obligations US :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "le prix des obligations baisse",
                "les rendements montent",
                "le marché devient plus tendu",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Et quand les rendements montent, les actifs comme <span className="font-semibold text-zinc-200">XAU/USD, Nasdaq et BTC/USD peuvent souffrir</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Quand les yields montent, le marché respire moins bien.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les 3 rendements à surveiller */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 3 rendements à surveiller</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu n&apos;as pas besoin de regarder toute la courbe chaque matin. Concentre-toi sur <span className="font-semibold text-zinc-200">trois chiffres</span>.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "US2Y",
                  body: "Il reflète les attentes de taux Fed à court terme. Il bouge fort sur CPI, NFP et FOMC.",
                },
                {
                  bold: "US10Y",
                  body: "C'est le benchmark mondial. Il impacte directement XAU/USD, Nasdaq, BTC/USD et DXY.",
                  highlight: true,
                },
                {
                  bold: "US30Y",
                  body: "Il reflète les anticipations très longues : inflation future, dette, croissance à long terme.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">En pratique</span> :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "US2Y = attentes Fed court terme",
                "US10Y = sentiment macro global",
                "US30Y = vision long terme",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le 2 ans écoute la Fed. Le 10 ans écoute l&apos;économie.
              </p>
            </div>
          </section>

          {/* Bloc 4 — US10Y vs XAU/USD, Nasdaq et BTC/USD */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">US10Y vs XAU/USD, Nasdaq et BTC/USD</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le <span className="font-semibold text-zinc-200">US10Y</span> est l&apos;un des graphiques les plus importants pour trader plusieurs actifs.
            </p>
            <div className="space-y-4 mb-5">
              {[
                {
                  bold: "US10Y vs XAU/USD",
                  intro: "L'or ne paie pas de rendement. Donc quand le rendement du 10 ans US monte, l'or devient",
                  boldMid: "moins attractif",
                  items: ["US10Y passe de 4.0% à 4.5%", "XAU/USD peut perdre 50 à 100$", "surtout si le DXY monte aussi"],
                },
                {
                  bold: "US10Y vs Nasdaq",
                  intro: "Les valeurs tech sont",
                  boldMid: "très sensibles aux taux",
                  body: "Pourquoi ? Parce que leurs valorisations dépendent fortement des profits futurs. Quand les taux montent, ces profits futurs valent moins aujourd'hui.",
                  items: ["US10Y +50 points de base", "Nasdaq peut corriger de 2% à 3%"],
                },
                {
                  bold: "US10Y vs BTC/USD",
                  intro: "BTC/USD est souvent traité comme un",
                  boldMid: "actif risqué",
                  body: "Quand les rendements montent, le marché préfère parfois le rendement sûr plutôt que le risque crypto.",
                  items: ["US10Y casse 4.5%", "BTC/USD peut perdre son momentum", "surtout si Nasdaq baisse en même temps"],
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-2">{item.bold}</p>
                  <p className="text-sm text-zinc-300 mb-2">
                    {item.intro} <span className="font-semibold text-zinc-200">{item.boldMid}</span>.
                  </p>
                  {item.body && (
                    <p className="text-sm text-zinc-300 mb-2">{item.body}</p>
                  )}
                  <p className="text-sm font-semibold text-zinc-400 mb-1">Exemple :</p>
                  <ul className="space-y-1">
                    {item.items.map((sub, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-zinc-300">
                        <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <US10YHubDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                L&apos;or, la tech et le Bitcoin réagissent souvent au même chiffre. Et ce chiffre, c&apos;est US10Y.
              </p>
            </div>
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Le retail regarde XAU/USD. Le pro regarde ce qui pousse XAU/USD avant que la bougie parte.
              </p>
            </div>
          </section>

          {/* Bloc 5 — La courbe des taux */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La courbe des taux</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La <span className="font-semibold text-zinc-200">courbe des taux</span> compare les rendements selon les maturités.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              La plus suivie : <span className="font-semibold text-zinc-200">US10Y - US2Y</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Trois situations :
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Courbe normale",
                  body: "US10Y > US2Y. Exemple : 10Y à 4.5%, 2Y à 4.0%.",
                  result: "Le marché voit une économie relativement saine.",
                },
                {
                  bold: "Courbe plate",
                  body: "US10Y ≈ US2Y.",
                  result: "Le marché hésite.",
                },
                {
                  bold: "Courbe inversée",
                  body: "US10Y < US2Y. Exemple : 10Y à 4.0%, 2Y à 4.5%.",
                  result: "Le marché anticipe un ralentissement ou une récession future.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                  <p className="text-sm text-zinc-400 italic mt-1">→ {item.result}</p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Depuis 1955, chaque inversion durable de la courbe a été suivie d&apos;une récession aux États-Unis dans les 6 à 24 mois.</span>
              {" "}Ce n&apos;est pas un timing parfait. Mais c&apos;est un <span className="font-semibold text-zinc-200">signal macro majeur</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le 10Y te montre la pression du jour. La courbe te montre le risque du cycle.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment l'intégrer dans ta routine */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment l&apos;intégrer dans ta routine</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Avant l&apos;ouverture US, ajoute les rendements à ton check.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Routine simple</span> :
            </p>
            <div className="space-y-2 mb-5">
              {[
                { step: "1.", bold: "Regarde US10Y", suf: " : est-il en hausse ou en baisse ?" },
                { step: "2.", bold: "Note le niveau clé", suf: " : 4%, 4.5% et 5% sont des seuils psychologiques." },
                { step: "3.", bold: "Compare avec ton actif", suf: " : si tu veux long XAU/USD mais US10Y monte fort, il y a conflit." },
                { step: "4.", bold: "Regarde DXY", suf: " : US10Y en hausse + DXY en hausse = pression forte sur l'or et les actifs risqués." },
                { step: "5.", bold: "Vérifie Nasdaq et BTC/USD", suf: " : si les deux faiblissent pendant que US10Y monte, le marché réduit le risque." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.step} {item.bold}</span>{item.suf}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Pièges à éviter</span> :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "confondre prix obligataire et rendement",
                "croire que la corrélation est automatique",
                "ignorer les seuils psychologiques",
                "oublier les taux réels",
                "regarder US10Y sans regarder US2Y",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le <span className="font-semibold text-zinc-200">taux réel</span> compte beaucoup pour l&apos;or :
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm font-semibold text-zinc-200 text-center">
                taux réel = rendement nominal - inflation
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si le rendement monte mais que l&apos;inflation monte aussi, l&apos;impact peut être différent.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                US10Y → DXY → XAU/USD, Nasdaq, BTC/USD. C&apos;est souvent la chaîne invisible du marché.
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
              "US10Y est le benchmark mondial que les pros surveillent chaque jour",
              "Quand les rendements montent, XAU/USD, Nasdaq et BTC/USD peuvent être sous pression",
              "La courbe US10Y - US2Y donne un signal clé sur le cycle économique",
              "Les rendements doivent être lus avec DXY, inflation et contexte macro",
            ]}
          />

          <LessonExercice
            description="Ajoute les rendements US à ta routine pré-marché."
            steps={[
              "Ouvre US10Y et note sa direction du jour.",
              "Note s'il est proche d'un seuil clé : 4%, 4.5% ou 5%.",
              "Compare avec XAU/USD : l'or confirme-t-il le mouvement ?",
              "Compare avec Nasdaq et BTC/USD : les actifs risqués réagissent-ils ?",
              "Regarde US2Y et vérifie si la courbe 10Y - 2Y est normale, plate ou inversée.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : comprendre si ton trade{" "}
            <span className="font-semibold text-zinc-400">suit ou combat le marché obligataire</span>.
          </p>

          <LessonQuiz
            question="US10Y monte fortement, DXY monte aussi, et XAU/USD casse un support. Quelle lecture est la plus professionnelle ?"
            options={[
              "L'or baisse sans raison, il faut forcément acheter le dip",
              "Les rendements et le dollar confirment une pression macro sur XAU/USD",
              "US10Y ne concerne que les obligations, pas l'or",
              "Le Nasdaq devrait forcément monter quand les taux montent",
            ]}
            correctIndex={1}
            explanation="Quand US10Y monte, le rendement sans risque devient plus attractif. Si DXY monte en même temps, la pression sur XAU/USD est renforcée. L'option A ignore le contexte macro (acheter un dip sans analyser les rendements et le dollar = lecture débutant). L'option C est fausse : US10Y influence directement l'or, les indices et la crypto. L'option D est généralement inversée : des taux plus hauts pèsent souvent sur le Nasdaq car ils réduisent la valorisation des profits futurs des entreprises tech."
            answerExplanations={[
              "Faux. L'or baisse pour une raison précise : le rendement sans risque monte (US10Y) et le dollar se renforce (DXY). Ignorer ce contexte et acheter le dip est une lecture débutant.",
              "Correct. US10Y en hausse rend le taux sans risque plus attractif. DXY en hausse renforce la pression sur XAU/USD. Les deux éléments confirment la pression macro baissière sur l'or.",
              "Faux. US10Y influence directement l'or, les indices et la crypto via les taux réels, le DXY et le sentiment de risque global.",
              "Faux. Des taux plus hauts pèsent généralement sur le Nasdaq car ils réduisent la valorisation des profits futurs des entreprises tech. La relation est inverse.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Risk-on / Risk-off) est maintenant disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2. NFP
              </Link>
              <Link
                href="/formations/macro/avance/lecon4"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Leçon 4. Risk-on / Risk-off
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
