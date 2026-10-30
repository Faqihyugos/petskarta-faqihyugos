"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogInteraktif({ daftarProduk = [] }) {
  const [kataKunci, setKataKunci] = useState("");
  const [kategoriDipilih, setKategoriDipilih] = useState("Semua");

  // Dapatkan daftar kategori unik dari data produk
  const daftarKategori = useMemo(() => {
    const unik = Array.from(
      new Set(daftarProduk.map((p) => p.kategori).filter(Boolean))
    );
    return ["Semua", ...unik];
  }, [daftarProduk]);

  // Saring produk berdasarkan kategori dan kata kunci
  const hasilFilter = useMemo(() => {
    const query = kataKunci.toLowerCase().trim();

    return daftarProduk.filter((produk) => {
      const cocokKategori =
        kategoriDipilih === "Semua" || produk.kategori === kategoriDipilih;

      const cocokKataKunci =
        !query ||
        produk.nama?.toLowerCase().includes(query) ||
        produk.kategori?.toLowerCase().includes(query) ||
        produk.deskripsi?.toLowerCase().includes(query);

      return cocokKategori && cocokKataKunci;
    });
  }, [daftarProduk, kategoriDipilih, kataKunci]);

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

      {/* Filter Kategori */}
      <div className="flex flex-wrap gap-2">
        {daftarKategori.map((kategori) => {
          const aktif = kategoriDipilih === kategori;
          return (
            <button
              key={kategori}
              type="button"
              onClick={() => setKategoriDipilih(kategori)}
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
    </div>
  );
}

