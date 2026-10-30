import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerPengumuman from "@/components/BannerPengumuman";
import AsistenKelinciAI from "@/components/AsistenKelinciAI";
import { toko } from "@/lib/toko";
import { KeranjangProvider } from "@/context/KeranjangContext";
import { FavoritProvider } from "@/context/FavoritContext";
import { KomparasiProvider } from "@/context/KomparasiContext";
import DrawerKeranjang from "@/components/DrawerKeranjang";
import BarKomparasi from "@/components/BarKomparasi";

export const metadata = {
  title: `${toko.nama} - Spesialis Kelinci Hias & Bunny Hotel Jakarta`,
  description: toko.tagline,
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: toko.nama,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: toko.nama,
    description: toko.tagline,
    url: "https://petskarta.com",
    telephone: `+${toko.nomorWhatsApp}`,
    priceRange: "Rp35.000 - Rp950.000",
    openingHours: "Mo-Su 09:00-21:00",
    aggregateRating: {
      "@type": "AggregateRating",
      "ratingValue": String(toko.ratingGoogle || "5.0"),
      "reviewCount": String(toko.totalUlasanGoogle || "178"),
    },
    address: toko.cabang?.map((c) => ({
      "@type": "PostalAddress",
      streetAddress: c.alamat,
      addressLocality: c.nama.includes("Timur") ? "Jakarta Timur" : "Jakarta Selatan",
      addressRegion: "DKI Jakarta",
      addressCountry: "ID",
    })) || [],
    sameAs: [
      toko.mediaSosial?.instagramUtama,
      toko.mediaSosial?.instagramJatinegara,
      toko.mediaSosial?.instagramKatalog,
      toko.mediaSosial?.tiktok,
      toko.mediaSosial?.shopee,
    ].filter(Boolean),
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* K-7: Skrip tema & Structured Data aman tanpa innerHTML berbahaya */}
        <script src="/theme.js" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1f6b4f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Petskarta" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased bg-latar text-teks">
        <FavoritProvider>
          <KomparasiProvider>
            <KeranjangProvider>
              <BannerPengumuman />
              <Header />
              <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
              <Footer />
              <DrawerKeranjang />
              <BarKomparasi />
              <AsistenKelinciAI />
            </KeranjangProvider>
          </KomparasiProvider>
        </FavoritProvider>
      </body>
    </html>
  );
}
