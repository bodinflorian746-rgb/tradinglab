// Décision PO 9 (2026-10-15) : les exemples des stratégies Price Action 2 et 3, Reversal 2 et 3,
// Support / Résistance 4, Trend following 3 et 4 passent de XAU/USD à EUR/USD, pour que les petits
// comptes puissent les prendre au lot minimum. Une seule correspondance pour tous : 4 500 $ → 1.0800
// et 1 $ = 1 pip (0.0001). La géométrie des bougies est inchangée ; les contrôles de données
// (scripts/audit-lecons/data-lots.ts) relisent ces séries en dollars.

export const XAU_BASE = 4500;
export const EUR_BASE = 1.08;
export const EUR_PIP = 0.0001;

/** Prix en dollars (scénario d'origine) → prix EUR/USD affiché */
export const xauToEur = (p: number) => Number((EUR_BASE + (p - XAU_BASE) * EUR_PIP).toFixed(5));
/** Prix EUR/USD → prix en dollars du scénario d'origine (pour les contrôles) */
export const eurToXau = (p: number) => Number((XAU_BASE + (p - EUR_BASE) / EUR_PIP).toFixed(1));

/** Séries converties (clés de lib/lessons/generated/candles.json) */
export const EUR_FROM_XAU_KEYS = [
  "pinbar-setup", "pin-location", "pinbar-failure", "pin-case-valide", "pin-case-ratio", "pin-case-cloture", "pin-case-niveau",
  "engulfing-setup", "eng-case-valide", "eng-case-partiel", "eng-case-contraste", "eng-case-amplitude", "eng-isolated",
  "hs-execution", "ihs-xau", "divergence-no-break", "rsi-div",
  "breakout-real", "breakout-fake", "hunt-sr4",
  "tf3-pullback", "fib-tp", "ote", "pb-conf",
];
