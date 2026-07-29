import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/admin", () => ({ isAdmin: () => false }));

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

import { authorizeGroupWrite } from "@/lib/loyalty/access";

beforeEach(() => {
  bypassMock.mockReturnValue(false);
  membershipRes = { data: null, error: null };
  groupRes = { data: null, error: null };
});
afterEach(() => vi.clearAllMocks());

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
