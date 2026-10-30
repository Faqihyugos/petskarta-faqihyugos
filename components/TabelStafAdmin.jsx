"use client";

import { useActionState, useTransition } from "react";
import { tambahStafAction, toggleStafAction } from "@/app/actions/staf";
import { formatTanggal } from "@/lib/format";

export default function TabelStafAdmin({ daftarStaf = [], emailUserSaatIni = "" }) {
  const [stateTambah, formActionTambah, isPendingTambah] = useActionState(
    tambahStafAction,
    null
  );
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id) => {
    startTransition(async () => {
      const res = await toggleStafAction(id);
      if (!res.sukses) {
        alert(res.pesan);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Form Tambah Staf Cabang */}
      <div className="rounded-2xl border border-garis bg-latar p-5 shadow-xs">
        <h2 className="text-base font-bold text-teks">Daftarkan Staf Admin Baru</h2>
        <p className="mt-1 text-xs text-teks-lembut">
          Delegasikan pengelolaan kamar hotel dan pesan WhatsApp untuk staf cabang Jatinegara atau Pondok Pinang.
        </p>

        <form action={formActionTambah} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            type="email"
            name="email"
            required
            placeholder="email@petskarta.com"
            className="rounded-xl border border-garis bg-permukaan px-3.5 py-2 text-xs text-teks focus:border-utama focus:outline-none"
          />

          <select
            name="cabang"
            className="rounded-xl border border-garis bg-permukaan px-3 py-2 text-xs text-teks focus:border-utama focus:outline-none"
          >
            <option value="Cabang Pondok Pinang (Jaksel)">Cabang Pondok Pinang (Jaksel)</option>
            <option value="Cabang Jatinegara (Jaktim)">Cabang Jatinegara (Jaktim)</option>
            <option value="Semua Cabang">Semua Cabang</option>
          </select>

          <button
            type="submit"
            disabled={isPendingTambah}
            className="rounded-xl bg-utama px-4 py-2 text-xs font-bold text-white hover:bg-utama-gelap disabled:opacity-50"
          >
            {isPendingTambah ? "Mendaftarkan..." : "Daftarkan Staf"}
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

      {/* Tabel Daftar Staf Terdaftar */}
      <div className="overflow-x-auto rounded-2xl border border-garis bg-latar shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-permukaan border-b border-garis text-xs uppercase tracking-wider text-teks-lembut">
            <tr>
              <th className="p-3.5">Email Pengguna</th>
              <th className="p-3.5">Peran</th>
              <th className="p-3.5">Penempatan Cabang</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Terdaftar Sejak</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {daftarStaf.map((staf) => {
              const isSaya = staf.email === emailUserSaatIni?.toLowerCase();

              return (
                <tr key={staf.id} className="hover:bg-permukaan/30">
                  <td className="p-3.5 font-bold text-xs text-teks">
                    <div className="flex items-center gap-2">
                      <span>{staf.email}</span>
                      {isSaya && (
                        <span className="rounded-md bg-utama/15 px-1.5 py-0.5 text-[9px] font-bold text-utama">
                          Akun Anda
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-xs text-teks-lembut">{staf.role}</td>
                  <td className="p-3.5 text-xs font-medium text-teks">{staf.cabang}</td>
                  <td className="p-3.5 text-xs">
                    {staf.aktif ? (
                      <span className="rounded-full bg-utama/15 px-2 py-0.5 text-[10px] font-bold text-utama">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-garis px-2 py-0.5 text-[10px] font-bold text-teks-lembut">
                        Dinonaktifkan
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-xs text-teks-lembut">
                    {formatTanggal(staf.created_at)}
                  </td>
                  <td className="p-3.5 text-right">
                    {isSaya ? (
                      <span className="text-[11px] italic text-teks-lembut">
                        Tidak dapat diubah
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleToggle(staf.id)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold disabled:opacity-50 ${
                          staf.aktif
                            ? "border-bahaya/30 text-bahaya hover:bg-bahaya/10"
                            : "border-utama/30 text-utama hover:bg-utama/10"
                        }`}
                      >
                        {staf.aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

