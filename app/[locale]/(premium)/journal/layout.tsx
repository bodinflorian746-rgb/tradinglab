import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Garde serveur du segment /journal (miroir de dashboard/layout.tsx).
// Le Route Group (premium) applique déjà PremiumGate ; cette garde ajoute une
// redirection nette vers /pricing pour les anonymes (le journal écrit des
// données utilisateur, on veut une session sûre).
export default async function JournalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Dev bypass : accès direct en local (cohérent avec les autres layouts premium).
  if (process.env.NODE_ENV !== "production") {
    return <>{children}</>;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/pricing`);
  }

  return <>{children}</>;
}
