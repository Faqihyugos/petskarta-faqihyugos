import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toko } from "@/lib/toko";
import { KeranjangProvider } from "@/context/KeranjangContext";
import DrawerKeranjang from "@/components/DrawerKeranjang";

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
  return (
    <html lang="id">
      <head>
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
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <KeranjangProvider>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
          <Footer />
          <DrawerKeranjang />
        </KeranjangProvider>
      </body>
    </html>
  );
}
