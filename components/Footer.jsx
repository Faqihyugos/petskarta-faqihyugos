import Link from "next/link";
import { toko } from "@/lib/toko";
import { ambilPengaturan } from "@/lib/pengaturan";

export default async function Footer() {
  const pengaturan = await ambilPengaturan();
  const namaBisnis = pengaturan.namaBisnis || toko.nama;
  const alamat = pengaturan.alamat || toko.alamat;
  const jamBuka = pengaturan.jamBuka || toko.jamBuka;
  const teksFooter =
    pengaturan.teksFooter ||
    `Melayani pecinta hewan kecil sejak ${toko.sejak} di Jakarta.`;

  return (
    <footer className="mt-16 border-t border-garis bg-permukaan">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 text-sm text-teks-lembut sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="font-bold text-teks">{namaBisnis}</p>
          <p>{alamat}</p>
          <p>{jamBuka}</p>
          <div className="mt-1 flex flex-col gap-1">
            <a
              href={`https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(`Halo ${namaBisnis}, saya ingin pesan via WhatsApp.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-utama underline underline-offset-4 hover:text-utama-gelap"
            >
              Pesan via WhatsApp: +{toko.nomorWhatsApp}
            </a>
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
            {teksFooter}
          </p>
        </div>
      </div>
    </footer>
  );
}
