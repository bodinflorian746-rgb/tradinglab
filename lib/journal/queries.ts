// Lecture des trades + agrégats du dashboard (server-only).
// Le client Supabase serveur respecte la RLS : un user ne lit que ses trades.

import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { TradeEntry, TradeEntryView, JournalStats } from "./types";
import { isMockEnvEnabled, isDevMissingTable, MOCK_TRADES } from "./mock";

const SCREENSHOT_BUCKET = "trade-screenshots";
const SIGNED_URL_TTL = 60 * 60; // 1h

export interface JournalView {
  entries: TradeEntryView[];
  isMock: boolean; // true → données fictives (dev only), affiche le badge démo
}

// Récupère les trades de l'utilisateur courant (les plus récents d'abord),
// avec une URL signée résolue pour chaque capture (bucket privé).
// En dev, bascule sur les données mock si le flag est actif ou si la table
// Supabase n'existe pas encore (cf. lib/journal/mock.ts). Aucun impact en prod.
export async function getJournalView(): Promise<JournalView> {
  // Interrupteur manuel (dev only) : on court-circuite Supabase entièrement.
  if (isMockEnvEnabled()) {
    return { entries: MOCK_TRADES, isMock: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { entries: [], isMock: false };

  const { data, error } = await supabase
    .from("trading_journal_entries")
    .select("*")
    .order("trade_date", { ascending: false });

  if (error || !data) {
    // Bascule auto en mock si la table n'existe pas encore (dev only).
    if (isDevMissingTable(error)) {
      return { entries: MOCK_TRADES, isMock: true };
    }
    if (error) console.error("[journal] lecture trades échouée:", error.message);
    return { entries: [], isMock: false };
  }

  const entries = data as TradeEntry[];

  const views = await Promise.all(
    entries.map(async (e) => {
      let signed: string | null = null;
      if (e.screenshot_url) {
        const { data: s } = await supabase.storage
          .from(SCREENSHOT_BUCKET)
          .createSignedUrl(e.screenshot_url, SIGNED_URL_TTL);
        signed = s?.signedUrl ?? null;
      }
      return { ...e, screenshot_signed_url: signed };
    }),
  );

  return { entries: views, isMock: false };
}

// Agrégats simples pour le dashboard. Fonction pure (testable, sans I/O).
// Les erreurs/setups sont comptés par CLÉ canonique → le mapping vers le
// libellé localisé se fait côté composant (via le dictionnaire).
export function computeStats(entries: TradeEntry[]): JournalStats {
  let wins = 0;
  let losses = 0;
  let breakEven = 0;
  let open = 0;

  let rSum = 0;
  let rCount = 0;

  const mistakeTally = new Map<string, number>();
  const setupTally = new Map<string, number>();

  for (const e of entries) {
    if (e.result === "win") wins++;
    else if (e.result === "loss") losses++;
    else if (e.result === "break_even") breakEven++;
    else if (e.result === "open") open++;

    if (typeof e.r_multiple === "number" && Number.isFinite(e.r_multiple)) {
      rSum += e.r_multiple;
      rCount++;
    }

    // "none" exclu du top erreurs (c'est l'absence d'erreur, pas une erreur).
    if (e.perceived_mistake && e.perceived_mistake !== "none") {
      mistakeTally.set(
        e.perceived_mistake,
        (mistakeTally.get(e.perceived_mistake) ?? 0) + 1,
      );
    }

    if (e.setup) {
      setupTally.set(e.setup, (setupTally.get(e.setup) ?? 0) + 1);
    }
  }

  const closed = wins + losses + breakEven;
  const winrate = closed > 0 ? Math.round((wins / closed) * 100) : 0;
  const avgR = rCount > 0 ? Math.round((rSum / rCount) * 100) / 100 : null;

  const topMistakes = [...mistakeTally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => ({ key: key as JournalStats["topMistakes"][number]["key"], count }));

  const setupSorted = [...setupTally.entries()].sort((a, b) => b[1] - a[1]);
  const topSetup =
    setupSorted.length > 0
      ? {
          key: setupSorted[0][0] as NonNullable<JournalStats["topSetup"]>["key"],
          count: setupSorted[0][1],
        }
      : null;

  return {
    total: entries.length,
    wins,
    losses,
    breakEven,
    open,
    closed,
    winrate,
    avgR,
    topMistakes,
    topSetup,
  };
}
