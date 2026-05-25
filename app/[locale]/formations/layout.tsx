import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Garde serveur : vérifie la session Supabase avant de rendre toute page
// du segment /formations/* (toutes les formations + leçons enfants).
// Redirige vers /[locale]/login si anonyme.
export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return <>{children}</>;
}
