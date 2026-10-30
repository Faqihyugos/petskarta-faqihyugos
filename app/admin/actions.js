"use server";

import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server";

export async function login(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const email = form?.get?.("email")?.toString()?.trim();
  const password = form?.get?.("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email atau password salah."
          : `Gagal masuk: ${error.message}`,
    };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

