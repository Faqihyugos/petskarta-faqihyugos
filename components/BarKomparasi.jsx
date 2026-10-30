"use client";

import Link from "next/link";
import { useKomparasi } from "@/context/KomparasiContext";

export default function BarKomparasi() {
  const { komparasiList, hapusKomparasi, resetKomparasi, pesanInfo } =
    useKomparasi();

  if (komparasiList.length === 0 && !pesanInfo) {
    return null;
  }

  const queryUrl = `/komparasi?item1=${komparasiList[0]?.id || ""}&item2=${
    komparasiList[1]?.id || ""
  }`;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-xl -translate-x-1/2 rounded-2xl border border-garis bg-latar/95 p-3.5 shadow-xl backdrop-blur-md">
      {pesanInfo && (
        <div className="mb-2 rounded-lg bg-utama/15 px-3 py-1.5 text-center text-xs font-bold text-utama">
          ℹ️ {pesanInfo}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <div>
            <p className="text-xs font-bold text-teks">
              Perbandingan Spesifikasi ({komparasiList.length}/2)
            </p>
            <div className="mt-0.5 flex flex-wrap gap-1.5">
              {komparasiList.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 rounded-md bg-permukaan px-2 py-0.5 text-[11px] font-semibold text-teks"
                >
                  <span className="max-w-[100px] truncate">{item.nama}</span>
                  <button
                    type="button"
                    onClick={() => hapusKomparasi(item.id)}
                    className="text-bahaya hover:opacity-80"
                    title="Hapus"
                  >
                    &times;
                  </button>
                </span>
              ))}
              {komparasiList.length === 1 && (
                <span className="text-[11px] italic text-teks-lembut">
                  Pilih 1 item lagi...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {komparasiList.length === 2 ? (
            <Link
              href={queryUrl}
              className="inline-flex items-center gap-1 rounded-lg bg-utama px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-utama-gelap transition-colors"
            >
              <span>Bandingkan Sekarang</span>
              <span>&rarr;</span>
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-1 rounded-lg bg-garis px-3 py-1.5 text-xs font-bold text-teks-lembut opacity-60 cursor-not-allowed"
            >
              Pilih 2 Item
            </button>
          )}

          <button
            type="button"
            onClick={resetKomparasi}
            className="text-xs text-teks-lembut hover:text-bahaya transition-colors"
            title="Reset"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

