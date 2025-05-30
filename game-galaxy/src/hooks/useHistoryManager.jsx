// useHistoryManager.jsx - Hook personalizado para gestionar el historial de favoritos
import { useState, useMemo } from 'react';

const useHistoryManager = (history = [], getHistoryByAction) => {
  const [filter, setFilter] = useState('all'); // 'all', 'liked', 'unliked'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'product'
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar y ordenar historial - Memoizado para optimizar rendimiento
  const filteredHistory = useMemo(() => {
    let filtered = history;

    // Filtrar por acción
    if (filter !== 'all') {
      filtered = getHistoryByAction ? getHistoryByAction(filter) : 
                 history.filter(entry => entry.action === filter);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(entry => 
        entry.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.productId?.toString().includes(searchTerm)
      );
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'product':
          return (a.productTitle || '').localeCompare(b.productTitle || '');
        case 'newest':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    return sorted;
  }, [history, filter, searchTerm, sortBy, getHistoryByAction]);

  // Estadísticas del historial filtrado - Memoizado
  const filteredStats = useMemo(() => {
    const likes = filteredHistory.filter(entry => entry.action === 'liked').length;
    const unlikes = filteredHistory.filter(entry => entry.action === 'unliked').length;
    const uniqueProducts = new Set(filteredHistory.map(entry => entry.productId)).size;
    
    return { 
      likes, 
      unlikes, 
      uniqueProducts, 
      total: filteredHistory.length 
    };
  }, [filteredHistory]);

  // Estadísticas generales del historial completo - Memoizado
  const generalStats = useMemo(() => {
    const totalLikes = history.filter(entry => entry.action === 'liked').length;
    const totalUnlikes = history.filter(entry => entry.action === 'unliked').length;
    const totalUniqueProducts = new Set(history.map(entry => entry.productId)).size;
    
    return {
      totalLikes,
      totalUnlikes,
      totalUniqueProducts,
      totalActions: history.length
    };
  }, [history]);

  // Actividad reciente - Memoizada
  const recentActivity = useMemo(() => {
    return history
      .slice()
      .reverse()
      .slice(0, 10);
  }, [history]);

  // Productos más populares (más likes) - Memoizado
  const popularProducts = useMemo(() => {
    const productCounts = {};
    
    history.forEach(entry => {
      if (entry.action === 'liked') {
        productCounts[entry.productId] = productCounts[entry.productId] || {
          ...entry,
          count: 0
        };
        productCounts[entry.productId].count++;
      }
    });

    return Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

  // Funciones para cambiar filtros y búsqueda
  const setFilterType = (newFilter) => {
    setFilter(newFilter);
  };

  const setSortType = (newSort) => {
    setSortBy(newSort);
  };

  const setSearch = (term) => {
    setSearchTerm(term);
  };

  const clearFilters = () => {
    setFilter('all');
    setSortBy('newest');
    setSearchTerm('');
  };

  // Funciones de utilidad
  const getActionIcon = (action) => {
    switch (action) {
      case 'liked':
        return '💖';
      case 'unliked':
        return '💔';
      default:
        return '📝';
    }
  };

  const getActionText = (action) => {
    switch (action) {
      case 'liked':
        return 'Te gustó';
      case 'unliked':
        return 'Ya no te gusta';
      default:
        return 'Acción';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'liked':
        return '#ff69b4';
      case 'unliked':
        return '#ff6b6b';
      default:
        return '#6c757d';
    }
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return filter !== 'all' || sortBy !== 'newest' || searchTerm.trim() !== '';
  }, [filter, sortBy, searchTerm]);

  // Objeto de retorno memoizado
  const returnValue = useMemo(() => ({
    // Estados
    filter,
    sortBy,
    searchTerm,
    hasActiveFilters,

    // Datos procesados
    filteredHistory,
    filteredStats,
    generalStats,
    recentActivity,
    popularProducts,

    // Funciones de control
    setFilterType,
    setSortType,
    setSearch,
    clearFilters,

    // Funciones de utilidad
    getActionIcon,
    getActionText,
    getActionColor,

    // Información útil
    isEmpty: filteredHistory.length === 0,
    hasResults: filteredHistory.length > 0,
    isFiltered: filter !== 'all' || searchTerm.trim() !== '',
    totalPages: Math.ceil(filteredHistory.length / 20) // Para paginación futura
  }), [
    filter,
    sortBy,
    searchTerm,
    hasActiveFilters,
    filteredHistory,
    filteredStats,
    generalStats,
    recentActivity,
    popularProducts
  ]);

  return returnValue;
};

export default useHistoryManager;