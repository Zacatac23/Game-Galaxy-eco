import React, { useState } from 'react';
import { ArrowLeft } from '../icons';
import StarRating from '../components/StarRating';
import PriceDisplay from '../components/PriceDisplay';
import FavoritesButton from '../components/FavoritesButton';
import AddToCartButton from '../components/AddToCartButton';
import Recommendations from '../components/Recommendations';

const ProductDetailPage = ({ product, onBack, viewedProducts }) => {
  const [userRating, setUserRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!product) return null;

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
    <div className="game-detail-container fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-red-400 hover:text-red-300 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Volver a productos</span>
      </button>
      
      <div className="game-detail-grid">
        <div className="bounce-in">
          <img
            src={product.image}
            alt={product.title}
            className="game-detail-image"
          />
        </div>
        
        <div className="game-detail-info fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-start justify-between mb-4">
            <h1 className="game-detail-title">{product.title}</h1>
            <FavoritesButton productId={product.id} productTitle={product.title} />
          </div>
          
          {/* Rating actual del producto (no interactivo) */}
          <div className="game-rating mb-4">
            <div className="rating-section">
              <span className="rating-label">Calificación del juego:</span>
              <StarRating
                rating={product.rating}
                reviews={product.reviews}
                isInteractive={false}
                size={20}
              />
            </div>
          </div>

          {/* Rating del usuario (interactivo) */}
          <div className="user-rating-section mb-6">
            <div className="rating-section">
              <span className="rating-label">Tu calificación:</span>
              <StarRating
                rating={userRating}
                isInteractive={true}
                onRatingChange={handleUserRating}
                size={24}
                showReviews={false}
              />
              {userRating > 0 && (
                <span className="user-rating-text">
                  Has calificado este juego con {userRating} estrella{userRating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {/* Mensaje de agradecimiento */}
            {showThankYou && (
              <div className="thank-you-message">
                ¡Gracias por tu calificación! 🎉
              </div>
            )}
          </div>
          
          <div className="game-price mb-6">
            ${product.price}
            {product.hasDiscount && product.originalPrice && (
              <span className="text-lg opacity-60 line-through ml-3">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <p className="game-detail-description">{product.description}</p>
          
          <div className="mb-6">
            <span className="inline-block bg-red-600 bg-opacity-20 text-red-300 px-4 py-2 rounded-full text-sm border border-red-600 border-opacity-30">
              {product.category}
            </span>
          </div>
          
          <AddToCartButton product={product} />
        </div>
      </div>
      
      <Recommendations currentProductId={product.id} viewedProducts={viewedProducts} />
    </div>
  );
};

export default ProductDetailPage;