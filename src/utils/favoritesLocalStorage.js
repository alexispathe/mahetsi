// src/utils/favoritesLocalStorage.js

export const FAVORITES_LOCAL_STORAGE_KEY = 'guest_favorites';

// Obtener los favoritos desde localStorage
export function getLocalFavorites() {
  if (typeof window === 'undefined') return [];
  const favorites = localStorage.getItem(FAVORITES_LOCAL_STORAGE_KEY);
  return favorites ? JSON.parse(favorites) : [];
}

// Agregar un favorito en localStorage
export function addToLocalFavorites(uniqueID) {
  const favorites = getLocalFavorites();
  if (!favorites.includes(uniqueID)) {
    favorites.push(uniqueID);
    localStorage.setItem(FAVORITES_LOCAL_STORAGE_KEY, JSON.stringify(favorites));
  }
}

// Eliminar un favorito de localStorage
export function removeFromLocalFavorites(uniqueID) {
  let favorites = getLocalFavorites();
  favorites = favorites.filter(id => id !== uniqueID);
  localStorage.setItem(FAVORITES_LOCAL_STORAGE_KEY, JSON.stringify(favorites));
}

// Limpiar todos los favoritos en localStorage
export function clearLocalFavorites() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAVORITES_LOCAL_STORAGE_KEY);
}
