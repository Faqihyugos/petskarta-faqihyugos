import NavAdmin from "@/components/NavAdmin";
import FormSistemWhiteLabel from "@/components/FormSistemWhiteLabel";
import { ambilPengaturan } from "@/lib/pengaturan";
import { createAuthServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sistem White-Label & Tema - Admin",
};

export default async function HalamanAdminSistem() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const pengaturan = await ambilPengaturan();

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Sistem White-Label &amp; Manajemen Tema Multi-Bisnis
        </h1>
        <p className="text-sm text-teks-lembut">
          Sesuaikan identitas nama bisnis, slogan, logo, dan palet warna tema secara fleksibel agar platform siap digunakan untuk berbagai industri usaha.
        </p>
      </div>

      <FormSistemWhiteLabel pengaturan={pengaturan} />
    </div>
  );
}

