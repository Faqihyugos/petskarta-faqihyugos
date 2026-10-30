# User Story: Platform Digital Petskarta

Setiap user story diberi nomor identifikasi. Pakai nomor ini di prompt ("kerjakan US-01") dan di pesan commit (`US-01: katalog layanan dan adopsi kelinci petskarta`).

Setiap kriteria selesai diberi poin, dan jumlahnya sama dengan poin user story. User story dinyatakan selesai jika seluruh kriterianya terpenuhi.

## Cara Penilaian

- **Lulus:** US-01 sampai US-06 selesai (semua kriteria terpenuhi).
- **Bonus:** US-07 sampai US-50 hanya dihitung kalau kamu sudah lulus. Kerjakan berurutan sampai waktu atau kuota AI-mu habis; tidak semua harus selesai.
- **Poin:** US-01 sampai US-14 masing-masing 10 poin. US-15 sampai US-50 bernilai 5, 10, atau 15 poin sesuai beban kerjanya.
- Selain user story, ada penilaian keamanan (`docs/checklist-keamanan.md`), keselarasan bisnis UMKM Petskarta, dan jurnal prompt (`PROMPTS.md`).

---

## Wajib

### US-01 Katalog Terpadu Layanan & Kelinci Petskarta

Sebagai calon adopter atau pemilik hewan kecil di Jakarta, saya ingin melihat seluruh katalog kelinci hias (*Holland Lop*, *Netherland Dwarf*), paket *Bunny Hotel*, layanan *Grooming* / *Scabies Healer*, serta perlengkapan pakan dalam satu halaman, supaya saya langsung mengetahui seluruh solusi yang ditawarkan Petskarta.

Bernilai 10 poin.

Kriteria selesai:

- Halaman beranda `/` menampilkan seluruh katalog dari tabel `produk` di database Supabase (bukan dari data contoh statis), mencakup kelinci hias siap adopsi, paket Bunny Hotel, layanan Grooming/Scabies Healer, dan pakan/aksesoris. (3 poin)
- Data katalog diambil di sisi server (Server Component) demi performa dan SEO. (2 poin)
- Setiap kartu item menampilkan foto berkualitas, kategori (misal "Kelinci Hias", "Bunny Hotel", "Grooming & Perawatan", "Aksesoris"), nama layanan/kelinci, dan harga dalam format rupiah standar. (3 poin)
- Jika belum ada data di database, halaman menampilkan pesan ramah bahwa belum ada layanan/kelinci yang dipublikasikan. (2 poin)

### US-02 Detail Layanan & Spesifikasi Adopsi Kelinci

Sebagai calon adopter atau pemilik kelinci, saya ingin melihat rincian lengkap satu kelinci (ras, usia, garansi pengiriman) atau fasilitas paket hotel (ruangan AC, pantauan CCTV, *free* rumput *timothy*, alas *foot rest* plastik, waktu bermain harian), supaya saya yakin akan kualitas dan keamanannya sebelum memesan.

Bernilai 10 poin.

Kriteria selesai:

- Halaman `/produk/[id]` menampilkan foto, kategori, nama, harga, dan deskripsi detail spesifikasi hewan/layanan langsung dari database. (6 poin)
- Item atau ID yang tidak ada di database menampilkan halaman "tidak ditemukan" yang informatif dengan tombol kembali ke katalog. (4 poin)

### US-03 Pemesanan & Reservasi via WhatsApp Multi-Cabang

Sebagai pengunjung, saya ingin menekan satu tombol pemesanan atau booking yang langsung membuka WhatsApp admin cabang terkait (Pondok Pinang atau Jatinegara) dengan pesan terformat otomatis, supaya saya tidak perlu mengetik ulang detail pesanan.

Bernilai 10 poin.

Kriteria selesai:

- Tombol "Pesan via WhatsApp" atau "Booking via WhatsApp" membuka tautan WhatsApp ke nomor cabang yang terdaftar di konfigurasi toko (`lib/toko.js` atau database). (4 poin)
- Teks pesan WhatsApp otomatis sudah terisi nama item, harga, dan format konfirmasi yang jelas (contoh: "Halo Admin Petskarta, saya ingin pesan/booking: [Nama Item] seharga [Harga]..."). (4 poin)
- Berfungsi mulus di peramban seluler (HP) maupun komputer desktop (WhatsApp Web). (2 poin)

### US-04 Login Admin Petskarta

Sebagai pengelola atau admin cabang Petskarta, saya ingin masuk ke sistem admin dengan email dan kata sandi, supaya hanya staf resmi yang dapat mengelola status kelinci adopsi, tarif hotel, dan pesanan.

Bernilai 10 poin.

Kriteria selesai:

- Otentikasi login diproses aman di server menggunakan Supabase Auth. (4 poin)
- Jika kredensial benar, admin dialihkan ke `/admin`; jika salah, muncul pesan galat yang jelas tanpa membocorkan informasi sensitif. (3 poin)
- Tombol "Keluar" (Logout) menghapus sesi otentikasi di server dan mengembalikan pengguna ke `/admin/login`. (3 poin)

### US-05 Ganti Password Admin

Sebagai admin Petskarta, saya ingin mengganti kata sandi akun saya, supaya kata sandi bawaan awal segera diganti demi keamanan toko.

Bernilai 10 poin.

Kriteria selesai:

- Halaman `/admin/password` menyediakan form untuk memperbarui password admin yang sedang terautentikasi. (4 poin)
- Password baru wajib minimal 8 karakter dan diverifikasi sama persis dengan konfirmasi password. (3 poin)
- Menampilkan pesan notifikasi berhasil yang jelas atau pesan galat bila gagal memperbarui. (3 poin)

### US-06 Proteksi Keamanan Halaman Admin

Sebagai pemilik Petskarta, saya ingin memastikan seluruh rute admin dan aksi Server Action terlindungi dari akses tanpa izin publik.

Bernilai 10 poin.

Kriteria selesai:

- Mengakses rute `/admin` mana pun tanpa sesi login yang valid akan langsung dialihkan ke `/admin/login` (melalui proxy/middleware server). (5 poin)
- Seluruh Server Action yang melakukan manipulasi data (tambah, ubah, hapus produk/layanan/password) memverifikasi status login admin di server sebelum dieksekusi. (5 poin)

---

## Bonus

### US-07 Daftar Kelinci & Layanan di Panel Admin

Sebagai admin Petskarta, saya ingin melihat seluruh daftar kelinci siap adopsi, paket Bunny Hotel, dan layanan grooming di halaman `/admin` yang langsung diambil dari database Supabase.

Bernilai 10 poin.

Kriteria selesai:

- Daftar item di `/admin` memuat data riil dari database Supabase beserta thumbnail foto, kategori, harga, dan tanggal ditambahkan. (10 poin)

### US-08 Tambah Kelinci Adopsi atau Layanan Baru

Sebagai admin Petskarta, saya ingin mendaftarkan kelinci hias baru yang siap diadopsi atau menambahkan paket perawatan/hotel baru dari antarmuka admin.

Bernilai 10 poin.

Kriteria selesai:

- Form di `/admin/produk/baru` dapat menyimpan data item baru ke database Supabase (nama, harga, kategori, foto_url, deskripsi). (5 poin)
- Setelah berhasil menyimpan, admin otomatis dialihkan kembali ke halaman utama `/admin` dengan data baru langsung muncul. (2 poin)
- Aksi penambahan diverifikasi aman di sisi server dan menolak akses unauthenticated. (3 poin)

### US-09 Ubah Data Kelinci atau Tarif Layanan

Sebagai admin Petskarta, saya ingin mengubah status ketersediaan kelinci, memperbarui foto, atau menyesuaikan tarif musiman Bunny Hotel (misal tarif khusus libur Lebaran).

Bernilai 10 poin.

Kriteria selesai:

- Halaman `/admin/produk/[id]/ubah` memuat form yang sudah terisi data lama item yang dipilih. (4 poin)
- Perubahan tersimpan secara akurat ke database Supabase. (3 poin)
- Aksi perubahan terlindungi login admin di server. (3 poin)

### US-10 Hapus Item Kelinci atau Layanan

Sebagai admin Petskarta, saya ingin menghapus data kelinci yang sudah berhasil diadopsi atau paket layanan yang sudah tidak ditawarkan lagi.

Bernilai 10 poin.

Kriteria selesai:

- Tombol "Hapus" memicu dialog konfirmasi untuk mencegah tindakan tidak sengaja. (4 poin)
- Data terhapus bersih dari database Supabase. (3 poin)
- Aksi penghapusan terlindungi otentikasi admin di server. (3 poin)

### US-11 Filter Kategori Layanan & Pencarian Cepat

Sebagai calon pelanggan, saya ingin menyaring katalog berdasarkan kategori spesifik ("Kelinci Hias", "Bunny Hotel", "Grooming & Treatment", "Perlengkapan") atau mencari ras tertentu ("Holland Lop", "Netherland Dwarf", "Scabies"), supaya saya cepat menemukan kebutuhan hewan saya.

Bernilai 10 poin.

Kriteria selesai:

- Pengunjung dapat memilih filter kategori atau mengetikkan kata kunci di kolom pencarian, dan daftar item langsung tersaring sesuai kriteria. (10 poin)

### US-12 Form Booking Interaktif & Varian Layanan

Sebagai pemilik hewan, saya ingin memilih cabang tujuan (Pondok Pinang vs Jatinegara), tanggal rencana penitipan (*check-in/check-out*) atau jadwal grooming sebelum memesan, dan seluruh pilihan tersebut otomatis tertulis rapi di pesan WhatsApp.

Bernilai 10 poin.

Kriteria selesai:

- Di halaman detail atau modul booking, pengunjung dapat memilih cabang tujuan serta menentukan tanggal/jadwal atau catatan kebutuhan khusus hewan (misal kelinci sedang dalam perawatan obat/alergi). (5 poin)
- Pilihan cabang, tanggal, dan catatan tersebut otomatis dienkode ke dalam teks pesan WhatsApp yang siap dikirim. (5 poin)

### US-13 PWA Petskarta di Layar Ponsel

Sebagai pelanggan setia Petskarta, saya ingin memasang katalog dan layanan booking Petskarta di layar beranda ponsel saya layaknya aplikasi resmi tanpa perlu mengunduh dari App Store.

Bernilai 10 poin.

Kriteria selesai:

- Terdapat file Web App Manifest (`manifest.json` / `manifest.webmanifest`) yang valid dan terhubung di berkas tata letak utama. (4 poin)
- Ikon Petskarta tersedia di folder `public/icons` dengan berbagai resolusi standar dan dirujuk dengan benar di manifest. (3 poin)
- Situs memenuhi syarat instalasi PWA dan dapat ditambahkan ke layar utama (*Add to Home Screen*) di Android dan iOS. (3 poin)

### US-14 Generator Deskripsi Kelinci & Layanan Berbasis AI

Sebagai admin Petskarta, saya ingin membuat deskripsi karakteristik kelinci (temperamen, saran pemeliharaan) atau keunggulan paket Bunny Hotel secara instan menggunakan AI (Gemini API) hanya dengan memasukkan nama ras dan kategori.

Bernilai 10 poin.

Kriteria selesai:

- Terdapat fitur tombol bantuan AI di form admin untuk mengenerate deskripsi profesional dari input nama dan kategori. (4 poin)
- Pemanggilan Google Gemini API dilakukan murni dari server-side tanpa mengekspos API key ke browser client. (3 poin)
- Teks deskripsi hasil AI langsung mengisi kolom input deskripsi dan dapat diedit oleh admin sebelum disimpan. (3 poin)

---

## Bonus Lanjutan

### US-15 Urutkan Katalog Petskarta

Sebagai pengunjung, saya ingin mengurutkan katalog berdasarkan harga (termurah/termahal) atau ketersediaan terbaru, agar mudah membandingkan paket kamar hotel atau harga adopsi kelinci.

Bernilai 5 poin.

Kriteria selesai:

- Tersedia opsi pengurutan: harga termurah, harga termahal, dan item terbaru. (3 poin)
- Logika pengurutan diterapkan langsung pada database query di server. (2 poin)

### US-16 Paginasi & Pengambilan Data Efisien

Sebagai pengunjung dengan koneksi internet terbatas, saya ingin daftar item disajikan bertahap (paginasi atau tombol muat lebih banyak) agar laman dimuat sangat cepat.

Bernilai 10 poin.

Kriteria selesai:

- Daftar item dipecah dengan paginasi atau tombol "Muat lebih banyak". (4 poin)
- Batasan jumlah data dieksekusi di query database Supabase (`limit` & `range`), bukan sekadar menyembunyikan elemen di CSS. (3 poin)
- Navigasi antar halaman berfungsi presisi dengan kalkulasi total halaman yang akurat. (3 poin)

### US-17 Rekomendasi Perlengkapan Starter Kit / Layanan Terkait

Sebagai adopter baru kelinci hias, saya ingin melihat rekomendasi perlengkapan pendukung (kandang *foot rest*, rumput *timothy*, botol minum anti bocor) di halaman detail kelinci yang sedang saya minati.

Bernilai 5 poin.

Kriteria selesai:

- Halaman detail kelinci/layanan menampilkan rekomendasi item pendukung dari database. (3 poin)
- Item yang sedang dibuka tidak muncul dobel di daftar rekomendasi. (2 poin)

### US-18 Galeri Multi-Foto Kelinci & Fasilitas Kamar Hotel

Sebagai pemilik kelinci yang selektif, saya ingin melihat beberapa foto sudut kelinci dari dekat atau kondisi kamar Bunny Hotel (kebersihan alas, sirkulasi AC, kamera CCTV) sebelum melakukan reservasi.

Bernilai 10 poin.

Kriteria selesai:

- Satu item dapat memiliki beberapa foto dokumentasi. (4 poin)
- Halaman detail menyediakan galeri interaktif dengan foto pratinjau utama dan thumbnail yang dapat dipilih. (3 poin)
- Tampilan tetap proporsional dan berfungsi normal jika item hanya memiliki satu foto. (3 poin)

### US-19 Status Ketersediaan Real-Time (Ready Adopsi / Kamar Penuh)

Sebagai pengunjung, saya ingin mengetahui apakah kelinci sudah teradopsi (*Booked/Adopted*) atau apakah kuota kamar hotel musim liburan masih tersedia (*Available/Full Booked*), supaya saya tidak kecewa saat memesan.

Bernilai 5 poin.

Kriteria selesai:

- Item memiliki penanda status ketersediaan di database. (2 poin)
- Item dengan status habis/penuh diberi label jelas ("Sudah Teradopsi" / "Kamar Penuh") dan tombol booking dialihkan menjadi tombol "Konsultasi Daftar Tunggu" atau dinonaktifkan. (3 poin)

### US-20 Badge Kepercayaan & Promo Musim Liburan (Mudik Lebaran)

Sebagai pemilik hewan, saya ingin melihat penanda promosi khusus (misal "Promo Mudik Lebaran 2026", "Diskon Paket Grooming + Scabies") dan badge garansi kesehatan kelinci, supaya saya mendapatkan penawaran terbaik.

Bernilai 5 poin.

Kriteria selesai:

- Item promo dapat menampilkan harga coret di samping tarif diskon. (3 poin)
- Tersedia badge otomatis seperti "Best Seller", "Siap Adopsi", atau "Fasilitas AC & CCTV". (2 poin)

### US-21 Multi-Booking & Keranjang Pemesanan via WhatsApp

Sebagai pelanggan yang ingin mengadopsi kelinci sekaligus membeli kandang starter kit, pakan rumput timothy, dan menjadwalkan grooming, saya ingin memasukkan beberapa item ke keranjang dan mengirimkannya dalam satu format pesan WhatsApp.

Bernilai 15 poin.

Kriteria selesai:

- Tersedia tombol "Tambah ke Keranjang" pada item perlengkapan dan layanan. (4 poin)
- Drawer/halaman keranjang dapat menambah jumlah, menghapus item, dan menghitung total estimasi biaya dengan akurat. (4 poin)
- Keranjang tersimpan di state/penyimpanan lokal browser sehingga tidak hilang saat berpindah halaman. (4 poin)
- Satu tombol "Pesan Semua via WhatsApp" menyusun daftar seluruh item, total biaya, dan mengirimkannya ke nomor WhatsApp Petskarta. (3 poin)

### US-22 Direktori Cabang Resmi & Hub Ekosistem Petskarta

Sebagai calon pelanggan yang bingung dengan status "Tutup Permanen" di Google Maps atau informasi cabang yang terpecah di Instagram, saya ingin melihat halaman direktori cabang resmi (Pondok Pinang Jaksel dan Jatinegara Jaktim) dengan klarifikasi status "Aktif Beroperasi", panduan rute Google Maps, serta tautan ke seluruh media sosial resmi (`@petskartaa`, `@petskarta.jatinegara`, Shopee, TikTok).

Bernilai 5 poin.

Kriteria selesai:

- Terdapat halaman atau modul direktori cabang resmi yang memuat alamat lengkap, jam buka, layanan khusus tiap cabang, dan status operasional aktif. (3 poin)
- Dilengkapi tombol tautan langsung ke Google Maps masing-masing cabang, serta tautan hub ke Instagram resmi, TikTok, dan Shopee Petskarta. (2 poin)

### US-23 Bagikan / Salin Tautan Profil Kelinci & Layanan

Sebagai pengunjung, saya ingin membagikan link kelinci menggemaskan atau info paket Bunny Hotel kepada keluarga lewat chat WhatsApp atau media sosial dengan satu ketukan.

Bernilai 5 poin.

Kriteria selesai:

- Halaman detail menyediakan tombol "Bagikan" yang memanfaatkan Web Share API atau fitur salin tautan clipboard. (3 poin)
- Terdapat indikator visual instan setelah ditekan (misal "Tautan berhasil disalin"). (2 poin)

### US-24 Simpan Kelinci & Layanan Favorit (Wishlist)

Sebagai calon adopter yang sedang mempertimbangkan beberapa pilihan ras kelinci, saya ingin menandai kelinci favorit saya tanpa perlu membuat akun, agar mudah mengeceknya kembali.

Bernilai 10 poin.

Kriteria selesai:

- Ada tombol ikon favorit (hati) pada kartu dan detail item. (4 poin)
- Data favorit tersimpan di local storage peramban dan tetap ada saat halaman dibuka ulang. (3 poin)
- Tersedia filter atau tab khusus untuk melihat daftar item yang telah difavoritkan. (3 poin)

### US-25 Mode Gelap Ramah Mata (Dark Mode)

Sebagai pengunjung yang browsing di malam hari untuk mencari info penitipan kelinci, saya ingin antarmuka memiliki pilihan mode gelap agar mata tidak cepat lelah.

Bernilai 10 poin.

Kriteria selesai:

- Tersedia tombol pengalih (toggle) mode terang dan mode gelap. (4 poin)
- Preferensi tema tersimpan di peramban sehingga konsisten antar sesi kunjungan. (3 poin)
- Seluruh teks, kartu foto kelinci, dan label harga tetap kontras dan nyaman dibaca pada kedua mode. (3 poin)

### US-26 Optimasi Metadata SEO & Open Graph Petskarta

Sebagai pengelola Petskarta, saya ingin setiap tautan halaman yang dibagikan ke WhatsApp atau Facebook menampilkan pratinjau kartu gambar kelinci, judul, dan deskripsi profesional, sekaligus mendominasi SERP Google untuk kata kunci "hotel kelinci Jakarta", "adopsi kelinci hias Jakarta", dan "grooming kelinci".

Bernilai 5 poin.

Kriteria selesai:

- Halaman detail memanfaatkan fungsi `generateMetadata` Next.js untuk judul dan deskripsi yang dinamis dan SEO-friendly. (3 poin)
- Tag Open Graph memuat gambar kelinci/fasilitas, judul, dan deskripsi toko secara lengkap dan valid. (2 poin)

### US-27 Structured Data Schema (`LocalBusiness` / `PetStore`) & Sitemap

Sebagai pengelola Petskarta, saya ingin mesin pencari Google membaca data terstruktur bisnis kami (alamat dua cabang, jam buka, rating 5.0, layanan pet care) lewat Schema JSON-LD agar memulihkan status bisnis di Google Maps dan menekan hasil pencarian keliru (seperti toko pastry GoFood).

Bernilai 5 poin.

Kriteria selesai:

- Terdapat injeksi JSON-LD Schema.org bertipe `PetStore` / `LocalBusiness` / `VeterinaryCare` di halaman beranda/cabang dengan data alamat dan kontak resmi. (3 poin)
- File `sitemap.xml` dinamis dan `robots.txt` yang valid tersedia untuk mempercepat pengindeksan bot Google. (2 poin)

### US-28 Halaman 404 Kustom & Skeleton Loading

Sebagai pengunjung, saya ingin melihat pesan ramah berkarakter Petskarta saat membuka tautan yang salah dan animasi pemuatan (skeleton loading) yang halus saat mengambil data kelinci.

Bernilai 5 poin.

Kriteria selesai:

- Tersedia berkas `not-found.jsx` bertema ramah hewan dengan tombol navigasi kembali ke katalog beranda. (3 poin)
- Tersedia komponen loading atau skeleton placeholder saat data katalog sedang diambil dari database. (2 poin)

### US-29 Unggah Foto Kelinci & Fasilitas ke Supabase Storage

Sebagai admin Petskarta, saya ingin mengunggah foto kelinci hias asli dan foto kondisi kamar hotel langsung dari ponsel/laptop saya ke Supabase Storage tanpa perlu repot mencari link foto manual.

Bernilai 15 poin.

Kriteria selesai:

- Form tambah/ubah produk memiliki input unggah file gambar. (4 poin)
- File gambar diunggah ke Supabase Storage melalui Server Action dengan kredensial server. (4 poin)
- URL publik gambar otomatis tersimpan di tabel database dan foto tampil sempurna di halaman publik. (4 poin)
- Terdapat validasi tipe file (hanya format gambar) dan batasan ukuran berkas dengan pesan kesalahan yang informatif. (3 poin)

### US-30 Dashboard Analitik Ringkasan Petskarta

Sebagai pemilik Petskarta, saya ingin melihat gambaran umum performa toko: total kelinci siap adopsi, total paket layanan aktif, serta jumlah ketertarikan booking.

Bernilai 10 poin.

Kriteria selesai:

- Halaman `/admin` menampilkan statistik total item kelinci dan layanan dari database. (4 poin)
- Menampilkan rincian jumlah item per kategori (Kelinci Hias, Bunny Hotel, Grooming/Scabies, Aksesoris). (3 poin)
- Seluruh data statistik hanya dapat diakses oleh admin yang sudah login. (3 poin)

### US-31 Manajemen Kategori Layanan & Produk

Sebagai admin Petskarta, saya ingin mengelola daftar kategori (misal menambah kategori "Guinea Pig Hotel" atau "Paket Steril Kelinci") langsung dari dasbor admin.

Bernilai 15 poin.

Kriteria selesai:

- Admin dapat menambahkan kategori baru. (4 poin)
- Admin dapat mengubah nama kategori yang ada. (3 poin)
- Admin dapat menghapus kategori, dengan proteksi atau peringatan jika masih ada kelinci/layanan yang terikat pada kategori tersebut. (4 poin)
- Form produk mengambil daftar pilihan kategori secara dinamis dari data ini, dengan seluruh aksi terproteksi login. (4 poin)

### US-32 Sembunyikan Kelinci Teradopsi / Arsip Layanan

Sebagai admin Petskarta, saya ingin menonaktifkan atau mengarsipkan kelinci yang sudah diadopsi tanpa harus menghapus riwayat datanya dari database, agar bisa dipulihkan bila adopsi dibatalkan.

Bernilai 10 poin.

Kriteria selesai:

- Ada tombol aksi pengubah status (Aktif/Nonaktif atau Tersedia/Diadopsi) di daftar admin. (4 poin)
- Item yang nonaktif otomatis tidak muncul di halaman katalog publik, dan halaman detailnya mengembalikan status tidak ditemukan. (3 poin)
- Aksi pengubahan status diverifikasi aman di sisi server. (3 poin)

### US-33 Pencarian & Paginasi di Panel Admin

Sebagai admin yang mengelola puluhan data kelinci dan paket perawatan, saya ingin fitur pencarian cepat dan paginasi di tabel admin agar tidak perlu menggulir halaman terlalu panjang.

Bernilai 10 poin.

Kriteria selesai:

- Kolom pencarian di `/admin` menyaring data item melalui query server database. (4 poin)
- Daftar item di admin terpaginasi rapi. (3 poin)
- Parameter pencarian dan nomor halaman tersimpan di query URL peramban. (3 poin)

### US-34 Validasi Server-Side Form Kelinci & Layanan

Sebagai admin, saya ingin sistem memvalidasi seluruh input data sebelum disimpan (misal harga tidak boleh minus, nama kelinci wajib diisi), supaya data katalog tidak rusak.

Bernilai 10 poin.

Kriteria selesai:

- Server Action memvalidasi ketat seluruh input: nama wajib diisi, harga berupa angka valid non-negatif. (4 poin)
- Pesan galat spesifik ditampilkan tepat di bawah kolom input yang bermasalah. (3 poin)
- Nilai form yang sudah diisi pengguna tidak hilang saat validasi gagal. (3 poin)

### US-35 Ekspor Data Katalog & Adopsi ke CSV

Sebagai pemilik Petskarta, saya ingin mengunduh seluruh data kelinci adopsi dan tarif layanan ke dalam file CSV untuk arsip pembukuan atau pelaporan berkala.

Bernilai 10 poin.

Kriteria selesai:

- Tersedia tombol "Ekspor CSV" di panel admin yang mengunduh seluruh data katalog. (4 poin)
- Berkas CSV diproduksi di sisi server dengan sanitasi karakter pemisah yang aman. (3 poin)
- Endpoint ekspor hanya dapat diakses oleh sesi admin yang terautentikasi. (3 poin)

### US-36 Histori Terakhir Dilihat

Sebagai pengunjung yang membandingkan beberapa kelinci, saya ingin melihat bagian "Baru Saja Anda Lihat" di bagian bawah layar agar mudah kembali ke kelinci yang sempat saya minati.

Bernilai 5 poin.

Kriteria selesai:

- ID kelinci/layanan yang dibuka disimpan secara lokal di browser pengunjung dengan batasan jumlah (misal maksimal 4 item). (3 poin)
- Seksi "Terakhir Dilihat" tampil di beranda/detail dan otomatis tersembunyi bila belum ada riwayat. (2 poin)

### US-37 Komparasi Spesifikasi Kelinci Hias / Layanan

Sebagai calon adopter, saya ingin membandingkan dua kelinci hias (misal ras *Holland Lop* vs *Netherland Dwarf*) berdampingan dari segi foto, kisaran harga, karakter, dan kebutuhan perawatannya, supaya saya bisa memilih hewan yang paling cocok untuk keluarga saya.

Bernilai 15 poin.

Kriteria selesai:

- Pengunjung dapat memilih 2 item untuk dimasukkan ke fitur perbandingan. (4 poin)
- Halaman komparasi menyajikan tabel komparasi berdampingan: foto, ras/nama, harga, kategori, dan detail deskripsi. (4 poin)
- Sistem menolak pemilihan lebih dari 2 item dengan pesan informatif atau menggantikan item paling lama. (4 poin)
- Menangani item yang sudah tidak ada dengan pesan yang jelas. (3 poin)

### US-38 Trust Center: Penampil Rating 5.0 Google Reviews & Testimoni Pelanggan

Sebagai calon pelanggan yang khawatir terhadap isu penipuan atau kabar toko tutup di Google, saya ingin melihat *Trust Center* yang menampilkan bukti rating sempurna **Google Reviews 5.0 (178+ Ulasan)**, kutipan ulasan pelanggan nyata, serta form untuk menambahkan ulasan pengalaman adopsi/layanan di Petskarta.

Bernilai 15 poin.

Kriteria selesai:

- Halaman beranda dan detail menampilkan lencana ulasan Google Bintang 5.0 dengan kutipan ulasan autentik mengenai keamanan pengiriman luar kota, hotel ber-AC, dan kesembuhan scabies. (4 poin)
- Tersedia form pengiriman ulasan (nama, rating 1–5 bintang, ulasan teks) yang diproses melalui Server Action dengan validasi server. (4 poin)
- Ulasan yang masuk tersimpan di database dan rata-rata rating terhitung secara dinamis. (4 poin)
- Dilengkapi pengamanan anti-spam dasar (validasi panjang karakter dan honeypot/rate limiting). (3 poin)

### US-39 Moderasi Testimoni & Ulasan di Admin

Sebagai admin Petskarta, saya ingin meninjau dan memoderasi ulasan yang masuk sebelum ditampilkan ke publik, agar terhindar dari spam atau konten tidak pantas.

Bernilai 10 poin.

Kriteria selesai:

- Panel admin menyediakan antarmuka untuk melihat seluruh ulasan yang masuk. (4 poin)
- Admin dapat menyembunyikan atau menghapus ulasan yang bermasalah secara aman. (3 poin)
- Ulasan yang disembunyikan otomatis tidak muncul di halaman publik dan tidak dihitung dalam rating rata-rata. (3 poin)

### US-40 Pelacakan Klik Booking WhatsApp per Cabang & Layanan

Sebagai pemilik Petskarta, saya ingin mencatat setiap kali pengunjung menekan tombol booking WhatsApp beserta cabang tujuan dan jenis layanannya, supaya saya memahami tren minat pelanggan (apakah lebih ramai penitipan hotel atau adopsi kelinci).

Bernilai 10 poin.

Kriteria selesai:

- Klik tombol booking WhatsApp tercatat ke tabel database (mencakup ID item, nama layanan, cabang tujuan, dan cap waktu). (4 poin)
- Pencatatan dilakukan secara asinkron tanpa menunda pengalihan pengguna ke aplikasi WhatsApp. (3 poin)
- Sistem tidak mengumpulkan atau menyimpan data pribadi pengunjung yang melanggar privasi. (3 poin)

### US-41 Analitik Permintaan Layanan Terpopuler di Dashboard

Sebagai pemilik Petskarta, saya ingin melihat statistik layanan atau kelinci yang paling banyak memicu klik booking WhatsApp, terutama untuk memprediksi lonjakan reservasi Bunny Hotel saat musim liburan/Lebaran.

Bernilai 10 poin.

Kriteria selesai:

- Dasbor admin menampilkan 5 layanan atau kelinci dengan klik booking tertinggi berdasarkan data riil pelacakan. (4 poin)
- Terdapat metrik perbandingan pemesanan antar kategori layanan. (3 poin)
- Jika belum ada data transaksi/klik, dasbor menampilkan visualisasi kondisi kosong yang rapi. (3 poin)

### US-42 Banner Pengumuman Musim Libur / Slot Pet Hotel Lebaran

Sebagai admin Petskarta, saya ingin memasang banner peringatan penting di bagian atas website (contoh: "Pemberitahuan: Petskarta Buka Normal & Reservasi Bunny Hotel Mudik Lebaran 2026 Tersisa 5 Kamar!"), supaya calon pelanggan segera melakukan reservasi.

Bernilai 10 poin.

Kriteria selesai:

- Admin dapat mengaktifkan, mengubah teks, dan menonaktifkan banner pengumuman dari panel admin dengan verifikasi sesi server. (4 poin)
- Banner aktif tampil mencolok di bagian atas halaman beranda publik. (3 poin)
- Banner yang dinonaktifkan otomatis menghilang dari tampilan publik. (3 poin)

### US-43 Pengaturan Multi-Cabang & Kontak WhatsApp dari Admin

Sebagai pemilik Petskarta, saya ingin memperbarui nomor WhatsApp cabang Pondok Pinang dan cabang Jatinegara, jam operasional, serta alamat tanpa perlu mengubah kode sumber.

Bernilai 15 poin.

Kriteria selesai:

- Halaman pengaturan admin memungkinkan pembaruan nama bisnis, nomor WhatsApp Cabang 1 (Pondok Pinang), nomor WhatsApp Cabang 2 (Jatinegara), jam buka, dan alamat yang tersimpan di database. (4 poin)
- Tombol pemesanan WhatsApp publik secara dinamis menggunakan nomor aktif dari pengaturan ini (dengan konfigurasi `lib/toko.js` sebagai nilai cadangan). (4 poin)
- Informasi kontak di seluruh halaman publik (header, footer, direktori cabang) otomatis sinkron dengan data database. (4 poin)
- Nomor WhatsApp divalidasi ke format internasional standar dan aksi pengubahan terproteksi login. (3 poin)

### US-44 Manajemen Akses Admin Multi-Cabang

Sebagai super admin Petskarta, saya ingin mendaftarkan staf admin cabang (misal admin khusus Jatinegara) agar tugas pengelolaan status kamar dan respon pemesanan dapat didelegasikan dengan aman.

Bernilai 15 poin.

Kriteria selesai:

- Super admin dapat menambahkan pengguna admin baru melalui Supabase Auth dari panel admin. (4 poin)
- Daftar staf admin terdaftar dapat dipantau di halaman admin. (4 poin)
- Admin dapat menonaktifkan akun staf lain tanpa dapat menghapus akunnya sendiri. (4 poin)
- Seluruh manajemen hak akses diverifikasi ketat di sisi server. (3 poin)

### US-45 Audit Log Aktivitas Perubahan Admin

Sebagai pemilik Petskarta, saya ingin memantau catatan riwayat (*audit trail*) siapa yang mengubah data kelinci, menambah tarif kamar hotel, atau mengubah pengaturan toko, demi akuntabilitas operasional.

Bernilai 10 poin.

Kriteria selesai:

- Setiap operasi penambahan, perubahan, atau penghapusan data mencatat data log: email admin, jenis aksi, ID item, dan cap waktu. (4 poin)
- Halaman admin menyediakan tampilan 50 aktivitas terakhir secara kronologis. (3 poin)
- Akses ke riwayat log terlindungi ketat hanya untuk admin yang berhak. (3 poin)

### US-46 Impor Data Massal Kelinci & Produk dari CSV

Sebagai admin Petskarta, saat menerima kedatangan anakan kelinci baru dari breeder mitra dalam jumlah banyak, saya ingin mengunggah file CSV agar puluhan data kelinci langsung masuk ke katalog tanpa input manual satu per satu.

Bernilai 15 poin.

Kriteria selesai:

- Tersedia form unggah file CSV di panel admin dengan validasi otentikasi server. (4 poin)
- Sistem memvalidasi setiap baris data (nama, harga, kategori) dan memberikan laporan spesifik jika ada baris yang formatnya keliru. (4 poin)
- Baris data yang valid tersimpan secara kolektif ke database Supabase. (4 poin)
- Menampilkan ringkasan hasil impor (jumlah data berhasil dan jumlah data gagal). (3 poin)

### US-47 Atur Urutan Tampil Prioritas Katalog

Sebagai admin Petskarta, saya ingin menentukan kelinci atau paket layanan mana yang muncul paling atas di halaman beranda (misal memprioritaskan kelinci yang siap adopt minggu ini atau promo Bunny Hotel).

Bernilai 10 poin.

Kriteria selesai:

- Database memiliki kolom penentu urutan (urutan prioritas). (4 poin)
- Admin dapat menaikkan atau menurunkan posisi urutan tampilan suatu item dari panel admin. (3 poin)
- Tampilan katalog beranda publik mematuhi konfigurasi urutan prioritas tersebut. (3 poin)

### US-48 Varian Paket Layanan & Kamar Hotel

Sebagai pemilik kelinci yang ingin memesan Bunny Hotel, saya ingin memilih varian paket kamar (misal: "Kamar Standard Kipas", "Kamar Deluxe AC", "Kamar VIP AC + CCTV") atau varian grooming ("Grooming Sehat Reguler", "Grooming Kutu & Jamur", "Paket Scabies Healer Tuntas") dengan tarif yang otomatis menyesuaikan.

Bernilai 15 poin.

Kriteria selesai:

- Terdapat struktur data varian layanan (nama varian dan penyesuaian harga). (4 poin)
- Admin dapat mengatur opsi varian pada masing-masing item layanan. (4 poin)
- Halaman detail menampilkan pemilih varian interaktif dan harga total langsung terbarui sesuai varian yang dipilih. (4 poin)
- Pesan WhatsApp yang dibuat memuat secara gamblang nama varian paket beserta tarif resminya. (3 poin)

### US-49 Halaman Khusus per Kategori Layanan / Adopsi

Sebagai calon pelanggan yang hanya berminat mengadopsi kelinci atau hanya butuh penitipan hewan, saya ingin membuka URL khusus kategori (misal `/kategori/kelinci-hias` atau `/kategori/bunny-hotel`) yang dapat dibagikan langsung dan diindeks secara mandiri oleh mesin pencari Google.

Bernilai 10 poin.

Kriteria selesai:

- Halaman dinamis `/kategori/[slug]` menyajikan item yang sesuai kategori dari database Supabase. (4 poin)
- URL kategori yang tidak terdaftar menampilkan halaman tidak ditemukan yang sesuai. (3 poin)
- Badge atau tag kategori pada kartu katalog tertaut langsung menuju halaman kategori masing-masing. (3 poin)

### US-50 Asisten AI Konsultasi Perawatan Kelinci Petskarta

Sebagai calon pemelihara kelinci pemula, saya ingin berkonsultasi langsung melalui kotak tanya-jawab interaktif bertenaga AI di situs mengenai pemilihan ras kelinci ramah anak, panduan pemberian pakan *timothy hay*, gejala awal penyakit *scabies*, atau fasilitas *Bunny Hotel* Petskarta, sebelum saya memutuskan untuk menghubungi admin WhatsApp.

Bernilai 15 poin.

Kriteria selesai:

- Kotak dialog interaktif asisten AI tersedia di halaman detail atau beranda. (4 poin)
- Integrasi ke LLM (Google Gemini API) dieksekusi murni di sisi server dengan *knowledge base* yang dibatasi pada informasi kelinci, produk, dan layanan Petskarta. (4 poin)
- Input pertanyaan dibatasi panjang karakternya, serta dilengkapi penanganan kondisi batas (*error/timeout*) yang elegan. (4 poin)
- Dilengkapi mekanisme pembatasan frekuensi (*rate limiting*) agar tidak disalahgunakan. (3 poin)

### US-51 Tampilan Seluruh Katalog Admin & Produk Terbaru Paling Atas

Sebagai admin Petskarta, saya ingin melihat seluruh produk dan layanan tanpa pembagian halaman (tanpa paginasi) di tabel manajemen admin, serta memastikan setiap produk yang baru ditambahkan langsung muncul di posisi paling atas, agar mempermudah verifikasi cepat terhadap kelinci atau paket layanan yang baru saja didaftarkan.

Bernilai 10 poin.

Kriteria selesai:

- Tabel katalog produk dan layanan di panel admin `/admin` menampilkan seluruh item secara langsung tanpa paginasi (no pagination). (4 poin)
- Query data produk di panel admin diurutkan berdasarkan item terbaru terlebih dahulu (`created_at` DESC dan `id` DESC) sehingga produk yang baru ditambahkan langsung berada di urutan teratas. (3 poin)
- Filter pencarian cepat tetap berfungsi menyaring seluruh daftar produk secara instan dan menampilkan jumlah total item yang ditemukan. (3 poin)

