"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FavoritContext = createContext({
  favoritIds: [],
  toggleFavorit: () => {},
  isFavorit: () => false,
  totalFavorit: 0,
});

const STORAGE_KEY = "petskarta_favorit_ids";

export function FavoritProvider({ children }) {
  const [favoritIds, setFavoritIds] = useState([]);
  const [sudahDimuat, setSudahDimuat] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setFavoritIds(JSON.parse(data));
      }
    } catch {
      // Abaikan error parsing lokal
    } finally {
      setSudahDimuat(true);
    }
  }, []);

  const toggleFavorit = (id) => {
    const idStr = String(id);
    setFavoritIds((prev) => {
      let baru;
      if (prev.includes(idStr)) {
        baru = prev.filter((item) => item !== idStr);
      } else {
        baru = [...prev, idStr];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(baru));
      } catch {
        // Abaikan jika quota error
      }
      return baru;
    });
  };

  const isFavorit = (id) => {
    return favoritIds.includes(String(id));
  };

  return (
    <FavoritContext.Provider
      value={{
        favoritIds,
        toggleFavorit,
        isFavorit,
        totalFavorit: favoritIds.length,
        sudahDimuat,
      }}
    >
      {children}
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  return useContext(FavoritContext);
}

