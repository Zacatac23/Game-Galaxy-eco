// useSearchBar.js - Hook personalizado para SearchBar
import { useState, useCallback } from 'react';

const useSearchBar = (onSearch) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Manejar búsqueda principal
  const handleSearch = useCallback(async () => {
    if (onSearch) {
      setIsSearching(true);
      
      // Simular pequeño delay para mostrar animación
      setTimeout(() => {
        onSearch(searchTerm.trim());
        setIsSearching(false);
      }, 300);
    }
  }, [onSearch, searchTerm]);

  // Manejar tecla Enter
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  // Manejar cambios en el input
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Búsqueda en tiempo real cuando hay 3+ caracteres
    if (onSearch && value.length >= 3) {
      onSearch(value.trim());
    } else if (onSearch && value.length === 0) {
      onSearch('');
    }
  }, [onSearch]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  // Manejar focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Manejar blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Obtener clases CSS del contenedor
  const getContainerClasses = useCallback(() => {
    return `search-container ${isSearching ? 'searching' : ''} ${isFocused ? 'focused' : ''}`;
  }, [isSearching, isFocused]);

  // Verificar si mostrar botón de limpiar
  const shouldShowClearButton = searchTerm.length > 0;

  return {
    searchTerm,
    isSearching,
    isFocused,
    handleSearch,
    handleKeyDown,
    handleInputChange,
    clearSearch,
    handleFocus,
    handleBlur,
    getContainerClasses,
    shouldShowClearButton
  };
};

export default useSearchBar;