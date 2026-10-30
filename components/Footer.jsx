import Link from "next/link";
import { toko } from "@/lib/toko";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-garis bg-permukaan">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 text-sm text-teks-lembut sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="font-bold text-teks">{toko.nama}</p>
          <p>{toko.alamat}</p>
          <p>{toko.jamBuka}</p>
          <div className="mt-2">
            <Link
              href="/cabang"
              className="font-semibold text-utama underline underline-offset-4 hover:text-utama-gelap"
            >
              Direktori 2 Cabang Resmi &amp; Media Sosial &rarr;
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link href="/admin" className="self-start sm:self-end underline underline-offset-4 hover:text-utama">
            Masuk sebagai admin
          </Link>
          <p className="text-xs text-teks-lembut">
            Melayani pecinta hewan kecil sejak {toko.sejak} di Jakarta.
          </p>
        </div>
      </div>
    </footer>
  );
}
