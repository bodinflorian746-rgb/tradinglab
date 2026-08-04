import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// Utilisateur courant (session)
const getUserMock = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: getUserMock } }),
}));

// Client service_role : réponses configurables par table / opération.
type Res = { data?: unknown; error?: unknown };
const h: {
  membershipRole: string | null;
  groupStatus: string | null;
  insertQueue: Res[];
  updateResult: Res;
  codeLookup: { group_id: string; status: string } | null;
  shopInsertResult: Res;
  shopUpdateResult: Res;
  unlockInsertQueue: Res[];
  unlockUpdateResult: Res;
  unlockCodeLookup: { group_id: string; status: string } | null;
  telegramUpdateResult: Res;
} = {
  membershipRole: "admin",
  groupStatus: "active",
  insertQueue: [],
  updateResult: { data: [], error: null },
  codeLookup: null,
  shopInsertResult: { data: { id: "item-1" }, error: null },
  shopUpdateResult: { data: [{ id: "item-1" }], error: null },
  unlockInsertQueue: [],
  unlockUpdateResult: { data: [], error: null },
  unlockCodeLookup: null,
  telegramUpdateResult: { data: [{ id: "g1" }], error: null },
};

function makeFrom() {
  return (table: string) => {
    const calls: string[] = [];
    const resolve = (): Res => {
      const isInsert = calls.includes("insert");
      const isUpdate = calls.includes("update");
      if (table === "group_memberships")
        return { data: h.membershipRole != null ? { role: h.membershipRole } : null, error: null };
      if (table === "partner_groups") {
        if (isUpdate) return h.telegramUpdateResult;
        return { data: h.groupStatus != null ? { status: h.groupStatus } : null, error: null };
      }
      if (table === "points_codes") {
        if (isInsert) return h.insertQueue.shift() ?? { data: [], error: null };
        if (isUpdate) return h.updateResult;
        return { data: h.codeLookup, error: null };
      }
      if (table === "group_shop_items") {
        if (isInsert) return h.shopInsertResult;
        if (isUpdate) return h.shopUpdateResult;
        return { data: null, error: null };
      }
      if (table === "access_codes") {
        if (isInsert) return h.unlockInsertQueue.shift() ?? { data: [], error: null };
        if (isUpdate) return h.unlockUpdateResult;
        return { data: h.unlockCodeLookup, error: null };
      }
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

import {
  generatePointsCodesAction,
  revokePointsCodeAction,
  createShopItemAction,
  updateShopItemAction,
  toggleShopItemStatusAction,
  generateAccessCodesAction,
  revokeAccessCodeAction,
  updateGroupTelegramAction,
} from "@/app/[locale]/master/actions";

const GID = "a0000000-0000-4000-8000-000000000001";

function setUser(id: string | null) {
  getUserMock.mockResolvedValue({ data: { user: id ? { id, email: "x@test" } : null } });
}

beforeEach(() => {
  setUser("u-1");
  h.membershipRole = "admin";
  h.groupStatus = "active";
  h.insertQueue = [];
  h.updateResult = { data: [], error: null };
  h.codeLookup = null;
  h.shopInsertResult = { data: { id: "item-1" }, error: null };
  h.shopUpdateResult = { data: [{ id: "item-1" }], error: null };
  h.unlockInsertQueue = [];
  h.unlockUpdateResult = { data: [], error: null };
  h.unlockCodeLookup = null;
  h.telegramUpdateResult = { data: [{ id: "g1" }], error: null };
  fromMock.mockClear();
});
afterEach(() => vi.clearAllMocks());

const genOk = { locale: "fr", groupId: GID, count: 1, pointsValue: 10, expiresAt: null };

describe("generatePointsCodesAction — gardes", () => {
  it("non authentifié → unauthenticated (aucune requête)", async () => {
    setUser(null);
    expect(await generatePointsCodesAction(genOk)).toEqual({ ok: false, error: "unauthenticated" });
    expect(fromMock).not.toHaveBeenCalled();
  });
  it("non admin du groupe → forbidden", async () => {
    h.membershipRole = null;
    expect(await generatePointsCodesAction(genOk)).toEqual({ ok: false, error: "forbidden" });
  });
  it("groupe suspendu → group_suspended", async () => {
    h.groupStatus = "suspended";
    expect(await generatePointsCodesAction(genOk)).toEqual({ ok: false, error: "group_suspended" });
  });
});

describe("generatePointsCodesAction — validation", () => {
  it("count hors bornes → invalid_count", async () => {
    expect(await generatePointsCodesAction({ ...genOk, count: 0 })).toEqual({ ok: false, error: "invalid_count" });
    expect(await generatePointsCodesAction({ ...genOk, count: 5001 })).toEqual({ ok: false, error: "invalid_count" });
  });
  it("value hors bornes → invalid_value", async () => {
    expect(await generatePointsCodesAction({ ...genOk, pointsValue: 0 })).toEqual({ ok: false, error: "invalid_value" });
    expect(await generatePointsCodesAction({ ...genOk, pointsValue: 1_000_001 })).toEqual({ ok: false, error: "invalid_value" });
  });
  it("expiration passée → expiry_not_future", async () => {
    expect(
      await generatePointsCodesAction({ ...genOk, expiresAt: "2000-01-01" }),
    ).toEqual({ ok: false, error: "expiry_not_future" });
  });
});

describe("generatePointsCodesAction — génération", () => {
  it("succès : created === count", async () => {
    h.insertQueue = [{ data: [{ code: "a" }, { code: "b" }, { code: "c" }], error: null }];
    expect(await generatePointsCodesAction({ ...genOk, count: 3 })).toEqual({ ok: true, created: 3 });
  });
  it("collision (23505) puis succès → retry transparent", async () => {
    h.insertQueue = [
      { data: null, error: { code: "23505", message: "dup" } },
      { data: [{ code: "a" }], error: null },
    ];
    expect(await generatePointsCodesAction({ ...genOk, count: 1 })).toEqual({ ok: true, created: 1 });
  });
  it("erreur DB non-collision → db", async () => {
    h.insertQueue = [{ data: null, error: { code: "23514", message: "check" } }];
    expect(await generatePointsCodesAction(genOk)).toEqual({ ok: false, error: "db" });
  });
});

describe("revokePointsCodeAction", () => {
  const rev = { locale: "fr", groupId: GID, code: "PTS-DEMO-A001" };

  it("succès : exactement 1 ligne modifiée", async () => {
    h.updateResult = { data: [{ code: "PTS-DEMO-A001" }], error: null };
    expect(await revokePointsCodeAction(rev)).toEqual({ ok: true });
  });
  it("0 ligne + code used → not_revocable", async () => {
    h.updateResult = { data: [], error: null };
    h.codeLookup = { group_id: GID, status: "used" };
    expect(await revokePointsCodeAction(rev)).toEqual({ ok: false, error: "not_revocable" });
  });
  it("0 ligne + autre groupe → wrong_group", async () => {
    h.updateResult = { data: [], error: null };
    h.codeLookup = { group_id: "other", status: "available" };
    expect(await revokePointsCodeAction(rev)).toEqual({ ok: false, error: "wrong_group" });
  });
  it("0 ligne + code inexistant → not_found", async () => {
    h.updateResult = { data: [], error: null };
    h.codeLookup = null;
    expect(await revokePointsCodeAction(rev)).toEqual({ ok: false, error: "not_found" });
  });
  it("groupe suspendu → group_suspended (aucune écriture)", async () => {
    h.groupStatus = "suspended";
    expect(await revokePointsCodeAction(rev)).toEqual({ ok: false, error: "group_suspended" });
  });
  it("non admin → forbidden", async () => {
    h.membershipRole = null;
    expect(await revokePointsCodeAction(rev)).toEqual({ ok: false, error: "forbidden" });
  });
});

const shopOk = {
  locale: "fr",
  groupId: GID,
  name: "T-shirt",
  description: "Coton bio",
  itemType: "product" as const,
  pricePoints: 100,
};

describe("createShopItemAction — gardes", () => {
  it("non authentifié → unauthenticated (aucune requête)", async () => {
    setUser(null);
    expect(await createShopItemAction(shopOk)).toEqual({ ok: false, error: "unauthenticated" });
    expect(fromMock).not.toHaveBeenCalled();
  });
  it("non admin du groupe → forbidden", async () => {
    h.membershipRole = null;
    expect(await createShopItemAction(shopOk)).toEqual({ ok: false, error: "forbidden" });
  });
  it("groupe suspendu → group_suspended (aucune écriture)", async () => {
    h.groupStatus = "suspended";
    expect(await createShopItemAction(shopOk)).toEqual({ ok: false, error: "group_suspended" });
  });
});

describe("createShopItemAction — validation", () => {
  it("nom invalide → invalid_name", async () => {
    expect(await createShopItemAction({ ...shopOk, name: "" })).toEqual({
      ok: false,
      error: "invalid_name",
    });
  });
  it("prix invalide → invalid_price", async () => {
    expect(await createShopItemAction({ ...shopOk, pricePoints: -1 })).toEqual({
      ok: false,
      error: "invalid_price",
    });
  });
  it("prix 0 (article gratuit) → accepté", async () => {
    h.shopInsertResult = { data: { id: "item-free" }, error: null };
    expect(await createShopItemAction({ ...shopOk, pricePoints: 0 })).toEqual({
      ok: true,
      itemId: "item-free",
    });
  });
});

describe("createShopItemAction — écriture", () => {
  it("succès → ok + itemId", async () => {
    h.shopInsertResult = { data: { id: "item-42" }, error: null };
    expect(await createShopItemAction(shopOk)).toEqual({ ok: true, itemId: "item-42" });
  });
  it("erreur DB → db", async () => {
    h.shopInsertResult = { data: null, error: { message: "boom" } };
    expect(await createShopItemAction(shopOk)).toEqual({ ok: false, error: "db" });
  });
});

describe("updateShopItemAction", () => {
  const upd = { ...shopOk, itemId: "item-1" };

  it("succès : exactement 1 ligne modifiée", async () => {
    h.shopUpdateResult = { data: [{ id: "item-1" }], error: null };
    expect(await updateShopItemAction(upd)).toEqual({ ok: true, itemId: "item-1" });
  });
  it("0 ligne modifiée (item d'un autre groupe) → not_found", async () => {
    h.shopUpdateResult = { data: [], error: null };
    expect(await updateShopItemAction(upd)).toEqual({ ok: false, error: "not_found" });
  });
  it("groupe suspendu → group_suspended", async () => {
    h.groupStatus = "suspended";
    expect(await updateShopItemAction(upd)).toEqual({ ok: false, error: "group_suspended" });
  });
  it("non admin → forbidden", async () => {
    h.membershipRole = null;
    expect(await updateShopItemAction(upd)).toEqual({ ok: false, error: "forbidden" });
  });
  it("validation réutilisée : prix invalide → invalid_price", async () => {
    expect(await updateShopItemAction({ ...upd, pricePoints: -1 })).toEqual({
      ok: false,
      error: "invalid_price",
    });
  });
});

describe("toggleShopItemStatusAction", () => {
  const tog = { locale: "fr", groupId: GID, itemId: "item-1", nextStatus: "inactive" as const };

  it("succès → ok + itemId", async () => {
    h.shopUpdateResult = { data: [{ id: "item-1" }], error: null };
    expect(await toggleShopItemStatusAction(tog)).toEqual({ ok: true, itemId: "item-1" });
  });
  it("0 ligne modifiée (item d'un autre groupe) → not_found", async () => {
    h.shopUpdateResult = { data: [], error: null };
    expect(await toggleShopItemStatusAction(tog)).toEqual({ ok: false, error: "not_found" });
  });
  it("groupe suspendu → group_suspended", async () => {
    h.groupStatus = "suspended";
    expect(await toggleShopItemStatusAction(tog)).toEqual({ ok: false, error: "group_suspended" });
  });
  it("non admin → forbidden", async () => {
    h.membershipRole = null;
    expect(await toggleShopItemStatusAction(tog)).toEqual({ ok: false, error: "forbidden" });
  });
});

const unlockGenOk = {
  locale: "fr",
  groupId: GID,
  count: 1,
  kind: "lifetime" as const,
  durationDays: null,
  expiresAt: null,
};

describe("generateAccessCodesAction — gardes", () => {
  it("non authentifié → unauthenticated (aucune requête)", async () => {
    setUser(null);
    expect(await generateAccessCodesAction(unlockGenOk)).toEqual({ ok: false, error: "unauthenticated" });
    expect(fromMock).not.toHaveBeenCalled();
  });
  it("non admin du groupe → forbidden", async () => {
    h.membershipRole = null;
    expect(await generateAccessCodesAction(unlockGenOk)).toEqual({ ok: false, error: "forbidden" });
  });
  it("groupe suspendu → group_suspended", async () => {
    h.groupStatus = "suspended";
    expect(await generateAccessCodesAction(unlockGenOk)).toEqual({ ok: false, error: "group_suspended" });
  });
});

describe("generateAccessCodesAction — validation", () => {
  it("count invalide → invalid_count (mais aucune limite métier haute)", async () => {
    expect(await generateAccessCodesAction({ ...unlockGenOk, count: 0 })).toEqual({
      ok: false,
      error: "invalid_count",
    });
  });
  it("kind invalide → invalid_kind (jamais trial/broker pour un admin de groupe)", async () => {
    expect(await generateAccessCodesAction({ ...unlockGenOk, kind: "trial" })).toEqual({
      ok: false,
      error: "invalid_kind",
    });
  });
  it("kind='duration' sans durationDays valide → invalid_duration", async () => {
    expect(
      await generateAccessCodesAction({ ...unlockGenOk, kind: "duration", durationDays: 0 }),
    ).toEqual({ ok: false, error: "invalid_duration" });
  });
  it("expiration passée → expiry_not_future", async () => {
    expect(await generateAccessCodesAction({ ...unlockGenOk, expiresAt: "2000-01-01" })).toEqual({
      ok: false,
      error: "expiry_not_future",
    });
  });
});

describe("generateAccessCodesAction — génération", () => {
  it("succès (lifetime) : created === count", async () => {
    h.unlockInsertQueue = [{ data: [{ code: "a" }, { code: "b" }, { code: "c" }], error: null }];
    expect(await generateAccessCodesAction({ ...unlockGenOk, count: 3 })).toEqual({ ok: true, created: 3 });
  });
  it("succès (duration) : created === count, grande quantité et grande durée acceptées", async () => {
    h.unlockInsertQueue = [{ data: [{ code: "a" }], error: null }];
    expect(
      await generateAccessCodesAction({
        ...unlockGenOk,
        count: 1,
        kind: "duration",
        durationDays: 365,
      }),
    ).toEqual({ ok: true, created: 1 });
  });
  it("collision (23505) puis succès → retry transparent", async () => {
    h.unlockInsertQueue = [
      { data: null, error: { code: "23505", message: "dup" } },
      { data: [{ code: "a" }], error: null },
    ];
    expect(await generateAccessCodesAction({ ...unlockGenOk, count: 1 })).toEqual({ ok: true, created: 1 });
  });
  it("erreur DB non-collision → db", async () => {
    h.unlockInsertQueue = [{ data: null, error: { code: "23514", message: "check" } }];
    expect(await generateAccessCodesAction(unlockGenOk)).toEqual({ ok: false, error: "db" });
  });
});

describe("revokeAccessCodeAction", () => {
  const rev = { locale: "fr", groupId: GID, code: "TSX-DEMO-A001" };

  it("succès : exactement 1 ligne modifiée", async () => {
    h.unlockUpdateResult = { data: [{ code: "TSX-DEMO-A001" }], error: null };
    expect(await revokeAccessCodeAction(rev)).toEqual({ ok: true });
  });
  it("0 ligne + code used → not_revocable", async () => {
    h.unlockUpdateResult = { data: [], error: null };
    h.unlockCodeLookup = { group_id: GID, status: "used" };
    expect(await revokeAccessCodeAction(rev)).toEqual({ ok: false, error: "not_revocable" });
  });
  it("0 ligne + autre groupe → wrong_group", async () => {
    h.unlockUpdateResult = { data: [], error: null };
    h.unlockCodeLookup = { group_id: "other", status: "available" };
    expect(await revokeAccessCodeAction(rev)).toEqual({ ok: false, error: "wrong_group" });
  });
  it("0 ligne + code inexistant → not_found", async () => {
    h.unlockUpdateResult = { data: [], error: null };
    h.unlockCodeLookup = null;
    expect(await revokeAccessCodeAction(rev)).toEqual({ ok: false, error: "not_found" });
  });
  it("groupe suspendu → group_suspended (aucune écriture)", async () => {
    h.groupStatus = "suspended";
    expect(await revokeAccessCodeAction(rev)).toEqual({ ok: false, error: "group_suspended" });
  });
  it("non admin → forbidden", async () => {
    h.membershipRole = null;
    expect(await revokeAccessCodeAction(rev)).toEqual({ ok: false, error: "forbidden" });
  });
});

describe("updateGroupTelegramAction", () => {
  const base = { locale: "fr", groupId: GID, telegramReference: "@monhandle" };

  it("succès : admin actif du groupe", async () => {
    expect(await updateGroupTelegramAction(base)).toEqual({ ok: true });
  });

  it("succès : Super Admin (autorisé via authorizeGroupWrite, pas admin de CE groupe)", async () => {
    const prev = process.env.ADMIN_EMAILS;
    process.env.ADMIN_EMAILS = "superadmin@dev.local";
    try {
      h.membershipRole = null;
      getUserMock.mockResolvedValue({ data: { user: { id: "u-admin", email: "superadmin@dev.local" } } });
      expect(await updateGroupTelegramAction(base)).toEqual({ ok: true });
    } finally {
      process.env.ADMIN_EMAILS = prev;
    }
  });

  it("chaîne vide → telegram_reference mis à null (effacement autorisé)", async () => {
    expect(await updateGroupTelegramAction({ ...base, telegramReference: "   " })).toEqual({ ok: true });
  });

  it("valeur non-string → invalid_telegram", async () => {
    expect(await updateGroupTelegramAction({ ...base, telegramReference: 42 })).toEqual({
      ok: false,
      error: "invalid_telegram",
    });
  });

  it("valeur trop longue (> 500) → invalid_telegram", async () => {
    expect(await updateGroupTelegramAction({ ...base, telegramReference: "x".repeat(501) })).toEqual({
      ok: false,
      error: "invalid_telegram",
    });
  });

  it("groupe suspendu → group_suspended (aucune écriture)", async () => {
    h.groupStatus = "suspended";
    expect(await updateGroupTelegramAction(base)).toEqual({ ok: false, error: "group_suspended" });
  });

  it("non admin de ce groupe → forbidden", async () => {
    h.membershipRole = null;
    getUserMock.mockResolvedValue({ data: { user: { id: "u-1", email: "notadmin@test" } } });
    expect(await updateGroupTelegramAction(base)).toEqual({ ok: false, error: "forbidden" });
  });

  it("non authentifié → unauthenticated", async () => {
    setUser(null);
    expect(await updateGroupTelegramAction(base)).toEqual({ ok: false, error: "unauthenticated" });
  });

  it("aucune ligne modifiée (groupe inexistant après le check) → not_found", async () => {
    h.telegramUpdateResult = { data: [], error: null };
    expect(await updateGroupTelegramAction(base)).toEqual({ ok: false, error: "not_found" });
  });

  it("erreur DB → db", async () => {
    h.telegramUpdateResult = { data: null, error: { message: "boom" } };
    expect(await updateGroupTelegramAction(base)).toEqual({ ok: false, error: "db" });
  });
});
