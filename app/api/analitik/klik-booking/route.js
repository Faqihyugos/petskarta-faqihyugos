import { rekamKlikBooking } from "@/lib/analitik";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    await rekamKlikBooking({
      produkId: body.produkId,
      namaLayanan: body.namaLayanan,
      kategori: body.kategori,
      cabangTujuan: body.cabangTujuan,
    });
    return NextResponse.json({ sukses: true });
  } catch {
    return NextResponse.json({ sukses: false }, { status: 400 });
  }
}

