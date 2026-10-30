"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KomparasiContext = createContext({
  komparasiList: [],
  tambahKomparasi: () => {},
  hapusKomparasi: () => {},
  resetKomparasi: () => {},
  isKomparasi: () => false,
  pesanInfo: null,
});

const STORAGE_KEY = "petskarta_komparasi_items";

export function KomparasiProvider({ children }) {
  const [komparasiList, setKomparasiList] = useState([]);
  const [pesanInfo, setPesanInfo] = useState(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setKomparasiList(JSON.parse(data));
      }
    } catch {
      // Abaikan
    }
  }, []);

  const simpan = (list) => {
    setKomparasiList(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Abaikan
    }
  };

  const tambahKomparasi = (item) => {
    const ada = komparasiList.some((p) => String(p.id) === String(item.id));
    if (ada) {
      hapusKomparasi(item.id);
      return;
    }

    if (komparasiList.length >= 2) {
      // US-37: Menolak pemilihan lebih dari 2 item dengan pesan informatif dan mengganti item paling lama
      setPesanInfo("Komparasi maksimal 2 item. Item terlama digantikan.");
      setTimeout(() => setPesanInfo(null), 3500);
      const baru = [komparasiList[1], item];
      simpan(baru);
      return;
    }

    const baru = [...komparasiList, item];
    simpan(baru);
  };

  const hapusKomparasi = (id) => {
    const baru = komparasiList.filter((p) => String(p.id) !== String(id));
    simpan(baru);
  };

  const resetKomparasi = () => {
    simpan([]);
  };

  const isKomparasi = (id) => {
    return komparasiList.some((p) => String(p.id) === String(id));
  };

  return (
    <KomparasiContext.Provider
      value={{
        komparasiList,
        tambahKomparasi,
        hapusKomparasi,
        resetKomparasi,
        isKomparasi,
        pesanInfo,
      }}
    >
      {children}
    </KomparasiContext.Provider>
  );
}

export function useKomparasi() {
  return useContext(KomparasiContext);
}

