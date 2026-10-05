import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const isAdminMock = vi.fn(() => false);
vi.mock("@/lib/auth/admin", () => ({ isAdmin: () => isAdminMock() }));

const bypassMock = vi.fn();
vi.mock("@/lib/dev-auth", () => ({
  isDevAuthBypass: () => bypassMock(),
}));

type Res = { data: unknown; error: unknown };
let membershipRes: Res = { data: null, error: null };
let groupRes: Res = { data: null, error: null };

function makeFrom() {
  return (table: string) => {
    const resolve = (): Res => (table === "group_memberships" ? membershipRes : groupRes);
    const proxy: unknown = new Proxy(
      {},
      {
        get(_t, prop) {
          if (prop === "then")
            return (res: (v: Res) => unknown, rej: (e: unknown) => unknown) =>
              Promise.resolve(resolve()).then(res, rej);
          if (prop === "maybeSingle") return async () => resolve();
          return () => proxy;
        },
      },
    );
    return proxy;
  };
}
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({ from: makeFrom() }),
}));

import { authorizeGroupWrite, canManageGroup } from "@/lib/loyalty/access";

beforeEach(() => {
  bypassMock.mockReturnValue(false);
  isAdminMock.mockReturnValue(false);
  membershipRes = { data: null, error: null };
  groupRes = { data: null, error: null };
});
afterEach(() => vi.clearAllMocks());

// canManageGroup est le garde réutilisé par app/[locale]/master/[groupId]/
// page.tsx pour décider de la visibilité de l'e-mail admin (Super Admin OU
// admin actif de CE groupe précis) — couverture directe de cette garantie
// de sécurité, indépendamment du guard de page getGroupAdminUser.
describe("canManageGroup", () => {
  it("un simple membre (role='member') du groupe → false (ne voit jamais l'e-mail admin)", async () => {
    membershipRes = { data: { role: "member" }, error: null };
    expect(await canManageGroup("u1", "member@test", "g1")).toBe(false);
  });

  it("aucune adhésion au groupe → false", async () => {
    membershipRes = { data: null, error: null };
    expect(await canManageGroup("u1", "stranger@test", "g1")).toBe(false);
  });

  it("admin actif de CE groupe → true", async () => {
    membershipRes = { data: { role: "admin" }, error: null };
    expect(await canManageGroup("u1", "admin@test", "g1")).toBe(true);
  });

  it("admin d'un AUTRE groupe (isolation multi-tenant) → false", async () => {
    membershipRes = { data: null, error: null }; // pas d'adhésion sur g2
    expect(await canManageGroup("admin-of-g1", "admin@test", "g2")).toBe(false);
  });

  it("Super Admin (ADMIN_EMAILS) → true même sans adhésion au groupe", async () => {
    isAdminMock.mockReturnValue(true);
    membershipRes = { data: null, error: null };
    expect(await canManageGroup("super-admin-id", "superadmin@dev.local", "g1")).toBe(true);
  });
});

describe("authorizeGroupWrite — hors bypass (comportement normal)", () => {
  it("non-admin → forbidden", async () => {
    membershipRes = { data: null, error: null };
    expect(await authorizeGroupWrite("u1", "g1")).toBe("forbidden");
  });

  it("admin + groupe actif → ok", async () => {
    membershipRes = { data: { role: "admin" }, error: null };
    groupRes = { data: { status: "active" }, error: null };
    expect(await authorizeGroupWrite("u1", "g1")).toBe("ok");
  });

  it("admin + groupe suspendu → group_suspended", async () => {
    membershipRes = { data: { role: "admin" }, error: null };
    groupRes = { data: { status: "suspended" }, error: null };
    expect(await authorizeGroupWrite("u1", "g1")).toBe("group_suspended");
  });
});

describe("authorizeGroupWrite — bypass dev", () => {
  it("dispense la vérification d'admin (non-admin autorisé)", async () => {
    bypassMock.mockReturnValue(true);
    membershipRes = { data: null, error: null };
    groupRes = { data: { status: "active" }, error: null };
    expect(await authorizeGroupWrite("dev-user", "g1")).toBe("ok");
  });

  it("RÉGRESSION : n'exempte JAMAIS la règle « groupe suspendu »", async () => {
    bypassMock.mockReturnValue(true);
    membershipRes = { data: null, error: null }; // pas admin, sans importance en bypass
    groupRes = { data: { status: "suspended" }, error: null };
    expect(await authorizeGroupWrite("dev-user", "g1")).toBe("group_suspended");
  });
});
