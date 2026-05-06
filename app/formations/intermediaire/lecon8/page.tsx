import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TradePlanDiagram } from "@/app/components/charts/TradePlanDiagram";

export default function Page() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon8"
      title="Plan de trade"
      subtitle="Un trade sans plan, c'est une décision émotionnelle. Le plan de trade transforme ton analyse en actions précises — et élimine l'improvisation au pire moment."
      duration="20 min"
      lessonNumber={8}
      prev={{ href: "/formations/intermediaire/lecon7", label: "Leçon 7 — Multi-Timeframe" }}
      next={{ href: "/formations/intermediaire/lecon9", label: "Leçon 9 — Fibonacci" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">La différence entre trader avec et sans plan</h2>
        <div className="space-y-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Sans plan — ce qui se passe réellement</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              EUR/USD monte rapidement. Tu vois +30 pips en 10 minutes. Tu entres par FOMO à 1.0980. Le prix recule à 1.0960. Tu gardes "parce qu'il va remonter". Il descend à 1.0940. Tu paniques et tu coupes. Le prix repart à 1.1020 sans toi. Tu as perdu 40 pips et le trade que tu attendais.
            </p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Avec plan — le même jour</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Tu avais identifié 1.0850 comme zone d'achat le matin. Tu regardes le prix monter sans toi — sans stress. Il retrace à 1.0853. Pin bar sur ta zone. Tu entres exactement comme prévu. SL à 1.0835, TP à 1.0950. Tu n'improvises rien. <strong className="text-white">Tu exécutes.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Pourquoi un plan ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Pourquoi un plan de trade est indispensable</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La plupart des traders perdent non pas parce qu'ils manquent de connaissances, mais parce qu'ils prennent leurs décisions dans le feu de l'action. Un plan de trade te force à décider AVANT que l'émotion n'entre en jeu — quand tu es calme, lucide et objectif.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400">
            <span className="text-white font-medium">Règle fondamentale :</span> tout ce que tu vas faire pendant un trade doit être décidé avant d'entrer. SL, TP, taille — fixés à l'avance, jamais modifiés sous l'émotion.
          </p>
        </div>
      </section>

      {/* ── Les 6 éléments ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les éléments d'un plan de trade complet</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un bon plan de trade répond à 6 questions avant chaque session.
        </p>
        <div className="space-y-2.5">
          {[
            { q: "Quel est mon biais ?", r: "Haussier, baissier ou neutre (pas de trade). Basé sur l'analyse Daily." },
            { q: "Quels sont mes niveaux clés ?", r: "Les zones de support/résistance, SD zones et structures importantes pour la session." },
            { q: "À quelle condition j'entre ?", r: "Le déclencheur précis : 'Si le prix revient sur 1.0850 et forme un rejet, j'achète'." },
            { q: "Où est mon Stop Loss ?", r: "Niveau défini à l'avance, logique sur le graphique — non modifiable une fois le trade ouvert." },
            { q: "Où est mon Take Profit ?", r: "Objectif basé sur la structure du marché. R/R d'au moins 1:2." },
            { q: "Quelle est ma règle de stop de journée ?", r: "Si je perds X% aujourd'hui, je m'arrête. Protège contre le vengeance trading." },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-800/40 rounded-xl px-4 py-3">
              <p className="text-sm font-semibold text-white mb-1">{item.q}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.r}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TradePlanDiagram />
      </div>

      {/* ── Journal de trading ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Le journal de trading — ce qui fait vraiment progresser</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Le journal, c'est l'enregistrement de chaque trade. Il permet d'identifier tes patterns de réussite, tes erreurs récurrentes, et de progresser structurellement.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Avant le trade", detail: "Biais, niveaux, déclencheur attendu, SL/TP, confluences. Pourquoi tu prends ce trade." },
            { label: "Après le trade", detail: "Résultat en R (gain/perte), ce qui s'est passé, as-tu respecté le plan, qu'aurais-tu fait différemment ?" },
            { label: "Révision hebdomadaire", detail: "Analyse de tous les trades de la semaine : taux de réussite, R moyen, erreurs répétées, pattern de réussite." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Vérifier son plan avant d'entrer</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Le déclencheur est-il validé ?", d: "Le prix est sur ma zone ET j'ai un signal de bougie. Si non → je n'entre pas, peu importe la tentation." },
            { n: "2", t: "Mon SL et TP sont-ils définis ?", d: "Prix d'entrée exact, SL en dessous de la zone, TP sur la prochaine structure. R/R supérieur à 1:2 ?" },
            { n: "3", t: "Ma règle de journée est-elle respectée ?", d: "Ai-je déjà perdu ma limite de perte quotidienne ? Si oui → je ferme la plateforme." },
          ].map((item) => (
            <div key={item.n} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.n}</span>
              <div>
                <p className="text-sm font-medium text-white">{item.t}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ce que tu dois faire ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">Ce que tu dois faire</p>
        <h2 className="text-lg font-semibold text-white mb-4">Les règles non-négociables</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Trade dans le plan → tu exécutes</p>
              <p className="text-xs text-zinc-400 mt-0.5">Le déclencheur prévu se produit sur la zone prévue. Tu entres avec le SL et TP déjà définis. Aucune improvisation.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/15 rounded-xl px-4 py-3">
            <span className="text-lg">!</span>
            <div>
              <p className="text-sm font-semibold text-amber-400">Trade hors plan → tu passes</p>
              <p className="text-xs text-zinc-400 mt-0.5">Une opportunité apparaît mais elle n'était pas dans ton plan. Tu passes. Il y aura d'autres trades. Mieux vaut rater un trade que perdre sur une impulsion.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">✗</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Déplacer le SL sous l'émotion → jamais</p>
              <p className="text-xs text-zinc-400 mt-0.5">Le trade va contre toi. Tu veux déplacer le SL "pour lui donner une chance". C'est l'erreur la plus coûteuse. Si le SL est logique, tu le laisses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Déplacer le SL "pour lui donner une chance"</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Tu es en short sur EUR/USD. SL à 1.0965. Le prix monte à 1.0960 — 5 pips de ton SL. Tu te dis "si je le mets à 1.0980, il a plus de place". Tu déplaces. Le prix continue à 1.0975. Tu déplaces encore à 1.0995. Tu passes d'une perte de 15 pips à une perte de 35 pips. Le SL initial existait pour une raison : la structure. Ne le touche plus une fois le trade ouvert.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Déclencheur prévu sur ta zone → tu exécutes le plan</p>
          <p className="text-zinc-200"><span className="text-amber-400 font-bold mr-2">!</span>Opportunité hors plan → tu passes (il y aura d'autres trades)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>SL en place sous pression → tu ne le déplaces jamais</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Un plan de trade se rédige AVANT la session — jamais en temps réel sous l'émotion.",
          "Les 6 éléments essentiels : biais, niveaux clés, déclencheur, SL, TP, règle de stop de journée.",
          "Le journal de trading est l'outil qui permet de progresser de façon structurée.",
          "Un trade qui ne respecte pas le plan est une erreur — même s'il finit gagnant.",
          "La discipline, c'est exécuter le plan même quand l'émotion suggère autre chose.",
        ]}
      />

      <LessonExercice
        description="Rédige ton premier plan de trade complet pour la prochaine session sur EUR/USD."
        steps={[
          "Analyse EUR/USD en Daily et H4 — note ton biais pour demain (haussier, baissier, ou pas de trade).",
          "Identifie 2 zones clés sur lesquelles tu pourrais réagir. Écris les prix exacts.",
          "Pour chaque zone, décris le déclencheur exact : 'Si le prix arrive sur X et que je vois Y, alors j'entre en Z'.",
          "Définis ton SL (sous la zone), ton TP (prochain niveau de structure), calcule le R/R et fixe ta règle de stop de journée.",
        ]}
      />

      <LessonQuiz
        question="Tu es en achat sur EUR/USD. SL à 1.0835. Le trade va contre toi — le prix descend à 1.0845, à 10 pips de ton SL. Tu penses 'il va remonter'. Que fais-tu ?"
        options={[
          "Tu déplaces le SL à 1.0820 pour lui donner plus d'espace",
          "Tu fermes le trade immédiatement — le marché va contre ton plan",
          "Tu gardes le SL à 1.0835 et tu laisses le marché trancher — c'est la décision du plan",
          "Tu ajoutes à ta position long pour améliorer ton prix moyen d'entrée",
        ]}
        correctIndex={2}
        explanation="Le SL a été placé à 1.0835 pour une raison structurelle — sous la zone d'entrée. Le marché peut osciller avant de repartir dans le bon sens. Déplacer le SL, c'est passer d'une perte définie à une perte inconnue. Si le SL est logique, tu le laisses faire son travail."
        answerExplanations={[
          "Faux. Déplacer le SL sous l'émotion est l'une des erreurs les plus coûteuses. Tu avais 1.0835 pour une raison structurelle. Le déplacer, c'est accepter une perte plus grande sans raison valable. La pression émotionnelle n'est pas une raison technique.",
          "Partiellement valide. Si la structure que tu avais identifiée est clairement cassée (pas seulement 'en train de baisser'), fermer peut être justifié. Mais si le SL n'est pas touché et que la zone tient, le plan prévaut.",
          "Correct. Le plan a été établi hors émotion. Si le SL est logique sur le graphique, tu le laisses en place. Le prix peut osciller avant de repartir. C'est précisément pour ça que le SL existe — pour définir ta perte max sans que tu aies à décider sous pression.",
          "Faux. Ajouter à une position perdante ('moyenner') augmente ton risque sur un trade qui va déjà dans la mauvaise direction. C'est l'une des erreurs les plus dangereuses en trading — elle transforme les petites pertes en grosses pertes.",
        ]}
      />

    </LessonPage>
  );
}
