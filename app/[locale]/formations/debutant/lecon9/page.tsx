import { DebutantLessonView } from "../_components/DebutantLessonView";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <DebutantLessonView slug="lecon9" locale={locale} />;
}
