import React from 'react';
import useSearchBar from '../hooks/useSearchBar';

const SearchBar = ({ onSearch, placeholder = "Buscar juegos..." }) => {
  const {
    searchTerm,
    isSearching,
    handleSearch,
    handleKeyDown,
    handleInputChange,
    clearSearch,
    handleFocus,
    handleBlur,
    getContainerClasses,
    shouldShowClearButton
  } = useSearchBar(onSearch);

  return (
    <div className={getContainerClasses()}>
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
      {shouldShowClearButton && (
        <button onClick={clearSearch} className="clear-search-btn" title="Limpiar búsqueda">
          ✕
        </button>
      )}
      <button onClick={handleSearch} className="search-btn" disabled={isSearching} title="Buscar">
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