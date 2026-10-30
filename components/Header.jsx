import Link from "next/link";
import { toko } from "@/lib/toko";
import { ambilPengaturan } from "@/lib/pengaturan";
import TombolKeranjangHeader from "@/components/TombolKeranjangHeader";
import ToggleTema from "@/components/ToggleTema";

export default async function Header() {
  const pengaturan = await ambilPengaturan();
  const namaBisnis = pengaturan.namaBisnis || toko.nama;
  const logoEmoji = pengaturan.logoEmoji || "🐰";

  return (
    <header className="border-b border-garis bg-latar sticky top-0 z-40 backdrop-blur-md bg-latar/95">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          {pengaturan.logoUrl ? (
            <img
              src={pengaturan.logoUrl}
              alt={namaBisnis}
              className="h-7 w-7 object-contain rounded"
            />
          ) : (
            <span className="text-xl">{logoEmoji}</span>
          )}
          <span className="text-lg font-extrabold tracking-tight text-utama">
            {namaBisnis}
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
