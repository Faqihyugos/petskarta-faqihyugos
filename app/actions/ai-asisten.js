"use server";

import { konsultasiAIPetskarta } from "@/lib/ai-asisten";

export async function tanyaAIAction(pertanyaan) {
  try {
    const jawaban = await konsultasiAIPetskarta(pertanyaan);
    return { sukses: true, jawaban };
  } catch (err) {
    return {
      sukses: false,
      pesan: err.message || "Mohon maaf, asisten AI sedang sibuk. Silakan coba sesaat lagi.",
    };
  }
}

