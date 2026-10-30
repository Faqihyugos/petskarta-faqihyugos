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

export async function gantiPassword(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const passwordBaru = (
    form instanceof FormData
      ? form.get("password_baru")
      : form?.password_baru ?? form?.get?.("password_baru")
  )?.toString() ?? "";
  const konfirmasiPassword = (
    form instanceof FormData
      ? form.get("konfirmasi_password")
      : form?.konfirmasi_password ?? form?.get?.("konfirmasi_password")
  )?.toString() ?? "";

  // Validasi input di server
  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  // Verifikasi admin sudah login di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk mengganti password." };
  }

  // Perbarui password via Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return {
      error:
        error.message === "New password should be different from the old password."
          ? "Password baru tidak boleh sama dengan password lama."
          : `Gagal memperbarui password: ${error.message}`,
    };
  }

  return { success: "Password berhasil diperbarui." };
}

export const updatePassword = gantiPassword;

/**
 * Memverifikasi status login admin di server.
 * Mengembalikan data user admin jika terautentikasi, atau null jika tidak valid.
 */
export async function verifikasiAdmin() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

