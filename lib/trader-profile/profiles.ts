// Templates de profils trader.
//
// Chaque template a un score de match calculé à partir des compétences.
// Le profil avec le meilleur match score devient le "Primary Profile".

import type { ProfileTemplate, SkillId } from "./types";

function avg(arr: number[]): number {
  if (arr.length === 0) return 50;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Bonus si la compétence est haute, malus si basse, neutre sinon
function high(s: number): number { return s >= 65 ? (s - 50) * 2 : 0; }
function low(s: number):  number { return s <= 35 ? (50 - s) * 2 : 0; }

export const PROFILES: ProfileTemplate[] = [
  {
    id: "discipline",
    name: "Trader discipliné",
    description: "Tu sais quand ne pas trader. Ta patience et ton respect du risque sont tes atouts. Continue à filtrer les setups médiocres.",
    match: (s) => avg([s.discipline, s.patience, s.rr_management]) + high(s.discipline),
  },
  {
    id: "impulsif",
    name: "Trader impulsif",
    description: "Tu prends trop de trades sans conviction. Tu réagis au lieu d'attendre. Travaille la patience et la discipline.",
    match: (s) => low(s.discipline) + low(s.patience) + (s.psychologie < 45 ? 20 : 0),
  },
  {
    id: "structure_reader",
    name: "Bon lecteur de structure",
    description: "Tu identifies bien les niveaux clés, swings et zones HTF. Travaille maintenant l'exécution et le R/R pour transformer cette lecture en edge.",
    match: (s) => high(s.structure) + high(s.lecture_marche) - low(s.execution) * 0.3,
  },
  {
    id: "aggressive",
    name: "Trader trop agressif",
    description: "Tu lis correctement le marché mais tu prends trop de risque par trade. Tes stops sont serrés, ton R/R est mal géré, ton capital souffre.",
    match: (s) => high(s.lecture_marche) + low(s.gestion_risque) + low(s.rr_management),
  },
  {
    id: "risk_manager",
    name: "Bon gestionnaire du risque",
    description: "Tu places tes stops à des distances cohérentes et ton R/R est solide. La prochaine étape : améliorer ta lecture pour multiplier les bonnes occasions.",
    match: (s) => high(s.gestion_risque) + high(s.rr_management) + high(s.structure) * 0.5,
  },
  {
    id: "breakout_hunter",
    name: "Chasseur de breakout",
    description: "Tu prends les cassures avec conviction. Méfie-toi des fakeouts — la liquidité au-dessus/dessous des niveaux est ton ennemie.",
    match: (s) => high(s.lecture_marche) + high(s.timing) - low(s.liquidite),
  },
  {
    id: "emotional",
    name: "Trader émotionnel",
    description: "Le revenge trade et le FOMO te coûtent cher. Tes décisions psychologiques pèsent sur ta performance. Une pause après 2 stops d'affilée changerait tout.",
    match: (s) => low(s.psychologie) + low(s.discipline) * 0.5,
  },
  {
    id: "patient",
    name: "Trader patient",
    description: "Tu attends les bons setups, tu ne forces rien. Continue de cultiver cette qualité — c'est l'arme #1 du trader long-terme.",
    match: (s) => high(s.patience) + high(s.discipline) - (s.psychologie < 45 ? 20 : 0),
  },
  {
    id: "analyst_no_executor",
    name: "Bon analyste, mauvaise exécution",
    description: "Tu lis correctement le marché, mais le spread, la session et le timing ruinent tes trades. La technique seule ne suffit pas — l'exécution est partie du edge.",
    match: (s) => high(s.lecture_marche) + low(s.execution) + low(s.timing) * 0.5,
  },
  {
    id: "liquidity_aware",
    name: "Lecteur de liquidité",
    description: "Tu vois les sweeps et anticipes les pièges institutionnels. Combine cette compétence avec un meilleur R/R pour transformer cet edge en performance.",
    match: (s) => high(s.liquidite) + high(s.structure) * 0.5,
  },
  {
    id: "neutral",
    name: "Trader en développement",
    description: "Pas encore assez de signaux pour identifier un profil dominant. Continue à jouer en alternant les jeux et les niveaux — ton profil se précisera.",
    match: (s) => {
      // Score neutre si toutes les skills sont autour de 50 (peu de signal)
      const values = Object.values(s);
      const dev = avg(values.map(v => Math.abs(v - 50)));
      return dev < 8 ? 60 : 0;
    },
  },
];

// Recommandations par compétence faible. Pointe vers un jeu et idéalement
// une leçon complémentaire.
export const RECOMMENDATIONS_BY_SKILL: Record<SkillId, {
  reason:    string;
  gameUrl:   string;
  gameLabel: string;
  lessonUrl?:   string;
  lessonLabel?: string;
}> = {
  discipline: {
    reason:      "Tu acceptes trop de trades médiocres. Le NO TRADE est aussi une décision.",
    gameUrl:     "/jeux/buy-sell-no-trade",
    gameLabel:   "BUY / SELL / NO TRADE — niveau avancé",
    lessonUrl:   "/formations/debutant/lecon1",
    lessonLabel: "La discipline de l'attente",
  },
  lecture_marche: {
    reason:      "Tu manques régulièrement le sens du marché ou le HTF.",
    gameUrl:     "/jeux/buy-sell-no-trade",
    gameLabel:   "BUY / SELL / NO TRADE — niveau intermédiaire",
    lessonUrl:   "/formations/intermediaire/lecon1",
    lessonLabel: "Lecture HTF & structure",
  },
  gestion_risque: {
    reason:      "Tes stops sont mal placés — trop serrés ou trop larges.",
    gameUrl:     "/jeux/place-stop",
    gameLabel:   "Quel stop va survivre ? — niveau intermédiaire",
    lessonUrl:   "/formations/debutant/lecon3",
    lessonLabel: "Placement des stops",
  },
  timing: {
    reason:      "Tu entres trop tôt ou trop tard. Le timing est crucial.",
    gameUrl:     "/jeux/build-the-trade",
    gameLabel:   "Build the Trade — choix de l'entrée",
  },
  liquidite: {
    reason:      "Tu rates les sweeps ou tombes dans les pièges à liquidité.",
    gameUrl:     "/jeux/find-the-mistake",
    gameLabel:   "Trouve l'erreur — niveau avancé",
    lessonUrl:   "/strategies/ict/lecon1",
    lessonLabel: "Liquidité & sweeps (ICT)",
  },
  structure: {
    reason:      "Tu lis mal les niveaux clés et la structure HTF.",
    gameUrl:     "/jeux/place-stop",
    gameLabel:   "Quel stop va survivre ? — apprend la structure",
    lessonUrl:   "/strategies/support-resistance/lecon1",
    lessonLabel: "Support / Résistance",
  },
  psychologie: {
    reason:      "Tes décisions sont affectées par le FOMO, le revenge trade ou la surconfiance.",
    gameUrl:     "/jeux/find-the-mistake",
    gameLabel:   "Trouve l'erreur — focus psychologie",
  },
  execution: {
    reason:      "Tu ignores le spread, la session et la volatilité. La technique seule ne suffit pas.",
    gameUrl:     "/jeux/find-the-mistake",
    gameLabel:   "Trouve l'erreur — focus exécution",
  },
  patience: {
    reason:      "Tu chases les mouvements au lieu d'attendre la bonne entrée.",
    gameUrl:     "/jeux/build-the-trade",
    gameLabel:   "Build the Trade — choix de la confirmation",
  },
  rr_management: {
    reason:      "Ton ratio risque/rendement est trop bas. Tu prends de mauvais trades à RR.",
    gameUrl:     "/jeux/build-the-trade",
    gameLabel:   "Build the Trade — équilibre RR",
    lessonUrl:   "/formations/debutant/lecon4",
    lessonLabel: "Ratio risque/rendement",
  },
};
