# Checklist Keamanan: Platform Petskarta

Verifikasi seluruh poin keamanan ini sebelum melakukan peluncuran dan penilaian karya. Seluruh poin ini bersifat wajib untuk menjamin keamanan operasional Petskarta.

## Keamanan Wajib
- [x] **Isolasi Koneksi Supabase:** Buka situs di browser, klik kanan > Inspect > tab Network. Muat ulang halaman beranda dan detail: pastikan tidak ada permintaan langsung dari peramban client ke alamat `supabase.co` (seluruh akses dilakukan dari server).
- [x] **Tanpa Environment Variable Publik:** Pencarian kata `supabase` dan `NEXT_PUBLIC` di seluruh kode membuktikan tidak ada variabel lingkungan berawalan `NEXT_PUBLIC_`. Kunci Supabase hanya berada di file rahasia server.
- [x] **Kebersihan Repositori Git:** Berkas `.env.local` masuk dalam `.gitignore` dan tidak pernah ter-commit atau terunggah ke repositori Git.
- [x] **Proteksi Rute Admin:** Buka rute `/admin`, `/admin/password`, atau `/admin/produk/baru` pada jendela penyamaran (*incognito*) tanpa login: otomatis dialihkan ke `/admin/login`.
- [x] **Password Baru:** Login menggunakan password default bawaan ditolak karena admin sudah melakukan pergantian password aman lewat US-05.
- [x] **Row Level Security (RLS) Aktif:** Di Supabase Console > Table Editor > tabel `produk`: RLS berstatus aktif (*enabled*) dan menolak pembacaan maupun manipulasi langsung dari koneksi anonim publik.
- [x] **Tidak Ada Kredensial Hardcoded:** Tidak ada alamat email admin, token rahasia, maupun password yang ditulis langsung di dalam berkas kode program.
- [x] **Proteksi Server Action:** Seluruh Server Action penambahan kelinci, pengubahan tarif hotel, penghapusan item, dan pengaturan toko memverifikasi sesi login admin di sisi server sebelum mengeksekusi query database.

---

## Keamanan Lanjutan

- [x] **K-6 Header keamanan di aplikasi live (10 poin):** Dikonfigurasi header keamanan HTTP standar (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`, `X-XSS-Protection`) di `next.config.mjs` dan `proxy.js`.
- [x] **K-7 Tanpa dangerouslySetInnerHTML atau eval berbahaya (5 poin):** Seluruh kode bersih dari `dangerouslySetInnerHTML` dan `eval()`. Injeksi tema dipindahkan ke skrip terpisah `public/theme.js` dan schema JSON-LD disematkan secara aman.
- [x] **K-8 /admin tidak diindeks mesin pencari (10 poin):** Seluruh rute `/admin` dilindungi dari pengindeksan bot pencari melalui `app/robots.js` (Disallow), header HTTP `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`, dan metadata `robots` di `app/admin/layout.jsx`.
- [x] **K-9 Error tidak membocorkan stack trace (5 poin):** Tersedia `app/error.jsx` yang menangani galat secara elegan tanpa mengekspos `stack`, `digest`, query database, atau trace sistem internal kepada pengguna.
- [x] **K-10 Dependensi tanpa kerentanan kritis (5 poin):** Hasil audit dependensi `npm audit` menunjukkan `0 vulnerabilities` kritis/tinggi.
- [x] **K-11 Content-Security-Policy ketat (10 poin):** Diterapkan Content Security Policy ketat yang membatasi eksekusi skrip, gaya, font, gambar, serta mematikan `frame-ancestors` untuk mencegah clickjacking.
- [x] **K-12 Rate limit login atau form (10 poin):** Penerapan rate limiting pada proses login admin di `app/admin/actions.js` (maksimal 5x gagal per 5 menit), form ulasan di `app/actions/ulasan.js`, dan form tanya AI di `lib/ai-asisten.js`.
- [x] **K-13 Tanpa console.log data sensitif (5 poin):** Seluruh berkas aplikasi bersih tanpa adanya `console.log` yang mencetak email, password, token, atau informasi sensitif lainnya.

