import { describe, expect, it } from "vitest";
import {
  buildGroupsWithStats,
  buildOverview,
  maskCode,
  parseCodeStatusFilter,
  parseDateBoundary,
  parseKindFilter,
  parseSignFilter,
  sanitizePage,
  sanitizePageSize,
  shortId,
  type CodeStatRow,
  type LedgerStatRow,
  type MembershipStatRow,
} from "@/lib/loyalty/admin-format";
import type { PartnerGroup } from "@/lib/loyalty/types";

const group = (id: string, status: "active" | "suspended" = "active"): PartnerGroup => ({
  id,
  name: `Group ${id}`,
  slug: `group-${id}`,
  telegram_reference: null,
  reference_code: `GRP-TEST-${id}`,
  status,
  created_by: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
});

describe("buildOverview", () => {
  it("agrège correctement counts + sommes", () => {
    const groups = [group("a"), group("b", "suspended")];
    const memberships: MembershipStatRow[] = [
      { group_id: "a", role: "admin", status: "active" },
      { group_id: "a", role: "member", status: "active" },
      { group_id: "b", role: "member", status: "active" },
    ];
    const codes: CodeStatRow[] = [
      { group_id: "a", status: "available", points_value: 10 },
      { group_id: "a", status: "used", points_value: 5 },
      { group_id: "b", status: "revoked", points_value: 50 },
    ];
    const ledger: LedgerStatRow[] = [
      { group_id: "a", amount: 10, kind: "code_reward" },
      { group_id: "a", amount: -4, kind: "purchase" },
      { group_id: "b", amount: 50, kind: "manual_credit" },
    ];
    const o = buildOverview(groups, memberships, codes, ledger);
    expect(o.groupsTotal).toBe(2);
    expect(o.groupsActive).toBe(1);
    expect(o.adminsTotal).toBe(1);
    expect(o.membersTotal).toBe(2);
    expect(o.codesTotal).toBe(3);
    expect(o.codesAvailable).toBe(1);
    expect(o.codesUsed).toBe(1);
    expect(o.codesRevoked).toBe(1);
    expect(o.codeValueTotal).toBe(65);
    expect(o.pointsCredited).toBe(60);
    expect(o.pointsDebited).toBe(-4);
    expect(o.netBalance).toBe(56);
  });

  it("base vide → tout à 0", () => {
    const o = buildOverview([], [], [], []);
    expect(o.groupsTotal).toBe(0);
    expect(o.codeValueTotal).toBe(0);
    expect(o.netBalance).toBe(0);
  });
});

describe("buildGroupsWithStats — isolation inter-groupes", () => {
  it("ventile chaque ligne sur son seul group_id", () => {
    const groups = [group("a"), group("b")];
    const memberships: MembershipStatRow[] = [
      { group_id: "a", role: "admin", status: "active" },
      { group_id: "b", role: "member", status: "active" },
      { group_id: "b", role: "member", status: "active" },
    ];
    const codes: CodeStatRow[] = [
      { group_id: "a", status: "available", points_value: 100 },
    ];
    const ledger: LedgerStatRow[] = [
      { group_id: "a", amount: 30, kind: "code_reward" },
      { group_id: "b", amount: -10, kind: "purchase" },
    ];
    const res = buildGroupsWithStats(groups, memberships, codes, ledger);
    const a = res.find((g) => g.id === "a")!;
    const b = res.find((g) => g.id === "b")!;

    expect(a.stats.admins).toBe(1);
    expect(a.stats.members).toBe(0);
    expect(a.stats.codeValueTotal).toBe(100);
    expect(a.stats.pointsCredited).toBe(30);
    expect(a.stats.netBalance).toBe(30);

    expect(b.stats.members).toBe(2);
    expect(b.stats.codeValueTotal).toBe(0); // le code du groupe A ne fuit pas
    expect(b.stats.pointsCredited).toBe(0);
    expect(b.stats.pointsDebited).toBe(-10);
    expect(b.stats.netBalance).toBe(-10);
  });

  it("ignore les lignes d'un group_id inconnu (pas de fuite)", () => {
    const res = buildGroupsWithStats(
      [group("a")],
      [{ group_id: "zzz", role: "admin", status: "active" }],
      [],
      [{ group_id: "zzz", amount: 999, kind: "code_reward" }],
    );
    expect(res[0].stats.admins).toBe(0);
    expect(res[0].stats.netBalance).toBe(0);
  });
});

describe("maskCode", () => {
  it("affiche en clair un code disponible", () => {
    expect(maskCode("PTS-AB27-9KMN", "available")).toBe("PTS-AB27-9KMN");
  });
  it("masque le segment central d'un code utilisé/révoqué/expiré", () => {
    expect(maskCode("PTS-AB27-9KMN", "used")).toBe("PTS-••••-9KMN");
    expect(maskCode("PTS-AB27-9KMN", "revoked")).toBe("PTS-••••-9KMN");
    expect(maskCode("PTS-AB27-9KMN", "expired")).toBe("PTS-••••-9KMN");
  });
});

describe("shortId", () => {
  it("tronque et gère null", () => {
    expect(shortId("0123456789abcdef")).toBe("01234567…");
    expect(shortId(null)).toBe("—");
  });
});

describe("sanitizers de pagination", () => {
  it("sanitizePage : fallback si invalide, plancher à 1", () => {
    expect(sanitizePage("3")).toBe(3);
    expect(sanitizePage("0")).toBe(1);
    expect(sanitizePage("abc")).toBe(1);
    expect(sanitizePage(undefined)).toBe(1);
  });
  it("sanitizePageSize : borne max et fallback", () => {
    expect(sanitizePageSize("50")).toBe(50);
    expect(sanitizePageSize("9999", 25, 100)).toBe(100);
    expect(sanitizePageSize("x")).toBe(25);
  });
});

describe("parseurs de filtres (fail-safe)", () => {
  it("kind valide/invalide", () => {
    expect(parseKindFilter("purchase")).toBe("purchase");
    expect(parseKindFilter("hack")).toBeNull();
  });
  it("code status valide/invalide", () => {
    expect(parseCodeStatusFilter("revoked")).toBe("revoked");
    expect(parseCodeStatusFilter("nope")).toBeNull();
  });
  it("sign", () => {
    expect(parseSignFilter("credit")).toBe("credit");
    expect(parseSignFilter("debit")).toBe("debit");
    expect(parseSignFilter("both")).toBeNull();
  });
  it("date boundary", () => {
    expect(parseDateBoundary("2026-07-01")).toBe(new Date("2026-07-01").toISOString());
    expect(parseDateBoundary("")).toBeNull();
    expect(parseDateBoundary("not-a-date")).toBeNull();
  });
});
