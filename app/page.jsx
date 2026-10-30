import Link from "next/link";
import KatalogInteraktif from "@/components/KatalogInteraktif";
import TerakhirDilihat from "@/components/TerakhirDilihat";
import TrustCenter from "@/components/TrustCenter";
import { ambilUlasanPublik } from "@/lib/ulasan";
import { ekstrakPrioritas } from "@/lib/prioritas";
import { createServerClient } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const urut = params?.urut || "terbaru";
  const halaman = Math.max(1, parseInt(params?.halaman || "1", 10));
  const pageSize = 6;
  const from = (halaman - 1) * pageSize;
  const to = from + pageSize - 1;

  let daftarProduk = null;
  let totalData = 0;
  let pesanError = null;

  try {
    const supabase = createServerClient();
    let kueri = supabase.from("produk").select("*", { count: "exact" });

    // Pengurutan server (US-15)
    if (urut === "termurah") {
      kueri = kueri.order("harga", { ascending: true });
    } else if (urut === "termahal") {
      kueri = kueri.order("harga", { ascending: false });
    } else {
      kueri = kueri
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });
    }

    // Paginasi server dengan range (US-16)
    kueri = kueri.range(from, to);

    const { data, count, error } = await kueri;

    if (error) {
      pesanError = error.message || "Gagal mengambil data produk dari database.";
    } else {
      // US-32 & US-47: Sembunyikan item arsip & urutkan prioritas katalog
      daftarProduk = (data || [])
        .filter((p) => !p.deskripsi?.includes("[STATUS:ARSIP]"))
        .sort((a, b) => {
          if (urut === "terbaru") {
            const pA = ekstrakPrioritas(a.deskripsi);
            const pB = ekstrakPrioritas(b.deskripsi);
            if (pB !== pA) return pB - pA;
          }
          return 0;
        });
      totalData = count || 0;
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat memuat data produk.";
  }

  const ulasanList = await ambilUlasanPublik();
  const totalHalaman = Math.max(1, Math.ceil(totalData / pageSize));

  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-utama/30 bg-utama/10 px-3 py-1 text-xs font-bold text-utama">
          <span>📍</span>
          <span>2 Cabang Resmi Aktif Beroperasi (Pondok Pinang &amp; Jatinegara)</span>
          <Link href="/cabang" className="ml-1 underline hover:text-utama-gelap">
            Lihat Direktori Cabang &rarr;
          </Link>
        </div>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        {pesanError ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-6 text-center">
            <p className="font-semibold text-bahaya">
              Gagal memuat katalog: {pesanError}
            </p>
            <p className="mt-2 text-sm text-teks-lembut">
              Silakan segarkan halaman atau coba lagi beberapa saat lagi.
            </p>
          </div>
        ) : !daftarProduk || daftarProduk.length === 0 ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-10 text-center">
            <p className="text-base font-medium text-teks-lembut">Belum ada produk</p>
          </div>
        ) : (
          <KatalogInteraktif
            daftarProduk={daftarProduk}
            urutAktif={urut}
            halamanAktif={halaman}
            totalHalaman={totalHalaman}
            totalData={totalData}
          />
        )}
      </section>

      {/* US-38: Trust Center & Google Reviews 5.0 */}
      <TrustCenter
        ulasanList={ulasanList}
        ratingGoogle={toko.ratingGoogle}
        totalGoogle={toko.totalUlasanGoogle}
      />

      {/* US-36: Histori Terakhir Dilihat di Beranda */}
      <TerakhirDilihat />
    </>
  );
}
