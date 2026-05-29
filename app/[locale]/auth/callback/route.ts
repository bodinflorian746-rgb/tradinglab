import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // `next` doit être un chemin relatif ; on le préfixe par la locale.
  const nextParam = searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";

  if (code) {
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
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Succès → route localisée réelle (URL /[locale]/dashboard).
      return NextResponse.redirect(`${origin}/${locale}${next}`);
    }
  }

  // Échec → page de login localisée réelle (/[locale]/login).
  return NextResponse.redirect(`${origin}/${locale}/login?error=confirmation_failed`);
}
