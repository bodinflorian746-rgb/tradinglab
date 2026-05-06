"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { CalendarReadingComparisonDiagram } from "@/app/components/charts/CalendarReadingComparisonDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "Hawkish vs Dovish",                      href: "/formations/macro/intermediaire/lecon1", disabled: false },
  { id: "lecon2", title: "Comprendre le calendrier économique",     href: "/formations/macro/intermediaire/lecon2", disabled: false },
  { id: "lecon3", title: "CPI, PPI et inflation",                   href: null,                                     disabled: true  },
  { id: "lecon4", title: "Le carry trade",                          href: null,                                     disabled: true  },
  { id: "lecon5", title: "Les corrélations macro",                  href: null,                                     disabled: true  },
  { id: "lecon6", title: "Construire son biais hebdomadaire",       href: null,                                     disabled: true  },
];

export default function CalendrierEconomiqueLecon() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-intermediaire", "lecon2"));
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
          <span className="text-zinc-500">Leçon 2</span>
        </nav>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
              Intermédiaire
            </span>
            <span className="text-zinc-700 text-xs">·</span>
            <span className="text-xs text-zinc-600">14 min</span>
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
            Comprendre le calendrier économique — comment lire le marché à l&apos;avance
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Vendredi 14h30. NFP sort à 205k vs 200k attendus. Mouvement nul.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Trois minutes plus tard, EUR/USD perd 60 pips. Tu n&apos;as pas vu venir. Le marché, lui, a vu la révision.
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
        <div className="space-y-5">

          {/* Bloc 1 — Ce que tu rates en lecture débutant */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Ce que tu rates en lecture débutant</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Lire un calendrier économique, ce n&apos;est pas juste repérer les news 3 étoiles. <span className="font-semibold text-zinc-200">Ça, c&apos;est le niveau minimum.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Un trader intermédiaire regarde le contexte :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "le consensus",
                "le chiffre précédent",
                "le chiffre réel",
                "les révisions",
                "la semaine macro complète",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span className="font-semibold text-zinc-200">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              <span className="font-semibold text-zinc-200">Analogie simple</span> : le calendrier économique, c&apos;est un <span className="font-semibold text-zinc-200">GPS</span>. Le débutant regarde seulement la destination. Le trader préparé regarde aussi les virages, les bouchons et les zones dangereuses.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le calendrier ne te donne pas une alerte. Il te donne une carte du risque.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 4 colonnes à lire à chaque news */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 4 colonnes à lire à chaque news</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Chaque publication importante doit être lue avec <span className="font-semibold text-zinc-200">4 données</span>.
            </p>

            <div className="space-y-2 mb-4">
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Consensus</span> → ce que le marché attend.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Précédent</span> → le chiffre publié le mois dernier.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Réel</span> → le chiffre qui sort au moment de l&apos;annonce.
              </p>
              <p className="text-zinc-300 leading-relaxed text-sm">
                <span className="font-semibold text-zinc-200">Révisions</span> → <span className="font-semibold text-zinc-200">le piège oublié.</span> Le chiffre du mois précédent peut être corrigé à la hausse ou à la baisse.
              </p>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemple concret</span> :
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>NFP attendu : <span className="font-semibold text-zinc-200">200k</span></span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>NFP réel : <span className="font-semibold text-zinc-200">205k</span></span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Lecture débutant : &apos;rien de spécial&apos;</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span><span className="font-semibold text-zinc-200">Mais le mois précédent est révisé de 250k à 170k</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Résultat : le marché peut réagir fort, <span className="font-semibold text-zinc-200">même si le chiffre du jour semble neutre</span>. C&apos;est exactement ce qui s&apos;est passé sur le hero de cette leçon.
            </p>

            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Sur cette révision NFP (250k → 170k), tous ces actifs ont bougé simultanément :</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", detail: "-60 pips", note: "dollar réévalué à la hausse" },
                  { asset: "XAU/USD", detail: "-20 à -25$", note: "or pénalisé par le dollar fort" },
                  { asset: "Nasdaq", detail: "-0.8 à -1%", note: "marché du travail solide = taux élevés maintenus" },
                  { asset: "BTC/USD", detail: "-300 à -500$", note: "risk-off sur actifs spéculatifs" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300 w-20">{item.asset}</span>
                    <span className="text-red-400 font-semibold w-20">{item.detail}</span>
                    <span className="text-zinc-500 italic">{item.note}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">Une seule révision NFP. Quatre marchés touchés en même temps.</p>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <CalendarReadingComparisonDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le chiffre du jour ne raconte pas toute l&apos;histoire.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Paramétrer ton calendrier comme un trader */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Paramétrer ton calendrier comme un trader</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu dois arrêter de regarder tout le calendrier en vrac.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Paramétrage simple et professionnel</span> :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "Filtre les devises", rest: " que tu trades" },
                { bold: "Garde toujours l'USD activé", rest: "" },
                { bold: "Affiche la vue semaine", rest: " (pas juste la journée)" },
                { bold: "Garde les événements 3 étoiles", rest: " par défaut" },
                { bold: "Surveille certains 2 étoiles", rest: " en contexte fort" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Pourquoi l&apos;USD reste toujours important ?</span> Parce que même si tu trades EUR/USD, XAU/USD, BTC/USD ou NASDAQ, le dollar influence tout (cf leçon Débutant Macro 5).
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              La <span className="font-semibold text-zinc-200">vue semaine</span> est essentielle. Elle te permet de voir les zones de risque <span className="font-semibold text-zinc-200">avant qu&apos;elles arrivent</span>, pas pendant.
            </p>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                Le trader amateur découvre la news à 14h30. Le trader préparé la voit venir <span className="font-semibold text-zinc-200">depuis dimanche soir</span>. La différence ? 5 minutes de prep par semaine.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Les clusters de news */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les clusters de news</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Certaines semaines sont dangereuses parce que <span className="font-semibold text-zinc-200">plusieurs grosses annonces tombent presque ensemble</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemple type de cluster</span> :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "Mercredi", rest: " : FOMC" },
                { bold: "Jeudi", rest: " : CPI" },
                { bold: "Vendredi", rest: " : NFP" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Dans ce genre de semaine, le marché peut devenir <span className="font-semibold text-zinc-200">nerveux avant même les annonces</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Pourquoi ?</span> Parce que les institutions réduisent leur exposition, ajustent leurs positions, et attendent les chiffres. Tu vois souvent des <span className="font-semibold text-zinc-200">mouvements pré-news</span> dès le mardi matin sur ces semaines.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              À l&apos;inverse, une semaine <span className="font-semibold text-zinc-200">calme macro</span> laisse plus de place à l&apos;analyse technique pure — c&apos;est le bon moment pour appliquer tes setups habituels sans surprise externe.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Sur une semaine FOMC + CPI + NFP, ces actifs sont tous impactés :</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "EUR/USD, GBP/USD", rest: " : volatilité maximale sur les 3 jours" },
                  { bold: "XAU/USD", rest: " : très nerveux (sensible aux taux et au dollar)" },
                  { bold: "Nasdaq, S&P500", rest: " : gaps possibles à l'ouverture NY" },
                  { bold: "BTC/USD", rest: " : amplification du risk-off ou risk-on général" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">Un cluster ne touche pas qu&apos;une devise. Il touche tout le marché en même temps.</p>
            </div>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Une seule news bouge le marché. Un cluster change toute la semaine.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Les chiffres secondaires qui peuvent surprendre */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les chiffres secondaires qui peuvent surprendre</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Un chiffre 2 étoiles n&apos;est <span className="font-semibold text-zinc-200">pas toujours faible</span>. Il devient important quand il sort <span className="font-semibold text-zinc-200">très loin du consensus</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemple</span> :
            </p>
            <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-sm text-zinc-300">ISM Manufacturing attendu : <span className="font-semibold text-zinc-200">50</span></p>
              <p className="text-sm text-zinc-300 mt-1">Résultat : <span className="font-semibold text-zinc-200">45</span></p>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Interprétation pro :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "Sous 50 =", rest: " contraction économique" },
                { bold: "Écart fort", rest: " avec les attentes" },
                { bold: "Signal de ralentissement", rest: " économique" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Résultat possible :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                "Indices sous pression (Nasdaq, S&P500)",
                "Dollar volatile",
                "Marché qui réévalue le risque de récession",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Le niveau d&apos;impact dépend du <span className="font-semibold text-zinc-200">contexte global</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Un chiffre moyen dans une semaine calme peut faire peu de bruit. Le <span className="font-semibold text-zinc-200">même chiffre dans une semaine tendue</span> (cluster de news, contexte macro fragile) peut déclencher un vrai mouvement.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Un chiffre n&apos;a pas d&apos;importance absolue. Il a une importance contextuelle.
              </p>
            </div>
          </section>

          {/* Bloc 6 — Construire ta feuille de route hebdomadaire */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Construire ta feuille de route hebdomadaire</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Chaque <span className="font-semibold text-zinc-200">dimanche soir</span> ou <span className="font-semibold text-zinc-200">lundi matin</span>, tu prépares ta semaine macro.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Méthode simple</span> :
            </p>
            <div className="space-y-2 mb-5">
              {[
                { n: "1", text: "Liste les 3 à 5 grosses annonces de la semaine" },
                { n: "2", text: "Note les jours et heures exactes" },
                { n: "3", text: "Identifie les devises concernées" },
                { n: "4", bold: "Classe les jours :", rest: " agressif, neutre, défensif" },
                { n: "5", text: "Ajuste tes setups en fonction" },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 mt-0.5">{item.n}.</span>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {"bold" in item ? (
                      <><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</>
                    ) : item.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              <span className="font-semibold text-zinc-200">Exemple concret</span> :
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si jeudi CPI US et vendredi NFP :
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                { bold: "Lundi/mardi", rest: " : trading plus normal (semaine commence calme)" },
                { bold: "Mercredi", rest: " : prudence avant chiffres (anticipation du marché)" },
                { bold: "Jeudi/vendredi", rest: " : taille réduite ou attente post-news" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Tu ne prédis pas le marché. Tu organises ton risque pour la semaine.
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
              "Un calendrier se lit avec 4 paramètres : consensus, précédent, réel et révisions",
              "Les révisions peuvent changer complètement l'interprétation d'une news",
              "Les clusters de news rendent toute la semaine plus volatile (pas juste le jour J)",
              "Ta feuille de route macro doit être préparée avant de trader, pas pendant",
            ]}
          />

          <LessonExercice
            description="Prépare ta prochaine semaine comme un trader macro pro."
            steps={[
              "Ouvre ton calendrier économique en vue semaine (Investing.com ou Forex Factory).",
              "Garde uniquement USD + les devises que tu trades.",
              "Liste les 3 à 5 événements les plus importants de la semaine.",
              "Note consensus, précédent et heure exacte pour chaque événement.",
              "Classe chaque journée : agressive, neutre ou défensive.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : <span className="font-semibold text-zinc-400">ne plus subir les news. Les voir venir</span>.
          </p>

          <LessonQuiz
            question="Un NFP sort à 205k alors que le consensus était à 200k. Le mouvement semble faible au départ, mais le dollar monte fortement ensuite. Quelle explication est la plus probable ?"
            options={[
              "Le marché est aléatoire, ces mouvements ne sont pas explicables",
              "Le chiffre réel est très supérieur au consensus",
              "Le chiffre précédent a peut-être été révisé fortement à la baisse",
              "Les news macro ne servent à rien sur le forex",
            ]}
            correctIndex={2}
            explanation="Un chiffre réel proche du consensus ne suffit pas toujours à expliquer un gros mouvement. Les révisions peuvent modifier toute la lecture de la tendance de l'emploi (par exemple, un chiffre précédent révisé de 250k à 170k change la perception du marché du travail US). L'option A ignore la logique macro — les mouvements ont presque toujours une cause identifiable. L'option B est fausse ici : 205k contre 200k n'est pas un gros écart. L'option D contredit tout le module Macro. C'est exactement le scénario du hero de cette leçon. Cette logique des révisions s'applique sur tous les actifs liés au dollar : EUR/USD, XAU/USD, Nasdaq et BTC/USD réagissent tous à la même réévaluation."
            answerExplanations={[
              "Faux. Le marché suit une logique précise basée sur les anticipations et les révisions. La réaction n'est pas aléatoire — elle a presque toujours une cause identifiable.",
              "Faux. 205k contre 200k est un écart minimal, insuffisant pour provoquer un gros mouvement. Ce n'est pas le chiffre du jour qui explique la réaction.",
              "Correct. Les révisions peuvent modifier toute la lecture macro. Un chiffre précédent révisé de 250k à 170k change la perception du marché du travail US — et le marché réagit à cette nouvelle réalité.",
              "Faux. Les news macro sont l'une des principales causes des gros mouvements sur le forex. Ce module entier en est la démonstration.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-intermediaire", "lecon2"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">La prochaine leçon (CPI, PPI et inflation) sera bientôt disponible.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/intermediaire/lecon1"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 1 — Hawkish vs Dovish
              </Link>
              <span className="text-sm text-zinc-700 cursor-default">
                CPI, PPI et inflation — Bientôt disponible →
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
