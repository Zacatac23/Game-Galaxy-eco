// components/Recommendations.jsx
import React from 'react';
import useRecommendations from '../hooks/useRecommendations';
import ProductCard from './ProductCard';

const Recommendations = ({ 
  currentProductId, 
  viewedProducts = [], 
  allGames = [] // ← Recibir todos los juegos
}) => {
  
  // Debug: verificar datos recibidos
  console.log('🎯 Recommendations component props:', {
    currentProductId,
    allGamesCount: allGames.length,
    viewedProductsCount: viewedProducts.length
  });

  // Usar el hook con todos los juegos
  const {
    recommendations,
    isLoading,
    error,
    userProfile,
    debugInfo,
    refreshRecommendations,
    hasEnoughData
  } = useRecommendations(allGames, 6);

  console.log('🎯 Recommendations hook result:', {
    recommendationsCount: recommendations.length,
    isLoading,
    error,
    hasEnoughData,
    debugInfo
  });

  // Filtrar el producto actual de las recomendaciones
  const filteredRecommendations = recommendations.filter(
    game => game.id !== currentProductId
  );

  // Si hay error, mostrar botón de reintentar
  if (error) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h2 className="recommendations-title">
            <span className="title-icon">💡</span>
            Recomendaciones para ti
          </h2>
        </div>
        <div className="recommendations-error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h3>Error al cargar recomendaciones</h3>
            <p>{error}</p>
            <button 
              onClick={refreshRecommendations}
              className="retry-button"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si está cargando
  if (isLoading) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h2 className="recommendations-title">
            <span className="title-icon">💡</span>
            Recomendaciones para ti
          </h2>
        </div>
        <div className="recommendations-loading">
          <div className="loading-spinner"></div>
          <p>Generando recomendaciones personalizadas...</p>
        </div>
      </div>
    );
  }

  // Si no hay suficientes datos
  if (!hasEnoughData) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h2 className="recommendations-title">
            <span className="title-icon">💡</span>
            Descubre juegos populares
          </h2>
          <p className="recommendations-subtitle">
            Agrega algunos juegos a favoritos para recibir recomendaciones personalizadas
          </p>
        </div>
        
        {/* Mostrar juegos populares como fallback */}
        {allGames.length > 0 && (
          <div className="recommendations-grid">
            {allGames
              .filter(game => game.id !== currentProductId && game.rating >= 4.0)
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map(game => (
                <div key={game.id} className="recommendation-item">
                  <ProductCard product={game} />
                  <div className="recommendation-reason">
                    <span className="reason-icon">⭐</span>
                    <span className="reason-text">Muy bien valorado</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  // Si no hay recomendaciones
  if (filteredRecommendations.length === 0) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h2 className="recommendations-title">
            <span className="title-icon">💡</span>
            Recomendaciones para ti
          </h2>
        </div>
        <div className="recommendations-empty">
          <div className="empty-icon">🎯</div>
          <div className="empty-content">
            <h3>No hay recomendaciones disponibles</h3>
            <p>Agrega más juegos a favoritos para mejorar nuestras sugerencias</p>
            <button 
              onClick={refreshRecommendations}
              className="refresh-button"
            >
              🔄 Actualizar recomendaciones
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      {/* Header */}
      <div className="recommendations-header">
        <h2 className="recommendations-title">
          <span className="title-icon">💡</span>
          Recomendaciones para ti
        </h2>
        {userProfile && (
          <p className="recommendations-subtitle">
            Basado en tus {userProfile.totalFavorites} juegos favoritos
          </p>
        )}
        <button 
          onClick={refreshRecommendations}
          className="refresh-recommendations-btn"
          title="Actualizar recomendaciones"
        >
          🔄
        </button>
      </div>

      {/* Grid de recomendaciones */}
      <div className="recommendations-grid">
        {filteredRecommendations.map((game, index) => (
          <div 
            key={game.id} 
            className="recommendation-item"
            style={{ 
              animationDelay: `${index * 0.1}s` 
            }}
          >
            <ProductCard product={game} />
            
            {/* Razones de la recomendación - MEJORADAS */}
            <div className="recommendation-reasons">
              {(game.reasons || []).slice(0, 3).map((reason, reasonIndex) => (
                <div key={reasonIndex} className="recommendation-reason">
                  <span className="reason-icon">
                    {reason.includes('Mismo género') ? '🎯' : 
                     reason.includes('Te gustan') ? '💖' : 
                     reason.includes('Muy bien valorado') ? '⭐' : 
                     reason.includes('Bien valorado') ? '👍' : 
                     reason.includes('Precio similar') ? '💰' : 
                     reason.includes('Muy popular') ? '🔥' : '✨'}
                  </span>
                  <span className="reason-text">{reason}</span>
                </div>
              ))}
              
              {/* Score de recomendación (solo para debug) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="recommendation-score">
                  Score: {Math.round(game.recommendationScore || 0)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer con información del perfil */}
      {userProfile && process.env.NODE_ENV === 'development' && (
        <div className="recommendations-debug">
          <details>
            <summary>Debug Info</summary>
            <pre>{JSON.stringify({
              userProfile,
              debugInfo,
              recommendationsCount: filteredRecommendations.length
            }, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default Recommendations;