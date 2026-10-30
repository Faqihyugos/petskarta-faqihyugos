import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { ubahProduk } from "@/app/admin/actions";
import { createAuthServerClient, createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  try {
    const supabase = await createAuthServerClient();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      // Fallback ke server client jika sesi auth terkendala
      const fallback = createServerClient();
      const fallbackRes = await fallback
        .from("produk")
        .select("*")
        .eq("id", id)
        .single();

      if (!fallbackRes.error && fallbackRes.data) {
        produk = fallbackRes.data;
      }
    } else {
      produk = data;
    }
  } catch {
    produk = null;
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" action={ubahProduk} />
    </div>
  );
}
