// Contexte de marché plausible (actif tradé dans la session) tiré de la graine d'un
// round d'audit : les audits de cohérence suivent ainsi le même chemin que le jeu
// (séquences réelles de la classe actif × session × volatilité).
import { SESSION_ASSETS } from "../../lib/games/market-context";
import { mulberry32, type Asset, type Session } from "../../lib/games/shared";

const SESSIONS = Object.keys(SESSION_ASSETS) as Session[];

export function auditCtx(seed: number): { asset: Asset; session: Session } {
  const rng = mulberry32((seed ^ 0x2545F491) >>> 0);
  const session = SESSIONS[Math.floor(rng() * SESSIONS.length)];
  const assets = SESSION_ASSETS[session];
  return { asset: assets[Math.floor(rng() * assets.length)], session };
}
