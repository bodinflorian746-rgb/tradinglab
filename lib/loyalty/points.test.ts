import { describe, expect, it } from "vitest";
import {
  computeBalance,
  computeEarnedTotal,
  summarizeLedger,
  tierForEarned,
} from "@/lib/loyalty/points";
import type { LedgerAmount } from "@/lib/loyalty/points";

const entry = (kind: LedgerAmount["kind"], amount: number): LedgerAmount => ({
  kind,
  amount,
});

describe("computeBalance", () => {
  it("somme signée de toutes les opérations", () => {
    const entries = [
      entry("code_reward", 10),
      entry("tier_bonus", 5),
      entry("purchase", -8),
      entry("manual_debit", -2),
    ];
    expect(computeBalance(entries)).toBe(5);
  });

  it("registre vide → solde 0", () => {
    expect(computeBalance([])).toBe(0);
  });
});

describe("computeEarnedTotal", () => {
  it("cumule les gains, ignore dépenses et débits", () => {
    const entries = [
      entry("code_reward", 50),
      entry("tier_bonus", 25),
      entry("manual_credit", 10),
      entry("purchase", -40), // ignoré
      entry("manual_debit", -5), // ignoré
    ];
    expect(computeEarnedTotal(entries)).toBe(85);
  });

  it("une dépense ne fait jamais baisser le total gagné", () => {
    const earn = [entry("code_reward", 120)];
    const withSpend = [...earn, entry("purchase", -100)];
    expect(computeEarnedTotal(earn)).toBe(120);
    expect(computeEarnedTotal(withSpend)).toBe(120);
  });

  it("une correction/annulation créditrice compte comme gagnée", () => {
    const entries = [
      entry("code_reward", 100),
      entry("correction", 30),
      entry("cancellation", 20),
    ];
    expect(computeEarnedTotal(entries)).toBe(150);
  });
});

describe("summarizeLedger", () => {
  it("sépare crédits (positifs) et débits (négatifs), net = somme", () => {
    const entries = [
      entry("code_reward", 50),
      entry("manual_credit", 20),
      entry("purchase", -30),
      entry("manual_debit", -5),
    ];
    expect(summarizeLedger(entries)).toEqual({
      credited: 70,
      debited: -35,
      net: 35,
    });
  });

  it("une dépense n'est jamais comptée dans les crédits", () => {
    const { credited, debited } = summarizeLedger([
      entry("code_reward", 100),
      entry("purchase", -100),
    ]);
    expect(credited).toBe(100);
    expect(debited).toBe(-100);
  });

  it("registre vide → tout à 0", () => {
    expect(summarizeLedger([])).toEqual({ credited: 0, debited: 0, net: 0 });
  });
});

describe("tierForEarned", () => {
  it("Bronze < 100", () => {
    expect(tierForEarned(0)).toBe("bronze");
    expect(tierForEarned(99)).toBe("bronze");
  });

  it("Argent 100–199", () => {
    expect(tierForEarned(100)).toBe("silver");
    expect(tierForEarned(199)).toBe("silver");
  });

  it("Or ≥ 200", () => {
    expect(tierForEarned(200)).toBe("gold");
    expect(tierForEarned(10_000)).toBe("gold");
  });

  it("le niveau dérive du total gagné, insensible aux dépenses", () => {
    const entries = [
      entry("code_reward", 200),
      entry("purchase", -180), // solde bas, mais niveau reste Or
    ];
    expect(computeBalance(entries)).toBe(20);
    expect(tierForEarned(computeEarnedTotal(entries))).toBe("gold");
  });
});
