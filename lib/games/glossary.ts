// Glossaire des jeux = vocabulaire des leçons TSX (FR, ES).
//
// - GLOSSARY : termes techniques affichés dans les jeux, avec le terme retenu,
//   sa leçon source et une explication courte (mots des leçons). Sert aux
//   explications du jargon (niveaux débutant et intermédiaire, à la première
//   apparition) et à l'audit (npm run audit:jeux).
// - REPLACED : termes retirés des jeux (absents des leçons ou doublons d'une
//   même notion) → terme retenu. L'audit vérifie qu'ils ne réapparaissent pas.
// - ZONE_LABELS : seuls libellés de zones autorisés sur les graphiques.
//
// Termes absents des leçons, gardés car courants chez les traders : ATR,
// PDL / PDH, « Piso del rango » (ES). Signalés « hors leçons ».

export type GlossaryLocale = "fr" | "es";

export interface GlossaryEntry {
  id: string;
  /** Terme affiché (en tête de l'explication) */
  term: Record<GlossaryLocale, string>;
  /** Détection du terme dans un texte affiché */
  match: Record<GlossaryLocale, RegExp>;
  /** Explication courte, avec les mots des leçons */
  def: Record<GlossaryLocale, string>;
  /** Leçon source (ou « hors leçons ») */
  source: string;
  /** Définition déjà portée par les textes, entre parenthèses : gardée à sa
   *  première apparition à l'écran seulement (firstDefinitionOnly) */
  inlineDef?: Record<GlossaryLocale, string>;
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: "fvg", source: "Avancé · leçon 2 (Fair Value Gap)",
    term: { fr: "FVG", es: "FVG" },
    match: { fr: /\bFVG\b/, es: /\bFVG\b/ },
    def: {
      fr: "Fair Value Gap, un déséquilibre laissé par une bougie impulsive : un écart de prix que le marché revient souvent combler.",
      es: "Fair Value Gap, un desequilibrio dejado por una vela impulsiva: un hueco de precio que el mercado suele volver a llenar.",
    },
  },
  {
    id: "liquidity", source: "Avancé · leçon 1 (Liquidité)",
    term: { fr: "Liquidité", es: "Liquidity" },
    match: { fr: /liquidit[ée]/i, es: /\bliquidity\b/i },
    def: {
      fr: "la capacité à exécuter un ordre sans faire bouger le prix ; elle s'accumule là où se trouvent beaucoup de stops (sommets, creux).",
      es: "la capacidad de ejecutar una orden sin mover el precio; se acumula donde hay muchos stops (máximos, mínimos).",
    },
  },
  {
    id: "rr", source: "Débutant · leçon 6 (Le Take Profit)",
    term: { fr: "R/R", es: "R/R" },
    match: { fr: /\bR\/R\b/, es: /\bR\/R\b/ },
    def: {
      fr: "ratio risque/récompense : ce que le trade peut rapporter pour 1 risqué.",
      es: "ratio riesgo/beneficio: lo que el trade puede aportar por cada 1 arriesgado.",
    },
  },
  {
    id: "sweep", source: "Avancé · leçon 4 (Killzones)",
    term: { fr: "Sweep", es: "Sweep" },
    match: { fr: /\bsweep/i, es: /\bsweep/i },
    def: {
      fr: "le prix passe brièvement au-delà d'un sommet ou d'un creux pour prendre la liquidité, puis repart.",
      es: "el precio supera brevemente un máximo o un mínimo para tomar la liquidity y luego vuelve.",
    },
  },
  {
    id: "stop-hunt", source: "Avancé · leçon 6 (Stop Hunts)",
    term: { fr: "Stop hunt", es: "Stop hunt" },
    match: { fr: /stop hunt/i, es: /stop hunt/i },
    def: {
      fr: "mouvement brusque qui déclenche les stops accumulés avant de repartir en sens inverse.",
      es: "movimiento brusco que activa los stops acumulados antes de girar en sentido contrario.",
    },
  },
  {
    id: "htf", source: "Stratégies · ICT, leçon 1",
    term: { fr: "HTF", es: "HTF" },
    match: { fr: /\bHTF\b/, es: /\bHTF\b/ },
    def: {
      fr: "l'unité de temps supérieure (H4, Daily), celle qui donne le biais directionnel.",
      es: "la temporalidad superior (H4, Daily), la que da el sesgo direccional.",
    },
  },
  {
    id: "sl", source: "Débutant · leçon 5 (Le Stop Loss)",
    term: { fr: "Stop loss (SL)", es: "Stop loss (SL)" },
    match: { fr: /\bSL\b|stop loss/i, es: /\bSL\b|stop loss/i },
    def: {
      fr: "l'ordre qui coupe la perte si le prix va contre toi.",
      es: "la orden que corta la pérdida si el precio va en tu contra.",
    },
  },
  {
    id: "tp", source: "Débutant · leçon 6 (Le Take Profit)",
    term: { fr: "Take profit (TP)", es: "Take profit (TP)" },
    match: { fr: /\bTP\b|take profit/i, es: /\bTP\b|take profit/i },
    def: {
      fr: "l'ordre qui encaisse le gain à l'objectif.",
      es: "la orden que cobra la ganancia en el objetivo.",
    },
  },
  {
    id: "spread", source: "Débutant · leçon 4 (Spread, Bid et Ask)",
    term: { fr: "Spread", es: "Spread" },
    match: { fr: /\bspread/i, es: /\bspread/i },
    def: {
      fr: "l'écart entre le prix d'achat et le prix de vente, un coût payé à chaque trade.",
      es: "la diferencia entre el precio de compra y el de venta, un coste pagado en cada trade.",
    },
  },
  {
    id: "atr", source: "hors leçons (terme courant)",
    term: { fr: "ATR", es: "ATR" },
    inlineDef: { fr: "(ATR, l'amplitude moyenne d'une journée)", es: "(ATR, la amplitud media de una jornada)" },
    match: { fr: /\bATR\b/, es: /\bATR\b/ },
    def: {
      fr: "l'amplitude moyenne d'une journée, une mesure de la volatilité.",
      es: "la amplitud media de una jornada, una medida de la volatilidad.",
    },
  },
  {
    id: "pdl", source: "hors leçons (terme courant)",
    term: { fr: "PDL / PDH", es: "PDL / PDH" },
    match: { fr: /\bPD[LH]\b/, es: /\bPD[LH]\b/ },
    def: {
      fr: "plus bas / plus haut de la veille (Previous Day Low / High), des niveaux souvent visés par les stop hunts.",
      es: "mínimo / máximo del día anterior (Previous Day Low / High), niveles a menudo buscados por los stop hunts.",
    },
  },
  {
    id: "equal-lows", source: "Avancé · leçon 1 (Liquidité)",
    term: { fr: "Equal lows", es: "Equal lows" },
    match: { fr: /equal (?:lows|highs)/i, es: /equal (?:lows|highs)/i },
    def: {
      fr: "deux creux au même niveau, cibles favorites des stop hunts.",
      es: "dos mínimos al mismo nivel, objetivos favoritos de los stop hunts.",
    },
  },
  {
    id: "swing", source: "Intermédiaire · leçon 9 (Fibonacci)",
    term: { fr: "Swing low / swing high", es: "Swing low / swing high" },
    match: { fr: /swing (?:low|high)/i, es: /swing (?:low|high)/i },
    def: {
      fr: "creux / sommet marquant d'un mouvement.",
      es: "mínimo / máximo marcado de un movimiento.",
    },
  },
  {
    id: "fakeout", source: "Intermédiaire · leçon 6 (Fake Breakout)",
    term: { fr: "Fakeout", es: "Fakeout" },
    match: { fr: /fakeout/i, es: /fakeout/i },
    def: {
      fr: "cassure qui ne tient pas : le prix revient de l'autre côté du niveau.",
      es: "ruptura que no se sostiene: el precio vuelve al otro lado del nivel.",
    },
  },
  {
    id: "pullback", source: "Intermédiaire · leçon 2 (Support & Résistance)",
    term: { fr: "Pullback", es: "Pullback" },
    match: { fr: /pullback/i, es: /pullback/i },
    def: {
      fr: "retour du prix vers un niveau (souvent le niveau cassé) avant de repartir dans le sens de la tendance.",
      es: "vuelta del precio hacia un nivel (a menudo el nivel roto) antes de seguir en el sentido de la tendencia.",
    },
  },
  {
    id: "retest", source: "Intermédiaire · leçon 3 (Supply & Demand)",
    term: { fr: "Retest", es: "Retest" },
    match: { fr: /retest/i, es: /retest/i },
    def: {
      fr: "le prix revient tester un niveau qu'il vient de casser.",
      es: "el precio vuelve a probar un nivel que acaba de romper.",
    },
  },
  {
    id: "order-block", source: "Avancé · leçon 3 (Order Blocks)",
    term: { fr: "Order Block", es: "Order Block" },
    match: { fr: /order block/i, es: /order block/i },
    def: {
      fr: "la dernière bougie opposée avant un mouvement d'expansion violent.",
      es: "la última vela opuesta antes de un movimiento de expansión violento.",
    },
  },
  {
    id: "mitigation", source: "Avancé · leçon 3 (Order Blocks)",
    term: { fr: "Mitigation", es: "Mitigation" },
    match: { fr: /mitigat/i, es: /mitigat|mitigaci/i },
    def: {
      fr: "le retour du prix dans une zone (Order Block, FVG) ; une fois mitigée, la zone perd sa force.",
      es: "la vuelta del precio a una zona (Order Block, FVG); una vez mitigada, la zona pierde su fuerza.",
    },
  },
  {
    id: "drawdown", source: "Débutant · leçon 10 (Risk management)",
    term: { fr: "Drawdown", es: "Drawdown" },
    match: { fr: /drawdown/i, es: /drawdown/i },
    def: {
      fr: "la baisse maximale du trade (ou du compte) avant qu'il ne remonte.",
      es: "la caída máxima del trade (o de la cuenta) antes de recuperarse.",
    },
  },
  {
    id: "supply-demand", source: "Intermédiaire · leçon 3 (Supply & Demand)",
    term: { fr: "Zone de demand / supply", es: "Zona de demand / supply" },
    match: { fr: /zones? de (?:demand|supply)/i, es: /zonas? de (?:demand|supply)/i },
    def: {
      fr: "zone d'où le prix est reparti violemment, à la hausse pour une demand, à la baisse pour une supply.",
      es: "zona desde la que el precio salió con violencia, al alza para una demand, a la baja para una supply.",
    },
  },
  {
    id: "psychological", source: "Intermédiaire · leçon 5 (Confluences)",
    term: { fr: "Niveau psychologique", es: "Nivel psicológico" },
    match: { fr: /niveaux? psychologiques?/i, es: /nivel(?:es)? psicol[óo]gicos?/i },
    def: {
      fr: "chiffre rond (ex. 1,1000) très surveillé par les traders.",
      es: "número redondo (ej. 1,1000) muy vigilado por los traders.",
    },
  },
  {
    id: "impulse-candle", source: "Avancé · leçon 2 (Fair Value Gap)",
    term: { fr: "Bougie impulsive", es: "Vela impulsiva" },
    match: { fr: /bougies? impulsives?/i, es: /velas? impulsivas?/i },
    def: {
      fr: "grande bougie directionnelle, souvent sans mèche.",
      es: "vela grande y direccional, a menudo sin mecha.",
    },
  },
  {
    id: "hl", source: "Intermédiaire · leçon 1 (Structure de marché)",
    term: { fr: "HL (Higher Low)", es: "HL (Higher Low)" },
    match: { fr: /\bHL\b/, es: /\bHL\b/ },
    def: {
      fr: "creux plus haut que le précédent, signe d'une structure haussière.",
      es: "mínimo más alto que el anterior, señal de estructura alcista.",
    },
  },
  {
    id: "invalidation", source: "Stratégies · ICT, leçon 2",
    term: { fr: "Invalidation", es: "Invalidación" },
    match: { fr: /invalidation/i, es: /invalidaci[óo]n/i },
    def: {
      fr: "le niveau où l'idée de trade n'est plus valable, là où se place le stop.",
      es: "el nivel donde la idea de trade deja de ser válida, donde se coloca el stop.",
    },
  },
  {
    id: "range", source: "Intermédiaire · leçon 2 (Support & Résistance)",
    term: { fr: "Range", es: "Rango (range)" },
    match: { fr: /\brange\b/i, es: /\brango\b|\brange\b/i },
    def: {
      fr: "marché qui oscille entre un haut et un bas, sans tendance.",
      es: "mercado que oscila entre un techo y un piso, sin tendencia.",
    },
  },
  {
    id: "momentum", source: "Intermédiaire · leçon 6 (Fake Breakout)",
    term: { fr: "Momentum", es: "Momentum" },
    match: { fr: /momentum/i, es: /momentum/i },
    def: {
      fr: "la force du mouvement en cours.",
      es: "la fuerza del movimiento en curso.",
    },
  },
  {
    id: "bias", source: "Intermédiaire · leçon 7 (Analyse Multi-Timeframe)",
    term: { fr: "Biais", es: "Sesgo" },
    match: { fr: /\bbiais\b/i, es: /\bsesgo\b/i },
    def: {
      fr: "la direction privilégiée, donnée par l'unité de temps supérieure.",
      es: "la dirección favorecida, dada por la temporalidad superior.",
    },
  },
  {
    id: "macro-news", source: "Macro · Débutant",
    term: { fr: "FOMC, NFP, CPI", es: "FOMC, NFP, CPI" },
    match: { fr: /\b(?:FOMC|NFP|CPI)\b/, es: /\b(?:FOMC|NFP|CPI)\b/ },
    def: {
      fr: "grandes annonces macro (taux de la Fed, emploi américain, inflation) qui font souvent bondir la volatilité.",
      es: "grandes anuncios macro (tipos de la Fed, empleo estadounidense, inflación) que suelen disparar la volatilidad.",
    },
  },
];

/** Termes du glossaire présents dans des textes affichés, dans l'ordre d'apparition. */
export function termsIn(texts: string[], locale: string | undefined): GlossaryEntry[] {
  const loc: GlossaryLocale = locale === "es" ? "es" : "fr";
  const joined = texts.filter(Boolean).join("\n");
  return GLOSSARY
    .map((g) => ({ g, at: joined.search(g.match[loc]) }))
    .filter((x) => x.at >= 0)
    .sort((a, b) => a.at - b.at)
    .map((x) => x.g);
}

/**
 * Définitions portées par les textes (ex. « (ATR, l'amplitude moyenne d'une
 * journée) ») : gardées à leur première apparition dans une suite de textes
 * affichés ensemble (ordre d'affichage), raccourcies ensuite en « (ATR) ».
 */
export function firstDefinitionOnly(texts: string[], locale: string | undefined): string[] {
  const loc: GlossaryLocale = locale === "es" ? "es" : "fr";
  const defs = GLOSSARY.filter((g) => g.inlineDef).map((g) => ({ full: g.inlineDef![loc], short: `(${g.term[loc]})` }));
  const seen = new Set<string>();
  return texts.map((t) => defs.reduce((acc, d) => {
    if (!acc.includes(d.full)) return acc;
    const first = !seen.has(d.full);
    seen.add(d.full);
    const parts = acc.split(d.full);
    return first ? parts[0] + d.full + parts.slice(1).join(d.short) : parts.join(d.short);
  }, t));
}

/**
 * Termes retirés des jeux → terme retenu, et leçon source. Les motifs
 * vérifiés par l'audit sont ceux de la colonne « from ».
 */
export const REPLACED: Record<GlossaryLocale, { from: RegExp; to: string; source: string }[]> = {
  fr: [
    { from: /zones? d'offre/i, to: "zone de supply", source: "Intermédiaire · leçon 3" },
    { from: /zones? de demande/i, to: "zone de demand", source: "Intermédiaire · leçon 3" },
    { from: /précédent (?:low|high)/i, to: "dernier creux / dernier sommet", source: "Intermédiaire · leçon 1" },
    { from: /plafond|plancher/i, to: "haut du range / bas du range", source: "Intermédiaire · leçon 2" },
    { from: /chasses? aux stops|zone de chasse/i, to: "stop hunt / zone de stop hunt", source: "Avancé · leçon 6" },
    { from: /round number/i, to: "niveau psychologique", source: "Intermédiaire · leçon 5" },
    { from: /tight stop/i, to: "stop serré", source: "Débutant · leçon 5" },
    { from: /weekly (?:high|low)/i, to: "plus haut / plus bas de la semaine", source: "hors leçons" },
    { from: /chiffres? ronds?/i, to: "niveau psychologique", source: "Intermédiaire · leçon 5" },
    { from: /niveau magnétique/i, to: "niveau clé", source: "Intermédiaire · leçons 2 et 5" },
    { from: /asia high/i, to: "haut de la session asiatique", source: "hors leçons (sessions : Avancé · leçon 4)" },
    { from: /bougies? de force/i, to: "bougie impulsive", source: "Avancé · leçon 2" },
    { from: /zone douteuse/i, to: "niveau secondaire", source: "Intermédiaire · leçon 2" },
    { from: /position sizing/i, to: "taille de position", source: "Débutant · leçon 8" },
    { from: /wick fakeout/i, to: "mèche du fakeout", source: "Intermédiaire · leçon 6" },
    { from: /faux breakout/i, to: "fakeout", source: "Intermédiaire · leçon 6" },
    { from: /\bRR\b/, to: "R/R", source: "Débutant · leçon 6" },
  ],
  es: [
    { from: /zonas? de oferta/i, to: "zona de supply", source: "Intermedio · lección 3" },
    { from: /zonas? de demanda/i, to: "zona de demand", source: "Intermedio · lección 3" },
    { from: /(?:low|high) (?:previo|anterior)/i, to: "último mínimo / último máximo", source: "Intermedio · lección 1" },
    { from: /cazas? de stops|zona de caza/i, to: "stop hunt / zona de stop hunt", source: "Avanzado · lección 6" },
    { from: /round number/i, to: "nivel psicológico", source: "Intermedio · lección 5" },
    { from: /tight stop/i, to: "stop ajustado", source: "Principiante · lección 5" },
    { from: /weekly (?:high|low)/i, to: "máximo / mínimo de la semana", source: "hors leçons" },
    { from: /n[úu]meros? redondos?/i, to: "nivel psicológico", source: "Intermedio · lección 5" },
    { from: /nivel magnético/i, to: "nivel clave", source: "Intermedio · lecciones 2 y 5" },
    { from: /asia high/i, to: "máximo de la sesión asiática", source: "hors leçons (sesiones : Avanzado · lección 4)" },
    { from: /velas? de fuerza/i, to: "vela impulsiva", source: "Avanzado · lección 2" },
    { from: /zona dudosa/i, to: "nivel secundario", source: "Intermedio · lección 2" },
    { from: /position sizing/i, to: "tamaño de posición", source: "Principiante · lección 8" },
    { from: /wick del fakeout/i, to: "mecha del fakeout", source: "Intermedio · lección 6" },
    { from: /falso breakout/i, to: "fakeout", source: "Intermedio · lección 6" },
    { from: /\bimbalance\b/i, to: "desequilibrio", source: "Estrategias · ICT, lección 2" },
    { from: /\bbias\b/i, to: "sesgo", source: "Intermedio · lección 7" },
    { from: /\bliquidez\b/i, to: "liquidity", source: "Avanzado · lección 1" },
    { from: /\bRR\b/, to: "R/R", source: "Principiante · lección 6" },
  ],
};

/** Libellés de zones autorisés sur les graphiques (FR / ES), tous couverts par les leçons sauf mention. */
export const ZONE_LABELS: Record<GlossaryLocale, string[]> = {
  fr: [
    "FVG haussier", "Order Block", "Liquidité au-dessus", "Liquidité en-dessous", "Liquidité balayée",
    "Dernier sommet", "Dernier creux", "Sweep haut", "Sweep bas", "Haut du range", "Bas du range",
    "Résistance", "Résistance HTF", "Résistance cassée", "Support", "Support HTF", "Support cassé",
    "Zone de supply", "Zone de demand", "Niveau secondaire", "Mèche du fakeout", "Swing high", "Swing low",
    "Fakeouts précédents", "Zone de stop hunt", "Equal lows", "Haut de la session asiatique", "Niveau clé",
    "Niveau psychologique", "HL H4", "PDL", "Swing high 1", "Swing high 2", "Swing high 3", "Swing low 1",
    "Swing low 2", "Swing low 3", "Swing high évident", "Swing low évident", "Swing low H1",
    // niveau avancé : libellés génériques
    "Niveau bas", "Niveau haut", "Déséquilibre", "Liquidité",
  ],
  es: [
    "FVG alcista", "Order Block", "Liquidity arriba", "Liquidity abajo", "Liquidity barrida",
    "Último máximo", "Último mínimo", "Sweep arriba", "Sweep abajo", "Techo del rango", "Piso del rango",
    "Resistencia", "Resistencia HTF", "Resistencia rota", "Soporte", "Soporte HTF", "Soporte roto",
    "Zona de supply", "Zona de demand", "Nivel secundario", "Mecha del fakeout", "Swing high", "Swing low",
    "Fakeouts anteriores", "Zona de stop hunt", "Equal lows", "Máximo de la sesión asiática", "Nivel clave",
    "Nivel psicológico", "HL H4", "PDL", "Swing high 1", "Swing high 2", "Swing high 3", "Swing low 1",
    "Swing low 2", "Swing low 3", "Swing high evidente", "Swing low evidente", "Swing low H1",
    "Nivel bajo", "Nivel alto", "Desequilibrio", "Liquidity",
  ],
};
