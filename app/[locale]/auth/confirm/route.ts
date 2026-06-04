// Route handler — confirmation OTP pour les flux email (recovery, signup,
// email_change, magic link, invite). Vérifie le token_hash transmis dans le
// lien email via supabase.auth.verifyOtp.
//
// Pourquoi pas /auth/callback (PKCE) : le flux PKCE échoue cross-device et
// cross-domain (cookie code_verifier restreint au host exact où le form a
// été soumis). verifyOtp({ token_hash, type }) ne nécessite AUCUN cookie
// pré-existant — il fonctionne quel que soit le device/host de réception.
//
// URL attendue (depuis le template email Supabase) :
//   /{locale}/auth/confirm?token_hash=<X>&type=recovery&next=/auth/update-password
//
// On accepte uniquement les types d'OTP email valides. Tout type inconnu →
// fail-closed via redirect /login?error=confirmation_failed.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type { EmailOtpType } from "@supabase/supabase-js";

const VALID_TYPES: readonly EmailOtpType[] = [
  "signup",
  "recovery",
  "magiclink",
  "invite",
  "email_change",
] as const;

function isValidType(value: string | null): value is EmailOtpType {
  return value !== null && (VALID_TYPES as readonly string[]).includes(value);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  const { searchParams, origin } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");
  const type = isValidType(rawType) ? rawType : null;
  const nextParam = searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/";

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      `${origin}/${locale}/login?error=confirmation_failed`,
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    console.error(
      `[auth-confirm] verifyOtp failed type=${type} message="${error.message}" code="${error.code ?? "n/a"}" status="${error.status ?? "n/a"}"`,
    );
    return NextResponse.redirect(
      `${origin}/${locale}/login?error=confirmation_failed`,
    );
  }

  return NextResponse.redirect(`${origin}/${locale}${next}`);
}
