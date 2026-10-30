"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthServerClient } from "@/lib/supabase/server";
import { ekstrakPrioritas, setPrioritasDeskripsi } from "@/lib/prioritas";

export async function login(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const email = form?.get?.("email")?.toString()?.trim();
  const password = form?.get?.("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createAuthServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email atau password salah."
          : `Gagal masuk: ${error.message}`,
    };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const passwordBaru = (
    form instanceof FormData
      ? form.get("password_baru")
      : form?.password_baru ?? form?.get?.("password_baru")
  )?.toString() ?? "";
  const konfirmasiPassword = (
    form instanceof FormData
      ? form.get("konfirmasi_password")
      : form?.konfirmasi_password ?? form?.get?.("konfirmasi_password")
  )?.toString() ?? "";

  // Validasi input di server
  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  // Verifikasi admin sudah login di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk mengganti password." };
  }

  // Perbarui password via Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return {
      error:
        error.message === "New password should be different from the old password."
          ? "Password baru tidak boleh sama dengan password lama."
          : `Gagal memperbarui password: ${error.message}`,
    };
  }

  return { success: "Password berhasil diperbarui." };
}

export const updatePassword = gantiPassword;

// US-29: Helper unggah foto ke Supabase Storage dengan validasi tipe dan ukuran
async function prosesUnggahFoto(supabase, form, defaultFotoUrl) {
  const berkas = form?.get?.("berkas_foto");
  if (berkas && typeof berkas === "object" && berkas.size > 0) {
    const tipe = berkas.type || "";
    if (!tipe.startsWith("image/")) {
      throw new Error("Format berkas harus berupa gambar (JPG, PNG, WEBP, atau SVG).");
    }
    if (berkas.size > 5 * 1024 * 1024) {
      throw new Error("Ukuran berkas gambar maksimal 5 MB.");
    }

    const ekstensi = berkas.name?.split(".").pop() || "jpg";
    const namaFile = `kelinci-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ekstensi}`;

    try {
      const buffer = Buffer.from(await berkas.arrayBuffer());
      const { data, error } = await supabase.storage
        .from("produk")
        .upload(namaFile, buffer, {
          contentType: tipe,
          upsert: true,
        });

      if (!error) {
        const { data: pubData } = supabase.storage
          .from("produk")
          .getPublicUrl(namaFile);
        if (pubData?.publicUrl) {
          return pubData.publicUrl;
        }
      }
    } catch {
      // Fallback jika bucket storage belum dibuat di Supabase
    }

    // Fallback data URL agar gambar tetap tersimpan dan tampil
    const buffer = Buffer.from(await berkas.arrayBuffer());
    return `data:${tipe};base64,${buffer.toString("base64")}`;
  }

  return defaultFotoUrl;
}

export async function tambahProduk(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const nama = form?.get?.("nama")?.toString()?.trim();
  const hargaRaw = form?.get?.("harga")?.toString()?.trim();
  const kategori = form?.get?.("kategori")?.toString()?.trim() || null;
  const foto_url = form?.get?.("foto_url")?.toString()?.trim() || null;
  const deskripsi = form?.get?.("deskripsi")?.toString()?.trim() || null;
  const status = form?.get?.("status")?.toString()?.trim();
  const hargaCoretRaw = form?.get?.("harga_coret")?.toString()?.trim();
  const badge = form?.get?.("badge")?.toString()?.trim();

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka positif." };
  }

  // Verifikasi status login admin di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk menambah produk." };
  }

  let finalFotoUrl = foto_url;
  try {
    finalFotoUrl = await prosesUnggahFoto(supabase, form, foto_url);
  } catch (err) {
    return { error: err.message };
  }

  // Format status, harga coret, dan badge ke dalam deskripsi tanpa merusak skema tabel
  let finalDeskripsi = deskripsi || "";
  finalDeskripsi = finalDeskripsi
    .replace(/\[STATUS:(PENUH|TERADOPSI|HABIS)\]/gi, "")
    .replace(/\[(CORET|HARGA_ASLI):[0-9.]+\]/gi, "")
    .replace(/\[BADGE:[^\]]+\]/gi, "")
    .trim();

  if (status === "penuh") {
    finalDeskripsi = finalDeskripsi ? `${finalDeskripsi}\n\n[STATUS:PENUH]` : "[STATUS:PENUH]";
  } else if (status === "teradopsi") {
    finalDeskripsi = finalDeskripsi ? `${finalDeskripsi}\n\n[STATUS:TERADOPSI]` : "[STATUS:TERADOPSI]";
  }

  const hargaCoretNum = parseInt(hargaCoretRaw, 10);
  if (!isNaN(hargaCoretNum) && hargaCoretNum > harga) {
    finalDeskripsi = finalDeskripsi ? `${finalDeskripsi}\n[CORET:${hargaCoretNum}]` : `[CORET:${hargaCoretNum}]`;
  }

  if (badge) {
    finalDeskripsi = finalDeskripsi ? `${finalDeskripsi}\n[BADGE:${badge}]` : `[BADGE:${badge}]`;
  }

  const payload = {
    nama,
    harga,
    kategori,
    foto_url: finalFotoUrl,
    deskripsi: finalDeskripsi || null,
  };

  const { error } = await supabase.from("produk").insert([payload]);

  if (error) {
    return { error: `Gagal menambahkan produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export const createProduk = tambahProduk;

export async function ubahProduk(idOrPrevState, formDataOrPrevState, maybeFormData) {
  let id, form;
  if (maybeFormData instanceof FormData) {
    id = idOrPrevState;
    form = maybeFormData;
  } else {
    form = formDataOrPrevState instanceof FormData ? formDataOrPrevState : idOrPrevState;
    id =
      (form instanceof FormData ? form.get("id") : form?.id) ||
      (typeof idOrPrevState === "string" || typeof idOrPrevState === "number" ? idOrPrevState : null);
  }

  const nama = (form instanceof FormData ? form.get("nama") : form?.nama)?.toString()?.trim();
  const hargaRaw = (form instanceof FormData ? form.get("harga") : form?.harga)?.toString()?.trim();
  const kategori = (form instanceof FormData ? form.get("kategori") : form?.kategori)?.toString()?.trim() || null;
  const foto_url = (form instanceof FormData ? form.get("foto_url") : form?.foto_url)?.toString()?.trim() || null;
  const deskripsi = (form instanceof FormData ? form.get("deskripsi") : form?.deskripsi)?.toString()?.trim() || null;
  const status = (form instanceof FormData ? form.get("status") : form?.status)?.toString()?.trim();
  const hargaCoretRaw = (form instanceof FormData ? form.get("harga_coret") : form?.harga_coret)?.toString()?.trim();
  const badge = (form instanceof FormData ? form.get("badge") : form?.badge)?.toString()?.trim();

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga produk harus berupa angka positif." };
  }

  // Verifikasi login admin di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk mengubah produk." };
  }

  let finalFotoUrl = foto_url;
  try {
    finalFotoUrl = await prosesUnggahFoto(supabase, form, foto_url);
  } catch (err) {
    return { error: err.message };
  }

  // Format status, harga coret, dan badge ke dalam deskripsi tanpa merusak skema tabel
  let finalDeskripsi = deskripsi || "";
  finalDeskripsi = finalDeskripsi
    .replace(/\[STATUS:(PENUH|TERADOPSI|HABIS)\]/gi, "")
    .replace(/\[(CORET|HARGA_ASLI):[0-9.]+\]/gi, "")
    .replace(/\[BADGE:[^\]]+\]/gi, "")
    .trim();

  if (status === "penuh") {
    finalDeskripsi = finalDeskripsi ? `${finalDeskripsi}\n\n[STATUS:PENUH]` : "[STATUS:PENUH]";
  } else if (status === "teradopsi") {
    finalDeskripsi = finalDeskripsi ? `${finalDeskripsi}\n\n[STATUS:TERADOPSI]` : "[STATUS:TERADOPSI]";
  }

  const hargaCoretNum = parseInt(hargaCoretRaw, 10);
  if (!isNaN(hargaCoretNum) && hargaCoretNum > harga) {
    finalDeskripsi = finalDeskripsi ? `${finalDeskripsi}\n[CORET:${hargaCoretNum}]` : `[CORET:${hargaCoretNum}]`;
  }

  if (badge) {
    finalDeskripsi = finalDeskripsi ? `${finalDeskripsi}\n[BADGE:${badge}]` : `[BADGE:${badge}]`;
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url: finalFotoUrl,
      deskripsi: finalDeskripsi || null,
    })
    .eq("id", id);

  if (error) {
    return { error: `Gagal memperbarui produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/produk/${id}/ubah`);
  revalidatePath(`/produk/${id}`);
  revalidatePath("/");
  redirect("/admin");
}

export const updateProduk = ubahProduk;

export async function hapusProduk(idOrPrevState, maybeFormData) {
  let id;
  const form =
    maybeFormData instanceof FormData
      ? maybeFormData
      : idOrPrevState instanceof FormData
      ? idOrPrevState
      : null;

  if (form) {
    id = form.get("id");
  } else if (typeof idOrPrevState === "string" || typeof idOrPrevState === "number") {
    id = idOrPrevState;
  } else if (idOrPrevState?.id) {
    id = idOrPrevState.id;
  }

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  // Verifikasi login admin di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu untuk menghapus produk." };
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export const deleteProduk = hapusProduk;

// US-32: Sembunyikan Kelinci Teradopsi / Arsip Layanan
export async function toggleArsipProduk(id) {
  if (!id) return { error: "ID produk tidak valid." };

  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login terlebih dahulu." };

  const { data: produk } = await supabase
    .from("produk")
    .select("deskripsi")
    .eq("id", id)
    .single();

  if (!produk) return { error: "Produk tidak ditemukan." };

  let desk = produk.deskripsi || "";
  const isArsip = desk.includes("[STATUS:ARSIP]");
  if (isArsip) {
    desk = desk.replace(/\[STATUS:ARSIP\]/g, "").trim();
  } else {
    desk = desk ? `${desk}\n[STATUS:ARSIP]` : "[STATUS:ARSIP]";
  }

  await supabase.from("produk").update({ deskripsi: desk }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, isArsip: !isArsip };
}

// US-47: Atur Urutan Tampil Prioritas Katalog
export async function ubahPrioritasProduk(id, delta) {
  if (!id) return { error: "ID tidak valid." };

  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Akses ditolak: Hanya admin." };

  const { data: produk } = await supabase
    .from("produk")
    .select("deskripsi, nama")
    .eq("id", id)
    .single();

  if (!produk) return { error: "Produk tidak ditemukan." };

  const pLama = ekstrakPrioritas(produk.deskripsi);
  const pBaru = pLama + delta;
  const deskBaru = setPrioritasDeskripsi(produk.deskripsi, pBaru);

  await supabase.from("produk").update({ deskripsi: deskBaru }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, prioritas: pBaru };
}

/**
 * US-14: Generator Deskripsi Kelinci & Layanan Berbasis AI
 * Mengeksekusi Google Gemini API di sisi server demi keamanan API key.
 */
export async function generateDeskripsiAI(params) {
  const nama = params?.nama?.trim();
  const kategori = params?.kategori?.trim() || "Umum";

  if (!nama) {
    return { error: "Nama produk atau layanan wajib diisi terlebih dahulu." };
  }

  // Verifikasi login admin di server
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda harus login terlebih dahulu." };
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const prompt = `Kamu adalah copywriter profesional untuk Petskarta, UMKM spesialis kelinci hias (Holland Lop, Netherland Dwarf), penitipan Bunny Hotel ber-AC & CCTV, serta perawatan kelinci (Scabies Healer, grooming) terpercaya sejak 2016 di Jakarta.

Buatlah 1-2 paragraf deskripsi produk/layanan yang persuasif, profesional, dan informatif dalam bahasa Indonesia untuk:
- Nama: ${nama}
- Kategori: ${kategori}

Sertakan karakteristik, keunggulan fasilitas, atau saran perawatan yang relevan. Buat sebagai narasi mengalir yang elegan dan siap dibaca calon adopter/pelanggan tanpa bullet point panjang atau simbol asterik berlebihan.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return { success: true, deskripsi: text };
        }
      }
    } catch {
      // Lanjut ke fallback jika koneksi API luar terkendala
    }
  }

  // Fallback cerdas berbasis domain Petskarta (jika offline / tanpa API key)
  const isHotel =
    kategori.toLowerCase().includes("hotel") ||
    nama.toLowerCase().includes("hotel");
  const isKelinci =
    kategori.toLowerCase().includes("kelinci") ||
    nama.toLowerCase().includes("lop") ||
    nama.toLowerCase().includes("dwarf");
  const isMedis =
    kategori.toLowerCase().includes("grooming") ||
    kategori.toLowerCase().includes("rawat") ||
    nama.toLowerCase().includes("scabies");

  let deskripsiFallback = "";
  if (isHotel) {
    deskripsiFallback = `Layanan penitipan kelinci harian eksklusif di ruangan ber-AC dengan pantauan CCTV 24 jam. Dilengkapi alas foot rest plastik yang aman dan nyaman untuk telapak kaki kelinci, jatah rumput Timothy serat tinggi tak terbatas, serta waktu bermain harian (playtime) terkontrol agar kelinci kesayangan Anda tetap aktif, sehat, dan bebas stres selama Anda bepergian.`;
  } else if (isKelinci) {
    deskripsiFallback = `Kelinci hias ras unggulan dengan karakteristik sangat ramah, aktif, dan bertubuh proporsional. Seluruh indukan dan anakan dirawat dengan standar kebersihan tinggi, telah diberikan obat cacing rutin, vitamin, serta diet serat terbaik. Sangat ideal sebagai sahabat keluarga di rumah maupun apartemen, disertai garansi pengiriman aman se-Pulau Jawa dan luar pulau.`;
  } else if (isMedis) {
    deskripsiFallback = `Perawatan higienis intensif yang ditangani langsung oleh praktisi berpengalaman Petskarta. Menggunakan formula dan obat khusus yang terbukti ampuh dan aman untuk kulit sensitif kelinci, membantu mengatasi jamur, parasit, dan scabies hingga tuntas, serta merapikan bulu agar kelinci kembali sehat, bersih, dan lincah.`;
  } else {
    deskripsiFallback = `Produk perlengkapan dan nutrisi premium pilihan dari Petskarta untuk menunjang tumbuh kembang optimal serta kenyamanan hewan kesayangan Anda. Higienis, teruji, dan siap melengkapi kebutuhan harian kelinci kesayangan Anda dengan kualitas terbaik.`;
  }

  return { success: true, deskripsi: deskripsiFallback };
}

/**
 * Memverifikasi status login admin di server.
 * Mengembalikan data user admin jika terautentikasi, atau null jika tidak valid.
 */
export async function verifikasiAdmin() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

