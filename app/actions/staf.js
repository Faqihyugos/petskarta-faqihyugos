"use server";

import { createAuthServerClient } from "@/lib/supabase/server";
import { tambahStafBaru, toggleStatusStaf } from "@/lib/staf-admin";
import { catatAuditLog } from "@/lib/audit-log";
import { revalidatePath } from "next/cache";

export async function tambahStafAction(prevState, formData) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { sukses: false, pesan: "Akses ditolak: Hanya admin yang diizinkan." };
  }

  const email = formData.get("email")?.toString().trim();
  const cabang = formData.get("cabang")?.toString().trim();
  const role = formData.get("role")?.toString().trim();

  try {
    await tambahStafBaru({ email, cabang, role });
    await catatAuditLog({
      adminEmail: user.email,
      aksi: "TAMBAH_STAF",
      rincian: `Mendaftarkan staf admin baru: ${email} (${cabang})`,
      targetId: email,
    });
    revalidatePath("/admin/staf");
    return { sukses: true, pesan: `Akun staf ${email} berhasil didaftarkan.` };
  } catch (err) {
    return { sukses: false, pesan: err.message };
  }
}

export async function toggleStafAction(id) {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { sukses: false, pesan: "Akses ditolak." };
  }

  try {
    await toggleStatusStaf(id, user.email);
    await catatAuditLog({
      adminEmail: user.email,
      aksi: "TOGGLE_STAF",
      rincian: `Mengubah status aktif/nonaktif staf id: ${id}`,
      targetId: id,
    });
    revalidatePath("/admin/staf");
    return { sukses: true };
  } catch (err) {
    return { sukses: false, pesan: err.message };
  }
}

