import { createServerClient } from "@/lib/supabase/server";

let logMemori = [
  {
    id: "log-1",
    admin_email: "admin@petskarta.com",
    aksi: "UPDATE_STATUS",
    rincian: "Memperbarui banner operasional mudik Lebaran",
    target_id: "pengaturan",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "log-2",
    admin_email: "admin@petskarta.com",
    aksi: "CREATE_PRODUK",
    rincian: "Menambahkan produk baru 'Holland Lop Solid Tortoise Baby'",
    target_id: "produk-10",
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

// US-45: Audit Trail Aktivitas Admin
export async function catatAuditLog({ adminEmail, aksi, rincian, targetId }) {
  const entri = {
    id: `log-${Date.now()}`,
    admin_email: adminEmail || "admin@petskarta.com",
    aksi: String(aksi || "AKSI").toUpperCase(),
    rincian: String(rincian || "-"),
    target_id: String(targetId || "-"),
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createServerClient();
    await supabase.from("audit_logs").insert([entri]);
  } catch {
    // Abaikan kegagalan database
  }

  logMemori.unshift(entri);
  if (logMemori.length > 100) {
    logMemori = logMemori.slice(0, 100);
  }

  return { sukses: true };
}

export async function ambilRiwayatAuditLog() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data && data.length > 0) {
      return data;
    }
  } catch {
    // Fallback
  }

  return logMemori.slice(0, 50);
}

