import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/callback", "/auth/confirm", "/admin", "/dashboard", "/compte"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
