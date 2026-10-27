import { LessonPage } from "@/app/components/LessonPage";
import { LessonQuiz } from "@/app/components/LessonQuiz";
import { LessonKeyPoints } from "@/app/components/LessonKeyPoints";
import { AnchoredVWAPDiagram, VWAPCalcDiagram, VWAPGoldPlanDiagram, VWAPNasdaqPlanDiagram } from "@/app/components/charts/VWAPDiagrams";

// Trading Avancé 11 — VWAP. Leçon en français seulement (site FR) : toutes les locales affichent ce
// contenu. NASDAQ : niveaux du texte d'origine décalés de +7 000 points (20 000 → 27 000).

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}

function P({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return <p className={`text-zinc-300 leading-relaxed text-sm${last ? "" : " mb-4"}`}>{children}</p>;
}

function Plan({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
      <p className="text-sm font-semibold text-white mb-2">{title}</p>
      <ul className="space-y-1 text-sm text-zinc-300">
        {lines.map((l) => <li key={l}>- {l}</li>)}
      </ul>
    </div>
  );
}

function Retail({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-800/50 border-l-4 border-amber-400 px-5 py-4 rounded">
      <div className="flex items-center gap-2 mb-2">
        <span>💰</span>
        <span className="text-sm font-bold text-amber-400 tracking-wide">Réalité du retail</span>
      </div>
      <p className="text-base text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}

export default function Page() {
  return (
    <LessonPage
      formationId="avance"
      lessonId="lecon11"
      title="VWAP, les retours du prix dans une tendance"
      subtitle="Dans une tendance, comment repérer une zone de retour intéressante sans acheter trop haut ni vendre trop bas ? Le VWAP, le prix moyen pondéré par les volumes, peut t'y aider, à condition de le combiner à la structure du marché."
      duration="22 min"
      lessonNumber={11}
      prev={{ href: "/formations/avance/lecon10", label: "Leçon 10 : Volume Profile" }}
      next={{ href: "/formations/avance/lecon12", label: "Leçon 12 : Order Flow" }}
    >

      <Section title="Qu'est-ce que le VWAP ?">
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Dans cette leçon :</span>{" "}comprendre le VWAP, lire la position du prix par rapport à lui, repérer un retour vers le VWAP dans une tendance, découvrir le VWAP ancré, puis construire un plan chiffré sur le NASDAQ et sur l&apos;or.
          </p>
        </div>
        <P>
          Le VWAP (Volume Weighted Average Price) est le prix moyen d&apos;un actif pondéré par les volumes échangés, depuis un point de départ choisi. À la différence d&apos;une moyenne mobile simple, il donne plus de poids aux périodes où beaucoup de volume a été échangé. Il sert de référence pour situer le prix et observer certaines corrections dans une tendance.
        </P>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Formule :</span>{" "}VWAP = somme (prix × volume) ÷ somme des volumes. Trois périodes : 100 € avec un volume de 100, 102 € avec 200, 104 € avec 500. VWAP = (100 × 100 + 102 × 200 + 104 × 500) ÷ 800 = 103 €. La moyenne simple des trois prix vaut 102 € : le VWAP est tiré vers 104 €, le prix qui a concentré la majorité du volume.
          </p>
        </div>
        <P last>
          Le calcul est cumulatif depuis le point de départ du VWAP. Sur un graphique en bougies, le prix utilisé est en général une approximation, comme le prix typique de la bougie, (plus haut + plus bas + clôture) ÷ 3. Le résultat exact dépend de la méthode et des données utilisées.
        </P>
      </Section>

      <div className="space-y-4">
        <VWAPCalcDiagram />
      </div>

      <Section title="Lire le VWAP sur un graphique">
        <P>
          Sur TradingView, le VWAP est une ligne qui évolue au fil de la séance : la référence du prix moyen pondéré.
        </P>
        <div className="space-y-3 mb-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Prix au-dessus du VWAP</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Le prix est au-dessus du prix moyen pondéré depuis le début du calcul. Dans une tendance haussière, c&apos;est souvent le cas pendant la progression, et le prix peut revenir vers le VWAP pendant une correction.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <p className="font-semibold text-red-400 text-sm mb-2">Prix en dessous du VWAP</p>
            <p className="text-xs text-zinc-400 leading-relaxed">Le prix est sous le prix moyen pondéré. Dans une tendance baissière, le marché peut rebondir vers cette zone avant de reprendre sa baisse.</p>
          </div>
        </div>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Attention :</span>{" "}le VWAP ne fixe pas la tendance à lui seul. Tu l&apos;étudies d&apos;abord avec les sommets, les creux, les impulsions et les corrections ; le VWAP vient ensuite compléter cette lecture.
          </p>
        </div>
      </Section>

      <Section title="Le VWAP et la structure de marché">
        <P>
          Une tendance haussière a en général des sommets et des creux de plus en plus hauts ; une tendance baissière, des sommets et des creux de plus en plus bas. C&apos;est ce principe que tu combines au VWAP.
        </P>
        <P>
          Exemple haussier : le NASDAQ fait un creux à 27 000 points, un sommet à 27 140, un nouveau creux à 27 080, puis un nouveau sommet à 27 230. La structure reste haussière. Après cette progression, le prix corrige : plutôt que d&apos;acheter tout de suite, tu regardes si la correction le ramène vers une zone technique intéressante. Si le VWAP se trouve aussi dans cette zone, c&apos;est un élément de plus. Tu ne cherches pas à acheter parce que le prix touche une ligne, mais une convergence entre la structure haussière, une zone technique et une confirmation de reprise.
        </P>
        <P last>
          Le même raisonnement fonctionne à la vente : si le NASDAQ fait des sommets et des creux de plus en plus bas, tu peux attendre un rebond vers une résistance. Si le VWAP de séance passe dans cette zone, il sert de repère supplémentaire, et tu attends que la pression baissière reprenne avant d&apos;envisager une entrée.
        </P>
      </Section>

      <Section title="Exemple pratique : trader le NASDAQ">
        <P>
          Un plan complet sur le NASDAQ avec le VWAP et la structure des prix. Tous les niveaux de cet exemple sont fictifs.
        </P>
        <div className="space-y-2 mb-4">
          {[
            { step: "1", text: "La tendance. En H1, le NASDAQ a une structure haussière : il vient de progresser de 27 000 à 27 230 points, puis une correction commence. L'ancienne résistance 27 140 est devenue un support." },
            { step: "2", text: "Le VWAP. En M15, le VWAP de séance passe près de 27 140 : le support et le VWAP se retrouvent dans la même zone, alors que la structure H1 reste haussière. Cela définit une zone d'observation, pas encore une entrée." },
            { step: "3", text: "La confirmation. Le prix revient vers 27 140, forme un creux local à 27 133, puis rebondit et dépasse le sommet local de la correction (27 153) : première reprise de la dynamique haussière sur l'unité de temps d'entrée." },
            { step: "4", text: "Le plan. Tu peux maintenant fixer ton entrée, ton stop loss et ton objectif." },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 bg-zinc-800/30 rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-blue-400 shrink-0 mt-0.5 w-4">{item.step}</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
        <Plan
          title="Le plan, NASDAQ CFD"
          lines={[
            "Tendance H1 : haussière",
            "Zone de support : 27 140, VWAP au moment de l'analyse : près de 27 140",
            "Entrée à l'achat : 27 155, juste au-dessus du sommet local de la correction",
            "Stop loss : 27 125, sous le creux local (27 133)",
            "Take profit : 27 215, juste avant le dernier sommet (27 230), qui fait office de résistance",
            "Risque 30 points, gain potentiel 60 points : R/R 1:2 avant les frais",
          ]}
        />
        <P>
          Le stop est sous le creux technique qui valide le scénario : si le prix casse cette structure, l&apos;hypothèse d&apos;une reprise haussière perd sa validité. L&apos;objectif reste sous le dernier sommet, où le prix risque de ralentir.
        </P>
        <P last>
          Pourquoi ce trade est intéressant : tu ne l&apos;as pas ouvert parce que le prix a touché le VWAP. Tu as identifié la tendance principale, attendu une correction, repéré un support, constaté la convergence avec le VWAP, attendu la confirmation sur l&apos;unité de temps inférieure, défini une invalidation technique et vérifié le ratio risque/rendement. Le VWAP n&apos;est pas ta stratégie : c&apos;est un élément qui renforce ton analyse.
        </P>
      </Section>

      <div className="space-y-4">
        <VWAPNasdaqPlanDiagram />
      </div>

      <Retail>
        La taille se calcule à part, avec la valeur du point du contrat de ton broker. Sur un CFD NASDAQ courant, le lot minimum (0,1 lot) vaut environ 0,10 $ par point, soit à peu près 0,09 € : ce stop de 30 points représente environ 3 € de risque, sous les 6 € autorisés par la règle des 2 % sur un compte de 300 €. Vérifie la taille minimale et la valeur du point de ton contrat avant de trader.
      </Retail>

      <Section title="Exemple complémentaire : le VWAP sur l'or (XAU/USD)">
        <P>
          Un scénario baissier. Le XAU/USD fait des sommets et des creux de plus en plus bas en H1. Après une forte impulsion baissière, le prix remonte vers une ancienne zone de support devenue résistance, à 3 900 $. Le VWAP de séance passe lui aussi autour de 3 900 $. Le prix teste la zone, échoue à la dépasser, puis casse un creux local en M15.
        </P>
        <Plan
          title="Le plan, XAU/USD"
          lines={[
            "Entrée à la vente : 3 897 $",
            "Stop loss : 3 907 $, au-dessus de la zone d'invalidation",
            "Take profit : 3 877 $, sur un support précédent du graphique",
            "Risque 10 $ par once, gain potentiel 20 $ par once : R/R 1:2",
          ]}
        />
        <P last>
          Le VWAP a aidé à repérer une zone où surveiller la fin de la correction. La confirmation, elle, vient de la réaction du prix et de sa structure.
        </P>
      </Section>

      <div className="space-y-4">
        <VWAPGoldPlanDiagram />
      </div>

      <Retail>
        Au lot minimum (0,01 lot, soit 1 once), ce stop de 10 $ représente environ 9 € de risque : sur un compte de 1 500 €, c&apos;est sous ton maximum de 30 € (2 %), pour un gain possible d&apos;environ 17 €. Avec la règle des 2 %, ce trade demande au moins 450 € de capital.
      </Retail>

      <Section title="Le VWAP ancré (Anchored VWAP)">
        <P>
          Le VWAP classique démarre en général au début d&apos;une séance. Le VWAP ancré te laisse choisir le point de départ du calcul, pour étudier les échanges depuis un événement précis : un sommet ou un creux important, le début d&apos;une impulsion ou d&apos;une consolidation, une publication économique.
        </P>
        <P>
          Exemple sur l&apos;or : une publication économique déclenche une forte impulsion haussière. Tu ancres un VWAP au début de cette impulsion : la ligne montre le prix moyen pondéré depuis l&apos;événement. Si le marché corrige quelques heures plus tard, tu compares le prix à cette référence pour situer la correction.
        </P>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            Un VWAP ancré n&apos;est pas plus pertinent par nature qu&apos;un VWAP de séance : son utilité dépend du point d&apos;ancrage et de la structure analysée.
          </p>
        </div>
      </Section>

      <div className="space-y-4">
        <AnchoredVWAPDiagram />
      </div>

      <Section title="Utiliser le VWAP sur TradingView">
        <P>
          Ouvre un graphique qui dispose de données de volume adaptées, puis cherche « VWAP » dans les indicateurs. Pour le VWAP classique, regarde d&apos;abord à quel moment le calcul repart à zéro : sur les marchés qui ont des séances régulières, le VWAP de séance est particulièrement utile en intraday. Pour un VWAP ancré, utilise l&apos;outil ou l&apos;indicateur prévu à cet effet dans ton interface.
        </P>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">Remise à zéro sur le Forex et les CFD :</span>{" "}avec le réglage par défaut (période d&apos;ancrage « Session »), le VWAP de TradingView repart à zéro à l&apos;ouverture de chaque nouvelle séance. Sur le Forex et la plupart des CFD, elle commence à 17 h, heure de New York, soit 23 h à Paris la plus grande partie de l&apos;année (22 h pendant les quelques semaines où les changements d&apos;heure américain et européen sont décalés). L&apos;heure exacte dépend du fournisseur de données du symbole : vérifie-la sur ton graphique.
          </p>
        </div>
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-sm text-zinc-400 leading-relaxed">
            <span className="text-white font-medium">RaiseFX et les CFD :</span>{" "}le VWAP repose sur les prix et les volumes du graphique utilisé. Sur le Forex spot et certains CFD, ces volumes ne sont pas forcément ceux de l&apos;ensemble du marché : la ligne peut varier selon le flux de données. Tu peux t&apos;en servir comme repère complémentaire, en gardant cette limite en tête, après avoir vérifié que ton graphique dispose bien des volumes nécessaires au calcul.
          </p>
        </div>
      </Section>

      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Les erreurs fréquentes</h2>
        <div className="space-y-2.5">
          {[
            { label: "Acheter dès que le prix est au-dessus du VWAP", detail: "Un prix au-dessus du VWAP ne garantit pas une progression, et il peut être très loin d'une zone d'entrée intéressante." },
            { label: "Vendre dès que le prix passe sous le VWAP", detail: "Un passage temporaire sous le VWAP peut n'être qu'une correction : la structure générale reste essentielle." },
            { label: "Utiliser le VWAP sans supports ni résistances", detail: "Le VWAP enrichit ton analyse, il ne remplace pas les niveaux techniques." },
            { label: "Placer ton stop loss d'après le VWAP seul", detail: "Le stop correspond à une invalidation technique cohérente ; la présence du VWAP ne suffit pas à fixer ce niveau." },
            { label: "Ignorer la séance ou le point d'ancrage", detail: "Un VWAP de séance ne couvre pas la même période qu'un VWAP ancré sur un sommet de plusieurs jours." },
          ].map((r) => (
            <div key={r.label} className="flex items-start gap-3 bg-zinc-800/40 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-400 shrink-0 mt-0.5">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-zinc-300 leading-relaxed text-sm mt-4">
          Tu sais maintenant lire le VWAP dans une tendance et le combiner aux supports, aux résistances et aux confirmations pour construire un plan chiffré. Dans la prochaine leçon : comment les traders spécialisés des marchés futures lisent les transactions avec l&apos;Order Flow, le footprint, le delta et le CVD.
        </p>
      </section>

      <div className="flex items-center gap-4 py-2">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-widest">Révision</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <LessonKeyPoints
        points={[
          "Le VWAP est le prix moyen pondéré par les volumes depuis un point de départ défini.",
          "Il situe le prix pendant une séance, ou depuis un événement précis avec un VWAP ancré.",
          "Dans une tendance, il aide à repérer des zones de correction à surveiller.",
          "Combine-le avec la structure de marché, les supports et résistances, une confirmation technique, une invalidation précise et un ratio risque/rendement adapté.",
          "Le VWAP ne doit pas te pousser à prendre plus de trades, mais à mieux choisir tes setups.",
        ]}
      />

      <LessonQuiz
        questions={[
          {
            question: "Quelle est la principale différence entre le VWAP et une moyenne mobile simple ?",
            options: [
              "Le VWAP tient compte des volumes échangés.",
              "Le VWAP indique à l'avance le prochain mouvement du prix.",
              "Le VWAP est toujours horizontal.",
            ],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Le VWAP pondère les prix par les volumes.",
              "Faux. Le VWAP ne prédit pas le mouvement à venir.",
              "Faux. Le VWAP évolue au fil des échanges enregistrés.",
            ],
          },
          {
            question: "Le NASDAQ est en tendance haussière et corrige vers un support situé au niveau du VWAP. Quelle est la meilleure approche ?",
            options: [
              "Acheter dès le contact.",
              "Attendre une réaction et une confirmation technique avant d'envisager une entrée.",
              "Vendre, parce que le prix a baissé pendant la correction.",
            ],
            correctIndex: 1,
            answerExplanations: [
              "Faux. Un contact avec le VWAP n'est pas une confirmation suffisante.",
              "Correct. Le VWAP sert de confluence avec le support ; la confirmation vient du prix.",
              "Faux. Une correction ne signifie pas que la tendance principale s'est retournée.",
            ],
          },
          {
            question: "À quoi sert le VWAP ancré ?",
            options: [
              "À calculer automatiquement ton stop loss.",
              "À afficher seulement les volumes acheteurs.",
              "À calculer le prix moyen pondéré depuis un point de départ choisi.",
            ],
            correctIndex: 2,
            answerExplanations: [
              "Faux. L'indicateur ne fixe pas l'invalidation technique d'un trade.",
              "Faux. Le VWAP ne sépare pas les achats et les ventes agressifs.",
              "Correct. Le point d'ancrage permet d'étudier les échanges depuis un événement choisi.",
            ],
          },
          {
            question: "Sur le NASDAQ, tu achètes à 27 155 points, avec un stop à 27 125 et un objectif à 27 215. Quel est ton R/R ?",
            options: ["1:2", "1:1", "1:3"],
            correctIndex: 0,
            answerExplanations: [
              "Correct. Tu risques 30 points pour en viser 60.",
              "Faux. L'objectif est deux fois plus loin que le stop.",
              "Faux. Un R/R de 1:3 demanderait ici un gain potentiel de 90 points.",
            ],
          },
        ]}
      />

    </LessonPage>
  );
}
