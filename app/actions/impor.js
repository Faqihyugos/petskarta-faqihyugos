"use server";

import { createServerClient } from "@/lib/supabase/server";
import { catatAuditLog } from "@/lib/audit-log";
import { revalidatePath } from "next/cache";

export async function imporProdukCSVAction(prevState, formData) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { sukses: false, pesan: "Akses ditolak: Hanya admin yang diizinkan." };
  }

  const berkas = formData.get("berkas_csv");
  if (!berkas || typeof berkas !== "object" || berkas.size === 0) {
    return { sukses: false, pesan: "Pilih berkas CSV terlebih dahulu." };
  }

  try {
    const text = await berkas.text();
    const baris = text.split(/\r?\n/).filter((b) => b.trim().length > 0);

    if (baris.length <= 1) {
      return { sukses: false, pesan: "Berkas CSV kosong atau hanya memiliki header." };
    }

    const dataValid = [];
    const rincianError = [];

    // Mengurai setiap baris (baris 0 adalah header)
    for (let i = 1; i < baris.length; i++) {
      const barisTeks = baris[i].trim();
      if (!barisTeks) continue;

      // Parsing CSV sederhana dengan penanganan kutip
      const kolom = barisTeks.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((val) =>
        val.replace(/^"|"$/g, "").trim()
      );

      const nama = kolom[0];
      const hargaStr = kolom[1];
      const kategori = kolom[2] || "Kelinci Hias";
      const deskripsi = kolom[3] || "";
      const foto_url = kolom[4] || "/produk/kelinci.svg";

      const nomorBaris = i + 1;

      if (!nama) {
        rincianError.push(`Baris ${nomorBaris}: Nama produk tidak boleh kosong.`);
        continue;
      }

      const harga = parseInt(hargaStr?.replace(/[^0-9]/g, "") || "", 10);
      if (isNaN(harga) || harga < 0) {
        rincianError.push(
          `Baris ${nomorBaris} (${nama}): Harga "${hargaStr}" harus berupa angka valid non-negatif.`
        );
        continue;
      }

      dataValid.push({
        nama,
        harga,
        kategori,
        deskripsi: deskripsi || null,
        foto_url: foto_url || null,
      });
    }

    let totalBerhasil = 0;
    if (dataValid.length > 0) {
      const { error } = await supabase.from("produk").insert(dataValid);
      if (error) {
        return {
          sukses: false,
          pesan: `Gagal menyimpan data massal ke database: ${error.message}`,
        };
      }
      totalBerhasil = dataValid.length;
    }

    await catatAuditLog({
      adminEmail: user.email,
      aksi: "IMPOR_CSV",
      rincian: `Berhasil mengimpor ${totalBerhasil} produk (${rincianError.length} baris gagal)`,
      targetId: "produk_bulk",
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return {
      sukses: true,
      totalBerhasil,
      totalGagal: rincianError.length,
      rincianError,
      pesan: `Impor selesai: ${totalBerhasil} data berhasil ditambahkan, ${rincianError.length} data gagal.`,
    };
  } catch (err) {
    return {
      sukses: false,
      pesan: `Terjadi galat saat memproses berkas CSV: ${err.message}`,
    };
  }
}

