import { describe, expect, it } from "vitest";
import {
  isValidEmail,
  slugify,
  validateAdminEmails,
  validateGroupName,
} from "@/lib/loyalty/admin-validation";

describe("validateGroupName", () => {
  it("accepte un nom non vide après trim", () => {
    const r = validateGroupName("  Crypto VIP  ");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("Crypto VIP");
  });
  it("refuse vide, blanc, non-string", () => {
    for (const v of ["", "   ", null, undefined, 42]) {
      expect(validateGroupName(v)).toEqual({ ok: false });
    }
  });
  it("refuse un nom > 120 caractères", () => {
    expect(validateGroupName("a".repeat(121))).toEqual({ ok: false });
  });
  it("accepte exactement 120 caractères", () => {
    expect(validateGroupName("a".repeat(120)).ok).toBe(true);
  });
});

describe("isValidEmail", () => {
  it("accepte un format plausible", () => {
    expect(isValidEmail("admin@email.com")).toBe(true);
    expect(isValidEmail("  admin@email.com  ")).toBe(true);
  });
  it("refuse un format invalide ou non-string", () => {
    for (const v of ["not-an-email", "a@b", "@email.com", "a@.com", "", null, undefined, 42]) {
      expect(isValidEmail(v)).toBe(false);
    }
  });
});

describe("validateAdminEmails", () => {
  it("accepte une liste d'e-mails valides", () => {
    const r = validateAdminEmails(["admin1@email.com", "admin2@email.com", "support@email.com"]);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toEqual(["admin1@email.com", "admin2@email.com", "support@email.com"]);
    }
  });
  it("normalise en minuscules et trim", () => {
    const r = validateAdminEmails(["  Admin1@Email.COM  "]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual(["admin1@email.com"]);
  });
  it("dédoublonne insensible à la casse", () => {
    const r = validateAdminEmails(["admin@email.com", "ADMIN@EMAIL.COM", "admin@email.com"]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual(["admin@email.com"]);
  });
  it("ignore les lignes vides mais refuse un format invalide", () => {
    expect(validateAdminEmails(["admin@email.com", "", "   "]).ok).toBe(true);
    expect(validateAdminEmails(["admin@email.com", "not-an-email"])).toEqual({ ok: false });
  });
  it("refuse une liste vide, non tableau, ou entièrement vide après nettoyage", () => {
    expect(validateAdminEmails([])).toEqual({ ok: false });
    expect(validateAdminEmails(["", "   "])).toEqual({ ok: false });
    expect(validateAdminEmails("admin@email.com")).toEqual({ ok: false });
    expect(validateAdminEmails(null)).toEqual({ ok: false });
    expect(validateAdminEmails(undefined)).toEqual({ ok: false });
  });
  it("refuse si un élément n'est pas une chaîne", () => {
    expect(validateAdminEmails(["admin@email.com", 42])).toEqual({ ok: false });
  });
});

describe("slugify", () => {
  it("dérive un slug en kebab-case avec suffixe", () => {
    expect(slugify("Crypto VIP")).toMatch(/^crypto-vip-[a-z0-9]{6}$/);
  });
  it("retire les accents", () => {
    expect(slugify("Équipe Élite")).toMatch(/^equipe-elite-[a-z0-9]{6}$/);
  });
  it("gère un nom vide ou uniquement composé de caractères spéciaux", () => {
    expect(slugify("!!!")).toMatch(/^groupe-[a-z0-9]{6}$/);
  });
  it("génère des suffixes différents à chaque appel (collision très improbable)", () => {
    const a = slugify("Test");
    const b = slugify("Test");
    expect(a).not.toBe(b);
  });
});
