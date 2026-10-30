# Checklist Pengujian: Platform Petskarta

Uji di link Vercel publik dan localhost, baik pada tampilan desktop maupun layar ponsel (HP).

## 1. Pengalaman Pengunjung & Calon Pelanggan

- [ ] **Trust Signal & Kredibilitas:** Halaman beranda menampilkan identitas resmi Petskarta (Berdiri sejak 2016) dan lencana ulasan Google Bintang 5.0 (178 ulasan) untuk mematahkan misinformasi status "Tutup Permanen".
- [ ] **Katalog Multi-Layanan:** Seluruh kategori layanan (Kelinci Hias, Bunny Hotel, Grooming & Perawatan, Pakan & Aksesoris) tampil dari database Supabase (bukan data statis).
- [ ] **Format Tarif & Rupiah:** Harga tampil dalam format rupiah rapi (misal: `Rp 850.000` atau `Rp 65.000 / hari`).
- [ ] **Halaman Detail:** Klik pada kelinci atau layanan membuka halaman `/produk/[id]` dengan spesifikasi lengkap (ras, fasilitas AC/CCTV, garansi kirim).
- [ ] **Penanganan 404:** Mengakses ID yang tidak ada (misal `/produk/99999`) menampilkan halaman informatif tidak ditemukan dengan navigasi kembali ke katalog.
- [ ] **Smart Booking WhatsApp:** Tombol booking/pesan via WhatsApp menyusun pesan otomatis yang memuat nama item/kelinci, harga, serta terarah ke nomor WhatsApp cabang yang dipilih (Pondok Pinang atau Jatinegara).
- [ ] **Direktori Cabang & Google Maps:** Alamat cabang Pondok Pinang dan Jatinegara tertera jelas dengan tautan petunjuk arah Google Maps yang akurat.
- [ ] **Responsif Seluler:** Seluruh tata letak kartu, galeri foto, tombol booking, dan navigasi ramah sentuhan serta tidak terpotong di layar ponsel (~390px).

## 2. Area Admin Petskarta

- [ ] **Login Admin:** Masuk dengan email dan password yang valid di `/admin/login` berhasil mengalihkan ke dashboard `/admin`.
- [ ] **Proteksi Kredensial Salah:** Memasukkan password keliru menampilkan pesan peringatan yang jelas dan aman.
- [ ] **Ganti Password:** Fitur di `/admin/password` berhasil memperbarui password admin yang sedang aktif, dan password baru divalidasi minimal 8 karakter serta konfirmasi yang cocok.
- [ ] **Sesi Logout:** Tombol "Keluar" mengakhiri sesi autentikasi dan mencegah akses kembali ke halaman admin tanpa login ulang.

## 3. Fitur Tambahan & Operasional

- [ ] **Tambah Item:** Menambahkan kelinci adopsi atau paket hotel baru di `/admin/produk/baru` langsung tersimpan ke database dan muncul di katalog publik.
- [ ] **Ubah Item:** Mengubah tarif kamar hotel atau status kelinci di `/admin/produk/[id]/ubah` memperbarui database secara tepat.
- [ ] **Hapus Item:** Menghapus item memunculkan dialog konfirmasi dan membersihkan data dari database.
- [ ] **Filter Kategori & Cari:** Filter berdasarkan jenis layanan (misal "Bunny Hotel") dan pencarian kata kunci (misal "Holland Lop") bekerja secara responsif.
