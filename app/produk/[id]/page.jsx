import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import KartuProduk from "@/components/KartuProduk";
import { createServerClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";

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

  if (error || !produk) {
    notFound();
  }

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
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            &larr; Kembali ke katalog
          </Link>
          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            {produk.nama}
          </h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">
            {produk.deskripsi}
          </p>
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
    </div>
  );
}
