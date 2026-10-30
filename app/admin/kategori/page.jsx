import NavAdmin from "@/components/NavAdmin";
import TabelKategoriAdmin from "@/components/TabelKategoriAdmin";
import { ambilDaftarKategori } from "@/lib/manajemen-kategori";
import { createAuthServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manajemen Kategori - Admin Petskarta",
};

export default async function HalamanAdminKategori() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const daftarKategori = await ambilDaftarKategori();

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Manajemen Kategori Layanan &amp; Produk
        </h1>
        <p className="text-sm text-teks-lembut">
          Atur opsi kategori layanan seperti Bunny Hotel, Kelinci Hias, Grooming, atau tambah kategori baru.
        </p>
      </div>

      <TabelKategoriAdmin daftarKategori={daftarKategori} />
    </div>
  );
}

