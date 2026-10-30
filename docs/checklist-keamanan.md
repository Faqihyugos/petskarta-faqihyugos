# Checklist Keamanan: Platform Petskarta

Verifikasi seluruh poin keamanan ini sebelum melakukan peluncuran dan penilaian karya. Seluruh poin ini bersifat wajib untuk menjamin keamanan operasional Petskarta.

- [ ] **Isolasi Koneksi Supabase:** Buka situs di browser, klik kanan > Inspect > tab Network. Muat ulang halaman beranda dan detail: pastikan tidak ada permintaan langsung dari peramban client ke alamat `supabase.co` (seluruh akses dilakukan dari server).
- [ ] **Tanpa Environment Variable Publik:** Pencarian kata `supabase` dan `NEXT_PUBLIC` di seluruh kode membuktikan tidak ada variabel lingkungan berawalan `NEXT_PUBLIC_`. Kunci Supabase hanya berada di file rahasia server.
- [ ] **Kebersihan Repositori Git:** Berkas `.env.local` masuk dalam `.gitignore` dan tidak pernah ter-commit atau terunggah ke repositori Git.
- [ ] **Proteksi Rute Admin:** Buka rute `/admin`, `/admin/password`, atau `/admin/produk/baru` pada jendela penyamaran (*incognito*) tanpa login: otomatis dialihkan ke `/admin/login`.
- [ ] **Password Baru:** Login menggunakan password default bawaan ditolak karena admin sudah melakukan pergantian password aman lewat US-05.
- [ ] **Row Level Security (RLS) Aktif:** Di Supabase Console > Table Editor > tabel `produk`: RLS berstatus aktif (*enabled*) dan menolak pembacaan maupun manipulasi langsung dari koneksi anonim publik.
- [ ] **Tidak Ada Kredensial Hardcoded:** Tidak ada alamat email admin, token rahasia, maupun password yang ditulis langsung di dalam berkas kode program.
- [ ] **Proteksi Server Action:** Seluruh Server Action penambahan kelinci, pengubahan tarif hotel, penghapusan item, dan pengaturan toko memverifikasi sesi login admin di sisi server sebelum mengeksekusi query database.
