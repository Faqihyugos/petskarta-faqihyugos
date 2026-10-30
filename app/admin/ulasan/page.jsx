import NavAdmin from "@/components/NavAdmin";
import TabelUlasanAdmin from "@/components/TabelUlasanAdmin";
import { ambilSemuaUlasanAdmin } from "@/lib/ulasan";
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Moderasi Ulasan & Testimoni - Admin Petskarta",
};

export default async function HalamanAdminUlasan() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const daftarUlasan = await ambilSemuaUlasanAdmin();

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Moderasi Testimoni &amp; Ulasan
        </h1>
        <p className="text-sm text-teks-lembut">
          Tinjau ulasan masuk dari pengunjung web dan Google Reviews. Sembunyikan atau hapus ulasan yang tidak pantas agar tidak tampil di halaman depan.
        </p>
      </div>

      <TabelUlasanAdmin daftarUlasan={daftarUlasan} />
    </div>
  );
}

