import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { LessonExercice } from "@/app/components/LessonExercice";
import { StopHuntInteractive } from "@/app/components/charts/StopHuntInteractive";

export default function Page() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon6"
      title="Stop Hunts — la chasse aux stops"
      subtitle="Les stop hunts ne sont pas de la manipulation illégale — ils sont une mécanique structurelle du marché. Apprendre à les lire te transforme de victime en observateur averti."
      duration="22 min"
      lessonNumber={6}
      prev={{ href: "/formations/avance/lecon5", label: "Leçon 5 — OTE" }}
      next={{ href: "/formations/avance/lecon7", label: "Leçon 7 — Entrées de précision" }}
    >

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">La mécanique du Stop Hunt</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un stop hunt se produit quand le prix dépasse brièvement un niveau clé — support, résistance, Equal High ou Equal Low — uniquement pour déclencher les stops des traders positionnés à ce niveau. Une fois les stops exécutés, le prix repart immédiatement dans la direction opposée.
        </p>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Ce n'est pas une conspiration. C'est une mécanique naturelle : les stops des retail traders constituent des <span className="text-white font-medium">pools de liquidité</span> que les institutions doivent consommer pour exécuter leurs propres ordres massifs.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Stop Hunt sur résistance (BSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Le prix monte au-dessus d'une résistance ou EQH, déclenche les stops des shorts, puis revient sous la résistance. Les institutions vendent dans ce spike haussier.</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Stop Hunt sur support (SSL)</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Le prix descend sous un support ou EQL, déclenche les stops des longs, puis remonte au-dessus du support. Les institutions achètent dans ce spike baissier.</p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Reconnaître un Stop Hunt en temps réel</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Plusieurs signaux permettent d'identifier un stop hunt avant ou pendant qu'il se produit.
        </p>
        <div className="space-y-2.5">
          {[
            {
              label: "Mèche longue qui dépasse un niveau évident",
              detail: "Une bougie avec une mèche qui perce une résistance ou un support visible de tous — c'est le signe que les stops ont été chassés.",
            },
            {
              label: "Clôture de l'autre côté du niveau",
              detail: "La bougie pierce le niveau mais clôture de l'autre côté. Cela confirme que la pénétration était temporaire (stop hunt), pas une vraie cassure.",
            },
            {
              label: "Retournement brutal et rapide",
              detail: "Après le spike, le prix repart violemment dans l'autre sens. Ce mouvement est alimenté par les positions des institutions qui viennent d'obtenir leur liquidité.",
            },
            {
              label: "Niveaux à éviter : EQH et EQL",
              detail: "Equal Highs et Equal Lows sont les cibles favorites des stop hunts. Deux ou trois sommets/creux au même niveau = accumulation de stops = cible évidente.",
            },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-blue-400 shrink-0 mt-0.5">
                <path d="M7 2v5M7 10v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Trader APRÈS le Stop Hunt</h2>
        <p className="text-zinc-300 leading-relaxed text-sm mb-4">
          Un stop hunt confirmé est l'un des setups les plus puissants en Smart Money. Tu entres après la chasse — dans le sens du retournement institutionnel.
        </p>
        <div className="space-y-2">
          {[
            { step: "1", text: "Identifie un niveau avec accumulation de stops : EQH, EQL, résistance ou support évident." },
            { step: "2", text: "Attends que le prix spike au-delà du niveau mais ne clôture pas de l'autre côté." },
            { step: "3", text: "Confirme le retournement : bougie de rejet (pin bar, engulfing) qui revient dans la zone." },
            { step: "4", text: "Entre dans le sens du retournement. SL au-delà du pic du spike. TP vers le niveau de liquidité opposé." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-emerald-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Avantage :</span> en entrant après le stop hunt, tu as un SL très serré (juste au-delà du spike) pour un TP potentiellement large (le marché vient de se positionner institutionnellement).
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest">Teste ton instinct — face à un stop hunt</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <div className="border border-zinc-800 rounded-2xl p-5 space-y-4">
        <StopHuntInteractive />
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Un stop hunt : spike rapide au-delà d'un niveau clé → déclenchement des stops → retournement brutal.",
          "Les EQH et EQL sont les cibles favorites des stop hunts — méfie-toi des niveaux 'trop évidents'.",
          "Signal : mèche longue qui perce un niveau + clôture de l'autre côté + retournement violent.",
          "Ne suis jamais la mèche d'un spike — attends la confirmation du retournement avant d'entrer.",
          "Après un stop hunt confirmé : SL serré au-delà du pic, TP vers la liquidité opposée.",
        ]}
      />

      <LessonExercice
        description="Pars à la chasse aux stop hunts sur les graphiques récents."
        steps={[
          "Sur EUR/USD en H1, identifie des Equal Highs ou Equal Lows des 2 dernières semaines.",
          "Pour chaque niveau, vérifie : y a-t-il eu un spike au-delà suivi d'un retournement rapide ?",
          "Si oui, mesure l'amplitude du retournement après le stop hunt. Le mouvement était-il significatif ?",
          "Entraîne-toi à placer mentalement une entrée : où aurait été ton entrée, SL et TP sur ce stop hunt ?",
        ]}
      />

      <LessonQuiz
        question="Le prix monte brièvement au-dessus d'une résistance majeure (Equal Highs) puis clôture immédiatement en dessous avec une mèche haute longue. Que fais-tu ?"
        options={[
          "Tu achètes en cassure — le prix a bien dépassé la résistance",
          "Tu ignores — ce mouvement est trop ambigu pour en tirer une conclusion",
          "Tu surveilles un signal de retournement baissier — c'est probablement un stop hunt sur la BSL",
          "Tu places un ordre d'achat au-dessus du pic du spike pour suivre le momentum",
        ]}
        correctIndex={2}
        explanation="Un spike au-dessus des Equal Highs avec clôture en dessous est la signature d'un stop hunt sur la Buy-side Liquidity (BSL). Les institutions viennent de prendre la liquidité des stops des shorts. Le retournement baissier qui suit est alimenté par les ventes institutionnelles — c'est là qu'on cherche un signal de vente."
        answerExplanations={[
          "Faux. La clôture sous la résistance invalide la cassure. Ce n'est pas un breakout — c'est précisément un faux breakout (stop hunt). Acheter ici, c'est se positionner du mauvais côté du mouvement institutionnel.",
          "Faux. Ce n'est pas ambigu pour quelqu'un qui connaît les stop hunts. La signature est claire : spike + mèche longue + clôture de l'autre côté. C'est un signal d'alerte, pas une situation neutre.",
          "Correct. Un spike sur les EQH avec retour sous la résistance = stop hunt sur la BSL. Les institutions ont vendu dans ce spike. La probabilité d'une continuation baissière est élevée — surveille un engulfing ou pin bar baissier pour entrer.",
          "Faux. Placer un ordre au-dessus du spike, c'est espérer que la cassure soit réelle. Mais le signal est exactement inverse : le prix a rejeté ce niveau avec force. Tu t'apprêterais à entrer dans la direction du stop hunt, pas dans la direction institutionnelle.",
        ]}
      />

    </LessonPage>
  );
}
