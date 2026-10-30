"use server";

import { createAuthServerClient } from "@/lib/supabase/server";
import {
  simpanKategoriBaru,
  perbaruiNamaKategori,
  hapusKategoriDb,
} from "@/lib/manajemen-kategori";
import { catatAuditLog } from "@/lib/audit-log";
import { revalidatePath } from "next/cache";

export async function tambahKategoriAction(prevState, formData) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { sukses: false, pesan: "Akses ditolak: Hanya admin." };

  const nama = formData.get("nama")?.toString().trim();
  try {
    await simpanKategoriBaru(nama);
    await catatAuditLog({
      adminEmail: user.email,
      aksi: "TAMBAH_KATEGORI",
      rincian: `Menambahkan kategori baru: ${nama}`,
      targetId: nama,
    });
    revalidatePath("/admin/kategori");
    return { sukses: true, pesan: "Kategori baru berhasil ditambahkan." };
  } catch (err) {
    return { sukses: false, pesan: err.message };
  }
}

export async function ubahKategoriAction(namaLama, namaBaru) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { sukses: false, pesan: "Akses ditolak." };

  try {
    await perbaruiNamaKategori(namaLama, namaBaru);
    await catatAuditLog({
      adminEmail: user.email,
      aksi: "UBAH_KATEGORI",
      rincian: `Mengubah kategori "${namaLama}" menjadi "${namaBaru}"`,
      targetId: namaBaru,
    });
    revalidatePath("/admin/kategori");
    return { sukses: true };
  } catch (err) {
    return { sukses: false, pesan: err.message };
  }
}

export async function hapusKategoriAction(nama) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { sukses: false, pesan: "Akses ditolak." };

  try {
    await hapusKategoriDb(nama);
    await catatAuditLog({
      adminEmail: user.email,
      aksi: "HAPUS_KATEGORI",
      rincian: `Menghapus kategori: ${nama}`,
      targetId: nama,
    });
    revalidatePath("/admin/kategori");
    return { sukses: true };
  } catch (err) {
    return { sukses: false, pesan: err.message };
  }
}

