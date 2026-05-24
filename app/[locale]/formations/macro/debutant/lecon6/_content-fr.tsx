"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getStoredProgress, markLessonComplete, isLessonComplete } from "@/lib/progress";
import { MacroDangerWindowsDiagram } from "@/app/components/charts/MacroDangerWindowsDiagram";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { LessonQuiz } from "@/app/components/LessonQuiz";

const LESSONS = [
  { id: "lecon1", title: "C'est quoi la macro",              href: "/formations/macro/debutant/lecon1", disabled: false },
  { id: "lecon2", title: "Les 4 grandes banques centrales",  href: "/formations/macro/debutant/lecon2", disabled: false },
  { id: "lecon3", title: "Les chiffres macro à surveiller",  href: "/formations/macro/debutant/lecon3", disabled: false },
  { id: "lecon4", title: "Comprendre l'inflation",           href: "/formations/macro/debutant/lecon4", disabled: false },
  { id: "lecon5", title: "Le rôle du dollar dans le monde",  href: "/formations/macro/debutant/lecon5", disabled: false },
  { id: "lecon6", title: "Macro et risk management",         href: "/formations/macro/debutant/lecon6", disabled: false },
];

export default function ContentFr() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isLessonComplete(getStoredProgress(), "macro-debutant", "lecon6"));
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
          <span className="text-zinc-500">Leçon 6</span>
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
            Macro et risk management, adapter ton risque au contexte
          </h1>

          <div className="border-l-2 border-zinc-700 pl-4">
            <p className="text-[15px] text-zinc-400 leading-relaxed">
              Ton stop loss peut être parfait. Ton analyse aussi.
            </p>
            <p className="text-[15px] text-zinc-400 leading-relaxed mt-2">
              Mais si une news majeure sort dans 5 minutes, ton SL peut sauter comme s&apos;il n&apos;existait pas.
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
              const isCurrent = lesson.id === "lecon6";
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
            <span className="ml-auto text-xs text-zinc-600">6 / 6 leçons</span>
          </div>
        </header>

        {/* ── Contenu ── */}
        <div className="space-y-8">

          {/* Bloc 1 — Pourquoi la macro change ton risque */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pourquoi la macro change ton risque</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              En temps normal, ton stop loss technique a du sens. Si ton analyse prévoit un SL à 30 pips, le marché peut respecter cette zone.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Mais pendant une news majeure :
            </p>
            <ul className="space-y-2 mb-4">
              {[
                { bold: "la volatilité explose", rest: " (mouvements 2 à 5 fois plus violents que d'habitude)" },
                { bold: "les spreads peuvent s'élargir", rest: " brutalement" },
                { bold: "le prix peut traverser plusieurs niveaux", rest: " en quelques secondes" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Résultat : <span className="font-semibold text-zinc-200">ton risque réel devient plus grand que ton risque prévu</span>.
            </p>
            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Pendant une news macro, ton risque n&apos;est plus sur le papier. Il est dans la vitesse du marché.
              </p>
            </div>
          </section>

          {/* Bloc 2 — Les 3 règles d'or */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les 3 règles d&apos;or</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              En période macro, tu ne trades pas avec les mêmes règles qu&apos;un jour calme.
            </p>

            <div className="space-y-5 mb-5">
              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Règle 1. Pas de position ouverte sur news 3 étoiles</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Si une news majeure arrive, tu vérifies tes positions. Tu fermes, tu réduis, ou tu assumes consciemment le risque. Mais tu ne <span className="font-semibold text-zinc-200">découvres jamais</span> la news après coup.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Règle 2. Taille divisée par 2 après la news</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  Si tu trades après la réaction (méthode vue en leçon 3) :
                </p>
                <ul className="space-y-1.5 mb-2">
                  <li className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                    <span>taille normale : 0.10 lot</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                    <span>taille post-news : <span className="font-semibold text-zinc-200">0.05 lot</span></span>
                  </li>
                </ul>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Le but n&apos;est pas de gagner plus vite. Le but est de <span className="font-semibold text-zinc-200">survivre à la volatilité</span>.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-200 mb-2">Règle 3. SL plus large ou pas de trade</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  Si le marché bouge encore trop vite après la news :
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span>soit tu <span className="font-semibold text-zinc-200">élargis ton SL intelligemment</span> (50 pips minimum au lieu de 20-30)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    <span>soit tu <span className="font-semibold text-zinc-200">attends 1 à 2 heures</span> que ça se calme</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Quand le marché accélère, ton risque doit ralentir.
              </p>
            </div>
          </section>

          {/* Bloc 3 — Les fenêtres dangereuses */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Les fenêtres dangereuses</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Certaines heures doivent devenir <span className="font-semibold text-zinc-200">automatiques dans ta tête</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Les plus importantes (heure de Paris) :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "14h30", rest: " → chiffres US majeurs : NFP, CPI, Retail Sales" },
                { bold: "20h00", rest: " → décisions Fed / FOMC" },
                { bold: "14h15", rest: " → décisions BCE" },
                { bold: "13h00", rest: " → décisions BoE" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-2">
              La zone la plus dangereuse :
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span><span className="font-semibold text-zinc-200">30 minutes avant</span> la publication</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>jusqu&apos;à <span className="font-semibold text-zinc-200">1 heure après</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Pendant cette fenêtre, le marché peut devenir <span className="font-semibold text-zinc-200">irrationnel</span>. Aucune analyse technique classique ne tient.
            </p>
            <div className="bg-zinc-800/30 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Actifs touchés pendant ces fenêtres :</p>
              <ul className="space-y-1.5">
                {[
                  { bold: "Forex", rest: " : EUR/USD, GBP/USD (volatilité maximale)" },
                  { bold: "Or (XAU/USD)", rest: " : très réactif aux news US (dollar / taux)" },
                  { bold: "Indices US", rest: " : Nasdaq, S&P500 réagissent immédiatement" },
                  { bold: "BTC/USD", rest: " : sensible aux news macro depuis 2022" },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-2 text-xs text-zinc-400">
                    <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0 mt-1.5" />
                    <span><span className="font-semibold text-zinc-300">{item.bold}</span>{item.rest}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-500 mt-2 italic">La règle des 30 minutes avant / 1h après s&apos;applique à tous ces actifs.</p>
            </div>

            {/* Composant visuel */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden mb-5">
              <MacroDangerWindowsDiagram />
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Une bonne entrée au mauvais moment reste une mauvaise entrée.
              </p>
            </div>
          </section>

          {/* Bloc 4 — Bonne gestion vs mauvaise gestion */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Bonne gestion vs mauvaise gestion</h2>

            <div className="space-y-4 mb-5">
              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <p className="text-sm font-semibold text-zinc-200 mb-3">Cas de bonne gestion :</p>
                <ul className="space-y-1.5">
                  {[
                    "14h30 : NFP prévu",
                    "14h00 : tu fermes ou réduis tes positions",
                    "14h30 : le chiffre sort",
                    "EUR/USD fait 80 pips de mouvement",
                    "15h30 : le marché se calme",
                    "tu identifies un retracement propre",
                    "tu entres avec une taille divisée par 2",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-zinc-300 leading-relaxed mt-3">
                  Tu n&apos;as pas évité le marché. <span className="font-semibold text-zinc-200">Tu as évité le chaos.</span>
                </p>
              </div>

              <div className="bg-zinc-800/30 rounded-xl px-4 py-4">
                <p className="text-sm font-semibold text-zinc-200 mb-3">Cas de mauvaise gestion :</p>
                <p className="text-sm text-zinc-300 leading-relaxed mb-2">
                  Tu entres long EUR/USD à 14h00 sans regarder le calendrier. À 14h30, NFP sort très positif. EUR/USD chute de 80 pips en 30 secondes. Ton SL de 30 pips saute.
                </p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  <span className="font-semibold text-zinc-200">Techniquement, ton analyse pouvait être correcte.</span> Mais ton timing était mauvais. Et le marché ne pardonne pas le mauvais timing en macro.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                La macro ne récompense pas l&apos;audace. Elle récompense la patience.
              </p>
            </div>
          </section>

          {/* Bloc 5 — Réalité du retail */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Réalité du retail</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Avec un compte de 500€, un mauvais trade macro peut faire <span className="font-semibold text-zinc-200">très mal</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Calcul concret :
            </p>
            <ul className="space-y-1.5 mb-4">
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>EUR/USD chute de 80 pips</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Position : 0.10 lot</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                <span>Perte : <span className="font-semibold text-zinc-200">environ 80€</span></span>
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">80€ sur 500€ = 16% du compte en 30 secondes.</span>
            </p>
            <div className="bg-zinc-900/60 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs font-semibold text-zinc-400 mb-2">Et ce n&apos;est pas qu&apos;un risque sur EUR/USD. Avec un compte de 500€ et une position dimensionnée selon les règles de gestion du risque (2% par trade), une mauvaise news macro peut effacer le même pourcentage du compte sur tous les actifs :</p>
              <div className="space-y-1.5">
                {[
                  { asset: "EUR/USD", detail: "-80 pips → -80€", pct: "16% du compte" },
                  { asset: "XAU/USD", detail: "-30$ → -90€", pct: "18% du compte" },
                  { asset: "Nasdaq", detail: "-1.5% → -75€", pct: "15% du compte" },
                  { asset: "BTC/USD", detail: "-800$ → -120€", pct: "24% du compte" },
                ].map((item) => (
                  <div key={item.asset} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300 w-20">{item.asset}</span>
                    <span className="text-zinc-400">{item.detail}</span>
                    <span className="font-semibold text-red-400">{item.pct}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2 italic">Note : ces équivalences sont calculées à taille de risque similaire (pas à même nombre de lots). Le but est de montrer que peu importe l&apos;actif tradé, une mauvaise gestion du risque sur news macro peut effacer 15-25% du compte en quelques minutes.</p>
            </div>

            {/* Encadré 💰 Réalité du retail */}
            <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span>💰</span>
                <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
              </div>
              <p className="text-base text-zinc-300 leading-relaxed">
                En 30 secondes, tu peux perdre plus que <span className="font-semibold text-zinc-200">plusieurs semaines de discipline</span>. La macro ne détruit pas les comptes parce qu&apos;elle est compliquée. <span className="font-semibold text-zinc-200">Elle les détruit parce qu&apos;elle est ignorée.</span>
              </p>
            </div>
          </section>

          {/* Bloc 6 — Comment adapter ton risk management */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-3">Comment adapter ton risk management</h2>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              Tu as déjà appris à adapter ton risque à ton capital (cf leçon Trading &apos;Gestion du risque&apos;) :
            </p>
            <ul className="space-y-1.5 mb-4">
              {[
                { bold: "petit compte (300€)", rest: " → 3% idéal, max 5%" },
                { bold: "compte moyen (500-1000€)", rest: " → 2-3% idéal" },
                { bold: "compte plus solide (2000€+)", rest: " → 2% strict" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                  <span><span className="font-semibold text-zinc-200">{item.bold}</span>{item.rest}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-300 leading-relaxed text-sm mb-4">
              <span className="font-semibold text-zinc-200">La macro ajoute une couche supplémentaire.</span>
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Voici la grille de décision selon le contexte macro :
            </p>

            {/* Grille de décision */}
            <div className="overflow-hidden rounded-xl border border-zinc-800 mb-5">
              <div className="grid grid-cols-2">
                <div className="px-4 py-2.5 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contexte</div>
                <div className="px-4 py-2.5 bg-zinc-800/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-l border-zinc-800">Action</div>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { ctx: "Macro calme", action: "Règles standard (% selon ton capital)" },
                  { ctx: "News 3 étoiles dans <2h", action: "Fermer / réduire / attendre" },
                  { ctx: "Macro contre ton setup", action: "Diviser la taille par 2 ou passer" },
                  { ctx: "Macro confirme ton setup", action: "Setup standard avec confluence renforcée" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2">
                    <div className="px-4 py-3 text-sm font-semibold text-zinc-200">{row.ctx}</div>
                    <div className="px-4 py-3 text-sm text-zinc-400 border-l border-zinc-800/60">{row.action}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-zinc-300 leading-relaxed text-sm mb-3">
              Si la macro va contre ton setup → <span className="font-semibold text-zinc-200">tu diminues la taille ou tu passes</span>.
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm mb-5">
              Si la macro confirme ton setup → tu peux chercher une entrée propre, <span className="font-semibold text-zinc-200">mais sans augmenter ta taille pour autant</span>.
            </p>

            <div className="bg-zinc-900 border-l-4 border-emerald-500 px-5 py-4 rounded">
              <p className="text-base text-white font-semibold italic leading-relaxed">
                Le bon trader ne risque pas pareil dans le calme et dans la tempête.
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
              "Une news macro peut multiplier ton risque réel par 2 à 5 fois",
              "Les fenêtres dangereuses : 30 min avant jusqu'à 1h après les news 3 étoiles",
              "Sur news 3 étoiles : fermer, réduire ou attendre (jamais ignorer)",
              "La grille de décision : macro favorable + technique propre = meilleur contexte",
            ]}
          />

          <LessonExercice
            description="Avant ta prochaine session, construis ton plan de risque macro."
            steps={[
              "Ouvre le calendrier économique du jour (Investing.com ou Forex Factory).",
              "Repère tous les événements 3 étoiles sur ta session de trading.",
              "Note les heures dangereuses dans ton planning (30 min avant + 1h après chaque news).",
              "Décide à l'avance pour chaque news : tu fermes, tu réduis, ou tu attends ?",
              "Après chaque news, observe si le marché devient tradable ou reste chaotique.",
            ]}
          />
          <p className="text-sm text-zinc-500 leading-relaxed px-1">
            L&apos;objectif : <span className="font-semibold text-zinc-400">ne jamais découvrir une news après avoir pris position</span>.
          </p>

          <LessonQuiz
            question="Tu veux entrer long EUR/USD à 14h10. Le calendrier indique un NFP à 14h30. Ton setup technique est propre. Que fais-tu ?"
            options={[
              "Tu entres normalement, ton setup est propre, la macro c'est pour les nouvelles",
              "Tu entres avec plus de taille pour profiter du mouvement attendu",
              "Tu attends la publication NFP, tu observes la réaction, et tu réévalues le setup ensuite",
              "Tu retires ton stop loss pour éviter d'être sorti par la volatilité",
            ]}
            correctIndex={2}
            explanation="Un NFP peut créer un mouvement violent et imprévisible (200-500 pips de mouvement total possible). Même si ton setup est techniquement propre, le risque réel est trop élevé juste avant la publication. L'option A ignore complètement le contexte macro et te fait subir la volatilité. L'option B est encore pire, tu augmentes ton risque dans la fenêtre la plus dangereuse. L'option D est catastrophique : retirer ton SL transforme une perte limitée en perte potentiellement énorme. La seule réponse pro : attendre, observer, réévaluer. Ce principe vaut sur tous les actifs sensibles à la macro : EUR/USD, XAU/USD, Nasdaq, BTC/USD."
            answerExplanations={[
              "Faux. Ignorer une news 3 étoiles à 20 minutes, c'est subir la volatilité. Un NFP peut créer un mouvement de 200-500 pips, ton setup technique ne tient pas face à cette réalité.",
              "Faux. Augmenter la taille dans la fenêtre de danger maximale est une erreur grave. Tu maximises ton risque au pire moment possible.",
              "Correct. Un NFP peut créer un mouvement violent et imprévisible. Attendre, observer la réaction, puis réévaluer le setup est la seule approche professionnelle.",
              "Faux. Retirer ton SL est catastrophique : cela transforme une perte limitée en perte potentiellement énorme si le marché part dans le mauvais sens.",
            ]}
          />

        </div>

        {/* ── Footer ── */}
        <div className="mt-12 space-y-3">
          <div className="border-t border-zinc-800/60 pt-8">

            {!done ? (
              <button
                onClick={() => { const p = getStoredProgress(); markLessonComplete(p, "macro-debutant", "lecon6"); setDone(true); }}
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
                  <p className="text-xs text-zinc-500 mt-0.5">Tu as terminé le module Débutant Macro. Bravo !</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <Link
                href="/formations/macro/debutant/lecon5"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Leçon 5. Le rôle du dollar dans le monde
              </Link>
              <span className="text-sm text-emerald-400 italic cursor-default">
                Module Débutant Macro complet ✓
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
