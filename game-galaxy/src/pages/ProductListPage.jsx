// ProductListPage.jsx - Versión con historial de favoritos implementado
import React, { useState, useMemo, useEffect } from 'react';
import { GAMES_DATA } from '../data/gamesData';
import ProductCard from '../components/ProductCard';
import FavoritesHistory from '../components/FavoritesHistory';
import useFavoritesManager from '../hooks/useFavoritesManager';

const ProductListPage = ({ onViewDetails, searchTerm }) => {
  const [productRatings, setProductRatings] = useState({});
  const [currentView, setCurrentView] = useState('products'); // 'products' | 'history'
  
  // Hook para gestionar favoritos
  const {
    history,
    favorites,
    formatDate,
    clearHistory,
    getSummaryStats,
    getHistoryByAction,
    likeNotificationInfo
  } = useFavoritesManager();
  
  console.log('ProductListPage render - productRatings:', productRatings);

  // Filtrar juegos basado en búsqueda
  const filteredGames = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) {
      return GAMES_DATA;
    }

    const term = searchTerm.toLowerCase().trim();
    const filtered = GAMES_DATA.filter(game => {
      const matchTitle = game.title?.toLowerCase().includes(term);
      const matchCategory = game.category?.toLowerCase().includes(term);
      const matchDescription = game.description?.toLowerCase().includes(term);
      
      return matchTitle || matchCategory || matchDescription;
    });

    return filtered;
  }, [searchTerm]);

  // Función para manejar rating desde la lista
  const handleQuickRating = (productId, rating) => {
    console.log('ProductListPage - handleQuickRating called:', { productId, rating });
    
    setProductRatings(prev => {
      const newRatings = {
        ...prev,
        [productId]: rating
      };
      console.log('ProductListPage - Updated ratings:', newRatings);
      return newRatings;
    });
    
    console.log(`Rating rápido: Producto ${productId} calificado con ${rating} estrellas`);
  };

  // Obtener estadísticas resumidas para mostrar en el header
  const stats = useMemo(() => getSummaryStats(), [getSummaryStats]);

  return (
    <div className="home-container">
      {/* Header con navegación */}
      <div className="page-header">
        <div className="welcome-section bounce-in">
          <h2 className="welcome-title">Welcome to GAME GALAXY</h2>
          <p className="welcome-subtitle">Descubre los mejores videojuegos al mejor precio</p>
        </div>

        {/* Navegación de pestañas */}
        <div className="view-tabs">
          <button 
            className={`tab-button ${currentView === 'products' ? 'active' : ''}`}
            onClick={() => setCurrentView('products')}
          >
            🎮 Juegos ({GAMES_DATA.length})
          </button>
          <button 
            className={`tab-button ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            📊 Historial ({history.length})
          </button>
          <div className="favorites-indicator">
            💖 {favorites.length} favoritos
          </div>
        </div>
      </div>

      {/* Notificación de like reciente */}
      {likeNotificationInfo?.isRecent && (
        <div className="like-notification-banner">
          <div className="notification-content">
            <span className="notification-icon">💖</span>
            <span className="notification-text">
              ¡Te gustó "{likeNotificationInfo.productTitle}"!
            </span>
            <span className="notification-time">
              {likeNotificationInfo.formattedTime}
            </span>
          </div>
        </div>
      )}

      {/* Vista de productos */}
      {currentView === 'products' && (
        <>
          {/* Información de búsqueda */}
          {searchTerm && searchTerm.trim() && (
            <div className="search-results-info">
              <div className="search-info">
                <span className="search-term">Buscando: "{searchTerm}"</span>
                <span className="search-count">
                  {filteredGames.length} de {GAMES_DATA.length} juegos
                </span>
              </div>
              
              {filteredGames.length === 0 && (
                <div className="no-results">
                  <p>No se encontraron juegos que coincidan con tu búsqueda.</p>
                  <p>Intenta con términos como "Halo", "Cyberpunk", "RPG", "FPS".</p>
                </div>
              )}
            </div>
          )}
          
          <div className="games-grid">
            {filteredGames.map((product, index) => (
              <div 
                key={product.id} 
                className="fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={product}
                  onViewDetails={onViewDetails}
                  userRating={productRatings[product.id] || 0}
                  onQuickRating={(rating) => handleQuickRating(product.id, rating)}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Vista de historial */}
      {currentView === 'history' && (
        <div className="history-view">
          <FavoritesHistory
            history={history}
            formatDate={formatDate}
            onClearHistory={clearHistory}
            getSummaryStats={getSummaryStats}
            getHistoryByAction={getHistoryByAction}
          />
        </div>
      )}

      {/* Estadísticas flotantes (solo en vista de productos) */}
      {currentView === 'products' && stats.totalFavorites > 0 && (
        <div className="floating-stats">
          <div className="stats-summary">
            <div className="stat-pill">
              💖 {stats.totalFavorites}
            </div>
            <div className="stat-pill">
              📊 {stats.totalActions}
            </div>
            {stats.totalLikes > 0 && (
              <div className="stat-pill likes">
                👍 {stats.totalLikes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;