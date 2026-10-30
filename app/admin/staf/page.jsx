import NavAdmin from "@/components/NavAdmin";
import TabelStafAdmin from "@/components/TabelStafAdmin";
import { ambilDaftarStaf } from "@/lib/staf-admin";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manajemen Staf Admin Multi-Cabang - Petskarta",
};

export default async function HalamanAdminStaf() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const daftarStaf = await ambilDaftarStaf();

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Manajemen Staf Admin Multi-Cabang
        </h1>
        <p className="text-sm text-teks-lembut">
          Atur akses pengelola cabang Pondok Pinang dan Jatinegara. Anda dapat mendaftarkan staf baru dan menonaktifkan akun staf yang sudah tidak bertugas.
        </p>
      </div>

      <TabelStafAdmin daftarStaf={daftarStaf} emailUserSaatIni={user.email} />
    </div>
  );
}

