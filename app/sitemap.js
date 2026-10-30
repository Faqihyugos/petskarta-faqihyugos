import { createServerClient } from "@/lib/supabase/server";

export default async function sitemap() {
  const baseUrl = "https://petskarta.com";

  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cabang`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const supabase = createServerClient();
    const { data: daftarProduk } = await supabase
      .from("produk")
      .select("id, created_at");

    if (daftarProduk && daftarProduk.length > 0) {
      daftarProduk.forEach((item) => {
        routes.push({
          url: `${baseUrl}/produk/${item.id}`,
          lastModified: item.created_at || new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }
  } catch {
    // Gunakan rute dasar jika db belum siap
  }

  return routes;
}

