"use server";

import { createAuthServerClient } from "@/lib/supabase/server";
import { perbaruiPengaturan } from "@/lib/pengaturan";
import { catatAuditLog } from "@/lib/audit-log";
import { revalidatePath } from "next/cache";

// Server action untuk menyimpan identitas white-label dan tema warna (US-52)
export async function simpanSistemWhiteLabelAction(prevState, formData) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { sukses: false, pesan: "Akses ditolak: Hanya admin yang diizinkan." };
  }

  const namaBisnis = formData.get("namaBisnis")?.toString().trim() || "Petskarta";
  const tagline = formData.get("tagline")?.toString().trim() || "";
  const logoEmoji = formData.get("logoEmoji")?.toString().trim() || "🐰";
  const logoUrl = formData.get("logoUrl")?.toString().trim() || "";
  const teksFooter = formData.get("teksFooter")?.toString().trim() || "";
  const temaPreset = formData.get("temaPreset")?.toString().trim() || "emerald";

  let warnaUtama = formData.get("warnaUtama")?.toString().trim() || "#1f6b4f";
  let warnaUtamaGelap = formData.get("warnaUtamaGelap")?.toString().trim() || "#154d39";
  let warnaHarga = formData.get("warnaHarga")?.toString().trim() || "#7a4e09";
  let warnaHargaLatar = formData.get("warnaHargaLatar")?.toString().trim() || "#fbefd8";

  // Validasi format kode warna heksadesimal (#RRGGBB)
  const hexRegex = /^#([A-Fa-f0-9]{6})$/;
  if (!hexRegex.test(warnaUtama)) warnaUtama = "#1f6b4f";
  if (!hexRegex.test(warnaUtamaGelap)) warnaUtamaGelap = "#154d39";
  if (!hexRegex.test(warnaHarga)) warnaHarga = "#7a4e09";
  if (!hexRegex.test(warnaHargaLatar)) warnaHargaLatar = "#fbefd8";

  if (!namaBisnis) {
    return { sukses: false, pesan: "Nama bisnis wajib diisi." };
  }

  await perbaruiPengaturan({
    namaBisnis,
    tagline,
    logoEmoji,
    logoUrl,
    teksFooter,
    temaPreset,
    warnaUtama,
    warnaUtamaGelap,
    warnaHarga,
    warnaHargaLatar,
  });

  await catatAuditLog({
    adminEmail: user.email,
    aksi: "UPDATE_WHITE_LABEL",
    rincian: `Memperbarui branding & tema: ${namaBisnis} (${temaPreset})`,
    targetId: "sistem_tema",
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");

  return {
    sukses: true,
    pesan: "Konfigurasi White-Label dan Tema Sistem berhasil diperbarui secara real-time!",
  };
}

