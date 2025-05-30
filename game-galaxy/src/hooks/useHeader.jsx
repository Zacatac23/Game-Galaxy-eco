// useHeader.js - Hook personalizado para header
import { useCallback } from 'react';

const useHeader = (onSearch, onNavigate) => {
  // Manejar búsqueda
  const handleSearch = useCallback((searchTerm) => {
    console.log('Header - Búsqueda recibida:', searchTerm); // Debug
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [onSearch]);

  // Manejar navegación
  const handleNavigation = useCallback((view) => {
    if (onNavigate) {
      onNavigate(view);
    }
  }, [onNavigate]);

  // Verificar si vista está activa
  const isActiveView = (view, currentView) => {
    return currentView === view;
  };

  // Determinar clases CSS para elementos
  const getNavItemClass = (view, currentView) => {
    return `nav-item ${isActiveView(view, currentView) ? 'active' : ''}`;
  };

  const getCartButtonClass = (currentView) => {
    return `cart-btn ${isActiveView('cart', currentView) ? 'active' : ''}`;
  };

  // Verificar si mostrar contador del carrito
  const shouldShowCartCount = (itemCount) => {
    return itemCount > 0;
  };

  return {
    handleSearch,
    handleNavigation,
    isActiveView,
    getNavItemClass,
    getCartButtonClass,
    shouldShowCartCount
  };
};

export default useHeader;