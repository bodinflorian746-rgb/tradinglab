import type { MetadataRoute } from "next";
import { ACTIVE_LOCALES } from "@/i18n/config";
import { SITE_URL } from "@/i18n/site";

// Pages privées, sans préfixe de langue : les URL réelles sont /<langue>/...
// (proxy.ts), d'où un Disallow par langue active (/fr/admin, /fr/compte…).
const PRIVATE = ["/auth/callback", "/auth/confirm", "/admin", "/dashboard", "/compte"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ACTIVE_LOCALES.flatMap((l) => PRIVATE.map((p) => `/${l}${p}`)),
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
