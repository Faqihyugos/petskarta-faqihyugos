import Link from "next/link";
import Tombol from "@/components/Tombol";

export default function TidakDitemukan() {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-permukaan border border-garis text-5xl shadow-xs">
        🐰🔍
      </div>

      <span className="mt-6 rounded-full border border-garis bg-permukaan px-3 py-1 text-xs font-bold text-teks-lembut">
        Galat 404 - Halaman Tidak Ditemukan
      </span>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-teks">
        Ups! Kelinci Petskarta Sedang Bersembunyi
      </h1>

      <p className="mt-3 max-w-md text-base leading-relaxed text-teks-lembut">
        Halaman atau produk yang kamu cari mungkin telah diadopsi, dipindahkan, atau tautan yang kamu tuju salah ketik.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Tombol href="/" varian="utama">
          Lihat Katalog Kelinci &amp; Layanan
        </Tombol>
        <Tombol href="/cabang" varian="garis">
          Direktori Cabang Resmi
        </Tombol>
      </div>
    </div>
  );
}
