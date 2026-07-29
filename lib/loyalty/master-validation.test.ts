import { describe, expect, it } from "vitest";
import {
  classifyRevokeFailure,
  validateAccessCodeGenerateParams,
  validateGenerateParams,
  validateShopItemParams,
} from "@/lib/loyalty/master-validation";

const NOW = Date.UTC(2026, 6, 22); // 2026-07-22
const future = new Date(NOW + 86_400_000).toISOString();
const past = new Date(NOW - 86_400_000).toISOString();

describe("validateGenerateParams — count", () => {
  it("accepte 1..5000 (garde-fou technique, pas de limite métier)", () => {
    expect(validateGenerateParams({ count: 1, pointsValue: 10, expiresAt: null }, NOW).ok).toBe(true);
    expect(validateGenerateParams({ count: 100, pointsValue: 10, expiresAt: null }, NOW).ok).toBe(true);
    expect(validateGenerateParams({ count: 5000, pointsValue: 10, expiresAt: null }, NOW).ok).toBe(true);
  });
  it("refuse 0, 5001, non-entier", () => {
    for (const c of [0, 5001, 2.5, -1, "abc"]) {
      const r = validateGenerateParams({ count: c, pointsValue: 10, expiresAt: null }, NOW);
      expect(r).toEqual({ ok: false, error: "invalid_count" });
    }
  });
});

describe("validateGenerateParams — pointsValue", () => {
  it("accepte 1 et 1000000 (garde-fou technique, pas de limite métier)", () => {
    expect(validateGenerateParams({ count: 1, pointsValue: 1, expiresAt: null }, NOW).ok).toBe(true);
    expect(validateGenerateParams({ count: 1, pointsValue: 20_000, expiresAt: null }, NOW).ok).toBe(true);
    expect(validateGenerateParams({ count: 1, pointsValue: 1_000_000, expiresAt: null }, NOW).ok).toBe(true);
  });
  it("refuse 0, 1000001, non-entier", () => {
    for (const v of [0, 1_000_001, 3.3, -5, "x"]) {
      const r = validateGenerateParams({ count: 1, pointsValue: v, expiresAt: null }, NOW);
      expect(r).toEqual({ ok: false, error: "invalid_value" });
    }
  });
});

describe("validateGenerateParams — expiresAt", () => {
  it("null/vide → expiresAt null", () => {
    expect(validateGenerateParams({ count: 1, pointsValue: 10, expiresAt: "" }, NOW)).toEqual({
      ok: true,
      value: { count: 1, pointsValue: 10, expiresAt: null },
    });
    expect(validateGenerateParams({ count: 1, pointsValue: 10, expiresAt: null }, NOW)).toMatchObject({ ok: true });
  });
  it("date future → ISO", () => {
    const r = validateGenerateParams({ count: 1, pointsValue: 10, expiresAt: future }, NOW);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.expiresAt).toBe(new Date(future).toISOString());
  });
  it("date passée → expiry_not_future", () => {
    expect(validateGenerateParams({ count: 1, pointsValue: 10, expiresAt: past }, NOW)).toEqual({
      ok: false,
      error: "expiry_not_future",
    });
  });
  it("maintenant exact → refusé (strictement futur)", () => {
    expect(validateGenerateParams({ count: 1, pointsValue: 10, expiresAt: new Date(NOW).toISOString() }, NOW)).toEqual({
      ok: false,
      error: "expiry_not_future",
    });
  });
  it("date invalide → invalid_expiry", () => {
    expect(validateGenerateParams({ count: 1, pointsValue: 10, expiresAt: "pas-une-date" }, NOW)).toEqual({
      ok: false,
      error: "invalid_expiry",
    });
  });
});

describe("validateShopItemParams — name", () => {
  it("accepte un nom non vide après trim", () => {
    const r = validateShopItemParams({
      name: "  T-shirt  ",
      description: null,
      itemType: "product",
      pricePoints: 100,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.name).toBe("T-shirt");
  });
  it("refuse un nom vide ou uniquement des espaces", () => {
    for (const name of ["", "   ", null, undefined, 42]) {
      const r = validateShopItemParams({ name, description: null, itemType: "product", pricePoints: 10 });
      expect(r).toEqual({ ok: false, error: "invalid_name" });
    }
  });
  it("refuse un nom > 120 caractères", () => {
    const r = validateShopItemParams({
      name: "a".repeat(121),
      description: null,
      itemType: "product",
      pricePoints: 10,
    });
    expect(r).toEqual({ ok: false, error: "invalid_name" });
  });
});

describe("validateShopItemParams — description", () => {
  it("chaîne vide/absente → null", () => {
    for (const description of [null, undefined, "", "   "]) {
      const r = validateShopItemParams({ name: "X", description, itemType: "product", pricePoints: 10 });
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.value.description).toBeNull();
    }
  });
  it("refuse une description > 2000 caractères", () => {
    const r = validateShopItemParams({
      name: "X",
      description: "a".repeat(2001),
      itemType: "product",
      pricePoints: 10,
    });
    expect(r).toEqual({ ok: false, error: "invalid_description" });
  });
});

describe("validateShopItemParams — itemType", () => {
  it("accepte product et reward", () => {
    expect(
      validateShopItemParams({ name: "X", description: null, itemType: "product", pricePoints: 10 }).ok,
    ).toBe(true);
    expect(
      validateShopItemParams({ name: "X", description: null, itemType: "reward", pricePoints: 10 }).ok,
    ).toBe(true);
  });
  it("refuse toute autre valeur", () => {
    for (const itemType of ["service", "", null, undefined]) {
      const r = validateShopItemParams({ name: "X", description: null, itemType, pricePoints: 10 });
      expect(r).toEqual({ ok: false, error: "invalid_type" });
    }
  });
});

describe("validateShopItemParams — pricePoints", () => {
  it("accepte 0 (article gratuit), 1 et 1000000", () => {
    expect(
      validateShopItemParams({ name: "X", description: null, itemType: "product", pricePoints: 0 }).ok,
    ).toBe(true);
    expect(
      validateShopItemParams({ name: "X", description: null, itemType: "product", pricePoints: 1 }).ok,
    ).toBe(true);
    expect(
      validateShopItemParams({ name: "X", description: null, itemType: "product", pricePoints: 1_000_000 })
        .ok,
    ).toBe(true);
  });
  it("refuse négatif, > 1000000, non-entier", () => {
    for (const pricePoints of [-5, 1_000_001, 3.5, "abc"]) {
      const r = validateShopItemParams({ name: "X", description: null, itemType: "product", pricePoints });
      expect(r).toEqual({ ok: false, error: "invalid_price" });
    }
  });
});

const lifetimeOk = { count: 1, kind: "lifetime" as const, durationDays: null, expiresAt: null };
const durationOk = { count: 1, kind: "duration" as const, durationDays: 30, expiresAt: null };

describe("validateAccessCodeGenerateParams — count (aucune limite métier)", () => {
  it("accepte 1 et de très grandes quantités (aucun plafond métier)", () => {
    expect(validateAccessCodeGenerateParams({ ...lifetimeOk, count: 1 }, NOW).ok).toBe(true);
    expect(validateAccessCodeGenerateParams({ ...lifetimeOk, count: 4999 }, NOW).ok).toBe(true);
  });
  it("refuse 0, non-entier, et le garde-fou technique très large", () => {
    for (const c of [0, 2.5, -1, "abc", 5001]) {
      const r = validateAccessCodeGenerateParams({ ...lifetimeOk, count: c }, NOW);
      expect(r).toEqual({ ok: false, error: "invalid_count" });
    }
  });
});

describe("validateAccessCodeGenerateParams — kind", () => {
  it("accepte 'lifetime' et 'duration'", () => {
    expect(validateAccessCodeGenerateParams(lifetimeOk, NOW).ok).toBe(true);
    expect(validateAccessCodeGenerateParams(durationOk, NOW).ok).toBe(true);
  });
  it("refuse toute autre valeur (jamais trial/broker pour un admin de groupe)", () => {
    for (const kind of ["trial", "broker", "", null, undefined]) {
      const r = validateAccessCodeGenerateParams({ ...lifetimeOk, kind }, NOW);
      expect(r).toEqual({ ok: false, error: "invalid_kind" });
    }
  });
});

describe("validateAccessCodeGenerateParams — durationDays", () => {
  it("kind='lifetime' → durationDays toujours null en sortie, quelle que soit l'entrée", () => {
    const r = validateAccessCodeGenerateParams({ ...lifetimeOk, durationDays: 999 }, NOW);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.durationDays).toBeNull();
  });
  it("kind='duration' accepte 1 et de très grandes durées (aucune limite métier)", () => {
    expect(validateAccessCodeGenerateParams({ ...durationOk, durationDays: 1 }, NOW).ok).toBe(true);
    expect(validateAccessCodeGenerateParams({ ...durationOk, durationDays: 36_500 }, NOW).ok).toBe(true);
  });
  it("kind='duration' refuse 0, non-entier, et le garde-fou technique (>100 ans)", () => {
    for (const d of [0, -1, 2.5, "abc", null, undefined, 36_501]) {
      const r = validateAccessCodeGenerateParams({ ...durationOk, durationDays: d }, NOW);
      expect(r).toEqual({ ok: false, error: "invalid_duration" });
    }
  });
});

describe("validateAccessCodeGenerateParams — expiresAt (délai de rédemption du code)", () => {
  it("null/vide → expiresAt null", () => {
    expect(validateAccessCodeGenerateParams({ ...lifetimeOk, expiresAt: "" }, NOW)).toEqual({
      ok: true,
      value: { count: 1, kind: "lifetime", durationDays: null, expiresAt: null },
    });
  });
  it("date future → ISO", () => {
    const r = validateAccessCodeGenerateParams({ ...lifetimeOk, expiresAt: future }, NOW);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.expiresAt).toBe(new Date(future).toISOString());
  });
  it("date passée → expiry_not_future", () => {
    expect(validateAccessCodeGenerateParams({ ...lifetimeOk, expiresAt: past }, NOW)).toEqual({
      ok: false,
      error: "expiry_not_future",
    });
  });
  it("date invalide → invalid_expiry", () => {
    expect(validateAccessCodeGenerateParams({ ...lifetimeOk, expiresAt: "pas-une-date" }, NOW)).toEqual({
      ok: false,
      error: "invalid_expiry",
    });
  });
});

describe("classifyRevokeFailure", () => {
  it("absent → not_found", () => {
    expect(classifyRevokeFailure(null, "g1")).toBe("not_found");
  });
  it("autre groupe → wrong_group", () => {
    expect(classifyRevokeFailure({ group_id: "g2", status: "available" }, "g1")).toBe("wrong_group");
  });
  it("bon groupe mais non available → not_revocable", () => {
    expect(classifyRevokeFailure({ group_id: "g1", status: "used" }, "g1")).toBe("not_revocable");
    expect(classifyRevokeFailure({ group_id: "g1", status: "revoked" }, "g1")).toBe("not_revocable");
  });
});
