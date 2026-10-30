"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { useFavorit } from "@/context/FavoritContext";

export default function KatalogInteraktif({
  daftarProduk = [],
  urutAktif = "terbaru",
  halamanAktif = 1,
  totalHalaman = 1,
  totalData = 0,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isFavorit, totalFavorit, sudahDimuat } = useFavorit();

  const [kataKunci, setKataKunci] = useState("");
  const [kategoriDipilih, setKategoriDipilih] = useState("Semua");
  const [hanyaFavorit, setHanyaFavorit] = useState(false);

  // Dapatkan daftar kategori unik dari data produk
  const daftarKategori = useMemo(() => {
    const unik = Array.from(
      new Set(daftarProduk.map((p) => p.kategori).filter(Boolean))
    );
    return ["Semua", ...unik];
  }, [daftarProduk]);

  // Saring produk berdasarkan kategori, kata kunci, dan filter favorit (US-11 & US-24)
  const hasilFilter = useMemo(() => {
    const query = kataKunci.toLowerCase().trim();

    return daftarProduk.filter((produk) => {
      if (hanyaFavorit && sudahDimuat && !isFavorit(produk.id)) {
        return false;
      }

      const cocokKategori =
        kategoriDipilih === "Semua" || produk.kategori === kategoriDipilih;

      const cocokKataKunci =
        !query ||
        produk.nama?.toLowerCase().includes(query) ||
        produk.kategori?.toLowerCase().includes(query) ||
        produk.deskripsi?.toLowerCase().includes(query);

      return cocokKategori && cocokKataKunci;
    });
  }, [daftarProduk, kategoriDipilih, kataKunci, hanyaFavorit, isFavorit, sudahDimuat]);

  // Handler pengurutan server (US-15)
  const handleGantiUrutan = (opsi) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (opsi === "terbaru") {
      params.delete("urut");
    } else {
      params.set("urut", opsi);
    }
    params.set("halaman", "1");
    const queryStr = params.toString();
    router.push(queryStr ? `/?${queryStr}` : "/");
  };

  // Handler paginasi server (US-16)
  const handleGantiHalaman = (nomorHalaman) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (nomorHalaman <= 1) {
      params.delete("halaman");
    } else {
      params.set("halaman", nomorHalaman.toString());
    }
    const queryStr = params.toString();
    router.push(queryStr ? `/?${queryStr}` : "/");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Kolom Pencarian */}
      <div className="relative">
        <input
          type="search"
          value={kataKunci}
          onChange={(e) => setKataKunci(e.target.value)}
          placeholder="Cari kelinci hias, hotel, grooming, atau scabies healer..."
          className="w-full rounded-xl border border-garis bg-latar px-4 py-3 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
        {kataKunci && (
          <button
            type="button"
            onClick={() => setKataKunci("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-teks-lembut hover:text-teks"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Filter Kategori & Opsi Pengurutan (US-11 & US-15) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Pilihan Kategori */}
        <div className="flex flex-wrap gap-2">
          {daftarKategori.map((kategori) => {
            const aktif = !hanyaFavorit && kategoriDipilih === kategori;
            return (
              <button
                key={kategori}
                type="button"
                onClick={() => {
                  setHanyaFavorit(false);
                  setKategoriDipilih(kategori);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  aktif
                    ? "bg-utama text-white"
                    : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
                }`}
              >
                {kategori}
              </button>
            );
          })}

          {/* Tab Filter Favorit (US-24) */}
          <button
            type="button"
            onClick={() => {
              setHanyaFavorit((prev) => !prev);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              hanyaFavorit
                ? "bg-bahaya text-white"
                : "border border-bahaya/40 bg-permukaan text-bahaya hover:bg-bahaya/10"
            }`}
            title="Tampilkan hanya item yang ditandai favorit"
          >
            <span>❤️</span>
            <span>Favorit Saya {totalFavorit > 0 ? `(${totalFavorit})` : ""}</span>
          </button>
        </div>

        {/* Pilihan Urutan (US-15) */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="pilih-urutan"
            className="text-xs font-semibold text-teks-lembut whitespace-nowrap"
          >
            Urutkan:
          </label>
          <select
            id="pilih-urutan"
            value={urutAktif}
            onChange={(e) => handleGantiUrutan(e.target.value)}
            className="rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks focus:border-utama focus:outline-none"
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Harga: Termurah</option>
            <option value="termahal">Harga: Termahal</option>
          </select>
        </div>
      </div>

      {/* Daftar Produk / Hasil Filter */}
      {hasilFilter.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-10 text-center">
          <p className="text-base font-medium text-teks-lembut">
            Tidak ada produk atau layanan yang cocok dengan kriteria pencarian.
          </p>
          {(kataKunci || kategoriDipilih !== "Semua") && (
            <button
              type="button"
              onClick={() => {
                setKataKunci("");
                setKategoriDipilih("Semua");
              }}
              className="mt-3 text-sm font-semibold text-utama underline underline-offset-4"
            >
              Reset filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {hasilFilter.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}

      {/* Kontrol Paginasi Server (US-16) */}
      {totalHalaman > 1 && (
        <nav
          aria-label="Navigasi Halaman"
          className="flex flex-wrap items-center justify-between gap-4 border-t border-garis pt-6"
        >
          <p className="text-xs font-medium text-teks-lembut">
            Menampilkan halaman{" "}
            <span className="font-semibold text-teks">{halamanAktif}</span> dari{" "}
            <span className="font-semibold text-teks">{totalHalaman}</span> ({totalData} total item)
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={halamanAktif <= 1}
              onClick={() => handleGantiHalaman(halamanAktif - 1)}
              className="rounded-lg border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-teks transition hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-40"
            >
              &larr; Sebelumnya
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((nomor) => (
                <button
                  key={nomor}
                  type="button"
                  onClick={() => handleGantiHalaman(nomor)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                    halamanAktif === nomor
                      ? "bg-utama text-white"
                      : "border border-garis bg-permukaan text-teks hover:border-utama hover:text-utama"
                  }`}
                >
                  {nomor}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={halamanAktif >= totalHalaman}
              onClick={() => handleGantiHalaman(halamanAktif + 1)}
              className="rounded-lg border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-teks transition hover:border-utama hover:text-utama disabled:cursor-not-allowed disabled:opacity-40"
            >
              Selanjutnya &rarr;
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
