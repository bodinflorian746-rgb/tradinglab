import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// Utilisateur courant (session)
const getUserMock = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: getUserMock } }),
}));

// Client service_role : réponses configurables par table / opération — même
// pattern que app/[locale]/master/actions.test.ts.
type Res = { data?: unknown; error?: unknown };
const h: {
  membershipRole: string | null;
  groupStatus: string | null;
  purchaseUpdateResult: Res;
} = {
  membershipRole: "admin",
  groupStatus: "active",
  purchaseUpdateResult: { data: [{ id: "order-1" }], error: null },
};

function makeFrom() {
  return (table: string) => {
    const calls: string[] = [];
    const resolve = (): Res => {
      const isUpdate = calls.includes("update");
      if (table === "group_memberships")
        return { data: h.membershipRole != null ? { role: h.membershipRole } : null, error: null };
      if (table === "partner_groups")
        return { data: h.groupStatus != null ? { status: h.groupStatus } : null, error: null };
      if (table === "group_shop_purchases" && isUpdate) return h.purchaseUpdateResult;
      return { data: null, error: null };
    };
    const proxy: unknown = new Proxy(
      {},
      {
        get(_t, prop) {
          if (prop === "then")
            return (res: (v: Res) => unknown, rej: (e: unknown) => unknown) =>
              Promise.resolve(resolve()).then(res, rej);
          if (prop === "maybeSingle") return async () => resolve();
          return (...args: unknown[]) => {
            calls.push(String(prop));
            void args;
            return proxy;
          };
        },
      },
    );
    return proxy;
  };
}
const fromMock = vi.fn(makeFrom());
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: fromMock }),
}));

import { markOrderDeliveredAction } from "./actions";

const GID = "a0000000-0000-4000-8000-000000000001";
const OID = "b0000000-0000-4000-8000-000000000002";

function setUser(id: string | null) {
  getUserMock.mockResolvedValue({ data: { user: id ? { id, email: "x@test" } : null } });
}

beforeEach(() => {
  setUser("u-1");
  h.membershipRole = "admin";
  h.groupStatus = "active";
  h.purchaseUpdateResult = { data: [{ id: "order-1" }], error: null };
  fromMock.mockClear();
});
afterEach(() => vi.clearAllMocks());

describe("markOrderDeliveredAction", () => {
  it("refuse un utilisateur non authentifié", async () => {
    setUser(null);
    const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: OID });
    expect(res).toEqual({ ok: false, error: "unauthenticated" });
  });

  it("refuse un admin d'un AUTRE groupe (isolation multi-tenant)", async () => {
    h.membershipRole = null;
    const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: OID });
    expect(res).toEqual({ ok: false, error: "forbidden" });
  });

  it("refuse un simple membre (rôle 'member')", async () => {
    h.membershipRole = "member";
    const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: OID });
    expect(res).toEqual({ ok: false, error: "forbidden" });
  });

  it("refuse l'écriture si le groupe est suspendu", async () => {
    h.groupStatus = "suspended";
    const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: OID });
    expect(res).toEqual({ ok: false, error: "group_suspended" });
  });

  it("rejette un orderId malformé", async () => {
    const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: "not-a-uuid" });
    expect(res).toEqual({ ok: false, error: "not_found" });
  });

  it("renvoie not_found si aucune ligne n'a été modifiée (commande d'un autre groupe / inexistante)", async () => {
    h.purchaseUpdateResult = { data: [], error: null };
    const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: OID });
    expect(res).toEqual({ ok: false, error: "not_found" });
  });

  it("renvoie db en cas d'erreur de mise à jour", async () => {
    h.purchaseUpdateResult = { data: null, error: { message: "boom" } };
    const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: OID });
    expect(res).toEqual({ ok: false, error: "db" });
  });

  it("marque la commande comme livrée pour un admin actif d'un groupe actif", async () => {
    const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: OID });
    expect(res).toEqual({ ok: true });
  });

  it("le Super Admin (ADMIN_EMAILS) peut marquer une commande sans être admin de CE groupe", async () => {
    const prev = process.env.ADMIN_EMAILS;
    process.env.ADMIN_EMAILS = "superadmin@dev.local";
    try {
      h.membershipRole = null; // aucune adhésion sur ce groupe
      getUserMock.mockResolvedValue({ data: { user: { id: "u-admin", email: "superadmin@dev.local" } } });
      const res = await markOrderDeliveredAction({ locale: "fr", groupId: GID, orderId: OID });
      expect(res).toEqual({ ok: true });
    } finally {
      process.env.ADMIN_EMAILS = prev;
    }
  });
});
