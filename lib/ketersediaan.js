/**
 * Mengecek status ketersediaan item Petskarta (US-19).
 * Mendukung penanda status di kolom status, deskripsi ([STATUS:TERADOPSI], [STATUS:PENUH]),
 * atau penanda teks pada nama produk.
 */
export function cekKetersediaan(produk) {
  if (!produk) {
    return {
      tersedia: true,
      status: "tersedia",
      label: "Tersedia",
      labelTombol: "Pesan / Booking via WhatsApp",
    };
  }

  const isHotel = (produk.kategori || "").toLowerCase().includes("hotel");
  const statusRaw = (produk.status || "").toLowerCase();
  const deskripsi = (produk.deskripsi || "").toLowerCase();
  const nama = (produk.nama || "").toLowerCase();

  const isArsip =
    statusRaw === "arsip" ||
    statusRaw === "nonaktif" ||
    deskripsi.includes("[status:arsip]") ||
    deskripsi.includes("[status:nonaktif]");

  if (isArsip) {
    return {
      tersedia: false,
      isArsip: true,
      status: "arsip",
      label: "Diarsipkan",
      labelTombol: "Item Diarsipkan",
    };
  }

  const isPenuh =
    statusRaw === "penuh" ||
    statusRaw === "full" ||
    deskripsi.includes("[status:penuh]") ||
    deskripsi.includes("kamar penuh") ||
    nama.includes("[penuh]");

  if (isPenuh) {
    return {
      tersedia: false,
      status: "penuh",
      label: isHotel ? "Kamar Penuh" : "Kuota Penuh",
      labelTombol: "Konsultasi Daftar Tunggu via WhatsApp",
    };
  }

  const isTeradopsi =
    statusRaw === "teradopsi" ||
    statusRaw === "habis" ||
    deskripsi.includes("[status:teradopsi]") ||
    deskripsi.includes("[status:habis]") ||
    deskripsi.includes("sudah teradopsi") ||
    nama.includes("[teradopsi]") ||
    nama.includes("[habis]");

  if (isTeradopsi) {
    return {
      tersedia: false,
      status: "teradopsi",
      label: isHotel ? "Kamar Penuh" : "Sudah Teradopsi",
      labelTombol: "Konsultasi Daftar Tunggu via WhatsApp",
    };
  }

  return {
    tersedia: true,
    status: "tersedia",
    label: isHotel ? "Kamar Tersedia" : "Siap Adopsi",
    labelTombol: "Pesan / Booking via WhatsApp",
  };
}

/**
 * Menghapus tag sistem internal ([STATUS:...], [CORET:...], [BADGE:...])
 * agar tidak mengotori tampilan deskripsi publik.
 */
export function bersihkanDeskripsi(deskripsi) {
  if (!deskripsi) return "";
  return deskripsi
    .replace(/\[STATUS:(PENUH|TERADOPSI|HABIS|ARSIP|NONAKTIF)\]/gi, "")
    .replace(/\[(CORET|HARGA_ASLI):[0-9.]+\]/gi, "")
    .replace(/\[BADGE:[^\]]+\]/gi, "")
    .trim();
}
