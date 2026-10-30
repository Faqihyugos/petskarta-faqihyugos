import Link from "next/link";
import { toko } from "@/lib/toko";
import TombolKeranjangHeader from "@/components/TombolKeranjangHeader";

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
        <div className="flex items-center gap-3">
          <TombolKeranjangHeader />
        </div>
      </div>
    </header>
  );
}
