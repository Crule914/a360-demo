import { useState, useEffect } from "react";

const FAVORITES_KEY = "report-favorites";

interface FavoritesMap {
  [reportId: string]: boolean;
}

export const useFavorites = () => {
  const DEFAULT_FAVORITES: FavoritesMap = {
    "allocation-holdings-summary": true,
    "estimated-realized-gain-loss": true,
  };

  const [favorites, setFavorites] = useState<FavoritesMap>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_FAVORITES;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const toggleFavorite = (reportId: string) =>
    setFavorites((prev) => ({ ...prev, [reportId]: !prev[reportId] }));
  const isFavorite = (reportId: string) => favorites[reportId] ?? false;
  const hasFavoritePreference = (reportId: string) => reportId in favorites;

  return { favorites, toggleFavorite, isFavorite, hasFavoritePreference };
};
