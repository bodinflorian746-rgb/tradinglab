import { describe, expect, it } from "vitest";
import {
  isActivateOutcome,
  isJoinGroupOutcome,
  isPurchaseOutcome,
  isValidIdempotencyKey,
  normalizeCodeInput,
} from "@/lib/loyalty/member-validation";

describe("normalizeCodeInput", () => {
  it("trim + uppercase", () => {
    expect(normalizeCodeInput("  pts-ab27-9kmn  ")).toBe("PTS-AB27-9KMN");
  });
  it("valeurs non-string → chaîne vide", () => {
    expect(normalizeCodeInput(null)).toBe("");
    expect(normalizeCodeInput(undefined)).toBe("");
    expect(normalizeCodeInput(42)).toBe("");
  });
  it("chaîne vide reste vide après trim", () => {
    expect(normalizeCodeInput("   ")).toBe("");
  });
});

describe("isActivateOutcome", () => {
  it("reconnaît les 5 issues valides", () => {
    for (const v of ["ok", "not_found", "already_used", "expired", "group_suspended"]) {
      expect(isActivateOutcome(v)).toBe(true);
    }
  });
  it("rejette toute autre valeur", () => {
    expect(isActivateOutcome("db_error")).toBe(false);
    expect(isActivateOutcome("")).toBe(false);
  });
});

describe("isJoinGroupOutcome", () => {
  it("reconnaît les 4 issues valides", () => {
    for (const v of ["ok", "not_found", "already_member", "group_suspended"]) {
      expect(isJoinGroupOutcome(v)).toBe(true);
    }
  });
  it("rejette toute autre valeur", () => {
    expect(isJoinGroupOutcome("already_used")).toBe(false);
    expect(isJoinGroupOutcome("")).toBe(false);
  });
});

describe("isPurchaseOutcome", () => {
  it("reconnaît les 8 issues valides", () => {
    for (const v of [
      "ok",
      "already_processed",
      "idempotency_key_reused",
      "not_found",
      "item_inactive",
      "group_suspended",
      "not_member",
      "insufficient_balance",
    ]) {
      expect(isPurchaseOutcome(v)).toBe(true);
    }
  });
  it("rejette toute autre valeur", () => {
    expect(isPurchaseOutcome("already_used")).toBe(false);
    expect(isPurchaseOutcome("")).toBe(false);
  });
});

describe("isValidIdempotencyKey", () => {
  it("accepte un UUID valide (n'importe quelle casse)", () => {
    expect(isValidIdempotencyKey("e3b0c442-98fc-4c1e-8a2b-000000000001")).toBe(true);
    expect(isValidIdempotencyKey("E3B0C442-98FC-4C1E-8A2B-000000000001")).toBe(true);
  });
  it("refuse une valeur non-string, vide, ou mal formée", () => {
    for (const v of [null, undefined, 42, "", "   ", "not-a-uuid", "e3b0c442-98fc-4c1e-8a2b"]) {
      expect(isValidIdempotencyKey(v)).toBe(false);
    }
  });
});
