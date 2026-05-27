export interface Lesson {
  id: string;
  title: string;
  duration: string;
  href: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeStyle: string;
  premium: boolean;
  disabled?: boolean;
  lessons: Lesson[];
}

export const FORMATIONS: Formation[] = [
  {
    id: "debutant",
    title: "Débutant",
    description: "Les fondamentaux du trading pour partir sur de bonnes bases. Aucun prérequis.",
    badge: "Gratuit",
    badgeStyle: "bg-zinc-700 text-zinc-300",
    premium: false,
    lessons: [
      { id: "lecon1", title: "C'est quoi le trading ?",           duration: "8 min",  href: "/formations/debutant/lecon1" },
      { id: "lecon2", title: "Acheter / Vendre : Long et Short",  duration: "9 min",  href: "/formations/debutant/lecon2" },
      { id: "lecon3", title: "Lire un graphique en bougies",      duration: "10 min", href: "/formations/debutant/lecon3" },
      { id: "lecon4", title: "Spread, Bid et Ask",                duration: "8 min",  href: "/formations/debutant/lecon4" },
      { id: "lecon5", title: "Le Stop Loss",                      duration: "10 min", href: "/formations/debutant/lecon5" },
      { id: "lecon6", title: "Le Take Profit",                    duration: "9 min",  href: "/formations/debutant/lecon6" },
      { id: "lecon7", title: "Le Break Even",                     duration: "8 min",  href: "/formations/debutant/lecon7" },
      { id: "lecon8", title: "Gestion du risque : le money management", duration: "12 min", href: "/formations/debutant/lecon8" },
      { id: "lecon9", title: "Les erreurs des débutants",         duration: "11 min", href: "/formations/debutant/lecon9" },
      { id: "lecon10", title: "Risk management : pourquoi 90% des traders perdent", duration: "13 min", href: "/formations/debutant/lecon10" },
    ],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    description: "Structure de marché, zones institutionnelles et lecture avancée du prix.",
    badge: "Intermédiaire",
    badgeStyle: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    premium: false,
    lessons: [
      { id: "lecon1", title: "Structure de marché : BOS & CHoCH",  duration: "20 min", href: "/formations/intermediaire/lecon1" },
      { id: "lecon2", title: "Zones clés : Support & Résistance", duration: "22 min", href: "/formations/intermediaire/lecon2" },
      { id: "lecon3", title: "Supply & Demand",                        duration: "20 min", href: "/formations/intermediaire/lecon3" },
      { id: "lecon4", title: "Tendances : trader dans le sens du marché", duration: "18 min", href: "/formations/intermediaire/lecon4" },
      { id: "lecon5", title: "Confluences et probabilité",             duration: "20 min", href: "/formations/intermediaire/lecon5" },
      { id: "lecon6", title: "Fake Breakout : ne pas se faire piéger", duration: "18 min", href: "/formations/intermediaire/lecon6" },
      { id: "lecon7", title: "Analyse Multi-Timeframe",                duration: "22 min", href: "/formations/intermediaire/lecon7" },
      { id: "lecon8", title: "Plan de trade",                          duration: "20 min", href: "/formations/intermediaire/lecon8" },
      { id: "lecon9", title: "Fibonacci : retracements et confluences", duration: "20 min", href: "/formations/intermediaire/lecon9" },
    ],
  },
  {
    id: "avance",
    title: "Avancé",
    description: "Liquidité institutionnelle, Smart Money et techniques de trading de précision.",
    badge: "Avancé",
    badgeStyle: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
    premium: false,
    lessons: [
      { id: "lecon1", title: "Liquidité : comprendre les pools d'ordres", duration: "25 min", href: "/formations/avance/lecon1" },
      { id: "lecon2", title: "Fair Value Gap (FVG)",                   duration: "20 min", href: "/formations/avance/lecon2" },
      { id: "lecon3", title: "Order Blocks",                           duration: "24 min", href: "/formations/avance/lecon3" },
      { id: "lecon4", title: "Killzones : les sessions qui comptent",  duration: "20 min", href: "/formations/avance/lecon4" },
      { id: "lecon5", title: "OTE : Optimal Trade Entry",              duration: "22 min", href: "/formations/avance/lecon5" },
      { id: "lecon6", title: "Stop Hunts : la chasse aux stops",       duration: "22 min", href: "/formations/avance/lecon6" },
      { id: "lecon7", title: "Entrées de précision",                   duration: "25 min", href: "/formations/avance/lecon7" },
      { id: "lecon8", title: "Journaling : analyser pour progresser",  duration: "18 min", href: "/formations/avance/lecon8" },
      { id: "lecon9", title: "Backtesting : valider sa stratégie",     duration: "22 min", href: "/formations/avance/lecon9" },
    ],
  },
  {
    id: "mt5",
    title: "Trader en pratique (MT5)",
    description: "Maîtriser MetaTrader 5 de A à Z : interface, ordres, gestion des positions.",
    badge: "Gratuit",
    badgeStyle: "bg-zinc-700 text-zinc-300",
    premium: false,
    disabled: true,
    lessons: [
      { id: "lecon1", title: "Installer MetaTrader 5",            duration: "6 min",  href: "/formations/mt5/lecon1" },
      { id: "lecon2", title: "L'interface de MT5",                duration: "10 min", href: "/formations/mt5/lecon2" },
      { id: "lecon3", title: "Passer ton premier trade",          duration: "10 min", href: "/formations/mt5/lecon3" },
      { id: "lecon4", title: "Stop Loss et Take Profit dans MT5", duration: "9 min",  href: "/formations/mt5/lecon4" },
      { id: "lecon5", title: "Taille de lot",                     duration: "8 min",  href: "/formations/mt5/lecon5" },
      { id: "lecon6", title: "Calcul du risque",                  duration: "10 min", href: "/formations/mt5/lecon6" },
      { id: "lecon7", title: "Modifier un trade ouvert",          duration: "8 min",  href: "/formations/mt5/lecon7" },
      { id: "lecon8", title: "Fermer un trade",                   duration: "7 min",  href: "/formations/mt5/lecon8" },
      { id: "lecon9", title: "Exemple de trade complet",          duration: "12 min", href: "/formations/mt5/lecon9" },
    ],
  },
];
