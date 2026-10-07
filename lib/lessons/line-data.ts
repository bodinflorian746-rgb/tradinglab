// Séries de prix des schémas « en ligne » des leçons (clôtures), écrites d'après
// le texte de chaque leçon. Les niveaux affichés sont calculés à partir d'elles
// (lib/lessons/chart-analysis.ts) ; scripts/audit-lecons/data.ts vérifie qu'ils
// redonnent les chiffres du texte.

/** Confluence. Pivots : A (départ de l'impulsion), 2 rebonds sur le support (le 2e = dernier HL), B (sommet). */
export const CONFLUENCE_LINES = {
  // Trading Intermédiaire 5 : HL 1.0850, support respecté 2×, Fibonacci 61.8% = 1.0848
  structure: [
    1.0832, 1.0824, 1.0816, 1.0810,
    1.0822, 1.0838, 1.0851, 1.0862, 1.0868,
    1.0860, 1.0853, 1.0849,
    1.0858, 1.0870, 1.0879, 1.0885,
    1.0874, 1.0862, 1.0850,
    1.0863, 1.0877, 1.0890, 1.0902, 1.0910,
    1.0899, 1.0887, 1.0874, 1.0862, 1.0851,
  ],
  // Support-résistance 2 : support historique, Fibonacci 61.8%, chiffre rond 1.1800
  "chiffre-rond": [
    1.1772, 1.1764, 1.1756, 1.1750,
    1.1762, 1.1779, 1.1797, 1.1810, 1.1818,
    1.1811, 1.1805, 1.1801,
    1.1812, 1.1825, 1.1836, 1.1842,
    1.1831, 1.1816, 1.1802,
    1.1818, 1.1836, 1.1852, 1.1868, 1.1880,
    1.1868, 1.1853, 1.1838, 1.1821, 1.1803,
  ],
};
export type ConfluenceVariant = keyof typeof CONFLUENCE_LINES;

/** Reversal 4, cas 1 : short EUR/USD 1.1795, SL 1.1835, ligne de cou 1.1800 ; clôtures H1. */
export const SL_CASE = {
  neck: 1.1800,
  entry: 1.1795,
  sl: 1.1835,
  entryIndex: 2,
  cutIndex: 6,     // clôture d'invalidation 1.1810
  closes: [1.1812, 1.1806, 1.1795, 1.1788, 1.1780, 1.1792, 1.1810, 1.1824, 1.1838],
};

/** Reversal 2 : ETE XAU/USD (tête 4 660$), ligne de cou horizontale / ascendante / descendante. */
export const HS_CASES = [
  { key: "plate", title: "Ligne de cou horizontale", line: [4540, 4575, 4600, 4620, 4600, 4578, 4610, 4640, 4660, 4630, 4600, 4578, 4600, 4625, 4603, 4585, 4570, 4548, 4530] },
  { key: "ascendante", title: "Ligne de cou ascendante", line: [4545, 4580, 4605, 4622, 4595, 4565, 4605, 4638, 4660, 4640, 4612, 4590, 4610, 4630, 4610, 4598, 4585, 4560, 4540] },
  { key: "descendante", title: "Ligne de cou descendante", line: [4560, 4590, 4612, 4628, 4610, 4590, 4615, 4640, 4660, 4635, 4595, 4565, 4590, 4615, 4590, 4568, 4548, 4530, 4510] },
];
