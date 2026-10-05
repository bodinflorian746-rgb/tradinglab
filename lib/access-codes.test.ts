import { describe, expect, it } from "vitest";
import { computeAccessPeriodEnd, decideAccessWrite, generateCode, randomSegment } from "@/lib/access-codes";

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

describe("decideAccessWrite — ne jamais raccourcir un accès existant", () => {
  const NOW = Date.UTC(2026, 9, 5); // 2026-10-05
  const LIFETIME = "2099-12-31T23:59:59.000Z";
  const IN_30_DAYS = new Date(NOW + 30 * 86_400_000).toISOString();
  const IN_10_DAYS = new Date(NOW + 10 * 86_400_000).toISOString();
  const YESTERDAY = new Date(NOW - 86_400_000).toISOString();
  const sub = (status: string, end: string | null, stripe: string | null = null) => ({
    status,
    current_period_end: end,
    stripe_subscription_id: stripe,
  });

  it("aucun abonnement → écrit", () => {
    expect(decideAccessWrite(null, IN_30_DAYS, NOW)).toBe("write");
  });

  it("code durée sur un compte à vie → ne change rien", () => {
    expect(decideAccessWrite(sub("active", LIFETIME), IN_30_DAYS, NOW)).toBe("keep_longer");
  });

  it("code durée sur un accès durée plus long → conservé", () => {
    expect(decideAccessWrite(sub("active", IN_30_DAYS), IN_10_DAYS, NOW)).toBe("keep_longer");
  });

  it("code durée sur un accès durée plus court → prolonge", () => {
    expect(decideAccessWrite(sub("active", IN_10_DAYS), IN_30_DAYS, NOW)).toBe("write");
  });

  it("code à vie sur un accès durée → passe à vie", () => {
    expect(decideAccessWrite(sub("active", IN_30_DAYS), LIFETIME, NOW)).toBe("write");
  });

  it("code à vie sur un compte déjà à vie → rien à changer", () => {
    expect(decideAccessWrite(sub("active", LIFETIME), LIFETIME, NOW)).toBe("keep_longer");
  });

  it("accès échu ou annulé → écrit", () => {
    expect(decideAccessWrite(sub("active", YESTERDAY), IN_30_DAYS, NOW)).toBe("write");
    expect(decideAccessWrite(sub("canceled", LIFETIME), IN_30_DAYS, NOW)).toBe("write");
    expect(decideAccessWrite(sub("active", null), IN_30_DAYS, NOW)).toBe("write");
  });

  it("abonnement Stripe en cours → jamais écrasé, même par un code à vie", () => {
    expect(decideAccessWrite(sub("active", IN_10_DAYS, "sub_x"), IN_30_DAYS, NOW)).toBe("keep_stripe");
    expect(decideAccessWrite(sub("trialing", IN_10_DAYS, "sub_x"), LIFETIME, NOW)).toBe("keep_stripe");
  });

  it("abonnement Stripe annulé et échu → écrit", () => {
    expect(decideAccessWrite(sub("canceled", YESTERDAY, "sub_x"), IN_30_DAYS, NOW)).toBe("write");
  });
});
