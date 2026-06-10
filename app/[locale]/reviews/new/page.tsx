import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { ReviewForm } from "./ReviewForm";

export default async function NewReviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  // ReviewForm gère uniquement FR/ES. "en" → fallback FR.
  const lang: "fr" | "es" = locale === "es" ? "es" : "fr";
  return <ReviewForm locale={lang} />;
}
