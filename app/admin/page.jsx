import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import DashboardAnalitikAdmin from "@/components/DashboardAnalitikAdmin";
import { ambilRingkasanAnalitik } from "@/lib/analitik";
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
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      // Fallback ke server client bila sesi auth ada kendala
      const fallbackClient = createServerClient();
      const fallbackResult = await fallbackClient
        .from("produk")
        .select("*")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

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

  // US-30 & US-41: Analitik performa toko & klik booking
  const analitik = await ambilRingkasanAnalitik(daftarProduk);

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />

      {/* US-30 & US-41: Dashboard Analitik Ringkasan */}
      <DashboardAnalitikAdmin analitik={analitik} />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-garis">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Katalog Produk &amp; Layanan</h1>
          <p className="text-xs text-teks-lembut">Kelola stok kelinci, kamar hotel, dan paket perawatan.</p>
        </div>
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
