"use client";

import { useTransition } from "react";
import { setujuiUlasanAction, hapusUlasanAction } from "@/app/actions/ulasan";

export default function TabelUlasanAdmin({ daftarUlasan = [] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id, statusSaatIni) => {
    startTransition(async () => {
      await setujuiUlasanAction(id, !statusSaatIni);
    });
  };

  const handleHapus = (id, nama) => {
    if (!window.confirm(`Hapus ulasan dari "${nama}" secara permanen?`)) return;
    startTransition(async () => {
      await hapusUlasanAction(id);
    });
  };

  if (daftarUlasan.length === 0) {
    return (
      <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center text-sm text-teks-lembut">
        Belum ada ulasan yang masuk.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-garis bg-latar shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-permukaan border-b border-garis text-xs uppercase tracking-wider text-teks-lembut">
          <tr>
            <th className="p-3.5">Pelanggan</th>
            <th className="p-3.5">Rating</th>
            <th className="p-3.5">Ulasan</th>
            <th className="p-3.5">Status</th>
            <th className="p-3.5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-garis">
          {daftarUlasan.map((u) => (
            <tr key={u.id} className="hover:bg-permukaan/40">
              <td className="p-3.5 font-bold text-teks">
                <div>{u.nama}</div>
                <div className="text-[11px] font-normal text-teks-lembut">
                  {u.sumber || "Web"} • {u.tanggal || "Baru"}
                </div>
              </td>
              <td className="p-3.5">
                <span className="text-amber-500 font-bold">
                  {"★".repeat(u.rating || 5)} ({u.rating || 5})
                </span>
              </td>
              <td className="p-3.5 max-w-xs text-xs text-teks-lembut">
                &ldquo;{u.komentar}&rdquo;
              </td>
              <td className="p-3.5">
                {u.disetujui ? (
                  <span className="rounded-full bg-utama/15 px-2.5 py-0.5 text-[11px] font-bold text-utama">
                    Ditampilkan
                  </span>
                ) : (
                  <span className="rounded-full bg-bahaya/15 px-2.5 py-0.5 text-[11px] font-bold text-bahaya">
                    Disembunyikan
                  </span>
                )}
              </td>
              <td className="p-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleToggle(u.id, u.disetujui)}
                    className="rounded-lg border border-garis px-2.5 py-1 text-xs font-semibold hover:border-utama hover:text-utama disabled:opacity-50"
                  >
                    {u.disetujui ? "Sembunyikan" : "Tampilkan"}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleHapus(u.id, u.nama)}
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
  );
}

