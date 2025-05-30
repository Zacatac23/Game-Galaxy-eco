// useFavoritesManager.jsx - Hook personalizado para gestionar la vista de favoritos con sincronización inmediata y useMemo
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const useFavoritesManager = () => {
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [view, setView] = useState('favorites');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  
  // Función para cargar datos de favoritos
  const loadFavoritesData = useCallback(() => {
    setIsLoading(true);
    
    try {
      // Favoritos actuales
      const savedFavorites = localStorage.getItem('gamegalaxy_favorites');
      if (savedFavorites) {
        const favoritesMap = new Map(JSON.parse(savedFavorites));
        const favoritesArray = Array.from(favoritesMap.values());
        setFavorites(favoritesArray);
      } else {
        setFavorites([]);
      }

      // Historial completo
      const savedHistory = localStorage.getItem('gamegalaxy_likes_history');
      if (savedHistory) {
        const historyData = JSON.parse(savedHistory);
        setHistory(historyData);
      } else {
        setHistory([]);
      }

      // Obtener estadísticas directamente
      if (window.getFavoritesStats) {
        const statsData = window.getFavoritesStats().stats;
        setStats(statsData);
      } else {
        setStats({});
      }

      setLastUpdate(Date.now());
      
      console.log('🔄 Manager actualizado:', {
        favorites: favorites.length,
        history: history.length,
        timestamp: new Date().toLocaleTimeString()
      });

    } catch (error) {
      console.error('Error loading favorites data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpiar historial
  const clearHistory = useCallback(() => {
    if (window.clearFavoritesHistory) {
      window.clearFavoritesHistory();
      // La actualización se hará automáticamente por el callback
    }
  }, []);

  // Memoizar función de formateo de fecha
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Cambiar vista
  const changeView = useCallback((newView) => {
    setView(newView);
  }, []);

  // Memoizar estadísticas resumidas para evitar recálculos en cada render
  const summaryStats = useMemo(() => ({
    totalFavorites: favorites.length,
    totalActions: history.length,
    totalLikes: stats.totalLikes || 0,
    totalDislikes: stats.totalDislikes || 0,
    uniqueProducts: stats.uniqueProducts?.size || 0,
    activeSessions: stats.sessionsLiked?.length || 0
  }), [favorites.length, history.length, stats]);

  // Obtener estadísticas resumidas
  const getSummaryStats = useCallback(() => summaryStats, [summaryStats]);

  // Memoizar filtros de historial por acción
  const historyByLiked = useMemo(() => 
    history.filter(entry => entry.action === 'liked'), 
    [history]
  );

  const historyByUnliked = useMemo(() => 
    history.filter(entry => entry.action === 'unliked'), 
    [history]
  );

  // Filtrar historial por tipo de acción
  const getHistoryByAction = useCallback((action) => {
    if (action === 'liked') return historyByLiked;
    if (action === 'unliked') return historyByUnliked;
    return history.filter(entry => entry.action === action);
  }, [history, historyByLiked, historyByUnliked]);

  // Memoizar favoritos más recientes
  const recentFavorites = useMemo(() => {
    return favorites
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, 5);
  }, [favorites]);

  // Obtener favoritos más recientes
  const getRecentFavorites = useCallback((limit = 5) => {
    if (limit === 5) return recentFavorites;
    return favorites
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, limit);
  }, [favorites, recentFavorites]);

  // Memoizar actividad reciente
  const recentActivity = useMemo(() => {
    return history
      .slice()
      .reverse()
      .slice(0, 10);
  }, [history]);

  // Obtener actividad reciente
  const getRecentActivity = useCallback((limit = 10) => {
    if (limit === 10) return recentActivity;
    return history
      .slice()
      .reverse()
      .slice(0, limit);
  }, [history, recentActivity]);

  // Memoizar productos más populares
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

  // Obtener productos más populares
  const getPopularProducts = useCallback(() => popularProducts, [popularProducts]);

  // Memoizar estadísticas por sesión
  const sessionStats = useMemo(() => {
    if (!stats.sessionsLiked) return [];
    
    return stats.sessionsLiked
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);
  }, [stats.sessionsLiked]);

  // Obtener estadísticas por sesión
  const getSessionStats = useCallback(() => sessionStats, [sessionStats]);

  // Forzar actualización manual
  const forceUpdate = useCallback(() => {
    loadFavoritesData();
  }, [loadFavoritesData]);

  // Memoizar información de cuando se dio like a un juego específico
  const likeNotificationInfo = useMemo(() => {
    if (history.length === 0) return null;

    // Obtener el último like
    const lastLike = history
      .slice()
      .reverse()
      .find(entry => entry.action === 'liked');

    if (!lastLike) return null;

    // Verificar si es reciente (últimos 5 segundos)
    const timeDiff = Date.now() - new Date(lastLike.timestamp).getTime();
    const isRecent = timeDiff < 5000;

    return {
      productTitle: lastLike.productTitle,
      productId: lastLike.productId,
      timestamp: lastLike.timestamp,
      isRecent,
      formattedTime: formatDate(lastLike.timestamp)
    };
  }, [history, formatDate]);

  // Memoizar el objeto de retorno completo
  const returnValue = useMemo(() => ({
    // Estados principales
    favorites,
    history,
    stats,
    view,
    lastUpdate,
    isLoading,
    
    // Funciones de control
    loadFavoritesData,
    clearHistory,
    formatDate,
    changeView,
    forceUpdate,
    
    // Funciones de análisis y utilidad (memoizadas)
    getSummaryStats,
    getHistoryByAction,
    getRecentFavorites,
    getRecentActivity,
    getPopularProducts,
    getSessionStats,
    
    // Información del último like (para mostrar notificaciones)
    likeNotificationInfo
  }), [
    favorites,
    history,
    stats,
    view,
    lastUpdate,
    isLoading,
    loadFavoritesData,
    clearHistory,
    formatDate,
    changeView,
    forceUpdate,
    getSummaryStats,
    getHistoryByAction,
    getRecentFavorites,
    getRecentActivity,
    getPopularProducts,
    getSessionStats,
    likeNotificationInfo
  ]);

  // Cargar datos al montar
  useEffect(() => {
    loadFavoritesData();
  }, [loadFavoritesData]);

  // Registrar callback para sincronización inmediata
  useEffect(() => {
    // Asegurarse de que el sistema de callbacks existe
    if (!window.gamegalaxyFavoritesCallbacks) {
      window.gamegalaxyFavoritesCallbacks = new Set();
    }
    
    // Función callback que se ejecutará cuando cambien los favoritos
    const updateCallback = () => {
      console.log('📡 Callback ejecutado en useFavoritesManager');
      loadFavoritesData();
    };
    
    // Registrar el callback
    window.gamegalaxyFavoritesCallbacks.add(updateCallback);

    // Cleanup
    return () => {
      window.gamegalaxyFavoritesCallbacks?.delete(updateCallback);
    };
  }, [loadFavoritesData]);

  // Escuchar evento personalizado como backup
  useEffect(() => {
    const handleFavoritesChanged = (event) => {
      console.log('🔔 Evento personalizado recibido en Manager');
      
      if (event.detail) {
        // Usar los datos del evento si están disponibles
        setFavorites(event.detail.favorites || []);
        setHistory(event.detail.history || []);
        setStats(event.detail.stats || {});
        setLastUpdate(Date.now());
      } else {
        // Fallback: cargar desde localStorage
        loadFavoritesData();
      }
    };

    window.addEventListener('gamegalaxy:favorites-changed', handleFavoritesChanged);

    return () => {
      window.removeEventListener('gamegalaxy:favorites-changed', handleFavoritesChanged);
    };
  }, [loadFavoritesData]);

  // Escuchar cambios en localStorage (multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gamegalaxy_favorites' || e.key === 'gamegalaxy_likes_history') {
        console.log('💾 Storage change detected:', e.key);
        loadFavoritesData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadFavoritesData]);

  // Polling de respaldo (cada 5 segundos, solo si no hay callbacks activos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!window.gamegalaxyFavoritesCallbacks || window.gamegalaxyFavoritesCallbacks.size === 0) {
        console.log('🔄 Fallback polling ejecutado');
        loadFavoritesData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loadFavoritesData]);

  return returnValue;
};

export default useFavoritesManager;