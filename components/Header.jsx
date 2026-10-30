import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolKeranjangHeader from "@/components/TombolKeranjangHeader";
import ToggleTema from "@/components/ToggleTema";

export default function Header() {
  return (
    <header className="border-b border-garis bg-latar sticky top-0 z-40 backdrop-blur-md bg-latar/95">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🐰</span>
          <span className="text-lg font-extrabold tracking-tight text-utama">
            {toko.nama}
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/cabang"
            className="text-xs sm:text-sm font-semibold text-teks-lembut hover:text-utama transition-colors"
          >
            Cabang &amp; Kontak
          </Link>
          <ToggleTema />
          <TombolKeranjangHeader />
        </div>
      </div>
    </header>
  );
}
