# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Hubungkan halaman beranda `/` ke tabel `produk` di database Supabase menggunakan Server Component. Tampilkan daftar kelinci hias (Holland Lop, Netherland Dwarf), paket Bunny Hotel, layanan Grooming / Scabies Healer, dan aksesoris/pakan dengan foto, nama, kategori, dan format harga rupiah standar. Hapus penggunaan data contoh statis dan komponen CatatanBelumAktif.

**Hasil:**
- Halaman beranda `app/page.jsx` kini mengambil data langsung dari tabel `produk` di database Supabase menggunakan `createServerClient()`.
- Setiap kartu produk menampilkan gambar, nama, kategori, harga berformat Rupiah via `formatRupiah()`, dan tautan menuju detail produk.
- Komponen `CatatanBelumAktif` dihapus dan diganti dengan fallback pesan ramah jika belum ada data produk di database.

**Perbaikan:**
- Menangani kondisi jika koneksi database gagal dengan menampilkan komponen pesan error yang ramah pengguna tanpa membocorkan rincian error internal teknis.

## US-02 Detail produk

**Prompt:**
Buat halaman detail produk `/produk/[id]` yang mengambil data item langsung dari Supabase berdasarkan parameter URL `id`. Tampilkan foto besar, kategori, nama, harga terformat, dan spesifikasi detail kelinci atau fasilitas Bunny Hotel. Jika ID tidak ditemukan, tampilkan halaman 404 informatif dengan tautan kembali ke katalog.

**Hasil:**
- Membuat rute dinamis `app/produk/[id]/page.jsx` dengan pengambilan data di server (`params` di-await sesuai aturan Next.js 16).
- Menyajikan spesifikasi mendalam seperti informasi ras, pakan timothy hay gratis, sirkulasi ruangan AC, fasilitas foot rest plastik, dan garansi kesehatan kelinci.
- Menggunakan fungsi `notFound()` untuk mengalihkan ID yang tidak valid ke halaman `app/not-found.jsx`.

**Perbaikan:**
- Mengatasi perubahan Next.js 16 di mana `params` adalah Promise dengan menggunakan `const { id } = await params`.

## US-03 Pesan via WhatsApp

**Prompt:**
Tambahkan tombol pemesanan WhatsApp otomatis di halaman detail produk `/produk/[id]` dan beranda yang langsung menghubungkan pengunjung ke nomor resmi Petskarta dengan pesan terformat otomatis berisi nama produk, kategori, dan harga.

**Hasil:**
- Mengintegrasikan nomor resmi Petskarta dari `lib/toko.js` dan pengaturan toko dinamis.
- Membuat fungsi generator tautan WhatsApp yang menyusun template pesan rapi: "Halo Admin Petskarta, saya ingin pesan/booking: [Nama Produk] seharga [Harga]...".
- Tautan bekerja mulus di ponsel (membuka aplikasi WhatsApp) maupun komputer desktop (WhatsApp Web).

**Perbaikan:**
- Melakukan encoding karakter URL (`encodeURIComponent`) pada spasi dan baris baru agar format pesan tidak terpotong di peramban seluler.

## US-04 Login admin

**Prompt:**
Bangun fitur login admin di `/admin/login` menggunakan Supabase Auth di sisi server (Server Action). Jika email dan password benar, alihkan ke `/admin`. Jika salah, tampilkan pesan galat ramah. Sediakan juga tombol Keluar (Logout) yang membersihkan sesi auth.

**Hasil:**
- Membuat form login di `app/admin/login/page.jsx` yang memanggil Server Action `loginAction` di `app/actions/auth.js`.
- Menggunakan `supabase.auth.signInWithPassword()` dengan cookie storage di server (`@supabase/ssr`).
- Menambahkan tombol Logout di navigasi admin yang memanggil `logoutAction` dan mengembalikan admin ke `/admin/login`.

**Perbaikan:**
- Memastikan pesan error login bersifat umum ("Email atau password salah") agar tidak membocorkan keberadaan akun email ke pihak luar (mencegah user enumeration).

## US-05 Ganti password

**Prompt:**
Buat fitur ganti kata sandi di halaman `/admin/password` bagi admin yang sudah login. Validasi password baru minimal 8 karakter dan harus cocok dengan konfirmasi password. Tampilkan notifikasi berhasil atau gagal.

**Hasil:**
- Membuat `app/admin/password/page.jsx` dan Server Action `gantiPasswordAction`.
- Memeriksa sesi login admin di sisi server sebelum memanggil `supabase.auth.updateUser({ password })`.
- Form memvalidasi panjang minimal 8 karakter serta kesesuaian antara password baru dan konfirmasi password.

**Perbaikan:**
- Menambahkan indikator status visual (sukses/gagal) dan membersihkan input form password setelah pembaruan berhasil.

## US-06 Proteksi halaman admin

**Prompt:**
Proteksi seluruh rute di bawah `/admin` (kecuali `/admin/login`) dan seluruh Server Action agar hanya dapat diakses oleh admin yang memiliki sesi valid di Supabase. Alihkan pengunjung tanpa login ke `/admin/login`.

**Hasil:**
- Menerapkan pengalihan rute di `proxy.js` (Next.js 16) untuk memeriksa sesi Supabase auth pada setiap request menuju `/admin/*`.
- Memasang fungsi verifikasi auth `createAuthServerClient()` pada setiap halaman admin Server Component (`app/admin/page.jsx`, `app/admin/password/page.jsx`, dsb.).
- Memasang validasi auth di awal setiap Server Action pembuat/pengubah data produk dan pengaturan.

**Perbaikan:**
- Mengganti pemanggilan `createServerClient()` (service key tanpa cookie auth) menjadi `createAuthServerClient()` yang membaca session cookies sehingga status login staf admin terbaca presisi tanpa mental ke halaman login.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## US-07 Daftar Kelinci & Layanan di Panel Admin

**Prompt:**
Tampilkan seluruh daftar kelinci siap adopsi, paket Bunny Hotel, dan layanan grooming di halaman `/admin` yang langsung diambil dari database Supabase dengan informasi thumbnail, nama, kategori, harga, dan tanggal ditambahkan.

**Hasil:**
- Membuat komponen `TabelProduk.jsx` di dalam `app/admin/page.jsx` yang menampilkan data riil dari Supabase.
- Setiap baris dilengkapi dengan thumbnail foto, badge kategori, format harga rupiah, dan tanggal dibuat.

**Perbaikan:**
- Memberikan penanganan fallback gambar apabila URL foto produk tidak dapat diakses atau kosong.

## US-08 Tambah Kelinci Adopsi atau Layanan Baru

**Prompt:**
Buat form di `/admin/produk/baru` untuk mendaftarkan kelinci hias baru yang siap diadopsi atau menambahkan paket perawatan/hotel baru ke database Supabase melalui Server Action yang terproteksi.

**Hasil:**
- Membangun halaman `app/admin/produk/baru/page.jsx` dan Server Action `tambahProdukAction`.
- Form mendukung input nama, kategori, harga, foto_url, dan deskripsi lengkap.
- Setelah berhasil, pengguna otomatis dialihkan kembali ke `/admin` dengan data baru langsung muncul.

**Perbaikan:**
- Memvalidasi bahwa harga tidak boleh bernilai negatif atau nol dan nama produk tidak boleh hanya berisi spasi kosong.

## US-09 Ubah Data Kelinci atau Tarif Layanan

**Prompt:**
Buat fitur edit produk di `/admin/produk/[id]/ubah` agar admin dapat memperbarui ketersediaan kelinci, foto, atau tarif musiman Bunny Hotel.

**Hasil:**
- Membangun rute dinamis `app/admin/produk/[id]/ubah/page.jsx` dengan data awal yang otomatis terisi dari database.
- Menyediakan Server Action `ubahProdukAction` untuk memperbarui baris data di tabel `produk`.
- Memastikan hak akses admin divalidasi di sisi server sebelum perubahan disimpan.

**Perbaikan:**
- Menggunakan `revalidatePath` pada halaman detail dan halaman katalog beranda agar perubahan langsung terlihat tanpa perlu hard refresh.

## US-10 Hapus Item Kelinci atau Layanan

**Prompt:**
Tambahkan tombol hapus produk dengan dialog konfirmasi di tabel admin untuk menghapus kelinci yang sudah diadopsi atau layanan yang tidak aktif secara aman dari database.

**Hasil:**
- Menambahkan tombol aksi Hapus di `components/TabelProduk.jsx` dengan dialog konfirmasi `window.confirm`.
- Mengimplementasikan Server Action `hapusProdukAction` yang menghapus baris dari tabel `produk` setelah memverifikasi sesi login admin.

**Perbaikan:**
- Memastikan state UI langsung terbarui setelah produk dihapus dan menampilkan notifikasi toast sukses.

## US-11 Filter Kategori Layanan & Pencarian Cepat

**Prompt:**
Sediakan fitur filter kategori dan input pencarian cepat pada katalog beranda sehingga calon adopter dapat langsung memfilter ras kelinci atau paket Bunny Hotel.

**Hasil:**
- Mengembangkan komponen `KatalogInteraktif.jsx` yang mengelola pencarian instan dan tab filter kategori di sisi klien.
- Menampilkan jumlah hasil pencarian yang ditemukan secara real-time.

**Perbaikan:**
- Menambahkan tombol reset pencarian ("Tampilkan Semua") saat tidak ada produk yang cocok dengan kata kunci.

## US-12 Form Booking Interaktif & Varian Layanan

**Prompt:**
Buat form booking interaktif di halaman detail yang memungkinkan calon adopter memilih cabang tujuan (Pondok Pinang vs Jatinegara), tanggal reservasi/kunjungan, dan catatan kebutuhan khusus hewan, lalu otomatis menyusun teks WhatsApp.

**Hasil:**
- Membuat komponen form booking interaktif di halaman detail produk.
- Form otomatis mengompilasi pilihan cabang, tanggal booking, dan catatan khusus ke dalam format chat WhatsApp yang rapi dan terstruktur.

**Perbaikan:**
- Memvalidasi bahwa tanggal booking minimal adalah hari ini agar pengguna tidak memilih tanggal di masa lampau.

## US-13 PWA Petskarta di Layar Ponsel

**Prompt:**
Konfigurasikan Progressive Web App (PWA) lengkap dengan manifest web app dan ikon dalam berbagai ukuran agar aplikasi dapat dipasang di layar ponsel pengguna.

**Hasil:**
- Membuat berkas `public/manifest.json` dengan konfigurasi nama, tema warna `#1f6b4f`, ikon, dan display `standalone`.
- Menyediakan set ikon lengkap di `public/icons/` dan menghubungkannya di `app/layout.jsx`.

**Perbaikan:**
- Menambahkan meta tag `theme-color` dan `apple-mobile-web-app-capable` untuk mendukung tampilan native di perangkat iOS Safari.

## US-14 Generator Deskripsi Kelinci & Layanan Berbasis AI

**Prompt:**
Tambahkan tombol generator deskripsi otomatis berbasis AI (Google Gemini API) di form admin tambah/ubah produk untuk membuat deskripsi karakteristik kelinci atau keunggulan kamar hotel secara instan.

**Hasil:**
- Membuat Server Action `generateDeskripsiAIAction` yang memanggil Google Gemini API dari server tanpa mengekspos API key ke browser.
- Tombol AI di form admin otomatis mengisi kolom deskripsi dengan teks profesional yang ramah hewan dan dapat diedit kembali oleh admin.

**Perbaikan:**
- Menghubungkan variabel environment `LLM_GEMINI_API_KEY` dan menerapkan multi-model fallback cascade (`gemini-3.1-flash-lite-preview`, `gemini-3.5-flash`, `gemini-3-flash-preview`, `gemini-2.5-flash`) sehingga pembuatan copy deskripsi produk selalu berhasil stabil.

## US-15 Urutkan Katalog Petskarta

**Prompt:**
Tambahkan dropdown pengurutan katalog di beranda berdasarkan harga termurah, harga termahal, dan item terbaru yang dieksekusi di database server.

**Hasil:**
- Menambahkan parameter query `urut` pada URL beranda (`termurah`, `termahal`, `terbaru`).
- Menyesuaikan query Supabase di `app/page.jsx` dengan `.order("harga", { ascending: ... })` atau `.order("created_at", { ascending: false })`.

**Perbaikan:**
- Memastikan pilihan urutan tetap tersimpan saat pengguna berpindah halaman paginasi.

## US-16 Paginasi & Pengambilan Data Efisien

**Prompt:**
Terapkan paginasi server-side menggunakan metode range Supabase (`limit` & `range`) pada katalog beranda agar beban muat halaman tetap ringan dan cepat.

**Hasil:**
- Mengimplementasikan pemotongan 6 produk per halaman menggunakan `.range(from, to)` pada kueri server di `app/page.jsx`.
- Menampilkan komponen kontrol paginasi dengan nomor halaman aktif, tombol sebelumnya, dan tombol selanjutnya.

**Perbaikan:**
- Memastikan perhitungan total halaman memperhitungkan jumlah total produk dari Supabase (`{ count: "exact" }`).

## US-17 Rekomendasi Perlengkapan Starter Kit / Layanan Terkait

**Prompt:**
Tampilkan seksi rekomendasi perlengkapan starter kit atau layanan terkait di halaman detail produk agar adopter baru langsung melihat pakan atau kandang yang cocok.

**Hasil:**
- Menambahkan query server di `app/produk/[id]/page.jsx` untuk mengambil 3 produk lain dengan kategori serupa atau kategori perlengkapan.
- Mengecualikan item yang sedang aktif dibuka dari daftar rekomendasi.

**Perbaikan:**
- Menata tata letak kartu rekomendasi secara responsif (1 kolom di seluler, 3 kolom di desktop).

## US-18 Galeri Multi-Foto Kelinci & Fasilitas Kamar Hotel

**Prompt:**
Sediakan fitur galeri multi-foto pada halaman detail produk sehingga pengunjung dapat melihat kelinci atau ruangan Bunny Hotel dari berbagai sudut.

**Hasil:**
- Mendukung pemisahan URL gambar di deskripsi atau metadata produk.
- Membuat komponen galeri interaktif dengan tampilan foto utama besar dan deretan thumbnail yang dapat diklik untuk berganti foto.

**Perbaikan:**
- Memberikan transisi gambar yang halus dan mempertahankan rasio aspek gambar agar foto kelinci tidak terdistorsi.

## US-19 Status Ketersediaan Real-Time (Ready Adopsi / Kamar Penuh)

**Prompt:**
Tambahkan indikator status ketersediaan pada produk (Ready Adopsi / Teradopsi / Kamar Penuh). Jika kamar penuh atau kelinci teradopsi, alihkan tombol pesan menjadi tombol konsultasi daftar tunggu.

**Hasil:**
- Menambahkan badge visual ketersediaan pada kartu katalog dan halaman detail.
- Menyesuaikan teks tombol WhatsApp dan isi pesan otomatis menjadi konsultasi antrean jika status item tidak tersedia.

**Perbaikan:**
- Membedakan warna badge: hijau untuk Siap Adopsi/Tersedia, dan abu-abu/kuning untuk Teradopsi/Penuh.

## US-20 Badge Kepercayaan & Promo Musim Liburan (Mudik Lebaran)

**Prompt:**
Tampilkan badge promo khusus (misal "Promo Mudik Lebaran") serta harga coret pada paket layanan atau kelinci yang sedang diskon.

**Hasil:**
- Mendukung parsing format diskon atau promo musiman pada katalog produk.
- Menampilkan harga asli tercoret di samping harga promo dengan badge diskon yang mencolok.

**Perbaikan:**
- Memastikan kalkulasi penghematan tampil jelas dalam format persentase atau nominal rupiah.

## US-21 Multi-Booking & Keranjang Pemesanan via WhatsApp

**Prompt:**
Bangun fitur keranjang belanja multi-item yang memungkinkan pengunjung memilih beberapa kelinci, pakan, dan layanan grooming sekaligus, lalu mengirimkan seluruh daftar pesanan dalam satu pesan WhatsApp terpadu.

**Hasil:**
- Membuat modul state keranjang berbasis browser localStorage (`components/KeranjangDrawer.jsx`).
- Pengunjung dapat menambah jumlah item, menghapus item, dan melihat total biaya secara langsung.
- Satu tombol kirim WhatsApp otomatis menyusun daftar rincian barang, total harga, dan tautan konfirmasi pesanan.

**Perbaikan:**
- Mempertahankan isi keranjang saat pengguna menavigasi antar halaman katalog tanpa terjadi layout shift.

## US-22 Direktori Cabang Resmi & Hub Ekosistem Petskarta

**Prompt:**
Buat halaman direktori cabang `/cabang` yang menjelaskan status operasional 2 cabang resmi aktif (Pondok Pinang Jaksel dan Jatinegara Jaktim), klarifikasi status tutup permanen Google Maps, panduan rute Maps, dan tautan akun media sosial resmi.

**Hasil:**
- Membangun halaman `app/cabang/page.jsx` dengan informasi lengkap alamat, jam operasional, layanan unggulan masing-masing cabang, dan tombol navigasi Google Maps.
- Menampilkan klarifikasi status "Aktif Beroperasi Penuh" serta hub tautan ke Shopee, TikTok, dan Instagram resmi.

**Perbaikan:**
- Menambahkan banner informatif di header beranda yang mengarahkan pengunjung ke halaman direktori cabang resmi.

## US-23 Bagikan / Salin Tautan Profil Kelinci & Layanan

**Prompt:**
Tambahkan tombol bagikan pada halaman detail kelinci/layanan yang memanfaatkan Web Share API atau fitur salin tautan clipboard dengan notifikasi instan.

**Hasil:**
- Menyediakan tombol "Bagikan" di halaman detail produk yang otomatis membuka dialog native share pada ponsel atau menyalin tautan ke papan klip di desktop.
- Menampilkan status visual "Tautan Tersalin!" selama beberapa detik setelah diklik.

**Perbaikan:**
- Memberikan penanganan fallback menggunakan `navigator.clipboard.writeText` jika Web Share API tidak didukung oleh peramban pengguna.

## US-24 Simpan Kelinci & Layanan Favorit (Wishlist)

**Prompt:**
Buat fitur wishlist tanpa login di mana pengguna dapat menandai kelinci atau layanan favorit menggunakan ikon hati dan melihat daftar favorit tersebut kapan saja.

**Hasil:**
- Membuat sistem penyimpanan ID item favorit di localStorage peramban.
- Menambahkan tombol ikon hati interaktif di kartu produk dan halaman detail.
- Menyediakan filter cepat untuk menampilkan hanya item yang telah difavoritkan.

**Perbaikan:**
- Memastikan status ikon hati langsung sinkron di seluruh komponen tanpa perlu memuat ulang halaman.

## US-25 Mode Gelap Ramah Mata (Dark Mode)

**Prompt:**
Terapkan fitur Dark Mode dengan sakelar toggle di header yang menyimpan preferensi tema pengguna di localStorage dan mencegah kedipan putih saat halaman dimuat (anti-FOUC).

**Hasil:**
- Menambahkan script inisialisasi tema di `public/theme.js` yang dieksekusi sebelum rendering halaman untuk mendeteksi preferensi tema.
- Menyediakan tombol sakelar mode gelap/terang di `components/Header.jsx`.
- Mengonfigurasi token warna Tailwind CSS agar seluruh teks, kartu, dan tombol memiliki kontras yang nyaman di kedua mode.

**Perbaikan:**
- Menghapus penggunaan `dangerouslySetInnerHTML` dan memindahkan logika tema ke berkas statis `public/theme.js` guna mematuhi standar keamanan CSP.

## US-26 Optimasi Metadata SEO & Open Graph Petskarta

**Prompt:**
Optimalkan metadata SEO dan tag Open Graph pada halaman detail produk dan beranda menggunakan `generateMetadata` Next.js agar tautan yang dibagikan ke WhatsApp dan media sosial memuat preview foto dan deskripsi yang menarik.

**Hasil:**
- Menambahkan fungsi `generateMetadata` dinamis di `app/produk/[id]/page.jsx` yang menyusun title, description, dan gambar Open Graph dari data produk Supabase.
- Menyediakan metadata dasar toko yang kaya kata kunci pada `app/layout.jsx`.

**Perbaikan:**
- Memastikan URL gambar Open Graph menggunakan format absolut yang valid agar preview media sosial dapat merender gambar dengan tepat.

## US-27 Structured Data Schema (`LocalBusiness` / `PetStore`) & Sitemap

**Prompt:**
Tambahkan data terstruktur Schema.org (JSON-LD) bertipe PetStore dan berkas sitemap.xml serta robots.txt dinamis untuk mempercepat pengindeksan bot mesin pencari Google.

**Hasil:**
- Menyematkan data terstruktur JSON-LD Schema.org (`PetStore` & `LocalBusiness`) di `app/layout.jsx` yang mencakup dua cabang, jam buka, dan rating 5.0.
- Membuat berkas dinamis `app/sitemap.js` dan konfigurasi `app/robots.js`.

**Perbaikan:**
- Menyematkan schema JSON-LD secara aman sebagai anak teks React murni tanpa menggunakan `dangerouslySetInnerHTML`.

## US-28 Halaman 404 Kustom & Skeleton Loading

**Prompt:**
Desain halaman 404 ramah pengguna bertema hewan peliharaan kelinci serta animasi skeleton loading saat data katalog sedang diambil dari database.

**Hasil:**
- Membuat `app/not-found.jsx` dengan ilustrasi kelinci, pesan ramah, dan tombol kembali ke beranda.
- Membuat skeleton placeholder animasi berkedip halus di `components/SkeletonKatalog.jsx` saat data produk sedang dimuat.

**Perbaikan:**
- Memastikan halaman 404 mematuhi tata letak utama dengan header dan footer toko yang tetap berfungsi normal.

## US-29 Unggah Foto Kelinci & Fasilitas ke Supabase Storage

**Prompt:**
Sediakan fitur unggah foto kelinci dan fasilitas kamar hotel langsung dari komputer/HP ke bucket Supabase Storage melalui Server Action di form admin.

**Hasil:**
- Membuat Server Action `unggahFotoAction` yang menerima input file `multipart/form-data`, memvalidasi tipe MIME gambar (jpg, png, webp), dan mengunggahnya ke bucket Supabase Storage.
- URL publik berkas gambar otomatis mengisi kolom `foto_url` pada formulir produk.

**Perbaikan:**
- Menambahkan pembatasan ukuran berkas maksimal 2MB dan menghasilkan nama file unik berbasis timestamp acak untuk mencegah konflik nama berkas.

## US-30 Dashboard Analitik Ringkasan Petskarta

**Prompt:**
Buat dashboard analitik di halaman `/admin` yang menampilkan statistik total katalog aktif, jumlah item per kategori, total minat booking WhatsApp, dan trafik per cabang.

**Hasil:**
- Menampilkan kartu ringkasan metrik analitik di bagian atas panel admin `app/admin/page.jsx`.
- Menyajikan rincian jumlah item per kategori (Kelinci Hias, Bunny Hotel, Grooming/Scabies, Aksesoris) dan statistik klik booking WhatsApp.

**Perbaikan:**
- Memastikan kueri ringkasan dieksekusi secara efisien menggunakan agregasi count server Supabase.

## US-31 Manajemen Kategori Layanan & Produk

**Prompt:**
Buat halaman manajemen kategori di `/admin/kategori` agar admin dapat menambah, mengedit, dan menghapus kategori produk secara dinamis.

**Hasil:**
- Membangun halaman `app/admin/kategori/page.jsx` dan Server Action `kategoriAction`.
- Admin dapat mendaftarkan kategori baru, mengubah nama kategori, serta menghapus kategori yang tidak lagi digunakan.

**Perbaikan:**
- Memberikan peringatan pencegahan jika admin mencoba menghapus kategori yang masih digunakan oleh produk aktif.

## US-32 Sembunyikan Kelinci Teradopsi / Arsip Layanan

**Prompt:**
Tambahkan fitur untuk mengarsipkan atau menyembunyikan kelinci yang sudah teradopsi tanpa menghapus riwayat datanya dari database.

**Hasil:**
- Menambahkan tombol aksi Arsip/Pulihkan di tabel produk admin.
- Item berstatus arsip otomatis difilter dari katalog publik di `app/page.jsx` dan tidak dapat diakses publik, namun tetap tersimpan di database admin.

**Perbaikan:**
- Menggunakan penanda tag status terstruktur sehingga data lama tetap utuh dan dapat dipulihkan sewaktu-waktu.

## US-33 Pencarian & Paginasi di Panel Admin

**Prompt:**
Tambahkan fitur pencarian cepat dan kontrol penyaringan pada tabel manajemen produk admin agar memudahkan pencarian kelinci atau paket hotel tertentu.

**Hasil:**
- Menyediakan input pencarian instan di `components/TabelProduk.jsx` yang memfilter nama produk dan kategori secara real-time.
- Menampilkan total item yang sesuai dengan kueri pencarian admin.

**Perbaikan:**
- Memastikan pencarian bersifat case-insensitive dan tidak memperlambat antarmuka saat katalog berisi banyak item.

## US-34 Validasi Server-Side Form Kelinci & Layanan

**Prompt:**
Terapkan validasi menyeluruh di sisi server (Server Action) untuk form tambah dan ubah produk: pastikan nama tidak kosong, harga berupa angka positif, dan URL foto berformat valid.

**Hasil:**
- Mengimplementasikan skema validasi server di `app/actions/produk.js`.
- Jika validasi gagal, form menampilkan pesan kesalahan spesifik tepat di bawah kolom input tanpa menghilangkan data yang sudah diketik pengguna.

**Perbaikan:**
- Menghapus karakter spasi berlebih (*trimming*) dan menolak format harga dengan simbol aneh atau nilai negatif.

## US-35 Ekspor Data Katalog & Adopsi ke CSV

**Prompt:**
Buat fitur ekspor data katalog ke file CSV di panel admin `/admin/ekspor` untuk kebutuhan arsip dan pembukuan toko.

**Hasil:**
- Membangun rute API / Server Action ekspor CSV di `app/admin/ekspor/route.js`.
- Mengunduh file berkas `.csv` yang berisi kolom ID, nama produk, kategori, harga, dan tanggal dibuat dengan proteksi sesi admin.

**Perbaikan:**
- Melakukan escaping pada tanda kutip ganda dan karakter koma di dalam deskripsi produk agar format CSV tidak berantakan saat dibuka di Microsoft Excel.

## US-36 Histori Terakhir Dilihat

**Prompt:**
Tambahkan seksi "Baru Saja Anda Lihat" di beranda dan detail produk yang menyimpan 4 produk terakhir yang dibuka pengunjung di browser.

**Hasil:**
- Membuat komponen `components/TerakhirDilihat.jsx` yang mencatat ID produk yang dikunjungi ke localStorage.
- Menampilkan kartu produk ringkas dari produk yang baru dilihat dan otomatis tersembunyi jika belum ada riwayat kunjungan.

**Perbaikan:**
- Mencegah duplikasi ID pada riwayat dan membatasi penyimpanan maksimal 4 item terbaru.

## US-37 Komparasi Spesifikasi Kelinci Hias / Layanan

**Prompt:**
Buat fitur perbandingan produk berdampingan di mana pengunjung dapat memilih 2 item kelinci atau layanan dan membandingkan foto, harga, kategori, dan rincian fasilitasnya.

**Hasil:**
- Membuat modul komparasi interaktif yang memungkinkan pengunjung memilih hingga 2 produk untuk dibandingkan.
- Menampilkan tabel komparasi berdampingan yang jelas dan mudah dibaca di ponsel maupun desktop.

**Perbaikan:**
- Menampilkan peringatan informatif saat pengguna mencoba memilih lebih dari 2 produk.

## US-38 Trust Center: Penampil Rating 5.0 Google Reviews & Testimoni Pelanggan

**Prompt:**
Bangun komponen Trust Center yang menampilkan rating sempurna Google Reviews 5.0 (178+ Ulasan), testimoni pelanggan nyata, serta form kirim ulasan berpelindung anti-spam.

**Hasil:**
- Membuat komponen `components/TrustCenter.jsx` di halaman beranda yang menampilkan lencana Google Reviews bintang 5.0.
- Menyediakan form kirim ulasan publik yang diproses via Server Action `kirimUlasanAction` dengan validasi rating 1-5 bintang.

**Perbaikan:**
- Menambahkan proteksi honeypot dan batasan panjang teks ulasan untuk mencegah spam bot.

## US-39 Moderasi Testimoni & Ulasan di Admin

**Prompt:**
Buat antarmuka moderasi testimoni di `/admin/ulasan` agar staf admin dapat menyetujui, menyembunyikan, atau menghapus ulasan pengunjung yang masuk.

**Hasil:**
- Membangun halaman `app/admin/ulasan/page.jsx` dan Server Action `moderasiUlasanAction`.
- Ulasan berstatus ditolak atau disembunyikan otomatis tidak dimunculkan di halaman publik dan tidak memengaruhi rating rata-rata.

**Perbaikan:**
- Memastikan penghapusan ulasan diverifikasi dengan dialog konfirmasi dan hak akses admin.

## US-40 Pelacakan Klik Booking WhatsApp per Cabang & Layanan

**Prompt:**
Catat setiap kali pengunjung mengklik tombol booking WhatsApp beserta nama produk dan cabang tujuan untuk analitik minat pelanggan tanpa melanggar privasi.

**Hasil:**
- Membuat Server Action / Route Handler pelacakan klik yang mencatat ID produk, nama layanan, cabang, dan waktu klik ke database.
- Eksekusi pelacakan dijalankan secara asinkron (non-blocking) sehingga pengguna langsung dialihkan ke WhatsApp tanpa jeda.

**Perbaikan:**
- Tidak menyimpan alamat IP atau identitas pribadi pengguna untuk menjaga kepatuhan privasi pengunjung.

## US-41 Analitik Permintaan Layanan Terpopuler di Dashboard

**Prompt:**
Sajikan analitik top 5 layanan atau kelinci yang paling banyak diminati berdasarkan data klik booking WhatsApp di dashboard admin.

**Hasil:**
- Menghitung agregasi klik booking terbanyak di `app/admin/page.jsx`.
- Menampilkan daftar peringkat 5 layanan terpopuler lengkap dengan jumlah klik minat booking.

**Perbaikan:**
- Memberikan visualisasi kondisi kosong yang ramah jika data tracking belum tersedia.

## US-42 Banner Pengumuman Musim Libur / Slot Pet Hotel Lebaran

**Prompt:**
Sediakan fitur banner pengumuman di bagian atas website yang dapat diaktifkan, diubah teksnya, dan dinonaktifkan oleh admin dari panel admin.

**Hasil:**
- Mengembangkan model banner di `lib/pengaturan.js` dan form kontrol banner di halaman admin.
- Banner tampil mencolok di atas navigasi utama dengan pesan penting dan link aksi.
- Jika dinonaktifkan oleh admin, banner otomatis tidak dirender di browser pengunjung.

**Perbaikan:**
- Menyediakan tombol tutup sementara di sisi pengunjung yang mengingat pilihan tutup selama sesi browsing.

## US-43 Pengaturan Multi-Cabang & Kontak WhatsApp dari Admin

**Prompt:**
Buat halaman pengaturan kontak dan multi-cabang di `/admin/cabang` sehingga nomor WhatsApp cabang Pondok Pinang dan Jatinegara, alamat, dan jam buka dapat diubah dinamis tanpa menyentuh kode.

**Hasil:**
- Membangun halaman `app/admin/cabang/page.jsx` dan Server Action `simpanPengaturanAction`.
- Mengubah nomor WhatsApp dan alamat di admin otomatis memperbarui seluruh tombol booking dan informasi kontak di publik.

**Perbaikan:**
- Memvalidasi nomor WhatsApp dengan format internasional (contoh: 62812xxx) agar link chat tidak eror.

## US-44 Manajemen Akses Admin Multi-Cabang

**Prompt:**
Sediakan halaman manajemen staf admin di `/admin/staf` agar super admin dapat mendaftarkan akun staf baru dan mengelola akses per cabang.

**Hasil:**
- Membangun halaman `app/admin/staf/page.jsx` untuk mendaftarkan akun admin baru menggunakan Supabase Auth Admin.
- Menampilkan daftar staf terdaftar dan status aktifnya.

**Perbaikan:**
- Mencegah super admin menonaktifkan atau menghapus akun miliknya sendiri guna menghindari penguncian sistem (lockout).

## US-45 Audit Log Aktivitas Perubahan Admin

**Prompt:**
Buat sistem pencatatan riwayat perubahan (audit trail) di `/admin/audit` yang merekam setiap aksi tambah, ubah, atau hapus data beserta email admin dan waktunya.

**Hasil:**
- Mengimplementasikan modul `lib/audit.js` yang dipanggil pada setiap Server Action data.
- Membangun halaman `app/admin/audit/page.jsx` yang menyajikan 50 catatan kronologis aktivitas terakhir staf admin.

**Perbaikan:**
- Membatasi akses halaman audit log murni untuk admin terotentikasi dan memformat stempel waktu ke zona waktu WIB.

## US-46 Impor Data Massal Kelinci & Produk dari CSV

**Prompt:**
Buat fitur impor massal CSV di `/admin/impor` sehingga admin dapat mengunggah puluhan data kelinci atau pakan sekaligus ke database Supabase.

**Hasil:**
- Membangun halaman `app/admin/impor/page.jsx` dan Server Action pemroses berkas CSV.
- Sistem memvalidasi setiap baris (nama, harga, kategori), mengabaikan baris rusak, dan mengimpor baris yang valid secara kolektif ke Supabase.
- Menampilkan laporan hasil impor: berapa baris berhasil dan rincian baris yang gagal.

**Perbaikan:**
- Mendukung pemisah koma maupun titik koma (semicolon) serta pembersihan karakter BOM UTF-8 pada berkas CSV.

## US-47 Atur Urutan Tampil Prioritas Katalog

**Prompt:**
Tambahkan fitur untuk mengatur urutan prioritas produk agar admin dapat menentukan produk mana yang tampil di paling atas beranda.

**Hasil:**
- Mendukung penanda prioritas urutan (`[PRIORITAS:X]`) pada data produk.
- Mengurutkan katalog beranda agar item berprioritas tinggi otomatis tampil lebih awal pada daftar katalog.

**Perbaikan:**
- Menggabungkan urutan prioritas dengan sortir waktu penambahan terbaru secara mulus.

## US-48 Varian Paket Layanan & Kamar Hotel

**Prompt:**
Sediakan fitur varian paket pada layanan Bunny Hotel dan Grooming (misal Kamar Standar vs Kamar VIP AC + CCTV) dengan penyesuaian tarif dinamis di halaman detail dan format WhatsApp.

**Hasil:**
- Mendukung pemilihan varian paket layanan di halaman detail produk.
- Pemilihan varian langsung memperbarui tampilan harga dan otomatis dimasukkan ke dalam teks pesan pemesanan WhatsApp.

**Perbaikan:**
- Memastikan varian default pertama langsung terpilih saat halaman dibuka pertama kali.

## US-49 Halaman Khusus per Kategori Layanan / Adopsi

**Prompt:**
Buat rute halaman dinamis khusus per kategori di `/kategori/[slug]` yang dapat dibagikan langsung dan diindeks mesin pencari secara mandiri.

**Hasil:**
- Membangun rute dinamis `app/kategori/[slug]/page.jsx` yang memfilter katalog sesuai slug kategori URL.
- Badge kategori pada kartu produk di beranda otomatis tertaut menuju halaman kategori ini.

**Perbaikan:**
- Mengarahkan kategori yang tidak terdaftar ke tampilan not-found yang ramah pengguna.

## US-50 Asisten AI Konsultasi Perawatan Kelinci Petskarta

**Prompt:**
Buat asisten chat interaktif berbasis Google Gemini AI di situs publik untuk melayani konsultasi pemilihan ras kelinci, pakan timothy, gejala scabies, atau fasilitas Bunny Hotel.

**Hasil:**
- Membuat komponen dialog AI interaktif di halaman publik.
- Integrasi ke Google Gemini API diproses murni di server dengan instruksi sistem pembatas domain khusus dunia kelinci dan layanan Petskarta.
- Dilengkapi pembatasan panjang teks dan penanganan timeout/error secara elegan.

**Perbaikan:**
- Menghubungkan variabel environment `LLM_GEMINI_API_KEY` dari server, menerapkan model cascade anti-downtime, serta menambahkan proteksi rate limiting di sisi server untuk mencegah spamming dan pembengkakan kuota token AI.

## US-51 Tampilan Seluruh Katalog Admin & Produk Terbaru Paling Atas [SENDIRI]

**Prompt:**
Penyesuaian pada saat tambah produk: table katalog produk & layanan tidak pagination dan produk terbaru dimasukan paling atas. Masukkan ke US baru.

**Hasil:**
- Dibuat kriteria selesai untuk `US-51` di `docs/user-stories.md`.
- Mengubah kueri Supabase di `/admin` (`app/admin/page.jsx`) agar diurutkan berdasarkan produk terbaru terlebih dahulu (`created_at` DESC dan `id` DESC).
- Menghapus pemotongan paginasi (no pagination) pada tabel manajemen produk `components/TabelProduk.jsx` sehingga seluruh item langsung tampil dengan produk yang baru ditambahkan berada di baris paling atas.

**Perbaikan:**
- Memastikan fitur pencarian instan tetap bekerja menyaring seluruh katalog tanpa batas halaman.

## Penerapan Keamanan Lanjutan (K-6 sampai K-13) [SENDIRI]

**Prompt:**
Masukkan poin keamanan lanjutan:
- K-6 Header keamanan di aplikasi live
- K-7 Tanpa dangerouslySetInnerHTML atau eval berbahaya
- K-8 /admin tidak diindeks mesin pencari
- K-9 Error tidak membocorkan stack trace
- K-10 Dependensi tanpa kerentanan kritis
- K-11 Content-Security-Policy ketat
- K-12 Rate limit login atau form
- K-13 Tanpa console.log data sensitif

**Hasil:**
- `next.config.mjs` dan `proxy.js` dikonfigurasi dengan Header Keamanan lengkap (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy) dan Content-Security-Policy (CSP) ketat.
- Menghapus seluruh penggunaan `dangerouslySetInnerHTML` di aplikasi; script dark mode dipindahkan ke `public/theme.js` dan schema JSON-LD disematkan secara aman.
- Mencegah pengindeksan rute `/admin` melalui `robots.txt`, header `X-Robots-Tag: noindex, nofollow`, dan metadata layout admin.
- Membuat `app/error.jsx` yang aman tanpa menampilkan stack trace atau rincian error internal.
- Menambahkan rate limiter untuk percobaan login admin dan pengiriman form ulasan/tanya AI.
- Memastikan dependensi bebas kerentanan kritis (`npm audit` 0 vulnerability) dan tidak ada `console.log` data sensitif di seluruh codebase.

**Perbaikan:**
- Mengisi dan memperbarui `docs/checklist-keamanan.md` untuk seluruh poin K-6 sampai K-13.

## US-52 Sistem White-Label & Manajemen Tema Multi-Bisnis [SENDIRI]

**Prompt:**
User stories di admin ada menu system untuk fitur white label dan theme jadi bisa digunakan oleh bisnis lain. Rencana dan spesifikasi disimpan juga di folder docs.

**Hasil:**
- Merumuskan `docs/rencana-white-label-dan-tema.md` dan menambahkan spesifikasi kriteria selesai pada `docs/user-stories.md` untuk US-52.
- Menyediakan sistem 6 palet preset tema industri (`lib/tema-presets.js`): Emerald (Kelinci & Hewan Peliharaan/UMKM Alam), Sapphire (Klinik/Corporate/Tech), Amber (Cafe/Bakery/F&B), Rose (Salon/Beauty/Boutique), Amethyst (Premium/Luxury Spa), dan Slate (Modern Studio/Minimalis).
- Membuat pemilih warna kustom hex (`warnaUtama`, `warnaUtamaGelap`, `warnaHarga`, `warnaHargaLatar`) serta konfigurasi identitas branding toko (nama bisnis, slogan/tagline, emoji/URL logo, dan teks footer).
- Membangun antarmuka manajemen `/admin/sistem` (`app/admin/sistem/page.jsx` & `components/FormSistemWhiteLabel.jsx`) yang dilengkapi dengan Interactive Live Preview kartu produk dan header toko secara instan sebelum disimpan.
- Mengimplementasikan Server Action `simpanSistemWhiteLabelAction` (`app/actions/sistem.js`) dengan validasi hak akses admin, validasi format hex warna, audit log trail (`US-45`), dan auto revalidation layout (`/`).
- Menginjeksi CSS variables secara dinamis pada root layout (`app/layout.jsx`) sehingga seluruh token `@theme` Tailwind CSS v4 (`bg-utama`, `text-utama`, `text-harga`, `bg-harga-latar`) langsung berubah tanpa perlu re-build.
- Memperbarui komponen `Header.jsx`, `Footer.jsx`, dan `app/page.jsx` agar membaca identitas bisnis dinamis secara seragam.

**Perbaikan:**
- Memastikan integrasi tema tetap adaptif terhadap dark mode (menggunakan fallback yang kontras) dan aman dari risiko script injection dengan validasi ketat regex `#([0-9a-fA-F]{3}){1,2}` pada server.
