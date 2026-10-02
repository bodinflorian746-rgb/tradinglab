"use server";

// Server Action du formulaire de contact. Envoie un email via Resend aux
// adresses d'administration (ADMIN_EMAILS, ou ADMIN_EMAIL en secours), comme
// /api/avis. Pattern strictement aligné sur
// app/api/avis/route.ts et lib/email/send-trial-code.ts : même SDK Resend,
// même clé RESEND_API_KEY (server-only), même sender, même échappement HTML.
//
// Retourne un état exploitable par useActionState côté formulaire (pas de
// redirect) — cohérent avec l'UX des autres formulaires du site.

import { Resend } from "resend";
import { getAdminEmails } from "@/lib/auth/admin";

const FROM = "TradeScaleX <noreply@tradescalex.com>";

export type ContactState = {
  ok: boolean;
  error?: "invalid" | "email_service_unavailable" | "inbox_not_configured" | "send_failed" | "server_error";
  fields?: { name?: boolean; email?: boolean; subject?: boolean; message?: boolean };
};

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function isValidEmail(email: string): boolean {
  return email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildHtml(name: string, email: string, subject: string, message: string): string {
  // Inline styles — palette design system (fond #09090b, surface #18181b,
  // accent #10b981), identique aux autres emails du projet.
  const row = (label: string, value: string) => `
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;margin:0 0 6px;">${label}</p>
      <p style="font-size:14px;line-height:1.5;color:#ffffff;margin:0 0 18px;">${value}</p>`;
  return `<!doctype html>
<html>
  <body style="margin:0;background:#09090b;color:#ffffff;font-family:Inter,Arial,sans-serif;padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">
      <h1 style="font-size:20px;margin:0 0 24px;color:#ffffff;">Nouveau message de contact TradeScaleX</h1>
      ${row("Nom", escapeHtml(name))}
      ${row("Email", escapeHtml(email))}
      ${row("Sujet", escapeHtml(subject))}
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;margin:0 0 6px;">Message</p>
      <div style="font-size:14px;line-height:1.6;color:#ffffff;white-space:pre-wrap;background:#09090b;border:1px solid #27272a;border-radius:12px;padding:16px;">${escapeHtml(message)}</div>
    </div>
  </body>
</html>`;
}

export async function sendContactMessage(
  _prevState: ContactState | null,
  formData: FormData,
): Promise<ContactState> {
  // Anti-spam honeypot : champ caché "website" que seuls les bots remplissent.
  // S'il est rempli → succès silencieux, aucun email envoyé.
  if (str(formData, "website") !== "") {
    return { ok: true };
  }

  const name = str(formData, "name");
  const email = str(formData, "email");
  const subject = str(formData, "subject");
  const message = str(formData, "message");

  const fields: NonNullable<ContactState["fields"]> = {};
  if (!name || name.length > 100) fields.name = true;
  if (!isValidEmail(email)) fields.email = true;
  if (!subject || subject.length > 150) fields.subject = true;
  if (message.length < 10 || message.length > 5000) fields.message = true;
  if (Object.keys(fields).length > 0) {
    return { ok: false, error: "invalid", fields };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY manquant");
    return { ok: false, error: "email_service_unavailable" };
  }

  // Destinataires : même liste que /api/avis (aucune adresse codée en dur)
  const inbox = getAdminEmails();
  if (inbox.length === 0) {
    console.error("[contact] aucun destinataire (ADMIN_EMAILS / ADMIN_EMAIL absents)");
    return { ok: false, error: "inbox_not_configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: inbox,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: buildHtml(name, email, subject, message),
    });
    if (error) {
      console.error(`[contact] Resend error: ${error.message}`);
      return { ok: false, error: "send_failed" };
    }
    return { ok: true };
  } catch (e) {
    console.error(
      `[contact] Resend exception: ${e instanceof Error ? e.message : "unknown"}`,
    );
    return { ok: false, error: "server_error" };
  }
}
