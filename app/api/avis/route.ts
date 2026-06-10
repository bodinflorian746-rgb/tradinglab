// Route API — envoi par email d'un avis utilisateur via Resend.
//
// Pattern Resend strictement aligné sur lib/email/send-trial-code.ts :
// même SDK, même clé d'env RESEND_API_KEY, même sender (TradeScaleX
// <noreply@tradescalex.com>), même style HTML.
//
// Destinataires : getAdminEmails() de lib/auth/admin (lit ADMIN_EMAILS,
// fallback ADMIN_EMAIL). Pas de table Supabase, pas de stockage — email
// uniquement.

import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { getAdminEmails } from "@/lib/auth/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ParsedBody = {
  message: string;
  email: string;
  rating: number | null;
};

function parseBody(raw: unknown): ParsedBody {
  if (!raw || typeof raw !== "object") {
    return { message: "", email: "", rating: null };
  }
  const r = raw as Record<string, unknown>;
  const message = typeof r.message === "string" ? r.message.trim() : "";
  const email = typeof r.email === "string" ? r.email.trim() : "";
  const ratingRaw = r.rating;
  const rating =
    typeof ratingRaw === "number" &&
    Number.isInteger(ratingRaw) &&
    ratingRaw >= 1 &&
    ratingRaw <= 5
      ? ratingRaw
      : null;
  return { message, email, rating };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildHtml(message: string, email: string, rating: number | null): string {
  const ratingLine = rating !== null ? `${rating}/5` : "(non renseignée)";
  const emailLine = email ? escapeHtml(email) : "(non renseigné)";
  const messageBlock = escapeHtml(message);
  return `<!doctype html>
<html>
  <body style="margin:0;background:#09090b;color:#ffffff;font-family:Inter,Arial,sans-serif;padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;">
      <h1 style="font-size:20px;margin:0 0 24px;color:#ffffff;">Nouvel avis TradeScaleX</h1>
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;margin:0 0 6px;">Note</p>
      <p style="font-size:14px;line-height:1.5;color:#ffffff;margin:0 0 18px;">${ratingLine}</p>
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;margin:0 0 6px;">Email visiteur</p>
      <p style="font-size:14px;line-height:1.5;color:#ffffff;margin:0 0 18px;">${emailLine}</p>
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a1a1aa;margin:0 0 6px;">Message</p>
      <div style="font-size:14px;line-height:1.6;color:#ffffff;white-space:pre-wrap;background:#09090b;border:1px solid #27272a;border-radius:12px;padding:16px;">${messageBlock}</div>
    </div>
  </body>
</html>`;
}

export async function POST(req: NextRequest) {
  const raw: unknown = await req.json().catch(() => null);
  const { message, email, rating } = parseBody(raw);

  if (!message) {
    return NextResponse.json(
      { ok: false, error: "empty_message" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[avis] RESEND_API_KEY manquant");
    return NextResponse.json(
      { ok: false, error: "email_service_unavailable" },
      { status: 500 },
    );
  }

  const inbox = getAdminEmails();
  if (inbox.length === 0) {
    console.error("[avis] aucun destinataire (ADMIN_EMAILS / ADMIN_EMAIL absents)");
    return NextResponse.json(
      { ok: false, error: "inbox_not_configured" },
      { status: 500 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "TradeScaleX <noreply@tradescalex.com>",
      to: inbox,
      subject: "Nouvel avis TradeScaleX",
      html: buildHtml(message, email, rating),
    });
    if (error) {
      console.error(`[avis] Resend error: ${error.message}`);
      return NextResponse.json(
        { ok: false, error: "send_failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error(`[avis] Resend SDK exception: ${msg}`);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}
