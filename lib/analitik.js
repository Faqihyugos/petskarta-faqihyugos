import { createServerClient } from "@/lib/supabase/server";

// Fallback memori untuk pencatatan klik booking jika tabel DB belum dibuat
let riwayatKlikMemori = [
  {
    id: "clk-1",
    produk_id: "1",
    nama_layanan: "Holland Lop Broken Orange (Junior)",
    kategori: "Kelinci Hias",
    cabang_tujuan: "Pondok Pinang",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "clk-2",
    produk_id: "3",
    nama_layanan: "Bunny Hotel Deluxe (AC + Pantauan CCTV)",
    kategori: "Bunny Hotel",
    cabang_tujuan: "Jatinegara",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "clk-3",
    produk_id: "4",
    nama_layanan: "Paket Pengobatan Scabies Healer Tuntas",
    kategori: "Grooming & Perawatan",
    cabang_tujuan: "Jatinegara",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "clk-4",
    produk_id: "3",
    nama_layanan: "Bunny Hotel Deluxe (AC + Pantauan CCTV)",
    kategori: "Bunny Hotel",
    cabang_tujuan: "Jatinegara",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "clk-5",
    produk_id: "2",
    nama_layanan: "Netherland Dwarf Pure White (Pedigree)",
    kategori: "Kelinci Hias",
    cabang_tujuan: "Pondok Pinang",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// US-40: Pelacakan Klik Booking WhatsApp Asinkron Tanpa Menunda Pengguna
export async function rekamKlikBooking({ produkId, namaLayanan, kategori, cabangTujuan }) {
  const dataKlik = {
    produk_id: String(produkId || "0"),
    nama_layanan: String(namaLayanan || "Layanan Petskarta").slice(0, 100),
    kategori: String(kategori || "Umum").slice(0, 50),
    cabang_tujuan: String(cabangTujuan || "Pondok Pinang").slice(0, 50),
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createServerClient();
    await supabase.from("booking_clicks").insert([dataKlik]);
  } catch {
    // Abaikan kegagalan database, simpan ke memori
  }

  riwayatKlikMemori.unshift({
    id: `clk-${Date.now()}`,
    ...dataKlik,
  });

  return { sukses: true };
}

// US-30 & US-41: Ringkasan Analitik Dashboard Petskarta
export async function ambilRingkasanAnalitik(daftarProduk = []) {
  let semuaKlik = [...riwayatKlikMemori];

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("booking_clicks")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      semuaKlik = data;
    }
  } catch {
    // Gunakan fallback
  }

  // 1. Hitung total item & per kategori dari data produk (US-30)
  const totalProduk = daftarProduk.length;
  const jumlahPerKategori = {};
  daftarProduk.forEach((p) => {
    const kat = p.kategori || "Lainnya";
    jumlahPerKategori[kat] = (jumlahPerKategori[kat] || 0) + 1;
  });

  // 2. Hitung 5 layanan terpopuler berdasarkan klik booking (US-41)
  const frekuensiLayanan = {};
  semuaKlik.forEach((k) => {
    const nama = k.nama_layanan;
    if (!frekuensiLayanan[nama]) {
      frekuensiLayanan[nama] = {
        nama,
        kategori: k.kategori,
        total: 0,
      };
    }
    frekuensiLayanan[nama].total += 1;
  });

  const top5Layanan = Object.values(frekuensiLayanan)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // 3. Metrik klik per kategori booking
  const klikPerKategori = {};
  semuaKlik.forEach((k) => {
    const kat = k.kategori || "Umum";
    klikPerKategori[kat] = (klikPerKategori[kat] || 0) + 1;
  });

  // 4. Distribusi klik per cabang
  const klikPerCabang = {};
  semuaKlik.forEach((k) => {
    const cab = k.cabang_tujuan || "Pondok Pinang";
    klikPerCabang[cab] = (klikPerCabang[cab] || 0) + 1;
  });

  return {
    totalProduk,
    jumlahPerKategori,
    totalKlikBooking: semuaKlik.length,
    top5Layanan,
    klikPerKategori,
    klikPerCabang,
  };
}

