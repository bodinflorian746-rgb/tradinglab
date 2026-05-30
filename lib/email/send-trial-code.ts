// Envoi du code d'essai par email via le SDK Resend. On n'utilise PAS l'email
// natif Supabase : ce mail est notre propre template bilingue contenant le code
// + le lien d'activation.
//
// Requiert RESEND_API_KEY (server-only). From : noreply@tradescalex.com,
// sender name "TradeScaleX". Domaine à vérifier côté Resend.

import "server-only";
import { Resend } from "resend";

type MailLocale = "fr" | "es";

const FROM = "TradeScaleX <noreply@tradescalex.com>";

type Copy = {
  subject: string;
  heading: string;
  intro: string;
  codeLabel: string;
  cta: string;
  outro: string;
};

const COPY: Record<MailLocale, Copy> = {
  fr: {
    subject: "Ton code d'activation TradeScaleX",
    heading: "Bienvenue sur TradeScaleX",
    intro: "Voici ton code pour activer tes 48h d'essai gratuit :",
    codeLabel: "Ton code d'activation",
    cta: "Activer mes 48h gratuites",
    outro: "Si tu n'as pas demandé ce code, ignore cet email.",
  },
  es: {
    subject: "Tu código de activación TradeScaleX",
    heading: "Bienvenido a TradeScaleX",
    intro: "Aquí está tu código para activar tus 48 h de prueba gratis:",
    codeLabel: "Tu código de activación",
    cta: "Activar mis 48 h gratis",
    outro: "Si no solicitaste este código, ignora este correo.",
  },
};

function buildHtml(c: Copy, code: string, activateUrl: string): string {
  // Inline styles (les clients mail ne supportent pas les classes). Palette
  // design system : fond #09090b, surface #18181b, accent #10b981.
  return `<!doctype html>
<html>
  <body style="margin:0;background:#09090b;color:#ffffff;font-family:Inter,Arial,sans-serif;padding:32px 16px;">
    <div style="max-width:480px;margin:0 auto;background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">
      <h1 style="font-size:20px;margin:0 0 16px;color:#ffffff;">${c.heading}</h1>
      <p style="font-size:14px;line-height:1.6;color:#d4d4d8;margin:0 0 24px;">${c.intro}</p>
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;margin:0 0 8px;">${c.codeLabel}</p>
      <div style="font-family:monospace;font-size:28px;font-weight:700;letter-spacing:2px;color:#10b981;background:#09090b;border:1px solid #27272a;border-radius:12px;padding:16px;text-align:center;margin:0 0 24px;">${code}</div>
      <a href="${activateUrl}" style="display:block;text-align:center;background:#10b981;color:#09090b;font-weight:600;font-size:14px;text-decoration:none;padding:14px;border-radius:10px;margin:0 0 24px;">${c.cta}</a>
      <p style="font-size:12px;line-height:1.5;color:#71717a;margin:0;">${c.outro}</p>
    </div>
  </body>
</html>`;
}

export type SendResult = { ok: boolean; error?: string };

export async function sendTrialCodeEmail(
  to: string,
  code: string,
  locale: string,
  activateUrl: string,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY manquant" };
  }

  const mailLocale: MailLocale = locale === "es" ? "es" : "fr";
  const c = COPY[mailLocale];

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: c.subject,
      html: buildHtml(c, code, activateUrl),
    });

    if (error) {
      return { ok: false, error: `Resend: ${error.message}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Resend SDK failed" };
  }
}
