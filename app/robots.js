export default function robots() {
  const baseUrl = "https://petskarta.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/admin"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

