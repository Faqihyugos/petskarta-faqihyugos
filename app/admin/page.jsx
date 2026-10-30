import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createAuthServerClient, createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = await createAuthServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      // Fallback ke server client bila sesi auth ada kendala
      const fallbackClient = createServerClient();
      const fallbackResult = await fallbackClient
        .from("produk")
        .select("*")
        .order("id", { ascending: true });

      if (fallbackResult.error) {
        pesanError = fallbackResult.error.message;
      } else {
        daftarProduk = fallbackResult.data || [];
      }
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {pesanError && (
        <div className="rounded-lg border border-garis bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat produk dari database: {pesanError}
        </div>
      )}

      <TabelProduk daftarProduk={daftarProduk} />
    </div>
  );
}
