import { toko } from "@/lib/toko";

// Knowledge Base Petskarta untuk Asisten AI
const KNOWLEDGE_BASE_PROMPT = `
Kamu adalah "BunnyBot", asisten AI resmi Petskarta (UMKM spesialis kelinci hias & Bunny Hotel di Jakarta sejak 2016).
Jawablah dalam bahasa Indonesia yang ramah, sopan, dan solutif.
Batasan pengetahuanmu HANYA seputar kelinci, pakan, penyakit scabies, dan layanan resmi Petskarta:
1. Ras Kelinci:
   - Holland Lop: Telinga turun (lop), tubuh bulat, sangat ramah, cocok untuk anak & pemula.
   - Netherland Dwarf: Telinga tegak pendek, berat dewasa ~1 kg, lincah, cocok untuk apartemen.
2. Pakan & Nutrisi:
   - 80% pakan wajib rumput Timothy Hay (atau Alfalfa Hay untuk kelinci di bawah 6 bulan) demi kesehatan gigi & sistem cerna.
   - Pelet berkualitas secukupnya.
   - Sediakan air bersih di botol gantung anti bocor.
3. Bunny Hotel Petskarta:
   - Cabang Pondok Pinang (Jaksel) & Jatinegara (Jaktim).
   - Fasilitas: Ruangan ber-AC dingin, pantauan CCTV 24 jam, free timothy hay sepuasnya, alas foot rest empuk.
4. Perawatan & Scabies Healer:
   - Penyakit scabies kelinci ditandai kerak putih/kuning di tepi telinga, hidung, atau kuku.
   - Petskarta menyediakan paket pengobatan Scabies Healer tuntas dan grooming herbal.
5. Alur Pemesanan:
   - Seluruh adopsi dan booking hotel dilakukan via WhatsApp resmi cabang: Pondok Pinang (081299992016) dan Jatinegara (081388882016).
Selalu berikan saran yang aman dan ingatkan pengunjung untuk menekan tombol WhatsApp jika ingin booking atau berkonsultasi langsung dengan staf Petskarta.
`;

// Rate limiting sederhana di memori server (US-50)
const sesiPengguna = new Map();

export async function konsultasiAIPetskarta(pertanyaan, userIp = "anonim") {
  const q = String(pertanyaan || "").trim();

  // Validasi panjang karakter (US-50)
  if (!q) {
    throw new Error("Pertanyaan tidak boleh kosong.");
  }
  if (q.length > 300) {
    throw new Error("Pertanyaan terlalu panjang (maksimal 300 karakter).");
  }

  // Mekanisme Rate Limiting (US-50: maksimal 10 pertanyaan per 5 menit)
  const now = Date.now();
  const riwayat = sesiPengguna.get(userIp) || [];
  const riwayatBaru = riwayat.filter((t) => now - t < 300000);
  if (riwayatBaru.length >= 10) {
    throw new Error(
      "Frekuensi pertanyaan terlalu tinggi. Harap tunggu beberapa menit sebelum bertanya lagi."
    );
  }
  riwayatBaru.push(now);
  sesiPengguna.set(userIp, riwayatBaru);

  // Jika ada API Key Gemini di env
  const apiKey =
    process.env.LLM_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY;

  if (apiKey) {
    try {
      const candidateModels = [
        "gemini-3.1-flash-lite-preview",
        "gemini-3.5-flash",
        "gemini-3-flash-preview",
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-1.5-flash",
      ];

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: KNOWLEDGE_BASE_PROMPT },
              { text: `Pertanyaan Pengunjung: "${q}"\nJawaban ringkas dan ramah:` },
            ],
          },
        ],
      };

      for (const model of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 detik timeout

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const json = await res.json();
            const textRes = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textRes) return textRes.trim();
          }
        } catch {
          // Lanjut ke kandidat model berikutnya jika gagal
        }
      }
    } catch {
      // Fallback ke sistem pengetahuan lokal cerdas jika API key bermasalah atau offline
    }
  }

  // Fallback Respon Cerdas Lokal berbasis Knowledge Base Petskarta
  const lowerQ = q.toLowerCase();

  if (lowerQ.includes("scabies") || lowerQ.includes("jamur") || lowerQ.includes("gatal") || lowerQ.includes("kerak")) {
    return (
      "Penyakit scabies pada kelinci disebabkan oleh tungau parasit dan biasanya menimbulkan kerak putih/kuning di ujung telinga, hidung, atau telapak kaki. Petskarta menyediakan layanan 'Paket Scabies Healer Tuntas' di cabang Jatinegara & Pondok Pinang dengan pengobatan telaten, karantina higienis, dan edukasi pencegahan. Anda bisa langsung chat admin WhatsApp kami untuk konsultasi dan penanganan."
    );
  }

  if (lowerQ.includes("hotel") || lowerQ.includes("titip") || lowerQ.includes("mudik") || lowerQ.includes("kamar") || lowerQ.includes("libur")) {
    return (
      "Bunny Hotel Petskarta beroperasi setiap hari di dua cabang (Pondok Pinang Jaksel & Jatinegara Jaktim). Fasilitas kami meliputi: ruangan full AC dingin, sirkulasi exhaust fan, pantauan CCTV 24 jam, alas kandang plastik foot-rest anti sore hocks, free unlimited rumput Timothy Hay pilihan, dan waktu bermain harian. Menjelang musim liburan/mudik Lebaran kuota cepat penuh, yuk segera reservasi via WhatsApp!"
    );
  }

  if (lowerQ.includes("makan") || lowerQ.includes("pakan") || lowerQ.includes("timothy") || lowerQ.includes("alfalfa") || lowerQ.includes("rumput") || lowerQ.includes("pelet")) {
    return (
      "Nutrisi utama kelinci 80% adalah rumput serat tinggi (Timothy Hay untuk dewasa, atau Alfalfa Hay untuk anakan di bawah 6 bulan) agar pencernaannya lancar dan giginya terasah alami. Tambahkan sedikit pelet bernutrisi dan sediakan air bersih menggunakan botol minum gantung. Petskarta menyediakan First Cut Timothy Hay premium di etalase dan Shopee resmi kami."
    );
  }

  if (lowerQ.includes("ras") || lowerQ.includes("holland") || lowerQ.includes("dwarf") || lowerQ.includes("adopsi") || lowerQ.includes("anak")) {
    return (
      "Petskarta mengkhususkan diri pada dua ras kelinci hias murni: (1) Holland Lop yang berkarakter sangat ramah, manja, dan bertelinga turun cantik—pilihan nomor satu untuk keluarga & anak-anak; serta (2) Netherland Dwarf yang berukuran mungil (~1 kg) dengan telinga tegak menggemaskan, sangat cocok untuk hunian apartemen. Seluruh kelinci kami bergaransi sehat dan siap kirim ke seluruh Indonesia."
    );
  }

  if (lowerQ.includes("cabang") || lowerQ.includes("lokasi") || lowerQ.includes("alamat") || lowerQ.includes("buka")) {
    return (
      "Petskarta memiliki dua cabang resmi yang AKTIF BEROPERASI setiap hari pukul 09.00–21.00: Cabang 1 di Jl. Pondok Pinang Raya No. 18 (Jakarta Selatan) dan Cabang 2 di Jatinegara (Jakarta Timur). Informasi rute Google Maps dan chat masing-masing cabang dapat Anda akses di menu Direktori Cabang."
    );
  }

  return (
    "Halo! Saya BunnyBot dari Petskarta. Ada yang bisa saya bantu seputar adopsi kelinci hias (Holland Lop & Netherland Dwarf), reservasi Bunny Hotel ber-AC & CCTV, perawatan Scabies Healer, atau panduan pakan rumput timothy? Anda juga bisa langsung terhubung ke WhatsApp resmi admin kami di tombol yang tersedia."
  );
}

