"use server";

import { createServerClient } from "@/lib/supabase/server";
import { perbaruiPengaturan, ambilPengaturan } from "@/lib/pengaturan";
import { revalidatePath } from "next/cache";

// Server action untuk mengubah banner pengumuman (US-42)
export async function simpanBannerAction(prevState, formData) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { sukses: false, pesan: "Akses ditolak: Anda harus login sebagai admin." };
  }

  const aktif = formData.get("bannerAktif") === "on";
  const teks = formData.get("bannerTeks")?.toString().trim() || "";
  const link = formData.get("bannerLink")?.toString().trim() || "";

  if (aktif && !teks) {
    return { sukses: false, pesan: "Teks banner wajib diisi jika banner diaktifkan." };
  }

  await perbaruiPengaturan({
    bannerAktif: aktif,
    bannerTeks: teks,
    bannerLink: link,
  });

  revalidatePath("/", "layout");
  return { sukses: true, pesan: "Pengaturan banner pengumuman berhasil disimpan." };
}

// Server action untuk mengubah kontak multi-cabang (US-43)
export async function simpanKontakCabangAction(prevState, formData) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { sukses: false, pesan: "Akses ditolak: Anda harus login sebagai admin." };
  }

  const namaBisnis = formData.get("namaBisnis")?.toString().trim() || "Petskarta";
  let wa1 = formData.get("waCabang1")?.toString().trim().replace(/[^0-9]/g, "") || "";
  let wa2 = formData.get("waCabang2")?.toString().trim().replace(/[^0-9]/g, "") || "";
  const jamBuka = formData.get("jamBuka")?.toString().trim() || "";
  const alamat = formData.get("alamat")?.toString().trim() || "";

  // Normalisasi nomor WhatsApp ke standar internasional
  if (wa1.startsWith("0")) wa1 = "62" + wa1.slice(1);
  if (wa2.startsWith("0")) wa2 = "62" + wa2.slice(1);

  if (wa1.length < 10) {
    return { sukses: false, pesan: "Nomor WhatsApp Cabang 1 minimal 10 digit angka valid." };
  }

  if (wa2.length < 10) {
    return { sukses: false, pesan: "Nomor WhatsApp Cabang 2 minimal 10 digit angka valid." };
  }

  await perbaruiPengaturan({
    namaBisnis,
    nomorWaCabang1: wa1,
    nomorWaCabang2: wa2,
    jamBuka,
    alamat,
  });

  revalidatePath("/", "layout");
  return { sukses: true, pesan: "Pengaturan kontak cabang resmi berhasil diperbarui." };
}

