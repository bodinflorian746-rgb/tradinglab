"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { InflationIndicatorsChainDiagram } from "@/app/components/charts/InflationIndicatorsChainDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Comprendre le calendrier économique",     href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI et inflation",                   href: "/formations/macro/intermediaire/lecon3", disabled: false },
  { id: "lecon4", title: "Le carry trade",                          href: null,                                     disabled: true  },
  { id: "lecon5", title: "Les corrélations macro",                  href: null,                                     disabled: true  },
  { id: "lecon6", title: "Construire son biais hebdomadaire",       href: null,                                     disabled: true  },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon3"));
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
          <span className="text-zinc-500">Leçon 3</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermédiaire
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
            CPI, PPI et inflation — décoder les chiffres qui font bouger le marché
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              14h30. Le CPI sort, le marché explose. Mais les pros n&apos;ont pas attendu le choc.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Le vrai signal était sorti 12 jours plus tôt — sur un chiffre que personne ne regarde : le PPI.
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
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">3 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — La chaîne d'inflation */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La chaîne d&apos;inflation — du producteur au consommateur</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              L&apos;inflation ne tombe pas du ciel. Elle suit une <span className="font-semibold text-zinc-200">chaîne logique</span> : du producteur vers le consommateur, avec des indicateurs à chaque étape.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le marché surveille <span className="font-semibold text-zinc-200">4 indicateurs clés</span>, dans cet ordre :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI", rest: " (Producer Price Index) — les prix à la sortie d'usine" },
                { bold: "CPI Headline", rest: " — l'inflation totale ressentie par le consommateur" },
                { bold: "Core CPI", rest: " — l'inflation hors énergie et alimentation" },
                { bold: "Core PCE", rest: " — l'indicateur officiel de la Fed" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <InflationIndicatorsChainDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le PPI prévient. Le CPI déclenche. Le Core confirme.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Le PPI, le signal précoce */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le PPI — le signal précoce que le marché ignore</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le PPI sort environ <span className="font-semibold text-zinc-200">12 jours avant le CPI</span>. C&apos;est le prix que les producteurs reçoivent pour leurs biens — avant que l&apos;inflation ne remonte vers le consommateur.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Pourquoi c&apos;est un signal précoce ?</span> Parce que les hausses de coût chez les producteurs finissent presque toujours par être répercutées en aval.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "PPI en hausse", rest: " → les producteurs répercutent → CPI monte dans les semaines suivantes" },
                { bold: "PPI stable ou en baisse", rest: " → pression inflationniste réduite → CPI risque de baisser" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemple concret</span> : si le PPI de janvier sort fortement au-dessus des attentes, les traders expérimentés commencent à repositionner leur exposition <span className="font-semibold text-zinc-200">avant même le CPI</span> de février.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le débutant réagit au CPI. Le trader intermédiaire <span className="font-semibold text-zinc-200">se prépare avec le PPI</span>.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Quand le PPI surprend fortement, les pros surveillent en parallèle :</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "DXY", rest: " (force du dollar) — anticipation de la réaction Fed" },
                  { bold: "XAU/USD", rest: " — souvent le 1er à réagir aux signaux inflationnistes" },
                  { bold: "Nasdaq", rest: " — sensible aux taux longs US (inflation = taux hauts = tech sous pression)" },
                  { bold: "BTC/USD", rest: " — tend à anticiper le risk-on/risk-off global" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">Les institutions ne se contentent pas d&apos;EUR/USD pour valider une hypothèse inflationniste.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Lire le PPI, c&apos;est voir l&apos;inflation avant qu&apos;elle arrive.
              </p>
            </div>
          </section>

          {/* Bloc 3 — CPI Headline vs Core CPI */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">CPI Headline vs Core CPI — pourquoi ça change tout</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Quand le CPI sort, tu vois deux chiffres. La plupart des débutants ne regardent que le premier.
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">CPI Headline</span> → l&apos;inflation totale, énergie et alimentation incluses. C&apos;est le chiffre médiatisé. Il est <span className="font-semibold text-zinc-200">volatil</span> — il monte et descend avec le prix du pétrole.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI</span> → l&apos;inflation hors énergie et alimentation. C&apos;est la <span className="font-semibold text-zinc-200">tendance de fond</span>. C&apos;est ce que les pros regardent vraiment.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemple type</span> :
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300">CPI Headline : <span className="font-semibold text-zinc-200">+2,1%</span> (conforme aux attentes)</p>
              <p className="text-sm text-zinc-300 mt-1">Core CPI : <span className="font-semibold text-zinc-200">+3,6%</span> (supérieur aux attentes de 3,2%)</p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              La réaction du marché ? <span className="font-semibold text-zinc-200">Hausse du dollar, baisse de l&apos;or, repli des indices</span>. Et pourtant le Headline était dans les clous.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              C&apos;est le <span className="font-semibold text-zinc-200">Core qui a tout déclenché</span>. Parce que c&apos;est lui qui envoie un signal sur la politique monétaire à venir.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le Headline fait le bruit. Le Core fait le mouvement.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Core PCE, l'indicateur officiel de la Fed */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Core PCE — l&apos;indicateur officiel de la Fed</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le Core PCE (Personal Consumption Expenditures) est l&apos;<span className="font-semibold text-zinc-200">indicateur d&apos;inflation officiellement préféré de la Fed</span>. Il sort environ 2 semaines après le CPI.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Pourquoi la Fed préfère le PCE ?</span>
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "Il couvre un panier plus large", rest: " que le CPI" },
                { bold: "Il ajuste automatiquement", rest: " les habitudes de consommation (si le bœuf augmente, les gens achètent du poulet — le PCE le capture)" },
                { bold: "Il lisse mieux", rest: " les variations temporaires" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Cible officielle de la Fed</span> : 2% de Core PCE annuel.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Quand le Core PCE dépasse cette cible, la Fed devient hawkish. Quand il se rapproche de 2%, elle peut commencer à parler de baisse de taux. <span className="font-semibold text-zinc-200">Tout part de là.</span>
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le Core PCE, c&apos;est le thermomètre que la Fed regarde avant de décider.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Réaction de marché en pratique */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Réaction de marché — ce qui se passe en pratique</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le scénario le plus fréquent le jour du CPI :
            </p>
            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI supérieur aux attentes</span> → dollar fort, or en baisse, crypto et indices sous pression.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Core CPI inférieur aux attentes</span> → dollar faible, or et indices en hausse, anticipation de baisse de taux.
              </p>
            </div>

            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Concrètement, sur un Core CPI qui surprend fortement à la hausse (ex : 3.5% vs 3.2% attendus) — 30 premières minutes :</p>
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <div className="grid grid-cols-2 border-b border-zinc-800">
                  <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actif</div>
                  <div className="px-4 py-2 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Réaction typique</div>
                </div>
                <div className="divide-y divide-zinc-800/60">
                  {[
                    { asset: "EUR/USD", reaction: "-100 à -150 pips" },
                    { asset: "XAU/USD", reaction: "-30 à -50$" },
                    { asset: "Nasdaq", reaction: "-1.5 à -2%" },
                    { asset: "BTC/USD", reaction: "-800 à -1500$" },
                  ].map((row) => (
                    <div key={row.asset} className="grid grid-cols-2">
                      <div className="px-4 py-2.5 text-sm font-semibold text-zinc-200">{row.asset}</div>
                      <div className="px-4 py-2.5 text-sm text-red-400 font-semibold border-l border-zinc-800/60">{row.reaction}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">L&apos;inflation Core surprend → la Fed peut rester hawkish plus longtemps → tous les actifs risqués corrigent simultanément.</p>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Mais attention au premier mouvement</span>. Souvent appelé le &apos;fakeout&apos; : le marché spike dans un sens, puis inverse quelques minutes après quand les algos et les traders institutionnels absorbent l&apos;ensemble du rapport.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Règle pratique</span> : attendre <span className="font-semibold text-zinc-200">2 à 5 minutes</span> après la publication pour voir la direction réelle se confirmer. Le premier tick n&apos;est souvent pas le vrai mouvement.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              La combinaison PPI + CPI + Core PCE dans la même direction est le signal le plus fort. Quand les 3 convergent, la Fed n&apos;a plus d&apos;excuse pour ne pas agir.
            </p>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Le retail entre au premier mouvement et se fait sortir au renversement. Le pro attend la confirmation et entre sur le vrai momentum. La différence entre les deux ? <span className="font-semibold text-zinc-200">2 à 5 minutes de patience</span>.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment lire ces chiffres comme un trader */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment lire ces chiffres comme un trader</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Le jour du CPI, ton processus doit être structuré. Pas de décision à l&apos;instinct.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Check-list pré-publication</span> :
            </p>
            <div className="space-y-2 mb-5">
              {[
                { n: "1", bold: "PPI de la semaine précédente :", rest: " haussier ou baissier ?" },
                { n: "2", bold: "Consensus Core CPI :", rest: " à quel niveau ?" },
                { n: "3", bold: "Précédent Core CPI :", rest: " tendance haussière ou baissière ?" },
                { n: "4", bold: "Contexte Fed :", rest: " cycle de hausse, pause ou baisse en cours ?" },
                { n: "5", bold: "Ton plan A et plan B :", rest: " prêts avant 14h30" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si le scénario se confirme après 2-5 minutes : tu entres avec ta taille habituelle.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si la réaction est floue ou contradictoire : <span className="font-semibold text-zinc-200">tu ne trades pas</span>. Ce n&apos;est pas une occasion ratée — c&apos;est du capital préservé.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un chiffre d&apos;inflation bien préparé, c&apos;est une opportunité. Mal préparé, c&apos;est un piège.
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
              "La chaîne inflation suit un ordre : PPI → CPI Headline → Core CPI → Core PCE",
              "Le PPI sort 12 jours avant le CPI — c'est le signal précoce que le marché sous-estime",
              "Le Core CPI (hors énergie et alimentation) est ce que les pros regardent vraiment",
              "Le Core PCE est l'indicateur officiel de la Fed, avec une cible à 2% annuel",
              "Attendre 2-5 minutes après la publication pour éviter le fakeout du premier tick",
            ]}
          />

          <LessonExercice
            description="Prépare une publication CPI comme un trader intermédiaire."
            steps={[
              "Trouve la date du prochain CPI US sur ton calendrier économique.",
              "Note le consensus Core CPI et le chiffre précédent.",
              "Vérifie le PPI publié les semaines précédentes — était-il haussier ou baissier ?",
              "Écris ton plan A (Core CPI > attentes) et ton plan B (Core CPI < attentes) avec les marchés concernés.",
              "Le jour J, attends 2-5 minutes après 14h30 avant toute décision.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : <span className="font-semibold text-zinc-400">ne plus subir le CPI. L&apos;anticiper avec le PPI et le trader avec un plan</span>.
          </p>

          <LessonQuiz
            question="Le PPI vient de sortir fortement au-dessus des attentes. Le CPI n'est pas encore publié. Qu'est-ce que cette information indique le plus probablement ?"
            options={[
              "Rien — le PPI et le CPI sont des indicateurs indépendants sans lien direct",
              "Une pression inflationniste en amont qui risque de se retrouver dans le prochain CPI",
              "Le dollar va forcément baisser dans les prochains jours",
              "La Fed va immédiatement annoncer une hausse de taux",
            ]}
            correctIndex={1}
            explanation="Le PPI mesure les prix à la sortie usine. Quand il dépasse les attentes, les coûts de production plus élevés sont généralement répercutés sur les consommateurs dans les semaines suivantes — ce qui tend à faire monter le CPI. C'est la logique de la chaîne inflation. L'option A est fausse : il existe un lien documenté entre PPI et CPI. L'option C est trop directe et trop certaine — la réaction du dollar dépend du contexte global. L'option D est fausse : la Fed attend plusieurs publications avant d'agir, elle ne réagit pas à un seul chiffre PPI isolé. Un PPI surprenant à la hausse n'impacte pas seulement EUR/USD — XAU/USD, Nasdaq et BTC/USD anticipent souvent la même réévaluation hawkish avant même la publication du CPI."
            answerExplanations={[
              "Faux. PPI et CPI sont liés par la chaîne de transmission de l'inflation. Les hausses de coût des producteurs remontent vers les consommateurs dans les semaines suivantes.",
              "Correct. Un PPI élevé signale une pression inflationniste en amont. Ces coûts supplémentaires finissent généralement par être répercutés, ce qui peut faire monter le prochain CPI.",
              "Faux. La réaction du dollar dépend du contexte global, des attentes de la Fed, et d'autres facteurs. Un PPI élevé seul ne garantit pas une baisse immédiate du dollar.",
              "Faux. La Fed observe plusieurs publications sur la durée avant de modifier sa politique. Un seul chiffre PPI ne déclenche pas une annonce de hausse de taux.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon3"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Le carry trade) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon2"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 2 — Comprendre le calendrier économique
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Le carry trade — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
