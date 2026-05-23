import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { FVGDiagram } from "@/app/components/charts/FVGDiagram";
import ContentEs from "./_content-es";

function ContentFr() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon2"
      title="Fair Value Gap"
      subtitle="Les Fair Value Gaps sont des déséquilibres laissés par des mouvements institutionnels rapides. Le marché cherche à les combler — et c'est là que se cachent certaines des meilleures entrées."
      duration="20 min"
      lessonNumber={2}
      prev={{ href: "/formations/avance/lecon1", label: "Leçon 1 — Liquidité" }}
      next={{ href: "/formations/avance/lecon3", label: "Leçon 3 — Order Blocks" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Qu'est-ce qu'un Fair Value Gap ?</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un Fair Value Gap (FVG) est un déséquilibre de prix créé lorsqu'un mouvement
          est tellement rapide que les bougies adjacentes ne se chevauchent pas.
          Il reste une zone de prix où les échanges n'ont pas eu lieu — le marché
          tend à y revenir pour "combler" ce déséquilibre.
        </p>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Principe :</span> un FVG se
            forme sur 3 bougies consécutives. La zone entre la mèche haute de la
            bougie 1 et la mèche basse de la bougie 3 n'a pas été échangée — c'est
            le gap.
          </p>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed">
          En pratique, les FVG apparaissent après des news économiques importantes,
          des ouvertures de session avec gap, ou des mouvements impulsifs
          institutionnels. Ils représentent des zones de déséquilibre que le marché
          cherche naturellement à réintégrer.
        </p>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Identifier un FVG sur le graphique</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          La lecture d'un FVG se fait toujours sur 3 bougies. L'analyse est simple
          une fois que tu sais quoi regarder.
        </p>
        <div className="space-y-3">
          <div className="bg-zinc-800/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-white mb-2">Les 3 bougies</p>
            <div className="space-y-2">
              {[
                { label: "Bougie 1", desc: "La bougie qui précède le mouvement. Retiens sa mèche haute (pour un FVG bullish) ou basse (pour un bearish)." },
                { label: "Bougie 2", desc: "La bougie impulsive — grande, directionnelle, souvent sans mèche. Elle crée le déséquilibre." },
                { label: "Bougie 3", desc: "La bougie qui suit. Retiens sa mèche basse (bullish) ou haute (bearish). Si elle ne chevauche pas la mèche de la bougie 1, le FVG existe." },
              ].map((b) => (
                <div key={b.label} className="flex items-start gap-3">
                  <span className="text-xs font-bold text-zinc-500 shrink-0 w-16 mt-0.5">{b.label}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-sm text-zinc-400 leading-relaxed">
              <span className="text-white font-medium">Test rapide :</span> un FVG
              existe si la mèche haute de la bougie 1 est inférieure à la mèche
              basse de la bougie 3 (bullish), ou si la mèche basse de la bougie 1
              est supérieure à la mèche haute de la bougie 3 (bearish).
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Bullish vs Bearish FVG</h2>
        <div className="space-y-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Bullish FVG</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">
                — Formé après un mouvement haussier impulsif (bougie 2 bullish)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
                — La zone est entre : mèche haute de B1 (bas du gap) et mèche basse de B3 (haut du gap)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
                — Quand le prix revient dans cette zone, c'est un potentiel point d'achat
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
                — Stop : en dessous de la zone. Target : prochain niveau de résistance ou liquidité
              </li>
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Bearish FVG</p>
            <ul className="space-y-1.5">
              <li className="text-xs text-zinc-400 leading-relaxed">
                — Formé après un mouvement baissier impulsif (bougie 2 bearish)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
                — La zone est entre : mèche basse de B1 (haut du gap) et mèche haute de B3 (bas du gap)
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
                — Quand le prix remonte dans cette zone, c'est un potentiel point de vente
              </li>
              <li className="text-xs text-zinc-400 leading-relaxed">
                — Stop : au-dessus de la zone. Target : prochain support ou pool de liquidité
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <FVGDiagram />
      </div>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Utilisation pratique</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un FVG seul ne suffit pas. Il doit s'inscrire dans un contexte favorable
          pour devenir un signal d'entrée valide.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "FVG dans le sens de la tendance",
              detail: "En tendance haussière, ne traite que les bullish FVG. Aller contre la tendance avec un FVG multiplie le risque.",
            },
            {
              label: "FVG + confluence de zone",
              detail: "Un FVG qui coïncide avec un Order Block ou un ancien support historique est beaucoup plus fiable.",
            },
            {
              label: "FVG non comblé = zone active",
              detail: "Tant qu'un FVG n'a pas été retesté, il reste actif sur le graphique. Marque-les et surveille-les.",
            },
            {
              label: "FVG comblé = invalidé",
              detail: "Si le prix traverse entièrement le gap sans réagir, le FVG est invalidé. Retire-le de ton analyse.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Workflow complet :</span> structure
            → liquidité → FVG + confluence → entrée sur rejet dans la zone. Ce
            sont ces 4 étapes combinées qui définissent un setup institutionnel complet.
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Un FVG est un déséquilibre sur 3 bougies : aucun échange n'a eu lieu dans la zone entre la mèche haute de B1 et la mèche basse de B3 (bullish).",
          "Le marché cherche à combler ses FVG — ce sont des zones de retour potentiel à surveiller.",
          "Un FVG n'est valide que dans le sens de la tendance et avec au moins une confluence supplémentaire.",
          "Un FVG traversé sans réaction est invalidé — le retirer de son analyse immédiatement.",
        ]}
      />

      <LessonExercice
        description="Sur TradingView, ouvre BTC/USD ou EUR/USD en M15 ou H1. Ta mission : identifier 3 Fair Value Gaps actifs sur le graphique."
        steps={[
          "Cherche une séquence de 3 bougies avec une B2 impulsive. Vérifie si la mèche haute de B1 ne touche pas la mèche basse de B3.",
          "Pour chaque FVG trouvé, détermine s'il est bullish ou bearish, et si le prix y est déjà retourné ou non.",
          "Si un FVG est encore intact (non comblé), marque-le et note le sens d'entrée qu'il suggère en contexte de tendance.",
        ]}
      />

      <LessonQuiz
        question="Un Bullish Fair Value Gap est identifié quand…"
        options={[
          "La bougie 2 est plus grande que les bougies 1 et 3 combinées",
          "La mèche haute de la bougie 1 est inférieure à la mèche basse de la bougie 3",
          "Le prix clôture au-dessus du plus haut de la bougie précédente",
        ]}
        correctIndex={1}
        explanation="Un Bullish FVG existe quand la mèche haute de la bougie 1 est inférieure à la mèche basse de la bougie 3 — il y a un espace entre ces deux mèches qui n'a jamais été échangé. C'est ce déséquilibre que le marché cherche à combler en y revenant, créant une opportunité d'entrée à l'achat dans un contexte haussier."
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
