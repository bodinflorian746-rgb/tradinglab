import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Neutralise le garde "server-only" (throw hors RSC) pour tester la couche.
vi.mock("server-only", () => ({}));

// ── Mock du client auth serveur (getUser configurable) ──
const getUserMock = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: getUserMock } }),
}));

// ── Mock du client service_role : chaîne PostgREST thenable + espionnable ──
type Result = { data: unknown[]; error: unknown; count?: number };
let dbResult: Result = { data: [], error: null, count: 0 };
const calls: Array<[string, unknown[]]> = [];

function makeBuilder(): unknown {
  const handler: ProxyHandler<object> = {
    get(_t, prop) {
      if (prop === "then") {
        return (res: (v: Result) => unknown, rej: (e: unknown) => unknown) =>
          Promise.resolve(dbResult).then(res, rej);
      }
      return (...args: unknown[]) => {
        calls.push([String(prop), args]);
        return proxy;
      };
    },
  };
  const proxy: unknown = new Proxy({}, handler);
  return proxy;
}
const fromMock = vi.fn(() => makeBuilder());
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: fromMock }),
}));

import {
  getCurrentSuperAdmin,
  getOverviewAndGroups,
  listGroupLedger,
  UnauthorizedError,
} from "@/lib/loyalty/admin";

const ADMIN = "admin@test.local";

function setUser(email: string | null) {
  getUserMock.mockResolvedValue({
    data: { user: email ? { id: "u-1", email } : null },
  });
}

beforeEach(() => {
  process.env.ADMIN_EMAILS = ADMIN;
  calls.length = 0;
  dbResult = { data: [], error: null, count: 0 };
  fromMock.mockClear();
});
afterEach(() => vi.clearAllMocks());

describe("guard Super Admin", () => {
  it("getCurrentSuperAdmin → null pour un non-admin", async () => {
    setUser("random@user.com");
    expect(await getCurrentSuperAdmin()).toBeNull();
  });

  it("getCurrentSuperAdmin → null si non connecté", async () => {
    setUser(null);
    expect(await getCurrentSuperAdmin()).toBeNull();
  });

  it("getCurrentSuperAdmin → {id,email} pour un admin", async () => {
    setUser(ADMIN);
    expect(await getCurrentSuperAdmin()).toEqual({ id: "u-1", email: ADMIN });
  });

  it("un non-admin ne peut PAS lire la synthèse (rejet, aucune donnée)", async () => {
    setUser("random@user.com");
    await expect(getOverviewAndGroups()).rejects.toBeInstanceOf(UnauthorizedError);
    expect(fromMock).not.toHaveBeenCalled(); // aucune requête émise
  });

  it("un admin peut lire la synthèse (base vide → zéros)", async () => {
    setUser(ADMIN);
    const { overview, groups, error } = await getOverviewAndGroups();
    expect(error).toBeNull();
    expect(overview.groupsTotal).toBe(0);
    expect(overview.netBalance).toBe(0);
    expect(groups).toEqual([]);
    expect(fromMock).toHaveBeenCalled();
  });
});

describe("isolation & lecture seule", () => {
  it("listGroupLedger scope la requête au group_id (eq group_id)", async () => {
    setUser(ADMIN);
    await listGroupLedger("grp-42", { sign: "credit" });
    const eqCalls = calls.filter(([m]) => m === "eq");
    expect(eqCalls.some(([, a]) => a[0] === "group_id" && a[1] === "grp-42")).toBe(true);
    // filtre crédit → amount > 0
    expect(calls.some(([m, a]) => m === "gt" && a[0] === "amount")).toBe(true);
  });

  it("aucune écriture n'est émise (pas d'insert/update/delete/upsert)", async () => {
    setUser(ADMIN);
    await getOverviewAndGroups();
    await listGroupLedger("grp-42", {});
    const writes = calls.filter(([m]) =>
      ["insert", "update", "delete", "upsert", "rpc"].includes(m),
    );
    expect(writes).toEqual([]);
  });
});
