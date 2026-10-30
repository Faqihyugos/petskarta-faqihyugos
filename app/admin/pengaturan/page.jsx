import NavAdmin from "@/components/NavAdmin";
import FormPengaturanAdmin from "@/components/FormPengaturanAdmin";
import { ambilPengaturan } from "@/lib/pengaturan";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengaturan Cabang & Banner - Admin Petskarta",
};

export default async function HalamanAdminPengaturan() {
  const supabase = createServerClient();
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
          Pengaturan Toko, Cabang &amp; Banner
        </h1>
        <p className="text-sm text-teks-lembut">
          Kelola banner pengumuman musim liburan dan kontak WhatsApp resmi multi-cabang tanpa menyentuh kode.
        </p>
      </div>

      <FormPengaturanAdmin pengaturan={pengaturan} />
    </div>
  );
}

