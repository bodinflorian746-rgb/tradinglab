import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { TrendDiagram } from "@/app/components/charts/TrendDiagram";
import { RetracementInteractive } from "@/app/components/charts/RetracementInteractive";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="intermediaire"
      lessonId="lecon4"
      title="Tendances — trader dans le sens du marché"
      subtitle="90% des traders perdants tradent contre la tendance sans le savoir. Apprendre à lire la direction dominante, c'est mettre les probabilités de ton côté avant même d'ouvrir un trade."
      duration="18 min"
      lessonNumber={4}
      prev={{ href: "/formations/intermediaire/lecon3", label: "Leçon 3 — Supply & Demand" }}
      next={{ href: "/formations/intermediaire/lecon5", label: "Leçon 5 — Confluences" }}
    >

      {/* ── Ce que tu dois VOIR ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Ce que tu dois voir sur le graphique</p>
        <h2 className="text-lg font-semibold text-white mb-4">Lire la tendance en 3 secondes</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-emerald-400 mb-2">Tendance haussière</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le graphique "monte en escalier". Tu vois : montée → petite correction → montée plus haute → petite correction encore plus haute. Chaque vague monte plus haut que la précédente. <strong className="text-white">Tu cherches des achats, uniquement sur les corrections.</strong>
            </p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-400 mb-2">Tendance baissière</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Le graphique "descend en escalier". Chaque rebond est plus bas que le précédent. <strong className="text-white">Tu cherches des ventes, uniquement sur les rebonds.</strong>
            </p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-zinc-300 mb-2">Range</p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Le prix va et vient entre deux niveaux horizontaux. Ni les acheteurs ni les vendeurs ne gagnent clairement. Pas de trade directionnel — attendre.
            </p>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <TrendDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Teste ton instinct</p>
        <h2 className="text-lg font-semibold text-white mb-4">Quand entres-tu ?</h2>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          Le prix est en tendance haussière. Il retrace vers le Higher Low. À ce stade précis — que fais-tu ?
        </p>
        <RetracementInteractive />
      </section>

      {/* ── Identifier la tendance ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Identifier la tendance correctement</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La tendance dépend du timeframe. Un marché peut être haussier en Daily et baissier en H1. La règle : le grand timeframe définit le biais. Tu trades dans son sens.
        </p>
        <div className="space-y-2.5">
          {[
            { label: "Daily ou H4 — le biais principal", detail: "C'est la tendance que tu dois respecter. Si Daily est haussier, tu cherches uniquement des achats." },
            { label: "H1 — les zones d'entrée", detail: "En tendance haussière Daily, le H1 montre les retracements (corrections). Ce sont tes fenêtres d'entrée." },
            { label: "M15 — le timing précis", detail: "Sur M15, tu cherches le signal final (rejet, pin bar, engulfing). C'est le déclencheur de l'entrée." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span style={{ fontSize: 9, fontWeight: 700, color: "#10b981" }}>{i + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Scénario réel ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Scénario réel — trader le retracement</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          C'est le setup de base en tendance : attendre que le prix revienne sur un niveau de structure, puis entrer dans le sens de la tendance.
        </p>
        <div className="space-y-2">
          {[
            { step: "Situation", text: "EUR/USD Daily haussier. Le prix vient de faire un nouveau HH à 1.0950. Il commence à corriger.", color: "text-zinc-400" },
            { step: "Attente", text: "Tu identifies le dernier Higher Low à 1.0850. Tu attends que le prix descende vers cette zone.", color: "text-zinc-400" },
            { step: "Signal", text: "Le prix arrive sur 1.0850. Tu passes en H1. Une pin bar haussière se forme. Signal validé.", color: "text-emerald-400" },
            { step: "Entrée", text: "Tu achètes avec SL sous 1.0800 (sous le HL) et TP vers 1.0950 (vers le HH). R/R = 1:2.", color: "text-emerald-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className={`text-xs font-bold shrink-0 mt-0.5 w-12 ${item.color}`}>{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 secondes ── */}
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Comment analyser en 5 secondes</p>
        <h2 className="text-lg font-semibold text-white mb-4">Vérifier la tendance avant chaque trade</h2>
        <div className="space-y-2">
          {[
            { n: "1", t: "Ouvre le Daily", d: "Regarde la direction générale : les sommets et creux montent-ils ou descendent-ils ?" },
            { n: "2", t: "Note ton biais : achats ou ventes", d: "Haussier = achats seulement. Baissier = ventes seulement. Range = pas de trade." },
            { n: "3", t: "Descends en H4 — où est le dernier HL ou LH ?", d: "C'est là que tu vas surveiller pour entrer. Le retracement doit arriver sur cette zone." },
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
        <h2 className="text-lg font-semibold text-white mb-4">La logique selon la tendance</h2>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↑</span>
            <div>
              <p className="text-sm font-semibold text-emerald-400">Tendance haussière</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu n'achètes que sur les retracements (corrections). Jamais sur les impulsions. Tu attends que le prix revienne sur un HL avant d'entrer.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <span className="text-lg">↓</span>
            <div>
              <p className="text-sm font-semibold text-red-400">Tendance baissière</p>
              <p className="text-xs text-zinc-400 mt-0.5">Tu n'entres en vente que sur les rebonds. Jamais sur les impulsions baissières. Tu attends un LH pour vendre.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3">
            <span className="text-lg">—</span>
            <div>
              <p className="text-sm font-semibold text-zinc-300">Range</p>
              <p className="text-xs text-zinc-400 mt-0.5">Pas de trade directionnel. Si tu veux trader le range, tu achètes le bas et vends le haut — mais c'est avancé. Pour l'instant, évite.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Erreur classique ── */}
      <section className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Erreur classique</p>
        <p className="text-sm font-semibold text-white mb-2">Entrer en vente dans une tendance haussière "parce que le prix est monté trop haut"</p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          EUR/USD est en tendance haussière depuis 2 semaines. Le prix monte encore. Tu te dis "il ne peut pas continuer, je vends". Tu entres en short. Le prix monte encore 200 pips. La tendance haussière peut durer des semaines. Ne jamais trader "contre" parce que tu penses que "c'est trop haut" ou "trop bas". Le marché a toujours raison.
        </p>
      </section>

      {/* ── Résumé ultra-rapide ── */}
      <div className="border border-zinc-700/40 rounded-2xl p-5 bg-zinc-900/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Résumé en 3 secondes</p>
        <div className="space-y-2 text-sm">
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily haussier → tu achètes uniquement sur les retracements (HL)</p>
          <p className="text-zinc-200"><span className="text-emerald-400 font-bold mr-2">✔</span>Daily baissier → tu vends uniquement sur les rebonds (LH)</p>
          <p className="text-zinc-500"><span className="text-red-400 font-bold mr-2">✖</span>Range / direction incertaine → aucun trade directionnel</p>
        </div>
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Tendance haussière = HH+HL. Achats seulement sur les retracements.",
          "Tendance baissière = LH+LL. Ventes seulement sur les rebonds.",
          "Le Daily définit le biais. H4 donne les zones. M15 donne l'entrée.",
          "Ne jamais entrer à contre-tendance sans une raison structurelle solide.",
          "Un retracement dans une tendance = opportunité. Pas un signe de retournement.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, identifie la tendance sur 3 marchés différents et planifie une entrée."
        steps={[
          "Ouvre EUR/USD, GBP/USD et BTC/USD en Daily. Pour chacun, note : haussier, baissier ou range ?",
          "Sur la paire haussière : identifie les 3 derniers Higher Lows. C'est là que tu chercherais à acheter.",
          "Descends en H4 sur cette paire. Le prix est-il actuellement en retracement ou en impulsion ?",
          "Si le prix est en retracement sur un HL, descends en H1 et attends un signal de bougie. Note la zone, le SL logique et le TP.",
        ]}
      />

      <LessonQuiz
        question="EUR/USD est clairement haussier en Daily (HH/HL). Le prix vient de faire un nouveau sommet à 1.0950 et recule maintenant. Il descend vers 1.0860 (dernier Higher Low). Tu vois une pin bar haussière sur ce niveau en H1. Que fais-tu ?"
        options={[
          "Tu attends encore — peut-être que le retracement va continuer jusqu'à 1.0800",
          "Tu achètes sur la pin bar, SL sous 1.0850, TP vers 1.0990",
          "Tu vends — le prix descend, c'est un signal de faiblesse",
          "Tu ne fais rien — le marché est trop incertain en ce moment",
        ]}
        correctIndex={1}
        explanation="Tous les éléments sont alignés : tendance haussière Daily, retracement sur le dernier HL, signal de confirmation (pin bar). C'est le setup en tendance par excellence. Tu entres en achat avec SL sous le HL et TP vers le dépassement du dernier HH."
        answerExplanations={[
          "Trop prudent. Tu as 3 éléments alignés : tendance, niveau de structure, signal. C'est exactement le setup que tu attendais. Attendre davantage sans raison, c'est laisser passer une opportunité valide.",
          "Correct. Tendance haussière + retracement sur HL + signal pin bar = setup à haute probabilité. SL à 1.0810 (sous le HL à 1.0860), TP vers le prochain HH (1.0960). R/R d'environ 1:2.",
          "Faux. Le prix qui descend vers un HL en tendance haussière, c'est un retracement normal — une correction. Ce n'est pas de la faiblesse. C'est l'opportunité d'achat que tu attendais.",
          "Faux. L'incertitude ne justifie pas l'inaction quand le setup est clairement défini. Tendance + structure + signal = trade valide. L'incertitude est toujours présente — la gestion du risque (SL + taille) s'en charge.",
        ]}
      />

    </LessonPage>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale === "es") return <ContentEs />;
  return <ContentFr />;
}
