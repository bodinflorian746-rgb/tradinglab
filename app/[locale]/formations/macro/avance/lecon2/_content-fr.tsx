"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { NFPReportAnatomyDiagram } from "@/app/components/charts/NFPReportAnatomyDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "FOMC",                          href: "/formations/macro/avance/lecon1", disabled: false },
  { id: "lecon2", title: "NFP",                           href: "/formations/macro/avance/lecon2", disabled: false },
  { id: "lecon3", title: "Les rendements obligataires US", href: "/formations/macro/avance/lecon3", disabled: false },
  { id: "lecon4", title: "Risk-on / Risk-off",            href: "/formations/macro/avance/lecon4", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-avance", "lecon2"));
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
          <span className="text-zinc-500">Leçon 2</span>
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
            NFP, la news mensuelle qui fait trembler tous les actifs
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Le NFP n&apos;est pas juste &apos;un chiffre emploi&apos;.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              C&apos;est un rapport complet qui peut changer en 30 secondes les attentes de taux, le DXY, l&apos;or, le Nasdaq et le Bitcoin.
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
              const isCurrent = lesson.id === "lecon2";
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
            <span className="ml-auto text-xs text-zinc-600">2 / 4 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Pourquoi le NFP est si violent */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi le NFP est si violent</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le <span className="font-semibold text-zinc-200">NFP</span> sort le <span className="font-semibold text-zinc-200">premier vendredi du mois à 14h30 heure de Paris</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Il mesure les créations d&apos;emplois aux États-Unis, hors secteur agricole.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pourquoi c&apos;est aussi important ?
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Parce que la Fed surveille <span className="font-semibold text-zinc-200">deux piliers</span> :
            </p>
            <ul className="space-y-1.5 mb-4">
              {["inflation", "emploi"].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si l&apos;emploi reste trop solide, la Fed peut rester restrictive.
              Si l&apos;emploi ralentit trop vite, le marché anticipe une Fed plus souple.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le NFP touche donc directement les <span className="font-semibold text-zinc-200">anticipations de taux</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Amplitudes typiques sur un gros écart</span> :
            </p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-5">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actif</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Mouvement possible en 30 secondes</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", move: "50 à 200 points" },
                  { asset: "XAU/USD", move: "20 à 80 points" },
                  { asset: "Nasdaq",  move: "30 à 200 points" },
                  { asset: "BTC/USD", move: "300 à 1500 points" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.move}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <NFPReportAnatomyDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le NFP ne bouge pas un marché. Il secoue toute la chaîne du risque.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 4 données du rapport NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 4 données du rapport NFP</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le retail regarde seulement le chiffre principal.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le pro lit le <span className="font-semibold text-zinc-200">rapport complet</span>.
            </p>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "1. Non-Farm Payrolls (NFP)",
                  body: "C'est le chiffre headline : créations d'emplois hors agriculture.",
                },
                {
                  bold: "2. Unemployment Rate",
                  body: "Le taux de chômage. Parfois plus important que le headline si le marché cherche un signal de ralentissement.",
                },
                {
                  bold: "3. Average Hourly Earnings (AHE)",
                  body: "Les salaires horaires moyens.",
                  extra: "Crucial, car des salaires trop élevés peuvent nourrir l'inflation future.",
                },
                {
                  bold: "4. Participation Rate",
                  body: "Le taux de participation. Il montre combien de personnes participent réellement au marché du travail.",
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">
                    {item.body}
                    {item.extra && <span> <span className="font-semibold text-zinc-200">{item.extra}</span></span>}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Exemple 1</span> :
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              NFP fort, mais chômage qui monte. → Headline positif, mais qualité du marché du travail plus fragile.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              <span className="font-semibold text-zinc-200">Exemple 2</span> :
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              NFP neutre, mais salaires trop forts. → Le marché peut devenir hawkish car la Fed voit un risque inflationniste.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le headline attire les yeux. Les sous-données donnent la vérité.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les révisions : le piège silencieux */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les révisions : le piège silencieux</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Chaque NFP peut <span className="font-semibold text-zinc-200">réviser les chiffres des mois précédents</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Et ces révisions changent parfois toute la lecture.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Cas concret</span> :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { pre: "NFP attendu : ", bold: "200k" },
                { pre: "NFP réel : ", bold: "250k" },
                { pre: "Surprise apparente : ", bold: "+50k" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item.pre}<span className="font-semibold text-zinc-200">{item.bold}</span></span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Lecture débutant : &apos;emploi fort, dollar haussier&apos;.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Mais si le mois précédent est <span className="font-semibold text-zinc-200">révisé de -80k</span>, l&apos;effet net change.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le marché ne voit plus seulement +50k. Il voit une <span className="font-semibold text-zinc-200">dynamique moins solide que prévu</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Résultat possible</span> :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "DXY hésite ou baisse",
                "EUR/USD inverse",
                "XAU/USD remonte",
                "Nasdaq récupère",
                "BTC/USD suit le sentiment risk-on",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un bon NFP peut devenir moyen si le passé est réécrit.
              </p>
            </div>
          </section>

          {/* Bloc 4 — La timeline pro du jour NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La timeline pro du jour NFP</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le NFP ne se trade pas comme une bougie normale. Tu lis une <span className="font-semibold text-zinc-200">séquence</span>.
            </p>
            <div className="space-y-2 mb-5">
              {[
                {
                  time: "13h00–14h25. Sécurisation",
                  body: "Tu fermes ou réduis les positions fragiles. Tu vérifies EUR/USD, DXY, XAU/USD, Nasdaq et BTC/USD.",
                },
                {
                  time: "14h25–14h30. Pré-positionnement",
                  body: "Les spreads peuvent s'élargir. Tu n'entres pas.",
                },
                {
                  time: "14h30–14h35. Lecture brute",
                  body: "La première impulsion peut être violente.",
                  bold: "Tu ne trades pas les premières minutes.",
                },
                {
                  time: "14h35–15h00. Analyse complète",
                  items: ["headline", "chômage", "salaires", "participation", "révisions"],
                  suffix: "Puis tu compares avec DXY, XAU/USD et Nasdaq.",
                },
                {
                  time: "15h00–15h30. Setup possible",
                  body: "Si la réaction est cohérente et confirmée, tu peux chercher une entrée avec confluence.",
                },
                {
                  time: "15h30+. Continuation ou digestion",
                  body: "Avec l'ouverture US, le marché confirme ou annule la première lecture.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.time}</span>
                    <br />
                    {"body" in item && item.body}
                    {"bold" in item && <> <span className="font-semibold text-zinc-200">{item.bold}</span></>}
                    {"items" in item && (
                      <>
                        <span className="text-zinc-300"> Tu regardes :</span>
                        {item.items!.map((sub, j) => (
                          <span key={j} className="block ml-2 text-zinc-400">– {sub}</span>
                        ))}
                        <span className="block mt-1">{item.suffix}</span>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded mb-4">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le retail trade à 14h30. Le pro trade à 15h00. Trente minutes qui changent le résultat.
              </p>
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Le retail trade le chiffre en 30 secondes. Le pro lit le rapport, attend la confirmation et laisse les autres payer le spread.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Les 3 setups pros sur NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 3 setups pros sur NFP</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Il existe trois façons de travailler un NFP.
            </p>
            <div className="space-y-4 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">1. Setup anticipation</p>
                <p className="text-sm text-zinc-300">
                  Basé sur les données précédentes : CPI, PPI, salaires, biais Fed. C&apos;est <span className="font-semibold text-zinc-200">risqué</span>. Réservé aux traders très expérimentés.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-2">2. Setup réaction confirmée <span className="text-zinc-500 font-normal">(le plus propre)</span></p>
                <p className="text-sm text-zinc-300 mb-2">Tu attends :</p>
                <ul className="space-y-1 mb-3">
                  {[
                    "rapport cohérent",
                    "DXY aligné",
                    "XAU/USD qui confirme l'inverse du dollar",
                    "Nasdaq et BTC/USD cohérents avec le risk-on / risk-off",
                    "niveau technique valide",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-zinc-400 italic">
                  NFP fort + salaires forts + DXY casse une résistance. EUR/USD casse un support. XAU/USD rejette une zone haute.<br />
                  → Setup short EUR/USD ou short XAU/USD plus propre.
                </p>
              </div>
              <div className="bg-zinc-800/30 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-zinc-200 mb-1">3. Setup continuation</p>
                <p className="text-sm text-zinc-300">
                  Après 15h30, si le marché continue dans la même direction avec volume, tu cherches une continuation sur retracement.
                </p>
              </div>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le NFP crée le choc. La confluence décide si tu trades.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Les pièges spécifiques au NFP */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les pièges spécifiques au NFP</h2>
            <div className="space-y-3 mb-5">
              {[
                {
                  bold: "Piège 1. La première impulsion",
                  body: "La première bougie part dans un sens, puis inverse. C'est souvent là que le retail se fait sortir.",
                },
                {
                  bold: "Piège 2. Trader seulement le headline",
                  body: "NFP supérieur aux attentes ne veut pas toujours dire dollar haussier. Les salaires, le chômage et les révisions peuvent contredire le chiffre.",
                },
                {
                  bold: "Piège 3. Ignorer les actifs corrélés",
                  body: "Si tu trades XAU/USD, regarde le DXY. Si tu trades BTC/USD, regarde le Nasdaq. Si tu trades EUR/USD, regarde aussi GBP/USD et USD/CHF.",
                },
                {
                  bold: "Piège 4. Stop trop serré",
                  body: "Après NFP, un stop classique peut sauter sans invalider la thèse. La volatilité est différente. Ton risque doit l'être aussi.",
                },
                {
                  bold: "Piège 5. Oublier la chaîne macro",
                  body: "Le NFP arrive après CPI et PPI, puis influence le prochain FOMC.",
                  chain: true,
                },
              ].map((item) => (
                <div key={item.bold} className="bg-zinc-800/30 rounded-xl px-4 py-3">
                  <p className="text-sm font-semibold text-zinc-200 mb-1">{item.bold}</p>
                  <p className="text-sm text-zinc-300">{item.body}</p>
                  {item.chain && (
                    <>
                      <p className="text-sm font-semibold text-zinc-200 mt-2 mb-1">Chaîne complète :</p>
                      <p className="text-sm text-zinc-400">PPI → CPI → NFP → FOMC</p>
                      <p className="text-sm text-zinc-300 mt-2">
                        Tu ne lis pas le NFP seul. <span className="font-semibold text-zinc-200">Tu le lis dans le narratif de la Fed.</span>
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le NFP seul te donne un chiffre. Le NFP dans la chaîne te donne une thèse.
              </p>
            </div>
          </section>

          {/* ET TOI, RETAIL ? */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 my-8">
            <p className="text-emerald-400 uppercase tracking-widest text-xs font-bold mb-4">ET TOI, RETAIL ?</p>
            <div className="text-zinc-300 leading-relaxed space-y-3">
              <p>
                Vendredi 14h25. Capital 1 500€. Le NFP tombe dans 5 minutes. Tu travailles depuis chez toi, ta matinée est terminée. Tu fermes tes positions fragiles sur EUR/USD et XAU/USD. Aucun intérêt de rester exposé pendant le choc. Tu ouvres tes quatre charts : EUR/USD, XAU/USD, Nasdaq et BTC/USD. Tu attends la réaction du marché, pas le chiffre seul.
              </p>
              <p>
                14h30 : le NFP sort à 220k contre 180k attendu. Chômage stable. Salaires à +0,3%. Première lecture : dollar fort. Mais les révisions du mois précédent tombent à -50k. La lecture devient plus nuancée. DXY monte quand même, EUR/USD baisse et XAU/USD plonge. Tu ne trades pas la première bougie. À 14h45, le marché commence à ralentir. Puis à 15h00, XAU/USD casse le support des 4 580$ avant de le re-tester depuis dessous. Réaction hawkish confirmée + cassure technique validée. Le setup est propre.
              </p>
              <p>
                Concrètement : entrée short XAU/USD à 4 575$, SL à 4 600$, TP à 4 525$. Tu risques 30€ (2% de 1 500€), tu peux gagner environ 60€. Tu coupes ton chart, tu prends ton vendredi soir. Tu vérifieras demain matin.
              </p>
            </div>
          </div>

          {/* ── Séparateur révision ── */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <LessonKeyPoints
            points={[
              "Le NFP est un rapport complet : headline, chômage, salaires, participation et révisions",
              "Les salaires et les révisions peuvent inverser la lecture du chiffre principal",
              "La vraie lecture se fait après les premières minutes, avec DXY, XAU/USD, Nasdaq et BTC/USD",
              "Le NFP doit être lu dans la chaîne PPI → CPI → NFP → FOMC",
            ]}
          />

          <LessonExercice
            description="Prends un ancien NFP et reconstruis la lecture complète."
            steps={[
              "Note le NFP attendu, le NFP réel et les révisions du mois précédent.",
              "Note le taux de chômage, les salaires horaires et le taux de participation.",
              "Observe DXY, EUR/USD, XAU/USD, Nasdaq et BTC/USD entre 14h30 et 15h30.",
              "Identifie si la première impulsion a tenu ou inversé.",
              "Note quel setup aurait été le plus propre : aucune entrée, réaction confirmée ou continuation post-15h30.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif :{" "}
            <span className="font-semibold text-zinc-400">arrêter de lire le NFP comme un chiffre unique</span>.
          </p>

          <LessonQuiz
            question="Le NFP sort à 250k contre 200k attendus. Mais le mois précédent est révisé de -80k et les salaires sortent sous les attentes. Quelle lecture est la plus professionnelle ?"
            options={[
              "Dollar haussier automatiquement, car le NFP est supérieur aux attentes",
              "Lecture mitigée : le headline est fort, mais les révisions et les salaires affaiblissent le signal",
              "XAU/USD doit forcément chuter",
              "BTC/USD ne peut pas être impacté par le NFP",
            ]}
            correctIndex={1}
            explanation="Le chiffre principal est positif, mais il ne suffit pas. Une révision négative du mois précédent (-80k) et des salaires faibles peuvent réduire ou inverser l'impact du headline. L'option A est trop simpliste (lecture débutant qui ignore le contexte). L'option C ignore le contexte complet (les sous-données peuvent contredire le headline). L'option D est fausse : BTC/USD réagit souvent au sentiment de risque et aux anticipations de taux, qui sont directement impactées par le NFP."
            answerExplanations={[
              "Faux. Lire uniquement le headline est une erreur classique. Une révision de -80k et des salaires faibles peuvent neutraliser ou inverser l'impact d'un NFP fort.",
              "Correct. Le chiffre principal est positif, mais les révisions négatives et les salaires faibles affaiblissent le signal. La lecture pro intègre toujours les sous-données.",
              "Faux. XAU/USD dépend du contexte global : si les révisions et les salaires affaiblissent le dollar, l'or peut remonter même avec un NFP headline fort.",
              "Faux. BTC/USD réagit souvent au sentiment de risque et aux anticipations de taux directeurs, deux variables directement influencées par le NFP.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-avance", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Rendements obligataires US) est maintenant disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/avance/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1. FOMC
              </Link>
              <Link
                href="/formations/macro/avance/lecon3"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Leçon 3. Rendements obligataires US
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
