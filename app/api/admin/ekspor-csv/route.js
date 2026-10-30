import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // US-35: Endpoint ekspor hanya dapat diakses oleh sesi admin yang terautentikasi
  if (!user) {
    return new NextResponse("Akses ditolak: Hanya admin yang diizinkan mengunduh arsip CSV.", {
      status: 401,
    });
  }

  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .order("id", { ascending: true });

  if (error || !daftarProduk) {
    return new NextResponse("Gagal mengambil data dari database.", { status: 500 });
  }

  // Sanitasi karakter CSV untuk mencegah CSV formula injection dan pemisahan koma
  const sanitize = (str) => {
    if (str === null || str === undefined) return '""';
    let s = String(str).replace(/"/g, '""');
    if (/^[=+\-@]/.test(s)) {
      s = `'` + s;
    }
    return `"${s}"`;
  };

  const header = ["ID", "Nama Produk/Layanan", "Harga (Rp)", "Kategori", "Foto URL", "Tanggal Dibuat"];
  const baris = [header.join(",")];

  daftarProduk.forEach((item) => {
    baris.push(
      [
        sanitize(item.id),
        sanitize(item.nama),
        sanitize(item.harga),
        sanitize(item.kategori),
        sanitize(item.foto_url),
        sanitize(item.created_at),
      ].join(",")
    );
  });

  const csvContent = "\uFEFF" + baris.join("\r\n"); // UTF-8 BOM agar Excel menampilkan aksen dengan benar

  const tanggalStr = new Date().toISOString().slice(0, 10);
  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="petskarta-katalog-${tanggalStr}.csv"`,
    },
  });
}

