// FavoritesButton.jsx - Componente simplificado (máx 40 líneas)
import React from 'react';
import useFavorites from '../hooks/useFavorites';

const FavoritesButton = ({ productId, productTitle, productImage = null, productPrice = null }) => {
  const { isFavorite, showNotification, animationClass, handleFavoriteToggle, favoritesCount } = useFavorites(productId, productTitle, productImage, productPrice);

  return (
    <>
      <button
        onClick={handleFavoriteToggle}
        className={`favorites-btn ${isFavorite ? 'active' : ''} ${animationClass}`}
        title={isFavorite ? `Quitar "${productTitle}" de favoritos` : `Agregar "${productTitle}" a favoritos`}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <span className={`heart-emoji ${isFavorite ? 'filled' : 'empty'}`}>
          {isFavorite ? '❤️' : '🤍'}
        </span>
        
        {favoritesCount > 0 && (
          <span className="favorites-count">{favoritesCount}</span>
        )}
      </button>

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