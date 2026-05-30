// URL de production du site (utilisée par sitemap, robots, hreflang, canonical).
// Override possible via NEXT_PUBLIC_SITE_URL au déploiement.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://tradescalex.com";
