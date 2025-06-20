
import { useState, useEffect } from 'react';
import { University } from '@/types/university';

const FAVORITES_STORAGE_KEY = 'university-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<University[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (university: University) => {
    setFavorites(prev => {
      // Check if already in favorites
      const isAlreadyFavorite = prev.some(fav => fav.id === university.id);
      if (isAlreadyFavorite) {
        return prev; // Don't add duplicates
      }
      return [...prev, university];
    });
  };

  const removeFromFavorites = (universityId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== universityId));
  };

  const isFavorite = (universityId: string) => {
    return favorites.some(fav => fav.id === universityId);
  };

  const toggleFavorite = (university: University) => {
    if (isFavorite(university.id)) {
      removeFromFavorites(university.id);
    } else {
      addToFavorites(university);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite
  };
};
