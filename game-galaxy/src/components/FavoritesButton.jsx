
// FavoritesButton.jsx - Sistema completo con useRef e historial
import React, { useState, useRef, useEffect } from 'react';
// import { Heart } from '../icons'; // Comentado para usar íconos simples

const FavoritesButton = ({ productId, productTitle, productImage = null, productPrice = null }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  
  // useRef para mantener el historial completo de likes
  const likesHistoryRef = useRef([]);
  const favoritesMapRef = useRef(new Map());
  const statsRef = useRef({
    totalLikes: 0,
    totalDislikes: 0,
    uniqueProducts: new Set(),
    sessionsLiked: []
  });

  // Inicializar favoritos desde localStorage al montar el componente
  useEffect(() => {
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
        
        // Reconstruir estadísticas
        rebuildStats();
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, [productId]);

  // Función para reconstruir estadísticas desde el historial
  const rebuildStats = () => {
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

    statsRef.current = stats;
  };

  // Función para agregar entrada al historial
  const addToHistory = (action, details = {}) => {
    const historyEntry = {
      id: Date.now() + Math.random(), // ID único
      productId,
      productTitle,
      productImage,
      productPrice,
      action, // 'liked' o 'unliked'
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
      userAgent: navigator.userAgent.substring(0, 50), // Info del navegador (limitada)
      ...details
    };

    likesHistoryRef.current.push(historyEntry);
    
    // Mantener solo los últimos 1000 registros para evitar problemas de memoria
    if (likesHistoryRef.current.length > 1000) {
      likesHistoryRef.current = likesHistoryRef.current.slice(-1000);
    }

    // Guardar en localStorage
    try {
      localStorage.setItem('gamegalaxy_likes_history', JSON.stringify(likesHistoryRef.current));
    } catch (error) {
      console.error('Error saving history:', error);
    }

    // Actualizar estadísticas
    rebuildStats();

    console.log('📚 Historial actualizado:', {
      action,
      product: productTitle,
      totalEntries: likesHistoryRef.current.length,
      stats: statsRef.current
    });
  };

  // Generar ID de sesión simple
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('gamegalaxy_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('gamegalaxy_session_id', sessionId);
    }
    return sessionId;
  };

  // Función principal para toggle de favoritos
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavoriteState = !isFavorite;
    const action = newFavoriteState ? 'liked' : 'unliked';
    
    setIsFavorite(newFavoriteState);
    
    // Actualizar el mapa de favoritos
    if (newFavoriteState) {
      favoritesMapRef.current.set(productId, {
        id: productId,
        title: productTitle,
        image: productImage,
        price: productPrice,
        addedAt: new Date().toISOString()
      });
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
      context: 'product_card' // Puedes cambiar esto según dónde se use
    });

    // Animación y notificación
    setAnimationClass(newFavoriteState ? 'bounce-like' : 'shake-unlike');
    setShowNotification(true);

    // Limpiar animación y notificación
    setTimeout(() => {
      setAnimationClass('');
      setShowNotification(false);
    }, 1000);

    // Log para debugging
    console.log(`💖 ${action}:`, {
      product: productTitle,
      totalFavorites: favoritesMapRef.current.size,
      historyEntries: likesHistoryRef.current.length
    });
  };

  // Función para obtener estadísticas (expuesta globalmente)
  const getFavoritesStats = () => ({
    favorites: Array.from(favoritesMapRef.current.values()),
    history: likesHistoryRef.current,
    stats: statsRef.current,
    currentSession: getSessionId()
  });

  // Exponer funciones globalmente para debugging/analytics
  useEffect(() => {
    window.getFavoritesStats = getFavoritesStats;
    window.getFavoritesHistory = () => likesHistoryRef.current;
    window.clearFavoritesHistory = () => {
      likesHistoryRef.current = [];
      localStorage.removeItem('gamegalaxy_likes_history');
      rebuildStats();
    };
  }, []);

  return (
    <>
      <button
        onClick={handleFavoriteToggle}
        className={`favorites-btn ${isFavorite ? 'active' : ''} ${animationClass}`}
        title={isFavorite ? `Quitar "${productTitle}" de favoritos` : `Agregar "${productTitle}" a favoritos`}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {/* Opción 1: Emoji Unicode (más confiable) */}
        <span className={`heart-emoji ${isFavorite ? 'filled' : 'empty'}`}>
          {isFavorite ? '❤️' : '🤍'}
        </span>
        
        {/* Opción 2: Símbolo Unicode alternativo */}
        {/* <span className={`heart-symbol ${isFavorite ? 'filled' : 'empty'}`}>
          {isFavorite ? '♥' : '♡'}
        </span> */}
        
        {/* Opción 3: SVG inline simple (sin imports) */}
        {/* <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          className={`heart-svg ${isFavorite ? 'filled' : 'empty'}`}
        >
          <path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={isFavorite ? '#ef4444' : 'none'}
            stroke={isFavorite ? '#ef4444' : 'currentColor'}
            strokeWidth="2"
          />
        </svg> */}
        
        {/* Contador de favoritos (opcional) */}
        {favoritesMapRef.current.size > 0 && (
          <span className="favorites-count">
            {favoritesMapRef.current.size}
          </span>
        )}
      </button>

      {/* Notificación temporal */}
      {showNotification && (
        <div className={`favorite-notification ${isFavorite ? 'liked' : 'unliked'}`}>
          {isFavorite ? (
            <>
              <span className="notification-emoji">❤️</span>
              <span>¡Agregado a favoritos!</span>
            </>
          ) : (
            <>
              <span className="notification-emoji">💔</span>
              <span>Quitado de favoritos</span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FavoritesButton;