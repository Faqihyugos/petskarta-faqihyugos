"use client";

import { createContext, useContext, useState, useEffect } from "react";

const KeranjangContext = createContext(null);

export function KeranjangProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isDrawerBuka, setIsDrawerBuka] = useState(false);
  const [terhidrasi, setTerhidrasi] = useState(false);

  // Muat data dari localStorage setelah component mount di client (mencegah hydration mismatch)
  useEffect(() => {
    try {
      const data = localStorage.getItem("petskarta_keranjang_v1");
      if (data) {
        setItems(JSON.parse(data));
      }
    } catch {
      // Abaikan error parsing
    }
    setTerhidrasi(true);
  }, []);

  // Simpan kembali setiap kali isi keranjang diperbarui
  useEffect(() => {
    if (terhidrasi) {
      try {
        localStorage.setItem("petskarta_keranjang_v1", JSON.stringify(items));
      } catch {
        // Abaikan jika quota storage penuh
      }
    }
  }, [items, terhidrasi]);

  const tambahItem = (produk, qty = 1) => {
    if (!produk?.id) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => String(i.id) === String(produk.id));
      if (idx >= 0) {
        const salinan = [...prev];
        salinan[idx] = { ...salinan[idx], qty: salinan[idx].qty + qty };
        return salinan;
      }
      return [
        ...prev,
        {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga || 0,
          foto_url:
            produk.foto_url?.split(/[\n,]+/)[0]?.trim() || "/produk/kelinci.svg",
          kategori: produk.kategori || "",
          qty,
        },
      ];
    });
  };

  const kurangItem = (id) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (String(i.id) === String(id)) {
            return { ...i, qty: i.qty - 1 };
          }
          return i;
        })
        .filter((i) => i.qty > 0)
    );
  };

  const hapusItem = (id) => {
    setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  };

  const kosongkanKeranjang = () => {
    setItems([]);
  };

  const totalItem = items.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalBiaya = items.reduce(
    (sum, item) => sum + (item.harga || 0) * (item.qty || 1),
    0
  );

  return (
    <KeranjangContext.Provider
      value={{
        items,
        isDrawerBuka,
        bukaDrawer: () => setIsDrawerBuka(true),
        tutupDrawer: () => setIsDrawerBuka(false),
        tambahItem,
        kurangItem,
        hapusItem,
        kosongkanKeranjang,
        totalItem,
        totalBiaya,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const ctx = useContext(KeranjangContext);
  if (!ctx) {
    throw new Error("useKeranjang harus digunakan di dalam KeranjangProvider");
  }
  return ctx;
}

