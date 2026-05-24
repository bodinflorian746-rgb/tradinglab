"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CentralBanksHierarchy } from "@/app/components/charts/CentralBanksHierarchy";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "C'est quoi la macro",              href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Les 4 grandes banques centrales",  href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Les chiffres macro à surveiller",  href: null,                                disabled: true  },
  { id: "lecon4", title: "Comprendre l'inflation",           href: null,                                disabled: true  },
  { id: "lecon5", title: "Le rôle du dollar dans le monde",  href: null,                                disabled: true  },
  { id: "lecon6", title: "Macro et risk management",         href: null,                                disabled: true  },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon2"));
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
          <span className="text-zinc-500">Leçon 2</span>
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
            Les 4 grandes banques centrales, qui contrôle le marché
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Si Powell tousse, la planète trading attrape un rhume.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Et tu trades cette planète, que tu le saches ou non.
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
                    : "border-zinc-800 text-zinc-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-zinc-600"}`} />
                  {lesson.title}
                </span>
              );
              return <div key={lesson.id}>{pill}</div>;
            })}
            <span className="ml-auto text-xs text-zinc-600">2 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Les 4 banques que tu dois connaître */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 4 banques que tu dois connaître</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu n&apos;as pas besoin de connaître 50 institutions. En réalité, <span className="font-semibold text-zinc-200">4 banques centrales pilotent l&apos;essentiel du marché</span> :
            </p>
            <div className="space-y-2.5 mb-4">
              {[
                { label: "Fed", desc: "Réserve fédérale américaine", devise: "dollar (USD)" },
                { label: "BCE", desc: "Banque centrale européenne",  devise: "euro (EUR)"   },
                { label: "BoE", desc: "Bank of England",             devise: "livre (GBP)"  },
                { label: "BoJ", desc: "Banque du Japon",             devise: "yen (JPY)"    },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> ({item.desc}) → contrôle le <span className="font-semibold text-zinc-200">{item.devise}</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Ces 4 devises représentent la majorité des échanges sur le marché mondial.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Comprendre ces 4 banques, c&apos;est comprendre la majorité des mouvements du marché.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Pourquoi elles sont si importantes */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi elles sont si importantes</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Ces banques influencent <span className="font-semibold text-zinc-200">tous les marchés</span> :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Forex (EUR/USD, GBP/USD, USD/JPY…)",
                "Indices (NASDAQ, S&P500, CAC40…)",
                "Or (XAU/USD)",
                "Crypto (BTC, ETH)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Pourquoi ? Parce qu&apos;elles contrôlent <span className="font-semibold text-zinc-200">le coût de l&apos;argent</span>.
            </p>
            <div className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-4 mb-4">
              <div className="space-y-1.5">
                <p className="text-sm leading-relaxed text-emerald-400 font-medium">
                  Quand une banque centrale <span className="font-semibold">monte</span> ses taux → l&apos;argent devient plus cher → les marchés ralentissent.
                </p>
                <p className="text-sm leading-relaxed text-emerald-400 font-medium">
                  Quand elle <span className="font-semibold">baisse</span> ses taux → l&apos;argent circule plus → les marchés montent.
                </p>
              </div>
            </div>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">Exemple concret :</span> Quand la Fed durcit son ton (juste un discours, pas même une décision), l&apos;EUR/USD peut perdre <span className="font-semibold text-zinc-300">100 à 300 pips en 24h</span>. Sur 0.10 lot, ça fait <span className="font-semibold text-zinc-300">100 à 300$ de mouvement</span> à digérer en quelques heures.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Ce qu'elles font concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Ce qu&apos;elles font concrètement</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Une banque centrale ne trade pas elle-même. Elle <span className="font-semibold text-zinc-200">influence</span> le marché.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Elle agit principalement sur 3 leviers :
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", label: "Les taux d'intérêt",  text: "combien coûte l'argent emprunté" },
                { n: "2", label: "La liquidité",         text: "injecter ou retirer de l'argent du système" },
                { n: "3", label: "La communication",     text: "discours, décisions, projections futures" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    <span className="font-semibold text-zinc-200">{item.label}</span> → {item.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Le 3ème levier est le plus puissant à court terme. Un seul mot de Powell peut faire bouger les marchés mondiaux pendant 48h, <span className="font-semibold text-zinc-200">avant même qu&apos;une décision soit prise</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le marché ne suit pas les traders. Il suit les banques centrales.
              </p>
            </div>
          </section>

          {/* Bloc 4 — La Fed : le boss du jeu */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">La Fed : le boss du jeu</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Toutes les banques comptent. Mais une domine.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">La Fed.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">Pourquoi ?</p>
            <ul className="space-y-2 mb-5">
              {[
                { bold: "Le dollar US est la devise de réserve mondiale", rest: "" },
                { bold: "Le commerce international se fait en USD", rest: "" },
                { bold: "Les matières premières", rest: " (or, pétrole, blé) sont cotées en USD" },
                { bold: "Plus de 60% des réserves mondiales", rest: " des banques centrales sont en USD" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Quand la Fed bouge, <span className="font-semibold text-zinc-200">le monde entier réagit</span>. Les autres banques centrales ajustent souvent leur politique en réaction à la Fed, pas l&apos;inverse.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Analogie simple</span> : la Fed est le chef d&apos;orchestre. Les 3 autres jouent leur partition autour.
            </p>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CentralBanksHierarchy />
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Tu trades sûrement EUR/USD, GBP/USD ou XAU/USD ? Ces 3 paires sont <span className="font-semibold text-zinc-200">toutes contre le dollar</span>. Donc en pratique, <span className="font-semibold text-zinc-200">tu trades la Fed à 80% du temps</span>, même si tu crois trader &apos;juste l&apos;euro&apos; ou &apos;juste l&apos;or&apos;. Comprendre la Fed = comprendre 80% de tes trades.
              </p>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Si tu ignores la Fed, tu trades à l&apos;aveugle.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Le calendrier de leurs réunions */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Le calendrier de leurs réunions</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Ces 4 banques prennent leurs décisions de taux à des dates <span className="font-semibold text-zinc-200">connues à l&apos;avance</span> :
            </p>
            <ul className="space-y-2 mb-5">
              {[
                { label: "FOMC (Fed)", freq: "~8 réunions par an" },
                { label: "BCE",        freq: "~8 réunions par an" },
                { label: "BoE",        freq: "~8 réunions par an" },
                { label: "BoJ",        freq: "~8 réunions par an" },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                  <span><span className="font-semibold text-zinc-200">{item.label}</span> → {item.freq}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pourquoi c&apos;est important pour toi en tant que trader ?
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Parce que ces jours-là, le marché devient <span className="font-semibold text-zinc-200">beaucoup plus volatil</span>. Pas juste le jour J, mais aussi <span className="font-semibold text-zinc-200">les heures qui précèdent</span> (anticipation) et celles qui suivent (réaction).
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="text-white font-medium">À retenir :</span> Sur EUR/USD, une décision FOMC peut générer <span className="font-semibold text-zinc-300">200 à 500 pips de mouvement total</span> en quelques heures (cf leçon Macro Avancé sur le FOMC pour les détails).
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment suivre concrètement */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment suivre concrètement</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu n&apos;as pas besoin de devenir expert macro. Voici la routine simple :
            </p>
            <div className="space-y-3 mb-5">
              {[
                { n: "1", text: "Regarder le calendrier économique chaque semaine (Investing.com, Forex Factory)" },
                { n: "2", text: "Identifier les décisions des 4 banques centrales" },
                { n: "3", text: "Noter les heures importantes dans ton planning" },
                { n: "4", text: "Éviter de trader sans comprendre le contexte des 24-48h qui entourent ces dates" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Ces 4 banques bougent les marchés à des dates connues. Si tu trades à l&apos;aveugle ces jours-là, c&apos;est que tu n&apos;as pas regardé le calendrier.
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
              "4 banques centrales dominent le marché : Fed, BCE, BoE, BoJ",
              "Elles contrôlent les taux, la liquidité et la direction des marchés",
              "La Fed est la plus importante (USD = devise mondiale, 80% des paires majeures)",
              "Leurs décisions créent les plus gros mouvements, connaître le calendrier est indispensable",
            ]}
          />

          <LessonExercice
            description="Cette semaine, commence à suivre les banques centrales."
            steps={[
              "Va sur un calendrier économique (Investing.com ou Forex Factory).",
              "Trouve les prochaines réunions Fed, BCE, BoE ou BoJ dans le mois.",
              "Note les dates et heures dans ton agenda perso.",
              "Le jour J, observe le graphique de la paire concernée (EUR/USD pour BCE/Fed, GBP/USD pour BoE, USD/JPY pour BoJ) 30 min avant et 30 min après la décision.",
              "Note ce que tu observes : direction, amplitude en pips, volatilité.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : t&apos;habituer à <span className="font-semibold text-zinc-400">lier les mouvements brutaux</span> à leurs <span className="font-semibold text-zinc-400">causes macro</span>.
          </p>

          <LessonQuiz
            question="Tu trades GBP/USD pendant la semaine des décisions de taux. La BoE a annoncé son taux ce matin (8h00 GMT) et la Fed annonce le sien à 20h00. Quel événement va le plus probablement faire bouger ta paire dans la journée ?"
            options={[
              "La BoE, c'est la banque centrale du GBP, donc impact direct sur GBP/USD",
              "La Fed, le dollar US influence toutes les paires majeures, et son impact est généralement plus fort",
              "Aucun des deux, les deux décisions s'annulent",
              "La BoE le matin, mais la Fed reprendra le contrôle le soir",
            ]}
            correctIndex={1}
            explanation="Même sur une paire qui contient le GBP, la Fed reste le premier driver. Le dollar US influence toutes les paires majeures, et historiquement, les décisions de la Fed ont plus d'impact sur GBP/USD que les décisions de la BoE elle-même. C'est la confirmation que la Fed est 'le boss du jeu' même quand tu crois trader 'autre chose'. L'option D semble logique mais ne reflète pas la réalité, souvent l'effet Fed efface complètement l'effet BoE plus tard dans la journée."
            answerExplanations={[
              "Faux. La BoE a bien un impact sur GBP/USD, mais historiquement, la Fed génère des mouvements plus forts sur toutes les paires majeures. Le dollar US étant la devise de réserve mondiale, une décision Fed impacte l'ensemble du marché forex, y compris GBP/USD.",
              "Correct. La Fed est le premier driver même sur GBP/USD. Son annonce à 20h00 va dominer les mouvements de la journée. C'est la confirmation du principe : la Fed est 'le boss du jeu' même sur des paires qui semblent concerner d'autres devises.",
              "Faux. Les deux décisions ne s'annulent pas automatiquement. Elles peuvent se superposer, s'amplifier ou se contredire, mais dans la pratique, la Fed reste le driver dominant. L'effet 'annulation' est une simplification incorrecte.",
              "Partiellement logique, mais incomplet. L'effet BoE le matin existe, mais la réponse complète est que la Fed est globalement le driver dominant, pas seulement en reprise le soir. Historiquement, l'effet Fed efface souvent complètement l'effet BoE antérieur.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (Les chiffres macro à surveiller) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1. C&apos;est quoi la macro
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                Les chiffres macro à surveiller. Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
