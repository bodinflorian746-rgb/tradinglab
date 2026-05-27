import { StrategyModuleIndex } from "@/app/components/StrategyModuleIndex";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export default async function PriceActionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  return <StrategyModuleIndex moduleId="price-action" locale={locale} />;
}
