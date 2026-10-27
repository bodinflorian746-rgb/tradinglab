// Constantes du scénario de la stratégie Volume Profile + VWAP (4 leçons), utilisées par les schémas
// sans la bibliothèque de formes des bougies (lib/lessons/scenarios-strat-volume.ts les construit).
// EUR/USD : H1 (structure, profil) puis M15 (VWAP de séance, confirmation, plans, issues) ;
// XAU/USD H1 (vente, leçon 2) ; contrat future EUR/USD M15 (absorption, leçon 3).

/** Profil : rangées de 1 pip (les niveaux du texte tombent sur des rangées), plage fixe de la consolidation H1 */
export const VSV_ROW = 0.0001;
export const VSV_PROFILE: [number, number] = [11, 48];
/** H1 : creux 1.0800, sommet 1.0860 (deux rejets), creux 1.0830, cassure, sommet 1.0910 (deux touches) */
export const VSV_H1 = { low0: 2, res1: 6, res2: 9, low1: 11, brk: 19, back1: 21, back2: 35, top1: 46, top2: 50 };
export const VSV_ZONE: [number, number] = [1.0855, 1.0865];
export const VSV_RES = 1.091;
/** M15 : ouverture de la séance (ancrage du VWAP), retour dans la zone, creux d'invalidation, sommet
 *  local, clôture de confirmation ; second retour : creux, sommet local, clôture (entrée retenue) */
export const VSV_M15 = { session: 6, back: 14, low: 17, high: 20, confirm: 23, low2: 28, high2: 29, entry2: 32 };
export const VSV_REFUSED = { entry: 1.0872, sl: 1.0842, tp: 1.0906 };
export const VSV_PLAN = { entry: 1.0858, sl: 1.0842, tp: 1.0906 };
/** Contrat future EUR/USD : bougies M15 de la séance (de l'ouverture à la confirmation), environ 40 pips au-dessus du comptant */
export const VSV_FUT_BASIS = 0.004;
export const VSV_FUT_FROM = 6;
/** Or : rangées de 1 $, plage fixe de la consolidation sous 3 900 $, rebond (VWAP 3 899 $) */
export const VSX_ROW = 1;
export const VSX_PROFILE: [number, number] = [9, 15];
export const VSX = { res1: 10, res2: 14, impulse: 16, low: 18, rebound: 23 };
