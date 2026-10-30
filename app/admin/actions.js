"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function tambahProduk(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const nama = form?.get?.("nama")?.toString()?.trim();
  const hargaRaw = form?.get?.("harga")?.toString()?.trim();
  const kategori = form?.get?.("kategori")?.toString()?.trim() || null;
  const foto_url = form?.get?.("foto_url")?.toString()?.trim() || null;
  const deskripsi = form?.get?.("deskripsi")?.toString()?.trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka positif." };
  }

  // Verifikasi status login admin di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk menambah produk." };
  }

  const { error } = await supabase.from("produk").insert([
    {
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    },
  ]);

  if (error) {
    return { error: `Gagal menambahkan produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export const createProduk = tambahProduk;

export async function ubahProduk(idOrPrevState, formDataOrPrevState, maybeFormData) {
  let id, form;
  if (maybeFormData instanceof FormData) {
    id = idOrPrevState;
    form = maybeFormData;
  } else {
    form = formDataOrPrevState instanceof FormData ? formDataOrPrevState : idOrPrevState;
    id =
      (form instanceof FormData ? form.get("id") : form?.id) ||
      (typeof idOrPrevState === "string" || typeof idOrPrevState === "number" ? idOrPrevState : null);
  }

  const nama = (form instanceof FormData ? form.get("nama") : form?.nama)?.toString()?.trim();
  const hargaRaw = (form instanceof FormData ? form.get("harga") : form?.harga)?.toString()?.trim();
  const kategori = (form instanceof FormData ? form.get("kategori") : form?.kategori)?.toString()?.trim() || null;
  const foto_url = (form instanceof FormData ? form.get("foto_url") : form?.foto_url)?.toString()?.trim() || null;
  const deskripsi = (form instanceof FormData ? form.get("deskripsi") : form?.deskripsi)?.toString()?.trim() || null;

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka positif." };
  }

  // Verifikasi login admin di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk mengubah produk." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: `Gagal memperbarui produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/produk/${id}/ubah`);
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export const updateProduk = ubahProduk;

export async function hapusProduk(idOrPrevState, maybeFormData) {
  let id;
  const form =
    maybeFormData instanceof FormData
      ? maybeFormData
      : idOrPrevState instanceof FormData
      ? idOrPrevState
      : null;

  if (form) {
    id = form.get("id");
  } else if (typeof idOrPrevState === "string" || typeof idOrPrevState === "number") {
    id = idOrPrevState;
  } else if (idOrPrevState?.id) {
    id = idOrPrevState.id;
  }

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  // Verifikasi login admin di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk menghapus produk." };
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export const deleteProduk = hapusProduk;

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

