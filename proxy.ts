// Proxy Next.js 16 (anciennement middleware) — détection locale + redirect.
//
// Comportement :
//   - Si l'URL commence déjà par /fr|/en|/es → laisse passer
//   - Sinon : redirige vers /{locale}{pathname}
//     locale = cookie tradinglab_locale > Accept-Language > DEFAULT_LOCALE
//   - Set cookie tradinglab_locale (1 an) à chaque redirect pour persister
//     le choix entre visites
//
// Pas de dépendance externe (pas de negotiator / intl-localematcher).
// Parser Accept-Language minimaliste — suffisant pour 3 locales.

import { NextResponse, type NextRequest } from "next/server";
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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) return;

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 an
    sameSite: "lax",
  });
  return response;
}

export const config = {
  // Skip Next internals, API routes, fichiers statiques courants
  matcher: [
    "/((?!_next/|api/|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|otf|map)$).*)",
  ],
};
