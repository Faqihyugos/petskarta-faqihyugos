/**
 * Logika Promo, Diskon, dan Badge Kepercayaan Petskarta (US-20).
 * Mengelola deteksi harga coret dan badge tanpa mengubah skema tabel database.
 */

export function ekstrakPromoDanBadge(produk) {
  if (!produk) {
    return {
      hargaCoret: null,
      diskonPersen: 0,
      badges: [],
    };
  }

  const deskripsi = produk.deskripsi || "";
  const nama = (produk.nama || "").toLowerCase();
  const kategori = (produk.kategori || "").toLowerCase();

  // 1. Ekstrak Harga Coret dari tag [CORET:angka] atau [HARGA_ASLI:angka]
  let hargaCoret = null;
  const matchCoret = deskripsi.match(/\[(CORET|HARGA_ASLI):([0-9.]+)\]/i);
  if (matchCoret) {
    const parsed = parseInt(matchCoret[2].replace(/\./g, ""), 10);
    if (!isNaN(parsed) && parsed > (produk.harga || 0)) {
      hargaCoret = parsed;
    }
  }

  // Hitung persentase diskon
  const diskonPersen =
    hargaCoret && hargaCoret > (produk.harga || 0)
      ? Math.round(((hargaCoret - produk.harga) / hargaCoret) * 100)
      : 0;

  // 2. Ekstrak Badges (Manual dari tag [BADGE:Nama] dan Otomatis dari Konteks)
  const badges = [];

  const matchBadges = deskripsi.matchAll(/\[BADGE:([^\]]+)\]/gi);
  for (const m of matchBadges) {
    const b = m[1].trim();
    if (b && !badges.includes(b)) {
      badges.push(b);
    }
  }

  // Penambahan badge otomatis berdasarkan konteks jika belum ada
  if (
    (nama.includes("mudik") ||
      nama.includes("lebaran") ||
      deskripsi.toLowerCase().includes("mudik lebaran")) &&
    !badges.includes("Promo Mudik Lebaran")
  ) {
    badges.push("Promo Mudik Lebaran");
  }

  if (
    (kategori.includes("hotel") || kategori.includes("daycare")) &&
    !badges.includes("Fasilitas AC & CCTV")
  ) {
    badges.push("Fasilitas AC & CCTV");
  }

  if (
    (kategori.includes("kelinci") ||
      nama.includes("holland") ||
      nama.includes("netherland") ||
      nama.includes("lop")) &&
    !badges.includes("Garansi Bebas Scabies")
  ) {
    badges.push("Garansi Bebas Scabies");
  }

  if (
    (nama.includes("best seller") ||
      nama.includes("starter kit") ||
      deskripsi.toLowerCase().includes("best seller")) &&
    !badges.includes("Best Seller")
  ) {
    badges.push("Best Seller");
  }

  return {
    hargaCoret,
    diskonPersen,
    badges,
  };
}

/**
 * Menghapus seluruh tag internal ([STATUS:...], [CORET:...], [BADGE:...])
 * agar teks deskripsi yang tampil ke pengunjung tetap rapi dan bersih.
 */
export function bersihkanDeskripsiLengkap(deskripsi) {
  if (!deskripsi) return "";
  return deskripsi
    .replace(/\[STATUS:(PENUH|TERADOPSI|HABIS)\]/gi, "")
    .replace(/\[(CORET|HARGA_ASLI):[0-9.]+\]/gi, "")
    .replace(/\[BADGE:[^\]]+\]/gi, "")
    .trim();
}

