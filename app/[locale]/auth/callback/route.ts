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

  // ─── TEMP DIAG (à supprimer après reproduction du bug reset password) ───
  // Pose des logs Vercel pour identifier la cause de
  // /login?error=confirmation_failed. Aucune valeur secrète loguée :
  //   - codeLen : longueur du `code` (pas la valeur)
  //   - cookieNames : NOMS des cookies présents (pas les valeurs)
  //   - nextParam : la query `next` brute (utile pour vérifier le routing)
  //   - error.message/code/status : retour exact de exchangeCodeForSession
  const cookieStore = await cookies();
  const cookieNames = cookieStore.getAll().map((c) => c.name).join(",");
  console.log(
    `[auth-callback] locale=${locale} codeLen=${code?.length ?? 0} nextParam=${nextParam ?? "(none)"} cookies=[${cookieNames || "(none)"}]`,
  );

  if (code) {
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
      console.log(`[auth-callback] exchange OK → redirect ${origin}/${locale}${next}`);
      // Succès → route localisée réelle (URL /[locale]/dashboard).
      return NextResponse.redirect(`${origin}/${locale}${next}`);
    }
    console.error(
      `[auth-callback] exchangeCodeForSession FAILED ` +
        `message="${error.message}" code="${error.code ?? "n/a"}" status="${error.status ?? "n/a"}"`,
    );
  } else {
    console.warn(`[auth-callback] no code param → skip exchange, fall to login error`);
  }

  // Échec → page de login localisée réelle (/[locale]/login).
  return NextResponse.redirect(`${origin}/${locale}/login?error=confirmation_failed`);
}
