// ProductCard.jsx - Versión corregida con debugging
import React from 'react';
import FavoritesButton from './FavoritesButton';
import AddToCartButton from './AddToCartButton';
import StarRating from './StarRating';

const ProductCard = ({ product, onViewDetails, userRating = 0, onQuickRating }) => {
  
  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Image clicked!', product);
    
    if (onViewDetails && typeof onViewDetails === 'function') {
      onViewDetails(product);
    }
  };

  const handleQuickRating = (rating) => {
    console.log('ProductCard - handleQuickRating called with:', rating);
    if (onQuickRating) {
      console.log('ProductCard - calling onQuickRating');
      onQuickRating(rating);
    } else {
      console.log('ProductCard - No onQuickRating function provided');
    }
  };

  console.log('ProductCard render:', { 
    productId: product.id, 
    userRating, 
    hasOnQuickRating: !!onQuickRating 
  });

  return (
    <div className="game-card-simple">
      <div className="image-container-simple">
        <img
          src={product.image}
          alt={product.title}
          className="product-image-clickable"
          onClick={handleImageClick}
          title="Click para ver detalles"
        />
        
        <div className="favorites-corner">
          <FavoritesButton productId={product.id} productTitle={product.title} />
        </div>
        
        {product.hasDiscount && (
          <div className="discount-badge">
            OFERTA
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        
        {/* Rating del producto (solo lectura) */}
        <div className="product-ratings">
          <div className="official-rating">
            <span className="rating-label-small">Calificación:</span>
            <StarRating 
              rating={product.rating} 
              reviews={product.reviews}
              isInteractive={false}
              size={14}
            />
          </div>
          
          {/* Rating rápido del usuario - AQUÍ ESTÁ EL PROBLEMA MÁS COMÚN */}
          <div className="quick-rating">
            <span className="rating-label-small">Tu voto:</span>
            <StarRating
              rating={userRating}
              isInteractive={true}
              onRatingChange={handleQuickRating}
              size={16}
              showReviews={false}
            />
            {userRating > 0 && (
              <span className="user-rating-indicator">✓</span>
            )}
          </div>
        </div>
        
        <div className="product-price">
          ${product.price}
          {product.hasDiscount && product.originalPrice && (
            <span className="original-price">
              ${product.originalPrice}
            </span>
          )}
        </div>
        
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;