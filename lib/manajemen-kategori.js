import { createServerClient } from "@/lib/supabase/server";

export const kategoriBawaan = [
  "Kelinci Hias",
  "Bunny Hotel",
  "Grooming & Perawatan",
  "Pakan & Aksesoris",
];

let kategoriTersimpan = [...kategoriBawaan];

export async function ambilDaftarKategori() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("kategori")
      .select("nama")
      .order("id", { ascending: true });
    if (data && data.length > 0) {
      return data.map((d) => d.nama);
    }
  } catch {
    // Fallback
  }

  return [...kategoriTersimpan];
}

export async function simpanKategoriBaru(nama) {
  const clean = String(nama || "").trim();
  if (!clean) throw new Error("Nama kategori tidak boleh kosong.");
  if (kategoriTersimpan.includes(clean)) {
    throw new Error("Kategori sudah terdaftar.");
  }

  try {
    const supabase = createServerClient();
    await supabase.from("kategori").insert([{ nama: clean }]);
  } catch {
    // Fallback
  }

  kategoriTersimpan.push(clean);
  return { sukses: true };
}

export async function perbaruiNamaKategori(namaLama, namaBaru) {
  const cleanLama = String(namaLama || "").trim();
  const cleanBaru = String(namaBaru || "").trim();
  if (!cleanBaru) throw new Error("Nama kategori baru tidak boleh kosong.");

  try {
    const supabase = createServerClient();
    await supabase.from("kategori").update({ nama: cleanBaru }).eq("nama", cleanLama);
    // Sinkronkan ke tabel produk
    await supabase.from("produk").update({ kategori: cleanBaru }).eq("kategori", cleanLama);
  } catch {
    // Fallback
  }

  kategoriTersimpan = kategoriTersimpan.map((k) =>
    k === cleanLama ? cleanBaru : k
  );
  return { sukses: true };
}

export async function hapusKategoriDb(nama) {
  const clean = String(nama || "").trim();

  // Cek apakah ada produk yang masih menggunakan kategori ini
  try {
    const supabase = createServerClient();
    const { count } = await supabase
      .from("produk")
      .select("id", { count: "exact", head: true })
      .eq("kategori", clean);

    if (count && count > 0) {
      throw new Error(
        `Kategori "${clean}" tidak dapat dihapus karena masih digunakan oleh ${count} produk/layanan.`
      );
    }

    await supabase.from("kategori").delete().eq("nama", clean);
  } catch (err) {
    if (err.message.includes("tidak dapat dihapus")) {
      throw err;
    }
  }

  kategoriTersimpan = kategoriTersimpan.filter((k) => k !== clean);
  return { sukses: true };
}

