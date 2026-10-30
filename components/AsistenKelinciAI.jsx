"use client";

import { useState, useRef, useEffect } from "react";
import { tanyaAIAction } from "@/app/actions/ai-asisten";

const SARAN_PERTANYAAN = [
  "Kelinci apa yang paling ramah untuk anak?",
  "Apa saja fasilitas Bunny Hotel Petskarta?",
  "Bagaimana cara mengatasi scabies kelinci?",
  "Berapa takaran rumput timothy harian?",
];

export default function AsistenKelinciAI() {
  const [buka, setBuka] = useState(false);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [percakapan, setPercakapan] = useState([
    {
      pengirim: "bot",
      teks: "Halo! Saya BunnyBot, asisten AI Petskarta. Ada yang bisa saya bantu seputar adopsi kelinci hias, Bunny Hotel, atau perawatan kelinci kesayangan Anda?",
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (buka) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [percakapan, buka]);

  const handleKirim = async (teksKirim) => {
    const input = (teksKirim || pesan).trim();
    if (!input || loading) return;

    if (input.length > 300) {
      alert("Pertanyaan maksimal 300 karakter.");
      return;
    }

    const pesanPengguna = { pengirim: "user", teks: input };
    setPercakapan((prev) => [...prev, pesanPengguna]);
    setPesan("");
    setLoading(true);

    try {
      const res = await tanyaAIAction(input);
      if (res.sukses) {
        setPercakapan((prev) => [
          ...prev,
          { pengirim: "bot", teks: res.jawaban },
        ]);
      } else {
        setPercakapan((prev) => [
          ...prev,
          { pengirim: "bot", teks: `⚠️ ${res.pesan}` },
        ]);
      }
    } catch {
      setPercakapan((prev) => [
        ...prev,
        {
          pengirim: "bot",
          teks: "Mohon maaf, sambungan terputus. Silakan hubungi admin WhatsApp kami untuk respon cepat.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Melayang Asisten AI */}
      {!buka && (
        <button
          type="button"
          onClick={() => setBuka(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-utama/40 bg-utama px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-utama-gelap"
          aria-label="Konsultasi Perawatan Kelinci dengan AI"
        >
          <span className="text-base">🐰</span>
          <span>Tanya AI Petskarta</span>
        </button>
      )}

      {/* Kotak Dialog Chat Interaktif (US-50) */}
      {buka && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[500px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-3xl border border-garis bg-latar shadow-2xl backdrop-blur-md">
          {/* Header Chat */}
          <div className="flex items-center justify-between border-b border-garis bg-permukaan px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-utama/15 text-lg">
                🐰
              </span>
              <div>
                <p className="text-xs font-bold text-teks">BunnyBot AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-teks-lembut">Siap Melayani Konsultasi</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBuka(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-teks-lembut hover:bg-garis/60 text-sm"
              aria-label="Tutup percakapan"
            >
              ✕
            </button>
          </div>

          {/* Area Percakapan */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {percakapan.map((item, idx) => (
              <div
                key={idx}
                className={`flex ${
                  item.pengirim === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                    item.pengirim === "user"
                      ? "bg-utama text-white rounded-br-xs"
                      : "bg-permukaan text-teks rounded-bl-xs border border-garis"
                  }`}
                >
                  <p className="whitespace-pre-line">{item.teks}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-garis bg-permukaan px-3.5 py-2 text-teks-lembut text-[11px]">
                  <span>🐾</span>
                  <span>BunnyBot sedang berpikir...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Saran Pertanyaan Cepat */}
          <div className="border-t border-garis bg-permukaan/40 px-3 py-2">
            <p className="text-[10px] font-semibold text-teks-lembut mb-1">
              Topik Sering Ditanyakan:
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SARAN_PERTANYAAN.map((saran, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleKirim(saran)}
                  className="shrink-0 rounded-full border border-garis bg-latar px-2.5 py-1 text-[10px] font-medium text-teks hover:border-utama hover:text-utama"
                >
                  {saran}
                </button>
              ))}
            </div>
          </div>

          {/* Input Chat */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleKirim();
            }}
            className="flex items-center gap-2 border-t border-garis bg-latar p-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={pesan}
                onChange={(e) => setPesan(e.target.value.slice(0, 300))}
                placeholder="Tanya soal kelinci, hotel, scabies..."
                className="w-full rounded-xl border border-garis bg-permukaan px-3 py-2 pr-12 text-xs text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-teks-lembut">
                {pesan.length}/300
              </span>
            </div>
            <button
              type="submit"
              disabled={!pesan.trim() || loading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-utama text-white hover:bg-utama-gelap disabled:opacity-40 transition-colors"
              aria-label="Kirim pertanyaan"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

