export const MAP_KATEGORI_SLUG = {
  "kelinci-hias": {
    nama: "Kelinci Hias",
    judul: "Adopsi Kelinci Hias Jakarta",
    deskripsi:
      "Koleksi kelinci ras murni Holland Lop dan Netherland Dwarf bersertifikat, sehat, ramah anak, dan bergaransi pengiriman se-Indonesia.",
    icon: "🐰",
  },
  "bunny-hotel": {
    nama: "Bunny Hotel",
    judul: "Bunny Hotel & Penitipan Kelinci Ber-AC",
    deskripsi:
      "Penitipan kelinci dan hewan kecil dengan ruangan ber-AC, pantauan CCTV 24 jam, alas foot rest plastik empuk, dan free unlimited rumput timothy.",
    icon: "🏨",
  },
  "grooming": {
    nama: "Grooming & Perawatan",
    judul: "Grooming & Pengobatan Scabies Healer",
    deskripsi:
      "Perawatan higienis kelinci: potong kuku aman, bersih telinga, pembersihan bulu gimbal, serta paket spesialis Scabies Healer tuntas.",
    icon: "🛁",
  },
  "grooming-perawatan": {
    nama: "Grooming & Perawatan",
    judul: "Grooming & Pengobatan Scabies Healer",
    deskripsi:
      "Perawatan higienis kelinci: potong kuku aman, bersih telinga, pembersihan bulu gimbal, serta paket spesialis Scabies Healer tuntas.",
    icon: "🛁",
  },
  "pakan-aksesoris": {
    nama: "Pakan & Aksesoris",
    judul: "Rumput Timothy Hay & Starter Kit",
    deskripsi:
      "Rumput timothy first-cut premium, pelet bernutrisi, botol minum anti bocor, toilet sudut, dan kandang ramah kelinci.",
    icon: "🌾",
  },
  "aksesoris": {
    nama: "Pakan & Aksesoris",
    judul: "Rumput Timothy Hay & Starter Kit",
    deskripsi:
      "Rumput timothy first-cut premium, pelet bernutrisi, botol minum anti bocor, toilet sudut, dan kandang ramah kelinci.",
    icon: "🌾",
  },
};

export function dapatkanKategoriDariSlug(slug) {
  if (!slug) return null;
  return MAP_KATEGORI_SLUG[slug.toLowerCase()] || null;
}

export function buatSlugKategori(kategori) {
  if (!kategori) return "kelinci-hias";
  const katLower = kategori.toLowerCase();
  if (katLower.includes("kelinci")) return "kelinci-hias";
  if (katLower.includes("hotel")) return "bunny-hotel";
  if (katLower.includes("grooming") || katLower.includes("perawatan") || katLower.includes("scabies"))
    return "grooming";
  if (katLower.includes("pakan") || katLower.includes("aksesoris"))
    return "pakan-aksesoris";
  return "kelinci-hias";
}

