"use server";

// Server Actions du Journal. Sécurité : user_id TOUJOURS dérivé de
// supabase.auth.getUser() (jamais du client). RLS en dernier rempart.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validateTradeInput, type FieldErrors } from "@/lib/journal/validation";
import { isMockEnvEnabled } from "@/lib/journal/mock";

const SCREENSHOT_BUCKET = "trade-screenshots";
const MAX_IMG_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_IMG = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export interface CreateTradeState {
  ok: boolean;
  errors?: FieldErrors;
  error?: string; // code d'erreur global (notLoggedIn | generic)
}

export async function createTradeEntry(
  _prev: CreateTradeState,
  formData: FormData,
): Promise<CreateTradeState> {
  // ── Mode démo local (DEV uniquement) ──
  // On valide quand même le formulaire (pour tester l'UX d'erreurs) mais on
  // n'écrit RIEN en base et on n'upload AUCUNE image : succès simulé.
  if (isMockEnvEnabled()) {
    const { errors } = validateTradeInput(formData);
    if (errors) return { ok: false, errors };
    return { ok: true };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "notLoggedIn" };

  const { data, errors } = validateTradeInput(formData);
  if (errors || !data) return { ok: false, errors };

  // ── Upload best-effort de la capture (NON bloquant) ──
  // Si le bucket n'existe pas encore ou si l'upload échoue, on crée quand même
  // le trade sans capture (exigence : ne pas bloquer la création).
  let screenshotPath: string | null = null;
  const file = formData.get("screenshot");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_IMG.includes(file.type)) {
      return { ok: false, errors: { screenshot: "imageType" } };
    }
    if (file.size > MAX_IMG_BYTES) {
      return { ok: false, errors: { screenshot: "imageSize" } };
    }
    const ext = (file.name.split(".").pop() ?? "png").toLowerCase().slice(0, 5);
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(SCREENSHOT_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      console.error("[journal] upload capture échoué (non bloquant):", upErr.message);
    } else {
      screenshotPath = path;
    }
  }

  const { error } = await supabase.from("trading_journal_entries").insert({
    user_id: user.id,
    ...data,
    screenshot_url: screenshotPath,
    ai_status: "pending",
  });

  if (error) {
    console.error("[journal] insert trade échoué:", error.message);
    // Nettoyage best-effort de la capture orpheline
    if (screenshotPath) {
      await supabase.storage.from(SCREENSHOT_BUCKET).remove([screenshotPath]);
    }
    return { ok: false, error: "generic" };
  }

  // Revalide la page journal pour toutes les locales (segment dynamique).
  revalidatePath("/[locale]/journal", "page");
  return { ok: true };
}

export async function deleteTradeEntry(formData: FormData): Promise<void> {
  // Mode démo local (DEV) : pas de suppression réelle en base.
  if (isMockEnvEnabled()) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  // Récupère le chemin capture AVANT suppression (pour purge Storage).
  // RLS garantit qu'on ne lit/supprime que ses propres trades.
  const { data: row } = await supabase
    .from("trading_journal_entries")
    .select("screenshot_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("trading_journal_entries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[journal] suppression trade échouée:", error.message);
    return;
  }

  if (row?.screenshot_url) {
    await supabase.storage.from(SCREENSHOT_BUCKET).remove([row.screenshot_url]);
  }

  revalidatePath("/[locale]/journal", "page");
}
