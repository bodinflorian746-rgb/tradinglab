"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLocale, useDict } from "@/app/components/LocaleProvider";
import { localizedHref } from "@/lib/i18n/href";

export function LogoutButton() {
  const router = useRouter();
  const locale = useLocale();
  const label = useDict("common").auth.logout;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(localizedHref("/", locale));
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
    >
      {label}
    </button>
  );
}
