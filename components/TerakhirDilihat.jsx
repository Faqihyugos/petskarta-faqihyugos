"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";

const STORAGE_KEY = "petskarta_terakhir_dilihat";
const MAX_ITEM = 4;

// Komponen client untuk merekam item yang sedang dilihat
export function RekamItemDilihat({ item }) {
  useEffect(() => {
    if (!item?.id) return;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      let list = data ? JSON.parse(data) : [];
      // Hapus jika sudah ada (agar pindah ke depan)
      list = list.filter((p) => String(p.id) !== String(item.id));
      // Tambahkan ke awal
      list.unshift({
        id: item.id,
        nama: item.nama,
        harga: item.harga,
        foto_url: item.foto_url,
        kategori: item.kategori,
      });
      // Batasi maksimal 4
      if (list.length > MAX_ITEM) {
        list = list.slice(0, MAX_ITEM);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Abaikan error storage
    }
  }, [item]);

  return null;
}

// Komponen untuk menampilkan daftar item terakhir dilihat
export default function TerakhirDilihat({ abaikanId }) {
  const [riwayat, setRiwayat] = useState([]);
  const [sudahDimuat, setSudahDimuat] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        let list = JSON.parse(data);
        if (abaikanId) {
          list = list.filter((item) => String(item.id) !== String(abaikanId));
        }
        setRiwayat(list.slice(0, 4));
      }
    } catch {
      // Abaikan jika error
    } finally {
      setSudahDimuat(true);
    }
  }, [abaikanId]);

  if (!sudahDimuat || riwayat.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="judul-terakhir-dilihat" className="mt-12 border-t border-garis pt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 id="judul-terakhir-dilihat" className="text-lg font-bold tracking-tight">
            Baru Saja Anda Lihat
          </h2>
          <p className="text-xs text-teks-lembut">
            Kelinci atau layanan yang sempat Anda periksa sebelumnya.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {riwayat.map((item) => {
          const thumbnail =
            item.foto_url?.split(/[\n,]+/)[0]?.trim() || "/produk/kelinci.svg";
          return (
            <Link
              key={item.id}
              href={`/produk/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-garis bg-latar p-2.5 transition hover:border-utama/50 shadow-xs"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-permukaan mb-2">
                <img
                  src={thumbnail}
                  alt={item.nama}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-semibold text-teks-lembut truncate">
                {item.kategori}
              </span>
              <p className="font-semibold text-xs text-teks truncate group-hover:text-utama">
                {item.nama}
              </p>
              <p className="mt-1 text-xs font-bold text-harga">
                {formatRupiah(item.harga)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

