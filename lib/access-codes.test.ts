import { describe, expect, it } from "vitest";
import { computeAccessPeriodEnd, generateCode, randomSegment } from "@/lib/access-codes";

describe("generateCode", () => {
  it("respecte le format TSX-XXXX-XXXX", () => {
    for (let i = 0; i < 20; i++) {
      expect(generateCode()).toMatch(/^TSX-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    }
  });
});

describe("randomSegment", () => {
  it("génère la longueur demandée", () => {
    expect(randomSegment(4)).toHaveLength(4);
    expect(randomSegment(8)).toHaveLength(8);
  });
  it("n'utilise jamais de caractères ambigus (I, O, 0, 1)", () => {
    for (let i = 0; i < 50; i++) {
      expect(randomSegment(16)).not.toMatch(/[IO01]/);
    }
  });
});

describe("computeAccessPeriodEnd", () => {
  const NOW = Date.UTC(2026, 6, 25); // 2026-07-25

  it("broker/lifetime → date très lointaine, indépendante de durationDays", () => {
    expect(computeAccessPeriodEnd("broker", null, NOW)).toBe("2099-12-31T23:59:59.000Z");
    expect(computeAccessPeriodEnd("lifetime", null, NOW)).toBe("2099-12-31T23:59:59.000Z");
    expect(computeAccessPeriodEnd("lifetime", 30, NOW)).toBe("2099-12-31T23:59:59.000Z");
  });

  it("duration → now + durationDays jours exactement", () => {
    expect(computeAccessPeriodEnd("duration", 30, NOW)).toBe(
      new Date(NOW + 30 * 86_400_000).toISOString(),
    );
    expect(computeAccessPeriodEnd("duration", 90, NOW)).toBe(
      new Date(NOW + 90 * 86_400_000).toISOString(),
    );
    expect(computeAccessPeriodEnd("duration", 1, NOW)).toBe(
      new Date(NOW + 86_400_000).toISOString(),
    );
  });

  it("duration avec durationDays null → équivaut à 0 jour (garde-fou, ne doit jamais arriver en pratique)", () => {
    expect(computeAccessPeriodEnd("duration", null, NOW)).toBe(new Date(NOW).toISOString());
  });
});
