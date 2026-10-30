import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import KartuProduk from "@/components/KartuProduk";
import GaleriProduk from "@/components/GaleriProduk";
import TombolTambahKeranjang from "@/components/TombolTambahKeranjang";
import TombolBagikan from "@/components/TombolBagikan";
import TombolFavorit from "@/components/TombolFavorit";
import TombolKomparasi from "@/components/TombolKomparasi";
import TerakhirDilihat, { RekamItemDilihat } from "@/components/TerakhirDilihat";
import { createServerClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";
import { cekKetersediaan, bersihkanDeskripsi } from "@/lib/ketersediaan";
import { ekstrakPromoDanBadge } from "@/lib/promo";

// US-26: Optimasi Metadata SEO & Open Graph Dinamis
export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!id) return { title: "Produk Tidak Ditemukan - Petskarta" };

  try {
    const supabase = createServerClient();
    const { data: produk } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!produk) {
      return {
        title: "Produk Tidak Ditemukan - Petskarta",
        description: "Halaman produk atau layanan Petskarta tidak ditemukan.",
      };
    }

    const deskripsiBersih = bersihkanDeskripsi(produk.deskripsi);
    const ringkasan =
      deskripsiBersih && deskripsiBersih.length > 155
        ? `${deskripsiBersih.substring(0, 152)}...`
        : deskripsiBersih || `Pesan atau adopsi ${produk.nama} resmi di Petskarta Jakarta.`;

    const thumbnail =
      produk.foto_url?.split(/[\n,]+/)[0]?.trim() || "/produk/kelinci.svg";

    return {
      title: `${produk.nama} - Petskarta Jakarta`,
      description: ringkasan,
      openGraph: {
        title: `${produk.nama} | Petskarta Official`,
        description: ringkasan,
        type: "article",
        images: [
          {
            url: thumbnail,
            alt: produk.nama,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: produk.nama,
        description: ringkasan,
        images: [thumbnail],
      },
    };
  } catch {
    return {
      title: "Detail Layanan & Kelinci - Petskarta",
    };
  }
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const supabase = createServerClient();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // US-32: Sembunyikan item nonaktif/arsip dari halaman publik
  if (error || !produk || produk.deskripsi?.includes("[STATUS:ARSIP]")) {
    notFound();
  }

  const { tersedia, label } = cekKetersediaan(produk);
  const { hargaCoret, diskonPersen, badges } = ekstrakPromoDanBadge(produk);

  // US-17: Ambil rekomendasi produk/layanan terkait dari database Supabase (tanpa item saat ini)
  let rekomendasi = [];
  try {
    const { data: recData } = await supabase
      .from("produk")
      .select("*")
      .neq("id", id)
      .limit(3);

    rekomendasi = recData || [];
  } catch {
    rekomendasi = [];
  }

  return (
    <div className="flex flex-col py-8 md:py-12">
      <article className="grid gap-8 md:grid-cols-2">
        {/* US-18: Galeri Multi-Foto Interaktif */}
        <GaleriProduk fotoUrl={produk.foto_url} nama={produk.nama} />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
            >
              &larr; Kembali ke katalog
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {/* US-37: Tombol Komparasi */}
              <TombolKomparasi produk={produk} />
              {/* US-23: Tombol Bagikan */}
              <TombolBagikan
                judul={produk.nama}
                deskripsi={bersihkanDeskripsi(produk.deskripsi)}
              />
              {/* US-24: Tombol Favorit Wishlist */}
              <TombolFavorit id={produk.id} nama={produk.nama} ukuran="sedang" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-teks-lembut">
              {produk.kategori}
            </span>

            {/* US-19: Label Status Ketersediaan */}
            {!tersedia && (
              <span className="rounded-md bg-bahaya px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                {label}
              </span>
            )}

            {/* US-20: Badge Kepercayaan & Promo */}
            {badges.map((b, idx) => (
              <span
                key={idx}
                className="rounded-md bg-utama/15 px-2.5 py-0.5 text-xs font-bold text-utama"
              >
                {b}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {produk.nama}
          </h1>

          {/* US-20: Harga dengan Dukungan Harga Coret / Diskon Promo */}
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-2xl font-bold text-harga">
              {formatRupiah(produk.harga)}
            </p>
            {hargaCoret && hargaCoret > produk.harga && (
              <span className="text-base text-teks-lembut line-through">
                {formatRupiah(hargaCoret)}
              </span>
            )}
            {diskonPersen > 0 && (
              <span className="rounded-md bg-bahaya/10 px-2.5 py-1 text-xs font-bold text-bahaya">
                Hemat {diskonPersen}%
              </span>
            )}
          </div>

          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {bersihkanDeskripsi(produk.deskripsi)}
          </p>

          {/* US-21: Tombol Tambah ke Keranjang Belanja */}
          {tersedia && (
            <div className="border-t border-b border-garis py-3 my-1">
              <TombolTambahKeranjang produk={produk} varian="detail" />
            </div>
          )}

          {/* US-12 & US-19: Modul Pemesanan / Daftar Tunggu WhatsApp */}
          <TombolWhatsApp produk={produk} />
        </div>
      </article>

      {/* US-17: Rekomendasi Perlengkapan Starter Kit / Layanan Terkait */}
      {rekomendasi.length > 0 && (
        <section
          aria-labelledby="judul-rekomendasi"
          className="mt-12 border-t border-garis pt-10"
        >
          <div className="mb-6">
            <h2 id="judul-rekomendasi" className="text-xl font-bold tracking-tight">
              Rekomendasi Perlengkapan & Layanan Terkait
            </h2>
            <p className="mt-1 text-sm text-teks-lembut">
              Paket starter kit, nutrisi timothy, atau perawatan pelengkap untuk hewan kesayangan Anda.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {rekomendasi.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
      {/* US-36: Histori Terakhir Dilihat */}
      <RekamItemDilihat item={produk} />
      <TerakhirDilihat abaikanId={produk.id} />
    </div>
  );
}
