import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const bypassMock = vi.fn(() => false);
vi.mock("@/lib/dev-auth", () => ({ isDevAuthBypass: () => bypassMock() }));

type PremiumResult = { user: { id: string; email?: string } | null; isPremium: boolean };
let premiumRes: PremiumResult = { user: null, isPremium: false };
vi.mock("@/lib/auth/require-premium", () => ({ requirePremium: async () => premiumRes }));

import { isJournalAllowed, requireJournalAccess } from "@/lib/journal/access";

const ORIGINAL = process.env.JOURNAL_EMAILS;
afterEach(() => {
  process.env.JOURNAL_EMAILS = ORIGINAL;
  bypassMock.mockReturnValue(false);
});

describe("requireJournalAccess — mêmes règles que le layout du Journal", () => {
  it("non connecté → notLoggedIn", async () => {
    process.env.JOURNAL_EMAILS = "allowed@example.com";
    premiumRes = { user: null, isPremium: false };
    expect(await requireJournalAccess()).toEqual({ ok: false, reason: "notLoggedIn" });
  });

  it("connecté sans accès premium, même dans la liste → forbidden", async () => {
    process.env.JOURNAL_EMAILS = "allowed@example.com";
    premiumRes = { user: { id: "u1", email: "allowed@example.com" }, isPremium: false };
    expect(await requireJournalAccess()).toEqual({ ok: false, reason: "forbidden" });
  });

  it("premium hors liste JOURNAL_EMAILS → forbidden", async () => {
    process.env.JOURNAL_EMAILS = "allowed@example.com";
    premiumRes = { user: { id: "u2", email: "other@example.com" }, isPremium: true };
    expect(await requireJournalAccess()).toEqual({ ok: false, reason: "forbidden" });
  });

  it("premium dans la liste (casse et espaces ignorés) → ok", async () => {
    process.env.JOURNAL_EMAILS = " Allowed@Example.com , second@example.com";
    premiumRes = { user: { id: "u3", email: "allowed@example.com" }, isPremium: true };
    const res = await requireJournalAccess();
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.user.id).toBe("u3");
  });

  it("liste JOURNAL_EMAILS vide ou absente → personne (fail-closed)", async () => {
    delete process.env.JOURNAL_EMAILS;
    premiumRes = { user: { id: "u4", email: "allowed@example.com" }, isPremium: true };
    expect(await requireJournalAccess()).toEqual({ ok: false, reason: "forbidden" });
    expect(isJournalAllowed("allowed@example.com")).toBe(false);
  });
});
