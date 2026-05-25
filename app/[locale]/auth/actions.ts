"use server";

// Server Actions auth V1 : signUp, signIn, signOut.
// Appelées depuis les <form action={...}> dans /signup, /login, /dashboard.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getStr(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function signUp(formData: FormData) {
  const email = getStr(formData, "email");
  const password = getStr(formData, "password");
  const locale = getStr(formData, "locale") || "fr";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/${locale}/signup?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
}

export async function signIn(formData: FormData) {
  const email = getStr(formData, "email");
  const password = getStr(formData, "password");
  const locale = getStr(formData, "locale") || "fr";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/dashboard`);
}

export async function signOut(formData: FormData) {
  const locale = getStr(formData, "locale") || "fr";
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(`/${locale}/login`);
}
