import Link from "next/link";
import { logout } from "@/app/admin/actions";

export default function NavAdmin() {
  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-garis pb-4 text-sm">
      <Link href="/admin" className="font-semibold hover:text-utama">
        Produk
      </Link>
      <Link href="/admin/kategori" className="font-semibold hover:text-utama">
        Kategori
      </Link>
      <Link href="/admin/ulasan" className="font-semibold hover:text-utama">
        Moderasi Ulasan
      </Link>
      <Link href="/admin/pengaturan" className="font-semibold hover:text-utama">
        Pengaturan Cabang
      </Link>
      <Link href="/admin/sistem" className="font-semibold hover:text-utama">
        Sistem &amp; Tema
      </Link>
      <Link href="/admin/audit-log" className="font-semibold hover:text-utama">
        Audit Trail
      </Link>
      <Link href="/admin/staf" className="font-semibold hover:text-utama">
        Staf Cabang
      </Link>
      <Link href="/admin/impor" className="font-semibold hover:text-utama">
        Impor CSV
      </Link>
      <Link href="/admin/password" className="font-semibold hover:text-utama">
        Ganti password
      </Link>
      <form action={logout} className="ml-auto">
        <button type="submit" className="text-teks-lembut hover:text-bahaya">
          Keluar
        </button>
      </form>
    </nav>
  );
}
