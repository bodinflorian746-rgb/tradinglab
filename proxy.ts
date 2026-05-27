// Proxy Next.js 16 (anciennement middleware) — détection locale + refresh
// de session Supabase.
//
// Comportement :
//   1. Locale : si l'URL n'a pas de préfixe /fr|/en|/es → redirect avec préfixe
//   2. Si locale OK → refresh de la session Supabase via cookies
//   - locale = cookie tradinglab_locale > Accept-Language > DEFAULT_LOCALE
//   - Le cookie tradinglab_locale est posé à chaque redirect (1 an)

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from "@/i18n/config";

function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}

function matchPreferredLocale(langs: string[]): Locale {
  for (const lang of langs) {
    const primary = lang.split("-")[0];
    if ((LOCALES as readonly string[]).includes(primary)) {
      return primary as Locale;
    }
  }
  return DEFAULT_LOCALE;
}

function resolveLocale(request: NextRequest): Locale {
  const cookieValue = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieValue && (LOCALES as readonly string[]).includes(cookieValue)) {
    return cookieValue as Locale;
  }
  return matchPreferredLocale(parseAcceptLanguage(request.headers.get("accept-language")));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Locale routing : redirige si pas de préfixe
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (!pathnameHasLocale) {
    const locale = resolveLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // 2. Locale OK → refresh de la session Supabase via cookies.
  // Pattern @supabase/ssr : créer une response, écouter les cookies set par
  // supabase.auth.getUser(), les propager sur la response retournée.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ⚠ getUser() refresh la session si nécessaire (et set les cookies via setAll).
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Skip Next internals, API routes, fichiers statiques courants
  matcher: [
    "/((?!_next/|api/|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|otf|map)$).*)",
  ],
};
