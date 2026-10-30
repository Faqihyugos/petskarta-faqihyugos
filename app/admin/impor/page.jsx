import NavAdmin from "@/components/NavAdmin";
import FormImporCSV from "@/components/FormImporCSV";
import { createAuthServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Impor Massal CSV - Admin Petskarta",
};

export default async function HalamanAdminImpor() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Impor Data Massal Kelinci &amp; Produk dari CSV
        </h1>
        <p className="text-sm text-teks-lembut">
          Unggah puluhan data kelinci hias baru dari breeder mitra atau tarif kamar hotel secara massal dalam satu file spreadsheet CSV.
        </p>
      </div>

      <FormImporCSV />
    </div>
  );
}

