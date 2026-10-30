import { createServerClient } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const defaultPengaturan = {
  // Banner Pengumuman (US-42)
  bannerAktif: true,
  bannerTeks:
    "📢 Pemberitahuan: Petskarta Buka Normal & Reservasi Bunny Hotel Mudik Lebaran Tersisa 5 Kamar AC! Hubungi admin sekarang sebelum kuota penuh.",
  bannerLink: "/cabang",

  // Pengaturan Multi-Cabang & Kontak (US-43)
  namaBisnis: toko.nama,
  nomorWaCabang1: "6281299992016", // Pondok Pinang
  nomorWaCabang2: "6281388882016", // Jatinegara
  jamBuka: toko.jamBuka,
  alamat: toko.alamat,
};

let cachePengaturan = { ...defaultPengaturan };

export async function ambilPengaturan() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("pengaturan")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data) {
      cachePengaturan = {
        bannerAktif: data.banner_aktif ?? cachePengaturan.bannerAktif,
        bannerTeks: data.banner_teks || cachePengaturan.bannerTeks,
        bannerLink: data.banner_link || cachePengaturan.bannerLink,
        namaBisnis: data.nama_bisnis || cachePengaturan.namaBisnis,
        nomorWaCabang1: data.wa_cabang_1 || cachePengaturan.nomorWaCabang1,
        nomorWaCabang2: data.wa_cabang_2 || cachePengaturan.nomorWaCabang2,
        jamBuka: data.jam_buka || cachePengaturan.jamBuka,
        alamat: data.alamat || cachePengaturan.alamat,
      };
    }
  } catch {
    // Gunakan fallback cache
  }

  return { ...cachePengaturan };
}

export async function perbaruiPengaturan(dataBaru) {
  cachePengaturan = {
    ...cachePengaturan,
    ...dataBaru,
  };

  try {
    const supabase = createServerClient();
    await supabase.from("pengaturan").upsert({
      id: 1,
      banner_aktif: cachePengaturan.bannerAktif,
      banner_teks: cachePengaturan.bannerTeks,
      banner_link: cachePengaturan.bannerLink,
      nama_bisnis: cachePengaturan.namaBisnis,
      wa_cabang_1: cachePengaturan.nomorWaCabang1,
      wa_cabang_2: cachePengaturan.nomorWaCabang2,
      jam_buka: cachePengaturan.jamBuka,
      alamat: cachePengaturan.alamat,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // Abaikan jika tabel pengaturan belum dibuat di DB
  }

  return { sukses: true };
}

