"use server";

// Server Actions admin pour les codes d'accès.
// Génération via service role (createAdminClient) uniquement, jamais exposée
// au client. Chaque action re-vérifie que l'appelant est l'admin (défense en
// profondeur : une Server Action est invocable indépendamment de la page).

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateCode } from "@/lib/access-codes";

/** Vérifie que l'utilisateur courant est l'admin (email === ADMIN_EMAIL). */
async function assertAdmin(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL non configuré côté serveur.");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== adminEmail) {
    throw new Error("Accès refusé.");
  }
}

export type CodeType = "trial" | "broker" | "lifetime";

const CODE_TYPES: readonly CodeType[] = ["trial", "broker", "lifetime"];

function parseType(raw: FormDataEntryValue | null): CodeType {
  return typeof raw === "string" && (CODE_TYPES as readonly string[]).includes(raw)
    ? (raw as CodeType)
    : "trial";
}

export type GenerateResult = {
  ok: boolean;
  created: number;
  error?: string;
};

/**
 * Génère 1 à 100 codes d'accès et les insère (status 'available').
 * Insert sans used_by_user_id ni used_at (null) pour respecter la contrainte
 * access_codes_used_consistency de la table.
 * @param formData champs : count (number), type (trial|broker|lifetime), locale
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

  const count = Math.min(Math.max(parseInt(typeof rawCount === "string" ? rawCount : "1", 10) || 1, 1), 100);

  const rows = Array.from({ length: count }, () => ({
    code: generateCode(),
    status: "available" as const,
    type,
  }));

  const admin = createAdminClient();
  const { data, error } = await admin.from("access_codes").insert(rows).select("code");

  if (error) {
    return { ok: false, created: 0, error: error.message };
  }

  revalidatePath(`/${locale}/admin/codes`);
  return { ok: true, created: data?.length ?? 0 };
}
