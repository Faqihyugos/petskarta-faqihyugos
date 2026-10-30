"use server";

import { simpanUlasanBaru, ubahStatusUlasan, hapusUlasanDatabase } from "@/lib/ulasan";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

// Server Action untuk pengiriman ulasan pelanggan (US-38)
export async function kirimUlasanAction(prevState, formData) {
  const nama = formData.get("nama")?.toString().trim() || "";
  const ratingStr = formData.get("rating")?.toString() || "5";
  const komentar = formData.get("komentar")?.toString().trim() || "";
  const honeypot = formData.get("website_url")?.toString() || ""; // Anti-spam honeypot

  // Anti-spam honeypot: bot mengisi field tersembunyi ini
  if (honeypot) {
    return { sukses: false, pesan: "Terjadi kesalahan sistem, silakan coba lagi." };
  }

  // Validasi input di sisi server
  if (!nama || nama.length < 2) {
    return { sukses: false, pesan: "Nama minimal 2 karakter." };
  }

  if (nama.length > 60) {
    return { sukses: false, pesan: "Nama maksimal 60 karakter." };
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { sukses: false, pesan: "Rating harus berupa angka 1 sampai 5 bintang." };
  }

  if (!komentar || komentar.length < 10) {
    return { sukses: false, pesan: "Ulasan terlalu pendek, minimal 10 karakter." };
  }

  if (komentar.length > 500) {
    return { sukses: false, pesan: "Ulasan terlalu panjang, maksimal 500 karakter." };
  }

  await simpanUlasanBaru({ nama, rating, komentar });
  revalidatePath("/");
  revalidatePath("/admin/ulasan");

  return {
    sukses: true,
    pesan: "Terima kasih! Ulasan Anda berhasil dikirimkan.",
  };
}

// Server Action untuk moderasi ulasan oleh admin (US-39)
export async function setujuiUlasanAction(id, disetujui) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Akses ditolak: Hanya admin yang diizinkan.");

  await ubahStatusUlasan(id, disetujui);
  revalidatePath("/");
  revalidatePath("/admin/ulasan");
  return { sukses: true };
}

export async function hapusUlasanAction(id) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Akses ditolak: Hanya admin yang diizinkan.");

  await hapusUlasanDatabase(id);
  revalidatePath("/");
  revalidatePath("/admin/ulasan");
  return { sukses: true };
}

