import React, { useState, useEffect, useRef } from 'react';
// import { Heart, Trash2, Calendar, TrendingUp } from '../icons'; // Comentado para usar emojis

const FavoritesManager = ({ onViewProduct }) => {
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [view, setView] = useState('favorites'); // 'favorites', 'history', 'stats'
  const intervalRef = useRef();

  // Cargar datos de favoritos
  const loadFavoritesData = () => {
    try {
      // Favoritos actuales
      const savedFavorites = localStorage.getItem('gamegalaxy_favorites');
      if (savedFavorites) {
        const favoritesMap = new Map(JSON.parse(savedFavorites));
        setFavorites(Array.from(favoritesMap.values()));
      }

      // Historial completo
      const savedHistory = localStorage.getItem('gamegalaxy_likes_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      // Obtener estadísticas si están disponibles
      if (window.getFavoritesStats) {
        setStats(window.getFavoritesStats().stats);
      }
    } catch (error) {
      console.error('Error loading favorites data:', error);
    }
  };

  // Cargar datos al montar y cada 5 segundos
  useEffect(() => {
    loadFavoritesData();
    intervalRef.current = setInterval(loadFavoritesData, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Limpiar historial
  const clearHistory = () => {
    if (window.clearFavoritesHistory) {
      window.clearFavoritesHistory();
      setHistory([]);
      setStats({});
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="favorites-manager">
      <div className="favorites-header">
        <h2>Gestión de Favoritos</h2>
        
        {/* Navegación de vistas */}
        <div className="view-tabs">
          <button 
            className={view === 'favorites' ? 'active' : ''}
            onClick={() => setView('favorites')}
          >
            <span className="tab-emoji">❤️</span>
            Favoritos ({favorites.length})
          </button>
          <button 
            className={view === 'history' ? 'active' : ''}
            onClick={() => setView('history')}
          >
            <span className="tab-emoji">📅</span>
            Historial ({history.length})
          </button>
          <button 
            className={view === 'stats' ? 'active' : ''}
            onClick={() => setView('stats')}
          >
            <span className="tab-emoji">📊</span>
            Estadísticas
          </button>
        </div>
      </div>

      {/* Vista de Favoritos */}
      {view === 'favorites' && (
        <div className="favorites-list">
          {favorites.length === 0 ? (
            <div className="empty-state">
              <span className="empty-emoji">💔</span>
              <p>No tienes favoritos aún</p>
              <p>Comienza a marcar productos que te gusten</p>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map(fav => (
                <div key={fav.id} className="favorite-card">
                  {fav.image && (
                    <img 
                      src={fav.image} 
                      alt={fav.title}
                      className="favorite-image"
                      onClick={() => onViewProduct && onViewProduct(fav)}
                    />
                  )}
                  <div className="favorite-info">
                    <h4>{fav.title}</h4>
                    {fav.price && <p className="price">${fav.price}</p>}
                    <p className="added-date">
                      Agregado: {formatDate(fav.addedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vista de Historial */}
      {view === 'history' && (
        <div className="history-list">
          <div className="history-controls">
            <button onClick={clearHistory} className="clear-btn">
              <span className="clear-emoji">🗑️</span>
              Limpiar Historial
            </button>
          </div>
          
          {history.length === 0 ? (
            <div className="empty-state">
              <span className="empty-emoji">📝</span>
              <p>No hay historial disponible</p>
            </div>
          ) : (
            <div className="history-timeline">
              {history.slice(-20).reverse().map(entry => (
                <div key={entry.id} className={`history-entry ${entry.action}`}>
                  <div className="history-icon">
                    <span className="history-emoji">
                      {entry.action === 'liked' ? '❤️' : '💔'}
                    </span>
                  </div>
                  <div className="history-content">
                    <p>
                      <strong>{entry.action === 'liked' ? 'Agregó' : 'Quitó'}</strong> 
                      "{entry.productTitle}" {entry.action === 'liked' ? 'a' : 'de'} favoritos
                    </p>
                    <span className="history-time">{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vista de Estadísticas */}
      {view === 'stats' && (
        <div className="stats-view">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-emoji">📈</span>
              <h3>{stats.totalLikes || 0}</h3>
              <p>Total Likes</p>
            </div>
            <div className="stat-card">
              <span className="stat-emoji">❤️</span>
              <h3>{stats.uniqueProducts?.size || 0}</h3>
              <p>Productos Únicos</p>
            </div>
            <div className="stat-card">
              <span className="stat-emoji">📅</span>
              <h3>{stats.sessionsLiked?.length || 0}</h3>
              <p>Sesiones Activas</p>
            </div>
          </div>

          {stats.sessionsLiked && stats.sessionsLiked.length > 0 && (
            <div className="sessions-list">
              <h4>Actividad por Sesión</h4>
              {stats.sessionsLiked.slice(-10).map((session, index) => (
                <div key={index} className="session-item">
                  <span className="session-date">{session.date}</span>
                  <span className="session-stats">
                    {session.actions} acciones en {session.products} productos
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesManager;