import Link from "next/link";
import { ambilPengaturan } from "@/lib/pengaturan";

export default async function BannerPengumuman() {
  const pengaturan = await ambilPengaturan();

  if (!pengaturan.bannerAktif || !pengaturan.bannerTeks) {
    return null;
  }

  return (
    <div
      role="alert"
      className="bg-utama text-white px-4 py-2.5 text-center text-xs sm:text-sm font-semibold transition-all relative z-50 shadow-xs"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
        <span>{pengaturan.bannerTeks}</span>
        {pengaturan.bannerLink && (
          <Link
            href={pengaturan.bannerLink}
            className="underline underline-offset-2 hover:opacity-85 whitespace-nowrap font-bold"
          >
            Lihat Info &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}

