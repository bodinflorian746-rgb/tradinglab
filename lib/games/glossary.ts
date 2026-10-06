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
  /** Explication courte, avec les mots des leçons (débutant, intermédiaire) */
  def: Record<GlossaryLocale, string>;
  /** Leçon source (ou « hors leçons ») */
  source: string;
  /** Explication plus courte (avancé) */
  short: Record<GlossaryLocale, string>;
  /** Terme absent des leçons, gardé car courant chez les traders (signalé) */
  outsideLessons?: true;
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
      fr: "Fair Value Gap, un déséquilibre laissé par une bougie de displacement : un écart de prix que le marché revient souvent combler.",
      es: "Fair Value Gap, un desequilibrio dejado por una vela impulsiva: un hueco de precio que el mercado suele volver a llenar.",
    },
    short: { fr: "déséquilibre laissé par une bougie de displacement.", es: "desequilibrio dejado por una vela impulsiva." },
  },
  {
    id: "liquidity", source: "Avancé · leçon 1 (Liquidité)",
    term: { fr: "Liquidité", es: "Liquidez" },
    match: { fr: /liquidit[ée]/i, es: /\bliquidez\b/i },
    def: {
      fr: "la capacité à exécuter un ordre sans faire bouger le prix ; elle s'accumule là où se trouvent beaucoup de stops (sommets, creux).",
      es: "la capacidad de ejecutar una orden sin mover el precio; se acumula donde hay muchos stops (máximos, mínimos).",
    },
    short: { fr: "les stops accumulés près des sommets et des creux.", es: "los stops acumulados cerca de máximos y mínimos." },
  },
  {
    id: "rr", source: "Débutant · leçon 6 (Le Take Profit)",
    term: { fr: "R/R", es: "R/R" },
    match: { fr: /\bR\/R\b/, es: /\bR\/R\b/ },
    def: {
      fr: "ratio risque/rendement : ce que le trade peut rapporter pour 1 risqué.",
      es: "ratio riesgo/beneficio: lo que el trade puede aportar por cada 1 arriesgado.",
    },
    short: { fr: "ratio risque/rendement.", es: "ratio riesgo/beneficio." },
  },
  {
    id: "sweep", source: "Avancé · leçon 4 (Killzones)",
    term: { fr: "Sweep", es: "Barrido" },
    match: { fr: /\bsweep/i, es: /\bbarridos?\b/i },
    def: {
      fr: "le prix passe brièvement au-delà d'un sommet ou d'un creux pour prendre la liquidité, puis repart.",
      es: "el precio supera brevemente un máximo o un mínimo para tomar la liquidez y luego vuelve.",
    },
    short: { fr: "passage bref au-delà d'un sommet ou d'un creux pour prendre la liquidité.", es: "paso breve más allá de un máximo o un mínimo para tomar la liquidez." },
  },
  {
    id: "stop-hunt", source: "Avancé · leçon 6 (Chasses aux stops)",
    term: { fr: "Chasse aux stops", es: "Stop hunt" },
    match: { fr: /chasses? aux stops/i, es: /stop hunt/i },
    def: {
      fr: "mouvement brusque qui déclenche les stops accumulés avant de repartir en sens inverse.",
      es: "movimiento brusco que activa los stops acumulados antes de girar en sentido contrario.",
    },
    short: { fr: "mouvement qui déclenche les stops avant de repartir.", es: "movimiento que activa los stops antes de girar." },
  },
  {
    id: "htf", source: "Stratégies · ICT, leçon 1",
    term: { fr: "UT supérieure", es: "HTF" },
    match: { fr: /UT supérieure/, es: /\bHTF\b/ },
    def: {
      fr: "l'unité de temps supérieure (H4, Daily), celle qui donne le biais directionnel.",
      es: "la temporalidad más alta (H4, Daily), la que da el sesgo direccional.",
    },
    short: { fr: "unité de temps supérieure.", es: "temporalidad más alta." },
  },
  {
    id: "sl", source: "Débutant · leçon 5 (Le Stop Loss)",
    term: { fr: "Stop loss (SL)", es: "Stop loss (SL)" },
    match: { fr: /\bSL\b|stop loss/i, es: /\bSL\b|stop loss/i },
    def: {
      fr: "l'ordre qui coupe la perte si le prix va contre toi.",
      es: "la orden que corta la pérdida si el precio va en tu contra.",
    },
    short: { fr: "ordre qui coupe la perte.", es: "orden que corta la pérdida." },
  },
  {
    id: "tp", source: "Débutant · leçon 6 (Le Take Profit)",
    term: { fr: "Take profit (TP)", es: "Take profit (TP)" },
    match: { fr: /\bTP\b|take profit/i, es: /\bTP\b|take profit/i },
    def: {
      fr: "l'ordre qui encaisse le gain à l'objectif.",
      es: "la orden que cobra la ganancia en el objetivo.",
    },
    short: { fr: "ordre qui encaisse le gain.", es: "orden que cobra la ganancia." },
  },
  {
    id: "spread", source: "Débutant · leçon 4 (Spread, Bid et Ask)",
    term: { fr: "Spread", es: "Spread" },
    match: { fr: /\bspread/i, es: /\bspread/i },
    def: {
      fr: "l'écart entre le prix d'achat et le prix de vente, un coût payé à chaque trade.",
      es: "la diferencia entre el precio de compra y el de venta, un coste pagado en cada trade.",
    },
    short: { fr: "écart entre prix d'achat et prix de vente.", es: "diferencia entre precio de compra y de venta." },
  },
  {
    id: "atr", source: "hors leçons (terme courant)", outsideLessons: true,
    term: { fr: "ATR", es: "ATR" },
    inlineDef: { fr: "(ATR, l'amplitude moyenne d'une journée)", es: "(ATR, la amplitud media de una jornada)" },
    match: { fr: /\bATR\b/, es: /\bATR\b/ },
    def: {
      fr: "l'amplitude moyenne d'une journée, une mesure de la volatilité.",
      es: "la amplitud media de una jornada, una medida de la volatilidad.",
    },
    short: { fr: "amplitude moyenne d'une journée.", es: "amplitud media de una jornada." },
  },
  {
    id: "pdl", source: "hors leçons (terme courant)", outsideLessons: true,
    term: { fr: "PDL / PDH", es: "PDL / PDH" },
    match: { fr: /\bPD[LH]\b/, es: /\bPD[LH]\b/ },
    def: {
      fr: "plus bas / plus haut de la veille (Previous Day Low / High), des niveaux souvent visés par les chasses aux stops.",
      es: "mínimo / máximo del día anterior (Previous Day Low / High), niveles a menudo buscados por los stop hunts.",
    },
    short: { fr: "plus bas / plus haut de la veille.", es: "mínimo / máximo del día anterior." },
  },
  {
    id: "equal-lows", source: "Avancé · leçon 1 (Liquidité)",
    term: { fr: "Equal lows", es: "Equal lows" },
    match: { fr: /equal (?:lows|highs)/i, es: /equal (?:lows|highs)/i },
    def: {
      fr: "deux creux au même niveau, cibles favorites des chasses aux stops.",
      es: "dos mínimos al mismo nivel, objetivos favoritos de los stop hunts.",
    },
    short: { fr: "creux (ou sommets) au même niveau.", es: "mínimos (o máximos) al mismo nivel." },
  },
  {
    id: "swing", source: "Intermédiaire · leçon 9 (Fibonacci)",
    term: { fr: "Swing low / swing high", es: "Swing low / swing high" },
    match: { fr: /\bswings?\b/i, es: /\bswings?\b/i },
    def: {
      fr: "creux / sommet marquant d'un mouvement.",
      es: "mínimo / máximo marcado de un movimiento.",
    },
    short: { fr: "creux / sommet marquant.", es: "mínimo / máximo marcado." },
  },
  {
    id: "fakeout", source: "Intermédiaire · leçon 6 (Fake Breakout)",
    term: { fr: "Faux breakout", es: "Fakeout" },
    match: { fr: /faux breakouts?/i, es: /fakeout/i },
    def: {
      fr: "breakout qui ne tient pas : le prix revient de l'autre côté du niveau.",
      es: "breakout que no se sostiene: el precio vuelve al otro lado del nivel.",
    },
    short: { fr: "breakout qui ne tient pas.", es: "breakout que no se sostiene." },
  },
  {
    id: "pullback", source: "Intermédiaire · leçon 2 (Support & Résistance)",
    term: { fr: "Pullback", es: "Pullback" },
    match: { fr: /pullback/i, es: /pullback/i },
    def: {
      fr: "retour du prix vers un niveau (souvent le niveau cassé) avant de repartir dans le sens de la tendance.",
      es: "vuelta del precio hacia un nivel (a menudo el nivel roto) antes de seguir en el sentido de la tendencia.",
    },
    short: { fr: "retour du prix vers un niveau avant de repartir.", es: "vuelta del precio a un nivel antes de seguir." },
  },
  {
    id: "retest", source: "Intermédiaire · leçon 3 (Support et résistance)",
    term: { fr: "Retest", es: "Retest" },
    match: { fr: /retest/i, es: /retest/i },
    def: {
      fr: "le prix revient tester un niveau qu'il vient de casser.",
      es: "el precio vuelve a probar un nivel que acaba de romper.",
    },
    short: { fr: "nouveau test d'un niveau cassé.", es: "nueva prueba de un nivel roto." },
  },
  {
    id: "order-block", source: "Avancé · leçon 3 (Order Blocks)",
    term: { fr: "Order Block", es: "Order Block" },
    match: { fr: /order block|\bOB\b/i, es: /order block|\bOB\b/i },
    def: {
      fr: "la dernière bougie opposée avant un mouvement d'expansion violent.",
      es: "la última vela opuesta antes de un movimiento de expansión violento.",
    },
    short: { fr: "dernière bougie opposée avant une expansion.", es: "última vela opuesta antes de una expansión." },
  },
  {
    id: "mitigation", source: "Avancé · leçon 3 (Order Blocks)",
    term: { fr: "Mitigation", es: "Mitigation" },
    match: { fr: /mitigat/i, es: /mitigat|mitigaci/i },
    def: {
      fr: "le retour du prix dans une zone (Order Block, FVG) ; une fois mitigée, la zone perd sa force.",
      es: "la vuelta del precio a una zona (Order Block, FVG); una vez mitigada, la zona pierde su fuerza.",
    },
    short: { fr: "retour du prix dans une zone, qui l'affaiblit.", es: "vuelta del precio a una zona, que la debilita." },
  },
  {
    id: "drawdown", source: "Débutant · leçon 10 (Gestion du risque)",
    term: { fr: "Drawdown", es: "Drawdown" },
    match: { fr: /drawdown/i, es: /drawdown/i },
    def: {
      fr: "la baisse maximale du trade (ou du compte) avant qu'il ne remonte.",
      es: "la caída máxima del trade (o de la cuenta) antes de recuperarse.",
    },
    short: { fr: "baisse maximale avant de remonter.", es: "caída máxima antes de recuperarse." },
  },
  {
    id: "support-resistance", source: "Intermédiaire · leçons 2 et 3 (Support et résistance)",
    term: { fr: "Support / résistance", es: "Soporte / resistencia" },
    match: { fr: /\bsupports?\b|\brésistances?\b/i, es: /\bsoportes?\b|\bresistencias?\b/i },
    def: {
      fr: "niveau sous le prix où les acheteurs ont déjà fait rebondir le prix (support), ou au-dessus où les vendeurs l'ont repoussé (résistance).",
      es: "nivel bajo el precio donde los compradores ya lo hicieron rebotar (soporte), o encima donde los vendedores lo rechazaron (resistencia).",
    },
    short: { fr: "niveau où le prix a déjà rebondi ou été repoussé.", es: "nivel donde el precio ya rebotó o fue rechazado." },
  },
  {
    id: "psychological", source: "Intermédiaire · leçon 5 (Confluences)",
    term: { fr: "Chiffre rond", es: "Nivel psicológico" },
    match: { fr: /chiffres? ronds?/i, es: /nivel(?:es)? psicol[óo]gicos?/i },
    def: {
      fr: "prix rond (ex. 1,1000), très surveillé par les traders.",
      es: "número redondo (ej. 1,1000) muy vigilado por los traders.",
    },
    short: { fr: "prix rond très surveillé.", es: "número redondo muy vigilado." },
  },
  {
    id: "impulse-candle", source: "Avancé · leçon 2 (Fair Value Gap)",
    term: { fr: "Bougie de displacement", es: "Vela impulsiva" },
    match: { fr: /bougies? de displacement|\bdisplacement\b/i, es: /velas? impulsivas?/i },
    def: {
      fr: "grande bougie directionnelle, souvent sans mèche.",
      es: "vela grande y direccional, a menudo sin mecha.",
    },
    short: { fr: "grande bougie directionnelle.", es: "vela grande y direccional." },
  },
  {
    id: "hl", source: "Intermédiaire · leçon 1 (Structure de marché)",
    term: { fr: "HL (Higher Low)", es: "HL (Higher Low)" },
    match: { fr: /\bHL\b/, es: /\bHL\b/ },
    def: {
      fr: "creux plus haut que le précédent, signe d'une structure haussière.",
      es: "mínimo más alto que el anterior, señal de estructura alcista.",
    },
    short: { fr: "creux plus haut que le précédent.", es: "mínimo más alto que el anterior." },
  },
  {
    id: "invalidation", source: "Stratégies · ICT, leçon 2",
    term: { fr: "Invalidation", es: "Invalidación" },
    match: { fr: /invalidation/i, es: /invalidaci[óo]n/i },
    def: {
      fr: "le niveau où l'idée de trade n'est plus valable, là où se place le stop.",
      es: "el nivel donde la idea de trade deja de ser válida, donde se coloca el stop.",
    },
    short: { fr: "niveau où l'idée de trade n'est plus valable.", es: "nivel donde la idea de trade deja de ser válida." },
  },
  {
    id: "range", source: "Intermédiaire · leçon 2 (Support & Résistance)",
    term: { fr: "Range", es: "Rango" },
    match: { fr: /\brange\b/i, es: /\brangos?\b/i },
    def: {
      fr: "marché qui oscille entre un haut et un bas, sans tendance.",
      es: "mercado que oscila entre un techo y un piso, sin tendencia.",
    },
    short: { fr: "marché sans tendance, entre un haut et un bas.", es: "mercado sin tendencia, entre un techo y un piso." },
  },
  {
    id: "momentum", source: "Intermédiaire · leçon 6 (Fake Breakout)",
    term: { fr: "Momentum", es: "Momentum" },
    match: { fr: /momentum/i, es: /momentum/i },
    def: {
      fr: "la force du mouvement en cours.",
      es: "la fuerza del movimiento en curso.",
    },
    short: { fr: "force du mouvement.", es: "fuerza del movimiento." },
  },
  {
    id: "bias", source: "Intermédiaire · leçon 7 (Analyse multi-unités de temps)",
    term: { fr: "Biais", es: "Sesgo" },
    match: { fr: /\bbiais\b/i, es: /\bsesgo\b/i },
    def: {
      fr: "la direction privilégiée, donnée par l'unité de temps supérieure.",
      es: "la dirección favorecida, dada por el HTF.",
    },
    short: { fr: "direction privilégiée par l'unité de temps supérieure.", es: "dirección favorecida por el HTF." },
  },
  {
    id: "macro-news", source: "Macro · Débutant",
    term: { fr: "FOMC, NFP, CPI", es: "FOMC, NFP, CPI" },
    match: { fr: /\b(?:FOMC|NFP|CPI)\b/, es: /\b(?:FOMC|NFP|CPI)\b/ },
    def: {
      fr: "grandes news macro (taux de la Fed, emploi américain, inflation) qui font souvent bondir la volatilité.",
      es: "grandes noticias macro (tipos de la Fed, empleo estadounidense, inflación) que suelen disparar la volatilidad.",
    },
    short: { fr: "grandes news macro (taux, emploi, inflation).", es: "grandes noticias macro (tipos, empleo, inflación)." },
  },
  {
    id: "setup", source: "Avancé · leçon 1 (Liquidité)",
    term: { fr: "Setup", es: "Setup" },
    match: { fr: /\bsetups?\b/i, es: /\bsetups?\b/i },
    def: {
      fr: "ensemble de conditions de marché qui réunit les critères d'une entrée.",
      es: "configuración de mercado que reúne las condiciones de una entrada.",
    },
    short: { fr: "conditions d'entrée réunies.", es: "configuración de entrada." },
  },
  {
    id: "breakout", source: "Intermédiaire · leçon 1 (Structure de marché)",
    term: { fr: "Breakout", es: "Breakout" },
    match: { fr: /\bbreakouts?\b/i, es: /\bbreakouts?\b/i },
    def: {
      fr: "franchissement net d'un niveau, avec une clôture au-delà.",
      es: "superación clara de un nivel, con un cierre más allá.",
    },
    short: { fr: "franchissement d'un niveau.", es: "superación de un nivel." },
  },
  {
    id: "news", source: "Macro · Débutant",
    term: { fr: "News", es: "Noticia" },
    match: { fr: /\bnews\b/i, es: /\bnoticias?\b/i },
    def: {
      fr: "publication économique (emploi, inflation, taux) qui peut faire bouger fortement le prix.",
      es: "noticia económica (empleo, inflación, tipos) que puede mover mucho el precio.",
    },
    short: { fr: "publication économique.", es: "noticia económica." },
  },
  {
    id: "gap", source: "Avancé · leçon 2 (Fair Value Gap)",
    term: { fr: "Gap", es: "Gap" },
    match: { fr: /(?<!value )\bgaps?\b/i, es: /(?<!value )\bgaps?\b/i },
    def: {
      fr: "écart de prix entre deux bougies, souvent à la réouverture du marché après le weekend.",
      es: "hueco de precio entre dos velas, a menudo en la reapertura tras el fin de semana.",
    },
    short: { fr: "écart de prix à la réouverture.", es: "hueco de precio en la reapertura." },
  },
  {
    id: "pips", source: "Intermédiaire · leçon 2 (Support & Résistance)",
    term: { fr: "Pip", es: "Pip" },
    match: { fr: /\bpips?\b/i, es: /\bpips?\b/i },
    def: {
      fr: "petite unité de variation du prix d'une paire de devises (0,0001 sur EUR/USD).",
      es: "pequeña unidad de variación del precio de un par de divisas (0,0001 en EUR/USD).",
    },
    short: { fr: "petite unité de variation du prix.", es: "pequeña unidad de variación del precio." },
  },
  {
    id: "lot", source: "Débutant · leçon 5 (Le Stop Loss)",
    term: { fr: "Lot", es: "Lote" },
    match: { fr: /\blots?\b/i, es: /\blotes?\b/i },
    def: {
      fr: "unité de taille de position : plus le lot est gros, plus chaque pip gagne ou perd.",
      es: "unidad de tamaño de posición: cuanto mayor es el lote, más gana o pierde cada pip.",
    },
    short: { fr: "unité de taille de position.", es: "unidad de tamaño de posición." },
  },
  {
    id: "leverage", source: "Débutant · leçon 10 (Gestion du risque)",
    term: { fr: "Levier", es: "Apalancamiento" },
    match: { fr: /\blevier\b/i, es: /apalancamiento/i },
    def: {
      fr: "multiplicateur qui permet d'ouvrir une position plus grosse que ton capital ; il augmente gains et pertes.",
      es: "multiplicador que permite abrir una posición mayor que tu capital; aumenta ganancias y pérdidas.",
    },
    short: { fr: "multiplicateur de la taille de position.", es: "multiplicador del tamaño de posición." },
  },
  {
    id: "risk-management", source: "Débutant · leçon 10 (Gestion du risque)",
    term: { fr: "Gestion du risque", es: "Gestión de riesgos" },
    match: { fr: /gestion du risque/i, es: /gesti[óo]n de riesgos/i },
    def: {
      fr: "gestion du risque : combien tu risques par trade et comment tu protèges ton capital.",
      es: "gestión de riesgos: cuánto arriesgas por operación y cómo proteges tu capital.",
    },
    short: { fr: "gestion du risque.", es: "gestión de riesgos." },
  },
  {
    id: "edge", source: "Avancé · leçon 8 (Journaling)",
    term: { fr: "Edge", es: "Edge" },
    match: { fr: /\bedge\b/i, es: /\bedge\b/i },
    def: {
      fr: "ton avantage statistique : ce qui fait gagner ta méthode sur la durée.",
      es: "tu ventaja estadística: lo que hace ganar tu método a largo plazo.",
    },
    short: { fr: "avantage statistique.", es: "ventaja estadística." },
  },
  {
    id: "bid-ask", source: "Débutant · leçon 4 (Spread, Bid et Ask)",
    term: { fr: "Bid / ask", es: "Bid / ask" },
    match: { fr: /bid-ask|\bbid\b/i, es: /bid-ask|\bbid\b/i },
    def: {
      fr: "prix de vente (bid) et prix d'achat (ask) ; leur écart est le spread.",
      es: "precio de venta (bid) y de compra (ask); su diferencia es el spread.",
    },
    short: { fr: "prix de vente et d'achat.", es: "precio de venta y de compra." },
  },
  {
    id: "forex", source: "Avancé · leçon 4 (Killzones)",
    term: { fr: "Forex", es: "Forex" },
    match: { fr: /\bforex\b/i, es: /\bforex\b/i },
    def: {
      fr: "marché des devises (EUR/USD…), fermé le weekend.",
      es: "mercado de divisas (EUR/USD…), cerrado el fin de semana.",
    },
    short: { fr: "marché des devises.", es: "mercado de divisas." },
  },
  {
    id: "ltf", source: "Stratégies · Multi-unités de temps, leçon 1",
    term: { fr: "UT inférieure", es: "LTF" },
    match: { fr: /UT inférieure/, es: /\bLTF\b/ },
    def: {
      fr: "unité de temps inférieure (M15, M5), utilisée pour affiner l'entrée.",
      es: "la temporalidad más baja (M15, M5), usada para afinar la entrada.",
    },
    short: { fr: "unité de temps inférieure.", es: "temporalidad más baja." },
  },
  {
    id: "ict", source: "Stratégies · ICT, leçon 1",
    term: { fr: "ICT", es: "ICT" },
    match: { fr: /\bICT\b/, es: /\bICT\b/ },
    def: {
      fr: "méthode Inner Circle Trader : liquidité, FVG, Order Blocks, sessions.",
      es: "método Inner Circle Trader: liquidez, FVG, Order Blocks, sesiones.",
    },
    short: { fr: "méthode Inner Circle Trader.", es: "método Inner Circle Trader." },
  },
  {
    id: "fomo", source: "Intermédiaire · leçon 8 (Plan de trade)",
    term: { fr: "FOMO", es: "FOMO" },
    match: { fr: /\bFOMO\b/, es: /\bFOMO\b/ },
    def: {
      fr: "peur de rater le mouvement, qui pousse à entrer trop tard.",
      es: "miedo a perderse el movimiento, que empuja a entrar tarde.",
    },
    short: { fr: "peur de rater le mouvement.", es: "miedo a perderse el movimiento." },
  },
  {
    id: "slippage", source: "hors leçons (terme courant)", outsideLessons: true,
    term: { fr: "Slippage", es: "Slippage" },
    match: { fr: /slippage/i, es: /slippage/i },
    def: {
      fr: "exécution de ton ordre à un prix moins bon que prévu, fréquente quand le marché bouge vite.",
      es: "ejecución de tu orden a un precio peor del previsto, frecuente cuando el mercado se mueve rápido.",
    },
    short: { fr: "exécution à un prix moins bon que prévu.", es: "ejecución a un precio peor del previsto." },
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
 * Termes de base des premières leçons (Débutant 1 à 3), affichés sans
 * explication : acheter / vendre, trade, stop, haut / bas…
 */
export const BASIC_TERMS = /^(?:BUY|SELL|NO TRADE|NO|TRADE|trades?|trader|stops?|highs?|lows?|long|short|wick|body|timing|trend|USD|EUR|XAU|BTC|NASDAQ)$/i;

/**
 * Détection du jargon dans les textes affichés (audit) : sigles et mots
 * techniques anglais ou spécialisés. Chaque terme détecté doit être couvert par
 * une entrée du glossaire (expliquée) ou faire partie des termes de base.
 */
export const JARGON_DETECT: RegExp[] = [
  // Sigles (casse exacte)
  /(?<![\p{L}\d])(?:SL|TP|HTF|LTF|FVG|OB|HL|HH|LH|LL|BOS|CHoCH|ATR|PDL|PDH|PWL|PWH|PML|NFP|FOMC|CPI|ICT|OTE|FOMO|RR|FX|EMA|SMA|RSI|MACD|ADR|VWAP|POI|SMC)(?![\p{L}\d])/gu,
  // Mots techniques (toute casse)
  /(?<![\p{L}\d])(?:edge|slippage|pumps?|setups?|range|swings?|sweeps?|retests?|pullbacks?|breakouts?|fakeouts?|spread|lots?|lotes?|pips?|news|bias|impulse|displacement|killzones?|overlap|scalp\w*|stop hunts?|equal (?:lows|highs)|liquidity|mitigation|order blocks?|drawdown|momentum|leverage|levier|apalancamiento|risk management|target|backtest\w*|round number|weekly|daily|intraday|gaps?|rally|dump|squeeze|chop\w*|forex|bid|ask)(?![\p{L}\d])/giu,
];

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
 * Termes interdits PARTOUT (jeux, leçons, home, hub), toutes variantes : avec
 * ou sans « e », majuscules, pluriels, anglais. Les traders disent « support »
 * et « résistance » ; « plus bas / plus haut précédent » (FR), « mínimo /
 * máximo anterior » (ES). Bornes Unicode : « demandé » n'est pas « demand ».
 */
const NL = "(?<![\\p{L}\\d])";
const NR = "(?![\\p{L}\\d])";
const re = (src: string) => new RegExp(src, "iu");
export const FORBIDDEN: Record<GlossaryLocale, { from: RegExp; to: string; source: string }[]> = {
  fr: [
    { from: re(`zones?\\s+d['’]\\s*offres?|zones?\\s+de\\s+demandes?|zones?\\s+de\\s+demands?|zones?\\s+de\\s+suppl(?:y|ies)|zones?\\s+(?:demand|supply)${NR}|${NL}(?:demand|supply)\\s+zones?|${NL}(?:supply|demand)s?${NR}`), to: "support / résistance", source: "Intermédiaire · leçons 2 et 3" },
    { from: re(`${NL}pr[ée]c[ée]dents?\\s+(?:low|high)s?${NR}|${NL}(?:low|high)s?\\s+pr[ée]c[ée]dents?${NR}`), to: "plus bas précédent / plus haut précédent", source: "Intermédiaire · leçon 1" },
  ],
  es: [
    { from: re(`zonas?\\s+de\\s+ofertas?|zonas?\\s+de\\s+demandas?|zonas?\\s+de\\s+demands?|zonas?\\s+de\\s+suppl(?:y|ies)|zonas?\\s+(?:demand|supply)${NR}|${NL}(?:demand|supply)\\s+zones?|${NL}(?:supply|demand)s?${NR}`), to: "soporte / resistencia", source: "Intermedio · lecciones 2 y 3" },
    { from: re(`${NL}(?:low|high)s?\\s+(?:previos?|anterior(?:es)?)${NR}`), to: "mínimo anterior / máximo anterior", source: "Intermedio · lección 1" },
  ],
};

/**
 * Termes retirés des jeux → terme retenu, et leçon source. Les motifs
 * vérifiés par l'audit sont ceux de la colonne « from ».
 */
export const REPLACED: Record<GlossaryLocale, { from: RegExp; to: string; source: string }[]> = {
  fr: [
    ...FORBIDDEN.fr,
    { from: /(?<![\p{L}])(?:up|down)-?trends?(?![\p{L}])/iu, to: "tendance haussière / baissière", source: "Intermédiaire · leçon 4" },
    { from: /plafond|plancher/i, to: "haut du range / bas du range", source: "Intermédiaire · leçon 2" },
    { from: /stop[- ]hunts?/i, to: "chasse aux stops / zone de chasse aux stops", source: "Avancé · leçon 6" },
    { from: /round number/i, to: "chiffre rond", source: "Intermédiaire · leçon 5" },
    { from: /tight stop/i, to: "stop serré", source: "Débutant · leçon 5" },
    { from: /weekly (?:high|low)/i, to: "plus haut / plus bas de la semaine", source: "hors leçons" },
    { from: /niveaux? psychologiques?/i, to: "chiffre rond", source: "Intermédiaire · leçon 5" },
    { from: /niveau magnétique/i, to: "niveau clé", source: "Intermédiaire · leçons 2 et 5" },
    { from: /asia high/i, to: "haut de la session asiatique", source: "hors leçons (sessions : Avancé · leçon 4)" },
    { from: /bougies? de force/i, to: "bougie de displacement", source: "Avancé · leçon 2" },
    { from: /zone douteuse/i, to: "niveau secondaire", source: "Intermédiaire · leçon 2" },
    { from: /position sizing/i, to: "taille de position", source: "Débutant · leçon 8" },
    { from: /wick fakeout/i, to: "mèche du faux breakout", source: "Intermédiaire · leçon 6" },
    { from: /fakeouts?/i, to: "faux breakout", source: "Intermédiaire · leçon 6" },
    { from: /\bRR\b/, to: "R/R", source: "Débutant · leçon 6" },
  ],
  es: [
    ...FORBIDDEN.es,
    { from: /(?<![\p{L}])(?:up|down)-?trends?(?![\p{L}])/iu, to: "tendencia alcista / bajista", source: "Intermedio · lección 4" },
    { from: /cazas? de stops|zona de caza/i, to: "stop hunt / zona de stop hunt", source: "Avanzado · lección 6" },
    { from: /round number/i, to: "nivel psicológico", source: "Intermedio · lección 5" },
    { from: /tight stop/i, to: "stop ajustado", source: "Principiante · lección 5" },
    { from: /weekly (?:high|low)/i, to: "máximo / mínimo de la semana", source: "hors leçons" },
    { from: /n[úu]meros? redondos?/i, to: "nivel psicológico", source: "Intermedio · lección 5" },
    { from: /nivel magnético/i, to: "nivel clave", source: "Intermedio · lecciones 2 y 5" },
    { from: /asia high/i, to: "máximo de la sesión asiática", source: "hors leçons (sesiones: Avanzado · lección 4)" },
    { from: /velas? de fuerza/i, to: "vela impulsiva", source: "Avanzado · lección 2" },
    { from: /zona dudosa/i, to: "nivel secundario", source: "Intermedio · lección 2" },
    { from: /position sizing/i, to: "tamaño de posición", source: "Principiante · lección 8" },
    { from: /wick del fakeout/i, to: "mecha del fakeout", source: "Intermedio · lección 6" },
    { from: /falso breakout/i, to: "fakeout", source: "Intermedio · lección 6" },
    { from: /\bimbalance\b/i, to: "desequilibrio", source: "Estrategias · ICT, lección 2" },
    { from: /\bbias\b/i, to: "sesgo", source: "Intermedio · lección 7" },
    { from: /\bliquidity\b/i, to: "liquidez", source: "Avanzado · lección 1" },
    { from: /\bRR\b/, to: "R/R", source: "Principiante · lección 6" },
  ],
};

/** Libellés de zones autorisés sur les graphiques (FR / ES), tous couverts par les leçons sauf mention. */
export const ZONE_LABELS: Record<GlossaryLocale, string[]> = {
  fr: [
    "FVG haussier", "Order Block", "Liquidité au-dessus", "Liquidité en-dessous", "Liquidité balayée",
    "Plus haut précédent", "Plus bas précédent", "Sweep haut", "Sweep bas", "Haut du range", "Bas du range",
    "Résistance", "Résistance UT supérieure", "Résistance cassée", "Support", "Support UT supérieure", "Support cassé",
    "Niveau secondaire", "Mèche du faux breakout", "Swing high", "Swing low",
    "Faux breakouts précédents", "Zone de chasse aux stops", "Equal lows", "Haut de la session asiatique", "Niveau clé",
    "Chiffre rond", "HL H4", "PDL", "Swing high 1", "Swing high 2", "Swing high 3", "Swing low 1",
    "Swing low 2", "Swing low 3", "Swing high évident", "Swing low évident", "Swing low H1",
    // niveau avancé : libellés génériques
    "Niveau bas", "Niveau haut", "Déséquilibre", "Liquidité",
  ],
  es: [
    "FVG alcista", "Order Block", "Liquidez arriba", "Liquidez abajo", "Liquidez barrida",
    "Máximo anterior", "Mínimo anterior", "Barrido arriba", "Barrido abajo", "Techo del rango", "Piso del rango",
    "Resistencia", "Resistencia HTF", "Resistencia rota", "Soporte", "Soporte HTF", "Soporte roto",
    "Nivel secundario", "Mecha del fakeout", "Swing high", "Swing low",
    "Fakeouts anteriores", "Zona de stop hunt", "Equal lows", "Máximo de la sesión asiática", "Nivel clave",
    "Nivel psicológico", "HL H4", "PDL", "Swing high 1", "Swing high 2", "Swing high 3", "Swing low 1",
    "Swing low 2", "Swing low 3", "Swing high evidente", "Swing low evidente", "Swing low H1",
    "Nivel bajo", "Nivel alto", "Desequilibrio", "Liquidez",
  ],
};
