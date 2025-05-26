// components/SearchBar.jsx - Versión limpia sin debug
import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Buscar juegos..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async () => {
    if (onSearch) {
      setIsSearching(true);
      
      // Simular pequeño delay para mostrar animación
      setTimeout(() => {
        onSearch(searchTerm.trim());
        setIsSearching(false);
      }, 300);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Búsqueda en tiempo real cuando hay 3+ caracteres
    if (onSearch && value.length >= 3) {
      onSearch(value.trim());
    } else if (onSearch && value.length === 0) {
      onSearch('');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className={`search-container ${isSearching ? 'searching' : ''} ${isFocused ? 'focused' : ''}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="search-input"
      />
      
      {searchTerm && (
        <button onClick={clearSearch} className="clear-search-btn" title="Limpiar búsqueda">
          ✕
        </button>
      )}
      
      <button 
        onClick={handleSearch} 
        className="search-btn"
        disabled={isSearching}
        title="Buscar"
      >
        {isSearching ? (
          <span className="search-loading">⏳</span>
        ) : (
          <span className="search-icon">🔍</span>
        )}
      </button>
    </div>
  );
};

export default SearchBar;