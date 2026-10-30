"use client";

import { useState, useMemo, useTransition } from "react";
import { formatRupiah, formatTanggal } from "@/lib/format";
import Tombol from "@/components/Tombol";
import { hapusProduk, toggleArsipProduk, ubahPrioritasProduk } from "@/app/admin/actions";
import { ekstrakPrioritas } from "@/lib/prioritas";

export default function TabelProduk({ daftarProduk = [] }) {
  const [kataKunci, setKataKunci] = useState("");
  const [isPending, startTransition] = useTransition();

  // US-33: Pencarian di panel admin
  const hasilFilter = useMemo(() => {
    const q = kataKunci.toLowerCase().trim();
    if (!q) return daftarProduk;
    return daftarProduk.filter(
      (p) =>
        p.nama?.toLowerCase().includes(q) ||
        p.kategori?.toLowerCase().includes(q) ||
        p.deskripsi?.toLowerCase().includes(q)
    );
  }, [daftarProduk, kataKunci]);

  const handleToggleArsip = (id) => {
    startTransition(async () => {
      await toggleArsipProduk(id);
    });
  };

  const handleUbahPrioritas = (id, delta) => {
    startTransition(async () => {
      await ubahPrioritasProduk(id, delta);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Bar Pencarian & Tombol Ekspor CSV (US-33 & US-35) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-60">
          <input
            type="search"
            value={kataKunci}
            onChange={(e) => {
              setKataKunci(e.target.value);
              setHalaman(1);
            }}
            placeholder="Cari produk atau layanan di database..."
            className="w-full rounded-xl border border-garis bg-latar px-3.5 py-2 text-xs text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* US-35: Tombol Ekspor CSV */}
          <a
            href="/api/admin/ekspor-csv"
            download
            className="inline-flex items-center gap-1.5 rounded-xl border border-garis bg-permukaan px-3 py-2 text-xs font-bold text-teks hover:border-utama hover:text-utama transition-colors"
            title="Unduh seluruh data katalog ke file CSV"
          >
            <span>📥</span>
            <span>Ekspor CSV</span>
          </a>
        </div>
      </div>

      {hasilFilter.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center text-sm text-teks-lembut">
          {kataKunci
            ? "Tidak ada produk yang cocok dengan pencarian Anda."
            : "Belum ada produk atau layanan yang terdaftar."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-garis bg-latar shadow-xs">
          <table className="w-full min-w-155 text-left text-sm">
            <thead className="bg-permukaan border-b border-garis text-xs uppercase tracking-wider text-teks-lembut">
              <tr>
                <th className="px-4 py-3.5 font-bold">Produk / Layanan</th>
                <th className="px-4 py-3.5 font-bold">Kategori</th>
                <th className="px-4 py-3.5 font-bold">Harga</th>
                <th className="px-4 py-3.5 font-bold">Prioritas</th>
                <th className="px-4 py-3.5 font-bold">Status</th>
                <th className="px-4 py-3.5 font-bold">Tanggal</th>
                <th className="px-4 py-3.5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-garis">
              {hasilFilter.map((produk) => {
                const isArsip = produk.deskripsi?.includes("[STATUS:ARSIP]");
                const isTeradopsi = produk.deskripsi?.includes("[STATUS:TERADOPSI]");
                const isPenuh = produk.deskripsi?.includes("[STATUS:PENUH]");

                return (
                  <tr key={produk.id} className="hover:bg-permukaan/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={produk.foto_url?.split(/[\n,]+/)[0]?.trim() || "/produk/kelinci.svg"}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg object-cover bg-permukaan border border-garis"
                        />
                        <div>
                          <p className="font-bold text-teks">{produk.nama}</p>
                          <p className="text-[11px] text-teks-lembut">ID: #{produk.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-teks-lembut">
                      {produk.kategori || "-"}
                    </td>
                    <td className="px-4 py-3 font-bold text-harga">
                      {formatRupiah(produk.harga)}
                    </td>
                    {/* US-47: Atur Urutan Tampil Prioritas */}
                    <td className="px-4 py-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleUbahPrioritas(produk.id, 1)}
                          className="h-6 w-6 rounded border border-garis bg-permukaan text-[10px] font-bold text-teks hover:border-utama hover:text-utama disabled:opacity-50"
                          title="Naikkan prioritas tampil di katalog beranda"
                        >
                          ▲
                        </button>
                        <span className="font-mono font-bold text-xs w-4 text-center">
                          {ekstrakPrioritas(produk.deskripsi)}
                        </span>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleUbahPrioritas(produk.id, -1)}
                          className="h-6 w-6 rounded border border-garis bg-permukaan text-[10px] font-bold text-teks hover:border-utama hover:text-utama disabled:opacity-50"
                          title="Turunkan prioritas tampil"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {/* US-32: Penanda Status */}
                      {isArsip ? (
                        <span className="rounded-full bg-garis px-2 py-0.5 text-[10px] font-bold text-teks-lembut">
                          Diarsipkan
                        </span>
                      ) : isTeradopsi ? (
                        <span className="rounded-full bg-bahaya/15 px-2 py-0.5 text-[10px] font-bold text-bahaya">
                          Teradopsi
                        </span>
                      ) : isPenuh ? (
                        <span className="rounded-full bg-bahaya/15 px-2 py-0.5 text-[10px] font-bold text-bahaya">
                          Kamar Penuh
                        </span>
                      ) : (
                        <span className="rounded-full bg-utama/15 px-2 py-0.5 text-[10px] font-bold text-utama">
                          Aktif Publik
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-teks-lembut">
                      {formatTanggal(produk.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* US-32: Tombol Arsipkan / Pulihkan */}
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleToggleArsip(produk.id)}
                          className="rounded-lg border border-garis px-2.5 py-1 text-xs font-semibold hover:border-utama hover:text-utama disabled:opacity-50"
                          title={isArsip ? "Tampilkan kembali di katalog publik" : "Sembunyikan dari katalog publik"}
                        >
                          {isArsip ? "Pulihkan" : "Arsipkan"}
                        </button>

                        <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis" className="py-1 px-2.5 text-xs">
                          Ubah
                        </Tombol>

                        <form
                          action={hapusProduk}
                          onSubmit={(e) => {
                            if (!window.confirm(`Apakah Anda yakin ingin menghapus "${produk.nama}"?`)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={produk.id} />
                          <Tombol
                            type="submit"
                            varian="bahaya"
                            className="py-1 px-2.5 text-xs"
                            onClick={(e) => {
                              if (!window.confirm(`Apakah Anda yakin ingin menghapus "${produk.nama}"?`)) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Hapus
                          </Tombol>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Keterangan Jumlah Total Produk (US-51) */}
      {hasilFilter.length > 0 && (
        <div className="flex items-center justify-between px-2 pt-2 text-xs text-teks-lembut">
          <p>
            Menampilkan seluruh <strong>{hasilFilter.length}</strong> produk &amp; layanan (terurut dari yang paling baru ditambahkan).
          </p>
        </div>
      )}
    </div>
  );
}
