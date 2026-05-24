export interface Quiz {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
  answerExplanations: string[];
}

export interface LessonContent {
  id: string;
  slug: string;
  title: string;
  duration: string;
  introduction: string;
  sections: {
    heading: string;
    body: string;
    items?: string[];
    table?: { headers: string[]; rows: string[][] };
    diagram?: string;
    note?: string;
  }[];
  keyPoints: string[];
  exercise: {
    title: string;
    steps: string[];
  };
  quiz: Quiz;
}

export interface LevelData {
  level: string;
  title: string;
  promise: string;
  lessons: LessonContent[];
}

export const LESSONS: LevelData[] = [
  {
    level: "debutant",
    title: "Les Fondations",
    promise: "Comprendre les marchés avant de risquer un centime.",
    lessons: [

      // ─── Leçon 1 ────────────────────────────────────────────────────────────
      {
        id: "lecon-1",
        slug: "lecon1",
        title: "C'est quoi le trading ?",
        duration: "8 min",
        introduction:
          "La plupart des gens qui ouvrent un compte de trading perdent de l'argent dans les 3 premiers mois. Pas parce qu'ils manquent d'intelligence. Parce qu'ils ont commencé sans comprendre ce qu'ils faisaient réellement.",
        sections: [
          {
            heading: "Le principe, en une phrase",
            body: "Le trading, c'est parier sur la direction d'un prix. Tu penses que ça va monter → tu achètes. Tu penses que ça va baisser → tu vends. Tu as raison → tu gagnes. Tu as tort → tu perds. C'est aussi simple que ça, et c'est exactement pour ça que c'est difficile.",
            items: [
              "Les marchés, c'est des acheteurs et des vendeurs qui s'accordent sur un prix",
              "Si les acheteurs sont plus nombreux et plus agressifs → le prix monte",
              "Si les vendeurs dominent → le prix baisse",
              "Tu peux gagner dans les deux sens : à la hausse comme à la baisse",
            ],
          },
          {
            heading: "Exemple concret : gain et perte",
            body: "Cas 1, le prix monte en ta faveur : Tu achètes Bitcoin à 78 000 $. Quelques heures plus tard, Bitcoin monte à 81 000 $. Le prix a donc progressé de 3 000 $ en faveur de ta position. Tu gardes ton plan, tu laisses le trade respirer, puis tu prends tes profits. Cas 2, le prix descend contre toi : Tu achètes Bitcoin à 78 000 $. Quelques heures plus tard, Bitcoin chute à 76 500 $. Le prix a donc baissé de 1 500 $ contre ta position. Sous le coup de la peur, tu fermes la position en panique et encaisses la perte. Le trading consiste à essayer d'anticiper ces mouvements de prix. Le montant réellement gagné ou perdu en argent dépend ensuite de la taille de ta position. Le calcul précis de cette taille sera détaillé dans la Leçon 8. La différence entre les deux cas ? Pas l'analyse, le comportement face à la perte.",
            diagram: "trade",
            items: [
              "Un trade qui gagne ≠ un bon trade (tu aurais pu juste avoir de la chance)",
              "Un trade qui perd ≠ un mauvais trade (si tu as suivi un plan solide, c'est normal)",
              "Ce qui compte sur le long terme : la méthode et la discipline, pas chaque résultat individuel",
            ],
          },
          {
            heading: "Trading, investissement, casino : les 3 ne sont pas la même chose",
            body: "Beaucoup de débutants confondent ces trois concepts. Cette confusion coûte de l'argent.",
            table: {
              headers: ["", "Trading", "Investissement", "Casino"],
              rows: [
                ["Durée", "Minutes à semaines", "Mois à années", "Secondes"],
                ["Décision", "Analyse technique", "Analyse fondamentale", "Hasard pur"],
                ["Résultat", "Reproductible", "Reproductible", "Non reproductible"],
                ["Contrôle", "Élevé (SL, TP)", "Moyen", "Aucun"],
              ],
            },
          },
          {
            heading: "Erreurs fréquentes des débutants",
            body: "Ces erreurs sont universelles. Presque tous les nouveaux traders en commettent au moins une dans les premières semaines.",
            items: [
              "Confondre trading et investissement, un trader qui 'garde sa position parce qu'il croit au projet' n'est plus un trader, c'est un investisseur",
              "Croire qu'il faut avoir raison souvent pour être rentable, faux : un bon ratio risque/récompense suffit",
              "Suivre des conseils de trading sans comprendre pourquoi, tu ne peux pas apprendre à cuisiner en regardant quelqu'un d'autre manger",
              "Commencer avec de l'argent réel sans période d'entraînement, le stress de l'argent réel change entièrement les décisions",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Ouvrir un compte réel et déposer de l'argent sans avoir passé au minimum 4 à 6 semaines sur un compte démo. En démo, tu apprends les mécanismes sans rien risquer. En réel, sans cette base, les émotions prennent le dessus dès le premier trade perdant, et elles ne te lâchent plus.",
          },
        ],
        keyPoints: [
          "Le trading = parier sur la direction d'un prix, à la hausse ou à la baisse",
          "Tu peux gagner dans les deux sens, quand ça monte et quand ça baisse",
          "Trading ≠ investissement ≠ casino, ce sont trois activités différentes",
          "Ce qui compte : la méthode et la discipline, pas le résultat de chaque trade",
          "Commence toujours sur compte démo avant de risquer de l'argent réel",
        ],
        exercise: {
          title: "Observer les marchés sur TradingView",
          steps: [
            "Va sur TradingView.com et crée un compte gratuit",
            "Recherche 'EURUSD', le prix actuel est indiqué en haut à gauche. Note-le.",
            "Attends 10 minutes. Le prix a-t-il bougé ? Dans quel sens ? De combien ?",
            "Recherche 'BTCUSD', compare la vitesse et l'amplitude des mouvements avec EUR/USD",
          ],
        },
        quiz: {
          question: "Tu achètes Bitcoin à 78 000 $ puis tu le revends à 81 000 $. Quelle affirmation est correcte ?",
          answers: [
            "Le mouvement de prix est de +3 000 $",
            "Tu gagnes automatiquement 3 000 $",
            "Tu doubles forcément ton capital",
            "Le résultat dépend uniquement du prix de vente final",
          ],
          correct: 0,
          explanation:
            "Le trading repose sur les variations de prix entre l'entrée et la sortie. Dans cet exemple, Bitcoin passe de 78 000 $ à 81 000 $, soit un mouvement de +3 000 $. En revanche, le montant réellement gagné en argent dépend de la taille de ta position. Deux traders peuvent prendre exactement le même mouvement tout en gagnant des montants très différents.",
          answerExplanations: [
            "Correct. Le prix est passé de 78 000 $ à 81 000 $, soit une variation positive de 3 000 $.",
            "Incorrect. 3 000 $ correspond au mouvement du prix, pas automatiquement au gain réel en argent. Le résultat final dépend aussi de la taille de ta position.",
            "Incorrect. Le mouvement du prix ne permet pas de connaître l'évolution exacte du capital sans connaître la taille de la position.",
            "Incorrect. Le prix de vente seul ne suffit pas. Le résultat dépend de la différence entre entrée et sortie, ainsi que de la taille de ta position.",
          ],
        },
      },

      // ─── Leçon 2 ────────────────────────────────────────────────────────────
      {
        id: "lecon-2",
        slug: "lecon2",
        title: "Acheter / Vendre : Long et Short",
        duration: "9 min",
        introduction:
          "En 2022, le Bitcoin a perdu 70% de sa valeur en quelques mois. Des milliers de personnes ont tout perdu. Pourtant, certains traders ont gagné exactement sur cette chute. Comment ? En sachant vendre à découvert. Cette leçon t'explique comment.",
        sections: [
          {
            heading: "Long = tu paries à la hausse",
            body: "Aller Long (ou Buy), c'est acheter un actif en espérant que son prix va monter. Tu achètes maintenant et tu revends plus tard à un prix plus élevé. C'est la direction la plus intuitive, comme acheter des chaussures pour les revendre plus cher.",
            items: [
              "L'or est à 4 600 $. Tu penses qu'il va monter. Tu achètes (Long).",
              "L'or monte à 4 720 $. Le prix a grimpé de 120 $ : le mouvement va dans ton sens.",
              "L'or descend à 4 510 $. Le prix a reculé de 90 $ : le mouvement joue contre toi.",
              "Long = tu veux que le prix monte APRÈS que tu aies acheté",
            ],
          },
          {
            heading: "Short = tu paries à la baisse",
            body: "Aller Short (ou Sell), c'est vendre un actif que tu ne possèdes pas physiquement, en espérant le racheter moins cher ensuite. En pratique, ton broker gère la technique, tu cliques simplement 'Sell'. Si le prix baisse, tu gagnes.",
            items: [
              "L'or est à 4 700 $. Tu penses qu'il va baisser. Tu vends (Short).",
              "L'or descend à 4 580 $. Le prix a reculé de 120 $ : pour un Short, une baisse va dans ton sens.",
              "L'or monte à 4 790 $. Le prix a grimpé de 90 $ : pour un Short, une hausse joue contre toi.",
              "Short = tu veux que le prix BAISSE après que tu aies vendu",
            ],
          },
          {
            heading: "Long vs Short : la comparaison",
            body: "Les deux directions sont symétriques. Seule la direction du gain change. La gestion du risque fonctionne exactement pareil dans les deux cas.",
            diagram: "long-short",
            table: {
              headers: ["", "Long (Buy, Achat)", "Short (Sell. Vente)"],
              rows: [
                ["Tu gagnes si…", "Le prix monte", "Le prix baisse"],
                ["Tu perds si…", "Le prix baisse", "Le prix monte"],
                ["Autre terme", "Haussier / Bullish", "Baissier / Bearish"],
                ["Bouton MT5", "BUY", "SELL"],
              ],
            },
          },
          {
            heading: "Erreurs fréquentes des débutants",
            body: "Ces confusions arrivent souvent. Elles peuvent coûter des trades entiers passés dans le mauvais sens.",
            items: [
              "Croire qu'on ne peut gagner que quand ça monte, le Short existe précisément pour profiter des baisses",
              "Confondre 'Sell pour fermer un Long' et 'ouvrir un Short', dans MT5, les deux s'appellent Sell mais ce n'est pas pareil",
              "Shorter sans Stop Loss, une erreur encore plus grave qu'un Long sans SL (expliqué ci-dessous)",
              "Chercher le Short sur tout 'parce que ça baisse toujours', les marchés montent sur le long terme, le Long est statistiquement favorisé",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Ouvrir un Short sans Stop Loss. Un actif qui baisse a une limite naturelle : le prix ne peut pas descendre sous 0. Mais un actif qui monte n'a théoriquement pas de limite. Si tu shories et que le prix explose à la hausse, ta perte peut dépasser ta mise initiale. Sans SL, un Short incontrôlé peut ruiner un compte entier en quelques heures.",
          },
        ],
        keyPoints: [
          "Long (Buy) = tu achètes = tu gagnes si le prix monte",
          "Short (Sell) = tu vends = tu gagnes si le prix baisse",
          "Tu peux gagner dans les deux sens, la hausse comme la baisse",
          "BUY = Long / SELL = Short dans tous les logiciels de trading",
          "Short sans Stop Loss = risque potentiellement illimité, toujours protéger ses positions",
        ],
        exercise: {
          title: "Identifier des opportunités Long et Short sur un graphique",
          steps: [
            "Sur TradingView, ouvre BTC/USD en Daily (graphique journalier)",
            "Repère le dernier grand mouvement haussier sur le graphique. Quand a-t-il commencé ? Combien a-t-il duré ?",
            "Repère le dernier grand mouvement baissier. De quel pourcentage le prix a-t-il chuté ?",
            "Si tu avais ouvert un Short au début de cette baisse, de combien le prix aurait-il bougé en ta faveur ?",
          ],
        },
        quiz: {
          question: "Le Bitcoin est à 78 000 $. Tu penses qu'il va baisser à 75 000 $. Quel ordre ouvres-tu ?",
          answers: [
            "Un Long (Buy), pour profiter de la baisse anticipée",
            "Un Short (Sell), pour profiter de la baisse anticipée",
            "Aucun, on ne peut gagner que quand le prix monte",
            "Un Long et un Short en même temps pour couvrir les deux sens",
          ],
          correct: 1,
          explanation:
            "Pour profiter d'une baisse anticipée, tu ouvres un Short (Sell). Tu vends à 78 000 $ et tu rachètes à 75 000 $. Le prix a baissé de 3 000 $, et ce mouvement joue en ta faveur. Le montant réellement gagné en argent dépend ensuite de la taille de ta position, c'est le sujet de la Leçon 8.",
          answerExplanations: [
            "Faux. Un Long (Buy) = parier sur une HAUSSE. Si tu penses que le Bitcoin va baisser et tu ouvres un Long, tu perdras quand le prix descend à 75 000 $, exactement l'inverse de ce que tu voulais.",
            "Correct. Un Short (Sell) = parier sur une BAISSE. Tu vends à 78 000 $, le prix descend à 75 000 $, tu rachètes : il a baissé de 3 000 $. C'est ce mouvement que le Short cherche à capter, le gain réel en argent dépend de la taille de ta position (Leçon 8).",
            "Faux. Le Short existe précisément pour profiter des baisses. En trading, on peut gagner dans les deux sens. Se limiter aux hausses, c'est se priver de la moitié des opportunités du marché.",
            "Faux. Ouvrir un Long et un Short simultanément sur le même actif s'annule parfaitement, les gains de l'un compensent les pertes de l'autre. Tu ne gagnes rien, mais tu paies les frais deux fois.",
          ],
        },
      },

      // ─── Leçon 3 ────────────────────────────────────────────────────────────
      {
        id: "lecon-3",
        slug: "lecon3",
        title: "Lire un graphique en bougies",
        duration: "10 min",
        introduction:
          "Un graphique en bougies, c'est une image du combat entre acheteurs et vendeurs. Chaque bougie te dit qui a gagné, avec quelle force, et s'il y a eu de la résistance. Apprendre à les lire, c'est apprendre à voir ce que la plupart des gens ne voient pas.",
        sections: [
          {
            heading: "Anatomie d'une bougie : 4 informations en une image",
            body: "Chaque bougie affiche exactement 4 données. Ensemble, elles résument tout ce qui s'est passé pendant une période donnée, que ce soit 1 minute, 1 heure ou 1 jour.",
            diagram: "candle",
            items: [
              "Open (O), le prix au début de la période",
              "Close (C), le prix à la fin de la période",
              "High (H), le prix le plus haut atteint pendant la période",
              "Low (L), le prix le plus bas atteint pendant la période",
            ],
          },
          {
            heading: "Exemple concret : lire une bougie pas à pas",
            body: "Cas 1, bougie verte (acheteurs gagnants) : Bitcoin ouvre à 20 000 €. Il monte jusqu'à 20 800 €. Il redescend légèrement à 19 700 €. Il clôture à 20 400 €. Résultat : corps vert de 20 000 à 20 400 (close > open). Mèche haute de 20 400 à 20 800 (les vendeurs ont repoussé les acheteurs depuis les sommets). Mèche basse de 20 000 à 19 700 (les acheteurs ont défendu les prix bas).\n\nCas 2, bougie rouge (vendeurs gagnants) : Bitcoin ouvre à 20 400 €. Monte à 20 600 €. Chute à 19 500 €. Clôture à 19 800 €. Résultat : corps rouge de 20 400 à 19 800 (close < open). Les vendeurs ont dominé la période.",
            items: [
              "Corps vert = acheteurs ont gagné (close > open)",
              "Corps rouge = vendeurs ont gagné (close < open)",
              "Mèche haute = tentative de hausse repoussée par les vendeurs",
              "Mèche basse = tentative de baisse repoussée par les acheteurs",
            ],
          },
          {
            heading: "Patterns de bougies à connaître",
            body: "Ces configurations reviennent souvent. Elles donnent des informations, mais elles ne sont jamais des signaux seuls. Leur valeur dépend entièrement de l'endroit où elles apparaissent.",
            table: {
              headers: ["Pattern", "À quoi ça ressemble", "Ce que ça dit"],
              rows: [
                ["Marteau", "Petit corps en haut, longue mèche basse", "Vendeurs ont échoué à faire baisser, les acheteurs ont défendu"],
                ["Étoile filante", "Petit corps en bas, longue mèche haute", "Acheteurs ont échoué à faire monter, les vendeurs ont rejeté"],
                ["Doji", "Corps quasi nul, mèches des deux côtés", "Indécision totale, ni les acheteurs ni les vendeurs ne gagnent"],
                ["Engulfing haussier", "Grande bougie verte qui avale la rouge précédente", "Les acheteurs ont pris le contrôle de façon décisive"],
                ["Engulfing baissier", "Grande bougie rouge qui avale la verte précédente", "Les vendeurs ont pris le contrôle de façon décisive"],
              ],
            },
          },
          {
            heading: "Erreurs fréquentes des débutants",
            body: "Ces erreurs de lecture coûtent cher. Savoir nommer les patterns ne suffit pas, il faut aussi savoir quand ils comptent.",
            items: [
              "Entrer sur un trade uniquement parce qu'une bougie 'ressemble' à un marteau, sans vérifier si elle est sur un niveau important",
              "Confondre la couleur d'une bougie avec un signal de trade : une bougie rouge ne veut pas dire 'vendre maintenant'",
              "Analyser une seule bougie : c'est toujours la séquence de bougies qui raconte l'histoire, pas une bougie isolée",
              "Ignorer les mèches : une bougie verte avec une très longue mèche haute n'est pas forcément un signal haussier fort",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Entrer sur un trade uniquement parce qu'un pattern de bougie te semble intéressant, sans regarder la tendance globale et sans que la bougie soit sur un niveau clé. Un marteau au milieu de nulle part ne signifie rien. Un marteau sur un support majeur, dans une tendance haussière, là, il devient pertinent.",
          },
        ],
        keyPoints: [
          "Chaque bougie = 4 données : Open, High, Low, Close",
          "Corps vert = acheteurs gagnants. Corps rouge = vendeurs gagnants.",
          "Les mèches = tentatives échouées, elles montrent la résistance du camp adverse",
          "Doji = indécision. Marteau = rejet des prix bas. Engulfing = prise de contrôle franche.",
          "Un pattern de bougie seul ne signifie rien, le contexte (zone, tendance) lui donne de la valeur",
        ],
        exercise: {
          title: "Lire des bougies sur un graphique réel",
          steps: [
            "Sur TradingView, ouvre EUR/USD en timeframe Daily",
            "Trouve une bougie verte avec une longue mèche haute, qu'est-il arrivé dans les jours suivants ?",
            "Trouve un Doji, le marché a-t-il choisi une direction claire dans les bougies suivantes ?",
            "Identifie un Engulfing (une grande bougie qui avale la précédente), quel a été l'impact sur la suite ?",
          ],
        },
        quiz: {
          question: "Tu vois une bougie rouge avec une très longue mèche basse. Qu'est-ce que cela indique le plus précisément ?",
          answers: [
            "Le marché est fortement baissier et va continuer à baisser",
            "Les vendeurs ont dominé la période, mais les acheteurs ont défendu les prix bas avec force",
            "La clôture de la bougie a eu lieu au niveau le plus bas de la période",
            "C'est un signal d'achat immédiat, entre maintenant",
          ],
          correct: 1,
          explanation:
            "Corps rouge = les vendeurs ont gagné la période (close < open). Longue mèche basse = le prix a chuté très bas, mais les acheteurs ont repoussé cette baisse avant la clôture. C'est un signal de résistance acheteuse, pas une domination vendeurs totale.",
          answerExplanations: [
            "Faux. La longue mèche basse prouve le contraire d'une domination vendeurs totale. Si les vendeurs avaient tout contrôlé, il n'y aurait pas de mèche basse, la clôture aurait été au plus bas. La mèche basse montre que les acheteurs ont réagi fort.",
            "Correct. Corps rouge = vendeurs gagnants sur la période. Longue mèche basse = les acheteurs ont repoussé les prix depuis les plus bas avec force. Ce n'est pas une domination vendeurs écrasante, il y a eu combat et résistance visible.",
            "Faux. Si la clôture était au plus bas, la mèche basse serait nulle ou inexistante. Ici, la longue mèche basse prouve que le prix est descendu très bas PUIS est remonté avant de clôturer, la clôture est donc au-dessus du plus bas.",
            "Faux. Aucune bougie isolée n'est un signal d'achat ou de vente suffisant. Pour que cette bougie soit un signal, il faudrait qu'elle soit sur un niveau de support important, dans un contexte de tendance favorable. Seule, elle n'indique rien d'actionnable.",
          ],
        },
      },

      // ─── Leçon 4 ────────────────────────────────────────────────────────────
      {
        id: "lecon-4",
        slug: "lecon4",
        title: "Spread, Bid et Ask",
        duration: "8 min",
        introduction:
          "Tu analyses le marché parfaitement. Tu entres au bon moment. Et pourtant, tu es déjà dans le rouge dès la première seconde, sans que le prix ait bougé. Ce n'est pas une erreur. C'est le spread. Et tout trader le paie, sur chaque trade, sans exception.",
        sections: [
          {
            heading: "Bid et Ask : deux prix en permanence",
            body: "Sur n'importe quel marché, il y a toujours deux prix affichés en même temps. Ce n'est pas un bug, c'est le fonctionnement normal du marché. Le Bid, c'est le prix auquel tu peux vendre. L'Ask, c'est le prix auquel tu peux acheter. L'Ask est toujours légèrement plus élevé que le Bid.",
            diagram: "spread",
            items: [
              "BID = prix de vente (le moins élevé des deux)",
              "ASK = prix d'achat (le plus élevé des deux)",
              "Exemple : EUR/USD affiche Bid = 1,0800 / Ask = 1,0804",
              "Si tu achètes maintenant → tu paies 1,0804. Si tu vends maintenant → tu reçois 1,0800.",
            ],
          },
          {
            heading: "Exemple concret : gain et perte avec le spread",
            body: "Cas 1, tu gagnes malgré le spread : Tu achètes EUR/USD à l'Ask (1,0804). Le prix monte à 1,0870. Tu vends au Bid (1,0866). Tu gagnes 1,0866 - 1,0804 = 62 euros pour 1 euro par point. Le spread a réduit ton gain de 4 euros, mais tu restes largement positif.\n\nCas 2, le spread devient problématique : Tu achètes à 1,0804. Le prix ne monte que de 2 points à 1,0806. Tu vends au Bid : 1,0802. Tu perds 2 euros malgré un mouvement dans ton sens. Le spread de 4 points a effacé ton gain et t'a mis en perte.",
            items: [
              "Le spread est payé à l'ENTRÉE, pas à la sortie",
              "Tu commences chaque trade dans le rouge du montant du spread",
              "Pour EUR/USD avec un spread de 4 points : ton trade doit gagner plus de 4 points pour être rentable",
              "Sur de petits objectifs, le spread représente une part significative du gain visé",
            ],
          },
          {
            heading: "Le spread varie selon les conditions",
            body: "Le spread n'est pas fixe. Il dépend de la liquidité du marché, combien d'acheteurs et de vendeurs sont actifs à ce moment. Plus il y a d'activité, plus le spread est serré.",
            table: {
              headers: ["Situation", "Spread typique", "Impact"],
              rows: [
                ["EUR/USD aux heures de pointe (9h–17h)", "1–2 points", "Faible coût d'entrée"],
                ["EUR/USD la nuit (22h–6h)", "4–8 points", "Coût plus élevé"],
                ["Cryptos le week-end", "Très variable", "Peut être très coûteux"],
                ["Paires exotiques (USD/TRY…)", "20–100 points", "Dangereux pour les petits objectifs"],
              ],
            },
          },
          {
            heading: "Erreurs fréquentes des débutants",
            body: "Ces erreurs liées au spread passent souvent inaperçues, jusqu'à ce qu'on réalise pourquoi le compte diminue même sur des trades 'dans le bon sens'.",
            items: [
              "Trader des actifs à spread élevé (paires exotiques, crypto le week-end) sans vérifier le coût",
              "Vouloir gagner 5 euros sur un trade avec 4 euros de spread, le seuil de rentabilité est quasi impossible à atteindre",
              "Trader aux heures creuses ou la nuit sans savoir que le spread s'élargit",
              "Choisir un broker uniquement sur la publicité sans comparer les spreads, 1 point de différence × 100 trades = impact réel sur les résultats",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Trader un actif à fort spread avec un objectif de gain inférieur au spread. Si ton spread est de 20 points et que tu vises un gain de 15 points, tu es en perte avant même que le marché bouge. Calcule toujours le spread avant de choisir ton objectif.",
          },
        ],
        keyPoints: [
          "Bid = prix de vente. Ask = prix d'achat. L'Ask est toujours plus élevé.",
          "Spread = Ask − Bid = le coût payé à chaque trade, dès l'ouverture",
          "Tu commences chaque trade dans le rouge du montant du spread",
          "Le spread est plus faible aux heures de forte activité (Londres 8h–10h, New York 14h–17h)",
          "Ton objectif de gain doit toujours être supérieur au spread, sinon le trade est perdant d'avance",
        ],
        exercise: {
          title: "Observer le spread en conditions réelles",
          steps: [
            "Sur TradingView, ouvre EUR/USD. Cherche l'affichage des prix Bid et Ask (paramètres du graphique).",
            "Note la différence entre Bid et Ask à 10h un jour de semaine, c'est le spread en ce moment.",
            "Reviens voir ce spread à 23h ou un dimanche, est-il plus large ou plus serré ?",
            "Ouvre une paire exotique comme USD/MXN et compare son spread à celui d'EUR/USD.",
          ],
        },
        quiz: {
          question: "EUR/USD : Bid = 1,0800, Ask = 1,0805. Tu ouvres un achat (Long). À quel prix s'exécute ton trade, et de combien es-tu dans le rouge au départ ?",
          answers: [
            "À 1,0800, tu commences à l'équilibre, spread nul",
            "À 1,0802, tu es 2 points dans le rouge",
            "À 1,0805, tu es 5 points dans le rouge immédiatement",
            "Le prix dépend de la taille de ta position",
          ],
          correct: 2,
          explanation:
            "Un achat s'exécute toujours à l'Ask = 1,0805. Le spread = Ask - Bid = 1,0805 - 1,0800 = 5 points. Si tu fermes immédiatement, tu vends au Bid = 1,0800. Tu perds 5 points : c'est le coût d'entrée du trade.",
          answerExplanations: [
            "Faux. Le Bid (1,0800) est le prix auquel tu VENDS, pas celui auquel tu achètes. À l'achat, ton ordre s'exécute à l'Ask (1,0805). Tu démarres donc avec 5 points de déficit, pas à l'équilibre.",
            "Faux. Il n'existe pas de 'prix moyen' entre Bid et Ask pour un ordre au marché. Le marché est binaire : tu achètes à l'Ask ou tu vends au Bid. Ici, l'achat s'exécute à l'Ask = 1,0805, et le spread est de 5 points.",
            "Correct. Un Long s'exécute à l'Ask = 1,0805. Spread = 1,0805 - 1,0800 = 5 points. Si tu fermes immédiatement, tu vends au Bid = 1,0800. Perte = 5 points. C'est le coût d'entrée que tu paies sur chaque trade.",
            "Faux. Le prix d'exécution est toujours l'Ask pour un achat, quelle que soit la taille de la position. La taille de position affecte le montant en euros gagné ou perdu par point, pas le prix auquel l'ordre s'exécute.",
          ],
        },
      },

      // ─── Leçon 5 ────────────────────────────────────────────────────────────
      {
        id: "lecon-5",
        slug: "lecon5",
        title: "Le Stop Loss",
        duration: "10 min",
        introduction:
          "Sans Stop Loss, un seul trade peut ruiner des mois de travail en quelques minutes. Pas parce que tu analyses mal, parce que le marché peut aller beaucoup plus loin que tu ne l'imagines, et rien ne t'arrête. Le Stop Loss est la règle la plus importante du trading.",
        sections: [
          {
            heading: "Qu'est-ce qu'un Stop Loss ?",
            body: "Un Stop Loss (SL), c'est un ordre automatique qui ferme ton trade si le prix va trop loin dans la mauvaise direction. Tu le définis avant d'entrer dans le trade. Quand le prix l'atteint, ta position se ferme seule, que tu sois devant l'écran ou non.",
            items: [
              "Trade Long (achat) : ton SL se place EN DESSOUS de ton prix d'entrée",
              "Trade Short (vente) : ton SL se place AU DESSUS de ton prix d'entrée",
              "Quand le prix atteint le SL, le trade se ferme automatiquement",
              "Tu perds exactement le montant prévu, pas un euro de plus",
            ],
          },
          {
            heading: "Exemple concret : avec et sans Stop Loss",
            body: "Cas 1, avec Stop Loss : Tu achètes Bitcoin à 30 000 €. Tu places un SL à 28 500 €. Le marché chute à 28 500 €. Ton SL se déclenche. Tu perds 1 500 € par Bitcoin. Il te reste 98,5% de ton capital. Tu continues à trader.\n\nCas 2, sans Stop Loss : Tu achètes Bitcoin à 30 000 €. Pas de SL. Le soir, une mauvaise nouvelle fait chuter le Bitcoin à 22 000 €. Tu te réveilles avec une perte de 8 000 € par Bitcoin, 27% de ton capital parti en une nuit. Sans que tu aies pu réagir.",
            diagram: "stoploss",
            items: [
              "Avec SL : la perte est limitée et connue à l'avance",
              "Sans SL : la perte peut être illimitée, le marché n'attend pas que tu sois prêt",
              "Les traders sans SL pensent toujours 'le prix va revenir', parfois oui, parfois non. Et le 'non' détruit le compte.",
            ],
          },
          {
            heading: "Où placer son Stop Loss ?",
            body: "Un bon SL ne se place pas au hasard. Il se place à un endroit logique sur le graphique, là où ton analyse serait clairement fausse si le prix l'atteignait.",
            items: [
              "Long : SL juste en dessous du dernier point bas significatif (le support)",
              "Short : SL juste au-dessus du dernier point haut significatif (la résistance)",
              "Exemple : tu achètes au rebond d'un support à 30 000 €. Le dernier point bas est à 29 200 €. Ton SL va à 29 100 €.",
              "Règle : si le prix atteint mon SL, mon analyse était fausse. La perte est normale.",
            ],
          },
          {
            heading: "Erreurs fréquentes des débutants",
            body: "Ces erreurs autour du Stop Loss sont les plus destructrices en trading. Elles agissent parfois silencieusement, jusqu'au jour où elles détruisent le compte.",
            items: [
              "Ne pas mettre de SL 'pour laisser une chance au trade', c'est la cause n°1 de comptes détruits chez les débutants",
              "SL trop serré : 3 euros de SL sur Bitcoin, le marché fluctue normalement de 100-200 euros, tu seras sorti sans raison",
              "SL placé au hasard ('50 euros parce que ça me semble bien'), le SL doit correspondre à un niveau logique sur le graphique",
              "Oublier de placer le SL au moment d'entrer en pensant 'je le mets juste après', et ne jamais le mettre",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Déplacer le Stop Loss dans le mauvais sens pour éviter d'être stoppé. Ton trade perd, tu es à -500 €. Tu éloignes le SL pour 'lui laisser une chance'. Le trade continue à perdre. Tu éloignes encore. Au final, tu perds 5 ou 10 fois plus que ce que tu avais prévu. Cette erreur, commise sous l'émotion, est responsable de la destruction de milliers de comptes de traders débutants.",
          },
        ],
        keyPoints: [
          "Stop Loss = ordre automatique qui limite ta perte à un montant défini à l'avance",
          "Long : SL en dessous de l'entrée. Short : SL au-dessus de l'entrée.",
          "Sans SL, ta perte est potentiellement illimitée, c'est un risque inacceptable",
          "Place le SL à un endroit logique sur le graphique, pas au hasard",
          "Ne déplace JAMAIS le SL dans le sens de la perte, c'est l'erreur fatale",
        ],
        exercise: {
          title: "Identifier des placements de Stop Loss logiques",
          steps: [
            "Sur TradingView, ouvre Bitcoin (BTC/USD) en H1",
            "Repère le dernier mouvement haussier. Identifie le dernier point bas avant cette hausse.",
            "Si tu achetais au prix actuel, ton SL irait juste en dessous de ce point bas. Note le prix exact.",
            "Calcule la différence en euros entre ce SL et le prix actuel. C'est le risque maximum de ce trade.",
          ],
        },
        quiz: {
          question: "Tu achètes Bitcoin à 30 000 €. Le dernier point bas sur le graphique est à 29 000 €. Où places-tu ton Stop Loss ?",
          answers: [
            "À 31 000 €, au-dessus de l'entrée pour ne pas perdre d'argent",
            "À 29 950 €, juste 50 € sous l'entrée, pour minimiser la perte",
            "À 28 900 €, juste sous le point bas logique, là où ton analyse serait fausse",
            "Pas de Stop Loss, le Bitcoin finit toujours par remonter",
          ],
          correct: 2,
          explanation:
            "Le SL d'un Long va en dessous de l'entrée, à un niveau logique. Le dernier point bas à 29 000 € est le niveau qui invalide ton scénario haussier. En plaçant le SL à 28 900 € (juste en dessous), si le prix y arrive, ton analyse était fausse. La perte = 1 100 € par Bitcoin, connue et acceptée à l'avance.",
          answerExplanations: [
            "Faux. Un SL au-dessus de l'entrée sur un Long ferme la position quand le prix monte, quand tu gagnes. C'est complètement inversé. Le SL d'un Long va toujours EN DESSOUS de l'entrée pour te protéger d'une baisse.",
            "Faux. 50 € de SL sur Bitcoin, c'est beaucoup trop serré. Bitcoin fluctue normalement de plusieurs centaines d'euros par heure. Tu seras sorti automatiquement par le simple bruit du marché, avant même que le trade puisse se développer.",
            "Correct. Le SL logique se place juste sous le niveau qui invalide ton analyse. Le point bas à 29 000 € est ce niveau. À 28 900 €, si le prix y arrive, la structure haussière est brisée, tu avais tort. La perte est de 1 100 € : définie et acceptée dès le départ.",
            "Faux. 'Le Bitcoin finit toujours par remonter' est vrai sur 10 ans, mais sur une position ouverte sans SL, une chute de 30% peut arriver en quelques jours. Sans SL, 30% de perte sur une position = potentiellement tout le capital engagé. Un SL n'empêche pas le rebond, il limite la perte si le rebond tarde trop.",
          ],
        },
      },

      // ─── Leçon 6 ────────────────────────────────────────────────────────────
      {
        id: "lecon-6",
        slug: "lecon6",
        title: "Le Take Profit",
        duration: "9 min",
        introduction:
          "Tu es en trade, tu es en profit, et tu regardes. Le prix monte encore. Tu gardes. Il redescend. Tu gardes encore 'parce qu'il va remonter'. Il continue de baisser et efface tout ton gain. C'est l'un des scénarios les plus frustrants du trading. Le Take Profit l'évite.",
        sections: [
          {
            heading: "Le principe, en une phrase",
            body: "Un Take Profit (TP), c'est un ordre automatique qui ferme ton trade dès que le prix atteint l'objectif que tu as fixé. Tu définis cet objectif avant d'entrer, le broker exécute tout seul quand le prix y arrive, que tu sois devant l'écran ou non.",
            diagram: "takeprofit",
            items: [
              "Long : ton TP est placé AU-DESSUS de ton prix d'entrée",
              "Short : ton TP est placé EN-DESSOUS de ton prix d'entrée",
              "Exemple : tu achètes Bitcoin à 78 000 $. Tu places un TP à 84 000 $.",
              "Quand le Bitcoin touche 84 000 $, le trade se ferme tout seul à ton objectif, le prix aura parcouru 6 000 $ en ta faveur",
            ],
          },
          {
            heading: "Exemple concret : avec et sans Take Profit",
            body: "Cas 1, avec Take Profit : Tu achètes Bitcoin à 78 000 $. Tu places un TP à 84 000 $. Le prix monte jusqu'à 84 000 $. Le trade se ferme automatiquement à ton objectif : le prix a parcouru 6 000 $ en ta faveur. Même si le prix redescend ensuite à 73 000 $, ta sortie est déjà actée, le mouvement est sécurisé.\n\nCas 2, sans Take Profit : Tu achètes Bitcoin à 78 000 $. Le prix monte à 84 000 $. Tu regardes et tu gardes 'parce que ça monte encore'. Le prix redescend à 75 000 $. Tu paniques et tu fermes. À cet instant, le prix est repassé 3 000 $ SOUS ton entrée, alors qu'il avait été 6 000 $ AU-DESSUS.",
            items: [
              "Avec TP : ta sortie se déclenche automatiquement à l'objectif, sans émotion",
              "Sans TP : l'émotion décide quand sortir, presque toujours au mauvais moment",
              "Sans TP, un prix qui était 6 000 $ au-dessus de ton entrée peut repasser en dessous",
            ],
          },
          {
            heading: "Le ratio Risque / Récompense (R/R)",
            body: "Le R/R compare deux distances : celle qui sépare ton entrée de ton Stop Loss (le risque), et celle qui sépare ton entrée de ton Take Profit (l'objectif). C'est un rapport, il ne dépend pas de la taille de ta position. C'est la métrique la plus importante en gestion du risque : elle détermine si ta stratégie est rentable sur le long terme, indépendamment de ton taux de réussite.",
            table: {
              headers: ["Ratio R/R", "Exemple concret", "Ce que ça permet"],
              rows: [
                ["1:1", "Stop à 3 000 $, objectif à 3 000 $", "Il faut gagner 1 trade sur 2 pour être rentable"],
                ["1:2", "Stop à 3 000 $, objectif à 6 000 $", "Tu peux perdre 2 trades sur 3 et rester positif"],
                ["1:3", "Stop à 3 000 $, objectif à 9 000 $", "Tu peux perdre 3 trades sur 4 et rester positif"],
              ],
            },
          },
          {
            heading: "Erreurs fréquentes des débutants",
            body: "Ces erreurs sur le Take Profit transforment des trades gagnants en trades nuls ou perdants.",
            items: [
              "Fermer le trade trop tôt par peur : le prix n'a parcouru que 1 500 $ en ta faveur, tu fermes. Ensuite il en parcourt 4 500 $.",
              "TP trop ambitieux : viser un R/R de 1:10 sur chaque trade, le TP n'est presque jamais atteint.",
              "Ne pas avoir de TP du tout : 'je verrai quand sortir.' Résultat : une position gagnante qui devient perdante.",
              "Déplacer le TP en cours de route : le prix approche du TP, tu le déplaces plus loin 'parce que ça monte bien'. L'émotion reprend le contrôle.",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Ne pas avoir de Take Profit et laisser une position gagnante ouverte indéfiniment. Le marché ne monte jamais en ligne droite. Sans TP, tu regardes le prix s'éroder depuis son point haut : il était 6 000 $ au-dessus de ton entrée, puis 4 500 $, puis 2 500 $, puis 800 $. Tu attends le rebond. Le rebond ne vient pas. Le prix repasse 3 000 $ sous ton entrée. Un trade qui était excellent devient perdant, uniquement parce qu'il n'y avait pas d'ordre pour figer la sortie au bon niveau.",
          },
        ],
        keyPoints: [
          "Take Profit = ordre automatique qui ferme ton trade quand le prix atteint ton objectif",
          "Long : TP au-dessus de l'entrée. Short : TP en dessous de l'entrée.",
          "Place le TP juste AVANT la prochaine résistance (Long) ou le prochain support (Short)",
          "Ratio R/R minimum recommandé : 1:2, ton objectif est 2 fois plus loin de ton entrée que ton Stop Loss",
          "Définir ton TP avant d'entrer dans le trade, jamais en cours de route sous l'émotion",
        ],
        exercise: {
          title: "Calculer un Take Profit avec un bon ratio R/R",
          steps: [
            "Sur TradingView, ouvre Bitcoin (BTC/USD) en H1. Note le prix actuel.",
            "Identifie la prochaine résistance au-dessus du prix actuel, note ce niveau.",
            "Imagine une entrée Long au prix actuel avec un SL placé 3 000 $ en dessous. Pour un R/R de 1:2, ton TP doit être 6 000 $ au-dessus (2 fois la distance du stop).",
            "La prochaine résistance identifiée est-elle au-delà de ce TP ? Si oui, le setup a un bon potentiel.",
          ],
        },
        quiz: {
          question: "Tu achètes Bitcoin à 78 000 $. Ton Stop Loss est à 75 000 $, soit 3 000 $ sous ton entrée. Pour un ratio R/R de 1:2, où places-tu ton Take Profit ?",
          answers: [
            "À 79 500 $, l'objectif est à 1 500 $, le stop à 3 000 $",
            "À 81 000 $, objectif et stop à la même distance (ratio 1:1)",
            "À 84 000 $, l'objectif est à 6 000 $, soit 2 fois la distance du stop",
            "Le plus haut possible pour maximiser le gain",
          ],
          correct: 2,
          explanation:
            "Ratio 1:2 = ton objectif est 2 fois plus loin que ton stop. Le Stop Loss est à 3 000 $ sous l'entrée ; le Take Profit doit donc être à 6 000 $ au-dessus : 78 000 + 6 000 = 84 000 $. Le gain ou la perte en argent dépend ensuite de la taille de ta position (voir Leçon 8), mais le ratio, lui, reste 1:2 quelle que soit cette taille. Avec ce ratio, tu peux perdre 2 trades sur 3 et rester profitable sur le long terme.",
          answerExplanations: [
            "Faux. Un objectif à 1 500 $ pour un stop à 3 000 $, c'est un ratio 1:0,5 : ton objectif est 2 fois plus proche que ton stop. Même avec 70 % de trades gagnants, une stratégie avec ce ratio est perdante sur le long terme.",
            "Faux. Objectif et stop à la même distance = ratio 1:1. Ce n'est pas suffisant : il faudrait gagner plus d'un trade sur deux pour être rentable, difficile à tenir durablement.",
            "Correct. Un objectif à 6 000 $ pour un stop à 3 000 $ = ratio 1:2. C'est le minimum recommandé pour une stratégie saine : avec ce ratio, 34 % de trades gagnants suffisent pour être en profit global.",
            "Faux. Viser 'le plus haut possible' sans niveau défini, c'est trader sans plan. Un TP trop éloigné n'est presque jamais atteint, tu regardes le prix monter, toucher ta zone, puis redescendre sans que ta sortie ait été déclenchée.",
          ],
        },
      },

      // ─── Leçon 7 ────────────────────────────────────────────────────────────
      {
        id: "lecon-7",
        slug: "lecon7",
        title: "Le Break Even",
        duration: "8 min",
        introduction:
          "Tu es en trade, le prix a parcouru une belle distance en ta faveur, tu te détends. Le marché fait une correction, revient en arrière, et efface toute ton avance. Le trade se ferme sur ton Stop Loss initial, tu sors en perte alors que le prix était largement en ta faveur peu avant. C'est évitable. C'est ça que le Break Even corrige.",
        sections: [
          {
            heading: "Le principe, en une phrase",
            body: "Le Break Even (BE), c'est déplacer ton Stop Loss à ton prix d'entrée exact. Si le prix revient en arrière, tu sors à zéro, ni gain, ni perte. Si le prix continue dans ton sens, tu restes en course. Ton trade ne peut plus se solder par une perte.",
            diagram: "breakeven",
            items: [
              "Tu achètes Bitcoin à 78 000 $ avec un SL initial à 75 000 $",
              "Le Bitcoin monte à 81 000 $, le prix a parcouru 3 000 $ en ta faveur, soit la distance exacte de ton risque (1R)",
              "Tu déplaces ton SL de 75 000 $ à 78 000 $ (ton prix d'entrée), c'est le Break Even",
              "Maintenant : si le Bitcoin redescend à 78 000 $, tu sors à zéro. S'il continue de monter, tu restes en course.",
            ],
          },
          {
            heading: "Exemple concret : avec et sans Break Even",
            body: "Cas 1, avec Break Even : Tu achètes Bitcoin à 78 000 $, SL à 75 000 $. Le prix monte à 81 000 $, il a parcouru 3 000 $ en ta faveur, soit 1R. Tu actives le BE (SL → 78 000 $). Le marché fait une correction et redescend à 78 000 $. Sortie automatique : tu sors exactement à ton prix d'entrée, ni gain ni perte. Et si le prix avait continué jusqu'à 84 000 $, tu serais resté en course pour un mouvement de 6 000 $ en ta faveur.\n\nCas 2, sans Break Even : Même trade. Le Bitcoin monte à 81 000 $. Tu ne touches rien. Le marché redescend brutalement à 73 500 $. Ton SL d'origine à 75 000 $ se déclenche, le prix finit 3 000 $ SOUS ton entrée, alors qu'il avait été 3 000 $ AU-DESSUS.",
            items: [
              "Avec BE : le trade ne peut plus se solder par une perte une fois activé",
              "Sans BE : un prix qui était 3 000 $ au-dessus de ton entrée peut repasser 3 000 $ en dessous",
              "Le BE te libère du stress, tu peux attendre ton TP sereinement",
            ],
          },
          {
            heading: "Quand activer le Break Even ?",
            body: "Le timing est crucial. Trop tôt, le marché te sort sur une simple fluctuation normale. Au bon moment, le BE te protège vraiment. La règle : attends que le prix ait parcouru au moins 1R en ta faveur, c'est-à-dire la distance qui sépare ton entrée de ton Stop Loss.",
            table: {
              headers: ["Distance entrée → SL", "Activer le BE quand…", "Pourquoi"],
              rows: [
                ["2 000 $", "le prix a parcouru 2 000 $ en ta faveur", "1R atteint, la protection devient logique"],
                ["3 000 $", "le prix a parcouru 3 000 $ en ta faveur", "Avant ça, une fluctuation normale te sortirait"],
                ["Peu importe", "le prix n'a pas encore parcouru 1R → attends", "Trop tôt : le marché fluctue, tu sortirais inutilement"],
              ],
            },
          },
          {
            heading: "Erreurs fréquentes des débutants",
            body: "Ces erreurs sur le Break Even font rater des trades gagnants ou créent une fausse impression de sécurité.",
            items: [
              "Activer le BE trop tôt : le prix n'a parcouru que 200 $ en ta faveur alors que ton risque est de 3 000 $, la moindre fluctuation te sort à zéro",
              "Ne jamais activer le BE : tu subis des retournements complets sur des trades qui étaient largement gagnants",
              "Confondre BE et prise de profit partielle : le BE = sécuriser le risque (zéro perte), pas encaisser un gain",
              "Croire que le BE garantit un profit : non, le BE garantit zéro perte. Le profit dépend toujours du TP.",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Activer le Break Even trop tôt sous le stress. Le prix n'a parcouru que 800 $ en ta faveur, alors que ton risque (distance entrée → SL) est de 3 000 $. Tu paniques à l'idée de tout reperdre. Tu déplaces ton SL à ton prix d'entrée. Le marché fluctue normalement, repasse brièvement sous ton entrée, déclenche ton BE, tu sors à zéro. Ensuite, le prix monte de 6 000 $. Tu regardes le trade faire exactement ce que tu avais prévu, sans toi. L'impatience t'a sorti d'un trade gagnant.",
          },
        ],
        keyPoints: [
          "Break Even = déplacer le Stop Loss au prix d'entrée → plus aucun risque de perte",
          "Activer le BE quand le prix a parcouru au moins 1R en ta faveur, 1R = la distance entre ton entrée et ton Stop Loss",
          "Trop tôt = le marché te sort sur une simple fluctuation normale",
          "Un trade en BE peut sortir à zéro ou continuer à gagner, jamais perdre",
          "Le BE ne remplace pas un bon TP, c'est une protection supplémentaire",
        ],
        exercise: {
          title: "Simuler le Break Even sur des trades historiques",
          steps: [
            "Sur TradingView, ouvre Bitcoin (BTC/USD) en H1. Repère un trade Long que tu aurais pu ouvrir il y a 2 semaines.",
            "Note l'entrée et le SL logique (juste sous le dernier point bas). Mesure la distance entre les deux : c'est ton 1R.",
            "À quel moment le prix avait-il parcouru +1R en ta faveur (la distance que tu viens de mesurer) ? Note ce niveau, c'est là que tu aurais activé le BE.",
            "Qu'aurait donné le BE activé à ce moment : sortie à zéro ou continuation en profit ?",
          ],
        },
        quiz: {
          question: "Tu achètes Bitcoin à 78 000 $ avec un SL à 75 000 $. Le prix monte à 81 000 $. Que fais-tu ?",
          answers: [
            "Tu actives le Break Even : tu déplaces ton SL de 75 000 $ à 78 000 $",
            "Tu gardes le SL à 75 000 $, il ne faut jamais déplacer un SL",
            "Tu fermes le trade à 81 000 $ tout de suite, pour ne plus rien risquer",
            "Tu déplaces le SL à 78 900 $ pour verrouiller une partie du mouvement",
          ],
          correct: 0,
          explanation:
            "À 81 000 $, le prix a parcouru 3 000 $ en ta faveur, exactement la distance entre ton entrée et ton SL, soit 1R. C'est le bon moment pour activer le BE : tu déplaces le SL de 75 000 $ à 78 000 $. À partir de là, le trade ne peut plus se solder par une perte, et si le prix continue vers ton TP, tu restes en course. Le montant en argent, lui, dépend de la taille de ta position (voir Leçon 8).",
          answerExplanations: [
            "Correct. Le prix a parcouru 3 000 $ en ta faveur = exactement 1R (la distance entrée → SL). Tu déplaces le SL de 75 000 $ à 78 000 $. Le trade ne peut plus se solder par une perte : si le prix revient à 78 000 $, sortie à zéro ; s'il continue de monter, tu restes en course.",
            "Faux. Il est parfaitement valide, et même recommandé, de déplacer le SL dans le sens favorable. La règle est de ne jamais déplacer le SL dans le sens de la PERTE. Ici, tu le déplaces vers ton prix d'entrée pour te protéger.",
            "Faux. Fermer à 81 000 $ verrouille le mouvement déjà acquis, mais tu renonces à un éventuel prolongement vers 84 000 $ ou plus. Activer le BE te permet de rester dans le trade sans plus aucun risque de perte, c'est souvent le meilleur choix.",
            "Faux. Déplacer le SL à 78 900 $ (900 $ au-dessus de l'entrée) est une technique appelée 'trailing stop partiel'. C'est différent du Break Even standard, qui place le SL exactement au prix d'entrée. Le risque ici : se faire sortir sur une simple fluctuation normale de 900 $.",
          ],
        },
      },

      // ─── Leçon 8 ────────────────────────────────────────────────────────────
      {
        id: "lecon-8",
        slug: "lecon8",
        title: "Gestion du risque : le money management",
        duration: "12 min",
        introduction:
          "Un seul trade peut ruiner des semaines entières de travail. Pas parce que l'analyse était mauvaise, parce que le risque était trop élevé. Mais le risque adapté à quel capital ? La plupart des guides parlent de '1% par trade' pour des comptes de 5 000 €+. Si tu démarres avec 300 ou 700 €, tu as besoin d'une grille différente.",
        sections: [
          {
            heading: "Ce que personne ne te dit sur le '1%'",
            body: "Le money management, c'est ce qui sépare les traders qui survivent de ceux qui grillent leur compte en 2 mois. La règle d'or : ne JAMAIS risquer plus que ce que ton capital permet. La règle théorique '1% par trade' est faite pour les comptes de 5 000 €+. En dessous, 1% = 2 à 10 € de risque, un montant souvent inférieur au risque minimum que génèrent les lots disponibles sur les paires majeures.",
            items: [
              "Les lots minimum sur Forex génèrent souvent 10 à 20 € de risque même avec un Stop Loss serré",
              "Capital de 300 € → 1% = 3 € de risque max. Inapplicable avec les lots standard.",
              "La solution : adapter ton % de risque à ta tranche de capital, pas appliquer une règle générique",
              "Le risque = montant que tu perds si ton Stop Loss se déclenche",
            ],
          },
          {
            heading: "La grille adaptée au retail",
            body: "Voici la grille de référence : adapte ton risque par trade à ton capital réel. Le % baisse à mesure que le capital monte, parce que tu as plus à protéger.",
            table: {
              headers: ["Capital de départ", "Risque par trade", "Exemple concret"],
              rows: [
                ["200 – 500 €", "5 %", "10 – 25 € max par trade"],
                ["500 – 1 000 €", "3 %", "15 – 30 € max par trade"],
                ["1 000 – 5 000 €", "2 %", "20 – 100 € max par trade"],
                ["5 000 € et +", "0,5 – 2 %", "25 – 100 €+ par trade"],
              ],
            },
            note: "La règle 1% que tu liras partout est techniquement correcte pour les comptes 5 000 €+. Sur un petit compte (200–1 000 €), 1% = 2 à 10 € de risque, souvent inapplicable en pratique car le lot minimum génère déjà plus. Adapter ton % n'est pas tricher : c'est s'aligner sur la réalité des lots disponibles.",
          },
          {
            heading: "Les chiffres en pratique",
            body: "Voici comment calculer ton risque max avec la grille :",
            items: [
              "Capital 300 €, idéal 3% (9 €), max 5% (15 €) par trade",
              "Capital 500 €, idéal 2-3% (12-15 €), max 5% (25 €) par trade",
              "Capital 1 000 €, idéal 2-3% (20-30 €), max 3% (30 €) par trade",
              "Capital 2 000 €, 2% (40 €) par trade (idéal = max)",
            ],
            diagram: "risk",
          },
          {
            heading: "Pourquoi le sur-risque détruit les comptes",
            body: "Imagine 10 mauvais trades d'affilée. C'est une série normale, même les meilleurs traders traversent des séries de pertes. Voici ce qu'il reste de ton capital selon le risque par trade.",
            table: {
              headers: ["Risque par trade", "Capital restant après 10 pertes consécutives"],
              rows: [
                ["1%", "90,4 %, tu continues à trader calmement"],
                ["2%", "81,7 %, encore gérable"],
                ["5%", "59,9 %, moral en berne, erreurs qui s'accumulent"],
                ["10%", "34,9 %, très difficile de se relever"],
                ["20%", "10,7 %, compte quasi détruit"],
              ],
            },
          },
          {
            heading: "Erreurs fréquentes des débutants",
            body: "Ces erreurs de gestion du risque sont les plus destructrices, elles agissent en silence jusqu'au moment où tout s'effondre.",
            items: [
              "Risquer plus après une victoire : 'J'ai bien tradé, je peux me permettre de risquer davantage.' C'est l'overconfidence, elle précède toujours les grosses pertes.",
              "Risquer plus après une perte pour récupérer : exactement l'inverse de ce qu'il faut faire.",
              "Ne pas calculer la taille de position et 'estimer à vue' : une erreur de calibrage peut doubler ou tripler le risque réel.",
              "Ignorer le spread dans le calcul : le spread s'ajoute à la perte potentielle, il faut en tenir compte.",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Doubler sa mise après une série de pertes pour 'se refaire' plus vite. Exemple : compte de 1 000 €, risque à 3%. Tu perds 3 trades → -30 € × 3 = -90 €. Il te reste 910 €. Tu te dis : 'Je risque 10% sur le prochain pour récupérer d'un coup.' Tu perds ce trade aussi. -91 € de plus. Total : -181 € en 4 trades au lieu de -90 € en suivant la grille. Multiplier le risque après des pertes, c'est le chemin le plus rapide vers le compte à zéro.",
          },
        ],
        keyPoints: [
          "Adapte ton % de risque à ton capital : 200-500 € → 5%, 500-1000 € → 3%, 1000-5000 € → 2%",
          "Calcule ton risque en euros AVANT d'entrer : Capital × % adapté = montant maximum à perdre",
          "Avec 3% de risque, 10 pertes consécutives = 74% du capital intact. Tu peux rebondir.",
          "Ratio R/R recommandé : 1:2 minimum, viser 2 fois ce qu'on risque",
          "Ne jamais augmenter le risque pour 'récupérer', c'est le chemin vers le compte à zéro",
        ],
        exercise: {
          title: "Calculer ton risque adapté à ton capital",
          steps: [
            "Note ton capital de démo (ou le capital que tu prévois d'utiliser). Identifie ta tranche dans la grille : 200-500 € → 5%, 500-1000 € → 3%, 1000-5000 € → 2%.",
            "Calcule ton risque maximum par trade. Exemple : 700 € × 3% = 21 € maximum par trade.",
            "Sur TradingView (EUR/USD, H1), identifie un setup Long. Où mettras-tu ton Stop Loss ? Estime la perte en euros si le SL se déclenche avec 0,1 lot.",
            "Compare ce montant à ton risque adapté. Si tu dépasses ton max, réduis la taille de position jusqu'à respecter le montant calculé.",
          ],
        },
        quiz: {
          question: "Tu as un capital de 700 €. Quelle est la bonne application de la grille de risque ?",
          answers: [
            "1% de 700 € = 7 €, la règle universelle s'applique toujours",
            "3% de 700 € = 21 €, adapté à la tranche 500-1 000 €",
            "5% de 700 € = 35 €, pour maximiser les gains sur petit capital",
            "10% de 700 € = 70 €, acceptable si le setup est 'sûr'",
          ],
          correct: 1,
          explanation:
            "700 € se situe dans la tranche 500-1 000 € → 3% de risque par trade = 21 € maximum. La règle 1% est conçue pour les comptes 5 000 €+, avec 700 €, 1% = 7 €, souvent inférieur au risque généré par le lot minimum disponible sur les paires majeures.",
          answerExplanations: [
            "Faux. La règle 1% s'applique aux comptes de 5 000 €+. Sur 700 €, 1% = 7 €, souvent inapplicable car les lots minimum génèrent 10-20 € de risque sur les paires majeures.",
            "Correct. 700 € est dans la tranche 500-1 000 €, donc 3% de risque par trade = 21 €. C'est le % adapté qui te permet d'exécuter correctement tes ordres tout en protégeant ton capital.",
            "Faux. 5% est adapté à la tranche 200-500 €. Avec 700 €, tu es dans la tranche supérieure (3%). Utiliser 5% sur 700 € reviendrait à sur-risquer.",
            "Faux. 10% par trade = compte détruit en quelques séries de pertes normales. Il n'existe pas de trade certain.",
          ],
        },
      },

      // ─── Leçon 9 ────────────────────────────────────────────────────────────
      {
        id: "lecon-9",
        slug: "lecon9",
        title: "Les erreurs des débutants",
        duration: "11 min",
        introduction:
          "Les débutants qui perdent leur compte ne font presque jamais d'erreurs d'analyse. Ils font des erreurs de comportement. Les mêmes erreurs, répétées par presque tout le monde, dans le même ordre. Cette leçon te les montre avant que tu les fasses.",
        sections: [
          {
            heading: "Le principe, en une phrase",
            body: "La plupart des comptes ne sont pas détruits par de mauvaises analyses, ils sont détruits par de mauvaises décisions prises sous l'émotion. Reconnaître ces erreurs à l'avance est la première ligne de défense.",
            items: [
              "Les erreurs comportementales coûtent plus cher que les erreurs d'analyse",
              "Ces erreurs sont universelles, expérimentés et débutants en font tous",
              "Les connaître ne suffit pas, il faut les avoir vécues sur compte démo pour vraiment les éviter",
              "Un journal de trading est le seul outil qui permet de les repérer et de corriger",
            ],
          },
          {
            heading: "Les 5 erreurs qui détruisent les comptes",
            body: "Ces erreurs ne semblent pas dangereuses sur le moment. C'est exactement pour ça qu'elles font autant de dégâts.",
            items: [
              "1. Trader sans Stop Loss — 'Je surveille le trade.' Une annonce économique, une connexion perdue, et tu perds 40% du compte en 10 minutes.",
              "2. Sur-trader, ouvrir 15 trades par jour parce que tu t'ennuies. Plus de trades = plus de spreads payés = compte qui fond lentement.",
              "3. Risquer trop, 10, 20% du capital sur un trade 'certain'. Il n'existe pas de trade certain. Une série de 3 pertes à 20% = 49% du compte perdu.",
              "4. Ne pas respecter son plan, entrer trop tôt, déplacer le SL, fermer le TP à mi-chemin. L'émotion reprend le contrôle.",
              "5. Trader directement avec de l'argent réel, sans s'être entraîné sur compte démo. Le stress de l'argent réel change tout.",
            ],
          },
          {
            heading: "Les pièges psychologiques",
            body: "Le trading ne teste pas seulement ton analyse, il teste ta psychologie. Ces biais frappent tous les traders, même les expérimentés. Les connaître aide à les repérer au bon moment.",
            diagram: "errors",
          },
          {
            heading: "À quoi ressemble chaque biais en pratique",
            body: "Voici les 4 scénarios typiques que tu dois apprendre à reconnaître sur le graphique avant qu'ils ne te coûtent cher.",
            diagram: "biaschart",
            table: {
              headers: ["Biais", "Ce qui se passe", "Conséquence typique"],
              rows: [
                ["FOMO", "Le marché monte fort, tu achètes en urgence", "Tu achètes au sommet, juste avant le retournement"],
                ["Vengeance trading", "Tu perds un trade, tu ré-ouvres immédiatement", "Tu perds encore plus, avec moins de lucidité"],
                ["Ancrage", "Tu refuses de fermer un trade perdant", "La perte double, tu fermes au pire moment"],
                ["Overconfidence", "5 trades gagnants d'affilée, tu te sens invincible", "Tu doubles les lots, le prochain trade efface tout"],
              ],
            },
          },
          {
            heading: "Erreurs fréquentes sur cette dernière leçon",
            body: "Il y a une erreur spécifique à cette étape du parcours : lire ces erreurs, hocher la tête, et penser qu'elles ne s'appliquent pas à toi.",
            items: [
              "Penser 'je ne ferai pas ces erreurs', si tu ne les expérimentes pas sur compte démo, tu les feras sur compte réel",
              "Ignorer le journal de trading parce que 'ça prend du temps', c'est exactement ce qui sépare les traders qui progressent des autres",
              "Passer au compte réel trop tôt : 3 semaines de démo ne suffisent pas. La discipline ça se construit.",
              "Sous-estimer la psychologie : la gestion des émotions est aussi importante, voire plus, que la stratégie technique",
            ],
          },
          {
            heading: "L'erreur fatale",
            body: "Passer au compte réel après seulement 2 semaines de démo parce que 'ça se passe bien'. En démo, tu prends de bonnes décisions parce qu'il n'y a pas d'enjeu. En réel, à la première perte de 100 €, ta psychologie change complètement. Tu paniques. Tu fermes trop tôt. Tu déplaces ton Stop Loss. Tu ouvres par vengeance. Tout ce que tu avais appris disparaît sous la pression de l'argent réel. Minimum 1 mois de démo rentable, sans exception.",
          },
        ],
        keyPoints: [
          "Stop Loss obligatoire sur chaque trade, sans exception, sans justification",
          "Adapte ton % de risque à ton capital (cf. leçon 8), jamais sur-risquer même sur un trade 'sûr'",
          "S'entraîner sur compte démo avant de passer à l'argent réel, minimum 1 mois",
          "Tenir un journal de trading, c'est le seul outil qui permet de vraiment progresser",
          "Si tu perds 2 trades d'affilée : arrête-toi, analyse, reprends frais le lendemain",
        ],
        exercise: {
          title: "Préparer ton plan de discipline personnelle",
          steps: [
            "Écris tes 3 règles non-négociables : par exemple 'Stop Loss obligatoire, risque adapté à mon capital (cf. grille leçon 8), jamais entrer sur le FOMO'",
            "Définis ta règle de stop journalier : à quel % de perte tu t'arrêtes pour la journée ?",
            "Ouvre un compte démo sur MetaTrader 5 si ce n'est pas encore fait. Commence à appliquer ces règles maintenant.",
            "Passe tes 5 prochains trades sur compte démo. Pour chaque trade, note : entrée, SL, TP, résultat, et comment tu t'es senti pendant le trade.",
          ],
        },
        quiz: {
          question: "Tu viens de perdre deux trades d'affilée. Tu es stressé. Quelle est la réaction la plus disciplinée ?",
          answers: [
            "Ouvrir immédiatement un troisième trade pour récupérer les pertes",
            "Augmenter ta taille de position pour compenser les pertes plus vite",
            "S'arrêter, analyser les deux trades dans ton journal, reprendre le lendemain",
            "Passer sans Stop Loss pour avoir plus de flexibilité",
          ],
          correct: 2,
          explanation:
            "Deux pertes consécutives dans un état de stress, c'est le terrain idéal pour le vengeance trading. La réaction disciplinée : s'arrêter complètement, analyser pourquoi tu as perdu (erreur de plan ? mauvais timing ? émotion ?), et reprendre frais le lendemain. Le marché sera encore là demain.",
          answerExplanations: [
            "Faux. Ouvrir un trade immédiatement après deux pertes pour 'récupérer', c'est la définition du vengeance trading. Tu prends une décision émotionnelle sous stress, pas analytique. Les chances de perdre encore sont statistiquement bien plus élevées dans cet état.",
            "Faux. Augmenter la taille de position après des pertes est exactement l'inverse de ce qu'il faut faire. Tu es dans le pire état émotionnel possible. Si tu perds encore avec une taille augmentée, les dégâts sont exponentiellement plus importants.",
            "Correct. S'arrêter et analyser dans le journal : les deux trades suivaient-ils le plan ? Y avait-il des erreurs d'exécution ? C'est calme, c'est factuel, et c'est ce qui permet de progresser. Reprendre demain, reposé, avec un plan clair.",
            "Faux. Enlever le Stop Loss après des pertes dans un état de stress, c'est la décision la plus dangereuse possible. Tu augmentes ton exposition au risque au moment où tu es le moins en état de gérer une mauvaise situation.",
          ],
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NIVEAU INTERMÉDIAIRE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    level: "intermediaire",
    title: "Lire le marché comme un pro",
    promise: "Structure, zones institutionnelles et logique de prix, passer de spectateur à trader structuré.",
    lessons: [

      // ─── Leçon 1 ─────────────────────────────────────────────────────────
      {
        id: "lecon-1",
        slug: "lecon1",
        title: "Structure de marché : BOS & CHoCH",
        duration: "20 min",
        introduction:
          "Les marchés ne montent et ne descendent pas au hasard. Ils laissent des traces visibles, des structures. Apprendre à les lire, c'est savoir où le marché veut aller avant que tout le monde s'en rende compte.",
        sections: [
          {
            heading: "Higher High / Lower Low : les bases",
            body: "Toute tendance se résume à une séquence de points hauts et de points bas. En tendance haussière, chaque nouveau sommet est plus haut que le précédent (Higher High), et chaque creux est plus haut que le précédent (Higher Low). En tendance baissière, c'est l'inverse.",
            items: [
              "Higher High (HH) + Higher Low (HL) = tendance haussière, les acheteurs sont en contrôle",
              "Lower Low (LL) + Lower High (LH) = tendance baissière, les vendeurs dominent",
              "Exemple : EUR/USD fait 1,0800 → 1,0750 → 1,0900 → 1,0820 → 1,1000 = séquence HH/HL haussière",
              "La structure ne change pas à chaque bougie, elle change seulement sur des swings significatifs",
            ],
          },
          {
            heading: "Break of Structure (BOS) : la tendance confirmée",
            body: "Un Break of Structure, c'est quand le prix casse le dernier point haut (en tendance haussière) ou le dernier point bas (en tendance baissière). Le BOS confirme que la tendance continue. C'est une information, pas un signal d'entrée.",
            items: [
              "BOS haussier : le prix casse au-dessus du dernier HH → la tendance haussière se confirme",
              "BOS baissier : le prix casse en dessous du dernier LL → la tendance baissière se confirme",
              "Exemple : BTC est en tendance haussière. Il casse le dernier sommet à 35 000 € → BOS haussier confirmé",
              "Le BOS dit 'la tendance continue', pas 'entre maintenant'",
            ],
          },
          {
            heading: "Change of Character (CHoCH) : le retournement",
            body: "Le CHoCH est le premier signal que la tendance est en train de changer. En tendance haussière, c'est quand le prix casse en dessous du dernier Higher Low. C'est la première rupture de la structure haussière, pas encore une confirmation, mais un avertissement fort.",
            items: [
              "CHoCH en tendance haussière : le prix casse sous le dernier HL → première alerte de retournement",
              "CHoCH en tendance baissière : le prix casse au-dessus du dernier LH → premier signal de reprise",
              "EUR/USD en tendance haussière : le prix brise son dernier HL à 1,0820 → CHoCH, surveiller un renversement",
              "CHoCH ≠ retournement confirmé. C'est le début d'une phase de vigilance, pas un ordre de vente immédiat",
            ],
          },
          {
            heading: "Tendance vs retournement : comment distinguer",
            body: "La grande erreur des débutants est d'entrer en sens inverse à la première correction. Voici la règle : un BOS dans le sens contraire de la tendance + un CHoCH = début de retournement potentiel. Un CHoCH seul ne suffit pas.",
            table: {
              headers: ["Signal", "Ce que ça indique", "Action"],
              rows: [
                ["BOS dans le sens de la tendance", "Continuation, la tendance est forte", "Chercher une entrée dans le sens de la tendance"],
                ["CHoCH seul", "Alerte, possible début de retournement", "Passer en mode observation, pas encore d'entrée"],
                ["CHoCH + BOS opposé", "Retournement en cours", "Commencer à chercher des entrées dans le nouveau sens"],
                ["Série de Doji + range serré", "Indécision, pas de structure claire", "Rester hors du marché, attendre la clarification"],
              ],
            },
          },
        ],
        keyPoints: [
          "HH/HL = tendance haussière. LL/LH = tendance baissière. La structure est la base de toute analyse.",
          "BOS = le prix casse un sommet ou creux précédent → la tendance continue",
          "CHoCH = le prix casse la structure adverse → premier signal de retournement",
          "Un CHoCH seul ne suffit pas, attendre un BOS dans le sens opposé pour confirmer",
          "Lire la structure AVANT de chercher une entrée, jamais l'inverse",
        ],
        exercise: {
          title: "Cartographier la structure de marché sur EUR/USD",
          steps: [
            "Sur TradingView, ouvre EUR/USD en H4. Remonte 3 mois en arrière.",
            "Identifie et marque chaque sommet (HH ou LH) et chaque creux (HL ou LL) significatif.",
            "Repère le dernier BOS : où le prix a-t-il cassé son dernier sommet ou creux ?",
            "Y a-t-il eu un CHoCH récent ? Si oui, la tendance a-t-elle changé dans les bougies suivantes ?",
          ],
        },
        quiz: {
          question: "EUR/USD est en tendance haussière (séquence HH/HL). Le prix casse en dessous du dernier Higher Low. Qu'est-ce que cela signifie ?",
          answers: [
            "La tendance haussière est confirmée, c'est un bon moment d'acheter",
            "C'est un CHoCH, premier signal que la structure haussière est fragilisée",
            "La tendance baissière est officiellement confirmée, entrer en Short immédiatement",
            "C'est un signal neutre, aucune information exploitable",
          ],
          correct: 1,
          explanation:
            "Casser le dernier Higher Low en tendance haussière est la définition du CHoCH. Ce n'est pas encore un retournement confirmé, mais c'est le premier signal que la structure haussière est compromise. Il faut attendre un BOS baissier pour avoir une confirmation solide.",
          answerExplanations: [
            "Faux. La cassure du dernier HL est exactement l'inverse d'une confirmation haussière. C'est une rupture de la structure, pas un signal d'achat.",
            "Correct. La cassure du dernier Higher Low = CHoCH. La structure haussière est fragilisée. Ce n'est pas un signal d'entrée short immédiat, mais un avertissement fort qu'un retournement est possible.",
            "Faux. Un CHoCH seul ne confirme pas un retournement. Il faut également un BOS baissier (cassure du dernier point bas) pour avoir une tendance baissière confirmée.",
            "Faux. Le CHoCH est une information très précieuse, il signale la fin possible de la structure en cours. Ignorer ce signal, c'est rater un avertissement majeur du marché.",
          ],
        },
      },

      // ─── Leçon 2 ─────────────────────────────────────────────────────────
      {
        id: "lecon-2",
        slug: "lecon2",
        title: "Zones clés : Support & Résistance",
        duration: "22 min",
        introduction:
          "Sur tout graphique, il y a des niveaux où le prix s'arrête, rebondit ou explose. Ce ne sont pas des lignes magiques, ce sont des zones où des milliers d'ordres sont concentrés. Les trader sans les connaître, c'est naviguer sans carte.",
        sections: [
          {
            heading: "Support : le plancher du prix",
            body: "Un support est une zone sous le prix actuel où la demande (les acheteurs) est suffisamment forte pour stopper la baisse et potentiellement provoquer un rebond. Le prix a déjà réagi à ce niveau dans le passé, c'est la clé.",
            items: [
              "Un support est VALIDÉ quand le prix l'a touché ET rebondi au moins une fois",
              "Plus le prix rebondit sur une zone, plus elle est significative, et plus elle risque de céder quand elle est finalement cassée",
              "Exemple : BTC a rebondi à 25 000 € trois fois sur 6 mois → support majeur à ce niveau",
              "Sur le graphique : cherche les zones de creux alignés, pas juste un seul point bas",
            ],
          },
          {
            heading: "Résistance : le plafond du prix",
            body: "Une résistance est une zone au-dessus du prix actuel où l'offre (les vendeurs) est suffisamment forte pour stopper la hausse. Le prix y a déjà été repoussé dans le passé. Une résistance cassée devient souvent un support, c'est le principe de polarité.",
            items: [
              "Résistance validée = le prix y a été rejeté au moins une fois dans le passé",
              "Principe de polarité : une résistance cassée devient support, un support cassé devient résistance",
              "Exemple : EUR/USD bute sur 1,1000 pendant 3 semaines. Quand il casse, ce niveau devient son nouveau support",
              "Les résistances psychologiques (nombres ronds : 1,1000, 30 000 €, 50 000 €) sont souvent les plus fortes",
            ],
          },
          {
            heading: "Zones vs lignes : tracer correctement",
            body: "L'erreur classique est de tracer des lignes horizontales précises. Le marché est imprécis, les zones sont plus efficaces que les lignes. Une zone capture l'incertitude naturelle autour d'un niveau clé.",
            items: [
              "Trace une zone de 10 à 30 points autour du niveau clé, pas une ligne au pip près",
              "Utilise le corps des bougies (Open/Close) pour définir la zone, les mèches peuvent dépasser",
              "Sur TradingView : utilise l'outil Rectangle pour tracer des zones, pas la ligne horizontale simple",
              "Un niveau clé n'a pas besoin d'être parfaitement précis, c'est une zone d'intérêt, pas un niveau exact",
            ],
          },
          {
            heading: "Types de réactions et faux breakouts",
            body: "Le prix peut réagir à un niveau de trois façons. Savoir les reconnaître évite d'entrer sur un faux signal et de se faire piéger par un breakout qui ne tient pas.",
            table: {
              headers: ["Réaction", "Ce qu'on voit", "Stratégie"],
              rows: [
                ["Rebond propre", "Mèche longue + rejet franc sur la zone", "Chercher une entrée dans le sens du rebond"],
                ["Cassure propre", "Grande bougie qui clôture clairement de l'autre côté", "Trader la cassure dans le sens de la cassure"],
                ["Faux breakout", "Le prix passe le niveau puis revient immédiatement", "Attendre la clôture de bougie avant de trader la cassure"],
                ["Consolidation", "Le prix range autour du niveau pendant plusieurs bougies", "Attendre une résolution claire avant d'entrer"],
              ],
            },
          },
        ],
        keyPoints: [
          "Support = zone de demande où le prix rebondit. Résistance = zone d'offre où le prix est repoussé.",
          "Trace des ZONES, pas des lignes, le marché n'est pas précis au point près",
          "Polarité : une résistance cassée devient support, et vice versa",
          "Plus un niveau a été testé, plus il est significatif, et plus sa cassure sera puissante",
          "Attends la clôture de bougie avant de réagir à une cassure, les faux breakouts sont fréquents",
        ],
        exercise: {
          title: "Tracer les zones clés sur BTC/USD",
          steps: [
            "Sur TradingView, ouvre BTC/USD en Daily. Remonte 6 mois en arrière.",
            "Identifie les 3 supports et 3 résistances les plus significatifs. Trace des zones (rectangles) autour de chaque niveau.",
            "Pour chaque zone, compte combien de fois le prix y a réagi. Note si c'est un support, une résistance, ou les deux (polarité).",
            "Le prix actuel est-il proche d'une de ces zones ? Si oui, à quelle réaction t'attends-tu ?",
          ],
        },
        quiz: {
          question: "EUR/USD a testé la résistance à 1,1000 à trois reprises sans la casser. Il casse finalement ce niveau avec une grande bougie haussière. Que devient ce niveau ?",
          answers: [
            "Il reste une résistance, le prix va rebondir dessus à la prochaine visite",
            "Il devient un support, le principe de polarité s'applique",
            "Le niveau perd toute signification après une cassure",
            "Il devient une nouvelle résistance encore plus forte qu'avant",
          ],
          correct: 1,
          explanation:
            "C'est le principe de polarité : quand un niveau de résistance est cassé proprement, il change de nature et devient un support. La logique : les vendeurs qui avaient leurs ordres à ce niveau ont été stoppés, ils vont souvent racheter sur ce même niveau lors du retour du prix.",
          answerExplanations: [
            "Faux. Une résistance cassée ne reste pas résistance, c'est exactement le principe de polarité qui dit le contraire. Le niveau change de nature.",
            "Correct. Polarité = résistance cassée → support. Le prix revient souvent tester l'ancien niveau après la cassure. C'est une des configurations les plus fiables en trading.",
            "Faux. Un niveau cassé ne perd pas sa signification, il la change. Il était résistance, il devient support. C'est l'un des concepts les plus puissants de l'analyse technique.",
            "Faux. La résistance n'est pas renforcée après la cassure, elle est transformée en support. Plus elle a été testée AVANT la cassure (3 fois ici), plus le support formé après sera solide.",
          ],
        },
      },

      // ─── Leçon 3 ─────────────────────────────────────────────────────────
      {
        id: "lecon-3",
        slug: "lecon3",
        title: "Supply & Demand",
        duration: "20 min",
        introduction:
          "Pourquoi le prix revient-il parfois exactement au même endroit après des heures ou des jours ? Parce que des institutions y ont laissé des ordres non-exécutés. Ces zones s'appellent Supply et Demand. Elles sont l'empreinte des gros acteurs sur le marché.",
        sections: [
          {
            heading: "La logique institutionnelle",
            body: "Les banques et fonds d'investissement ne peuvent pas exécuter leurs ordres massifs d'un coup, le marché n'est pas assez liquide. Ils les divisent et en laissent une partie en attente. Quand le prix revient à ce niveau, ces ordres résiduels s'exécutent, c'est pourquoi le prix réagit si fortement à ces zones.",
            items: [
              "Les institutions ont des ordres si massifs qu'ils ne peuvent pas tous être exécutés en une seule fois",
              "Elles laissent des ordres pendants à des niveaux précis, le prix réagit en y revenant",
              "Supply et Demand ne sont pas identiques aux supports/résistances, ce sont des zones d'origine de mouvement fort",
              "La zone est valide si elle a généré un mouvement impulsif bref et fort dans une direction",
            ],
          },
          {
            heading: "Zone de Demand : où les institutions achètent",
            body: "Une zone de Demand (demande) est l'origine d'un mouvement haussier fort. Le prix y est passé rapidement, laissant une zone non-revisitée. Quand le prix y revient, les ordres institutionnels résiduels achètent, et le prix repart à la hausse.",
            items: [
              "Origine : le prix était à ce niveau, a explosé à la hausse rapidement (peu de bougies, corps larges)",
              "La zone est la base du mouvement, les corps des dernières bougies baissières avant l'impulsion",
              "Exemple : BTC à 28 000 €, explose à 35 000 € en 3 bougies journalières → Demand zone à 27 500 – 28 500 €",
              "Validité : plus le mouvement de départ est fort, plus la zone est institutionnelle",
            ],
          },
          {
            heading: "Zone de Supply : où les institutions vendent",
            body: "Une zone de Supply (offre) est l'origine d'un mouvement baissier fort. C'est là que les institutions ont vendu massivement et laissé des ordres pendants à la vente. Le prix en retournant dans cette zone déclenche ces ventes résiduelles.",
            items: [
              "Origine : le prix était à ce niveau, a chuté rapidement (mouvement impulsif baissier)",
              "La zone est le plafond du mouvement, les corps des dernières bougies haussières avant l'impulsion baissière",
              "Exemple : EUR/USD à 1,0950, chute à 1,0800 en 2 jours → Supply zone à 1,0920 – 1,0960",
              "Une Supply zone non-revisitée depuis longtemps reste valide jusqu'à ce que le prix y retourne",
            ],
          },
          {
            heading: "Identifier une zone valide",
            body: "Toutes les zones ne se valent pas. Une zone Supply & Demand de haute qualité a des caractéristiques précises. Plus ces critères sont remplis, plus la probabilité de réaction est élevée.",
            table: {
              headers: ["Critère", "Zone faible", "Zone forte"],
              rows: [
                ["Origine du mouvement", "Mouvement lent, progressif", "Mouvement rapide, impulsif (1–3 bougies)"],
                ["Nombre de touches", "Déjà visité plusieurs fois", "Encore vierge (jamais revisitée)"],
                ["Taille de la zone", "Très large (> 100 points)", "Compacte (30–60 points)"],
                ["Contexte", "Contre la tendance HTF", "Dans le sens de la tendance HTF"],
              ],
            },
          },
        ],
        keyPoints: [
          "Supply = zone d'origine d'un mouvement baissier fort, les institutions y vendent",
          "Demand = zone d'origine d'un mouvement haussier fort, les institutions y achètent",
          "Une zone valide = mouvement impulsif bref + zone jamais revisitée",
          "La zone perd sa validité quand le prix y revient et la consomme sans réaction forte",
          "Préfère les zones dans le sens de la tendance HTF, elles ont les meilleures probabilités",
        ],
        exercise: {
          title: "Identifier des zones Supply & Demand sur EUR/USD",
          steps: [
            "Sur TradingView, ouvre EUR/USD en H1. Cherche les 3 derniers mouvements impulsifs (hausse ou baisse rapide).",
            "Pour chaque mouvement impulsif, identifie son origine (la base du mouvement). Trace une zone autour des corps des bougies juste avant l'impulsion.",
            "Ces zones ont-elles été revisitées depuis ? Si non, elles restent potentiellement actives.",
            "Le prix actuel est-il en approche d'une de ces zones ? Note ta prédiction de réaction.",
          ],
        },
        quiz: {
          question: "EUR/USD se trouve à 1,0800. Il monte à 1,1050 en 4 bougies H4. Où se situe la zone de Demand ?",
          answers: [
            "À 1,1050, au sommet du mouvement haussier",
            "À 1,0800, à l'origine du mouvement impulsif haussier",
            "À mi-chemin, vers 1,0925",
            "Il n'y a pas de zone de Demand ici, le prix monte trop vite",
          ],
          correct: 1,
          explanation:
            "La zone de Demand se situe à l'ORIGINE du mouvement impulsif, là où les institutions ont commencé à acheter. Ici, le mouvement part de 1,0800 → la Demand zone est autour de 1,0800 (les corps des bougies juste avant l'impulsion). C'est là que les ordres résiduels attendent le retour du prix.",
          answerExplanations: [
            "Faux. 1,1050 est le sommet du mouvement, c'est la destination, pas l'origine. C'est plutôt une zone de Supply potentielle, pas de Demand.",
            "Correct. La Demand zone se place à l'ORIGINE du mouvement haussier impulsif, ici autour de 1,0800. Quand le prix reviendra dans cette zone, les ordres institutionnels résiduels devraient acheter à nouveau.",
            "Faux. Le milieu du mouvement n'a pas de signification institutionnelle particulière. La zone Supply/Demand est toujours à l'origine ou à la destination du mouvement, pas entre les deux.",
            "Faux. C'est exactement le contraire : un mouvement impulsif rapide (4 bougies H4) est le signe le plus fort d'une présence institutionnelle. Plus c'est rapide et fort, plus la zone d'origine est valide.",
          ],
        },
      },

      // ─── Leçon 4 ─────────────────────────────────────────────────────────
      {
        id: "lecon-4",
        slug: "lecon4",
        title: "Tendances : trader dans le sens du marché",
        duration: "18 min",
        introduction:
          "80% des trades perdants des débutants vont contre la tendance. Trader dans le sens du marché, c'est se mettre du côté de la force dominante. La tendance n'est pas ton ennemie, c'est ta meilleure alliée.",
        sections: [
          {
            heading: "Identifier une tendance claire",
            body: "Une tendance n'est pas juste 'le prix monte'. C'est une séquence structurée de points hauts et de points bas dans une direction. Voici comment la reconnaître clairement, sans ambiguïté.",
            items: [
              "Tendance haussière : chaque sommet est plus haut que le précédent, chaque creux est plus haut que le précédent (HH/HL)",
              "Tendance baissière : chaque sommet est plus bas que le précédent, chaque creux est plus bas que le précédent (LH/LL)",
              "Outil simple : trace une droite reliant les creux (tendance haussière) ou les sommets (tendance baissière)",
              "Si la structure n'est pas claire, s'il y a des HH suivis de LL sans logique, le marché est en range. Ne trade pas.",
            ],
          },
          {
            heading: "Pourquoi trader dans le sens de la tendance",
            body: "La tendance représente la force dominante du marché. Aller contre elle, c'est comme nager à contre-courant. Même avec la meilleure analyse, le ratio risque/récompense devient défavorable quand on va contre la direction principale.",
            table: {
              headers: ["Position", "Tendance haussière", "Tendance baissière"],
              rows: [
                ["Long (Buy)", "✓ Dans le sens, meilleure probabilité", "✗ Contre le courant, risque élevé"],
                ["Short (Sell)", "✗ Contre le courant, risque élevé", "✓ Dans le sens, meilleure probabilité"],
                ["Meilleur moment d'entrer", "Sur un pullback (HL) dans la tendance haussière", "Sur un retracement (LH) dans la tendance baissière"],
              ],
            },
          },
          {
            heading: "Quand éviter de trader",
            body: "Une tendance n'existe pas toujours. Le marché passe beaucoup de temps en range (consolidation). Identifier un range et rester hors du marché est aussi une décision de trading valide.",
            items: [
              "Range = le prix évolue entre un support et une résistance sans structure claire HH/HL ou LL/LH",
              "En range : ni les acheteurs ni les vendeurs ne dominent, probabilités proches de 50/50",
              "Signe d'alerte : des bougies Doji répétées, des corps qui raccourcissent, des mèches dans les deux sens",
              "Règle : si tu ne peux pas tracer clairement la tendance en 10 secondes, reste hors du marché",
            ],
          },
          {
            heading: "Le pullback : l'entrée en tendance",
            body: "En tendance, le prix ne monte pas en ligne droite. Il avance, recule partiellement (pullback), puis reprend sa direction. Les pullbacks sur des niveaux clés sont les meilleures entrées en tendance.",
            items: [
              "Pullback haussier : le prix monte, recule temporairement sur un support ou une zone de Demand, puis reprend",
              "Pullback baissier : le prix descend, remonte temporairement sur une résistance ou zone de Supply, puis reprend",
              "Exemple : BTC en tendance haussière. Il monte de 30 000 → 35 000 €, puis recule à 32 000 € (pullback sur support). Entrée Long à 32 000 €.",
              "Le pullback idéal recule de 38% à 62% du mouvement précédent (niveaux Fibonacci, voir leçon 9)",
            ],
          },
        ],
        keyPoints: [
          "Tendance haussière = HH/HL. Tendance baissière = LL/LH. En range = pas de structure claire.",
          "Trader dans le sens de la tendance = probabilités en ta faveur. Contre la tendance = probabilités contre toi.",
          "Le pullback sur un niveau clé (support, zone de Demand) est l'entrée optimale en tendance.",
          "Pas de tendance claire = rester hors du marché. Attendre n'est pas perdre.",
          "Identifie d'abord la tendance sur le HTF, puis cherche des entrées sur le LTF.",
        ],
        exercise: {
          title: "Identifier la tendance et le prochain pullback",
          steps: [
            "Sur TradingView, ouvre EUR/USD en H4. Quelle est la tendance actuelle ? (haussière, baissière, ou range ?)",
            "Si tendance claire : identifie le dernier pullback. Quel niveau a-t-il respecté ? (support, zone de Demand…)",
            "Anticipe le prochain pullback : à quel niveau t'attendrais-tu à voir le prix reculer avant de reprendre sa direction ?",
            "Si le marché est en range : identifie les bornes haute et basse. Quel serait le signal de sortie du range ?",
          ],
        },
        quiz: {
          question: "EUR/USD est en tendance haussière (séquence HH/HL). Le prix recule de 1,0950 à 1,0870. Quelle est la stratégie optimale ?",
          answers: [
            "Entrer Short, le prix baisse, c'est une opportunité de vente",
            "Ignorer, les pullbacks sont des pièges, attendre une nouvelle cassure haute",
            "Chercher une entrée Long sur le pullback si 1,0870 est un niveau de support ou Demand valide",
            "Passer en mode neutre, la tendance haussière est annulée par ce recul",
          ],
          correct: 2,
          explanation:
            "Un pullback en tendance haussière est une opportunité d'achat, pas un signal de vente. Le prix recule pour trouver un niveau de support ou une zone de Demand, puis reprendre sa direction haussière. Si 1,0870 est un niveau validé, c'est l'entrée Long idéale, dans le sens de la tendance, au meilleur prix.",
          answerExplanations: [
            "Faux. Entrer Short dans une tendance haussière sur un simple pullback, c'est aller contre la force dominante. Les probabilités sont contre toi, et ton SL devrait être placé très loin pour éviter les faux signaux.",
            "Faux. Les pullbacks ne sont pas des pièges, ils sont les meilleures opportunités d'entrée en tendance. Attendre une cassure haute signifie entrer en retard, avec un R/R moins favorable.",
            "Correct. Le pullback sur un niveau validé est l'entrée en tendance par excellence. La tendance reste haussière (structure HH/HL intacte), et le pullback offre un prix d'entrée avantageux avec un SL logique sous le support.",
            "Faux. Un pullback normal en tendance haussière ne change pas la structure tant que le dernier Higher Low n'est pas cassé. La tendance reste valide jusqu'à un CHoCH confirmé.",
          ],
        },
      },

      // ─── Leçon 5 ─────────────────────────────────────────────────────────
      {
        id: "lecon-5",
        slug: "lecon5",
        title: "Confluences et probabilité",
        duration: "20 min",
        introduction:
          "Un signal seul, c'est 50/50. Deux confirmations qui convergent, c'est 65%. Trois, c'est la probabilité qui travaille clairement pour toi. Les confluences, c'est l'art d'empiler les raisons, et de ne trader que quand tout s'aligne.",
        sections: [
          {
            heading: "Pourquoi un signal seul ne suffit pas",
            body: "Chaque outil d'analyse, bougie, support, tendance, volume, peut donner de faux signaux seul. Aucun n'est fiable à 100%. Mais quand plusieurs outils pointent dans la même direction au même moment, la probabilité d'avoir raison augmente significativement.",
            items: [
              "Un marteau seul : 50% de chances que ce soit un vrai signal de rebond",
              "Un marteau SUR un support majeur : 65%, deux éléments convergent",
              "Un marteau sur un support majeur EN tendance haussière : 75%+, trois éléments alignés",
              "Règle : n'entre jamais sur une seule raison. Cherche toujours au moins 2 à 3 confluences.",
            ],
          },
          {
            heading: "Les confluences les plus puissantes",
            body: "Toutes les confluences ne se valent pas. Certaines combinaisons sont statistiquement plus fiables que d'autres. Voici les confluences à rechercher par ordre de puissance.",
            items: [
              "Tendance HTF + niveau clé + signal de bougie = setup de haute qualité",
              "Zone de Supply/Demand + structure BOS + Fibonacci 61.8% = entrée institutionnelle",
              "Support/résistance + volume élevé au rebond + engulfing = confirmation forte",
              "Confluence temporelle : niveau testé lors d'une Killzone (session London/NY) = signal renforcé",
            ],
          },
          {
            heading: "Exemple concret : empiler les confirmations",
            body: "EUR/USD : tendance haussière en H4 (contexte). Le prix pullback vers 1,0820 (support + zone de Demand en H1). Une pin bar haussière se forme en M15. C'est 3 confluences alignées : tendance, niveau institutionnel, signal de rejet. Entrée Long à la clôture de la pin bar.",
            table: {
              headers: ["Confluence", "Présente ?", "Poids"],
              rows: [
                ["Tendance haussière HTF (H4)", "✓ Oui", "Élevé, contexte global favorable"],
                ["Zone de Demand H1 à 1,0820", "✓ Oui", "Élevé, niveau institutionnel non-revisité"],
                ["Signal de rejet (pin bar M15)", "✓ Oui", "Moyen, confirmation d'entrée"],
                ["Fibonacci 61.8% à 1,0815", "✓ Oui", "Bonus, confluence supplémentaire"],
                ["Session Killzone London", "✗ Non", "Absent, timing pas idéal"],
              ],
            },
          },
          {
            heading: "Quand le setup est valide vs invalide",
            body: "La clé est d'avoir une checklist AVANT d'entrer. Si tous les critères ne sont pas remplis, on passe au trade suivant. La discipline de ne pas entrer sur des setups incomplets est ce qui sépare les traders rentables des autres.",
            items: [
              "Setup valide : tendance claire + niveau clé respecté + signal de confirmation = ENTRÉE",
              "Setup insuffisant : signal de bougie seul, sans niveau et sans tendance = IGNORER",
              "Setup invalide : bon signal sur un niveau mais contre la tendance HTF = ÉVITER",
              "Règle d'or : si tu dois te convaincre que c'est un bon trade, ce n'en est probablement pas un",
            ],
          },
        ],
        keyPoints: [
          "Plus les confirmations s'accumulent dans la même direction, plus la probabilité est élevée",
          "Minimum 2 à 3 confluences avant d'entrer, jamais sur un signal isolé",
          "La confluence la plus puissante : tendance HTF + niveau institutionnel + signal de bougie",
          "Crée une checklist et valide chaque point AVANT d'ouvrir un trade",
          "Si tu te convaincs d'un trade = signal d'alarme. Un bon setup est évident.",
        ],
        exercise: {
          title: "Analyser et scorer un setup avec confluences",
          steps: [
            "Sur TradingView, ouvre EUR/USD. Identifie la tendance sur H4, puis descends en H1.",
            "Le prix est-il proche d'un niveau clé (support, résistance, zone Supply/Demand) ?",
            "Cherche un signal de bougie sur ce niveau : pin bar, engulfing, doji suivi d'une bougie directionnelle.",
            "Score ton setup de 0 à 5 : tendance HTF (1pt) + niveau clé (1pt) + signal bougie (1pt) + Fibonacci (1pt) + Killzone (1pt). Entre seulement si tu as 3/5 minimum.",
          ],
        },
        quiz: {
          question: "Tu vois une grande bougie engulfing haussière sur un graphique en M5. Il n'y a pas de tendance claire et pas de niveau clé identifié. Que fais-tu ?",
          answers: [
            "Tu entres Long immédiatement, une grande bougie engulfing est un signal fort",
            "Tu attends une deuxième bougie haussière pour confirmation, puis tu entres",
            "Tu ignores ce signal, une seule confluence sans contexte n'est pas suffisante",
            "Tu entres Short, une grande hausse sera toujours suivie d'une baisse",
          ],
          correct: 2,
          explanation:
            "Une bougie engulfing sans tendance claire ni niveau clé est un signal isolé, sans confluence. Les signaux de bougie sans contexte ont une probabilité proche de 50/50. Ce n'est pas suffisant pour risquer du capital. Un bon setup nécessite au minimum 2 à 3 confluences.",
          answerExplanations: [
            "Faux. Une grande bougie engulfing seule sur M5, sans tendance ni niveau, c'est une confluence sur 3 minimum requises. La probabilité est insuffisante pour justifier un trade.",
            "Faux. Attendre une deuxième bougie haussière ne résout pas le problème fondamental : il n'y a toujours pas de tendance claire ni de niveau clé. Tu ajoutes une confirmation faible à une base déjà insuffisante.",
            "Correct. Sans tendance et sans niveau clé, même un engulfing puissant ne justifie pas une entrée. Les confluences manquent. Passer au trade suivant est la bonne décision, la discipline prime sur l'impulsion.",
            "Faux. Entrer Short sur une grande bougie haussière sans raison structurelle, c'est spéculer à pile ou face. Ce n'est pas du trading, c'est du jeu.",
          ],
        },
      },

      // ─── Leçon 6 ─────────────────────────────────────────────────────────
      {
        id: "lecon-6",
        slug: "lecon6",
        title: "Fake Breakout : ne pas se faire piéger",
        duration: "18 min",
        introduction:
          "Le marché semble casser un niveau important. Tu entres dans le sens de la cassure. Et puis le prix revient en arrière et te stoppe. Ce n'est pas de la malchance, c'est un piège mécanique que tu peux apprendre à reconnaître, et même à exploiter.",
        sections: [
          {
            heading: "La mécanique du Fake Breakout",
            body: "Un Fake Breakout (faux breakout) se produit quand le prix passe brièvement au-delà d'un niveau clé, support, résistance, point haut, point bas, puis revient immédiatement de l'autre côté. L'objectif : déclencher les stops des traders positionnés à ce niveau et collecter leur liquidité.",
            items: [
              "Le prix dépasse un niveau évident (support ou résistance visible de tous)",
              "Les stops des traders sont déclenchés, les longs sous le support, les shorts au-dessus de la résistance",
              "Le prix revient immédiatement dans sa direction d'avant, alimenté par les nouvelles positions institutionnelles",
              "La clé : la bougie qui a cassé le niveau CLÔTURE de l'autre côté, elle ne reste pas au-delà",
            ],
          },
          {
            heading: "Liquidité : pourquoi le marché chasse les stops",
            body: "Les grandes institutions ont besoin de liquidité pour exécuter leurs ordres massifs. Les stops des petits traders (sous les supports, au-dessus des résistances) constituent des pools de liquidité. Le marché les capture, puis repart dans sa vraie direction.",
            items: [
              "Sous un support évident : accumulation des stops des traders long → la machine les déclenche puis rachète",
              "Au-dessus d'une résistance évidente : accumulation des stops des traders short → la machine les déclenche puis revend",
              "Equal Highs (deux sommets identiques) = cible de liquidité évidente, le prix va souvent les dépasser brièvement",
              "Equal Lows (deux creux identiques) = même logique. Le niveau 'trop évident' est souvent le premier à être chassé",
            ],
          },
          {
            heading: "Reconnaître un faux breakout",
            body: "Plusieurs signes permettent d'identifier un faux breakout avant ou pendant qu'il se produit. L'élément clé est toujours la clôture de la bougie, pas le niveau intraday atteint.",
            table: {
              headers: ["Signe", "Description", "Action"],
              rows: [
                ["Mèche longue au-delà du niveau", "Le prix dépasse mais la bougie clôture de l'autre côté", "Méfiance, possible faux breakout"],
                ["Volume faible à la cassure", "La cassure n'est pas soutenue par un volume fort", "Signe de faiblesse, probabilité de faux break élevée"],
                ["Retour rapide et violent", "Le prix revient en force dans les 1 à 3 bougies suivantes", "Confirmation du faux breakout"],
                ["Niveau 'trop évident'", "Tout le monde voit la résistance, c'est une cible de liquidité", "Prudence à la cassure de ce type de niveau"],
              ],
            },
          },
          {
            heading: "Exploiter un faux breakout",
            body: "Une fois le faux breakout identifié, il devient l'un des setups les plus puissants. Tu entres dans le sens du retour, avec un Stop Loss logique au-delà du pic du faux break, très serré, avec un fort potentiel.",
            items: [
              "Faux breakout haussier (Stop Hunt sur résistance) : attend le retour sous la résistance → entre Short",
              "Faux breakout baissier (Stop Hunt sur support) : attend le retour au-dessus du support → entre Long",
              "SL : juste au-delà du pic du faux breakout (très proche)",
              "TP : vers le niveau de liquidité opposé (Equal Highs ou Equal Lows, zone de Supply/Demand)",
            ],
          },
        ],
        keyPoints: [
          "Faux breakout = le prix dépasse un niveau puis revient, les stops sont chassés",
          "Les niveaux 'trop évidents' (Equal Highs/Lows) sont les cibles favorites des faux breakouts",
          "Signal : mèche longue + clôture de l'autre côté du niveau + retour violent",
          "Attends toujours la clôture de bougie avant de réagir à une cassure",
          "Un faux breakout confirmé est un setup d'entrée puissant avec SL serré",
        ],
        exercise: {
          title: "Identifier des faux breakouts récents sur EUR/USD",
          steps: [
            "Sur TradingView, ouvre EUR/USD en H1. Cherche des Equal Highs ou Equal Lows sur les 2 dernières semaines.",
            "Pour chaque niveau, vérifie : y a-t-il eu un spike au-delà suivi d'un retour rapide ?",
            "Si oui, mesure l'amplitude du retour après le faux break. Combien de points en 1 à 5 bougies ?",
            "Où aurais-tu placé ton entrée, ton SL et ton TP sur ce faux breakout ?",
          ],
        },
        quiz: {
          question: "Le prix monte brièvement au-dessus d'une résistance majeure, puis clôture immédiatement en dessous avec une mèche haute longue. Que fais-tu ?",
          answers: [
            "Tu achètes en cassure, le prix a bien dépassé la résistance",
            "Tu ignores, ce mouvement est trop ambigu",
            "Tu surveilles un signal de retournement baissier, c'est probablement un faux breakout",
            "Tu places un ordre achat au-dessus du pic pour suivre le momentum",
          ],
          correct: 2,
          explanation:
            "Un spike au-dessus d'une résistance avec clôture en dessous est la signature classique d'un faux breakout. Les stops des shorts ont été déclenchés, les institutions ont vendu dans ce spike. Le retournement baissier qui suit est alimenté par ces ventes institutionnelles. C'est là qu'on cherche un signal de vente.",
          answerExplanations: [
            "Faux. La clôture sous la résistance invalide la cassure. Ce n'est pas un vrai breakout, c'est exactement un faux breakout. Acheter ici, c'est se positionner du mauvais côté du mouvement institutionnel.",
            "Faux. Cette configuration n'est pas du tout ambiguë, c'est la signature précise d'un faux breakout. Mèche longue + clôture de l'autre côté = signal d'alerte clair pour un trader structuré.",
            "Correct. Spike sur résistance + clôture en dessous = faux breakout sur la résistance. Les institutions ont vendu dans ce pic. La probabilité de continuation baissière est élevée, cherche un engulfing ou pin bar baissier pour entrer.",
            "Faux. Placer un achat au-dessus du spike, c'est espérer que la cassure soit réelle, mais tous les signaux indiquent le contraire. Tu t'apprêterais à entrer dans la direction du piège, pas dans la direction institutionnelle.",
          ],
        },
      },

      // ─── Leçon 7 ─────────────────────────────────────────────────────────
      {
        id: "lecon-7",
        slug: "lecon7",
        title: "Analyse Multi-Timeframe",
        duration: "22 min",
        introduction:
          "Tu peux avoir raison sur le M5 et te faire détruire par le Daily. La direction sur un petit timeframe ne compte que si elle s'aligne avec le contexte sur un grand timeframe. Lire plusieurs timeframes, c'est voir le même marché avec deux niveaux de zoom.",
        sections: [
          {
            heading: "HTF vs LTF : deux rôles distincts",
            body: "Le High Timeframe (HTF) donne le contexte et la direction. Le Low Timeframe (LTF) donne le timing et l'entrée précise. Les deux sont indispensables, mais ils jouent des rôles différents.",
            items: [
              "HTF (H4, Daily, Weekly) : identifier la tendance, les niveaux majeurs, le biais directionnel",
              "LTF (M15, M5, H1) : affiner l'entrée, définir le SL précis, lire le signal de déclenchement",
              "Règle : le HTF commande. L'entrée se fait sur le LTF, DANS le sens du HTF.",
              "Erreur classique : voir un signal Long sur M5 alors que le Daily est en tendance baissière, 80% de chance de perdre",
            ],
          },
          {
            heading: "Top-Down Analysis : lire de haut en bas",
            body: "L'analyse top-down consiste à commencer par le timeframe le plus haut pour établir le contexte global, puis descendre progressivement vers les petits timeframes pour trouver l'entrée. C'est la méthode des traders professionnels.",
            items: [
              "Étape 1. Daily : quelle est la tendance principale ? Quels sont les grands niveaux ?",
              "Étape 2. H4 : la tendance Daily se confirme-t-elle ? Suis-je dans une zone de Supply/Demand ?",
              "Étape 3. H1 : y a-t-il une structure claire dans le sens du HTF ? Où est le prochain niveau clé ?",
              "Étape 4. M15 : quel est le signal d'entrée précis ? Pin bar, engulfing, BOS micro-structure ?",
            ],
          },
          {
            heading: "Exemple concret : EUR/USD top-down",
            body: "Daily : tendance haussière (HH/HL). Grand support à 1,0820. H4 : pullback vers 1,0820, zone de Demand H4 actif. H1 : CHoCH haussier, la structure mini baissière du pullback est cassée. M15 : pin bar haussière au contact du support. Résultat : 4 timeframes alignés → entrée Long à la clôture de la pin bar M15, SL sous le Low de la mèche.",
            table: {
              headers: ["Timeframe", "Biais", "Signal"],
              rows: [
                ["Daily", "Haussier (HH/HL intact)", "Support majeur à 1,0820 non cassé"],
                ["H4", "Haussier (pullback en cours)", "Zone de Demand H4 touchée"],
                ["H1", "Haussier (CHoCH vers la hausse)", "Structure mini-baissière cassée à la hausse"],
                ["M15", "Signal d'entrée", "Pin bar haussière → ENTRÉE LONG"],
              ],
            },
          },
          {
            heading: "Les erreurs du trader mono-timeframe",
            body: "Trader sur un seul timeframe, c'est voir l'arbre sans la forêt, ou la forêt sans les arbres. Les deux perspectives sont nécessaires.",
            items: [
              "Trader uniquement en M5 : signal correct mais dans le sens contraire du H4 → probabilité faible",
              "Trader uniquement en Daily : biais correct mais SL trop large, R/R médiocre",
              "Ignorer le contexte HTF : une belle structure M15 dans une Supply zone Daily = setup piège",
              "Solution : 3 timeframes minimum. HTF pour le contexte, intermédiaire pour la structure, LTF pour l'entrée",
            ],
          },
        ],
        keyPoints: [
          "HTF = direction et contexte. LTF = timing et entrée. Les deux sont indispensables.",
          "Top-down : analyse du Daily → H4 → H1 → M15. Toujours de haut en bas.",
          "N'entre sur LTF que si le signal va DANS le sens du HTF, pas contre.",
          "Un signal parfait sur M5 contre la tendance Daily a peu de chance de réussir.",
          "Plus les timeframes s'alignent, plus la probabilité est élevée.",
        ],
        exercise: {
          title: "Analyse top-down complète sur EUR/USD",
          steps: [
            "Ouvre EUR/USD sur TradingView. Commence par le Daily : quelle est la tendance ? Note le biais (haussier/baissier/neutre).",
            "Descends en H4 : le biais Daily se confirme-t-il ? Identifies-tu un pullback ou une zone de Supply/Demand ?",
            "Descends en H1 : y a-t-il une structure dans le sens du Daily ? Où est le prochain niveau H1 clé ?",
            "Descends en M15 : y a-t-il un signal de bougie (pin bar, engulfing) aligné avec le biais du Daily ? Note ton setup complet.",
          ],
        },
        quiz: {
          question: "Le Daily d'EUR/USD est en tendance baissière. Sur H1, tu vois un support solide avec une pin bar haussière. Que fais-tu ?",
          answers: [
            "Tu entres Long, la pin bar sur le support est un signal fort",
            "Tu ignores, le contexte Daily baissier rend ce setup peu fiable",
            "Tu entres Long mais avec un SL plus large que d'habitude",
            "Tu entres Short, le Daily baissier prend le dessus sur tout",
          ],
          correct: 1,
          explanation:
            "Une pin bar haussière sur support H1, dans un contexte Daily baissier, est un signal contre la tendance principale. Même si la configuration LTF est belle, le HTF commande. La probabilité de succès est significativement réduite. La bonne décision : ignorer ce setup et attendre un signal dans le sens du Daily.",
          answerExplanations: [
            "Faux. Entrer Long contre une tendance Daily baissière, même sur un signal LTF propre, c'est nager à contre-courant. Statistiquement, ces trades ont une probabilité de succès bien inférieure à 50%.",
            "Correct. Quand le HTF et le LTF sont en conflit, le HTF gagne. Le Daily baissier invalide les signaux Long sur H1. Attendre un signal Short aligné avec le contexte Daily est la bonne approche.",
            "Faux. Augmenter le SL ne résout pas le problème fondamental : la direction du trade est contre le contexte HTF. Un SL plus large amplifie juste la perte si le trade échoue.",
            "Faux. Entrer Short sur une pin bar haussière sans signal Short propre, c'est forcer un trade. Le signal est haussier sur H1, la réponse n'est pas d'entrer Short, c'est d'attendre un meilleur setup Short aligné avec le Daily.",
          ],
        },
      },

      // ─── Leçon 8 ─────────────────────────────────────────────────────────
      {
        id: "lecon-8",
        slug: "lecon8",
        title: "Plan de trade",
        duration: "20 min",
        introduction:
          "Les traders qui perdent improvisent. Les traders qui gagnent exécutent un plan. La différence entre les deux, c'est ce qu'ils décident AVANT d'entrer dans le trade. Un plan de trade te force à penser avant d'agir, pas pendant.",
        sections: [
          {
            heading: "Les 5 questions avant chaque trade",
            body: "Avant d'ouvrir une position, ces 5 questions doivent avoir une réponse claire. Si l'une est sans réponse, le trade n'est pas prêt.",
            items: [
              "1. Quel est mon biais directionnel ? (Haussier / Baissier selon le HTF)",
              "2. Pourquoi entrer ici ? (Niveau clé + confluence + signal de bougie)",
              "3. Où est mon Stop Loss ? (Niveau logique qui invalide mon analyse)",
              "4. Où est mon Take Profit ? (Prochain niveau de liquidité ou résistance/support)",
              "5. Quel est mon ratio R:R ? (Doit être minimum 1:2, viser au moins 2× le risque)",
            ],
          },
          {
            heading: "Entrée : où et pourquoi",
            body: "L'entrée est le moment où tout se joue. Entrer trop tôt = SL large et R/R mauvais. Entrer trop tard = R/R trop petit. L'entrée optimale se fait sur confirmation, pas sur anticipation.",
            items: [
              "Ne jamais entrer 'parce que ça semble monter', attendre un signal de bougie de confirmation",
              "Entrée précise : clôture d'une bougie de signal (pin bar, engulfing) sur un niveau clé",
              "Limite order vs Market order : un ordre limit te donne un meilleur prix mais peut ne jamais être déclenché",
              "Si le prix a déjà parcouru 70% du mouvement attendu : le setup est raté. Ne pas chasser.",
            ],
          },
          {
            heading: "Stop Loss et Take Profit : la règle du R:R",
            body: "Le ratio risque/récompense (R:R) est le fondement de toute stratégie rentable. Il détermine combien tu peux perdre de trades et rester profitable sur le long terme.",
            table: {
              headers: ["Ratio R:R", "Win Rate minimum pour être rentable", "Exemple concret"],
              rows: [
                ["1:1", "51% (très difficile à tenir)", "Risque 500 €, gagne 500 €"],
                ["1:2", "34% (réaliste)", "Risque 500 €, gagne 1 000 €"],
                ["1:3", "26% (confortable)", "Risque 500 €, gagne 1 500 €"],
                ["1:4", "21% (excellent)", "Risque 500 €, gagne 2 000 €"],
              ],
            },
          },
          {
            heading: "Exemple de plan de trade complet",
            body: "Instrument : EUR/USD. Biais : Haussier (H4 en tendance haussière, pullback sur support). Entrée : pin bar haussière sur support H1 à 1,0825. Stop Loss : 1,0800 (sous le support, -25 points). Take Profit : 1,0900 (prochaine résistance, +75 points). R:R = 1:3. Taille de position : 2% du capital = risque de 40 € → taille adaptée.",
            items: [
              "Le plan est écrit AVANT l'entrée, pas modifié en cours de route",
              "Le SL ne bouge jamais dans le sens de la perte, uniquement vers le Break Even si le trade avance",
              "Si le price action invalide la thèse avant l'entrée : annuler le trade sans remords",
              "Après le trade : noter le résultat et l'analyse dans son journal, qu'il soit gagnant ou perdant",
            ],
          },
        ],
        keyPoints: [
          "Un plan de trade = biais + entrée + SL + TP + R:R décidés AVANT d'ouvrir la position",
          "R:R minimum 1:2, avec 34% de win rate tu es déjà profitable à long terme",
          "N'entre jamais sans un niveau logique de SL, sinon c'est du jeu, pas du trading",
          "Si la thèse change avant l'entrée, annule le trade. Pas de FOMO.",
          "Après chaque trade, note le résultat : c'est le seul outil de progression réelle",
        ],
        exercise: {
          title: "Rédiger un plan de trade complet",
          steps: [
            "Sur TradingView, ouvre EUR/USD. Identifie ton biais directionnel sur H4.",
            "Identifie un setup potentiel : quel niveau attends-tu ? Quelle bougie de signal t'amènera à entrer ?",
            "Détermine le SL logique (sous/sur un niveau structurel) et le TP (prochain niveau clé).",
            "Calcule ton R:R. Est-il supérieur à 1:2 ? Si non, ce setup vaut-il la peine d'être pris ?",
          ],
        },
        quiz: {
          question: "Tu as un setup avec SL à 30 points et TP à 45 points. Ton capital est de 2 000 €, risque de 2%. Quel est ton ratio R:R et est-il acceptable ?",
          answers: [
            "R:R de 1,5:1, acceptable, tu vises plus que tu ne risques",
            "R:R de 1:1,5, insuffisant, il faut au minimum 1:2 pour un setup valide",
            "R:R de 2:1, excellent, tu risques 2 fois moins que tu ne gagnes",
            "Le R:R ne peut pas être calculé sans connaître le capital exact",
          ],
          correct: 1,
          explanation:
            "SL = 30 points, TP = 45 points. R:R = TP/SL = 45/30 = 1,5:1. Tu vises 1,5 fois ce que tu risques. C'est supérieur à 1:1 mais inférieur au minimum recommandé de 1:2. Avec ce ratio, tu as besoin de gagner plus de 40% de tes trades pour être rentable, ce qui est difficile à tenir sur la durée. Un TP à 60 points donnerait un R:R de 1:2, nettement plus sain.",
          answerExplanations: [
            "Faux sur l'évaluation. R:R de 1,5:1 (ou 1:1,5) est bien supérieur à 1:1, mais inférieur au minimum de 1:2. C'est passable mais pas optimal, il faut 40%+ de win rate pour être rentable avec ce ratio.",
            "Correct. 45/30 = 1:1,5. Ce ratio est insuffisant pour une stratégie saine sur le long terme. Il nécessite un win rate de 40% minimum. Mieux vaut chercher un TP plus loin (60+ points) pour atteindre un ratio 1:2.",
            "Faux. R:R de 2:1 voudrait dire que tu risques 2 fois plus que tu ne gagnes, ce serait catastrophique. Le bon ratio est l'inverse : tu vises 2 fois ce que tu risques (1:2), pas le contraire.",
            "Faux. Le R:R est un ratio, il se calcule uniquement avec la distance du SL et du TP, pas avec le capital. Capital × risque% = montant en euros risqué. Mais le ratio R:R = TP en points ÷ SL en points.",
          ],
        },
      },

      // ─── Leçon 9 ─────────────────────────────────────────────────────────
      {
        id: "lecon-9",
        slug: "lecon9",
        title: "Fibonacci : retracements et confluences",
        duration: "20 min",
        introduction:
          "Pourquoi le prix s'arrête-t-il si souvent aux mêmes ratios, 50%, 61.8%, 78.6% ? Fibonacci n'est pas de la magie. C'est un outil de mesure utilisé par des millions de traders et d'institutions. Et quand il s'aligne avec une zone clé, c'est l'une des confluences les plus puissantes.",
        sections: [
          {
            heading: "Les ratios Fibonacci : ce qu'ils représentent",
            body: "Fibonacci est un outil de mesure des retracements. Après un mouvement impulsif, le marché recule souvent d'une fraction prévisible avant de reprendre sa direction. Ces fractions correspondent aux ratios de Fibonacci.",
            items: [
              "23.6% : retracement faible, tendance très forte, le prix revient vite",
              "38.2% : retracement modéré, courant en tendance forte",
              "50% : retracement moyen, le niveau psychologique le plus observé par les traders",
              "61.8% : le 'Golden Ratio', le retracement le plus puissant et le plus fiable",
              "78.6% : retracement profond, souvent le dernier niveau avant invalidation de la structure",
            ],
          },
          {
            heading: "Comment tracer correctement un retracement",
            body: "L'erreur la plus commune : mal tracer le Fibonacci, ce qui donne des niveaux décalés. Il faut toujours tracer du point bas au point haut d'un mouvement impulsif (ou l'inverse pour une tendance baissière).",
            items: [
              "Tendance haussière : trace du dernier Low significatif vers le dernier High significatif",
              "Tendance baissière : trace du dernier High significatif vers le dernier Low significatif",
              "Sur TradingView : outil 'Fibonacci Retracement' → clique sur le Low, tire vers le High",
              "Important : utilise des swing points évidents, pas le moindre creux ou sommet",
            ],
          },
          {
            heading: "50% et 61.8% : les niveaux à surveiller",
            body: "En pratique, 90% des setups Fibonacci exploitables se concentrent sur les niveaux 50% et 61.8%. Ce sont les zones où les institutions placent leurs ordres lors des pullbacks.",
            table: {
              headers: ["Niveau", "Fiabilité", "Contexte idéal"],
              rows: [
                ["50%", "Élevée", "Tendance forte, pullback dans le calme, pas de nouvelles majeures"],
                ["61.8% (Golden Ratio)", "Très élevée", "Confluence avec support/résistance ou zone de Demand/Supply"],
                ["78.6%", "Modérée (risqué)", "Tendance encore intacte mais affaiblie, surveiller CHoCH"],
                ["38.2%", "Modérée", "Tendance très forte, seul, insuffisant pour une entrée"],
              ],
            },
          },
          {
            heading: "Confluence Fibonacci + structure : l'entrée de précision",
            body: "Fibonacci seul n'est pas suffisant. Sa puissance vient de la confluence avec d'autres éléments. Quand le 61.8% coïncide avec une zone de Demand, un support ou un BOS, c'est le setup optimal.",
            items: [
              "Exemple : EUR/USD monte de 1,0700 à 1,0950 (HH). Le 61.8% se situe à 1,0795.",
              "Si 1,0795 correspond aussi à un support H4 ou une zone de Demand → confluence forte",
              "Attends le prix à 1,0795 : signal de bougie (pin bar, engulfing) → entrée Long",
              "SL sous le 78.6% ou sous le Low du mouvement (selon la structure). TP au dernier High ou au niveau suivant.",
            ],
          },
        ],
        keyPoints: [
          "50% et 61.8% sont les niveaux Fibonacci les plus fiables en trading pratique",
          "Trace toujours du Low vers le High (haussier) ou du High vers le Low (baissier) sur un swing significatif",
          "Fibonacci seul = outil de mesure. Fibonacci + niveau clé = confluence puissante",
          "Le 61.8% (Golden Ratio) coïncidant avec une zone de Demand est l'un des setups les plus solides",
          "N'entre jamais sur un niveau Fibonacci sans confirmation de bougie",
        ],
        exercise: {
          title: "Tracer et utiliser Fibonacci sur BTC/USD",
          steps: [
            "Sur TradingView, ouvre BTC/USD en H4. Identifie le dernier mouvement impulsif haussier (Low → High évidents).",
            "Utilise l'outil 'Fibonacci Retracement' : clique sur le Low, tire jusqu'au High. Les niveaux s'affichent.",
            "Le prix est-il en pullback actuellement ? Quel niveau Fibonacci a-t-il atteint (50%, 61.8%, 78.6%) ?",
            "Y a-t-il un niveau de support ou une zone de Demand qui coïncide avec le 50% ou 61.8% ? Si oui, c'est une confluence à surveiller pour une entrée.",
          ],
        },
        quiz: {
          question: "BTC monte de 25 000 € à 35 000 €. Il pullback. Le niveau 61.8% de Fibonacci coïncide avec un support H4 à 28 820 €. Que fais-tu ?",
          answers: [
            "Tu entres Long immédiatement à 28 820 € dès que le prix touche ce niveau",
            "Tu ignores. Fibonacci n'est pas fiable seul",
            "Tu attends un signal de bougie de confirmation à 28 820 € avant d'entrer Long",
            "Tu entres Short, un pullback de 61.8% signifie que la tendance est terminée",
          ],
          correct: 2,
          explanation:
            "Le niveau 61.8% de Fibonacci qui coïncide avec un support H4 est une confluence puissante, mais elle ne justifie pas une entrée immédiate au toucher. Il faut attendre un signal de confirmation (pin bar, engulfing haussier) pour valider que le prix réagit vraiment à ce niveau. Le toucher sans confirmation peut être un transit vers des niveaux plus bas.",
          answerExplanations: [
            "Faux. Entrer au toucher d'un niveau Fibonacci sans confirmation de bougie, c'est anticiper sans preuve. Le prix peut transiter par 28 820 € vers 27 500 € (78.6%) sans réagir. Attends toujours le signal.",
            "Faux. Fibonacci seul n'est pas fiable, c'est vrai. Mais ici, il y a une CONFLUENCE : 61.8% + support H4. Cette confluence est précisément ce qui rend le setup valide. L'erreur serait de ne pas avoir de confirmation de bougie.",
            "Correct. Confluence 61.8% + support H4 = zone d'intérêt forte. Mais tu attends le signal de bougie (pin bar ou engulfing haussier) pour confirmer que le prix réagit à ce niveau. C'est l'entrée optimale : niveau fort + confirmation = setup complet.",
            "Faux. Un retracement de 61.8% en tendance haussière est un pullback profond mais normal. La tendance n'est pas terminée tant que le dernier Low significatif n'est pas cassé. 61.8% = zone d'achat potentielle, pas signal de vente.",
          ],
        },
      },

    ],
  },
];
