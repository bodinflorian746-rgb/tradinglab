// Rotation des scénarios des mini-jeux.
//
// - Jamais deux fois le même scénario dans une même partie.
// - D'une partie à l'autre, un scénario déjà joué ne revient qu'une fois tous
//   les autres scénarios du niveau passés (cycle). Au changement de cycle, ceux
//   de la partie précédente passent en dernier.
// - L'historique vit dans le stockage local du navigateur (par jeu et par
//   niveau), rien en base. Sans stockage, la partie reste sans doublon.

export interface RotationHistory {
  /** Scénarios déjà joués dans le cycle en cours. */
  cycle: string[];
  /** Scénarios de la dernière partie (dans l'ordre). */
  last:  string[];
}

export const EMPTY_HISTORY: RotationHistory = { cycle: [], last: [] };

function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Choisit `rounds` scénarios distincts dans `pool` (au plus la taille du pool) :
 * d'abord ceux pas encore joués dans le cycle, puis, si le cycle s'épuise en
 * cours de partie, un nouveau cycle où les scénarios de la partie précédente
 * passent en dernier.
 */
export function pickRotation<T extends { id: string }>(
  pool: readonly T[],
  rounds: number,
  rng: () => number,
  history: RotationHistory = EMPTY_HISTORY,
): T[] {
  const ids = new Set(pool.map((t) => t.id));
  const seen = new Set(history.cycle.filter((id) => ids.has(id)));
  const last = new Set(history.last);
  const shuffled = shuffle(pool, rng);
  // Scénarios de la partie précédente : les plus anciens d'abord, toujours après les autres
  const rank = (id: string) => (last.has(id) ? 1 + history.last.indexOf(id) : 0);
  const byAge = (list: T[]) => [...list].sort((x, y) => rank(x.id) - rank(y.id));
  // Pas encore joués dans le cycle : d'abord ceux absents de la partie précédente
  const fresh = byAge(shuffled.filter((t) => !seen.has(t.id))).slice(0, rounds);
  // (sans historique : ordre du mélange initial, mêmes tirages qu'avant la rotation pour une graine donnée)
  const out = last.size ? [...shuffle(fresh.filter((t) => !last.has(t.id)), rng), ...shuffle(fresh.filter((t) => last.has(t.id)), rng)] : fresh;
  if (out.length < rounds) {
    // Cycle épuisé en cours de partie : nouveau cycle, en fin de partie
    const taken = new Set(out.map((t) => t.id));
    out.push(...shuffle(byAge(shuffled.filter((t) => !taken.has(t.id))).slice(0, rounds - out.length), rng));
  }
  // Jamais deux fois de suite d'une partie à l'autre : la fin de la partie précédente (son
  // dernier tiers) passe en fin de segment (pas encore joués, puis nouveau cycle)
  if (last.size) {
    const tail = new Set(history.last.slice(-Math.ceil(rounds / 3)));
    const settle = (a: number, b: number) => {
      const seg = out.slice(a, b);
      out.splice(a, b - a, ...seg.filter((t) => !tail.has(t.id)), ...seg.filter((t) => tail.has(t.id)));
    };
    const nFresh = Math.min(fresh.length, rounds);
    settle(0, nFresh);
    settle(nFresh, out.length);
  }
  return out;
}

/** Historique après une partie : le cycle se referme quand tout le pool est passé. */
export function nextHistory(history: RotationHistory, played: readonly string[], poolIds: readonly string[]): RotationHistory {
  const ids = new Set(poolIds);
  const cycle = new Set(history.cycle.filter((id) => ids.has(id)));
  const out: string[] = [...cycle];
  for (const id of played) {
    if (cycle.size === ids.size) { cycle.clear(); out.length = 0; } // cycle bouclé : on repart
    if (!cycle.has(id)) { cycle.add(id); out.push(id); }
  }
  if (cycle.size === ids.size) out.length = 0;
  return { cycle: out, last: [...played] };
}

// ─── Stockage local (navigateur) ──────────────────────────────────────────────

const storageKey = (game: string, difficulty: string) => `tsx-jeux-rotation:${game}:${difficulty}`;

export function readHistory(game: string, difficulty: string): RotationHistory {
  try {
    const raw = window.localStorage.getItem(storageKey(game, difficulty));
    if (!raw) return EMPTY_HISTORY;
    const h = JSON.parse(raw) as Partial<RotationHistory>;
    return {
      cycle: Array.isArray(h.cycle) ? h.cycle.filter((x) => typeof x === "string") : [],
      last:  Array.isArray(h.last) ? h.last.filter((x) => typeof x === "string") : [],
    };
  } catch {
    return EMPTY_HISTORY;
  }
}

export function writeHistory(game: string, difficulty: string, history: RotationHistory): void {
  try {
    window.localStorage.setItem(storageKey(game, difficulty), JSON.stringify(history));
  } catch {
    /* stockage indisponible : la partie reste sans doublon */
  }
}

/** Nouvelle partie : tirage selon l'historique, mémorisé comme « dernière partie ». */
export function startRotation<T extends { id: string }>(game: string, difficulty: string, generate: (history: RotationHistory) => T[]): T[] {
  const history = readHistory(game, difficulty);
  const out = generate(history);
  writeHistory(game, difficulty, { cycle: history.cycle, last: out.map((s) => s.id) });
  return out;
}

/** Un scénario affiché compte comme joué (une partie abandonnée ne consomme que ce qui a été vu). */
export function markPlayed(game: string, difficulty: string, id: string, poolIds: readonly string[]): void {
  const history = readHistory(game, difficulty);
  writeHistory(game, difficulty, { cycle: nextHistory(history, [id], poolIds).cycle, last: history.last });
}
