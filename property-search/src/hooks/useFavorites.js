import { useState, useEffect } from 'react';

const STORAGE_KEY = 'propertyFavorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (property) => {
    setFavorites(curr => {
      if (!curr.some(fav => fav.id === property.id)) {
        return [...curr, property];
      }
      return curr;
    });
  };

  const removeFavorite = (propertyId) => {
    setFavorites(curr => curr.filter(fav => fav.id !== propertyId));
  };

  const isFavorite = (propertyId) => {
    return favorites.some(fav => fav.id === propertyId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites
  };
};