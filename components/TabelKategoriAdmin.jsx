"use client";

import { useState, useTransition, useActionState } from "react";
import {
  tambahKategoriAction,
  ubahKategoriAction,
  hapusKategoriAction,
} from "@/app/actions/kategori";

export default function TabelKategoriAdmin({ daftarKategori = [] }) {
  const [stateTambah, formActionTambah, isPendingTambah] = useActionState(
    tambahKategoriAction,
    null
  );
  const [kategoriEdit, setKategoriEdit] = useState(null);
  const [namaEdit, setNamaEdit] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleMulaiEdit = (kategori) => {
    setKategoriEdit(kategori);
    setNamaEdit(kategori);
  };

  const handleSimpanEdit = () => {
    if (!namaEdit.trim() || namaEdit === kategoriEdit) {
      setKategoriEdit(null);
      return;
    }
    startTransition(async () => {
      const res = await ubahKategoriAction(kategoriEdit, namaEdit);
      if (res.sukses) {
        setKategoriEdit(null);
      } else {
        alert(res.pesan);
      }
    });
  };

  const handleHapus = (nama) => {
    if (!window.confirm(`Hapus kategori "${nama}"?`)) return;
    startTransition(async () => {
      const res = await hapusKategoriAction(nama);
      if (!res.sukses) {
        alert(res.pesan);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Form Tambah Kategori */}
      <div className="rounded-2xl border border-garis bg-latar p-5 shadow-xs">
        <h2 className="text-base font-bold text-teks">Tambah Kategori Baru</h2>
        <form action={formActionTambah} className="mt-3 flex flex-wrap gap-2">
          <input
            type="text"
            name="nama"
            required
            placeholder="Contoh: Guinea Pig Hotel, Paket Steril Kelinci..."
            className="flex-1 min-w-[240px] rounded-xl border border-garis bg-permukaan px-3.5 py-2 text-xs text-teks focus:border-utama focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPendingTambah}
            className="rounded-xl bg-utama px-4 py-2 text-xs font-bold text-white hover:bg-utama-gelap disabled:opacity-50"
          >
            {isPendingTambah ? "Menyimpan..." : "Tambah Kategori"}
          </button>
        </form>
        {stateTambah && (
          <p
            className={`mt-2 text-xs font-semibold ${
              stateTambah.sukses ? "text-utama" : "text-bahaya"
            }`}
          >
            {stateTambah.pesan}
          </p>
        )}
      </div>

      {/* Tabel Kategori */}
      <div className="overflow-x-auto rounded-2xl border border-garis bg-latar shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-permukaan border-b border-garis text-xs uppercase tracking-wider text-teks-lembut">
            <tr>
              <th className="p-3.5">Nama Kategori</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {daftarKategori.map((kategori, idx) => (
              <tr key={idx} className="hover:bg-permukaan/30">
                <td className="p-3.5 font-bold text-teks">
                  {kategoriEdit === kategori ? (
                    <div className="flex items-center gap-2 max-w-sm">
                      <input
                        type="text"
                        value={namaEdit}
                        onChange={(e) => setNamaEdit(e.target.value)}
                        className="rounded-lg border border-garis px-2.5 py-1 text-xs text-teks"
                      />
                      <button
                        type="button"
                        onClick={handleSimpanEdit}
                        disabled={isPending}
                        className="rounded bg-utama px-2 py-1 text-[11px] font-bold text-white"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setKategoriEdit(null)}
                        className="text-[11px] text-teks-lembut"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    kategori
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleMulaiEdit(kategori)}
                      className="rounded-lg border border-garis px-2.5 py-1 text-xs font-semibold hover:border-utama hover:text-utama"
                    >
                      Ubah
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleHapus(kategori)}
                      className="rounded-lg border border-bahaya/30 px-2.5 py-1 text-xs font-semibold text-bahaya hover:bg-bahaya/10 disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

