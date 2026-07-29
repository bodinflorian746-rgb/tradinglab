import { describe, expect, it, afterEach } from "vitest";
import { isJournalEnabled } from "./feature-flag";

const ORIGINAL = process.env.NEXT_PUBLIC_JOURNAL_ENABLED;

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_JOURNAL_ENABLED;
  else process.env.NEXT_PUBLIC_JOURNAL_ENABLED = ORIGINAL;
});

describe("isJournalEnabled", () => {
  it("false si la variable est absente", () => {
    delete process.env.NEXT_PUBLIC_JOURNAL_ENABLED;
    expect(isJournalEnabled()).toBe(false);
  });

  it("false si la variable vaut explicitement \"false\"", () => {
    process.env.NEXT_PUBLIC_JOURNAL_ENABLED = "false";
    expect(isJournalEnabled()).toBe(false);
  });

  it("false pour toute valeur autre que la chaîne exacte \"true\"", () => {
    for (const v of ["TRUE", "1", "yes", ""]) {
      process.env.NEXT_PUBLIC_JOURNAL_ENABLED = v;
      expect(isJournalEnabled()).toBe(false);
    }
  });

  it("true uniquement si la variable vaut exactement \"true\"", () => {
    process.env.NEXT_PUBLIC_JOURNAL_ENABLED = "true";
    expect(isJournalEnabled()).toBe(true);
  });
});
