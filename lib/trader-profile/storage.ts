// localStorage R/W pour les events du profil trader.
// V1 simple — schéma versionné, capé à 500 events pour éviter la bloat.
//
// Future migration Supabase : remplacer ces 3 fonctions (loadEvents,
// appendEvent, resetEvents) par des appels API. Le reste du système
// (scoring, profiles, page) ne change pas.

import type { GameEvent } from "./types";

const STORAGE_KEY = "tradinglab.profile.v1";
const MAX_EVENTS  = 500;

interface StorageSchema {
  version: 1;
  events:  GameEvent[];
}

// SSR-safe localStorage access. Toujours retourne [] côté serveur.
export function loadEvents(): GameEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StorageSchema | GameEvent[];
    // Format legacy ou v1
    if (Array.isArray(parsed)) return parsed;
    if (parsed.version === 1 && Array.isArray(parsed.events)) return parsed.events;
    return [];
  } catch {
    return [];
  }
}

export function appendEvent(event: GameEvent): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadEvents();
    const next = [...existing, event];
    // Capping : on garde les MAX_EVENTS plus récents
    const capped = next.length > MAX_EVENTS ? next.slice(-MAX_EVENTS) : next;
    const schema: StorageSchema = { version: 1, events: capped };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
  } catch {
    // localStorage indisponible (quota, mode privé) — silencieusement ignoré
  }
}

export function resetEvents(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
