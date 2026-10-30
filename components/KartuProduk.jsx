import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { cekKetersediaan } from "@/lib/ketersediaan";
import { ekstrakPromoDanBadge } from "@/lib/promo";
import TombolTambahKeranjang from "@/components/TombolTambahKeranjang";
import TombolFavorit from "@/components/TombolFavorit";
import TombolKomparasi from "@/components/TombolKomparasi";
import { buatSlugKategori } from "@/lib/kategori";

export default function KartuProduk({ produk }) {
  const thumbnail =
    produk.foto_url?.split(/[\n,]+/)[0]?.trim() || "/produk/kelinci.svg";
  const { tersedia, label } = cekKetersediaan(produk);
  const { hargaCoret, diskonPersen, badges } = ekstrakPromoDanBadge(produk);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition hover:border-utama/50 hover:shadow-sm">
      {/* Gambar Thumbnail Produk */}
      <div className="relative aspect-square w-full overflow-hidden bg-permukaan">
        <Link
          href={`/produk/${produk.id}`}
          className="block h-full w-full"
        >
          <img
            src={thumbnail}
            alt={produk.nama}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
              !tersedia ? "opacity-75 grayscale-[20%]" : ""
            }`}
          />
        </Link>

        {/* Badge Ketersediaan (US-19) */}
        {!tersedia && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-bahaya px-2 py-0.5 text-[11px] font-bold text-white shadow-sm pointer-events-none">
            {label}
          </span>
        )}

        {/* Badge Promo / Kepercayaan (US-20) */}
        {badges.length > 0 && tersedia && (
          <span className="absolute right-2.5 top-2.5 max-w-[85%] truncate rounded-md bg-utama/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs shadow-sm pointer-events-none">
            {badges[0]}
          </span>
        )}

        {/* Tombol Komparasi (US-37) */}
        <div className="absolute bottom-2 left-2 z-10">
          <TombolKomparasi produk={produk} />
        </div>

        {/* Tombol Favorit Wishlist (US-24) */}
        <div className="absolute bottom-2 right-2 z-10">
          <TombolFavorit id={produk.id} nama={produk.nama} ukuran="kecil" />
        </div>
      </div>

      {/* Konten & Informasi Produk */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between text-xs text-teks-lembut">
          {/* US-49: Tag kategori tertaut ke halaman kategori */}
          <Link
            href={`/kategori/${buatSlugKategori(produk.kategori)}`}
            className="hover:text-utama hover:underline transition-colors font-medium truncate max-w-[65%]"
          >
            {produk.kategori}
          </Link>
          {diskonPersen > 0 && (
            <span className="font-bold text-bahaya">Hemat {diskonPersen}%</span>
          )}
        </div>

        <Link href={`/produk/${produk.id}`}>
          <h3 className="font-semibold leading-snug transition group-hover:text-utama line-clamp-2">
            {produk.nama}
          </h3>
        </Link>

        {/* Harga & Tombol Keranjang (US-20 & US-21) */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <p className="self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
              {formatRupiah(produk.harga)}
            </p>
            {hargaCoret && hargaCoret > produk.harga && (
              <span className="mt-0.5 text-[11px] text-teks-lembut line-through">
                {formatRupiah(hargaCoret)}
              </span>
            )}
          </div>

          {/* Quick Add to Cart (US-21) */}
          {tersedia && (
            <TombolTambahKeranjang produk={produk} varian="kartu" />
          )}
        </div>
      </div>
    </div>
  );
}
