import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const getUserMock = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: getUserMock } }),
}));

const rpcMock = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ rpc: rpcMock }),
}));

import {
  activatePointsCodeAction,
  joinGroupByReferenceCodeAction,
  purchaseItemAction,
} from "@/app/[locale]/fidelite/actions";

function setUser(id: string | null) {
  getUserMock.mockResolvedValue({ data: { user: id ? { id, email: "m@test" } : null } });
}

beforeEach(() => {
  setUser("u-1");
  rpcMock.mockReset();
});
afterEach(() => vi.clearAllMocks());

const base = { locale: "fr", code: "pts-ab27-9kmn" };

describe("activatePointsCodeAction — gardes", () => {
  it("non authentifié → unauthenticated (aucun appel RPC)", async () => {
    setUser(null);
    expect(await activatePointsCodeAction(base)).toEqual({ ok: false, error: "unauthenticated" });
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("code vide/blanc → invalid (aucun appel RPC)", async () => {
    expect(await activatePointsCodeAction({ ...base, code: "   " })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(await activatePointsCodeAction({ ...base, code: null })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

describe("activatePointsCodeAction — normalisation", () => {
  it("normalise le code (trim + majuscules) avant l'appel RPC", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "ok", credited_points: 10, result_group_id: "g1" }],
      error: null,
    });
    await activatePointsCodeAction({ locale: "fr", code: "  pts-ab27-9kmn  " });
    expect(rpcMock).toHaveBeenCalledWith("activate_points_code", {
      p_code: "PTS-AB27-9KMN",
      p_user_id: "u-1",
    });
  });
});

describe("activatePointsCodeAction — résultats RPC", () => {
  it("ok → crédite les points et renvoie le groupId", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "ok", credited_points: 25, result_group_id: "grp-A" }],
      error: null,
    });
    expect(await activatePointsCodeAction(base)).toEqual({
      ok: true,
      creditedPoints: 25,
      groupId: "grp-A",
    });
  });

  it("not_found → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "not_found", credited_points: null, result_group_id: null }],
      error: null,
    });
    expect(await activatePointsCodeAction(base)).toEqual({ ok: false, error: "not_found" });
  });

  it("already_used → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "already_used", credited_points: null, result_group_id: "grp-A" }],
      error: null,
    });
    expect(await activatePointsCodeAction(base)).toEqual({ ok: false, error: "already_used" });
  });

  it("expired → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "expired", credited_points: null, result_group_id: "grp-A" }],
      error: null,
    });
    expect(await activatePointsCodeAction(base)).toEqual({ ok: false, error: "expired" });
  });

  it("group_suspended → erreur métier, aucun crédit renvoyé", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "group_suspended", credited_points: null, result_group_id: "grp-A" }],
      error: null,
    });
    expect(await activatePointsCodeAction(base)).toEqual({ ok: false, error: "group_suspended" });
  });

  it("erreur réseau/DB → db", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: "boom" } });
    expect(await activatePointsCodeAction(base)).toEqual({ ok: false, error: "db" });
  });

  it("réponse RPC inattendue (result absent/invalide) → db, fail-safe", async () => {
    rpcMock.mockResolvedValue({ data: [{ result: "something_else" }], error: null });
    expect(await activatePointsCodeAction(base)).toEqual({ ok: false, error: "db" });
  });
});

const joinBase = { locale: "fr", code: "grp-ab27-9kmn" };

describe("joinGroupByReferenceCodeAction — gardes", () => {
  it("non authentifié → unauthenticated (aucun appel RPC)", async () => {
    setUser(null);
    expect(await joinGroupByReferenceCodeAction(joinBase)).toEqual({
      ok: false,
      error: "unauthenticated",
    });
    expect(rpcMock).not.toHaveBeenCalled();
  });
  it("code vide/blanc → invalid (aucun appel RPC)", async () => {
    expect(await joinGroupByReferenceCodeAction({ ...joinBase, code: "   " })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

describe("joinGroupByReferenceCodeAction — normalisation", () => {
  it("normalise le code (trim + majuscules) avant l'appel RPC", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "ok", result_group_id: "g1", result_group_name: "Groupe A" }],
      error: null,
    });
    await joinGroupByReferenceCodeAction({ locale: "fr", code: "  grp-ab27-9kmn  " });
    expect(rpcMock).toHaveBeenCalledWith("join_group_by_reference_code", {
      p_reference_code: "GRP-AB27-9KMN",
      p_user_id: "u-1",
    });
  });
});

describe("joinGroupByReferenceCodeAction — résultats RPC", () => {
  it("ok → renvoie groupId et groupName", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "ok", result_group_id: "grp-A", result_group_name: "Groupe A" }],
      error: null,
    });
    expect(await joinGroupByReferenceCodeAction(joinBase)).toEqual({
      ok: true,
      groupId: "grp-A",
      groupName: "Groupe A",
    });
  });
  it("not_found → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "not_found", result_group_id: null, result_group_name: null }],
      error: null,
    });
    expect(await joinGroupByReferenceCodeAction(joinBase)).toEqual({ ok: false, error: "not_found" });
  });
  it("already_member → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "already_member", result_group_id: "grp-A", result_group_name: "Groupe A" }],
      error: null,
    });
    expect(await joinGroupByReferenceCodeAction(joinBase)).toEqual({
      ok: false,
      error: "already_member",
    });
  });
  it("group_suspended → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "group_suspended", result_group_id: "grp-A", result_group_name: "Groupe A" }],
      error: null,
    });
    expect(await joinGroupByReferenceCodeAction(joinBase)).toEqual({
      ok: false,
      error: "group_suspended",
    });
  });
  it("erreur réseau/DB → db", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: "boom" } });
    expect(await joinGroupByReferenceCodeAction(joinBase)).toEqual({ ok: false, error: "db" });
  });
  it("réponse RPC inattendue → db, fail-safe", async () => {
    rpcMock.mockResolvedValue({ data: [{ result: "something_else" }], error: null });
    expect(await joinGroupByReferenceCodeAction(joinBase)).toEqual({ ok: false, error: "db" });
  });
});

const purchaseBase = {
  locale: "fr",
  groupId: "g1",
  itemId: "item-1",
  idempotencyKey: "e3b0c442-98fc-4c1e-8a2b-000000000001",
};

describe("purchaseItemAction — gardes", () => {
  it("non authentifié → unauthenticated (aucun appel RPC)", async () => {
    setUser(null);
    expect(await purchaseItemAction(purchaseBase)).toEqual({ ok: false, error: "unauthenticated" });
    expect(rpcMock).not.toHaveBeenCalled();
  });
  it("idempotencyKey absente/invalide → invalid (aucun appel RPC)", async () => {
    expect(await purchaseItemAction({ ...purchaseBase, idempotencyKey: "not-a-uuid" })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(await purchaseItemAction({ ...purchaseBase, idempotencyKey: null })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(await purchaseItemAction({ ...purchaseBase, idempotencyKey: undefined })).toEqual({
      ok: false,
      error: "invalid",
    });
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

describe("purchaseItemAction — appel RPC", () => {
  it("appelle purchase_shop_item avec l'item, l'utilisateur courant et la clé d'idempotence", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "ok", result_purchase_id: "pu-1", result_price_paid: 50 }],
      error: null,
    });
    await purchaseItemAction(purchaseBase);
    expect(rpcMock).toHaveBeenCalledWith("purchase_shop_item", {
      p_item_id: "item-1",
      p_user_id: "u-1",
      p_idempotency_key: "e3b0c442-98fc-4c1e-8a2b-000000000001",
    });
  });
});

describe("purchaseItemAction — résultats RPC", () => {
  it("ok → renvoie purchaseId et pricePaid", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "ok", result_purchase_id: "pu-1", result_price_paid: 50 }],
      error: null,
    });
    expect(await purchaseItemAction(purchaseBase)).toEqual({
      ok: true,
      purchaseId: "pu-1",
      pricePaid: 50,
    });
  });
  it("already_processed (rejeu de la même clé) → traité comme un succès identique", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "already_processed", result_purchase_id: "pu-1", result_price_paid: 50 }],
      error: null,
    });
    expect(await purchaseItemAction(purchaseBase)).toEqual({
      ok: true,
      purchaseId: "pu-1",
      pricePaid: 50,
    });
  });
  it("idempotency_key_reused (même clé, article différent) → erreur métier, pas un succès", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "idempotency_key_reused", result_purchase_id: null, result_price_paid: null }],
      error: null,
    });
    expect(await purchaseItemAction(purchaseBase)).toEqual({
      ok: false,
      error: "idempotency_key_reused",
    });
  });
  it("insufficient_balance → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "insufficient_balance", result_purchase_id: null, result_price_paid: null }],
      error: null,
    });
    expect(await purchaseItemAction(purchaseBase)).toEqual({
      ok: false,
      error: "insufficient_balance",
    });
  });
  it("item_inactive → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "item_inactive", result_purchase_id: null, result_price_paid: null }],
      error: null,
    });
    expect(await purchaseItemAction(purchaseBase)).toEqual({ ok: false, error: "item_inactive" });
  });
  it("not_member → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "not_member", result_purchase_id: null, result_price_paid: null }],
      error: null,
    });
    expect(await purchaseItemAction(purchaseBase)).toEqual({ ok: false, error: "not_member" });
  });
  it("group_suspended → erreur métier", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "group_suspended", result_purchase_id: null, result_price_paid: null }],
      error: null,
    });
    expect(await purchaseItemAction(purchaseBase)).toEqual({ ok: false, error: "group_suspended" });
  });
  it("erreur réseau/DB → db", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: "boom" } });
    expect(await purchaseItemAction(purchaseBase)).toEqual({ ok: false, error: "db" });
  });
  it("réponse RPC inattendue → db, fail-safe", async () => {
    rpcMock.mockResolvedValue({ data: [{ result: "something_else" }], error: null });
    expect(await purchaseItemAction(purchaseBase)).toEqual({ ok: false, error: "db" });
  });
});
