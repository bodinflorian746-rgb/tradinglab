"use server";

// Server Actions admin pour les codes d'accès.
// Génération via service role (createAdminClient) uniquement, jamais exposée
// au client. Chaque action re-vérifie que l'appelant est admin (défense en
// profondeur : une Server Action est invocable indépendamment de la page).

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateCode } from "@/lib/access-codes";
import { isAdmin } from "@/lib/auth/admin";
import {
  ACCESS_CODE_COUNT_TECHNICAL_MAX,
  ACCESS_CODE_DURATION_DAYS_MAX,
} from "@/lib/loyalty/master-validation";

/** Vérifie que l'utilisateur courant figure dans ADMIN_EMAILS (ou fallback ADMIN_EMAIL). */
async function assertAdmin(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    throw new Error("Accès refusé.");
  }
}

// 'duration' ajouté à côté de trial/broker/lifetime (déjà existants, jamais
// retirés) — mêmes valeurs que access_codes.type côté groupe (cf. migration
// 20260725100000_group_scoped_access_codes), le Super Admin peut désormais
// aussi générer des codes globaux (sans groupe : group_id reste null) avec
// une durée choisie, exactement comme un Group Admin le fait pour son propre
// groupe (app/[locale]/master/[groupId]/deblocage).
export type CodeType = "trial" | "broker" | "lifetime" | "duration";

const CODE_TYPES: readonly CodeType[] = ["trial", "broker", "lifetime", "duration"];

function parseType(raw: FormDataEntryValue | null): CodeType {
  return typeof raw === "string" && (CODE_TYPES as readonly string[]).includes(raw)
    ? (raw as CodeType)
    : "trial";
}

function toInt(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  return parseInt(trimmed, 10);
}

export type GenerateResult = {
  ok: boolean;
  created: number;
  error?: string;
};

/**
 * Génère 1 à ACCESS_CODE_COUNT_TECHNICAL_MAX codes d'accès et les insère
 * (status 'available'). Insert sans used_by_user_id ni used_at (null) pour
 * respecter la contrainte access_codes_used_consistency de la table.
 * duration_days : requis (entier ≥ 1) si type === 'duration', sinon toujours
 * null (trial/broker/lifetime, comportement inchangé). La durée d'accès
 * démarre à l'ACTIVATION du code (cf. lib/access-codes.computeAccessPeriodEnd),
 * jamais à sa création — cette action ne fait qu'enregistrer duration_days.
 * @param formData champs : count (number), type (trial|broker|lifetime|duration), durationDays (number, si type=duration), locale
 */
export async function generateCodes(formData: FormData): Promise<GenerateResult> {
  try {
    await assertAdmin();
  } catch (err) {
    return { ok: false, created: 0, error: err instanceof Error ? err.message : "Accès refusé." };
  }

  const rawCount = formData.get("count");
  const type = parseType(formData.get("type"));
  const locale = typeof formData.get("locale") === "string" ? (formData.get("locale") as string) : "fr";

  const parsedCount = toInt(rawCount);
  const count = Math.min(Math.max(parsedCount ?? 1, 1), ACCESS_CODE_COUNT_TECHNICAL_MAX);

  let durationDays: number | null = null;
  if (type === "duration") {
    const d = toInt(formData.get("durationDays"));
    if (d === null || d < 1 || d > ACCESS_CODE_DURATION_DAYS_MAX) {
      return { ok: false, created: 0, error: "Durée invalide." };
    }
    durationDays = d;
  }

  const rows = Array.from({ length: count }, () => ({
    code: generateCode(),
    status: "available" as const,
    type,
    duration_days: durationDays,
  }));

  const admin = createAdminClient();
  const { data, error } = await admin.from("access_codes").insert(rows).select("code");

  if (error) {
    return { ok: false, created: 0, error: error.message };
  }

  revalidatePath(`/${locale}/admin/codes`);
  return { ok: true, created: data?.length ?? 0 };
}
