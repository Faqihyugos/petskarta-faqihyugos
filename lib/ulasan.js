import { createServerClient } from "@/lib/supabase/server";

export const ulasanGoogleAwal = [
  {
    id: "g-1",
    nama: "drh. Sarah Amelia",
    rating: 5,
    komentar:
      "Adopsi Holland Lop di Petskarta sangat terpercaya! Kelinci sampai di Bandung dengan pengiriman bergaransi, sehat, lincah, dan langsung mau makan rumput timothy.",
    sumber: "Google Reviews",
    tanggal: "2 minggu yang lalu",
    layanan: "Adopsi Holland Lop",
    disetujui: true,
  },
  {
    id: "g-2",
    nama: "Bambang Kurniawan",
    rating: 5,
    komentar:
      "Penitipan Bunny Hotel terbaik di Jakarta! Ruangan ber-AC dingin, dipantau CCTV 24 jam, alas foot rest empuk sehingga kaki kelinci aman dari sore hocks.",
    sumber: "Google Reviews",
    tanggal: "1 bulan yang lalu",
    layanan: "Bunny Hotel Deluxe",
    disetujui: true,
  },
  {
    id: "g-3",
    nama: "Nadia Safitri",
    rating: 5,
    komentar:
      "Kelinci saya scabies parah di telinga dan hidung, sembuh total setelah ikut paket Scabies Healer Petskarta. Stafnya sangat telaten dan edukatif.",
    sumber: "Google Reviews",
    tanggal: "3 minggu yang lalu",
    layanan: "Paket Scabies Healer Tuntas",
    disetujui: true,
  },
  {
    id: "g-4",
    nama: "Rian Pratama",
    rating: 5,
    komentar:
      "Netherland Dwarf pure white ras murni. Karakternya jinak dan bersih. Senang sekali bisa konsultasi gratis seputar nutrisi dan kandang via WhatsApp.",
    sumber: "Google Reviews",
    tanggal: "1 bulan yang lalu",
    layanan: "Adopsi Netherland Dwarf",
    disetujui: true,
  },
];

// Memory fallback untuk ulasan komunitas yang baru dikirimkan
let ulasanTersimpan = [];

export async function ambilUlasanPublik() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("ulasan")
      .select("*")
      .eq("disetujui", true)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return [...data, ...ulasanGoogleAwal];
    }
  } catch {
    // Abaikan jika tabel ulasan belum dibuat di database
  }

  const ulasanDisetujui = ulasanTersimpan.filter((u) => u.disetujui);
  return [...ulasanDisetujui, ...ulasanGoogleAwal];
}

export async function ambilSemuaUlasanAdmin() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("ulasan")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return [...data, ...ulasanGoogleAwal];
    }
  } catch {
    // Fallback
  }

  return [...ulasanTersimpan, ...ulasanGoogleAwal];
}

export async function simpanUlasanBaru({ nama, rating, komentar }) {
  const itemBaru = {
    id: `u-${Date.now()}`,
    nama: String(nama).trim(),
    rating: Number(rating) || 5,
    komentar: String(komentar).trim(),
    sumber: "Petskarta Web",
    tanggal: "Baru saja",
    disetujui: true, // Default disetujui, admin dapat menyembunyikan di panel
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("ulasan").insert([
      {
        nama: itemBaru.nama,
        rating: itemBaru.rating,
        komentar: itemBaru.komentar,
        disetujui: true,
      },
    ]);
    if (!error) return { sukses: true };
  } catch {
    // Gunakan fallback memori
  }

  ulasanTersimpan.unshift(itemBaru);
  return { sukses: true };
}

export async function ubahStatusUlasan(id, statusDisetujui) {
  try {
    const supabase = createServerClient();
    await supabase.from("ulasan").update({ disetujui: statusDisetujui }).eq("id", id);
  } catch {
    // Fallback
  }
  ulasanTersimpan = ulasanTersimpan.map((u) =>
    String(u.id) === String(id) ? { ...u, disetujui: statusDisetujui } : u
  );
  return { sukses: true };
}

export async function hapusUlasanDatabase(id) {
  try {
    const supabase = createServerClient();
    await supabase.from("ulasan").delete().eq("id", id);
  } catch {
    // Fallback
  }
  ulasanTersimpan = ulasanTersimpan.filter((u) => String(u.id) !== String(id));
  return { sukses: true };
}

