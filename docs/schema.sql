-- Skema database Petskarta (Katalog Kelinci Hias, Bunny Hotel & Perawatan)
-- Cara pakai: Supabase > SQL Editor > New query > tempel seluruh isi file ini > Run.
-- Aman dijalankan ulang.

-- 1. Tabel produk
create table if not exists public.produk (
  id bigint generated always as identity primary key,
  nama text not null,
  harga integer not null check (harga >= 0),
  deskripsi text,
  foto_url text,
  kategori text,
  created_at timestamptz not null default now()
);

-- 2. Row Level Security
-- Tidak ada izin untuk publik: akses langsung ke tabel dari luar aplikasi ditolak.
-- Hanya admin yang sudah login yang boleh membaca dan mengubah data.
alter table public.produk enable row level security;

drop policy if exists "admin_baca_produk" on public.produk;
drop policy if exists "admin_tambah_produk" on public.produk;
drop policy if exists "admin_ubah_produk" on public.produk;
drop policy if exists "admin_hapus_produk" on public.produk;

create policy "admin_baca_produk" on public.produk
  for select to authenticated using (true);

create policy "admin_tambah_produk" on public.produk
  for insert to authenticated with check (true);

create policy "admin_ubah_produk" on public.produk
  for update to authenticated using (true) with check (true);

create policy "admin_hapus_produk" on public.produk
  for delete to authenticated using (true);

-- 3. Data produk & layanan awal Petskarta (hanya diisi jika tabel masih kosong)
insert into public.produk (nama, harga, deskripsi, foto_url, kategori)
select * from (values
  ('Holland Lop Broken Orange (Junior)', 850000, 'Kelinci hias Holland Lop usia 2,5 bulan. Karakter sangat ramah, telinga turun sempurna, sehat dan lincah. Sudah diberikan obat cacing dan vitamin. Garansi pengiriman se-Jawa dan luar pulau.', '/produk/holland-lop.svg', 'Kelinci Hias'),
  ('Netherland Dwarf Pure White (Pedigree)', 950000, 'Kelinci kerdil Netherland Dwarf mata ruby/otter, telinga tegak pendek, berat dewasa hanya ~1 kg. Cocok untuk indoor apartemen. Bersertifikat dan konsultasi perawatan seumur hidup gratis.', '/produk/netherland-dwarf.svg', 'Kelinci Hias'),
  ('Bunny Hotel Deluxe (AC + Pantauan CCTV)', 65000, 'Layanan penitipan kelinci harian spesialisasi liburan/mudik. Fasilitas kamar luas ber-AC/exhaust, alas foot rest plastik ramah telapak kaki, free unlimited rumput Timothy, dan daily playtime.', '/produk/bunny-hotel.svg', 'Bunny Hotel'),
  ('Paket Pengobatan Scabies Healer Tuntas', 120000, 'Perawatan intensif medis ringan untuk kelinci yang terserang jamur/scabies. Termasuk suntik/oles obat scabies khusus kelinci, karantina higienis, dan edukasi pencegahan kambuh.', '/produk/scabies-healer.svg', 'Grooming & Perawatan'),
  ('Grooming Sehat Kelinci & Kutu/Jamur', 75000, 'Layanan grooming lengkap: pembersihan telinga, perapian bulu gimbal, potong kuku aman, mandi kering herbal, dan spray anti parasit. Tersedia opsi Home Grooming ke rumah Anda.', '/produk/grooming.svg', 'Grooming & Perawatan'),
  ('Timothy Hay First Cut Premium 1 Kg', 45000, 'Rumput timothy pilihan serat tinggi untuk menjaga kesehatan sistem pencernaan dan mengikis gigi kelinci secara alami. Harum, minim debu, kemasan higienis kedap udara.', '/produk/timothy-hay.svg', 'Pakan & Aksesoris')
) as data_awal (nama, harga, deskripsi, foto_url, kategori)
where not exists (select 1 from public.produk);

-- 4. Data tambahan untuk menguji paginasi, urutan, filter, dan pencarian Petskarta.
--    Hanya diisi jika belum ada data uji paginasi.
with kategori (urut, kategori, foto_url, harga_dasar, langkah, daftar) as (values
  (1, 'Kelinci Hias', '/produk/holland-lop.svg', 700000, 50000, array[
    'Holland Lop Solid Tortoise Baby', 'Holland Lop Broken Black Jr', 'Netherland Dwarf Chestnut Jr',
    'Netherland Dwarf Agouti Pure', 'Holland Lop Blue Otic Jr', 'Mini Rex Velvet Soft Touch',
    'Fuzzy Lop White Snow', 'Guinea Pig American Short Hair', 'Guinea Pig Abyssinian Tri-Color']),
  (2, 'Bunny Hotel', '/produk/bunny-hotel.svg', 50000, 10000, array[
    'Bunny Hotel Standard Kipas Angin', 'Bunny Hotel VIP Room CCTV 24 Jam', 'Guinea Pig Suite Room Luas',
    'Paket Penitipan Mudik Lebaran 7 Hari', 'Paket Penitipan Libur Natal 5 Hari', 'Bunny Hotel Long Stay (Bulanan)',
    'Pet Hotel Day Care (Transit Harian)', 'Bunny Hotel Pasca Steril / Medis', 'Pet Hotel Pasangan 2 Kelinci 1 Kamar']),
  (3, 'Grooming & Perawatan', '/produk/grooming.svg', 50000, 15000, array[
    'Grooming Reguler Kelinci Kering', 'Home Grooming Panggilan ke Rumah', 'Potong Kuku & Bersih Telinga Saja',
    'Paket Scabies Healer Stadium Ringan', 'Paket Scabies Healer Stadium Lanjut', 'Treatment Jamur & Mandi Belerang Khusus',
    'Detangling Bulu Kusut/Gimbal Longhair', 'Grooming Khusus Guinea Pig Wangi', 'Pemeriksaan Kesehatan Fisik Rutin']),
  (4, 'Pakan & Aksesoris', '/produk/timothy-hay.svg', 35000, 12000, array[
    'Alfalfa Hay Premium Anakan Kelinci', 'Pelet Kelinci Nutrisi Lengkap 1 Kg', 'Kandang Lipat Coating Plastik + Foot Rest',
    'Toilet Kelinci Sudut Higienis Kotak', 'Botol Minum Gantung Anti Bocor 500 ml', 'Mangkuk Pakan Keramik Berat Anti Tumpah',
    'Terowongan Mainan Rumput Alami', 'Alas Foot Rest Plastik Cadangan', 'Vitamin Pencernaan & Imun Kelinci'])
)
insert into public.produk (nama, harga, deskripsi, foto_url, kategori, created_at)
select
  p.nama,
  k.harga_dasar + p.ke * k.langkah,
  format('Layanan resmi dari Petskarta Jakarta untuk kategori %s. Kode katalog PK-%s. Hubungi admin cabang Pondok Pinang / Jatinegara untuk ketersediaan.', lower(k.kategori), p.ke),
  k.foto_url,
  k.kategori,
  now() - make_interval(hours => ((k.urut - 1) * 9 + p.ke)::int)
from kategori k
cross join lateral unnest(k.daftar) with ordinality as p (nama, ke)
where not exists (select 1 from public.produk where deskripsi like 'Layanan resmi dari Petskarta Jakarta%');
