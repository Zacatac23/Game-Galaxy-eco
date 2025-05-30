import React, { useState } from 'react';
import { ArrowLeft } from '../icons';
import StarRating from '../components/StarRating';
import PriceDisplay from '../components/PriceDisplay';
import FavoritesButton from '../components/FavoritesButton';
import AddToCartButton from '../components/AddToCartButton';
import Recommendations from '../components/Recommendations';

const ProductDetailPage = ({ 
  product, 
  onBack, 
  viewedProducts,
  allGames = [] // ← Agregar este prop para pasar todos los juegos
}) => {
  const [userRating, setUserRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!product) return null;

  // Debug: verificar datos recibidos
  console.log('ProductDetailPage props:', {
    productId: product.id,
    allGamesCount: allGames.length,
    viewedProductsCount: viewedProducts?.length || 0
  });

  // Función para manejar el cambio de rating del usuario
  const handleUserRating = (newRating) => {
    console.log('ProductDetailPage - handleUserRating called with:', newRating);
    setUserRating(newRating);
    console.log(`Usuario calificó ${product.title} con ${newRating} estrellas`);
    
    // Mostrar mensaje de agradecimiento
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  console.log('ProductDetailPage render:', { 
    productTitle: product.title, 
    userRating, 
    showThankYou 
  });

  return (
    <div className="product-detail-page fade-in">
      {/* Header con botón de regreso mejorado */}
      <div className="detail-header">
        <button
          onClick={onBack}
          className="back-button group"
        >
          <div className="back-icon-wrapper">
            <ArrowLeft size={20} />
          </div>
          <span className="back-text">Volver a productos</span>
        </button>
      </div>
      
      {/* Contenedor principal con mejor layout */}
      <div className="detail-container">
        {/* Sección de imagen mejorada */}
        <div className="image-section bounce-in">
          <div className="image-wrapper">
            <img
              src={product.image}
              alt={product.title}
              className="detail-image"
            />
            <div className="image-overlay">
              <div className="image-badges">
                {product.hasDiscount && (
                  <div className="discount-badge-large">
                    <span className="discount-text">OFERTA</span>
                    <span className="discount-percentage">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección de información mejorada */}
        <div className="info-section fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Header del producto */}
          <div className="product-header">
            <div className="title-section">
              <h1 className="product-title">{product.title}</h1>
              <div className="category-badge">
                <span className="category-icon">🎮</span>
                <span className="category-text">{product.category}</span>
              </div>
            </div>
            <div className="favorite-section">
              <FavoritesButton 
                productId={product.id} 
                productTitle={product.title}
                productImage={product.image}
                productPrice={product.price}
              />
            </div>
          </div>
          
          {/* Sección de ratings mejorada */}
          <div className="ratings-container">
            {/* Rating oficial */}
            <div className="official-rating-card">
              <div className="rating-header">
                <span className="rating-icon">⭐</span>
                <span className="rating-label">Calificación oficial</span>
              </div>
              <div className="rating-content">
                <StarRating
                  rating={product.rating}
                  reviews={product.reviews}
                  isInteractive={false}
                  size={20}
                />
              </div>
            </div>

            {/* Rating del usuario */}
            <div className="user-rating-card">
              <div className="rating-header">
                <span className="rating-icon">👤</span>
                <span className="rating-label">Tu calificación</span>
              </div>
              <div className="rating-content">
                <StarRating
                  rating={userRating}
                  isInteractive={true}
                  onRatingChange={handleUserRating}
                  size={24}
                  showReviews={false}
                />
                {userRating > 0 && (
                  <div className="user-rating-feedback">
                    <span className="feedback-icon">✨</span>
                    <span className="feedback-text">
                      Has calificado este juego con {userRating} estrella{userRating !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Mensaje de agradecimiento mejorado */}
              {showThankYou && (
                <div className="thank-you-card">
                  <div className="thank-you-icon">🎉</div>
                  <div className="thank-you-content">
                    <h4>¡Gracias por tu calificación!</h4>
                    <p>Tu opinión nos ayuda a mejorar</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sección de precio mejorada */}
          <div className="price-section">
            <div className="price-container">
              <div className="current-price">
                <span className="currency">$</span>
                <span className="amount">{product.price}</span>
              </div>
              {product.hasDiscount && product.originalPrice && (
                <div className="price-comparison">
                  <span className="original-price">
                    <span className="original-label">Antes:</span>
                    <span className="original-amount">${product.originalPrice}</span>
                  </span>
                  <div className="savings">
                    <span className="savings-icon">💰</span>
                    <span className="savings-text">
                      Ahorras ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Descripción mejorada */}
          <div className="description-section">
            <h3 className="description-title">
              <span className="description-icon">📖</span>
              Descripción del juego
            </h3>
            <div className="description-content">
              <p className="description-text">{product.description}</p>
            </div>
          </div>
          
          {/* Sección de acción mejorada */}
          <div className="action-section">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
      
      {/* Recomendaciones - PASANDO TODOS LOS JUEGOS */}
      <div className="recommendations-section">
        <Recommendations 
          currentProductId={product.id} 
          viewedProducts={viewedProducts}
          allGames={allGames} 
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;