// useFavorites.jsx - Hook personalizado para manejo de favoritos con sincronización mejorada y useMemo
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const useFavorites = (productId, productTitle, productImage = null, productPrice = null) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // useRef para mantener el historial completo de likes
  const likesHistoryRef = useRef([]);
  const favoritesMapRef = useRef(new Map());
  const statsRef = useRef({
    totalLikes: 0,
    totalDislikes: 0,
    uniqueProducts: new Set(),
    sessionsLiked: []
  });

  // Función para forzar actualización
  const triggerUpdate = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  // Memoizar las estadísticas reconstruidas para evitar cálculos innecesarios
  const rebuiltStats = useMemo(() => {
    const stats = {
      totalLikes: 0,
      totalDislikes: 0,
      uniqueProducts: new Set(),
      sessionsLiked: []
    };

    likesHistoryRef.current.forEach(entry => {
      if (entry.action === 'liked') {
        stats.totalLikes++;
        stats.uniqueProducts.add(entry.productId);
      } else if (entry.action === 'unliked') {
        stats.totalDislikes++;
      }
    });

    // Agrupar por sesiones (mismo día)
    const sessionMap = new Map();
    likesHistoryRef.current.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      if (!sessionMap.has(date)) {
        sessionMap.set(date, []);
      }
      sessionMap.get(date).push(entry);
    });

    stats.sessionsLiked = Array.from(sessionMap.entries()).map(([date, actions]) => ({
      date,
      actions: actions.length,
      products: [...new Set(actions.map(a => a.productId))].length
    }));

    return stats;
  }, [forceUpdate]); // Solo recalcular cuando forceUpdate cambie

  // Función para reconstruir estadísticas desde el historial
  const rebuildStats = useCallback(() => {
    statsRef.current = rebuiltStats;
  }, [rebuiltStats]);

  // Memoizar el sessionId para evitar regeneraciones innecesarias
  const sessionId = useMemo(() => {
    let storedSessionId = sessionStorage.getItem('gamegalaxy_session_id');
    if (!storedSessionId) {
      storedSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('gamegalaxy_session_id', storedSessionId);
    }
    return storedSessionId;
  }, []);

  // Generar ID de sesión simple
  const getSessionId = useCallback(() => sessionId, [sessionId]);

  // Memoizar el historyEntry base para evitar recrear objetos
  const baseHistoryEntry = useMemo(() => ({
    productId,
    productTitle,
    productImage,
    productPrice,
    sessionId,
    userAgent: navigator.userAgent.substring(0, 50)
  }), [productId, productTitle, productImage, productPrice, sessionId]);

  // Función para agregar entrada al historial
  const addToHistory = useCallback((action, details = {}) => {
    const historyEntry = {
      ...baseHistoryEntry,
      id: Date.now() + Math.random(),
      action,
      timestamp: new Date().toISOString(),
      ...details
    };

    likesHistoryRef.current.push(historyEntry);
    
    if (likesHistoryRef.current.length > 1000) {
      likesHistoryRef.current = likesHistoryRef.current.slice(-1000);
    }

    try {
      localStorage.setItem('gamegalaxy_likes_history', JSON.stringify(likesHistoryRef.current));
    } catch (error) {
      console.error('Error saving history:', error);
    }

    // Forzar actualización para recalcular stats
    triggerUpdate();
  }, [baseHistoryEntry, triggerUpdate]);

  // Memoizar el objeto de favorito para evitar recreaciones
  const favoriteObject = useMemo(() => ({
    id: productId,
    title: productTitle,
    image: productImage,
    price: productPrice,
    addedAt: new Date().toISOString()
  }), [productId, productTitle, productImage, productPrice]);

  // Función global para notificar cambios
  const notifyFavoritesChange = useCallback(() => {
    // Emitir evento personalizado
    const event = new CustomEvent('gamegalaxy:favorites-changed', {
      detail: {
        favorites: Array.from(favoritesMapRef.current.values()),
        history: likesHistoryRef.current,
        stats: statsRef.current,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);

    // También actualizar las funciones globales inmediatamente
    if (window.gamegalaxyFavoritesCallbacks) {
      window.gamegalaxyFavoritesCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error executing callback:', error);
        }
      });
    }
  }, []);

  // Función principal para toggle de favoritos
  const handleFavoriteToggle = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const newFavoriteState = !isFavorite;
    const action = newFavoriteState ? 'liked' : 'unliked';
    
    // Actualizar el estado local inmediatamente
    setIsFavorite(newFavoriteState);
    
    // Actualizar el mapa de favoritos
    if (newFavoriteState) {
      favoritesMapRef.current.set(productId, favoriteObject);
    } else {
      favoritesMapRef.current.delete(productId);
    }

    // Guardar favoritos en localStorage
    try {
      const favoritesArray = Array.from(favoritesMapRef.current.entries());
      localStorage.setItem('gamegalaxy_favorites', JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }

    // Agregar al historial
    addToHistory(action, {
      previousState: !newFavoriteState,
      newState: newFavoriteState,
      context: 'product_card'
    });

    // Animación y notificación
    setAnimationClass(newFavoriteState ? 'bounce-like' : 'shake-unlike');
    setShowNotification(true);

    setTimeout(() => {
      setAnimationClass('');
      setShowNotification(false);
    }, 1000);

    // Notificar cambios a otros componentes INMEDIATAMENTE
    notifyFavoritesChange();

    console.log(`💖 ${action}:`, {
      product: productTitle,
      productId: productId,
      newState: newFavoriteState,
      totalFavorites: favoritesMapRef.current.size
    });

  }, [isFavorite, productId, favoriteObject, addToHistory, notifyFavoritesChange, productTitle]);

  // Función para cargar datos desde localStorage
  const loadFromStorage = useCallback(() => {
    try {
      // Cargar favoritos existentes
      const savedFavorites = localStorage.getItem('gamegalaxy_favorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        favoritesMapRef.current = new Map(favorites);
        setIsFavorite(favoritesMapRef.current.has(productId));
      }

      // Cargar historial existente
      const savedHistory = localStorage.getItem('gamegalaxy_likes_history');
      if (savedHistory) {
        likesHistoryRef.current = JSON.parse(savedHistory);
        triggerUpdate(); // Forzar recálculo de stats
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }, [productId, triggerUpdate]);

  // Memoizar las estadísticas completas para la función getFavoritesStats
  const memoizedFavoritesStats = useMemo(() => ({
    favorites: Array.from(favoritesMapRef.current.values()),
    history: likesHistoryRef.current,
    stats: statsRef.current,
    currentSession: sessionId
  }), [forceUpdate, sessionId]);

  // Función para obtener estadísticas
  const getFavoritesStats = useCallback(() => memoizedFavoritesStats, [memoizedFavoritesStats]);

  // Memoizar el conteo de favoritos para evitar recálculos
  const favoritesCount = useMemo(() => favoritesMapRef.current.size, [forceUpdate]);

  // Inicializar al montar
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Actualizar stats cuando cambien
  useEffect(() => {
    rebuildStats();
  }, [rebuildStats]);

  // Configurar funciones globales y callbacks
  useEffect(() => {
    // Funciones globales para debugging
    window.getFavoritesStats = getFavoritesStats;
    window.getFavoritesHistory = () => likesHistoryRef.current;
    window.clearFavoritesHistory = () => {
      likesHistoryRef.current = [];
      localStorage.removeItem('gamegalaxy_likes_history');
      triggerUpdate();
      notifyFavoritesChange();
    };

    // Sistema de callbacks para sincronización
    if (!window.gamegalaxyFavoritesCallbacks) {
      window.gamegalaxyFavoritesCallbacks = new Set();
    }
    
    const callback = () => {
      loadFromStorage();
      triggerUpdate();
    };
    
    window.gamegalaxyFavoritesCallbacks.add(callback);

    // Cleanup
    return () => {
      window.gamegalaxyFavoritesCallbacks?.delete(callback);
    };
  }, [getFavoritesStats, notifyFavoritesChange, loadFromStorage, triggerUpdate]);

  // Escuchar eventos de storage (para multi-tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gamegalaxy_favorites' || e.key === 'gamegalaxy_likes_history') {
        loadFromStorage();
        triggerUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadFromStorage, triggerUpdate]);

  // Memoizar el objeto de retorno para evitar re-renders innecesarios
  const returnValue = useMemo(() => ({
    isFavorite,
    showNotification,
    animationClass,
    handleFavoriteToggle,
    favoritesCount,
    getFavoritesStats,
    forceUpdate // Para triggerar re-renders cuando sea necesario
  }), [isFavorite, showNotification, animationClass, handleFavoriteToggle, favoritesCount, getFavoritesStats, forceUpdate]);

  return returnValue;
};

export default useFavorites;