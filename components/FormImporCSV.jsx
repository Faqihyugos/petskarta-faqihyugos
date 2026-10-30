"use client";

import { useActionState } from "react";
import { imporProdukCSVAction } from "@/app/actions/impor";

export default function FormImporCSV() {
  const [state, formAction, isPending] = useActionState(imporProdukCSVAction, null);

  const contohFormatCSV = `Nama,Harga,Kategori,Deskripsi,FotoURL
Holland Lop Tortoise Baby,850000,Kelinci Hias,Kelinci hias sehat dan aktif.,/produk/holland-lop.svg
Netherland Dwarf Smoke Pearl,900000,Kelinci Hias,Pedigree bersertifikat.,/produk/netherland-dwarf.svg
Bunny Hotel Standar,50000,Bunny Hotel,Fasilitas kipas angin dan free timothy.,/produk/bunny-hotel.svg`;

  return (
    <div className="flex flex-col gap-8">
      {/* Petunjuk & Contoh Format CSV */}
      <div className="rounded-2xl border border-garis bg-permukaan/60 p-5 text-xs">
        <h3 className="font-bold text-teks mb-1">Panduan Format File CSV:</h3>
        <p className="text-teks-lembut mb-3">
          Susun berkas CSV Anda dengan baris pertama berupa nama kolom (header) sebagai berikut:
        </p>
        <pre className="overflow-x-auto rounded-xl bg-latar p-3 border border-garis font-mono text-[11px] text-teks">
          {contohFormatCSV}
        </pre>
      </div>

      {/* Form Upload */}
      <form action={formAction} className="rounded-2xl border border-garis bg-latar p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-teks">
            Pilih Berkas CSV (.csv)
          </label>
          <input
            type="file"
            name="berkas_csv"
            accept=".csv,text/csv"
            required
            className="text-xs text-teks file:mr-3 file:rounded-xl file:border-0 file:bg-utama file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-white hover:file:bg-utama-gelap cursor-pointer"
          />
        </div>

        {state && (
          <div
            className={`rounded-2xl p-4 text-xs ${
              state.sukses
                ? "bg-utama/15 text-utama border border-utama/30"
                : "bg-bahaya/15 text-bahaya border border-bahaya/30"
            }`}
          >
            <p className="font-bold">{state.pesan}</p>

            {state.rincianError && state.rincianError.length > 0 && (
              <div className="mt-3 border-t border-bahaya/30 pt-2 text-bahaya">
                <p className="font-bold mb-1">Rincian Baris yang Gagal:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {state.rincianError.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-utama px-6 py-2.5 text-xs font-bold text-white hover:bg-utama-gelap disabled:opacity-50 transition-colors"
          >
            {isPending ? "Sedang Mengimpor Data..." : "Mulai Impor Massal"}
          </button>
        </div>
      </form>
    </div>
  );
}

