import { StrategyModuleIndex } from "@/app/components/StrategyModuleIndex";
import { hasLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export default async function MacroTradingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const raw = (await params).locale;
  const locale: Locale = hasLocale(raw) ? raw : DEFAULT_LOCALE;
  return <StrategyModuleIndex moduleId="macro-trading" locale={locale} />;
}
