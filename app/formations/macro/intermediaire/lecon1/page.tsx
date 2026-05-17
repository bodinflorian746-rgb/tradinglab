"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { HawkishDovishScale } from "@/app/components/charts/HawkishDovishScale";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Comprendre le calendrier économique",     href: null,                                     disabled: true  },
  { id: "lecon3", title: "CPI, PPI et inflation",                   href: null,                                     disabled: true  },
  { id: "lecon4", title: "Le carry trade",                          href: null,                                     disabled: true  },
  { id: "lecon5", title: "Les corrélations macro",                  href: null,                                     disabled: true  },
  { id: "lecon6", title: "Construire son biais hebdomadaire",       href: null,                                     disabled: true  },
];

export default function HawkishDovishLecon() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon1"));
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
          <Link href="/formations/macro/intermediaire" className="hover:text-zinc-400 transition-colors">Intermédiaire</Link>
          <span>/</span>
          <span className="text-zinc-500">Leçon 1</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermédiaire
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">18 min</span>
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
            Hawkish vs Dovish — comment lire le ton d&apos;une banque centrale
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Tu peux avoir raison sur les chiffres et perdre quand même. Parce que ce qui fait bouger le marché, ce n&apos;est pas la décision de la Fed — c&apos;est le ton avec lequel Powell la prononce.
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
            <span className="ml-auto text-xs text-zinc-600">1 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Hawkish, dovish : c&apos;est quoi ce vocabulaire d&apos;oiseaux ?</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Quand tu lis l&apos;actualité financière, tu tombes sans arrêt sur ces deux mots :
            </p>
            <ul className="space-y-2 mb-4 ml-1">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span><span className="text-white font-semibold">Hawkish</span> (faucon) = ton DUR. La banque centrale veut <span className="font-semibold text-zinc-200">resserrer</span> la politique monétaire : monter les taux, retirer des liquidités, lutter contre l&apos;inflation.</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <span><span className="text-white font-semibold">Dovish</span> (colombe) = ton SOUPLE. La banque centrale veut <span className="font-semibold text-zinc-200">stimuler</span> l&apos;économie : baisser les taux, injecter des liquidités, soutenir la croissance.</span>
              </li>
            </ul>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              Une analogie simple : <span className="text-white font-medium">le faucon serre les vis, la colombe ouvre les robinets.</span>
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Ces termes décrivent l&apos;<span className="font-semibold text-zinc-200">orientation</span> du discours d&apos;un banquier central, pas une décision en elle-même. Powell peut tenir un discours hawkish sans monter les taux. Lagarde peut paraître dovish sans les baisser. C&apos;est le ton qui compte, pas l&apos;action immédiate.
              </p>
            </div>
          </section>

          {/* Bloc 2 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi ça change tout pour ton trading</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le marché n&apos;attend pas les vraies décisions pour bouger. Il bouge sur les <span className="font-semibold text-zinc-200">anticipations</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Quand Powell dit <span className="italic text-zinc-300">&quot;we remain data-dependent and prepared to hold rates higher for longer if needed&quot;</span>, il n&apos;a rien décidé concrètement. Mais le marché entend &quot;Fed plus dure que prévu&quot; → le dollar grimpe immédiatement, l&apos;EUR/USD chute, l&apos;or baisse, les indices US corrigent.
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Le ton précède l&apos;action. Apprendre à lire le ton = anticiper le mouvement avant que les chiffres ne tombent.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              C&apos;est exactement pour ça que les meilleurs traders macro lisent les <span className="font-semibold text-zinc-300">discours</span> et les <span className="font-semibold text-zinc-300">minutes</span> (procès-verbaux des réunions de banques centrales) — pas seulement les chiffres.
            </p>
          </section>

          {/* Bloc 3 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment reconnaître un ton hawkish vs dovish</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Voici les <span className="font-semibold text-zinc-200">mots-signaux</span> que tu vas croiser dans les communiqués officiels (la plupart sont publiés en anglais — voici les traductions).
            </p>

            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Vocabulaire HAWKISH (ton dur, pro-resserrement)</p>
            <ul className="space-y-2 mb-6">
              {[
                { en: "inflation remains elevated", fr: "l'inflation reste élevée" },
                { en: "further tightening may be appropriate", fr: "un nouveau resserrement pourrait être approprié" },
                { en: "labor market remains tight", fr: "le marché du travail reste tendu" },
                { en: "premature easing would be a mistake", fr: "un assouplissement prématuré serait une erreur" },
                { en: "higher for longer", fr: "plus haut pour plus longtemps (les taux restent élevés)" },
                { en: "more work to do", fr: "il reste du travail à faire" },
                { en: "vigilant against persistent inflation", fr: "vigilants face à l'inflation persistante" },
              ].map((item) => (
                <li key={item.en} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0 mt-1.5" />
                  <span><em className="text-zinc-300">&quot;{item.en}&quot;</em> → {item.fr}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Vocabulaire DOVISH (ton souple, pro-stimulation)</p>
            <ul className="space-y-2 mb-5">
              {[
                { en: "inflation is moderating", fr: "l'inflation se modère" },
                { en: "risks are now balanced", fr: "les risques sont désormais équilibrés" },
                { en: "we can be patient", fr: "nous pouvons être patients" },
                { en: "appropriate to consider easing", fr: "il est approprié d'envisager un assouplissement" },
                { en: "growth is slowing", fr: "la croissance ralentit" },
                { en: "downside risks have increased", fr: "les risques baissiers ont augmenté" },
                { en: "policy is now restrictive enough", fr: "la politique est désormais suffisamment restrictive" },
              ].map((item) => (
                <li key={item.en} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0 mt-1.5" />
                  <span><em className="text-zinc-300">&quot;{item.en}&quot;</em> → {item.fr}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Tu n&apos;as pas besoin de tout retenir. <span className="font-semibold text-zinc-300">Repère juste l&apos;intention</span> : la banque centrale parle-t-elle de FREINER l&apos;économie (hawkish) ou de la SOUTENIR (dovish) ?
            </p>
          </section>

          {/* Bloc 4 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Impact concret sur les marchés</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Prenons un exemple chiffré pour fixer les idées.
            </p>

            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">Cas hawkish sur le dollar US — la Fed durcit le ton</p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-2">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actif</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Réaction typique</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", reaction: "Baisse — 100 à 300 pips sur la séance" },
                  { asset: "DXY", reaction: "Monte (mesure la force du dollar)" },
                  { asset: "XAU/USD", reaction: "Baisse (taux réels hauts pénalisent l'or)" },
                  { asset: "Nasdaq", reaction: "Baisse (taux hauts pénalisent la tech)" },
                  { asset: "BTC/USD", reaction: "Baisse (actif risqué fuit en environnement hawkish)" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.reaction}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic mb-5">Une seule décision hawkish déclenche TOUT ça en même temps.</p>

            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Cas dovish sur le dollar US — la Fed adoucit le ton</p>
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-2">
              <div className="grid grid-cols-2 border-b border-zinc-800">
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actif</div>
                <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Réaction typique</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { asset: "EUR/USD", reaction: "Monte (dollar plus faible)" },
                  { asset: "DXY", reaction: "Baisse" },
                  { asset: "XAU/USD", reaction: "Monte (or aime les taux bas)" },
                  { asset: "Nasdaq", reaction: "Monte (la tech aime les taux bas)" },
                  { asset: "BTC/USD", reaction: "Monte (risk-on, liquidité plus abondante)" },
                ].map((row) => (
                  <div key={row.asset} className="grid grid-cols-2">
                    <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                    <div className="px-4 py-2.5 text-sm text-zinc-400 border-l border-zinc-800/60">{row.reaction}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-500 italic mb-5">Le ton dovish est l&apos;un des moteurs les plus puissants des rallyes crypto et tech.</p>

            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <HawkishDovishScale />
            </div>

            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Logique à retenir : un dollar fort vient toujours d&apos;une Fed plus hawkish que les autres banques centrales. Un dollar faible, l&apos;inverse. La force d&apos;une devise, c&apos;est toujours <span className="font-semibold text-zinc-300">relatif</span> au ton de SA banque centrale comparé aux autres.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Erreur classique */}
          <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
            <p className="text-sm font-semibold text-white mb-3">Le piège du &apos;hawkish but less than expected&apos;</p>
            <p className="text-sm font-semibold text-zinc-300 mb-3">Tu trades sur le ton sans regarder les anticipations</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              C&apos;est LE piège qui ruine les traders débutants en macro.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              <span className="font-semibold text-zinc-200">Tu vois Powell monter les taux de 25bps et te dis</span> : &quot;C&apos;est hawkish, le dollar va monter, je shorte EUR/USD.&quot;
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
              Et là, l&apos;EUR/USD <span className="font-semibold text-zinc-200">monte</span> au lieu de baisser. Tu te fais sortir.
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Pourquoi ? Parce que le marché avait anticipé une hausse de <span className="font-semibold text-zinc-200">50bps</span>. Donc 25bps, c&apos;est <span className="font-semibold text-zinc-200">moins hawkish que prévu</span>. Et &quot;moins hawkish que prévu&quot; = <span className="font-semibold text-zinc-200">dovish surprise</span> pour le marché. Le dollar baisse parce que les attentes étaient trop optimistes.
            </p>
            <div className="bg-zinc-900/40 border border-red-500/15 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-400 italic leading-relaxed">
                Sur les news macro, le marché ne réagit pas à la décision elle-même, il réagit à l&apos;écart entre la décision et ce qui était anticipé.
              </p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Avant chaque réunion FOMC, regarde ce qui est <span className="font-semibold text-zinc-300">pricé</span> par le marché (FedWatch Tool de la CME donne ces probabilités). Si la Fed sort EXACTEMENT ce qui était attendu, peu de mouvement. Si elle sort plus dur ou plus souple, mouvement violent dans la direction de la surprise.
            </p>
          </section>

          {/* Bloc 6 */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment trader avec : ajuster ton biais hebdomadaire</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Tu ne traderas pas la news elle-même au moment où elle tombe (cf leçon FOMC pour la technique du timing exact). Mais tu vas utiliser le ton pour <span className="font-semibold text-zinc-200">ajuster ta thèse macro de la semaine</span>.
            </p>

            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Méthode simple en 3 étapes</p>
            <div className="space-y-3 mb-6">
              {[
                {
                  n: "1",
                  text: (
                    <><span className="font-semibold text-zinc-200">Après chaque réunion de banque centrale, identifie le ton</span> : hawkish, dovish, ou neutre. Lis le communiqué + 2-3 articles de Reuters/Bloomberg qui résument la conférence de presse.</>
                  ),
                },
                {
                  n: "2",
                  text: (
                    <><span className="font-semibold text-zinc-200">Compare au ton précédent</span> : la banque devient-elle plus hawkish ou plus dovish que la dernière fois ? C&apos;est l&apos;<span className="font-semibold text-zinc-200">inflexion</span> qui compte le plus, pas le ton absolu.</>
                  ),
                },
                {
                  n: "3",
                  text: (
                    <><span className="font-semibold text-zinc-200">Définis ton biais directionnel pour la semaine</span> sur la devise concernée. Exemple : &quot;BCE plus hawkish que prévu → biais long EUR pour les 5 jours qui viennent → je cherche des setups longs EUR/USD, EUR/GBP, EUR/JPY, et j&apos;évite les setups shorts EUR.&quot;</>
                  ),
                },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              {[
                "Lis le ton après chaque réunion",
                "Compare à la fois précédente",
                "Définis 1 biais par devise majeure",
                "Cherche tes setups dans le sens du biais",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-3">
                  <span className="text-emerald-500 font-bold text-base shrink-0 mt-0.5">✓</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                "Trader la news en direct sans expérience",
                "Ignorer les attentes du marché",
                "Garder un biais d'il y a 2 mois",
                "Confondre décision et ton",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3">
                  <span className="text-red-500 font-bold text-base shrink-0 mt-0.5">✗</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </div>
              ))}
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
              "Hawkish = faucon = ton dur (banque centrale veut freiner). Dovish = colombe = ton souple (banque centrale veut soutenir).",
              "Le ton précède l'action : apprendre à lire le ton, c'est anticiper le mouvement avant les vrais changements de taux.",
              "Le marché réagit à l'écart entre décision et anticipation, pas à la décision elle-même.",
              "Utilise le ton pour définir ton biais directionnel hebdomadaire sur chaque marché concerné : forex, or, indices, crypto.",
            ]}
          />

          <LessonExercice
            description="Choisis une réunion récente de la Fed, de la BCE ou de la BoE."
            steps={[
              "Va sur le site officiel de la banque centrale (federalreserve.gov, ecb.europa.eu, bankofengland.co.uk).",
              "Trouve le communiqué officiel (statement) de la dernière réunion.",
              "Lis-le en cherchant les mots-signaux hawkish ou dovish (cf bloc 3).",
              "Note ton verdict : hawkish, dovish, ou neutre. Justifie en 2 phrases.",
              "Compare avec un article Reuters ou Bloomberg qui analyse la même réunion : ton interprétation correspond-elle à celle des analystes ?",
              "Regarde le graphique de la paire principale (EUR/USD pour la BCE ou la Fed, GBP/USD pour la BoE) sur les 24h qui ont suivi : le mouvement correspond-il à ton verdict ?",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif n&apos;est pas d&apos;avoir raison du premier coup. C&apos;est de t&apos;entraîner à lire le ton comme un trader macro le fait chaque semaine.
          </p>

          <LessonQuiz
            question="La Fed monte ses taux de 25bps. Tu lis le communiqué et le ton est globalement hawkish. Pourtant, le dollar BAISSE après l'annonce. Quelle est l'explication la plus probable ?"
            options={[
              "Le marché ne suit pas toujours la logique fondamentale, c'est aléatoire",
              "Le marché avait anticipé une hausse plus importante (50bps) ou un ton encore plus dur — c'est une \"dovish surprise\"",
              "Le dollar baisse toujours sur les annonces de la Fed, peu importe le ton",
              "Powell a fait une erreur de communication",
            ]}
            correctIndex={1}
            explanation="Le marché ne réagit pas à la décision en absolu, mais à l'écart entre la décision et les anticipations. Si la Fed monte de 25bps alors que le marché pricait 50bps, cela revient à un signal 'moins hawkish que prévu' — donc dovish par contraste. Les options A et C sont fausses : le marché suit une logique précise, et le sens de réaction dépend toujours des attentes. L'option D détourne le sujet : Powell ne fait pas d'erreurs de communication, il calibre chaque mot. Cette logique d'anticipations vaut pour tous les actifs liés au dollar : EUR/USD, XAU/USD, Nasdaq et BTC/USD réagissent tous à l'écart entre attentes et réalité."
            answerExplanations={[
              "Faux. Le marché suit une logique très précise basée sur les anticipations. La réaction n'est pas aléatoire — elle mesure l'écart entre ce qui était attendu et ce qui a été annoncé.",
              "Correct. Le marché avait pricé 50bps. Une hausse de 25bps est donc 'moins hawkish que prévu' — c'est une dovish surprise. Le dollar baisse parce que les attentes n'ont pas été confirmées.",
              "Faux. Le dollar peut monter ou baisser sur une annonce Fed selon la direction de la surprise. Il n'y a pas de règle mécanique indépendante du ton et des anticipations.",
              "Faux. Powell calibre chaque mot avec précision. La réaction du marché reflète l'écart entre anticipations et réalité, pas une erreur de communication.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon1"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Comprendre le calendrier économique) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Retour au module
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Comprendre le calendrier économique — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
