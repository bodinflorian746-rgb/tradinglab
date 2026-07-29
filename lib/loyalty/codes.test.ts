import { describe, expect, it } from "vitest";
import { generatePointsCode } from "@/lib/loyalty/codes";
import { generateCode } from "@/lib/access-codes";

describe("generatePointsCode", () => {
  it("respecte le format PTS-XXXX-XXXX (alphabet sans ambigus)", () => {
    expect(generatePointsCode()).toMatch(/^PTS-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
  });

  it("ne peut pas entrer en collision avec un code d'accès (préfixes distincts)", () => {
    const pts = Array.from({ length: 200 }, () => generatePointsCode());
    const access = Array.from({ length: 200 }, () => generateCode());
    expect(pts.every((c) => c.startsWith("PTS-"))).toBe(true);
    expect(access.every((c) => c.startsWith("TSX-"))).toBe(true);
    const intersection = pts.filter((c) => access.includes(c));
    expect(intersection).toHaveLength(0);
  });

  it("génère des valeurs variées (pas de constante)", () => {
    const set = new Set(Array.from({ length: 100 }, () => generatePointsCode()));
    expect(set.size).toBeGreaterThan(90);
  });
});
