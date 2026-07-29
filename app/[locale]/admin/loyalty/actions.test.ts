import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const getCurrentSuperAdminMock = vi.fn();
vi.mock("@/lib/loyalty/admin", () => ({
  getCurrentSuperAdmin: () => getCurrentSuperAdminMock(),
}));

type Res = { data?: unknown; error?: unknown };
const h: { upsertResult: Res; updateResult: Res } = {
  upsertResult: { data: null, error: null },
  updateResult: { data: [], error: null },
};

function makeFrom() {
  return (table: string) => {
    void table;
    const calls: string[] = [];
    const resolve = (): Res => (calls.includes("upsert") ? h.upsertResult : h.updateResult);
    const proxy: unknown = new Proxy(
      {},
      {
        get(_t, prop) {
          if (prop === "then")
            return (res: (v: Res) => unknown, rej: (e: unknown) => unknown) =>
              Promise.resolve(resolve()).then(res, rej);
          return (...args: unknown[]) => {
            void args;
            calls.push(String(prop));
            return proxy;
          };
        },
      },
    );
    return proxy;
  };
}
const fromMock = vi.fn(makeFrom());
const rpcMock = vi.fn();
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: fromMock, rpc: rpcMock }),
}));

import {
  setGroupMemberRoleAction,
  createGroupAction,
  addGroupAdminByEmailAction,
  renameGroupAction,
} from "@/app/[locale]/admin/loyalty/actions";

const GID = "a0000000-0000-4000-8000-000000000001";
const UID = "b0000000-0000-4000-8000-000000000002";

beforeEach(() => {
  getCurrentSuperAdminMock.mockResolvedValue({ id: "admin-1", email: "admin@test" });
  h.upsertResult = { data: null, error: null };
  h.updateResult = { data: [], error: null };
  fromMock.mockClear();
  rpcMock.mockReset();
});
afterEach(() => vi.clearAllMocks());

describe("setGroupMemberRoleAction — gardes", () => {
  it("non Super Admin → forbidden (aucune écriture)", async () => {
    getCurrentSuperAdminMock.mockResolvedValue(null);
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: GID, userId: UID, role: "admin" }),
    ).toEqual({ ok: false, error: "forbidden" });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("groupId invalide → invalid", async () => {
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: "not-a-uuid", userId: UID, role: "admin" }),
    ).toEqual({ ok: false, error: "invalid" });
  });

  it("userId invalide → invalid", async () => {
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: GID, userId: "not-a-uuid", role: "admin" }),
    ).toEqual({ ok: false, error: "invalid" });
  });
});

describe("setGroupMemberRoleAction — promotion (admin)", () => {
  it("succès → ok, upsert appelé", async () => {
    h.upsertResult = { data: [{ id: "m-1" }], error: null };
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: GID, userId: UID, role: "admin" }),
    ).toEqual({ ok: true });
  });

  it("utilisateur inexistant (violation FK 23503) → user_not_found", async () => {
    h.upsertResult = { data: null, error: { code: "23503", message: "fk violation" } };
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: GID, userId: UID, role: "admin" }),
    ).toEqual({ ok: false, error: "user_not_found" });
  });

  it("erreur DB générique → db", async () => {
    h.upsertResult = { data: null, error: { code: "XXOOO", message: "boom" } };
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: GID, userId: UID, role: "admin" }),
    ).toEqual({ ok: false, error: "db" });
  });
});

describe("setGroupMemberRoleAction — rétrogradation (member)", () => {
  it("succès : exactement 1 ligne modifiée", async () => {
    h.updateResult = { data: [{ id: "m-1" }], error: null };
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: GID, userId: UID, role: "member" }),
    ).toEqual({ ok: true });
  });

  it("utilisateur non membre du groupe → not_found", async () => {
    h.updateResult = { data: [], error: null };
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: GID, userId: UID, role: "member" }),
    ).toEqual({ ok: false, error: "not_found" });
  });

  it("erreur DB → db", async () => {
    h.updateResult = { data: null, error: { message: "boom" } };
    expect(
      await setGroupMemberRoleAction({ locale: "fr", groupId: GID, userId: UID, role: "member" }),
    ).toEqual({ ok: false, error: "db" });
  });
});

const createGroupOk = { locale: "fr", name: "Crypto VIP", adminEmails: ["admin@email.com"] };

describe("createGroupAction — gardes et validation", () => {
  it("non Super Admin → forbidden (aucune requête)", async () => {
    getCurrentSuperAdminMock.mockResolvedValue(null);
    expect(await createGroupAction(createGroupOk)).toEqual({ ok: false, error: "forbidden" });
    expect(rpcMock).not.toHaveBeenCalled();
  });
  it("nom invalide → invalid_name (aucune requête)", async () => {
    expect(await createGroupAction({ ...createGroupOk, name: "" })).toEqual({
      ok: false,
      error: "invalid_name",
    });
    expect(rpcMock).not.toHaveBeenCalled();
  });
  it("e-mails invalides → invalid_emails (aucune requête)", async () => {
    expect(await createGroupAction({ ...createGroupOk, adminEmails: [] })).toEqual({
      ok: false,
      error: "invalid_emails",
    });
    expect(
      await createGroupAction({ ...createGroupOk, adminEmails: ["not-an-email"] }),
    ).toEqual({ ok: false, error: "invalid_emails" });
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

describe("createGroupAction — création", () => {
  it("succès → ok + groupId", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "ok", result_group_id: "g-1", result_missing_email: null }],
      error: null,
    });
    expect(await createGroupAction(createGroupOk)).toEqual({ ok: true, groupId: "g-1" });
  });
  it("appelle la RPC avec les e-mails normalisés et le créateur courant", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "ok", result_group_id: "g-1", result_missing_email: null }],
      error: null,
    });
    await createGroupAction({ ...createGroupOk, adminEmails: ["  Admin@Email.COM  "] });
    expect(rpcMock).toHaveBeenCalledWith(
      "create_group_with_admins",
      expect.objectContaining({
        p_name: "Crypto VIP",
        p_admin_emails: ["admin@email.com"],
        p_created_by: "admin-1",
      }),
    );
  });
  it("e-mail sans compte correspondant → email_not_found avec le détail", async () => {
    rpcMock.mockResolvedValue({
      data: [{ result: "email_not_found", result_group_id: null, result_missing_email: "nobody@email.com" }],
      error: null,
    });
    expect(await createGroupAction(createGroupOk)).toEqual({
      ok: false,
      error: "email_not_found",
      detail: "nobody@email.com",
    });
  });
  it("collision de slug (23505) → régénère et réessaie", async () => {
    rpcMock
      .mockResolvedValueOnce({ data: null, error: { code: "23505", message: "dup" } })
      .mockResolvedValueOnce({
        data: [{ result: "ok", result_group_id: "g-1", result_missing_email: null }],
        error: null,
      });
    expect(await createGroupAction(createGroupOk)).toEqual({ ok: true, groupId: "g-1" });
    expect(rpcMock).toHaveBeenCalledTimes(2);
  });
  it("erreur DB non-collision → db", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { code: "XXOOO", message: "boom" } });
    expect(await createGroupAction(createGroupOk)).toEqual({ ok: false, error: "db" });
  });
});

const addAdminOk = { locale: "fr", groupId: GID, email: "admin@email.com" };

describe("addGroupAdminByEmailAction — gardes et validation", () => {
  it("non Super Admin → forbidden (aucune requête)", async () => {
    getCurrentSuperAdminMock.mockResolvedValue(null);
    expect(await addGroupAdminByEmailAction(addAdminOk)).toEqual({ ok: false, error: "forbidden" });
    expect(rpcMock).not.toHaveBeenCalled();
  });
  it("groupId invalide → invalid", async () => {
    expect(await addGroupAdminByEmailAction({ ...addAdminOk, groupId: "not-a-uuid" })).toEqual({
      ok: false,
      error: "invalid",
    });
  });
  it("e-mail invalide → invalid_email (aucune requête)", async () => {
    expect(await addGroupAdminByEmailAction({ ...addAdminOk, email: "not-an-email" })).toEqual({
      ok: false,
      error: "invalid_email",
    });
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

describe("addGroupAdminByEmailAction — attribution", () => {
  it("succès : e-mail résolu puis upsert admin", async () => {
    rpcMock.mockResolvedValue({ data: UID, error: null });
    h.upsertResult = { data: [{ id: "m-1" }], error: null };
    expect(await addGroupAdminByEmailAction(addAdminOk)).toEqual({ ok: true });
    expect(rpcMock).toHaveBeenCalledWith("get_user_id_by_email", { p_email: "admin@email.com" });
  });
  it("e-mail sans compte correspondant → email_not_found", async () => {
    rpcMock.mockResolvedValue({ data: null, error: null });
    expect(await addGroupAdminByEmailAction(addAdminOk)).toEqual({ ok: false, error: "email_not_found" });
  });
  it("erreur lors du lookup → db", async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: "boom" } });
    expect(await addGroupAdminByEmailAction(addAdminOk)).toEqual({ ok: false, error: "db" });
  });
});

describe("renameGroupAction", () => {
  const renameOk = { locale: "fr", groupId: GID, name: "Nouveau nom" };

  it("non Super Admin → forbidden", async () => {
    getCurrentSuperAdminMock.mockResolvedValue(null);
    expect(await renameGroupAction(renameOk)).toEqual({ ok: false, error: "forbidden" });
  });
  it("nom invalide → invalid_name", async () => {
    expect(await renameGroupAction({ ...renameOk, name: "" })).toEqual({
      ok: false,
      error: "invalid_name",
    });
  });
  it("succès : exactement 1 ligne modifiée", async () => {
    h.updateResult = { data: [{ id: GID }], error: null };
    expect(await renameGroupAction(renameOk)).toEqual({ ok: true });
  });
  it("groupe inexistant → not_found", async () => {
    h.updateResult = { data: [], error: null };
    expect(await renameGroupAction(renameOk)).toEqual({ ok: false, error: "not_found" });
  });
  it("erreur DB → db", async () => {
    h.updateResult = { data: null, error: { message: "boom" } };
    expect(await renameGroupAction(renameOk)).toEqual({ ok: false, error: "db" });
  });
});
