import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { dapatkanKategoriDariSlug } from "@/lib/kategori";
import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const katInfo = dapatkanKategoriDariSlug(slug);

  if (!katInfo) {
    return { title: "Kategori Tidak Ditemukan - Petskarta" };
  }

  return {
    title: `${katInfo.judul} - ${toko.nama}`,
    description: katInfo.deskripsi,
    openGraph: {
      title: `${katInfo.judul} | ${toko.nama}`,
      description: katInfo.deskripsi,
      type: "website",
    },
  };
}

export default async function HalamanKategori({ params }) {
  const { slug } = await params;
  const katInfo = dapatkanKategoriDariSlug(slug);

  if (!katInfo) {
    notFound();
  }

  const supabase = createServerClient();
  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .ilike("kategori", `%${katInfo.nama}%`)
    .order("id", { ascending: false });

  const produkAktif = (daftarProduk || []).filter(
    (p) => !p.deskripsi?.includes("[STATUS:ARSIP]")
  );

  return (
    <div className="flex flex-col py-8 sm:py-12">
      {/* Breadcrumb / Navigasi */}
      <div className="mb-6 flex items-center gap-2 text-xs text-teks-lembut">
        <Link href="/" className="hover:text-utama underline underline-offset-4">
          Katalog Utama
        </Link>
        <span>/</span>
        <span className="font-semibold text-teks">Kategori {katInfo.nama}</span>
      </div>

      {/* Header Kategori */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-utama/30 bg-utama/10 px-3 py-1 text-xs font-bold text-utama">
          <span>{katInfo.icon}</span>
          <span>Kategori Resmi Petskarta</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {katInfo.judul}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-teks-lembut leading-relaxed">
          {katInfo.deskripsi}
        </p>
      </header>

      {/* Daftar Produk Kategori */}
      {error ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-6 text-center text-sm text-bahaya">
          Gagal memuat produk kategori: {error.message}
        </div>
      ) : produkAktif.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-10 text-center">
          <p className="text-base font-semibold text-teks">
            Belum ada item untuk kategori {katInfo.nama}.
          </p>
          <p className="mt-1 text-xs text-teks-lembut">
            Silakan hubungi admin cabang kami untuk memesan kebutuhan khusus.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-utama px-4 py-2 text-xs font-bold text-white hover:bg-utama-gelap"
            >
              Lihat Seluruh Katalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkAktif.map((item) => (
            <KartuProduk key={item.id} produk={item} />
          ))}
        </div>
      )}
    </div>
  );
}

