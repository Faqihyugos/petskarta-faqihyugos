import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";
import { bersihkanDeskripsi, cekKetersediaan } from "@/lib/ketersediaan";
import TombolWhatsApp from "@/components/TombolWhatsApp";

export const metadata = {
  title: "Komparasi Spesifikasi Kelinci & Layanan - Petskarta",
  description:
    "Bandingkan dua ras kelinci hias atau paket layanan Bunny Hotel Petskarta secara berdampingan untuk memilih yang paling sesuai.",
};

export default async function HalamanKomparasi({ searchParams }) {
  const params = await searchParams;
  const id1 = params?.item1;
  const id2 = params?.item2;

  let item1 = null;
  let item2 = null;
  let errorItem1 = false;
  let errorItem2 = false;

  const supabase = createServerClient();

  if (id1) {
    const { data } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id1)
      .maybeSingle();
    if (data) {
      item1 = data;
    } else {
      errorItem1 = true;
    }
  }

  if (id2) {
    const { data } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id2)
      .maybeSingle();
    if (data) {
      item2 = data;
    } else {
      errorItem2 = true;
    }
  }

  const itemsValid = [item1, item2].filter(Boolean);

  return (
    <div className="flex flex-col py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          &larr; Kembali ke Katalog
        </Link>
      </div>

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-utama/30 bg-utama/10 px-3 py-1 text-xs font-bold text-utama">
          <span>⚖️</span>
          <span>Fitur Komparasi Berdampingan</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Bandingkan Kelinci &amp; Layanan
        </h1>
        <p className="mt-2 text-base text-teks-lembut">
          Lihat perbandingan spesifikasi, fasilitas, tarif, dan karakter dua pilihan Anda secara berdampingan.
        </p>
      </header>

      {/* Penanganan item tidak ditemukan */}
      {(errorItem1 || errorItem2) && (
        <div className="mb-8 rounded-2xl border border-bahaya/30 bg-bahaya/10 p-4 text-sm text-bahaya">
          ⚠️ <strong>Catatan:</strong> Salah satu item yang Anda pilih sudah tidak ada atau telah dihapus dari database katalog.
        </div>
      )}

      {itemsValid.length < 2 ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-10 text-center">
          <span className="text-4xl">⚖️</span>
          <h2 className="mt-3 text-lg font-bold text-teks">
            Perbandingan Membutuhkan 2 Item
          </h2>
          <p className="mt-1 text-sm text-teks-lembut max-w-md mx-auto">
            Silakan pilih 2 kelinci hias atau paket layanan dari katalog beranda dengan menekan tombol &ldquo;Bandingkan&rdquo;.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-utama px-5 py-2.5 text-sm font-bold text-white hover:bg-utama-gelap transition-colors"
            >
              Pilih dari Katalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-garis bg-latar shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-permukaan border-b border-garis">
              <tr>
                <th className="p-4 w-1/4 text-xs font-bold uppercase tracking-wider text-teks-lembut">
                  Kriteria
                </th>
                <th className="p-4 w-3/8 text-base font-extrabold text-teks">
                  {item1.nama}
                </th>
                <th className="p-4 w-3/8 text-base font-extrabold text-teks">
                  {item2.nama}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {/* Foto Produk */}
              <tr>
                <td className="p-4 font-semibold text-teks-lembut bg-permukaan/30">
                  Foto
                </td>
                <td className="p-4">
                  <div className="aspect-square max-w-[200px] overflow-hidden rounded-xl bg-permukaan border border-garis">
                    <img
                      src={item1.foto_url?.split(/[\n,]+/)[0]?.trim() || "/produk/kelinci.svg"}
                      alt={item1.nama}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-4">
                  <div className="aspect-square max-w-[200px] overflow-hidden rounded-xl bg-permukaan border border-garis">
                    <img
                      src={item2.foto_url?.split(/[\n,]+/)[0]?.trim() || "/produk/kelinci.svg"}
                      alt={item2.nama}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
              </tr>

              {/* Kategori */}
              <tr>
                <td className="p-4 font-semibold text-teks-lembut bg-permukaan/30">
                  Kategori
                </td>
                <td className="p-4 font-bold text-teks">{item1.kategori}</td>
                <td className="p-4 font-bold text-teks">{item2.kategori}</td>
              </tr>

              {/* Harga */}
              <tr>
                <td className="p-4 font-semibold text-teks-lembut bg-permukaan/30">
                  Tarif / Harga
                </td>
                <td className="p-4">
                  <span className="rounded-md bg-harga-latar px-2.5 py-1 text-base font-extrabold text-harga">
                    {formatRupiah(item1.harga)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="rounded-md bg-harga-latar px-2.5 py-1 text-base font-extrabold text-harga">
                    {formatRupiah(item2.harga)}
                  </span>
                </td>
              </tr>

              {/* Status Ketersediaan */}
              <tr>
                <td className="p-4 font-semibold text-teks-lembut bg-permukaan/30">
                  Status
                </td>
                <td className="p-4">
                  {cekKetersediaan(item1).tersedia ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-utama">
                      ● Siap / Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-bahaya">
                      ● {cekKetersediaan(item1).label}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {cekKetersediaan(item2).tersedia ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-utama">
                      ● Siap / Tersedia
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-bahaya">
                      ● {cekKetersediaan(item2).label}
                    </span>
                  )}
                </td>
              </tr>

              {/* Deskripsi & Spesifikasi */}
              <tr>
                <td className="p-4 font-semibold text-teks-lembut bg-permukaan/30">
                  Spesifikasi &amp; Fasilitas
                </td>
                <td className="p-4 leading-relaxed text-teks-lembut align-top">
                  {bersihkanDeskripsi(item1.deskripsi)}
                </td>
                <td className="p-4 leading-relaxed text-teks-lembut align-top">
                  {bersihkanDeskripsi(item2.deskripsi)}
                </td>
              </tr>

              {/* Aksi Pesan */}
              <tr>
                <td className="p-4 font-semibold text-teks-lembut bg-permukaan/30">
                  Aksi
                </td>
                <td className="p-4 align-top">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/produk/${item1.id}`}
                      className="text-xs font-semibold text-utama underline"
                    >
                      Buka Rincian Lengkap &rarr;
                    </Link>
                    <TombolWhatsApp produk={item1} />
                  </div>
                </td>
                <td className="p-4 align-top">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/produk/${item2.id}`}
                      className="text-xs font-semibold text-utama underline"
                    >
                      Buka Rincian Lengkap &rarr;
                    </Link>
                    <TombolWhatsApp produk={item2} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

