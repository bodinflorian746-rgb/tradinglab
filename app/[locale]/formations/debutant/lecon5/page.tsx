import { LessonTemplate } from "@/app/components/LessonTemplate";
import { StopLossChartDiagram } from "@/app/components/charts/StopLossChartDiagram";
import ContentEs from "./_content-es";

// ── Schéma : Trade avec SL et TP ─────────────────────────────────────────────
function StopLossDiagram() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-4 text-center">
        Bitcoin — trade Long avec Stop Loss et Take Profit
      </p>
      <div className="max-w-xs mx-auto space-y-0">
        {/* Zone TP */}
        <div className="rounded-t-xl bg-emerald-500/10 border border-emerald-500/25 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-0.5">Take Profit</p>
            <p className="text-lg font-mono font-bold text-emerald-400">81 000 $</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">Si le prix monte jusqu'ici</p>
            <p className="text-sm font-bold text-emerald-400">Variation +3 000 $</p>
          </div>
        </div>

        {/* Flèches */}
        <div className="flex items-center justify-center bg-zinc-900 border-x border-zinc-700 h-8 gap-8">
          <div className="flex items-center gap-1 text-[9px] text-emerald-400">
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 13V2M2 5L5 2l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Objectif</span>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-red-400">
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v11M2 9l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Protection</span>
          </div>
        </div>

        {/* Entrée */}
        <div className="bg-zinc-800 border-x border-zinc-700 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-wide mb-0.5">Entrée</p>
            <p className="text-lg font-mono font-bold text-white">78 000 $</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">Prix d'achat</p>
            <span className="text-xs font-mono text-zinc-400">R/R 1:2</span>
          </div>
        </div>

        {/* Zone SL */}
        <div className="rounded-b-xl bg-red-500/10 border border-red-500/25 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide mb-0.5">Stop Loss</p>
            <p className="text-lg font-mono font-bold text-red-400">76 500 $</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 mb-0.5">Si le prix descend ici</p>
            <p className="text-sm font-bold text-red-400">Variation −1 500 $</p>
          </div>
        </div>

        {/* Résumé */}
        <div className="mt-3 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-center">
          <p className="text-[10px] text-zinc-400">
            Variation risquée <strong className="text-red-400">1 500 $</strong> · visée <strong className="text-emerald-400">3 000 $</strong>
            <span className="text-zinc-600 mx-1.5">·</span>
            Ratio <strong className="text-white">1:2</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Schéma : avec SL vs sans SL ──────────────────────────────────────────────
function WithWithoutSLDiagram() {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-wide">Avec Stop Loss ✓</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Achat</span>
            <span className="text-white font-mono">78 000 $</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">SL déclenché à</span>
            <span className="text-white font-mono">76 500 $</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Variation</span>
            <span className="text-red-400 font-bold">−1 500 $</span>
          </div>
          <p className="text-[9px] text-emerald-400/80 mt-1">Risque limité et défini à l'avance</p>
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
        <p className="text-[10px] font-bold text-red-400 mb-2 uppercase tracking-wide">Sans Stop Loss ✗</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Achat</span>
            <span className="text-white font-mono">78 000 $</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Chute nocturne à</span>
            <span className="text-white font-mono">70 000 $</span>
          </div>
          <div className="h-px bg-zinc-700 my-1" />
          <div className="flex justify-between">
            <span className="text-zinc-500">Variation</span>
            <span className="text-red-400 font-bold">−8 000 $</span>
          </div>
          <p className="text-[9px] text-red-400/80 mt-1">Risque non plafonné</p>
        </div>
      </div>
    </div>
  );
}

function ContentFr() {
  return (
    <LessonTemplate
      formationId="debutant"
      lessonId="lecon5"
      lessonNumber={5}
      duration="10 min"
      prev={{ href: "/formations/debutant/lecon4", label: "Leçon 4 — Spread" }}
      next={{ href: "/formations/debutant/lecon6", label: "Leçon 6 — Take Profit" }}
      title="Le Stop Loss"
      hook="Sans Stop Loss, un seul trade peut ruiner des mois de travail en quelques minutes. Pas parce que tu analyses mal — parce que le marché peut aller beaucoup plus loin que tu ne l'imagines, et rien ne t'arrête. Le Stop Loss est la règle la plus importante du trading."
      sections={[
        {
          title: "Qu'est-ce qu'un Stop Loss ?",
          content: "Un Stop Loss (SL), c'est un ordre automatique qui ferme ton trade si le prix va trop loin dans la mauvaise direction. Tu le définis avant d'entrer dans le trade. Quand le prix l'atteint, ta position se ferme seule — que tu sois devant l'écran ou non.",
          visual: <StopLossDiagram />,
          items: [
            "Trade Long (achat) : ton SL se place EN DESSOUS de ton prix d'entrée",
            "Trade Short (vente) : ton SL se place AU DESSUS de ton prix d'entrée",
            "Quand le prix atteint le SL, le trade se ferme automatiquement",
            "Ta perte reste plafonnée et connue à l'avance — son montant exact en argent dépend de la taille de ta position",
          ],
        },
        {
          title: "Variation de prix et taille de position",
          content: "La variation de prix entre l'entrée et le Stop Loss est identique pour tous les traders sur ce trade. Dans cet exemple, le marché évolue de 1 500 $ entre 78 000 $ et 76 500 $. En revanche, le gain ou la perte en argent dépend de la taille de la position utilisée (le lot). Sur exactement le même mouvement de prix, un trader positionné avec 1 lot perdra 10× plus qu'un trader positionné avec 0,1 lot, et 100× plus qu'un trader positionné avec 0,01 lot. Deux traders peuvent donc prendre exactement le même trade, avec le même SL et le même TP, tout en gagnant ou perdant des montants totalement différents. Le calcul précis de la taille de position sera détaillé dans la Leçon 8 (Money Management).",
          items: [
            "La variation de prix jusqu'au SL est identique pour tous les traders sur le trade",
            "Le gain ou la perte en argent dépend de la taille de ta position — ton lot",
            "Même trade, même SL, même TP : avec des lots différents, les montants gagnés ou perdus sont totalement différents",
          ],
        },
        {
          title: "Exemple concret — avec et sans Stop Loss",
          content: "Cas 1 — avec Stop Loss : Entrée Bitcoin à 78 000 $, Stop Loss à 76 500 $. Pendant la nuit, le marché chute brutalement et le Stop Loss ferme automatiquement la position à proximité de 76 500 $. La variation de prix négative est limitée à environ 1 500 $ : un risque défini à l'avance et contrôlé. Cas 2 — sans Stop Loss : même entrée à 78 000 $, mais sans protection. La nuit, le marché s'effondre jusqu'à 70 000 $ : la variation de prix négative atteint 8 000 $, un risque non plafonné. Dans les deux cas, le montant réellement perdu en argent dépend de la taille de la position. Le Stop Loss ne garantit pas un trade gagnant — il garantit surtout qu'une mauvaise position ne se transforme pas en catastrophe.",
          visual: <WithWithoutSLDiagram />,
          items: [
            "Avec SL : la perte est limitée et connue à l'avance dès l'entrée",
            "Sans SL : la perte peut être illimitée — le marché n'attend pas que tu sois prêt",
            "Les traders sans SL pensent 'le prix va revenir' — parfois oui, parfois non. Le 'non' détruit le compte.",
          ],
        },
        {
          title: "Où placer son Stop Loss ?",
          content: "Un bon SL ne se place pas au hasard. Il se place à un endroit logique sur le graphique — là où ton analyse serait clairement fausse si le prix l'atteignait.",
          visual: <StopLossChartDiagram />,
          items: [
            "Long : SL juste en dessous du dernier point bas significatif (le support)",
            "Short : SL juste au-dessus du dernier point haut significatif (la résistance)",
            "Exemple : tu achètes au rebond d'un support à 78 000 $. Le dernier point bas est à 77 200 $. Ton SL va à 77 000 $.",
            "Règle : si le prix atteint mon SL, mon analyse était fausse. La perte est normale.",
          ],
        },
      ]}
      errors={[
        "Ne pas mettre de SL 'pour laisser une chance au trade' — c'est la cause n°1 de comptes détruits chez les débutants",
        "SL trop serré : 100 $ de SL sur Bitcoin qui fluctue normalement de plus de 1 000 $ par heure — tu seras sorti sans raison",
        "SL placé au hasard ('1 500 $ parce que ça me semble bien') — le SL doit correspondre à un niveau logique sur le graphique",
        "Oublier de placer le SL au moment d'entrer en pensant 'je le mets juste après' — et ne jamais le mettre",
      ]}
      fatalError="Déplacer le Stop Loss dans le mauvais sens pour éviter d'être stoppé. Ton trade perd, tu es à −500 $. Tu éloignes le SL pour 'lui laisser une chance'. Le trade continue à perdre. Tu éloignes encore. Au final, tu perds 5 ou 10 fois plus que prévu. Cette erreur, commise sous l'émotion, est responsable de la destruction de milliers de comptes de traders débutants."
      keyPoints={[
        "Stop Loss = ordre automatique qui limite ta perte à un montant défini à l'avance",
        "Long : SL en dessous de l'entrée. Short : SL au-dessus de l'entrée.",
        "Sans SL, ta perte est potentiellement illimitée — c'est un risque inacceptable",
        "Place le SL à un endroit logique sur le graphique, pas au hasard",
        "Ne déplace JAMAIS le SL dans le sens de la perte — c'est l'erreur fatale",
      ]}
      exerciseTitle="Identifier des placements de Stop Loss logiques"
      exercise={[
        "Sur TradingView, ouvre Bitcoin (BTC/USD) en H1",
        "Repère le dernier mouvement haussier. Identifie le dernier point bas avant cette hausse.",
        "Si tu achetais au prix actuel, ton SL irait juste en dessous de ce point bas. Note le prix exact.",
        "Calcule la différence en euros entre ce SL et le prix actuel. C'est le risque maximum de ce trade.",
      ]}
      quiz={{
        question: "Une position acheteuse sur BTC/USD est ouverte à 78 000 $. Le dernier point bas significatif se situe à 77 000 $. Quel placement de Stop Loss respecte le mieux la logique technique ?",
        answers: [
          "77 900 $",
          "77 500 $",
          "76 900 $",
          "78 200 $",
        ],
        correctIndex: 2,
        explanation: "Le Stop Loss doit être placé au-delà du niveau technique qui invalide le scénario. Le dernier point bas important se situe à 77 000 $. Un Stop Loss à 76 900 $ laisse une petite marge sous ce niveau tout en gardant un risque cohérent. La variation entre l'entrée (78 000 $) et le SL (76 900 $) représente une variation de prix de 1 100 $. La perte réellement subie en argent dépend ensuite de la taille de la position utilisée.",
        answerExplanations: [
          "Incorrect. Le Stop Loss est placé trop proche de l'entrée. Une fluctuation normale de Bitcoin peut facilement toucher ce niveau sans invalider le scénario.",
          "Incorrect. Le Stop Loss reste au-dessus du dernier point bas significatif. Le marché pourrait balayer ce niveau avant de repartir.",
          "Correct. Le Stop Loss se situe juste sous le dernier point bas important à 77 000 $. Le niveau invalide réellement le scénario si le prix est cassé.",
          "Incorrect. Le Stop Loss est placé au-dessus du prix d'entrée. Le trade serait clôturé immédiatement ou presque.",
        ],
      }}
    />
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
