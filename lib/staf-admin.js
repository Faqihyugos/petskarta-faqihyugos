import { createServerClient } from "@/lib/supabase/server";

let stafTersimpan = [
  {
    id: "staf-1",
    email: "admin@petskarta.com",
    role: "Super Admin",
    cabang: "Semua Cabang (Pondok Pinang & Jatinegara)",
    aktif: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 180).toISOString(),
  },
  {
    id: "staf-2",
    email: "jatinegara@petskarta.com",
    role: "Admin Cabang",
    cabang: "Cabang Jatinegara (Hotel & Scabies)",
    aktif: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
  },
];

export async function ambilDaftarStaf() {
  return [...stafTersimpan];
}

export async function tambahStafBaru({ email, cabang, role }) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Email tidak valid.");
  }

  const ada = stafTersimpan.some((s) => s.email === cleanEmail);
  if (ada) {
    throw new Error("Staf dengan email tersebut sudah terdaftar.");
  }

  const stafBaru = {
    id: `staf-${Date.now()}`,
    email: cleanEmail,
    role: role || "Admin Cabang",
    cabang: cabang || "Cabang Pondok Pinang",
    aktif: true,
    created_at: new Date().toISOString(),
  };

  stafTersimpan.push(stafBaru);
  return { sukses: true };
}

export async function toggleStatusStaf(id, emailAdminSaatIni) {
  const target = stafTersimpan.find((s) => s.id === id);
  if (!target) {
    throw new Error("Staf tidak ditemukan.");
  }

  // US-44: Admin tidak dapat menonaktifkan akunnya sendiri
  if (target.email === emailAdminSaatIni?.toLowerCase()) {
    throw new Error("Anda tidak dapat menonaktifkan akun Anda sendiri demi keamanan.");
  }

  stafTersimpan = stafTersimpan.map((s) =>
    s.id === id ? { ...s, aktif: !s.aktif } : s
  );

  return { sukses: true };
}

