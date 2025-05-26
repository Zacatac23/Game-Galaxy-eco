// hooks/useSearch.js - Hook para manejar búsquedas
import { useState, useMemo } from 'react';

export const useSearch = (items = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar items basado en el término de búsqueda
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }

    const term = searchTerm.toLowerCase();
    
    return items.filter(item => 
      item.title?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    filteredItems,
    handleSearch,
    clearSearch,
    hasResults: filteredItems.length > 0,
    isSearching: searchTerm.trim().length > 0
  };
};

// components/SearchResults.jsx - Componente para mostrar resultados
import React from 'react';

const SearchResults = ({ searchTerm, filteredItems, totalItems, onClearSearch }) => {
  if (!searchTerm.trim()) return null;

  return (
    <div className="search-results-info">
      <div className="search-info">
        <span className="search-term">
          Buscando: "{searchTerm}"
        </span>
        <span className="search-count">
          {filteredItems.length} de {totalItems} juegos
        </span>
        <button onClick={onClearSearch} className="clear-search">
          ✕ Limpiar
        </button>
      </div>
      
      {filteredItems.length === 0 && (
        <div className="no-results">
          <p>No se encontraron juegos que coincidan con tu búsqueda.</p>
          <p>Intenta con otros términos como "acción", "RPG", o nombres específicos.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;