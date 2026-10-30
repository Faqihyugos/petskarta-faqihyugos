import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { cekKetersediaan } from "@/lib/ketersediaan";

export default function KartuProduk({ produk }) {
  const thumbnail =
    produk.foto_url?.split(/[\n,]+/)[0]?.trim() || "/produk/kelinci.svg";
  const { tersedia, label } = cekKetersediaan(produk);

  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition hover:border-utama/50"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-permukaan">
        <img
          src={thumbnail}
          alt={produk.nama}
          className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${
            !tersedia ? "opacity-75 grayscale-[20%]" : ""
          }`}
        />
        {!tersedia && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-bahaya px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs text-teks-lembut">{produk.kategori}</p>
        <h3 className="font-semibold leading-snug group-hover:text-utama">
          {produk.nama}
        </h3>
        <p className="mt-auto self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>
      </div>
    </Link>
  );
}
